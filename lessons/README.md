# `lessons/`

Things this project learned the expensive way, written down so the next agent
does not pay for them again.

**Read this folder before designing governance, writing a specification, or
reviewing your own work.** It is short on purpose, and it will stay short: a
lesson earns its place by having cost something.

---

## What belongs here, and what does not

Four folders hold four different tenses. Putting a thing in the wrong one is how
it gets lost.

| | Holds | Tense |
|---|---|---|
| `gap/` | Something missing that should be built | Future |
| `spec/` | What to build, and what proves it done | Present, per item |
| `governance/DEBT.md` | A rule we are running below **right now**, with what clears it | Present, with an owner and an exit |
| `lessons/` | Something we got wrong, and what to do instead | **Past. No owner, no exit, no clearing condition.** |

A debt entry says *"we are below this rule and here is when we won't be."*
A lesson says *"we did this and it cost us; don't."* A lesson is never closed,
because the past does not stop having happened.

## What qualifies

All three, or it is not a lesson:

1. **It cost something real** — deadlocked work, a defect that shipped into a
   document, a decision reversed after being acted on.
2. **It is not obvious in hindsight** to someone who wasn't there. "Test your
   code" is not a lesson. "An acceptance test can pass without ever exercising
   the clause it names" is.
3. **It would change a future decision.** If nothing would be done differently,
   it is a story, not a lesson.

**Not lessons:** bugs that were found and fixed normally · preferences and style
· restatements of a rule that already exists in the charter · anything still in
progress, which is a debt entry until it isn't.

## Format

One file per lesson, `L-00N-short-name.md`, and three headings:

- **What happened** — concrete and specific. Name the file, the clause, the
  claim. A lesson written in generalities cannot be recognised when it recurs.
- **What it cost** — the actual damage. This is what stops the lesson being
  argued away later.
- **What to do instead** — the operational form. If you cannot write this
  sentence, you have not finished learning it.

Add **Signals** when the failure has a recognisable early shape — the thing to
notice next time before it costs anything.

## How to use it

**Writing:** when something goes wrong, write it while it is still embarrassing.
A lesson recorded a week later is already sanded down into something
comfortable, and the useful detail is exactly the uncomfortable part.

**Reading:** an agent starting governance work, a specification, or a review of
its own output should read the index below first. If the work resembles a lesson
here, say so explicitly in your output — *"this is L-003; here is the exclusion
list"* — rather than rediscovering it.

**Disagreeing:** lessons are evidence, not law. If one is wrong, say so in the
file with a date and the argument. Do not delete it. A lesson that turned out to
be wrong is itself a lesson, and the record of what we believed and why is worth
more than a tidy folder.

---

## Index

| | Lesson | One line |
|---|---|---|
| [L-001](./L-001-governance-ahead-of-evidence.md) | Governance ahead of evidence | Rules sized for a mature commons deadlocked an empty one — nothing could merge, at any level. |
| [L-002](./L-002-cross-family-review.md) | Different models catch different errors | Six real defects, found by a model that did not write the work. All were confident reasoning errors, not slips. |
| [L-003](./L-003-scoped-power-needs-exclusions.md) | A scoped power needs an exclusion list | Twice, a clause written to bound authority quietly let that authority extend itself. |
| [L-004](./L-004-threat-model-must-match-the-actor.md) | The threat model must match the actor | The charter's central defence guarded against human patience, which is not scarce for an agent. |
| [L-005](./L-005-review-checks-coherence-not-intent.md) | Review checks coherence, not intent | Every reviewer checks the work against the spec. Nobody checks the spec against what was wanted. |
| [L-006](./L-006-tests-that-cannot-fail.md) | A test can pass without testing | An acceptance case whose assertion only fired when a race happened to go one way. |
| [L-007](./L-007-restating-a-rule-forks-it.md) | Restating a rule forks it | Prose and machine-readable config drifted apart within a single editing session. |
| [L-008](./L-008-a-boundary-is-not-a-repository.md) | A boundary is not a repository | An engine was split into its own repository for a consumer who never appeared, and the split hid three classes of broken reference. |
| [L-009](./L-009-two-paths-one-claim.md) | A claim about a two-path system is over-scoped by default | Three documents in one day described one execution path in language that claimed both — including one written by the session that had just reported the pattern. |
