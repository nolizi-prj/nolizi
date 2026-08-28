# L-006 · A test can pass without testing anything

**2026-07-31**

## What happened

Acceptance case B-008 was written to prove a hard property: when two callers
contend for one time slot, the loser's original booking must survive
`confirmed` and unmoved — a failed reschedule must never degrade into a
cancellation.

Its assertion read: *"if the reschedule lost, the original booking is still
confirmed."*

That assertion is **conditional on losing**. If the test harness never scheduled
the operations so that the reschedule lost — entirely plausible, since ordering
is not controlled — the clause it existed to prove was never exercised. The case
would pass, forever, having tested nothing. A green suite would report a
guarantee the code had never been asked to provide.

A second case had the mirror problem: an assertion that held if *both* operations
failed, which is not the property being claimed.

## What it cost

Caught in review. The case was split: one deterministic case that forces the
losing path by pre-occupying the target, and one concurrency case whose
assertions are unconditional and hold whichever side wins.

Uncaught, it would have been worse than a missing test — a missing test is
visible in a coverage table, while this one appears as evidence.

## What to do instead

For every assertion, ask: **what execution makes this fail?** If you cannot
describe one, the assertion is decorative.

Specifically:

- **No conditional assertions about non-deterministic outcomes.** If the
  interesting branch depends on a race, force it deterministically in a separate
  case.
- **Concurrency cases assert invariants that hold under every interleaving** —
  "exactly one confirmed booking covers this interval", "this booking is never
  cancelled" — not outcomes that depend on who won.
- Test that the test fails: break the implementation deliberately and confirm the
  case goes red.

## Signals

- "if X happened, then Y" in an assertion
- A concurrency test asserting a specific winner
- An assertion that would still hold if the feature were deleted
- Coverage counted by clauses named rather than clauses exercised
