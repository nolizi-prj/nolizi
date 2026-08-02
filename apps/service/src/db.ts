/**
 * Migrations. Driver selection lives in driver.ts.
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
