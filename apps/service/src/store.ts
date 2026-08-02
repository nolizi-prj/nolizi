/**
 * SPEC-0002 P1, P2a, P2c — the PostgreSQL booking store.
 *
 * This implements the `BookingStore` contract from the engine. The engine says
 * WHAT must be true of a booking; this says HOW, and the how is the whole point:
 * exclusivity under concurrency is a property of the store, and an in-process
 * check would be a time-of-check-to-time-of-use race.
 *
 * Every guarantee here is enforced by a constraint in migrations/001_bookings.sql,
 * caught as an integrity error, and translated to `conflict`. None of it is
 * enforced by reading rows and deciding.
 */

import type { BookingRecord, BookingStore } from '@pumasi/scheduling-core';

/** The minimum surface a driver must offer. `pg` and PGlite both satisfy it. */
export interface SqlClient {
  query(sql: string, params?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
  /**
   * Run a multi-statement script. Separate from `query` because a parameterised
   * statement can only carry one command — migrations need the other mode.
   */
  exec(sql: string): Promise<void>;
}

/** PostgreSQL SQLSTATE codes we translate rather than propagate. */
const UNIQUE_VIOLATION = '23505';
const EXCLUSION_VIOLATION = '23P01';

function isConflict(err: unknown): boolean {
  const code = (err as { code?: string })?.code;
  if (code === UNIQUE_VIOLATION || code === EXCLUSION_VIOLATION) return true;
  // PGlite surfaces the SQLSTATE in the message rather than a `code` field.
  const message = (err as Error)?.message ?? '';
  return (
    message.includes('violates exclusion constraint') ||
    message.includes('violates unique constraint')
  );
}

const iso = (v: unknown): string =>
  v instanceof Date ? v.toISOString().replace('.000Z', 'Z') : String(v);

function toRecord(row: Record<string, unknown>): BookingRecord {
  return {
    booking_id: String(row['booking_id']),
    start: iso(row['starts_at']),
    end: iso(row['ends_at']),
    status: row['status'] === 'cancelled' ? 'cancelled' : 'confirmed',
  };
}

/**
 * An async store. The engine's `BookingStore` is synchronous by design — it is
 * a pure contract — so the service calls these directly rather than through it.
 */
export class PostgresBookingStore {
  constructor(
    private readonly sql: SqlClient,
    private readonly ownerId: string,
    /**
     * Serialises whole transactions. Required when the client is a single
     * connection, because BEGIN/COMMIT issued as separate statements from
     * concurrent callers interleave on that one session and stop being
     * request-scoped. A pooled driver supplies a no-op.
     */
    private readonly tx: { run<T>(fn: () => Promise<T>): Promise<T> } = {
      run: (fn) => fn(),
    },
  ) {}

  async findByIdempotencyKey(key: string): Promise<BookingRecord | undefined> {
    const { rows } = await this.sql.query(
      `SELECT b.booking_id, b.starts_at, b.ends_at, b.status
         FROM idempotency_keys k
         JOIN bookings b ON b.booking_id = k.booking_id
        WHERE k.key = $1
        ORDER BY b.id DESC
        LIMIT 1`,
      [key],
    );
    return rows[0] ? toRecord(rows[0]) : undefined;
  }

  async findById(bookingId: string): Promise<BookingRecord | undefined> {
    const { rows } = await this.sql.query(
      `SELECT booking_id, starts_at, ends_at, status
         FROM bookings
        WHERE booking_id = $1
        ORDER BY (status = 'confirmed') DESC, id DESC
        LIMIT 1`,
      [bookingId],
    );
    return rows[0] ? toRecord(rows[0]) : undefined;
  }

  /**
   * P1a — insert, and let the exclusion constraint decide. There is deliberately
   * no SELECT-then-INSERT here: that pattern passes every non-concurrent test
   * and loses races in production.
   */
  async insertConfirmed(
    bookingId: string,
    start: string,
    end: string,
    key: string,
    booker?: { name: string; email: string; timezone: string; token: string },
  ): Promise<{ ok: true } | { ok: false; reason: 'conflict' }> {
    return this.tx.run(async () => {
    try {
      await this.sql.query('BEGIN');
      await this.sql.query(
        `INSERT INTO bookings
           (booking_id, owner_id, starts_at, ends_at, status, booker_name, booker_email, booker_tz, token)
         VALUES ($1, $2, $3, $4, 'confirmed', $5, $6, $7, $8)`,
        [
          bookingId,
          this.ownerId,
          start,
          end,
          booker?.name ?? null,
          booker?.email ?? null,
          booker?.timezone ?? null,
          booker?.token ?? null,
        ],
      );
      // B1 — first use of a key wins. ON CONFLICT DO NOTHING rather than an
      // upsert: rebinding would make a later replay report a different booking.
      await this.sql.query(
        `INSERT INTO idempotency_keys (key, booking_id) VALUES ($1, $2)
           ON CONFLICT (key) DO NOTHING`,
        [key, bookingId],
      );
      await this.sql.query('COMMIT');
      return { ok: true };
    } catch (err) {
      await this.sql.query('ROLLBACK').catch(() => undefined);
      if (isConflict(err)) return { ok: false, reason: 'conflict' };
      throw err;
    }
    });
  }

  /** B5 — cancelling releases the interval immediately. */
  async cancel(bookingId: string, key: string): Promise<void> {
    return this.tx.run(async () => {
    await this.sql.query('BEGIN');
    try {
      await this.sql.query(
        `UPDATE bookings SET status = 'cancelled'
          WHERE booking_id = $1 AND status = 'confirmed'`,
        [bookingId],
      );
      await this.sql.query(
        `INSERT INTO idempotency_keys (key, booking_id) VALUES ($1, $2)
           ON CONFLICT (key) DO NOTHING`,
        [key, bookingId],
      );
      await this.sql.query('COMMIT');
    } catch (err) {
      await this.sql.query('ROLLBACK').catch(() => undefined);
      throw err;
    }
    });
  }

  /**
   * P2a — a reschedule is ONE transaction, and P2c — two reschedules of the
   * same booking are serialised by locking the row we are about to demote.
   *
   * The order matters. Demote first, then insert: inserting first would hold
   * two confirmed rows momentarily, which P1b forbids outright — and if P1b
   * were missing, that state would be invisible to P1a because the two
   * intervals do not overlap. That is the bug this ordering and that index
   * exist to make impossible.
   */
  async move(
    bookingId: string,
    newStart: string,
    newEnd: string,
    key: string,
  ): Promise<{ ok: true } | { ok: false; reason: 'conflict' }> {
    return this.tx.run(async () => {
    try {
      await this.sql.query('BEGIN');

      // P2c — take the row lock before reading, so a concurrent reschedule of
      // this booking waits here rather than racing us.
      const { rows } = await this.sql.query(
        `SELECT id, booking_id FROM bookings
          WHERE booking_id = $1 AND status = 'confirmed'
          FOR UPDATE`,
        [bookingId],
      );
      if (!rows[0]) {
        await this.sql.query('ROLLBACK');
        return { ok: false, reason: 'conflict' };
      }

      await this.sql.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [
        rows[0]['id'],
      ]);
      await this.sql.query(
        `INSERT INTO bookings (booking_id, owner_id, starts_at, ends_at, status,
                               booker_name, booker_email, booker_tz, token)
         SELECT $1, owner_id, $2::timestamptz, $3::timestamptz, 'confirmed',
                booker_name, booker_email, booker_tz, token
           FROM bookings WHERE id = $4`,
        [bookingId, newStart, newEnd, rows[0]['id']],
      );
      await this.sql.query(
        `INSERT INTO idempotency_keys (key, booking_id) VALUES ($1, $2)
           ON CONFLICT (key) DO NOTHING`,
        [key, bookingId],
      );
      await this.sql.query('COMMIT');
      return { ok: true };
    } catch (err) {
      await this.sql.query('ROLLBACK').catch(() => undefined);
      if (isConflict(err)) return { ok: false, reason: 'conflict' };
      throw err;
    }
    });
  }

  /** Every confirmed booking for this owner, for assertions and for `busy`. */
  async confirmed(): Promise<BookingRecord[]> {
    const { rows } = await this.sql.query(
      `SELECT booking_id, starts_at, ends_at, status FROM bookings
        WHERE owner_id = $1 AND status = 'confirmed' ORDER BY starts_at`,
      [this.ownerId],
    );
    return rows.map(toRecord);
  }

  /** Rows of every status, so history survives a cancel or a move (P4). */
  async history(bookingId: string): Promise<BookingRecord[]> {
    const { rows } = await this.sql.query(
      `SELECT booking_id, starts_at, ends_at, status FROM bookings
        WHERE booking_id = $1 ORDER BY id`,
      [bookingId],
    );
    return rows.map(toRecord);
  }
}

/** Satisfies the type-level contract; every method is async here. */
export type AsyncBookingStore = {
  [K in keyof BookingStore]: (
    ...args: Parameters<BookingStore[K]>
  ) => Promise<Awaited<ReturnType<BookingStore[K]>>>;
};
