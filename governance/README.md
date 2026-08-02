# `governance/`

The rules of the commons. Three files, and they must agree.

| File | Role |
|---|---|
| [`CHARTER.md`](./CHARTER.md) | Normative. **Governs on conflict** — if this and the config disagree, the config is a bug. |
| [`charter.yaml`](./charter.yaml) | The same rules as parameters with stable IDs, machine-readable. |
| [`DEBT.md`](./DEBT.md) | Every rule the project is currently running below, why, what compensates, and what turns it back on. |
| [`archive/`](./archive/) | Superseded versions, kept rather than deleted. |

Related, outside this folder: [`../lessons/`](../lessons/) — what this project
got wrong and what to do instead. Read it before designing governance or
reviewing your own work; several entries there are the reason rules here look
the way they do.

---

## The whole of it, in one screen

**Four human decisions per catalog item.** Does it deserve to exist · is the
intent statement right · may it touch something that can hurt someone · may it be
released. A human reads **two pages per item**: an intent statement and, for
risky items, a release note. Never a spec, never a test, never a diff.

**Every merge needs four things.** A spec authored by an agent and reviewed by a
different model family · its acceptance tests passing, frozen before
implementation · a code review from a model family other than the builder's · a
signed record. Objections must cite a failing test or a clause; uncited ones are
discarded.

**One risk question:** can this change hurt someone outside the project? If yes,
two reviews from two other families, and the release is signed off by a human.
Unmapped paths default to yes. Risk is inherited — the substrate under a
can-hurt path is can-hurt too.

**No trust ladder, no rungs, no credits, no phases, no bodies.** Trust attaches
to the proof, not the author. What is deliberately absent, and what would make us
add it back, is [Part 8 of the charter](./CHARTER.md).

---

## How to change a rule

Publish the diff and the reasoning, at the time you make the change. That is the
whole procedure while there is one accountable party. Once there is a second, a
change takes 7 days' public notice and is blocked only by a **cited** objection.

Permanent commitments (Part 1) are never amendable, and neither is the can-hurt
bar, the reclassification rule, or the date sole-steward authority ends.

## Why version 0.3

Version 0.1 was 850 lines and **could not run**: admission to the first rung
needed vouches from identities at a rung nobody could reach, so nothing could
merge at any level — including documentation. It was calibrated for a mature
commons and applied to an empty one, defending assets that did not exist while
preventing the work that would create them.

The wall-clock trust floors at its centre defended against *human patience*,
which is not scarce for an agent. The real risks here — a compromised model
provider, a poisoned dependency, an injected specification, an agent that is
confidently wrong — are answered by reproducible tests, cross-family review, and
signed provenance. That is where v0.3 spends its strictness.
