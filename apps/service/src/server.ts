/**
 * Node HTTP binding. Kept thin so `handle` stays testable without a socket.
 */

import { createServer } from 'node:http';
import { loadConfig, refusals } from './config.ts';
import { createPglite, migrate } from './db.ts';
import { handle, type AppDeps } from './app.ts';
import { RecordingMail, RetryingMail } from './mail.ts';

export async function start(): Promise<void> {
  const config = loadConfig();

  // D-001 · a refusal is logged, so a setting that did not take effect is
  // visible rather than silently ignored.
  for (const r of refusals()) console.warn(`[config] refused ${r.setting}: ${r.reason}`);

  const { sql } = await createPglite();
  let ready = false;
  const applied = await migrate(sql);
  ready = true; // P6 · migrations complete before anything serves
  console.log(`[db] migrations applied: ${applied.join(', ')}`);

  const deps: AppDeps = {
    sql,
    config,
    mail: new RetryingMail(new RecordingMail()),
    now: () => new Date().toISOString().replace('.000Z', 'Z'),
    ready: () => ready,
  };

  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      const form = Object.fromEntries(new URLSearchParams(raw));
      const url = new URL(req.url ?? '/', 'http://localhost');
      handle(deps, {
        method: req.method ?? 'GET',
        path: url.pathname,
        ip: (req.socket.remoteAddress ?? 'unknown'),
        form,
      })
        .then((reply) => {
          res.writeHead(reply.status, reply.headers);
          res.end(reply.body);
        })
        .catch((err: Error) => {
          console.error('[error]', err.message);
          res.writeHead(500, { 'content-type': 'text/plain' });
          res.end('internal error');
        });
    });
  });

  server.listen(config.port, () => console.log(`[http] listening on ${config.port}`));
}

if (process.argv[1]?.endsWith('server.js') || process.argv[1]?.endsWith('server.ts')) {
  start().catch((e: Error) => {
    console.error(e);
    process.exit(1);
  });
}
