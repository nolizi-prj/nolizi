# @pumasi/scheduling-service

Implements [SPEC-0002](../../spec/0002-scheduling-service/SPEC.md). Wraps the
engine ([SPEC-0001](../../spec/0001-scheduling-core/SPEC.md)); does not
reimplement it.

**Not tied to any host.** It needs a port and, optionally, a PostgreSQL URL.
Nothing in the code knows about a particular provider — that is `P12` (no
special protocol is required to participate) and the commercialization
commitment that self-hosting stays first-class forever.

## Run it

    npm install
    npm run dev            # from the repo root

Opens on `http://localhost:8080/demo` with seeded availability. No database, no
container, no account, no configuration.

## Databases

| | When | What you get |
|---|---|---|
| **PGlite** (default) | no `DATABASE_URL` | Genuine PostgreSQL in-process, including `btree_gist`, so the exclusion constraints are really enforced. Nothing survives a restart. |
| **PostgreSQL** | `DATABASE_URL` set | Any reachable instance — local, container, or managed. A pooled connection per transaction. |

The distinction that matters is transactions. A transaction needs a connection
to itself: `BEGIN` and `COMMIT` issued as separate statements onto a shared
session let concurrent callers interleave, so a second `BEGIN` lands inside the
first and neither is request-scoped. The pool hands out a dedicated client;
PGlite, having one connection, serialises instead.

## Deploying

Anywhere that runs a container or Node 22.

    docker compose up          # service + PostgreSQL, locally
    docker build -t pumasi .   # then run it wherever

`railway.json` is present as one convenience among several, not a dependency.
Set `PORT`, and `DATABASE_URL` for anything that must outlive the process.
`PGSSL=require` if your provider needs TLS.

## What the gates refuse

`PUBLIC_SIGNUP=true` is **refused**, and the account and booking ceilings can be
lowered but not raised, while [`DEBT.md`](../../governance/DEBT.md) D-105 is open
— no lawful basis has been established for holding third-party personal data.
Refusals are logged rather than silently ignored.

## Health and readiness

`/healthz` means the process is up. `/readyz` means migrations are complete, the
database answers, and reports the commit and tzdata version in use. Route on
`/readyz`.

## What is not built

See [SPEC-0002 §8.1](../../spec/0002-scheduling-service/SPEC.md). The booker's
path is complete; accounts, sessions, the owner application, token expiry and
reschedule-over-HTTP are declared but not implemented.
