# GAP-0003 — Defect and feedback reporting

**Filed:** 2026-08-01 · **Status:** open, **deliberately not converted to a spec**
**Related:** [`REPORTING.md`](../REPORTING.md) · `CHARTER.md` Part 5

---

## The need

Automatic conformance reporting answers *"does the suite pass in this
environment?"* — the environment-dependence problem `D-102` exists for. It does
not answer *"what went wrong for this user, and how do we reproduce it?"*

This gap is the second question.

## The load-bearing idea

**A defect report should be an acceptance case, not a telemetry payload.**

This catalog is defined by executable acceptance tests, so the highest-value
artifact a user can send is an input, an expected output and an observed output —
already the shape of every case in `spec/*/acceptance/cases.json`. It needs no
human triage, can be reviewed by agents against the spec, and once accepted it is
a permanent regression test rather than a closed ticket.

A defect report that is not a test case is a request for someone else to write the
test.

## Why this is tractable here

The privacy constraint and the reproduction requirement look opposed. For this
domain they are not, because **the shape of the input reproduces the bug and the
content of the input does not.**

A daylight-saving defect reproduces from *"a window spanning the spring-forward
gap in this zone, with this duration and this granularity."* It does not need the
real date, the real attendees or the meeting title. The same holds for buffer
interactions, notice boundaries, cross-timezone slot edges, and concurrency on a
contested interval.

So a reducer can preserve structural relationships — position relative to a
transition, relative offsets, durations, overlaps — while discarding the actual
instants and every identifier. The reduced case still fails; the calendar it came
from does not travel.

This is domain-specific and does not generalise. Items whose defects depend on
data *content* need a different answer.

## Scope

In: a reduced failing case, captured automatically and sent only on an explicit
choice; runtime invariant violations, which are unambiguous defects rather than
user opinions; and **published disposition** — a submitter watching their case
become a numbered case in the suite, attributed, is the loop that converts use
into contribution.

Out: anything carrying a booker's or owner's identity, or any value a user typed
(`SPEC-0002` D5). The limit is not *how much* but *what about whom*.

## Why it is filed and not built

There are zero users, and building a reporting pipeline for zero users is
[`L-001`](../lessons/L-001-governance-ahead-of-evidence.md). The near-term source
of real defect signal is the first implementation attempt against a spec, which
surfaces more in a day than early telemetry would in a year.

**Convert to a spec when any of these is true:**

1. A catalog item has users who are not the founding principal.
2. A defect is found in the wild that the conformance tier could not have
   surfaced — the first concrete evidence the reduced tier is needed.
3. An implementation produces defects whose reproduction would have benefited
   from a reduction format, and its absence is felt.

Until then this is a record of thinking, not a backlog item. Nothing here should
be built on the strength of it being a good idea.
