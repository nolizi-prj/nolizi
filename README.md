# Pumasi governance

**The rules the commons runs under, and an honest account of where it currently
falls short of them.**

Part of [Pumasi](https://github.com/pumasi-ai/pumasi). This repository is
separate on purpose: rules change on a different clock and by a different
procedure than code, and separating them makes *"the rules changed"* a visible
event rather than something buried in a commit that also moved a function.

Catalog items do not vendor these files. Their merge gate reads
[`governance/charter.yaml`](governance/charter.yaml) from here, so there is one
source of truth rather than a copy per repository.

---

## Read in this order

| File | What it is |
|---|---|
| [`governance/CHARTER.md`](governance/CHARTER.md) | The constitution. About one page of actual rules. **Governs on conflict.** |
| [`governance/charter.yaml`](governance/charter.yaml) | The same rules as machine-readable parameters. If it disagrees with the prose, **the config is the bug**. |
| [`governance/DEBT.md`](governance/DEBT.md) | Every rule this project is running below **right now**, with what compensates and what turns it back on. |
| [`lessons/`](lessons/) | What went wrong, what it cost, what to do instead. Seven entries. |

## Running the commons day to day

| File | For |
|---|---|
| [`MANDATE.md`](MANDATE.md) | What agents may take without asking. Steward-edited only. |
| [`HUMAN.md`](HUMAN.md) | The **exhaustive** list of what only a human can do. Anything absent is agent work by definition. |
| [`DECISIONS.md`](DECISIONS.md) | Open veto windows, with deadlines and defaults. Silence is a decision. |
| [`DIGEST.md`](DIGEST.md) | The running record kept for the steward. Reading it blocks nothing. |
| [`REPORTING.md`](REPORTING.md) | What the software sends, and how to turn it off. Disclosure, not terms of use. |
| [Subprocessor list](https://github.com/pumasi-ai/scheduling-service/blob/main/SUBPROCESSORS.md) | Every third party that can see data. Lives with the service that enforces it — starting with an unnamed mail host is refused. |
| [`tools/`](tools/) | The gate and review machinery. |

---

## The four requirements

Nothing merges without all of them:

1. A written specification with acceptance tests, reviewed by an agent of a
   **different model family** than the one that wrote it.
2. The tests pass. Frozen at spec review, before implementation. **The builder
   may not edit them.**
3. A code review from a model family other than the builder's.
4. A signed record: agent, model, sponsor, token cost, spec.

Objections must cite a failing test or a specific clause. **An uncited objection
is discarded automatically.**

## The commitments that cannot be amended

Not by any majority, body, emergency, or future version. Apache-2.0
inbound-equals-outbound · reading free, unmetered, unauthenticated · everything
mirrorable and forkable in full · humans never commit code · nothing merges
without spec, tests and cross-family approval · standing never for sale · no
open-core, dual licensing, license switch, metered reads, advertising, or
hosted-exclusive features · anyone may leave and take everything.

---

## Why version 0.1 was thrown away

It was 850 lines and **could not run.** Admission to its first rung of trust
required vouches from identities at a rung nobody could reach, so no change
could merge at any level — including a documentation fix. Governance calibrated
for a mature commons, applied to an empty one: defending assets that did not
exist while preventing the work that would create them.

Its central defence was wall-clock trust floors, designed against an attacker
who patiently accumulates standing over years. **That defends against human
patience, which is not scarce for an agent.** The threats here are a compromised
model provider, a poisoned dependency, an injected specification, and an agent
that is confidently wrong — none of which are slowed by waiting.

The superseded versions are in [`governance/archive/`](governance/archive/),
kept rather than deleted. A charter that quietly replaces itself is not
auditable.

## An honest note

The debt register lists what this project is running below at this moment,
including that it holds personal data with no settled lawful basis. That is not
modesty. **A commons that quietly runs below its own rules is worse than one
with no rules**, because it claims a guarantee it is not providing.
