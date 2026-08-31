# Pumasi Booking's reminders and webhooks were never sent on the hosted service

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-029). Stage is `beta`, so per CHARTER Part 0
the work proceeds now and a steward veto reverts it.**

> **This fix is not live.** It is merged and it has not been deployed. Read the
> last section before you conclude that anything has changed for you.

## What was wrong

Pumasi Booking lets you set up **workflows** — a reminder the day before, a
follow-up afterwards — and **webhooks** that tell another system when someone
books, cancels or reschedules. On `booking.pumasi.ai`, **none of them have ever
been delivered.** Not one reminder, not one follow-up, not one webhook, since
the feature shipped on 2026-08-28.

They were not delayed and they were not dropped quietly by a mail provider.
They were never attempted. Everything timed goes onto a queue, and a timer
drains that queue; on the hosted build the timer threw an error on its first
line of real work and stopped. Because it died *before* the step that schedules
the next run, it never woke up again either.

The cause is a single missing line. The code that drains the queue calls a
function that the hosted entry point never imported. That reads like something a
compiler catches immediately — and it is. Nothing compiled that file. The
deployment tool bundles it with a compiler that removes types without reading
them, so the mistake bundled cleanly, shipped, and passed every check we had.

**What was not affected.** Booking itself. Making, cancelling and rescheduling
a booking all worked, and the confirmation email you get at the moment of
booking is sent on the spot rather than through the queue, so it arrived. If
you run Pumasi Booking yourself with the Node server rather than on Cloudflare,
you were never affected — that entry point imported the function correctly.

Found on 2026-08-31 by a product evaluation running the type-check that nothing
in the project ran automatically. No user reported it, and the issue tracker
holds nothing about it — which is itself part of the story: a reminder that
never arrives does not look like an error to the person expecting it.

## What changed

- **The timer works.** The missing import is there, and the queue drains: due
  reminders and follow-ups are sent, due webhooks are delivered, and the timer
  re-arms itself for the next one.
- **The file that serves you is now type-checked.** `npm run typecheck` covers
  the deployed entry point for the first time. It had been excluded from every
  configuration in the project, which is how a missing import survived three
  days, a green gate, four product evaluations and a release note.
- **The timer is now tested by running it.** Not by reading the file and
  matching text, which is what the eight existing tests that mention this file
  do, and which would not have caught this. A new test loads the real code,
  gives it a real database, puts real jobs on the queue and fires the timer.
- **Our automated checks stopped saying something untrue.** They had been
  reporting, correctly at the time, that nothing type-checked the deployed
  build. That sentence was derived from a fixed list of two configuration
  files, so it would have gone on being printed after a third one fixed the
  gap. It now reads the project rather than a memory of it.

## What did *not* change, deliberately

- **No behaviour was altered anywhere else.** The new type-check surfaced five
  further complaints in the deployed file. Every one was a gap in how the file
  was *described* to the compiler, not a fault in what it does: eleven
  now-redundant suppression comments, and three places where the deployment's
  own secrets cannot be described by a type generated from a configuration file
  that deliberately does not contain secrets. They were resolved by correcting
  the descriptions. Not one line of behaviour moved.
- **Nothing was drained retroactively.** Reminders whose moment has passed are
  not sent late; a follow-up for a meeting three days ago would be noise, not
  service. Webhooks and reminders still queued for a *future* time will be
  delivered normally once this is deployed.
- **We did not change the queue, the workflow editor, or the webhook format.**

## What could hurt someone, and what stands in the way

- **The harm this closes is a silent non-delivery.** Someone set a reminder for
  their guests and it did not go. Nobody was told. That is the failure mode
  this release exists to end, and the reason it is written up as can-hurt
  despite the fix being one line.
- **A test that could pass while the product stays broken.** This was the real
  risk, so it was checked rather than asserted: the missing import was put back
  and the new test was re-run. All three cases fail with the original error.
  The type-check independently reports it too. Two separate nets, both
  confirmed to catch this exact defect.
- **A fix that only compiles.** Also checked: the built bundle that would ship
  now contains the function's definition. Before, it contained the call and no
  definition anywhere.
- **A regression in everything else.** Full suite green: **320 service tests +
  19 engine tests, 339 of 339**, and `GATE: PASS`.

## What was tested

Three new cases that execute the deployed entry point's timer directly — a due
reminder is drained, a not-yet-due job is left alone, and the next wake-up is
scheduled for the right moment — plus the existing suite unchanged. Cross-family
review: **Gemini approved**, having re-run the test suite and the project's
checks itself. Four other families could not review: Grok returned HTTP 402
(balance exhausted), and Qwen, GLM and Kimi failed in their driver before any
model saw the change, because the review tool passes the whole context as a
single command-line argument and this one exceeded the operating system's
131,072-byte limit. That is a tooling gap, recorded rather than counted as
breadth; all five transcripts are committed.

## Open debt this release touches (§2.1 requires their status here)

- **D-104** (reviewer breadth): live in a new form. Five of six families
  answered a liveness probe, and only one could actually review a change of
  this size. A probe is "can it answer", not "can it review", and the gap
  between those two numbers is exactly the silent degradation D-104 exists to
  make audible.
- **D-105** (privacy posture, DEGRADING): unchanged. No new data is collected
  and no new party receives any. This release causes mail that was already
  promised to actually be sent, to the addresses that already asked for it.
- **D-107** (held-tier retention): untouched.

## Which build this is

PR-1 asks a release to say which build it is, and this product still cannot:
`https://booking.pumasi.ai/version` returns 404 and `/healthz` reports
`"commit":"unknown"`, both re-checked while writing this. The commit is
`0a35ddc` on `main`.

## This is not live, and saying so is the point

`booking.pumasi.ai` was last deployed at **2026-08-30 16:55:37 UTC** (version
`d73c05b5`, a secret change), re-measured for this note at 2026-08-31 21:30
UTC — **more than 28 hours ago**. This fix is the **sixth** merged build waiting
behind that, after the reporting mechanism, the Zoom fix, the OAuth-callback
fix, the sign-in fix and advisory CI.

So: **your reminders and webhooks are still not being sent.** They will start
when somebody deploys this, and nothing in the process that produced this note
deploys anything. Whose job that is, and by when, is the open question
`DECISIONS.md` **Q-012**, and this release is recorded there as further evidence
for it — not as its answer, and not as its closure.
