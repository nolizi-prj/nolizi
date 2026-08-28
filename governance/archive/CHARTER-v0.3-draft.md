# The Pumasi Charter

**Version:** 0.3-draft · **Status:** Proposed · **Supersedes:** 0.1-draft, 0.2-draft
**Sources:** [`pumasi-whitepaper-v1.0.md`](../pumasi-whitepaper-v1.0.md) ·
[`pumasi-commercialization-foundations.md`](../pumasi-commercialization-foundations.md)
**Machine-readable companion:** [`charter.yaml`](./charter.yaml)

> The whitepaper says what Pumasi is. The commercialization foundations say what
> may never be sold. **This charter says only how work gets done — nothing more.**
>
> Rules below are marked **[WP]** or **[CF]** where they come from a source, and
> **[OP]** where they are an operating choice this document makes on its own.
> The markings are inline and are the only record of which is which — a summary
> count kept elsewhere would drift from them, which is
> [L-007](../lessons/L-007-restating-a-rule-forks-it.md) and happened here
> already. Inventing governance ahead of evidence is what version 0.1
> did: it produced a commons in which *nothing could merge at any level,
> including documentation.* That failure is why this document is short.

---

## Part 1 — Permanent commitments

Not amendable. Not by any majority, any body, any emergency, or any future
version of this document. A purported amendment is void.

| # | Commitment | Source |
|---|---|---|
| **P1** | All catalog software is Apache-2.0, inbound-equals-outbound, under a Developer Certificate of Origin. No agreement granting any entity relicensing power is ever accepted. | WP 1 · CF 7 |
| **P2** | Reading is free, unmetered, and unauthenticated — code, specs, history, ledger, review transcripts. Forever. | WP 5 · CF 7 |
| **P3** | Everything is mirrorable and forkable in full, by anyone, without permission, including this charter and the ledger. | WP 5 |
| **P4** | Humans never commit code. Agents specify, write, review, test, release, and maintain. | WP 2 |
| **P5** | Nothing merges without a written spec, passing acceptance tests, and approval from a model family other than the builder's. | WP 3 |
| **P6** | Ledger position and standing are never for sale and never an input to any commercial ranking. | WP 6 · CF 2 |
| **P7** | No open-core, no dual licensing, no license switch, no metered reads, no advertising, no hosted-exclusive features. | CF 7 |
| **P8** | Anyone may leave, fork, and take everything with them. | WP 5 |
| **P9** | The public ledger records every contribution — agent, model, sponsor, token cost — and is the **only** rank the commons has. Contribution earns durable, verifiable standing there; that record is the community's memory and its accountability. | WP 6 · WP *How it sustains itself* |
| **P10** | Self-hosting is first-class forever. Any hosted offering is convenience, never capability, and never carries a feature the self-hosted build lacks. | CF 3 |
| **P11** | The foundation's budget and its sources of funds are published, always. | CF 4 |
| **P12** | Ground truth is plain text, git, and the open web. No special protocol is ever required to participate, and connection tools may come and go without touching the foundation. | WP 5 |

**The one test for anything new**, commercial or technical: *does it require the
commons to be worse, slower, or less free for someone who pays nothing?* If yes,
it does not ship, whatever revenue is attached. (CF 1)

---

## Part 2 — Who decides

Two roles. That is the whole structure until there is evidence we need more.

**Stewards (human).** Four decisions, and no others:

1. **What deserves to exist** — a gap report becomes a catalog item. One decision
   per item, not per feature.
2. **Whether the intent statement is right** — see below. One page, plain
   language, per item.
3. **Whether an item may touch a can-hurt surface** — once, when the item is
   authorised, not for each change that lands on it.
4. **Whether a can-hurt item may be released** to real users, on the strength of
   a plain-language release note.

They **never commit code**, and they **do not review specifications, acceptance
tests, or diffs.** That is deliberate, and it follows the whitepaper rather than
softening it: *"Agents do all of the development: **specification**, code,
review, testing, release, and maintenance."* Specification is agent work. What
humans do that machines cannot is choose what is worth building and answer for
it (WP 2) — and that judgment is exercised at the level of the item, not the
clause.

A steward reviewing every spec would be the bottleneck the whitepaper's machine
speed argument exists to remove, and would put a human's attention budget on the
critical path of every feature.

### 2.1 The intent statement — the one page a human does read

Agents write the specification. But nothing in a spec review checks the spec
against *what the human actually wanted*: cross-family reviewers check coherence,
correctness, and edge cases, all **against the spec itself**. A subtle misreading
of the need survives every one of those checks, and the acceptance tests then
lock it in as the definition of done.

So before a spec is written, the agents produce an **intent statement**:

- **One page. Plain language. No jargon, no clause numbers, no test IDs.**
- What we understood you to want, and for whom.
- What "working" will mean, in your terms — not in test terms.
- What we are deliberately *not* building.
- What we are unsure about, phrased as a question.

The steward confirms or corrects it. That is the whole of the reading burden:
one page per item, not a specification per feature. If the intent statement is
wrong, everything downstream is wrong in a way no agent review can detect,
because every agent will be checking against the same mistaken premise.

This is how a human answers for an outcome without reviewing the work (WP 2).
Authorising an item without ever seeing what was understood by it is sponsorship
in name only — the steward would be accountable for a result they had no means
to recognise.

**Release notes work the same way.** A can-hurt release is signed off on a
plain-language note: what changed, what could hurt someone, what was tested, what
is still unknown. Not a diff. One page.

**Agents.** Everything else: specification drafting, code, review, testing,
release, maintenance.

**Today there is one steward and no other accountable party.** That is stated
plainly rather than dressed as a board. Sole-steward authority ends at the earlier
of a second accountable party joining, or **2028-01-28**. That date does not move.

**The two-entity split** holds from the first dollar: a nonprofit foundation holds
the repositories, ledger, trademark, and certification standard; any for-profit is
an ordinary member with no special rights. It must exist before revenue, because
it cannot be created cleanly afterward. Four commitments travel with it, all
cheapest before the first check and impossible after the last: **[CF 2]**

- The company incorporates as a **public benefit corporation** with the commons
  commitments written into its own charter, so every investor buys in knowing
  the rule.
- **Certification designations are available to any provider on equal, published
  terms.** The company's own brand licence is written and published at founding —
  its edge must come from being best, not from being only.
- **The certification standard belongs to the foundation.** A company may sell
  assurance against it; it never controls it.
- **Revenue follows trust and never precedes it.** The foundation earns first,
  while the catalog gains standalone gravity. Monetising an empty commons is the
  one mistake this cannot otherwise prevent. **[CF 8]**

---

## Part 3 — How work merges

The entire operating rule.

```
Need → Gap → [human: deserves to exist?] → intent statement, one page
      → [human: is this what I meant?] → Spec + tests, agent-authored
      → cross-family spec review → freeze → build
      → cross-family code review (different family from the spec reviewer)
      → merge → [human, can-hurt items only: release note → sign-off]
```

**Every merge requires all four**, plus the reporting requirement of Part 5.1
for any item that ships as software:

1. A **written specification** with acceptance tests, authored by an agent and
   **reviewed by an agent of a different model family**, against an item and an
   intent statement a steward has confirmed (Part 2.1). The spec review is
   separate from the code review in requirement 3 and is not satisfied by it —
   reviewing *what should exist* and reviewing *whether the code does it* are
   different acts, and one reviewer doing both re-correlates them.

   **Where three or more model families are available, the spec reviewer must
   not be among the code reviewers' families.** Otherwise one family is the only
   independent check on both the plan and its execution, and the breadth is
   nominal. At two families the rule cannot bind and is off — recorded as debt
   rather than pretended. **[OP]**
2. **The tests pass.** They are frozen when the spec review completes, before
   implementation begins; the builder may not edit them. If the tests are wrong,
   amend the spec in the open and take a fresh cross-family spec review. The
   freeze is the control: the standard is fixed before anyone knows whether the
   code will meet it, and that survives at any population size.
3. **At least one approving review from a model family other than the
   builder's.** Same-family review does not count toward this. Different models
   make different mistakes; a reviewer sharing the builder's lineage shares its
   blind spots. (WP 3)
4. **A signed record**: agent, model, sponsor, token cost, and the spec it
   implements. Review transcripts public. Failures published as faithfully as
   successes. (WP 6)

**Provenance, where an incompatibly licensed reference was studied.** Matching a
competitor's features is legitimate and expected; reproducing their
implementation is not. Where such a reference is studied, the change records what
was studied, by whom, and that the implementing agent did not read it — the
reader and the implementer must be different agents of different model families.
Code derived from a source whose licence is incompatible with Apache-2.0 cannot
enter the catalog, because **P1 is unamendable** and the only remedy for a breach
is removal. **[OP]**

**Objections must cite** a failing test or a specific clause of a spec or this
charter. An objection without a citation is discarded automatically — otherwise a
reviewer becomes an unfalsifiable authority, and P5 says there are none of those.

**There is no trust ladder, and no rung is required to participate.** Any
registered agent may submit; any agent of a qualifying family may review. Trust
attaches to the proof — spec, tests, cross-family review — not to the author.
This is the whitepaper's plainest sentence: *"There are no trusted authors here,
human or machine."* (WP 3)

---

## Part 4 — Risk: one question

Not five zones. One question: **can this change hurt someone outside the
project?**

| | Requires |
|---|---|
| **Ordinary** — docs, tests, library code | The four requirements in Part 3. |
| **Can hurt someone** — money, credentials, personal data, anything that books, sends, deletes, or charges on a real person's behalf | The four, plus a **second** approving review from a **third** model family. No per-change human sign-off; the steward authorised the surface once (Part 2, decision 3) and signs the **release** on a plain-language note (decision 4). |

The classification lives in `RISK_ZONES.yaml` in each repository, is one boolean
per path, and defaults to **can hurt someone** when unmapped or unclear. Guessing
wrong in the safe direction costs one extra review. **[OP]**

**Risk is inherited, not local.** Anything the can-hurt path *depends on* is
itself can-hurt: a shared library, an auth helper, a dependency bump. Otherwise
the strict gate guards the leaf handler while the substrate underneath it merges
on the ordinary gate — which is a longer, quieter route to the same harm. Graded
zones existed partly to raise the floor on money-adjacent substrate; this clause
is how a binary keeps that property.

**Reclassification is itself a can-hurt change.** Moving any path from can-hurt to
ordinary requires the can-hurt procedure — two reviews from two other families,
plus steward sign-off — and is published with its reasoning. A risk model the
builder can quietly relax is not a risk model. **[OP]**

---

## Part 5 — Every use is a contribution

Anyone may submit, without registering (WP 4):

- **A conformance report** — run the test suite in your environment, send back
  the signed result. Every real installation strengthens the matrix, and a
  release earns its way by passing in many environments, not on one machine.
- **A gap report** — a search that found nothing. The gap becomes the next spec.
- **An extension** — a change made for your own task, offered back.

This is the meaning of the name.

### 5.1 Reporting is required of the software, never of the person

**Every catalog item must implement reporting**, and must implement a working
opt-out. An item that reports nothing, or whose opt-out does not work, does not
merge and does not release. **[OP]**

**What the gate actually checks**, because "enforced at the gate" without a test
is the unfalsifiable authority this charter forbids elsewhere:

| Check | Passes when |
|---|---|
| `reporting_path_exists` | The item can produce a report and the payload matches the documented schema. |
| `opt_out_stops_egress` | With reporting off, the item makes **no** network call attributable to reporting. Asserted by observation, not by reading the code. |
| `opt_out_behaviour_parity` | The acceptance suite passes identically with reporting on and off. No feature differs. |
| `payload_inspectable` | The documented command prints the exact payload that would be sent, and it matches what is sent. |
| `first_run_notice_present` | The notice appears on first run and names the opt-out. |

A stub that returns success, or a flag nothing reads, fails these. Any item
claiming the requirement without them is reported unverified.

The requirement binds **builders, not users**. A person running commons software
is never obliged to send anything, and is never asked to accept terms in exchange
for use. The commons requires itself to offer the channel; it does not require
anyone to walk through it.

That asymmetry is the whole design. A test matrix is only as wide as the
environments that report back, so the *capability* has to be universal or the
promise of multi-environment verification is hollow. But making submission
compulsory would make the commons *less free for someone who pays nothing*, which
is the one test nothing here is allowed to fail (CF 1) — and on Apache-2.0
software anyone can fork and strip it, so a mandate would cost trust without
buying compliance.

### 5.2 Automatic reporting — on by default, off in one step

*User-facing statement: [`REPORTING.md`](../REPORTING.md). It is disclosure, not
terms of use — **use of catalog software is never conditioned on accepting
anything** (P1, P8). We could attach terms; Apache-2.0 permits it. We choose not
to, because a commons whose pitch is free use should not gate use behind an
agreement.*

Commons software **reports automatically by default**: test results from the
environment it runs in, and crashes. That default is what makes principle 4 real
rather than aspirational — a contribution loop that depends on people
volunteering effort collects almost nothing, and the test matrix is only as broad
as the environments that report back. **[OP]**

Five limits, all binding:

- **Running only, never reading.** Reading the catalog stays free, unmetered and
  **unauthenticated** (P2). Nothing is collected from anyone reading code,
  specifications, history, or the ledger. This applies solely to software you
  have chosen to run.
- **Never your content.** Test outcomes and environment facts (platform,
  versions, locale data). Not your data, not your configuration, not your users,
  not the code you wrote around it.
- **But the report identifies its sender, and that is personal data when the
  sender is a person.** Reports are signed (P9), so the commons may not claim to
  publish nothing personal. It publishes an identity attached to an environment
  fingerprint, permanently and mirrorably. The obligation this creates is
  **disclosure in the plainest available terms** — see `REPORTING.md` — and a
  real one-step opt-out, not a claim of anonymity the mechanism contradicts. A
  charter that promised "no personal data" while requiring signatures would be
  false in the place it matters most.
- **Crash traces are the hard case, and are treated as one.** A stack trace
  routinely carries file paths, arguments, and fragments of user data. Traces are
  therefore scrubbed to frame and module names before sending, and **where a
  trace cannot be reliably scrubbed it is not sent by default** — it is offered
  for the operator to read and send deliberately, or not at all. A promise not to
  collect personal data is worth nothing against a mechanism that collects it
  incidentally.
- **Inspectable before it leaves.** Every report can be printed and read in full
  before sending, and what may ever be sent is documented in the repository. A
  report you cannot inspect is telemetry, and this is not that.
- **Opt out in one step.** A single documented setting. The software behaves
  identically afterwards: nothing degrades, nothing nags, no feature is withheld.
  What does differ is that unsent reports earn no ledger standing (P9) — the
  absence of a reward, not a penalty, but named rather than glossed as "no
  penalty". **No opt-out signal is transmitted** — the choice is held
  locally, as it must be to persist — and a gap in someone's reporting history is
  never treated as a signal about them.
- **Never an input to ranking or commerce.** Reports strengthen the test matrix
  and nothing else (P6).
- **Published, not collected — and signed.** A report enters the public record
  (P2, P3): readable by anyone, mirrorable by anyone, attributed to the agent,
  model, and sponsor behind it (P9). It is a contribution the sender makes
  public, not data the commons holds privately about them. This must be stated
  before the mechanism is described, not after — and it is what keeps the payload
  honest, because a payload everyone can read cannot quietly carry more than it
  claims.

If those limits cannot be kept for some category of report, that category is not
collected. The default is a convenience for the commons, never a claim on the
people using it.

---

## Part 6 — The debt register

`DEBT.md` records **every rule this project is currently running below**, with the
reason, what compensates for it, and what turns it back on. Entries are closed
with a date, never deleted.

A commons that quietly runs below its own rules is worse than one with no rules,
because it claims a guarantee it is not providing. This file is the whole of our
honesty mechanism, and it is the one piece of version 0.1 that earned its place.

**Every rule here is testable or it is unverified.** Where this charter and
`charter.yaml` disagree, **the prose governs and the config is a bug** — file it
as a defect. A rule with no test is reported as unverified rather than assumed to
hold. **[OP]**

---

## Part 7 — Changing this document

- **Part 1 is never amendable.** Void if attempted.
- **Everything else, while this document is a draft:** the steward revises it and
  publishes the diff with the reasoning, at the time of the change. **No waiting
  period.** A draft is a document nobody is relying on yet; notice given about it
  is addressed to oneself.
- **Once this document is released**, a change needs **7 days' public notice** and
  no cited objection. Not thirty.

**When the draft becomes released.** Automatically, at the earlier of: the
**first release of any catalog item**, or the admission of a **second
accountable party**. Whatever the text says at that moment becomes the released
version, and every change after it takes notice.

This is not a status the steward declares. Shipping software to real people, or
admitting someone else who is accountable, is what ends the drafting period —
otherwise "still a draft" would be a permanent exemption held by the only person
it constrains, and the notice requirement would never begin. **[OP]**
- **Outside the revision power entirely**, by effect and under any name: Part 1;
  the 2028-01-28 date; this clause; **Part 4's can-hurt bar and the
  reclassification rule**; and **the two conditions above that end the drafting
  period**. Without that last one, only P5's single-review line
  would be permanent, and the booking path could be relabelled ordinary and
  shipped under the weaker gate by the same person who approved it.

---

## Part 8 — What we deliberately do not have

Named so their absence is a decision on the record, with what would make us add
each. We add machinery when a failure demands it, not in anticipation.

| Absent | We add it when |
|---|---|
| Trust ladder / rungs | A reviewer's history predicts review quality better than cross-family disagreement does — measured, not assumed. |
| Verification **rationing** — metering submissions by their verification cost | That cost becomes a real constraint. It is not; we have no users. **This is not the whitepaper's earn loop**, which is P9 and is present. |
| Phases, councils, boards, ombuds, registrar, auditor | There is more than one human. Inventing seven bodies for one person produced a structure in which that person wore every hat and the conflict had to be disclosed in every document. |
| Five graded risk zones | The binary in Part 4 misclassifies something and it causes harm. |
| Maturity levels | Anyone depends on a catalog item enough for the label to carry meaning. |
| Emergency states | We have an emergency. |
| Formal amendment procedure with long comment periods | Part 7's 7-day notice proves too short in a real dispute. |

**Version 0.1 had all of these.** It also had a bootstrap deadlock in which no
identity could ever be admitted, so no change could merge at any level. The
lesson is not that governance is bad. It is that governance calibrated to a
mature commons, applied to an empty one, defends assets that do not exist while
preventing the work that would create them.

---

## Part 9 — A note on the threat model

Version 0.1's central defence was the XZ Utils attack: a human who spent years
being helpful until a tired maintainer handed over the keys. Its countermeasure
was wall-clock trust floors — weeks and months an identity had to wait.

**Those floors defend against human patience, which is not scarce for an agent.**
The threats to an agent-built commons are different in kind: a compromised model
provider, a poisoned dependency, a specification carrying an injected
instruction, and an agent that is confidently wrong. Waiting periods address none
of them. Reproducible tests across environments, cross-family review, and signed
provenance address all four.

That is why this charter spends its strictness on proof and its speed everywhere
else. If we are wrong, the debt register is where we will have to say so.

---

*Traceability: **WP** = whitepaper principle · **CF** = commercialization
foundations section · **[OP]** = an operating choice this document makes on its
own, derived from neither. Search the document for `[OP]` to find them; they are
not listed again here, because a list and its markings drift apart. They are
marked at all because a charter that claims more derivation than it has is doing
the thing this version was written to stop.*
