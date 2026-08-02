/**
 * Process entry point. Host-agnostic: it needs a port and, optionally, a
 * database URL. Nothing here knows about any particular platform.
 */

import { createServer } from 'node:http';
import { loadConfig, refusals } from './config.ts';
import { migrate } from './db.ts';
import { createDatabase, type Database } from './driver.ts';
import { handle, type AppDeps } from './app.ts';
import { RecordingMail, RetryingMail, type MailPort } from './mail.ts';
import { FileMail, SmtpMail } from './mail-smtp.ts';
import { seedDemo } from './seed.ts';
import { bootstrapInvite } from './bootstrap.ts';

export async function start(): Promise<{ close: () => Promise<void>; port: number }> {
  const config = loadConfig();

  // D-001 · refusals are logged, so a setting that did not take effect is
  // visible rather than silently ignored.
  for (const r of refusals()) console.warn(`[config] refused ${r.setting}: ${r.reason}`);

  const db: Database = await createDatabase(config.databaseUrl);
  console.log(`[db] ${db.describe}`);
  if (db.kind === 'pglite') {
    console.warn('[db] no DATABASE_URL — using an in-process database. Nothing survives a restart.');
  }

  let ready = false;
  const applied = await migrate(db);
  console.log(`[db] migrations applied: ${applied.join(', ')}`);
  // Invite-only needs a first invite, or nobody can ever start.
  const boot = await bootstrapInvite(db, process.env['BOOTSTRAP_INVITE']);
  if (boot.reason === 'owners_exist') {
    console.log('[invite] accounts already exist — no bootstrap invite issued');
  } else {
    console.log('');
    console.log(`  Sign up here:  ${config.baseUrl}/signup?invite=${boot.code}`);
    console.log(`  Invite code:   ${boot.code}${boot.created ? '' : '  (existing, unused)'}`);
    console.log('');
  }

  if (process.env['SEED_DEMO'] === 'true') {
    const seeded = await seedDemo(db);
    console.log(`[db] demo data seeded: http://localhost:${config.port}/${seeded.slug}`);
  }
  ready = true; // P6 · migrations complete before anything serves

  // M1 · one adapter behind the port. SMTP is a standard, so the provider is a
  // URL rather than a dependency in the tree.
  let inner: MailPort;
  if (config.smtpUrl) {
    inner = new SmtpMail({ url: config.smtpUrl, from: config.mailFrom, baseUrl: config.baseUrl });
    console.log('[mail] SMTP');
  } else if (config.mailDir) {
    inner = new FileMail(config.mailDir, config.baseUrl);
    console.log(`[mail] writing messages to ${config.mailDir}`);
  } else {
    inner = new RecordingMail();
    console.warn('[mail] no SMTP_URL and no MAIL_DIR — messages are recorded in memory and discarded.');
  }

  const deps: AppDeps = {
    sql: db,
    tx: db,
    config,
    mail: new RetryingMail(inner),
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
      const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown')
        .split(',')[0]!
        .trim();
      handle(deps, {
        method: req.method ?? 'GET',
        path: url.pathname,
        ip,
        form,
        cookie: req.headers.cookie,
        query: Object.fromEntries(url.searchParams),
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

  await new Promise<void>((resolve) => server.listen(config.port, resolve));
  console.log(`[http] listening on ${config.port}`);

  return {
    port: config.port,
    close: async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await db.close();
    },
  };
}

const invokedDirectly = process.argv[1]?.endsWith('server.js') || process.argv[1]?.endsWith('server.ts');
if (invokedDirectly) {
  start().catch((e: Error) => {
    console.error(e);
    process.exit(1);
  });
}
