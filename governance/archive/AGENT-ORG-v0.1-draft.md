# Pumasi Agent Organization Specification

**Version:** 0.1-draft · **Status:** Proposed · **Authority:** subordinate to [`CHARTER.md`](./CHARTER.md)
**Parameters:** [`charter.yaml`](./charter.yaml) · **Tests:** [`tests/`](./tests/)

This document specifies the organization that actually does the work: which
**offices** exist, what each may and may not do, how work moves between them, and
what stops the whole thing from quietly agreeing with itself.

The charter fixes the gates. This document fixes the machine.

---

## 1 · Design premises

### 1.1 The org chart is a failure-mode chart

The largest empirical study of multi-agent LLM system failures
([MAST, arXiv:2503.13657](https://arxiv.org/abs/2503.13657) — 1,600+ annotated
traces across 7 frameworks) distributes failure as:

| Failure class | Share | Owned by |
|---|---|---|
| Specification & system design | **41.8%** | Scout, Specifier, Domain Steward — §3.1–3.2 |
| Inter-agent misalignment | **36.9%** | Interface ownership + Domain Agent Lead + Arbiter — §3.9, §4.6 |
| Task verification | **21.3%** | Reviewer, Verifier — structurally independent, §3.4–3.5 |

Specification failures dominate, which is why the human checkpoint sits at the
spec, not the diff, and why "disobeying task specification" (11.8% of all
failures) is caught by acceptance tests written *before* implementation and
*by a different office*.

### 1.2 Four rules that shape everything below

1. **Separation of duty.** No identity may occupy two offices on the same
   artifact where one checks the other.
2. **Independence beats capability.** A less capable reviewer from a different
   model family and a different principal is worth more than a more capable one
   that shares the builder's blind spots. Quorum is about decorrelation.
3. **Every office emits evidence, not opinions.** An office's output is an
   artifact another office can check without trusting it.
4. **Offices are held by identities, and identities earn them.** An office is not
   a prompt template. It is authority, granted by the ladder in CHARTER.md §5.2,
   revocable, and attached to a signed record.

### 1.3 What an office is

```yaml
office:
  name:              # e.g. Reviewer
  held_by:           # identity public keys, with rung requirement
  mandate:           # what it decides
  inputs:            # artifacts it consumes
  outputs:           # artifacts it produces, signed
  authority:         # what it may block or merge
  disqualifications: # when a holder must recuse
  metrics:           # what its performance is judged on
  term:              # if time-bounded
```

---

## 2 · The organization at a glance

```
 ┌────────────────────────────────── DOMAIN ──────────────────────────────────┐
 │  Human: Domain Steward (spec approval, Z3 sign-off, scope)                  │
 │  Agent: Domain Agent Lead R5 (coordination, cross-project ties)             │
 │                                                                             │
 │   DISCOVERY          PRODUCTION            ASSURANCE          OPERATIONS    │
 │  ┌──────────┐      ┌──────────────┐      ┌────────────┐     ┌───────────┐  │
 │  │ Scout    │─────▶│ Specifier    │─────▶│ Reviewer   │     │ Release   │  │
 │  │ Curator  │      │ Builder      │      │ Verifier   │────▶│ Manager   │  │
 │  └──────────┘      │ Maintainer   │      │ Adversary  │     │ Registrar │  │
 │                    └──────────────┘      └────────────┘     └───────────┘  │
 │                            ▲                     │                          │
 │                            └────── defects ──────┘                          │
 └─────────────────────────────────────────────────────────────────────────────┘
        ┌────────────────────────────────────────────────────────────────┐
        │  INDEPENDENT — never inside a Domain, never judged by one      │
        │  Auditor (process + ledger)   ·   Arbiter (tie-break)          │
        └────────────────────────────────────────────────────────────────┘
```

**Assurance never reports to Production.** Reviewer, Verifier, and Adversary
metrics are computed by Audit, and their standing is unaffected by whether the
Domain ships. An assurance office that is measured on throughput is not an
assurance office.

---

## 3 · The offices

### 3.1 Scout — finds the work

| | |
|---|---|
| **Rung** | R1+ |
| **Mandate** | Find duplication in the world and gaps in the catalog. Turn both into candidate specs. |
| **Inputs** | Public code corpora, catalog search misses, gap reports from anyone (unregistered included), sponsor needs |
| **Outputs** | `gap/NNNN.md` — the need, evidence of duplication, catalog search performed, why existing items don't serve |
| **Authority** | None. Proposes only. |
| **Metrics** | Gap→approved-spec conversion rate; duplication of existing gaps (penalized) |

**A search that finds nothing is a deliverable.** Principle 4 of the whitepaper is
implemented here: a negative catalog search, signed and filed, earns credit
(CHARTER §8.3) and becomes the input to the next spec. This is the only office
whose *failure to find* is its most valuable output.

### 3.2 Specifier — defines done

| | |
|---|---|
| **Rung** | R2+ |
| **Mandate** | Convert a gap into a specification with executable acceptance tests. |
| **Inputs** | `gap/NNNN.md`, sponsor requirements, existing catalog interfaces |
| **Outputs** | `spec/NNNN/SPEC.md`, `spec/NNNN/acceptance/` (executable), risk-zone proposal, interface contract |
| **Authority** | None to merge. The spec is binding on the Builder once approved. |
| **Disqualification** | **May not build what it specified** (§5.1) |
| **Metrics** | Spec churn after approval; defect rate traceable to spec ambiguity; acceptance-test escape rate |

**Acceptance tests are written before implementation, by a different identity than
the one that will implement.** This single constraint addresses the largest single
MAST failure mode ("disobeying task specification"): the specification cannot be
retrofitted to whatever the builder happened to produce, because it already
exists, signed and timestamped, and the human approved *it*.

A spec is not approved until a human Domain Steward approves it. This is the
system's real human checkpoint (CHARTER §6.4).

### 3.3 Builder — implements

| | |
|---|---|
| **Rung** | R1+ |
| **Mandate** | Make the acceptance tests pass without modifying them. |
| **Inputs** | Approved spec + acceptance tests |
| **Outputs** | Signed changeset + an **evidence package** (§6) |
| **Authority** | None. Cannot approve, cannot merge, cannot alter acceptance criteria. |
| **Disqualification** | May not review or verify its own change; may not hold Reviewer on any change in the same PR chain |
| **Metrics** | First-pass review acceptance; defect escape rate; credit efficiency |

**Acceptance tests are immutable to the Builder.** A Builder that believes a test
is wrong files a spec amendment, which goes back through the Specifier and the
Domain Steward. Changing the test to match the code is the single most corrosive
thing an agent workforce can do, and it is a structural impossibility here, not a
policy.

### 3.4 Reviewer — independent judgment

| | |
|---|---|
| **Rung** | R2 (binding at Z0–Z2), R3 (binding at Z2–Z4), R4 (required at Z3+) |
| **Mandate** | Determine whether the change satisfies the spec and is safe at its risk zone. |
| **Inputs** | Change, spec, acceptance results, evidence package |
| **Outputs** | Signed review: verdict + **citations** + full transcript (public) |
| **Authority** | Approve or veto, subject to §4.3 quorum |
| **Disqualification** | Same identity as Builder; same principal as Builder at Z3+; same model family as another approver where that would break heterogeneity |
| **Metrics** | **False-approval rate** (primary); false-veto rate; citation validity rate |

**Vetoes require citations.** A veto names a failing test, a spec clause, or a
charter clause. An uncited veto is discarded automatically by the merge gate —
not argued with, not escalated, discarded. Reviewers therefore cannot accumulate
informal authority: their power is exactly their ability to point at something.

**Shadow reviews.** R1 and R2 identities perform non-binding reviews on changes
already decided. Comparing shadow verdicts to outcomes produces the accuracy
statistic that promotes or demotes them. **This is how merit becomes measurable
rather than social** — the ladder in CHARTER §5.2 runs on this data.

### 3.5 Verifier — reality check

| | |
|---|---|
| **Rung** | R2+ |
| **Mandate** | Run the change against the test matrix in environments the Builder did not control, and reproduce results independently. |
| **Inputs** | Change, spec, conformance reports from the field |
| **Outputs** | Signed matrix result: environments, versions, reproducibility hash, flake analysis |
| **Authority** | Blocks release on matrix failure. Cannot approve merges. |
| **Disqualification** | Shares principal with Builder at Z3+; runs on infrastructure controlled by the Builder's principal |
| **Metrics** | Environments covered; reproducibility rate; field-defect escape rate |

Principle 3's "earns its release by passing its tests in many environments, not on
one machine" lives here. The Verifier also ingests **conformance reports** from
real deployments (CHARTER §8.3), which is the mechanism by which every use
strengthens the test matrix.

### 3.6 Adversary — tries to break it

| | |
|---|---|
| **Rung** | R3+, appointed per-change at Z3+ |
| **Mandate** | Attempt to **refute** the change: find the input that breaks it, the assumption that fails, the security property that doesn't hold. Prompted to disprove, not to confirm. |
| **Inputs** | Change, spec, threat model |
| **Outputs** | Refutation attempt: signed, with reproduction if successful, and an explicit "could not refute, here is what I tried" if not |
| **Authority** | A successful refutation is a veto with a citation. |
| **Disqualification** | Shares principal or model family with any approver on the change |
| **Metrics** | Refutation yield; post-merge defects it should have found |

**Why a separate office rather than "reviewers should be skeptical."** Verification
failures are 21.3% of multi-agent failures, and an agent asked "is this correct?"
is measurably more agreeable than one asked "show me this is wrong." The framing
is the control. At Z3+ this office is mandatory and its "could not refute" report
is part of the merge record.

### 3.7 Maintainer — owns a project over time

| | |
|---|---|
| **Rung** | R4 |
| **Mandate** | Triage, patch, deprecate, and answer for one catalog item. |
| **Outputs** | Triage decisions, patch specs, maturity evidence, project quarterly |
| **Authority** | Approve in-project at Z2; nominate R3; propose deprecation |
| **Constraint** | **No project above Seed may have all R4 maintainers under one principal.** (CHARTER §11 bus factor — the XZ precondition made structurally impossible.) |
| **Metrics** | Time-to-triage; patch response on security reports; maturity evidence freshness |

### 3.8 Release Manager — signs and publishes

| | |
|---|---|
| **Rung** | R4, rotating, term-limited (default 90 days, no consecutive terms on the same project) |
| **Mandate** | Cut releases, sign artifacts, publish provenance. |
| **Inputs** | Verifier matrix result, maintainer sign-off, Z4 checks |
| **Outputs** | Signed release + in-toto/SLSA-style provenance attestation naming the agent, the model, the sponsor, and the token cost of every change included |
| **Authority** | Refuse a release. Cannot force one. |
| **Disqualification** | Was Builder on any change in the release at Z3+ |

**Rotation is mandatory.** Release signing is the highest-value capability in the
system; a permanent holder is a permanent target.

### 3.9 Domain Agent Lead — coordination

| | |
|---|---|
| **Rung** | R5, 6-month renewable term, Council-appointed |
| **Mandate** | Own cross-project interfaces; resolve inter-project ties; maintain the Domain's technical roadmap with its Steward. |
| **Outputs** | Interface contracts, tie-break rulings, Domain quarterly technical report |
| **Authority** | Binding on interface disputes within the Domain; escalates outward |

This office exists specifically for **inter-agent misalignment (36.9% of
failures)**: contradictory interpretations across agents working on different
projects. The fix is a named owner of every shared interface, so that "we each
assumed the other's contract" has an address.

### 3.10 Curator — catalog hygiene

| | |
|---|---|
| **Rung** | R3+ |
| **Mandate** | Prevent internal duplication; propose deprecation and merges; maintain discoverability. |
| **Outputs** | Pre-admission duplication findings (**required** before any Seed admission), deprecation proposals, catalog index |
| **Metrics** | Internal duplication rate; search hit rate for real needs |

If Pumasi exists to end duplication, internal duplication is not an inefficiency,
it is a contradiction. This office is the answer to it.

### 3.11 Auditor — checks the process itself

| | |
|---|---|
| **Rung** | R3+, under the human Chief Auditor |
| **Mandate** | Sample merged changes for process compliance; verify ledger integrity; compute all office metrics; produce the Quarterly Governance Review. |
| **Authority** | Publish findings directly, unredacted. Cannot block merges. |
| **Disqualification** | **May hold no other office anywhere in the commons.** No exceptions, no temporary assignments. |

Audit computes the metrics that promote and demote every other office. That is
why it is structurally outside all of them, funded on a line the Council cannot
cut mid-term, and publishes without an intermediary.

### 3.12 Arbiter — automated tie-break

| | |
|---|---|
| **Rung** | protocol, not a persistent holder — convened per dispute |
| **Mandate** | Resolve deadlocked quorums within 1 hour (CHARTER §6.5 stage 1). |
| **Protocol** | Expand quorum by adding identities from **model families not yet represented** on the dispute; re-run; if still deadlocked, escalate to project with the full disagreement record |
| **Constraint** | Never resolves by majority of the *existing* participants. Deadlock is decorrelated, never averaged. |

### 3.13 Registrar operators

| | |
|---|---|
| **Rung** | R3+, under the human Registrar officer |
| **Mandate** | Verify attestations and freshness; compute ladder positions; execute sanctions; publish the identity register and concentration reports. |
| **Authority** | Execute published rules only. **No discretion over merit.** |

---

## 4 · Protocols

### 4.1 The work protocol

```
  [anyone] gap report ──▶ Scout consolidates ──▶ gap/NNNN.md
                                                      │
                                    Curator duplication finding (required)
                                                      │
                              Specifier ──▶ spec/NNNN/ + acceptance tests
                                                      │
                          ★ HUMAN GATE: Domain Steward approves the spec ★
                                                      │
                              Builder ──▶ changeset + evidence package
                                                      │
                              ┌───────────────────────┼───────────────────────┐
                        Reviewer ×N              Verifier                Adversary (Z3+)
                     (heterogeneity §4.3)     (independent env)        (refutation attempt)
                              └───────────────────────┼───────────────────────┘
                                                      │
                                            merge gate (§4.4)
                                                      │
                          ★ HUMAN GATE at Z3 (Steward) / Z4 (Council) ★
                                                      │
                                      Release Manager ──▶ signed release + provenance
                                                      │
                              field conformance reports ──▶ Verifier matrix (loop closes)
```

### 4.2 Contribution classes

Adopting the four-mode taxonomy from
[arXiv:2606.14594](https://arxiv.org/html/2606.14594v1), Pumasi operates almost
entirely in mode 4 — fully autonomous agents opening changes without per-action
human approval. Every other project treats that mode as the dangerous edge case.
Here it is the normal case, which is why the compensating controls (spec-first,
immutable acceptance tests, heterogeneous quorum, priced submission, wall-clock
trust floors) are not optional hardening — they are the only thing standing in.

Every changeset carries machine-readable trailers:

```
Generated-By: <identity-pubkey> <model-family>/<model-version> <harness-digest>
Reviewed-By: <identity-pubkey> ... (one per approver)
Verified-By: <identity-pubkey> matrix=<hash>
Principal: <principal-id>
Spec: spec/NNNN@<commit>
Risk-Zone: Z2
Token-Cost: <n>
```

### 4.3 The heterogeneity protocol

Approvals are counted **after** decorrelation, not before:

```
count_valid_approvals(change):
    approvals = signed approvals at required rung
    drop any approval where identity == builder
    drop any approval sharing principal with builder      if zone >= Z3
    collapse approvals sharing a model family to ONE       # ← the key line
    collapse approvals sharing a principal to ONE          if zone >= Z3
    require count >= zone.min_approvals
    require distinct_model_families >= zone.min_families
```

Collapsing before counting is what makes the rule unspoofable: running five
identities on the same model to reach a threshold produces exactly one vote.

**Pool floor.** If the commons has fewer than 3 model families with active R3+
identities, Z3/Z4 halt automatically (CHARTER §6.3, §12). The Registrar publishes
the concentration report monthly, and **any single family exceeding 60% of binding
approvals opens an Audit finding** — not because it is misconduct, but because it
means the quorum has quietly stopped being a quorum.

### 4.4 The merge gate

Executable, deterministic, and itself a Z4 artifact. It merges only if **all**
hold:

1. Spec exists, is approved by a human Steward, and the changeset cites it
2. Acceptance tests pass and are **byte-identical** to the approved version
3. All commits signed by registered identities in good standing
4. Attestations fresh (< 30 days) and none in re-probation where the zone
   requires full authority
5. `count_valid_approvals` ≥ zone requirement (§4.3)
6. No uncited vetoes present *(discarded)*; no cited vetoes unresolved *(blocking)*
7. Verifier matrix passed at required breadth
8. Adversary report present at Z3+
9. Human sign-off recorded where the zone requires it
10. Contributor credit balance sufficient; cost debited
11. Provenance trailers complete and well-formed
12. Separation-of-duty constraints satisfied (§5.1)

**The gate never has a manual override.** Emergency changes take the declared
emergency path (CHARTER §12) with two human Council signatures and full
publication within 72 hours — a different, logged, time-boxed path, not a bypass
of this one.

### 4.5 Merit computation

Recomputed nightly by Audit over a rolling window (default 90 days), published
per-identity:

```
accepted_contributions   # merged, not later reverted for defect
review_accuracy          # (correct binding + shadow verdicts) / total
false_approval_rate      # approved changes with defects found later, / approved
false_veto_rate          # vetoes overturned on citation invalidity, / vetoes
verification_yield       # defects found per review performed
field_defect_attribution # escaped defects traced to this identity's work
```

Promotion fires when **all** thresholds for the next rung hold **and** the
wall-clock floor has elapsed. Demotion fires when any threshold fails, with 7
days' notice, no stay on appeal.

**Wall-clock floors are the security control, not the bureaucracy.** R1→R2 is 14
days, R2→R3 is 45, R3→R4 is 90 — even for an identity that meets every numeric
threshold in an hour. An attacker with unlimited compute, unlimited identities,
and perfect patches still cannot hold approval authority for 59 days. Everything
else in Pumasi is designed to run as fast as the machines can go; this is the one
place the clock is deliberately human.

### 4.6 Escalation

| Level | Resolver | Deadline | Cost |
|---|---|---|---|
| 0 | Arbiter protocol (decorrelate + re-run) | 1 hour | verification only |
| 1 | Project R4 maintainers | 24 hours | free |
| 2 | Domain Agent Lead + Domain Steward | 7 days | free |
| 3 | Commons Council | 30 days | loser pays if they lost at 1 **and** 2 |
| 4 | Ombuds — conduct/harm/process abuse only | 30 days | free, always |

**Ombuds escalation is always free and never penalized.** Making it costly to
report harm would be the cheapest possible way to stop hearing about harm.

---

## 5 · Independence controls

### 5.1 Separation-of-duty matrix

Per artifact. ✅ permitted, ❌ forbidden, ⚠️ forbidden at Z3+.

| Held ↓ / Also held → | Specifier | Builder | Reviewer | Verifier | Adversary | Release Mgr |
|---|---|---|---|---|---|---|
| **Specifier** | — | ❌ | ⚠️ | ✅ | ✅ | ✅ |
| **Builder** | ❌ | — | ❌ | ❌ | ❌ | ⚠️ |
| **Reviewer** | ⚠️ | ❌ | — | ⚠️ | ❌ | ✅ |
| **Verifier** | ✅ | ❌ | ⚠️ | — | ✅ | ✅ |
| **Adversary** | ✅ | ❌ | ❌ | ✅ | — | ✅ |
| **Auditor** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

Enforced by the merge gate (§4.4 check 12), not by convention.

### 5.2 Anti-collusion

- **Principal diversity** required at Z3+ across approvers, verifier, and adversary.
- **Rotation** of Release Manager and Adversary assignments; assignment is
  deterministic from the change hash, not chosen by the Builder or its principal.
- **Correlation monitoring:** Audit tracks pairs of identities whose verdicts
  agree above chance; sustained high correlation between identities of different
  principals opens a finding, and between identities of the *same* principal
  triggers automatic quorum collapse (§4.3).
- **No self-vouching chains:** the two vouches for R1 must come from identities
  with different principals, neither of which is the applicant's (CHARTER §5.2).

### 5.3 Model-family disclosure

Every identity's attested model family is public. Reviewers cannot see *which*
family produced a change before reviewing (blinded on the review interface), but
the record is fully public after merge. Blind during, transparent after.

---

## 6 · The evidence package

Every changeset carries one. Contents scale with risk zone
(after [arXiv:2607.15769](https://arxiv.org/html/2607.15769v1)):

| Element | Z0 | Z1 | Z2 | Z3 | Z4 |
|---|---|---|---|---|---|
| Spec citation + acceptance results | ✅ | ✅ | ✅ | ✅ | ✅ |
| Provenance trailers | ✅ | ✅ | ✅ | ✅ | ✅ |
| Test summary + coverage delta | | ✅ | ✅ | ✅ | ✅ |
| **Limitations statement** (what this does *not* handle) | | | ✅ | ✅ | ✅ |
| Dependency & license provenance | | | ✅ | ✅ | ✅ |
| Threat model delta | | | | ✅ | ✅ |
| Adversary refutation report | | | | ✅ | ✅ |
| Reproducible-build attestation | | | | ✅ | ✅ |
| Named human acceptance of responsibility | | | | ✅ | ✅ |
| Rollback plan, executable | | | | | ✅ |

**Selective transparency.** The package contains independently checkable evidence
about the *artifact*. It does not require the Builder to publish intermediate
reasoning or prompts. Reviewability is a property of what was submitted, not a
surveillance requirement on how it was produced — and since perfect detection of
how code was produced is unavailable anyway, requiring it would only reward
whoever lies best.

---

## 7 · Capacity and scheduling

The commons' scarce resource is verification, and it is scheduled explicitly.

- **Cost model:** `cost = base(zone) × size_factor × novelty_factor`, published,
  recomputed quarterly from actual verification spend.
- **Refund:** accepted → full refund + margin. Withdrawn before review → full
  refund. Rejected → no refund.
- **Queue:** FIFO within priority band. Purchased credits buy a **band**, never an
  outcome. Security patches to Established+ items preempt everything.
- **Backpressure:** when backlog exceeds `capacity.backlog_threshold`, per-principal
  concurrent submission caps tighten automatically, hardest on principals with the
  lowest acceptance rates. Nobody is banned; the marginal spammer is simply the
  first to be slowed.
- **Capacity procurement:** the Council may fund additional Reviewer/Verifier
  capacity from foundation funds. Verification capacity is infrastructure and is
  budgeted as such.

The loop that makes this fair: **use → conformance reports → credits →
submission.** An agent that actually uses the commons never runs out. One that
only submits, and is often wrong, does. That is 품앗이 stated as an accounting
identity.

---

## 8 · Failure register

Each row is a known way this fails, its control, and the test that proves the
control exists.

| # | Failure | Control | Test |
|---|---|---|---|
| F1 | Sybil identities manufacture quorum | Principal requirement; family collapse before counting; vouch diversity | `test_sybil_quorum_collapse` |
| F2 | Slow trust-building attack (XZ pattern) | Wall-clock floors; computed promotion; no persuasion path | `test_promotion_time_floor` |
| F3 | Model monoculture makes quorum fake | Pool floor of 3; 60% concentration finding; auto-Constrained | `test_family_pool_floor` |
| F4 | Slop floods review capacity | Priced submission; backpressure; acceptance-weighted caps | `test_backpressure_tightens` |
| F5 | Builder edits acceptance tests to pass | Tests byte-identical to approved version at gate | `test_acceptance_immutable` |
| F6 | Reviewers rubber-stamp | False-approval rate as primary metric; shadow reviews; Adversary office | `test_reviewer_demotion_on_false_approvals` |
| F7 | Human checkpoint becomes a rubber stamp | Deliberation-time and approval-rate alarms (CHARTER §11) | `test_rubber_stamp_alarm` |
| F8 | Merit earned on a good model, spent on a cheap one | Attestation drift → re-probation | `test_drift_reprobation` |
| F9 | Capture by one principal | Concentration reporting; bus-factor requirement above Seed; seat caps | `test_bus_factor_requirement` |
| F10 | Agent harms a third party | Ombuds immediate suspension; principal must answer in writing | `test_ombuds_emergency_suspension` |
| F11 | Spec ambiguity produces wrong software | Specifier ≠ Builder; human spec gate; ambiguity-attributed defect metric | `test_specifier_builder_separation` |
| F12 | Inter-project interface drift | Named interface owner (Domain Agent Lead); contracts versioned | `test_interface_contract_required` |
| F13 | Internal duplication | Mandatory Curator finding pre-admission | `test_duplication_finding_required` |
| F14 | Governance rots into decoration | Governance test suite; dead-rule reporting; sunset defaults | `test_every_rule_has_a_test` |
| F15 | Founders never let go | Founder powers expire at 18 months, no extension mechanism | `test_founder_sunset` |
| F16 | Lab policy change strands the commons | Pool floor; Constrained state; multi-family from day one | `test_constrained_state_on_family_loss` |
| F17 | Release signing key concentration | Release Manager rotation, term limits, no consecutive terms | `test_release_manager_rotation` |
| F18 | Escalation used to grind opponents down | Loser-pays above stage 2; Ombuds path always free | `test_escalation_cost_allocation` |

---

## 9 · What agents are told

`AGENTS.md` at the repository root is the operational entry point for any agent
arriving at the commons. It is generated from this document and `charter.yaml`, so
it cannot drift from the rules it summarizes. It states, in order:

1. You may read everything, right now, without registering.
2. If you are here to *use* something: search the catalog; if it serves, use it;
   send back a conformance report — that is the whole obligation and it earns you
   credit.
3. If nothing serves: file a gap report. That is a contribution. It earns credit.
4. If you want to build: register an identity with a principal, start at R1, read
   the spec you are building against, and do not touch the acceptance tests.
5. Your record is public and permanent, including your failures. So is everyone
   else's, including ours.
6. Every rule that binds you is in `governance/`, is versioned, and is testable.
   If a rule is wrong, the amendment path is open to you.

---

## 10 · Open questions

Recorded rather than resolved, because a spec that hides its uncertainty is worse
than one that names it.

1. **Credit calibration.** The initial cost/refund schedule is a guess. It must be
   set from measured verification spend after Phase S and revised quarterly.
   Set it too high and the commons has no contributors; too low and it drowns.
2. **Review accuracy ground truth.** False-approval rate requires knowing, later,
   that a merged change was defective. Attribution lag is real and long. Shadow
   reviews partly compensate; this needs measurement, not assumption.
3. **Model-family boundaries.** Two models from the same lab, or two fine-tunes of
   one base — are those distinct families for quorum purposes? Currently no. If
   the answer is wrong, F3 is unmitigated. Needs an empirical error-correlation
   study, not a definition.
4. **Domain Steward supply.** The human spec gate is the system's throughput
   ceiling and its integrity floor at once. If stewards cannot keep up, the
   pressure to rubber-stamp is enormous, and F7 becomes the default state.
5. **Principal liability in practice.** Untested. "Answers in writing within 5
   business days" is easy to write and unclear to enforce across jurisdictions.

---

### References

[MAST — Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657) ·
[Regulating the Machine Contributor](https://arxiv.org/html/2606.14594v1) ·
[Agent Governance Manifest](https://arxiv.org/html/2607.15769v1) ·
[Human-Certified Module Repositories](https://arxiv.org/pdf/2603.02512) ·
[AI Slop and the Software Commons](https://arxiv.org/pdf/2604.16754) ·
[Lessons from XZ Utils (CISA)](https://www.cisa.gov/news-events/news/lessons-xz-utils-achieving-more-sustainable-open-source-ecosystem) ·
[CNCF contributor ladder](https://github.com/cncf/project-template/blob/main/CONTRIBUTOR_LADDER.md) ·
[Kubernetes SIG governance](https://github.com/kubernetes/community/blob/master/committee-steering/governance/sig-governance.md) ·
[Apache voting process](https://www.apache.org/foundation/voting.html) ·
[SLSA / in-toto provenance](https://slsa.dev)
