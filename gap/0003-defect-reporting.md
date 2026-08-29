# GAP-0003 — Defect and feedback reporting

**Filed:** 2026-08-01 · **Status:** open, **deliberately not converted to a spec**
**Signed:** *(single identity; the steward is also the sponsor — `governance/DEBT.md` D-101)*
**Related:** [`REPORTING.md`](../REPORTING.md) · `CHARTER.md` Part 5.1 · Part 5
**Conversion trigger:** §7

---

## 1 · The need

`CHARTER.md` Part 5.1 turns automatic reporting on by default, and
[`REPORTING.md`](../REPORTING.md) constrains it hard: no user data, no
configuration, no content, crash traces scrubbed to frame and module names, and
not sent at all when scrubbing is uncertain.

**Those constraints are correct and they make reports less useful.** The material
that normally makes a defect report actionable — the actual input, the actual
stack, the surrounding configuration — is precisely what we have promised not to
take. What arrives instead is a pass/fail count and a platform string.

That is sufficient to answer *"does the suite pass in this environment?"*, which
is the environment-dependence problem `DEBT.md` D-102 exists for. It is not
sufficient to answer *"what went wrong for this user, and how do we reproduce
it?"*

This gap is the second question.

## 2 · The load-bearing idea

**A defect report should be an acceptance case, not a telemetry payload.**

This catalog is defined by executable acceptance tests; they are the whole truth
(whitepaper principle 3). So the highest-value artifact a user can send is an
input, an expected output, and an observed output — because that is already the
shape of every case in `spec/*/acceptance/cases.json`. It needs no human triage,
it can be reviewed by agents against the spec, and once accepted it is a
permanent regression test rather than a closed ticket.

A defect report that is not a test case is a request for someone else to write
the test.

## 3 · Structure-preserving reduction — why this is tractable here

The privacy constraint and the reproduction requirement look opposed. For this
domain they are not, because **the shape of the input reproduces the bug and the
content of the input does not.**

A daylight-saving defect reproduces from *"a window spanning the spring-forward
gap in this zone, with this duration and this granularity."* It does not require
the real date, the real attendees, or the meeting title. The same holds for the
recurring failure signatures named in GAP-0001 §2: buffer interactions, notice
boundaries, cross-timezone slot edges, concurrency on a contested interval.

So a reducer can preserve structural relationships — position relative to a
transition, relative offsets, durations, overlaps — while discarding the actual
instants and every identifier. The reduced case still fails; the calendar it came
from does not travel.

This is domain-specific reasoning and does not generalise to every catalog item.
Items whose defects depend on data content will need a different answer, and
should not assume this one.

## 4 · What is in scope

Three tiers, distinct in what they collect and how they are triggered:

| Tier | Trigger | Carries |
|---|---|---|
| **Conformance** | automatic, on by default | Suite pass/fail, environment facts. **Exists already** — Part 5.1. |
| **Reduced failing case** | automatic capture, **explicit send** | A minimal structure-preserving reproduction, shown to the operator before sending. |
| **Feedback / gap report** | human-initiated | Prose. Already a first-class contribution from unregistered submitters (Part 5). |

Also in scope:

- **Runtime invariant checks.** This spec states invariants strong enough to
  check cheaply in production — no two confirmed bookings intersect, the same
  request yields the same response. A violation is an unambiguous defect, not a
  user opinion, and is the highest-quality trigger available.
- **Disposition, published.** See §6.

## 5 · What is explicitly out of scope

**Updated 2026-08-29.** The first two lines below were the binding constraints
when this gap was filed, and `CHARTER.md` §5.2 has since removed both. They are
kept visible rather than edited away, because the reasoning in §3 was *built* on
them and a reader needs to know which parts were load-bearing.

- ~~Any collection that would require relaxing `REPORTING.md`. If a tier cannot
  be built within those limits, the tier is not built.~~ **Lifted.** §5.2 now
  defines a **held** tier — collected, retained to a stated schedule, deletable,
  never published — and tier two below is exactly what it was created to carry.
- ~~Crash-trace enrichment. The scrubbing fallback stands.~~ **Changed.** A trace
  the scrubber cannot clean is no longer discarded; it goes to the held tier. The
  scrubber still runs, and such a trace is still never published.
- Anything that makes opting out worse, slower, or more visible. **Stands.**
- **New, and it replaces the old constraint rather than removing it:** nothing in
  any tier carries a booker's or owner's identity, or any value a user typed
  (`SPEC-0002` D5). The limit moved from *how much* to *what about whom*.

**§3 is still the right design, and is now an optimisation rather than a
necessity.** A structure-preserving reduction was originally the only way to get
a reproduction past the privacy limits. It is still the best artifact — a reduced
case is already a valid acceptance case, needs no triage, and becomes a permanent
regression test. What has changed is that a raw failing case can now be *held*
while the reducer is being built, so tier two no longer has to wait for §8's
format work to be finished before it collects anything at all.

## 6 · Disposition is the mechanism that makes people report

Most reporting systems die the same way: reports vanish, submitters hear nothing,
submitters stop. Form design does not fix this and neither does prompting.

This commons has a structural advantage that vendors do not: **everything is
public and attributed**. A submitter can watch their reduced case become a
numbered case in the suite, with their attribution on it, permanently — and
ledger standing is the only rank here (P9).

Publishing the disposition of every report is therefore not a courtesy feature.
It is the loop that converts use into contribution, which is the whitepaper's
fourth principle and the meaning of the project's name. **Build it with the first
tier it applies to, not after.**

## 7 · Why this is filed as a gap and not converted now

Because there are zero users, and building a three-tier reporting pipeline for
zero users is [`L-001`](../lessons/L-001-governance-ahead-of-evidence.md) — the
failure that produced an 850-line charter which could not merge a documentation
change.

The near-term source of real defect signal is not users. It is **the first
implementation attempt against SPEC-0001 ([`core/spec`](https://github.com/pumasi-ai/pumasi-booking/tree/main/core/spec))**, which will surface
more actionable defects in a day than early telemetry would in a year.

**One conversion trigger has been removed, 2026-08-29.** This gap was blocked on
a constraint as well as on evidence; the constraint is gone and the evidence
requirement stands unchanged. Do not read the lifting as a reason to build it —
[`L-001`](../lessons/L-001-governance-ahead-of-evidence.md)
applies exactly as it did, and there are still zero users.

**Convert this gap to a spec when any of these is true:**

1. A catalog item has been released and has **users who are not the founding
   principal**.
2. A defect is found in the wild that the conformance tier could not have
   surfaced — the first concrete evidence that tier two is needed.
3. The first implementation produces defects whose reproduction would have
   benefited from a reduction format, and the format's absence is felt.

Until one of those holds, the design above is a record of thinking, not a backlog
item. Nothing here should be built on the strength of it being a good idea.

## 8 · What would be cheap to do first, when the time comes

Not now, but noted so the sequencing survives:

- Define the **format** before the machinery: a schema for a reduced failing case
  that is *already a valid acceptance case*. Format is cheap and forces the real
  design question — what is the minimum that reproduces a defect — while the
  spec is still fresh.
- Then the reducer. Then the tiers. Then disposition tracking.
- Reversed, each layer bakes in assumptions the format would have caught.
