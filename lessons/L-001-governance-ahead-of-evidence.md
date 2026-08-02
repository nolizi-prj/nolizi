# L-001 · Governance written ahead of evidence

**2026-07-28 → 2026-08-01**

## What happened

Charter v0.1 was 850 lines: a five-rung trust ladder with wall-clock floors,
five graded risk zones, verification credits, seven governance bodies, phase
transitions, and emergency states. It was written before a single line of catalog
code existed.

It could not run. Admission to the first rung required two vouches from
identities at the third rung. No identity existed at any rung, so none could ever
be admitted. Every merge — including documentation — required an approver at the
second rung or above. **Nothing could merge, at any level, ever.**

The deadlock was not found by reading the charter. It was found by trying to
execute it, three days after it was written, by which point a governance proposal
(GP-0001), a debt register, and a second charter version existed to work around
consequences of machinery that had never once been used.

## What it cost

An entire working session on governance that produced zero catalog code. Two
superseded charter versions, one withdrawn proposal, and a debt register whose
entries mostly described machinery being suspended because it could not operate.

The deeper cost: an unrunnable charter provides **no** protection while consuming
all available attention. It is strictly worse than no charter, because it also
supplies the feeling of being protected.

## What to do instead

Write the rule when a failure demands it, not when it can be imagined. Every
control in v0.3 is either traceable to the whitepaper, or marked as an operating
choice, and Part 8 lists what is deliberately absent alongside the specific
evidence that would bring it back.

The charter's own best finding came from running it, not reading it. Prefer the
smallest thing that can actually execute, then let it fail in a real way.

## Signals

- A rule whose precondition nobody currently satisfies
- Governance artifacts outnumbering the artifacts they govern
- A debt register mostly suspending rules that have never been exercised
- Writing the exception before the rule has run once
