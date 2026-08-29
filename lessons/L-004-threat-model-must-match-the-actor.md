# L-004 · The threat model must match the actor

**2026-08-01**

## What happened

Charter v0.1's central defence was the XZ Utils attack: a contributor who spent
years being helpful until an exhausted maintainer handed over commit rights. The
countermeasure was wall-clock trust floors — 14 days at one rung, 45 at the next,
90 at the one after — so that authority could not be accumulated quickly.

Those floors were the single largest source of delay in the charter, and the
direct cause of the bootstrap deadlock in [L-001](./L-001-governance-ahead-of-evidence.md).

**They defend against patience.** Patience is scarce for a human attacker and
abundant for an agent. In a commons where humans never commit code, the floors
were spending the project's entire speed budget on the one attacker trait that is
not a constraint.

The threats that actually apply to agent-built software are different in kind: a
compromised model provider, a poisoned dependency, a specification carrying an
injected instruction, and an agent that is confidently and subtly wrong. Waiting
periods address none of them. Reproducible tests across environments,
cross-family review, and signed provenance address all four — and the fourth
threat materialised inside this very project, repeatedly (see
[L-002](./L-002-cross-family-review.md)).

## What it cost

The most expensive control in the charter, defending against the one attack the
project's structure had already made difficult, while the actual failure mode was
occurring during the design sessions themselves and being caught by an entirely
different mechanism.

## What to do instead

Before adopting a control, name the actor it constrains and ask whether that
actor's limits apply here. A countermeasure inherited from human open source may
be load-bearing, irrelevant, or actively harmful, and the three look identical in
a document.

Ask: *what does this cost, what does it prevent, and is the thing it prevents
something our actors are even limited by?*

## Signals

- A control justified by a famous incident rather than by an observed failure
- Time-based defences in a system where the actors do not experience time as cost
- Borrowing a mechanism together with its threat model, without re-deriving it
