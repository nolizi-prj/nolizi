/**
 * First-run bootstrap.
 *
 * The guard is the whole point: an invite that appears only while there are no
 * accounts is a way in; one that keeps appearing is a back door.
 */

import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import EmbeddedPostgres from 'embedded-postgres';
import { migrate } from '../src/db.ts';
import { createPostgresDriver, type Database } from '../src/driver.ts';
import { bootstrapInvite, createInvite } from '../src/bootstrap.ts';
import { redeemInvite } from '../src/identity.ts';

const PORT = 55436;
let pg: EmbeddedPostgres;
let db: Database;

before(async () => {
  pg = new EmbeddedPostgres({
    databaseDir: '/tmp/pumasi-pg-bootstrap', user: 'pumasi', password: 'pumasi',
    port: PORT, persistent: false,
  });
  await pg.initialise();
  await pg.start();
  db = await createPostgresDriver(`postgres://pumasi:pumasi@localhost:${PORT}/postgres`);
  await migrate(db);
});
after(async () => { await db?.close(); await pg?.stop(); });

beforeEach(async () => {
  await db.query(`TRUNCATE sessions, invites, schedules, owners RESTART IDENTITY CASCADE`);
});

test('a first invite is issued when the service has no accounts', async () => {
  const r = await bootstrapInvite(db);
  assert.equal(r.created, true);
  assert.ok(r.code.length > 8, 'and it is not guessable');
});

test('it does not mint a second invite while the first is unused', async () => {
  const first = await bootstrapInvite(db);
  const again = await bootstrapInvite(db);
  assert.equal(again.created, false);
  assert.equal(again.code, first.code, 'the same unused invite is offered again');
  const { rows } = await db.query(`SELECT count(*)::int AS c FROM invites`);
  assert.equal(Number(rows[0]?.['c']), 1);
});

test('it goes silent the moment an account exists — this is the guard', async () => {
  const boot = await bootstrapInvite(db);
  const owner = await redeemInvite(
    db, db,
    { code: boot.code, email: 'first@example.invalid', displayName: 'First', timezone: 'UTC' },
    10,
  );
  assert.ok(owner.ok);

  const after = await bootstrapInvite(db);
  assert.equal(after.created, false);
  assert.equal(after.reason, 'owners_exist');
  assert.equal(after.code, '', 'nothing is handed out once anyone has signed up');

  // Not even with an explicit request. A back door that honours configuration
  // is still a back door.
  const forced = await bootstrapInvite(db, 'LET-ME-IN');
  assert.equal(forced.created, false);
  assert.equal(forced.reason, 'owners_exist');
  const { rows } = await db.query(`SELECT count(*)::int AS c FROM invites WHERE code = 'LET-ME-IN'`);
  assert.equal(Number(rows[0]?.['c']), 0, 'and no such invite was created');
});

test('an operator can still mint invites deliberately, once running', async () => {
  const boot = await bootstrapInvite(db);
  await redeemInvite(db, db, { code: boot.code, email: 'a@example.invalid', displayName: 'A', timezone: 'UTC' }, 10);

  const code = await createInvite(db, 'FOR-BOB');
  assert.equal(code, 'FOR-BOB');
  const second = await redeemInvite(db, db, { code, email: 'bob@example.invalid', displayName: 'Bob', timezone: 'UTC' }, 10);
  assert.equal(second.ok, true, 'a deliberately minted invite works normally');
});

test('a requested bootstrap code is honoured when the service is empty', async () => {
  const r = await bootstrapInvite(db, 'MY-CODE');
  assert.equal(r.code, 'MY-CODE');
  assert.equal(r.created, true);
});
