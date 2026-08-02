# @pumasi/scheduling-service

Implements [SPEC-0002](../../spec/0002-scheduling-service/SPEC.md). Wraps the
engine ([SPEC-0001](../../spec/0001-scheduling-core/SPEC.md)); does not
reimplement it.

## Running

    npm install
    npm run build --workspaces
    node apps/service/dist/server.js

With no `DATABASE_URL` it starts an in-process PGlite, which is real PostgreSQL
including `btree_gist` — the exclusion constraint in `migrations/001_bookings.sql`
is genuinely enforced, not simulated. Point `DATABASE_URL` at a real instance for
anything that must outlive the process.

## What the gates refuse

`PUBLIC_SIGNUP=true` is **refused**, and the account and booking ceilings can be
lowered but not raised, while `DEBT.md` D-105 is open — no lawful basis has been
established for holding third-party personal data. Every refusal is logged rather
than silently ignored. See [`REPORTING.md`](../../REPORTING.md).

## Health and readiness

`/healthz` means the process is up. `/readyz` means migrations are complete, the
database answers, and reports the commit and tzdata version in use. The platform
should route on `/readyz`.
