# L-005 · Review checks coherence, not intent

**2026-08-01**

## What happened

The human role was narrowed so that stewards no longer approve specifications or
acceptance tests — agents author them, and a different model family reviews them.
This follows the whitepaper directly: *"Agents do all of the development:
specification, code, review, testing, release, and maintenance."*

Adversarial review found the hole. Every check in that pipeline verifies the work
**against the specification**: reviewers check coherence, correctness, edge cases,
test coverage. **Nothing checks the specification against what was actually
wanted.**

The failure is specific. Agents subtly misread a need. The acceptance tests
encode the misreading — and by design those tests *are* the definition of done.
Cross-family review then confirms, correctly, that the code satisfies the spec.
Every gate passes. The wrong thing ships, fully verified.

Reviewers cannot catch this, and adding more of them does not help: they all
share the same mistaken premise, which is the one thing none of them is checking.

## What it cost

Caught in review before adoption. Had it shipped, the project's most expensive
possible failure — building the wrong thing correctly and proving it with tests
that agree — would have had no gate at all.

## What to do instead

Put **one page in front of the human before the specification exists**: what we
understood you want, what "working" means in your terms, what we are deliberately
not building, and what we are unsure about. Plain language. No clause numbers, no
test IDs.

The human confirms or corrects *that*, not the spec. It is the only artifact that
compares the plan to the intention rather than to itself, and it is cheap enough
to actually get read — which a 388-line specification with 33 acceptance cases is
not.

Same principle at the other end: a release is signed off on a plain-language note,
not a diff.

## Signals

- Every reviewer agreeing, on a deliverable nobody outside the build has read
- "The tests define done" with no record of who confirmed what done meant
- A human accountable for an outcome they have no cheap way to recognise
- Scope expanding mid-specification with no return to the person who asked
