# Pumasi Sign's *Sign in again* button now goes to the sign-in page

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-027). `pumasi-sign/roadmap/STAGE.md` says
`alpha`, so per CHARTER Part 0 the work proceeds now and a steward veto
reverts it.**

**Read the last section first if you are waiting for this to reach you.**
It is merged and it is **not deployed**. `sign.pumasi.ai` still hands that
button's user a page of JSON.

## What was wrong

A person who signed out of Pumasi Sign saw one button — *Sign in again* — and
clicking it navigated them to:

```
{"error":"Endpoint not found"}
```

Rendered raw, as a document, with no way back except editing the address bar.
Measured against the live host on 2026-08-31, not read off the code:

```
$ curl -s -i 'https://sign.pumasi.ai/api/auth/login?next=%2F'
HTTP/2 404
content-type: application/json
{"error":"Endpoint not found"}
```

The button was a full-page navigation to `/api/auth/login`. **That route
exists in only one of this repository's two backends, and it is not the one
that serves users.** `backend/app/routers/auth.py:82` defines it;
`service/src/durable.ts` — the Cloudflare Worker that `wrangler.jsonc` claims
`sign.pumasi.ai` for — defines no `GET` under `/api/auth/login` at all, only
`POST /api/auth/login/request` and `POST /api/auth/login/verify`. And
`wrangler.jsonc` sets `run_worker_first: ["/api/*"]`, so the browser's
navigation was routed *past* the app's own pages to the worker on purpose,
which answered it as an unknown API endpoint.

The frontend was written against the tree nobody reaches. That is
[L-009](../lessons/L-009-two-paths-one-claim.md) in this product for the third
time.

## Why no test caught it, and why one still might not

**Every CI job was green on this bug, and one of them was green *because* of
it.** [Run 33420378497](https://github.com/pumasi-ai/pumasi-sign/actions/runs/33420378497)
is `backend` ✓ `frontend` ✓ `service` ✓ `e2e` ✓ — while the button 404s in
production.

The `e2e` job is the one that matters. `frontend/playwright.config.ts` boots
`uvicorn` locally, or in CI a Docker image built from the root `Dockerfile` —
**`backend/` both times**, the one tree in which the broken route exists. Six
Playwright specs drive a sign-in path that works, on a server no user reaches,
and would have kept passing however long this stayed live. None of them clicks
this button anyway.

So this release offers **no CI result as evidence**. What it offers is a real
Chromium clicking the real button against a local `wrangler dev` of
`service/`, with the built SPA behind its `ASSETS` binding — the same code
path `sign.pumasi.ai` runs — before and after:

| | before (`2bd3ba7`) | after |
|---|---|---|
| the button's `href` | `/api/auth/login?next=%2F` | `/login?next=%2F` |
| where the click lands | `/api/auth/login?next=%2F` | `/login?next=%2F` |
| what the page says | `{"error":"Endpoint not found"}` | *Sign in to Pumasi Sign* · *Continue with Google* · *Continue with Microsoft* |

## What changed

One line of intent, in three files.

The button targets the app's own `/login` page, through `loginPageUrl` — the
helper that already existed one function below the broken one in the same
file, and that the app's own `401` handler already used. The broken helper,
`loginRedirectUrl`, is deleted; it had exactly one caller. There is now one
expression in this frontend for *send this browser to sign in*, not two, and
the one that remains names a page rather than a server route.

The page it lands on works on the deployed tree, and that was checked rather
than assumed: `GET /login` returns **200 `text/html`** from `sign.pumasi.ai`,
and both single-sign-on routes that page offers answer **302** there — so
*Continue with Microsoft* is configured on the deployment, not merely present
in the markup. The emailed-code sign-in on the same page is worker code too.

**The other repair was considered and rejected in writing**
(`pumasi-sign/spec/0003/SPEC.md` §S1): adding the missing `GET
/api/auth/login` to the worker. It would have bought a network round trip for
a redirect the browser can make itself, kept a helper that is a trap alive,
and grown the worker's API surface specifically to mirror `backend/`'s — a
decision about the shape of the deployed tree, taken by a coder, next to
[Q-018](../DECISIONS.md), which asks which of the two trees *is* this product
and is the steward's. The repair chosen works identically on both trees and
prejudges nothing.

## The second half: what `GATE: PASS` covered, and now covers

This release carries a second change with no user-visible effect, and it is
the reason to trust the first one a little more.

`pumasi/tools/gate.sh` — the charter's merge gate — runs `npm test` at the
product repository's root. In `pumasi-sign` that script was
`cd frontend && npm run test:unit && npx vue-tsc -b --force`. The word
`service` did not occur in it. So the gate that stands between a change and
`main` ran **69 frontend assertions and zero** against the worker that answers
`sign.pumasi.ai` — and `GET .../branches/main/protection` returns 404 *"Branch
not protected"*, so that one hand-run check is the whole gate.

It now runs both trees. The service half installs, builds — `service/dist/` is
`.gitignore`d and the suite runs `dist/`, so `node --test` would otherwise
match no files, run nothing and exit **0** — runs the suite, and then hands
the suite's own output to the guard `spec/0002` already built, the *same file*
CI calls, not a copy of it:

```
before   Test Files 5 passed (5) · Tests 69 passed (69)   service assertions: 0
after    Test Files 6 passed (6) · Tests 85 passed (85)
         # tests 2 · # pass 2 · # fail 0
         assert-service-suite-ran: 2 passing, 0 failing, from 2 compiled
           file(s) for 2 source file(s) under service/src/test.
```

Exit `0` was available before. The counts are the evidence, and the gate now
prints them.

**Two counts, not one, so nobody reads more into this than it says.** `# pass
2` is the whole of the worker's test suite. `service/src/test/` holds two
files and both exercise the PDF stamper; sessions, the Durable Object store,
R2, mail and the routing this very release note is about are covered by
nothing. Widening that is `pumasi-sign/roadmap/BACKLOG.md` item 4 and is not
this change. What changed is that the gate no longer reports a number that
excludes production — not that production is now well covered.

## Nothing shipped to a user

**Not deployed.** [Q-012](../DECISIONS.md) — who carries a merged build to
users — is open and is explicitly outside CHARTER Part 0's proceed-on-default
rule. [Q-018](../DECISIONS.md) adds the part a run could get wrong even
willing: shipping this product means `wrangler deploy` from `service/`, **not**
the Railway push `pumasi-sign/CLAUDE.md`'s Deployment section describes; a run
that followed that section would deploy a tree no user reaches and report it
as shipped.

So, plainly: **`sign.pumasi.ai` still serves the broken button.** A signed-out
user there still meets `{"error":"Endpoint not found"}` today, and will until
someone deploys. This note is written in the past tense about a branch on
purpose — Q-012 was raised from a release note that used the present tense
about one.

Also untouched: `service/` source, `backend/`, `.github/workflows/ci.yaml`, the
Playwright suite, `roadmap/`, `CLAUDE.md`, the absent `LICENSE`
([Q-021](../DECISIONS.md)), `catalog.json` ([Q-019](../DECISIONS.md)), and the
root `package.json`'s missing `version` field, which is that repository's
`BACKLOG.md` item 6 and is now asserted absent by a frozen test so a later
packet cannot take it in passing.

## How you can check any of this

- Spec, with the rejected alternative argued rather than asserted:
  `pumasi-sign/spec/0003/`.
- Nine frozen acceptance cases, each run against the change-absent tree before
  freezing and each driven red by the single mutation named for it:
  `pumasi-sign/frontend/src/signed-out-entry.spec.ts`.
- Reviews: `pumasi-sign/reviews/20260831-141457-spec-gemini.md` and
  `.../20260831-141721-code-gemini.md`.
- Commits: `b6513c2` (spec and frozen cases) and `d18d534` (implementation).

**Review breadth, reported rather than assumed** (DEBT D-104): **one**
non-builder family, gemini, on both the spec and the code. `grok` returns HTTP
402 *"Grok Build usage balance exhausted"* — probed this tick — and
`tools/families.sh` reports that as `UNREACHABLE` because it cannot tell
billing from a timeout. `claude` built this and does not count for its own
review. Pre-`launched`, review is advisory (Part 0) and P5's single
non-builder bar is met; §3's rule that the spec reviewer must not be among the
code reviewers **cannot bind below three families** and is off rather than
pretended.
