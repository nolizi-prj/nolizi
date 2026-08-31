# Pumasi Booking is now checked by a machine, and the machine says what it did not check

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-026). `roadmap/STAGE.md` says `beta`, so per
CHARTER Part 0 the work proceeds now and a steward veto reverts it.**

**Nothing about how anything merges has changed.** This workflow blocks
nothing. No branch protection, no required status check, no ruleset — none
ships and none is asked for. `GATE: PASS` still means exactly what CHARTER §3
has always said it means: an agent ran `tools/gate.sh` and signed the record.
Whether it should mean *a machine ran it* is `DECISIONS.md` **Q-025**, open,
with a default that keeps the charter as written. This release takes that
default and does not argue the question.

**Which build this is.** `pumasi-booking` `d5a02bb`. PR-1's version clause is
still not met by this product — the root, `core/` and `service/`
`package.json` all say `0.1.0` and have never moved — so the commit is given
instead. That gap is `roadmap/BACKLOG.md` item 3 and is not what this change
closes. `PRODUCT-RULES.md` itself is still only on the unmerged
`worktree-product-rules` branch (`0115758`); it was read fresh from there, and
its absence from `main` is `DECISIONS.md` **Q-017**, not compliance.

## What was wrong

Every quality claim this product made about itself was a claim an agent made
about a script it chose to run on its own machine.

Four release notes said `GATE: PASS`. `roadmap/STAGE.md` published test counts.
Six frozen acceptance suites were recorded green. Every one of those numbers was
produced by the same agent that wrote the change, on a machine nobody else could
open, and then typed into a file. Nothing re-ran any of it. There was no
artefact a reader could inspect.

Measured rather than assumed, at `f16964e`: `.github/` contained one entry,
`feedback-attachments`; there was no `.github/workflows/` directory;
`gh run list` returned empty; and `tools/gate.sh` is not in this repository at
all — it lives in the commons and is run by hand from a checkout.

`beta` means a stranger may rely on this product. A stranger could not re-run
any of it.

**This is not a claim that anyone lied.** The numbers were re-taken
independently by the evaluation that ranked this work, and they were true. The
point is that "we re-checked and it is true" was itself another sentence,
produced the same way, and the next one depended on the next seat choosing to
look. `pumasi-tunnel` paid the bill for that once already: a stage gate recorded
`MET` off twelve local runs, re-measured at forty, found failing 7.5% of the
time (**Q-024**).

## What changed

- **Every push and every pull request is now checked in public.** The run page
  is open to anyone, with no account: a stranger can read what was checked and
  what it said. The first run on `main` is
  [`33428541886`](https://github.com/pumasi-ai/pumasi-booking/actions/runs/33428541886)
  — 19 core checks, 316 service checks, both workspaces type-checked, zero
  failures.
- **What CI checks lives in one script in the repository**, `tools/ci.sh`, not
  in a list of YAML steps. Anyone can run exactly what the machine ran:
  `npm ci && tools/ci.sh`.
- **The type-check now checks the whole product.** It did not before, and this
  is the finding that made the work worth more than switching CI on. Root
  `npm run typecheck` was `npm run typecheck --workspaces --if-present`;
  `core/` had a `typecheck` script and **`service/` did not**, so the workspace
  holding every line that touches HTTP, PostgreSQL, mail and sessions was
  skipped in silence and the command exited **0**. A machine running that and
  reporting "typecheck green" would have put a badge on a third of the product.
  `service/` gains the missing script — it passes as-is, with nothing
  narrowed — and the root command drops `--if-present`, so a workspace that
  cannot be type-checked now **fails** instead of being passed over.
- **The build that serves `booking.pumasi.ai` is bundled on every run.**
  `service/wrangler.jsonc` names `src/worker.ts` as the deployed entry point,
  and both `service/tsconfig.json` and `service/tsconfig.test.json` exclude it —
  so `npm run build` does not emit it and `npm test` does not compile it. Until
  today it was seen only by `wrangler`, at deploy time. A credential-free
  `wrangler deploy --dry-run` now bundles it on every push, which catches a
  missing module or a broken import. **It is not a type-check**, and the run
  says so in as many words.

## What the run deliberately does not check, and says so every time

A green tick over a narrower check than the words imply is worse than no tick,
because a tick is read as an answer. So the run prints its own gaps:

- **`service/test/browser-live.test.ts` is not run there.** It launches a real
  browser and asserts against the live `https://booking.pumasi.ai` — its status,
  its headline, its SSO buttons, a real redirect to Google. In a shared runner
  that would make every result depend on a third party's uptime and on a
  deployment that is **four merged builds stale** (`BACKLOG.md` item 1,
  `Q-012` open), so it would go red for reasons having nothing to do with the
  change. **It is excluded from that one run and from nothing else.** It is not
  skipped, not deleted, not edited; `npm test` and `tools/gate.sh` still run it,
  and they ran it for this release. The run names the file and the reason on
  every execution, and the script **fails** if the file it excludes is not
  actually in the suite — an exclusion naming an absent file becomes a false
  statement the moment someone renames the test.
- **The types of `src/worker.ts`.** See above. The script does not assert this
  from memory: it reads both `service` tsconfigs at run time and prints what it
  finds, so the day someone stops excluding the file the sentence moves with the
  tree instead of going stale (`L-009`).

## Why you can believe the machine can fail

An advisory check that cannot go red is worse than none. Both halves were
demonstrated on throwaway branches, pushed, observed, and deleted — the runs
remain readable:

- One real assertion broken in `service/test/mail.test.ts` →
  [run `33428582211`](https://github.com/pumasi-ai/pumasi-booking/actions/runs/33428582211),
  **failure**.
- `service/package.json`'s `typecheck` removed and `--if-present` restored —
  exactly the state of the tree before this change →
  [run `33428597457`](https://github.com/pumasi-ai/pumasi-booking/actions/runs/33428597457),
  **failure**.

Six acceptance cases were frozen before any of this was written and each was
run against a worktree with the change absent: five red, one green, and the
green one records on itself why it is correctly green and which single mutation
turns it red.

## Nothing shipped to a user

No file under `core/src` or `service/src` moved. No test was deleted, skipped or
edited. Nothing was deployed — `booking.pumasi.ai` is unchanged and still
serves the pre-`d5a02bb` build, which is `BACKLOG.md` item 1 and `Q-012`, and
is not this change's to close. `roadmap/` was not edited.

## Two things found while looking, handed on rather than folded in

1. **Nothing type-checks the worker.** Probed: `src/worker.ts` produces 17
   errors under the service's existing compiler options, every one a missing
   Cloudflare runtime type rather than a defect. Closing it needs a dependency,
   a third tsconfig and `.sql` module declarations, and its repair is product
   work this change may not take.
2. **The suite's greenness is partly a property of the machine.** Nineteen of
   the 31 service test files each start a real PostgreSQL. On a busy 16-core
   machine at load average 11, `npm test` failed between 13 and 32 of 311 —
   always in a database `before` hook, **never on an assertion** — and a failed
   run leaves a data directory behind that then fails the next run of that file.
   At `--test-concurrency=4` under the same load, and at default concurrency on
   a quiet machine, it is 311 of 311; on the 4-core GitHub runner it was green.
   That is a real property of the suite and this change does not tune it away.

Both are ranked findings for the product manager, not silent debt.
