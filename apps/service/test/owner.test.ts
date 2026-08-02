/**
 * SPEC-0002 I2, I4 — the owner surfaces over HTTP.
 *
 * I4's claim is that scoping happens AT THE QUERY rather than by hiding
 * controls, so the tests reach for another owner's resources by direct
 * identifier rather than by looking for a button.
 */

import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import EmbeddedPostgres from 'embedded-postgres';
import { migrate } from '../src/db.ts';
import { createPostgresDriver, type Database } from '../src/driver.ts';
import { handle, type AppDeps } from '../src/app.ts';
import { loadConfig } from '../src/config.ts';
import { RecordingMail, RetryingMail } from '../src/mail.ts';

const PORT = 55435;
let pg: EmbeddedPostgres;
let db: Database;
let mail: RecordingMail;
let deps: AppDeps;
const NOW = '2026-06-01T08:00:00Z';

before(async () => {
  pg = new EmbeddedPostgres({
    databaseDir: '/tmp/pumasi-pg-owner', user: 'pumasi', password: 'pumasi',
    port: PORT, persistent: false,
  });
  await pg.initialise();
  await pg.start();
  db = await createPostgresDriver(`postgres://pumasi:pumasi@localhost:${PORT}/postgres`);
  await migrate(db);
});
after(async () => { await db?.close(); await pg?.stop(); });

beforeEach(async () => {
  await db.query(`TRUNCATE sign_in_tokens, sessions, invites, bookings, availability_rules, schedules, owners RESTART IDENTITY CASCADE`);
  await db.query(`DELETE FROM rate_events`);
  mail = new RecordingMail();
  deps = {
    sql: db, tx: db,
    config: loadConfig({} as NodeJS.ProcessEnv),
    mail: new RetryingMail(mail),
    now: () => NOW,
    ready: () => true,
  };
});

const call = (method: string, path: string, opts: Partial<{ form: Record<string,string>; cookie: string; query: Record<string,string>; ip: string }> = {}) =>
  handle(deps, { method, path, ip: opts.ip ?? '1.1.1.1', form: opts.form, cookie: opts.cookie, query: opts.query });

const cookieOf = (r: { headers: Record<string, string> }) =>
  (r.headers['set-cookie'] ?? '').split(';')[0]!;

async function makeOwner(code: string, email: string): Promise<string> {
  await db.query(`INSERT INTO invites (code) VALUES ($1)`, [code]);
  const r = await call('POST', '/signup', {
    form: { invite: code, email, display_name: email.split('@')[0]!, timezone: 'America/New_York' },
  });
  assert.equal(r.status, 303, 'signup should redirect into the app');
  return cookieOf(r);
}

test('I2 signup needs an invite, and a bad one creates nothing', async () => {
  const r = await call('POST', '/signup', {
    form: { invite: 'NOPE', email: 'x@example.invalid', display_name: 'X', timezone: 'UTC' },
  });
  assert.equal(r.status, 400);
  assert.ok(r.body.includes('not valid'));
  const c = await db.query(`SELECT count(*)::int AS c FROM owners`);
  assert.equal(Number(c.rows[0]?.['c']), 0);
});

test('signup with a valid invite signs you in', async () => {
  const cookie = await makeOwner('INV-1', 'ada@example.invalid');
  assert.ok(cookie.startsWith('pumasi_session='));
  const app = await call('GET', '/app', { cookie });
  assert.equal(app.status, 200);
  assert.ok(app.body.includes('Your schedules'));
});

test('the app redirects an unauthenticated visitor to sign in', async () => {
  const r = await call('GET', '/app');
  assert.equal(r.status, 303);
  assert.equal(r.headers['location'], '/login');
});

test('login mails a link that signs you in once', async () => {
  await makeOwner('INV-1', 'grace@example.invalid');
  const sent = await call('POST', '/login', { form: { email: 'grace@example.invalid' } });
  assert.equal(sent.status, 200);

  const link = mail.sent.find((m) => m.kind === 'signin');
  assert.ok(link?.token, 'a sign-in token is mailed');

  const first = await call('GET', `/auth/${link.token}`);
  assert.equal(first.status, 303);
  const app = await call('GET', '/app', { cookie: cookieOf(first) });
  assert.equal(app.status, 200);

  const second = await call('GET', `/auth/${link.token}`);
  assert.equal(second.status, 400, 'a sign-in link works exactly once');
});

test('login does not reveal whether an address has an account', async () => {
  await makeOwner('INV-1', 'known@example.invalid');
  const known = await call('POST', '/login', { form: { email: 'known@example.invalid' } });
  const unknown = await call('POST', '/login', { form: { email: 'nobody@example.invalid' }, ip: '2.2.2.2' });
  assert.equal(known.status, unknown.status);
  assert.equal(known.body, unknown.body, 'identical responses either way');
  assert.equal(mail.sent.filter((m) => m.kind === 'signin').length, 1, 'and only one mail was sent');
});

test('logout invalidates the session server-side', async () => {
  const cookie = await makeOwner('INV-1', 'hopper@example.invalid');
  assert.equal((await call('GET', '/app', { cookie })).status, 200);
  await call('POST', '/logout', { cookie });
  const after = await call('GET', '/app', { cookie });
  assert.equal(after.status, 303, 'the same cookie no longer authenticates');
});

test('an owner can create a booking page and set availability', async () => {
  const cookie = await makeOwner('INV-1', 'ada@example.invalid');
  const created = await call('POST', '/app/schedules', {
    cookie, form: { title: 'Intro call', slug: 'intro', duration_minutes: '60' },
  });
  assert.equal(created.status, 303);

  const { rows } = await db.query(`SELECT schedule_id FROM schedules WHERE slug = 'intro'`);
  const id = String(rows[0]?.['schedule_id']);

  const saved = await call('POST', `/app/schedules/${id}/availability`, {
    cookie, form: { MO_start: '09:00', MO_end: '12:00', TU_start: '', TU_end: '' },
  });
  assert.equal(saved.status, 303);

  const rules = await db.query(`SELECT weekday, starts_local FROM availability_rules WHERE schedule_id = $1`, [id]);
  assert.equal(rules.rows.length, 1, 'a blank day stores nothing');
  assert.equal(rules.rows[0]?.['weekday'], 'MO');

  // And it is really live: the public page now offers those slots.
  const page = await call('GET', '/intro');
  assert.equal(page.status, 200);
  assert.ok(page.body.includes('data-start='), 'the booking page shows real times');
});

test('I4 one owner cannot read or write another owner’s schedule', async () => {
  const a = await makeOwner('INV-A', 'a@example.invalid');
  const b = await makeOwner('INV-B', 'b@example.invalid');

  await call('POST', '/app/schedules', { cookie: b, form: { title: 'B private', slug: 'bpriv', duration_minutes: '30' } });
  const { rows } = await db.query(`SELECT schedule_id FROM schedules WHERE slug = 'bpriv'`);
  const bId = String(rows[0]?.['schedule_id']);

  // A's dashboard must not mention B's page at all.
  const aHome = await call('GET', '/app', { cookie: a });
  assert.ok(!aHome.body.includes('bpriv'), 'A must not see B’s booking page');
  assert.ok(!aHome.body.includes(bId));

  // And reaching for it by direct identifier is refused at the query.
  const write = await call('POST', `/app/schedules/${bId}/availability`, {
    cookie: a, form: { MO_start: '00:00', MO_end: '23:59' },
  });
  assert.equal(write.status, 404, 'not "forbidden" — A learns nothing about whether it exists');

  const rules = await db.query(`SELECT count(*)::int AS c FROM availability_rules WHERE schedule_id = $1`, [bId]);
  assert.equal(Number(rules.rows[0]?.['c']), 0, 'and nothing was written');
});

test('a duplicate booking link is refused', async () => {
  const a = await makeOwner('INV-A', 'a@example.invalid');
  const b = await makeOwner('INV-B', 'b@example.invalid');
  await call('POST', '/app/schedules', { cookie: a, form: { title: 'One', slug: 'taken', duration_minutes: '30' } });
  const clash = await call('POST', '/app/schedules', { cookie: b, form: { title: 'Two', slug: 'taken', duration_minutes: '30' } });
  assert.equal(clash.status, 409);
});
