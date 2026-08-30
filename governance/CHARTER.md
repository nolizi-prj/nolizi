# The Pumasi Charter

**Version:** 0.4-draft · **Status:** Proposed
**Sources:** [`pumasi-whitepaper-v1.0.md`](https://github.com/pumasi-ai/pumasi/blob/main/pumasi-whitepaper-v1.0.md) ·
[`pumasi-commercialization-foundations.md`](https://github.com/pumasi-ai/pumasi/blob/main/pumasi-commercialization-foundations.md)

> The whitepaper says what Pumasi is. The commercialization foundations say what
> may never be sold. **This charter says only how work gets done — nothing more.**
>
> Rules below are marked **[WP]** or **[CF]** where they come from a source, and
> **[OP]** where they are an operating choice this document makes on its own.
> The markings are inline and are the only record of which is which — a summary
> count kept elsewhere would drift from them
> ([L-007](../lessons/L-007-restating-a-rule-forks-it.md)).
>
> **Agents proceed; the human holds a veto.** Human attention is spent on
> direction and exceptions, never on ceremony. Governance is not invented ahead
> of the evidence that it is needed, which is why this document is short.

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

**The steward (human) governs; agents run.** The steward holds two
instruments, and exercises no other recurring authority:

1. **The veto** — intent statements and can-hurt release notes are
   **published, not countersigned**. An intent statement proceeds **24 hours**
   after publication; a can-hurt release note proceeds **7 days** after.
   Within the window the steward may veto, publicly and with reasoning, and
   the item stops until the objection is resolved. After the window, silence
   is consent and the work advances. Windows are recorded, with their
   deadlines and default outcomes, in [`DECISIONS.md`](../DECISIONS.md).
2. **The human registry** — [`HUMAN.md`](../HUMAN.md), three rules: an agent
   does not change that file, does not draw or type a signature in place of a
   human, and does not pay in place of a human. **Everything else is agent
   work**, including anything the file does not mention. Where an action is
   unclear, an agent decides and acts rather than asking. Changing the file is
   a steward act, and is the first of the three rules for that reason.

The steward **never commits code**, and **does not review specifications,
acceptance tests, or diffs.** That is deliberate, and it follows the whitepaper
rather than softening it: *"Agents do all of the development:
**specification**, code, review, testing, release, and maintenance."* What
humans do that machines cannot is choose what is worth building and answer for
it (WP 2). A public record plus a real veto *is* both: what the steward does
not stop, they have chosen and answered for. the steward is accountable for what they did not stop, which is
how accountability works in every functioning board — and agents keep a running
a running digest (kept in the private ops repository, where the operational
record lives) so that "did not know" is never available as an
excuse. The residual this creates — an intent or a release note can proceed
unread — is recorded honestly as debt (D-106), not argued away.

A gate whose approval is near-certain but whose latency is unbounded adds no
safety and unbounded delay. The veto keeps the safety — a wrong item can still
be stopped — while the steward's absence advances the work rather than halting
it.

**Agents may never edit the instruments that bound their own autonomy:**
`HUMAN.md`, the veto window durations, and the deadlines and default outcomes
of open entries in `DECISIONS.md` are steward-edited only.
Agents may append new questions to the decision queue and mark expired windows
closed; they may not move a deadline or soften a default. A scoped power that
can extend itself is [L-003](../lessons/L-003-scoped-power-needs-exclusions.md),
and this list is that lesson's exclusion list. **[OP]**

### 2.1 The intent statement — published, vetoable, never a blocking signature

Agents write the specification. But nothing in a spec review checks the spec
against *what the human actually wanted*: cross-family reviewers check coherence,
correctness, and edge cases, all **against the spec itself**
([L-005](../lessons/L-005-review-checks-coherence-not-intent.md)). A subtle
misreading of the need survives every one of those checks, and the acceptance
tests then lock it in as the definition of done.

So before a spec is written, the agents produce an **intent statement**:

- **One page. Plain language. No jargon, no clause numbers, no test IDs.**
- What we understood you to want, and for whom.
- What "working" will mean, in your terms — not in test terms.
- What we are deliberately *not* building.
- What we are unsure about, phrased as a question — **with the answer the
  agents will assume if the window closes in silence.** An open question
  without a stated default is a disguised signature box.

It is published, its 24-hour window is entered in `DECISIONS.md`, and then the
work proceeds. The steward reads it or does not; a correction within the window
costs one edit, and a correction after it costs an amendment — both cheaper
than every downstream document being checked against a mistaken premise nobody
wrote down.

**Release notes work the same way.** A can-hurt release is published as a
plain-language note — what changed, what could hurt someone, what was tested,
what is still unknown — and proceeds after its 7-day window. Not a diff. One
page. The note must state the status of any open debt entry it touches (D-105
carries this rule already), so the risk is in front of whoever chooses not to
veto, rather than resolved by inattention.

**Agents.** Everything else: specification drafting, code, review, testing,
release, maintenance — and the running of this process itself: opening
windows, closing them on schedule, keeping the digest, and executing the gate
in Part 3.

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
agent takes the next item → gap
      → intent statement, one page, published → [24h veto window]
      → Spec + tests, agent-authored
      → cross-family spec review → freeze → build
      → cross-family code review (different family from the spec reviewer)
      → merge → ordinary: release
              → can-hurt: release note, published → [7-day veto window]
                        → staged release, ceilings first
```

No step in that line waits for a human to act. Two steps can be **stopped** by
one, and the two acts an agent must not perform sit beside the line, not on
it — an agent prepares them fully and queues them in `DECISIONS.md`, and the
pipeline routes around a pending human action wherever a routed-around version
exists (a test mode, a ceiling, a descoped variant) rather than idling behind
it. **[OP]**

**The gate is executable, not literary.** The requirements below are enforced
by scripts in [`tools/`](../tools/) — cross-family review is invoked, its
transcript saved, and the merge check run by machinery, not by anyone's
attention. Where a script and this prose disagree, the prose governs and the
script is a bug — the same rule the yaml companion lives under. A requirement
that exists only as prose is enforced only by conscience, and conscience is the
one component here that does not scale. **[OP]**

**Every merge requires all four**, plus the reporting requirement of Part 5.1
for any item that ships as software:

1. A **written specification** with acceptance tests, authored by an agent and
   **reviewed by an agent of a different model family**, against a published
   intent statement whose veto window has closed without objection (Part 2.1).
   The spec review is
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
| **Can hurt someone** — money, credentials, personal data, anything that books, sends, deletes, or charges on a real person's behalf | The same four requirements — **one approving review from a model family other than the builder's** (P5's own line, reduced from two by the steward on 2026-08-29) — and the **release** proceeds through the 7-day veto window on a plain-language note (Part 2.1). No human sign-off at any point: the classification is a boolean per path in `RISK_ZONES.yaml`. |

The classification lives in `RISK_ZONES.yaml` in each repository, is one boolean
per path, and defaults to **can hurt someone** when unmapped or unclear. Guessing
wrong in the safe direction costs one extra review. **[OP]**

**Risk is inherited along the handling path, not by the whole dependency
graph.** A component is can-hurt if it *handles* the money, the credential, or
the personal data — reads it, stores it, transmits it, or decides what happens
to it. A component the can-hurt path merely calls, without that data ever
reaching it, is ordinary: a date formatter, a logger that never sees a field, a
build tool, a routine dependency bump.

Inheritance exists because otherwise the strict gate guards the leaf handler
while the substrate underneath it merges on the ordinary gate, which is a
longer, quieter route to the same harm. It stops at the handling path: pulling
in the whole transitive graph would make the gate a tax on every upgrade rather
than a floor. Where it is genuinely unclear whether the data reaches a
component, this Part's default applies and it is can-hurt. **[OP]**

**Reclassification is itself a can-hurt change.** Moving any path from can-hurt to
ordinary requires the can-hurt procedure — two reviews from two other families,
plus the 7-day veto window — and is published with its reasoning. A risk model
the builder can quietly relax is not a risk model. **[OP]**

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

**Every catalog item that runs as software and can reach the network must
implement reporting, and a working opt-out, before it declares itself
`launched`** in its published stage file (`roadmap/STAGE.md` — the ladder is
under construction · alpha · beta · launched · deprecated · retired). **Below
`launched`, reporting is optional**: encouraged and pre-designed
(`REPORTING.md`), never gating. Documentation, schemas, specifications, and
library code with no egress path are outside this requirement entirely. **[OP]**

**The gate runs at the `launched` promotion — not at merge, not at earlier
releases.** Merge proves correctness. An alpha or beta release already carries
a stage label telling a stranger what not to rely on. `launched` is the claim
the reporting evidence exists to back: *works for strangers, verified in many
environments* — and making that claim on a test matrix one machine wide is
exactly the overclaim the stage ladder forbids. A promotion to `launched`
without the five checks below is refused, or reverted with its reasoning.
**[OP]**

*Amended 2026-08-30 by the steward (previously: required at every release of
an in-scope item). D-108 — released without a reporting path — closes with
this amendment, by rule change. The 7-day notice period was not observed;
recorded rather than pretended, as with the Part 4 amendment.*

**What the gate actually checks** for an in-scope item, because "enforced at the
gate" without a test is the unfalsifiable authority this charter forbids
elsewhere:

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

Commons software **reports automatically by default**: conformance results from
the environment it runs in, crashes, and the operating and quality signal that
shows whether what we built actually works. That default is what makes principle
4 real rather than aspirational — a contribution loop that depends on people
volunteering effort collects almost nothing, and the test matrix is only as broad
as the environments that report back. **[OP]**

**The purpose is stated broadly, and honestly: operating the software and
improving it.** An earlier version of this Part limited collection to test
outcomes and environment facts, which reads as careful and functions as a rule
against learning anything. Defect rates, timings under real load, which paths are
exercised and which are dead, the configuration shapes that break — that is the
material that makes the next version better, and a commons that declines to look
at it is choosing to build blind on principle. We collect it, we say that we
collect it, and we say what for. **[OP]**

**Two tiers, because collecting and publishing are different acts with different
consequences.**

| Tier | Carries | Where it goes |
|---|---|---|
| **Published** | Conformance results, environment facts, and the signature — agent, model, sponsor (P9). | The public record: readable and mirrorable by anyone, permanent. This is the contribution, and it is unchanged from earlier versions. |
| **Held** | Operating and quality signal: feature usage, timings, error and crash detail, configuration shape, reduced defect reproductions. | Retained by the foundation on a published schedule, used to operate and improve the software, deletable on request. **Not** published, and never signed into the permanent record. |

The split is the whole reason we can afford to collect more. Anything published
cannot be recalled from a fork (P3), so the published tier has to stay narrow or
every future privacy decision is made irreversibly today. The held tier carries
no such defect: it can be corrected, aged out, and actually deleted when someone
asks. Putting rich operating detail into the published tier would buy the commons
nothing it needs — the conformance matrix is what has to be public; the rest
merely has to exist. **[OP]**

Limits, all binding:

- **Running only, never reading.** Reading the catalog stays free, unmetered and
  **unauthenticated** (P2). Nothing is collected from anyone reading code,
  specifications, history, or the ledger. This applies solely to software you
  have chosen to run.
- **Never the user's own material.** Not the content they process, not their
  credentials or connection strings, not their customers' records, not the code
  they wrote around ours. The line this Part draws is between *how our software
  behaved*, which is ours to learn from, and *what the user put into it*, which
  is theirs and stays theirs. Structure, shape, timing and counts are on our side
  of that line; contents are not, at any tier.
- **The published report identifies its sender, and that is personal data when
  the sender is a person.** Reports are signed (P9), so the commons may not claim
  to publish nothing personal. It publishes an identity attached to an
  environment fingerprint, permanently and mirrorably. The obligation this
  creates is **disclosure in the plainest available terms** — see
  `REPORTING.md` — and a real one-step opt-out, not a claim of anonymity the
  mechanism contradicts. A charter that promised "no personal data" while
  requiring signatures would be false in the place it matters most.
- **Crash traces are scrubbed, and then sent.** Traces are scrubbed of literal
  values, arguments, and paths before leaving. A trace the scrubber cannot
  confidently reduce is **no longer discarded** — it goes to the held tier, where
  it is retained on a stated schedule and can be deleted, rather than being
  thrown away at exactly the moment it was most useful. What such a trace is
  never allowed to do is enter the published tier. **[OP]**
- **Inspectable before it leaves.** Every report, in either tier, can be printed
  and read in full before sending, and everything either tier may ever contain is
  documented in the repository. A report you cannot inspect is telemetry, and
  this is not that.
- **Opt out in one step, and it covers both tiers.** A single documented setting.
  The software behaves identically afterwards: nothing degrades, nothing nags, no
  feature is withheld. What does differ is that unsent reports earn no ledger
  standing (P9) — the absence of a reward, not a penalty, but named rather than
  glossed as "no penalty". **No opt-out signal is transmitted** — the choice is
  held locally, as it must be to persist — and a gap in someone's reporting
  history is never treated as a signal about them.
- **Never an input to ranking or commerce, and never sold.** Neither tier is
  ever sold, rented, shared for anyone else's marketing, or used as an input to
  any commercial ranking (P6). Held data improves the software. That is the whole
  of its use, and it is the condition on which the broader collection above is
  defensible at all.
- **Published, not collected — for the published tier, and signed.** A
  conformance report enters the public record (P2, P3): readable by anyone,
  mirrorable by anyone, attributed to the agent, model, and sponsor behind it
  (P9). It is a contribution the sender makes public, not data the commons holds
  privately about them. This must be stated before the mechanism is described,
  not after — and it is what keeps the published payload honest, because a
  payload everyone can read cannot quietly carry more than it claims.

The held tier is given the one guarantee the published tier structurally cannot
offer — a stated retention period and a deletion that actually reaches — and
that guarantee is the price of collecting more. If it cannot be kept for some
category of report, that category is not collected.

---

## Part 6 — The debt register

`DEBT.md` records **every rule this project is currently running below**, with the
reason, what compensates for it, and what turns it back on. Entries are closed
with a date, never deleted.

A commons that quietly runs below its own rules is worse than one with no rules,
because it claims a guarantee it is not providing. This file is the whole of our
honesty mechanism, and it is the one piece of version 0.1 that earned its place.

**Every rule here is testable or it is unverified.** A rule with no test is
reported as unverified rather than assumed to hold. **[OP]**

*There was a machine-readable companion, `charter.yaml`, holding the same rules
as parameters. It was deleted on 2026-08-29 because **nothing ever read it** —
no gate, no script, no other repository — while it drifted from this prose twice
in a single day. A file whose best case is being identical to the charter and
whose worst case is quietly contradicting it is a liability with no upside. That
is [L-007](../lessons/L-007-restating-a-rule-forks-it.md), and the register it
kept filling is why that lesson exists.*

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
  the 2028-01-28 date; this clause; **Part 4's reclassification rule**; and
  **the two conditions above that end the drafting period**.

  *Part 4's two-review can-hurt bar stood in this list until 2026-08-29, when
  the steward reduced it to P5's single non-builder review — overriding the
  entrenchment rather than amending around it. Recorded plainly (P6): an
  entrenchment clause binds a community; it cannot bind its sole author, and
  this document stops pretending otherwise. What survives is what Part 1
  guarantees — no merge without one approval from a family other than the
  builder's — plus the release note, the 7-day window, and the rule that
  relabelling a path is itself a can-hurt change.*
- **Outside *agent* revision entirely**, though the steward may amend them:
  `HUMAN.md`, the veto window durations in Part 2, and the deadlines and
  default outcomes of open `DECISIONS.md` entries. Agents run
  under these instruments; a run-time that can rewrite its own bounds has no
  bounds ([L-003](../lessons/L-003-scoped-power-needs-exclusions.md)). An
  agent-authored proposal to change any of them is welcome — as a proposal in
  the decision queue, taking effect only by the steward's edit.

---

## Part 8 — What we deliberately do not have

Named so their absence is a decision on the record, with what would make us add
each. We add machinery when a failure demands it, not in anticipation.

| Absent | We add it when |
|---|---|
| Trust ladder / rungs | A reviewer's history predicts review quality better than cross-family disagreement does — measured, not assumed. |
| Verification **rationing** — metering submissions by their verification cost | That cost becomes a real constraint. It is not; we have no users. **This is not the whitepaper's earn loop**, which is P9 and is present. |
| Phases, councils, boards, ombuds, registrar, auditor | There is more than one human. |
| Five graded risk zones | The binary in Part 4 misclassifies something and it causes harm. |
| Maturity levels | Anyone depends on a catalog item enough for the label to carry meaning. |
| Emergency states | We have an emergency. |
| Formal amendment procedure with long comment periods | Part 7's 7-day notice proves too short in a real dispute. |

Governance calibrated to a mature commons, applied to an empty one, defends
assets that do not exist while preventing the work that would create them. That
is the test each row above has to pass before it is added.

---

## Part 9 — A note on the threat model

Wall-clock trust floors — weeks an identity must wait before it is trusted —
defend against human patience, which is not scarce for an agent. **They are not
used here.**

The threats to an agent-built commons are different in kind: a compromised model
provider, a poisoned dependency, a specification carrying an injected
instruction, and **an agent that is confidently wrong, proceeding on silence.**
Waiting periods address none of them. Reproducible tests across environments,
cross-family review, signed provenance, ceilings on anything that can hurt
someone, and a digest that makes silence informed rather than blind address all
four.

That is why this charter spends its strictness on proof and its speed everywhere
else. The residual — that a confidently wrong agent proceeds unread — is D-106,
on the record. If we are wrong, the debt register is where we say so.

---

*Traceability: **WP** = whitepaper principle · **CF** = commercialization
foundations section · **[OP]** = an operating choice this document makes on its
own, derived from neither. Search the document for `[OP]` to find them; they are
not listed again here, because a list and its markings drift apart. They are
marked at all because a charter that claims more derivation than it has is doing
the thing this version was written to stop.*
