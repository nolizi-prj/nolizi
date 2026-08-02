/**
 * SPEC-0002 §3 — the HTTP surfaces.
 *
 * Routing and I/O only. Every availability question goes to the engine and
 * every exclusivity question goes to the database; neither is decided here.
 */

import { randomBytes, randomUUID } from 'node:crypto';
import { Temporal } from '@js-temporal/polyfill';
import { PostgresBookingStore, type SqlClient } from './store.ts';
import { availableSlots, findScheduleBySlug, type Schedule } from './schedules.ts';
import { bookingPage, confirmedPage, errorPage, managePage } from './pages.ts';
import { RATE_LIMITS, type Config } from './config.ts';
import type { MailPort } from './mail.ts';

export interface Reply {
  status: number;
  headers: Record<string, string>;
  body: string;
}

const html = (status: number, body: string): Reply => ({
  status,
  headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  body,
});
const json = (status: number, body: unknown): Reply => ({
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  body: JSON.stringify(body),
});

/** L1 · At least 128 bits from a CSPRNG. Not a booking id, not a sequence. */
export const newToken = (): string => randomBytes(32).toString('base64url');

export interface AppDeps {
  sql: SqlClient;
  config: Config;
  mail: MailPort;
  /** Injected so tests control it and the service never reads an ambient clock. */
  now: () => string;
  ready: () => boolean;
}

/** I6 · Per-IP and per-schedule limits, counted in the database. */
async function overLimit(
  sql: SqlClient,
  bucket: string,
  limit: number,
  windowSeconds: number,
  nowIso: string,
): Promise<boolean> {
  const cutoff = Temporal.Instant.from(nowIso).subtract({ seconds: windowSeconds }).toString();
  await sql.query(`DELETE FROM rate_events WHERE seen_at < $1`, [
    Temporal.Instant.from(nowIso).subtract({ hours: 2 }).toString(),
  ]);
  const { rows } = await sql.query(
    `SELECT count(*)::int AS c FROM rate_events WHERE bucket = $1 AND seen_at >= $2`,
    [bucket, cutoff],
  );
  if (Number(rows[0]?.['c'] ?? 0) >= limit) return true;
  await sql.query(`INSERT INTO rate_events (bucket, seen_at) VALUES ($1, $2)`, [bucket, nowIso]);
  return false;
}

/**
 * The engine's `BookingStore` is synchronous because the engine is a pure
 * contract; this store is async. Rather than fabricate a store that always
 * answers "ok" — which would make the engine call decorative while reading as
 * though it decided something — the two decisions the engine actually owns are
 * applied directly and named:
 *
 *   B3/B7 · revalidation against the commit-time clock, below.
 *   B1/B5.1 · replay reports the booking's state now, below.
 *
 * Everything else — exclusivity, atomicity — is the database's, enforced by
 * constraints rather than by any check in this file.
 *
 * An earlier version of this file passed a fabricated store to the engine and
 * carried a comment saying "the engine decides; the store enforces". The engine
 * decided nothing: the fabricated store always returned ok and the real insert
 * used a different booking id. Adversarial review caught the comment being
 * false, which is worse than the code being wrong.
 */
function noticeExpired(startIso: string, nowIso: string, noticeMinutes: number): boolean {
  return (
    Temporal.Instant.compare(
      Temporal.Instant.from(startIso),
      Temporal.Instant.from(nowIso).add({ minutes: noticeMinutes }),
    ) < 0
  );
}

export async function handle(
  deps: AppDeps,
  req: { method: string; path: string; ip: string; form?: Record<string, string> },
): Promise<Reply> {
  const { sql, config, mail } = deps;
  const now = deps.now();
  const parts = req.path.split('/').filter(Boolean);

  // O3 · health means the process is up; readiness means it can actually serve.
  if (req.path === '/healthz') return json(200, { status: 'ok', commit: config.commit });
  if (req.path === '/readyz') {
    if (!deps.ready()) return json(503, { status: 'not_ready', reason: 'migrations incomplete' });
    try {
      await sql.query('SELECT 1');
    } catch {
      return json(503, { status: 'not_ready', reason: 'database unreachable' });
    }
    // O4 · report the versions actually in use.
    return json(200, {
      status: 'ready',
      commit: config.commit,
      tzdata: (process.versions as { tz?: string }).tz ?? 'unknown',
    });
  }

  // ── manage a booking by bearer token (L1, L2) ────────────────────────────
  if (parts[0] === 'b' && parts[1]) {
    const token = parts[1];
    if (await overLimit(sql, `mgmt:${req.ip}`, RATE_LIMITS.management_lookups_per_ip_per_minute, 60, now)) {
      return html(429, errorPage(429, 'Too many requests. Try again shortly.'));
    }
    const { rows } = await sql.query(
      `SELECT b.booking_id, b.starts_at, b.status, s.title
         FROM bookings b LEFT JOIN schedules s ON s.schedule_id = b.schedule_id
        WHERE b.token = $1 ORDER BY (b.status='confirmed') DESC, b.id DESC LIMIT 1`,
      [token],
    );
    const r = rows[0];
    // L2 · reveals nothing about any other booking, including whether one exists.
    if (!r) return html(404, errorPage(404, 'This link is not valid.'));

    const bookingId = String(r['booking_id']);
    const startIso = new Date(String(r['starts_at'])).toISOString().replace('.000Z', 'Z');
    const title = String(r['title'] ?? 'Booking');

    if (req.method === 'GET') {
      return html(200, managePage({ title, start: startIso, token, status: String(r['status']) }));
    }
    if (req.method === 'POST' && parts[2] === 'cancel') {
      const store = new PostgresBookingStore(sql, 'unused');
      const existing = await store.findById(bookingId);
      // B5 · cancelling is idempotent and total; re-cancelling is `cancelled`.
      if (existing?.status === 'confirmed') {
        await store.cancel(bookingId, `cancel:${token}`);
        await mail.send({ kind: 'cancelled', to: 'owner', bookingId, start: startIso });
      }
      return html(200, managePage({ title, start: startIso, token, status: 'cancelled' }));
    }
    // D8 · a bearer link may cancel, but deleting personal data needs a
    // confirmation from that same link — a forwarded email must not destroy a
    // record in one click.
    if (req.method === 'POST' && parts[2] === 'delete') {
      if (req.form?.['confirm'] !== 'yes') {
        return html(400, errorPage(400, 'Deletion needs the confirmation box ticked.'));
      }
      await sql.query(
        `UPDATE bookings SET status='cancelled', booker_name=NULL, booker_email=NULL, booker_tz=NULL
          WHERE booking_id = $1`,
        [bookingId],
      );
      return html(200, errorPage(200, 'Your booking is cancelled and your details are deleted.'));
    }
    return html(405, errorPage(405, 'Method not allowed.'));
  }

  // ── the public booking page ──────────────────────────────────────────────
  const slug = parts[0];
  if (!slug) return html(404, errorPage(404, 'Nothing here.'));

  const schedule = await findScheduleBySlug(sql, slug);
  if (!schedule) return html(404, errorPage(404, 'No such booking page.'));

  if (req.method === 'GET' && parts.length === 1) {
    if (await overLimit(sql, `view:${req.ip}`, RATE_LIMITS.page_views_per_ip_per_minute, 60, now)) {
      return html(429, errorPage(429, 'Too many requests. Try again shortly.'));
    }
    const slots = await slotsFor(deps, schedule, now);
    return html(200, bookingPage(schedule, slots.slots));
  }

  if (req.method === 'POST' && parts[1] === 'book') {
    return bookHandler(deps, schedule, req, now);
  }

  return html(404, errorPage(404, 'Nothing here.'));
}

async function slotsFor(deps: AppDeps, schedule: Schedule, now: string) {
  const from = Temporal.Instant.from(now).toString();
  const to = Temporal.Instant.from(now).add({ hours: 24 * 14 }).toString();
  return availableSlots(deps.sql, schedule, { from, to, now });
}

async function bookHandler(
  deps: AppDeps,
  schedule: Schedule,
  req: { ip: string; form?: Record<string, string> },
  now: string,
): Promise<Reply> {
  const { sql, config, mail } = deps;
  const form = req.form ?? {};

  if (await overLimit(sql, `book:${req.ip}`, RATE_LIMITS.booking_attempts_per_ip_per_minute, 60, now)) {
    return html(429, errorPage(429, 'Too many booking attempts. Try again shortly.'));
  }
  if (await overLimit(sql, `sched:${schedule.schedule_id}`, RATE_LIMITS.bookings_per_schedule_per_hour, 3600, now)) {
    return html(429, errorPage(429, 'This page has taken too many bookings recently.'));
  }

  const start = form['start'];
  const end = form['end'];
  // F3 · name and email, and nothing else. Any other field is discarded here
  // rather than stored and justified later.
  const name = (form['name'] ?? '').trim();
  const email = (form['email'] ?? '').trim();
  const bookerTz = (form['booker_tz'] ?? 'UTC').trim();

  if (!start || !end || !name || !email) {
    const slots = await slotsFor(deps, schedule, now);
    return html(400, bookingPage(schedule, slots.slots, { error: 'Pick a time and give a name and email.' }));
  }

  // D1 · the ceiling is enforced, not intended.
  const { rows: countRows } = await sql.query(
    `SELECT count(*)::int AS c FROM bookings WHERE status = 'confirmed'`,
  );
  if (Number(countRows[0]?.['c'] ?? 0) >= config.maxBookingsRetained) {
    return html(
      503,
      errorPage(503, 'This service has reached its booking limit and is not accepting more.'),
    );
  }

  const store = new PostgresBookingStore(sql, schedule.owner_id);
  const idempotencyKey = form['idempotency_key'] ?? `${schedule.slug}:${start}:${email}`;

  // B1 / B5.1 — a replay reports the booking's state now.
  //
  // It does NOT disclose the management token. The default key is derived from
  // the slug, the start and the email, all of which an attacker can guess or
  // already knows — returning the token here would hand out a bearer credential
  // that cancels and deletes someone else's booking to anyone who guesses an
  // email address. Found in adversarial review. The token reaches exactly one
  // place: the confirmation mail.
  const replayed = await store.findByIdempotencyKey(idempotencyKey);
  if (replayed) {
    return html(
      200,
      errorPage(200, 'This time is already booked under that email. The confirmation message has the link to change or cancel it.'),
    );
  }

  // B3 · revalidate at commit, against the commit-time clock, with the
  // constraint the slot was computed under. Omitting it would revalidate
  // against nothing and confirm a slot that should have expired.
  if (noticeExpired(start, now, schedule.minimum_notice_minutes)) {
    const slots = await slotsFor(deps, schedule, now);
    return html(409, bookingPage(schedule, slots.slots, { error: 'That time has passed. Pick another.' }));
  }

  // F4 · the page is a snapshot. Losing the race is normal operation.
  const bookingId = randomUUID();
  const token = newToken();
  const inserted = await store.insertConfirmed(bookingId, start, end, idempotencyKey, {
    name,
    email,
    timezone: bookerTz,
    token,
  });
  if (!inserted.ok) {
    const slots = await slotsFor(deps, schedule, now);
    return html(409, bookingPage(schedule, slots.slots, { error: 'Someone just took that time. Here are the rest.' }));
  }
  await sql.query(`UPDATE bookings SET schedule_id = $1 WHERE booking_id = $2`, [
    schedule.schedule_id,
    bookingId,
  ]);

  // M2 · after commit, never inside the transaction. M3 · a failure here must
  // not invalidate a confirmed booking.
  await mail.send({ kind: 'confirmed', to: email, bookingId, start, token, timezone: bookerTz });
  await mail.send({ kind: 'confirmed', to: 'owner', bookingId, start, token });

  return html(200, confirmedPage({ title: schedule.title, start, manageUrl: `/b/${token}` }));
}
