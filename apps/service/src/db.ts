/**
 * Database bootstrap. PGlite in development and tests, node-postgres against a
 * real DATABASE_URL in deployment. Both satisfy the same `SqlClient` surface,
 * so nothing above this file knows which is in use.
 *
 * O3 · Readiness is distinct from health: readiness means migrations are
 * complete and the database answers. The platform must not route traffic to an
 * instance that looks alive but cannot serve.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SqlClient } from './store.ts';

const here = dirname(fileURLToPath(import.meta.url));

export function migrationsDir(): string {
  for (const p of ['../migrations', '../../migrations', '../../../migrations']) {
    try {
      const dir = resolve(here, p);
      if (readdirSync(dir).some((f) => f.endsWith('.sql'))) return dir;
    } catch {
      /* try the next */
    }
  }
  throw new Error('migrations directory not found');
}

/** P6 · Forward-only, run to completion before anything serves. */
export async function migrate(sql: SqlClient): Promise<string[]> {
  const dir = migrationsDir();
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const applied: string[] = [];
  for (const f of files) {
    await sql.exec(readFileSync(resolve(dir, f), 'utf8'));
    applied.push(f);
  }
  return applied;
}

/**
 * A transaction lock.
 *
 * PGlite is ONE connection. Issuing BEGIN/COMMIT as separate statements from
 * concurrent handlers interleaves them on that single session, so a second
 * BEGIN lands inside the first transaction and neither is request-scoped. This
 * serialises whole transactions instead. A real pool takes a client per
 * transaction and does not need it.
 */
export class TxLock {
  #tail: Promise<unknown> = Promise.resolve();
  run<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.#tail.then(fn, fn);
    this.#tail = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }
}

export async function createPglite(): Promise<{ sql: SqlClient; close: () => Promise<void> }> {
  const [{ PGlite }, { btree_gist }] = await Promise.all([
    import('@electric-sql/pglite'),
    import('@electric-sql/pglite/contrib/btree_gist'),
  ]);
  const db = await PGlite.create({ extensions: { btree_gist } });
  return {
    sql: {
      query: (text, params) => db.query(text, params as unknown[]) as never,
      exec: async (text) => {
        await db.exec(text);
      },
    },
    close: () => db.close(),
  };
}
