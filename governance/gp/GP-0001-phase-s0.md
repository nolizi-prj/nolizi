# GP-0001 — Phase S-0 (Solo) and the Governance Debt Register

**Status: WITHDRAWN 2026-08-01** · Opened 2026-07-28 · never ratified

> Withdrawn, not rejected. This proposal patched the trust ladder, the phase
> system, and the verification-credit rules. Charter v0.3 **removes all three**,
> so there is nothing left for it to amend. Its diagnosis was correct and is
> preserved in v0.3's Part 8 and Part 9: the charter was unrunnable at founding
> scale, and the machinery it tried to rescue is what made it so.
>
> Kept rather than deleted — proposals are closed, never deleted.

---

**Original header:** Status: Proposed · **Zone:** Z4 · **Opened:** 2026-07-28
**Comment period:** 30 days (not shortenable — `RULE-16-AMEND`)
**Author:** founding principal · **Affects:** CHARTER.md Part 15, `charter.yaml`, new `governance/DEBT.md`

---

## 1 · The motivating failure mode

The charter's Phase S assumes a Board of ≥5 with ≥2 unaffiliated members and a
working population of accountable principals. It was written for a small founding
group. The actual founding population is **one human and one model family**.

Attempting run one against the charter as written deadlocks immediately:

| Gate | Requires | Reality |
|---|---|---|
| R1 admission | 2 vouches from R3+, distinct principals | 1 principal exists |
| Z1+ merge | ≥2 distinct principals | 1 principal exists |
| Z2 merge | ≥2 distinct model families | 1 family wired |
| Z3 merge | ≥3 of each | — |
| Board | ≥5 seats, ≥2 unaffiliated | 1 human |

This is not a defect in the numbers. It is a **conflation of two independent
properties** that the original charter treated as one:

- **Model-family diversity** buys *decorrelated judgment*. Different models make
  different mistakes. This is the property `RULE-6.3-HETERO` was written for, and
  it remains fully necessary at any population size.
- **Principal diversity** buys *independence of interest* — anti-capture. This
  property is **undefined at n=1**: there is no second party from whom the commons
  could be captured, and no divergent interest to protect against.

Requiring the second in order to obtain the first is a design error, and it makes
the charter unrunnable at exactly the moment it needs to prove itself.

## 2 · What this GP does

**2.1** Inserts **Phase S-0 (Solo)** into CHARTER.md Part 15, preceding Phase S.

**2.2** Establishes `governance/DEBT.md`, the **Governance Debt Register**, as a
required, published artifact. Every suspended rule must appear there with: the
rule ID, the reason, the compensating control, the reactivation trigger, and the
date opened. **Entries are closed, never deleted.**

**2.3** Suspends, in Phase S-0 only, the **principal-diversity** clauses named in
DEBT.md D-001. Model-family requirements are **not** suspended.

**2.4** Adds compensating controls that make the commons *stricter* on the axis
that still works, to partially offset the axis that doesn't:

| Control | Charter | Phase S-0 |
|---|---|---|
| Adversary office required from | Z3 | **Z2** |
| Model families required at Z2 | 2 | **3** |
| Max maturity claimable | Supported | **Working** |
| Credit enforcement | blocking | **accounted, non-blocking** (D-005) |

**2.5** Adds a **maturity ceiling**: no catalog item may claim above `Working`
while any BLOCKING or DEGRADING debt entry is open. The commons declares
truthfully that it is not yet trustworthy at higher assurance levels rather than
issuing a guarantee it cannot back.

**2.6** Adds an automatic exit: Phase S-0 ends when
`accountable_principals >= 3`, evaluated nightly. **No vote, no discretion, no
extension mechanism.** Suspensions lift automatically on their triggers.

## 3 · What this GP does not do

- Does not touch `core:` (C1–C7). Untouched, untouchable.
- Does not weaken `RULE-6.3-HETERO`. Model-family diversity remains binding, which
  is why D-002 is currently **blocking work** rather than being suspended away.
  *The correct response to an unmet rule is to be stopped by it.*
- Does not extend founder powers. `RULE-15-FOUNDER-SUNSET` stands at 18 months
  with no extension path.
- Does not weaken `RULE-6.4-ACCEPTANCE-IMMUTABLE`, the wall-clock trust floors, or
  the veto citation rule.

## 4 · Charter diff

```diff
  ## Part 15 — Phased activation
+
+ ### Phase S-0 — Solo (from ratification, while principals < 3)
+
+ **Precondition.** Fewer than 3 accountable principals are registered.
+
+ **Active:** the founding principal, holding every human office, with each
+ decision logged naming every hat worn. Registrar and Ombuds functions operate
+ as published procedure rather than as independent bodies (DEBT.md D-004).
+
+ **Suspended:** principal-diversity requirements only, each recorded in
+ `governance/DEBT.md` with a compensating control and an automatic
+ reactivation trigger.
+
+ **Strengthened, to offset:** Adversary office mandatory from Z2; three model
+ families required at Z2; maturity ceiling of `Working` on every catalog item
+ while any BLOCKING or DEGRADING debt entry is open.
+
+ **Not suspended, at any severity:** the unamendable core; model-family
+ heterogeneity; acceptance-test immutability; wall-clock trust floors; the veto
+ citation rule; right of exit; founder sunset; the governance test suite.
+
+ **Exit:** automatic at `accountable_principals >= 3`, evaluated nightly.
+
+ **Debt register duty.** No rule may be suspended without a DEBT.md entry
+ naming its reactivation trigger. A suspension without a trigger is void, and
+ the rule remains in force.
+
  ### Phase S — Seed (from ratification)
```

## 5 · `charter.yaml` diff

```diff
  phases:
    rule: RULE-15-PHASES
+
+   S0_solo:
+     precondition: { accountable_principals_below: 3 }
+     debt_register_required: true                      # RULE-15-DEBT
+     suspension_without_trigger: void
+     suspends: [principal_diversity]
+     never_suspends: [core, model_family_heterogeneity, acceptance_immutability,
+                      ladder_time_floors, veto_citation, exit, founder_sunset,
+                      governance_test_suite]
+     strengthened:
+       adversary_required_from_zone: Z2
+       min_model_families_at_z2: 3
+       max_claimable_maturity: Working
+       credit_enforcement: accounted_not_blocking
+     exit_trigger: { accountable_principals: 3 }
+     exit_requires_vote: false
```

## 6 · Tests

Landed as a separate GP **before** this one merges (`RULE-10-GAC`: a rule and the
test that proves it may not change in the same commit).

- `test_s0_requires_debt_entry_per_suspension` · `RULE-15-DEBT`
- `test_suspension_without_trigger_is_void` · `RULE-15-DEBT`
- `test_s0_does_not_suspend_model_family_floor` · `RULE-6.3-HETERO`
- `test_s0_maturity_ceiling_enforced` · `RULE-7-MATURITY`
- `test_s0_exits_automatically_at_three_principals` · `RULE-15-PHASES`
- `test_s0_cannot_suspend_core` · `RULE-1.2-IMMUTABLE`
- `test_s0_cannot_extend_founder_sunset` · `RULE-15-FOUNDER-SUNSET`
- `test_adversary_required_at_z2_during_s0` · `RULE-6.2-ZONES`

## 7 · The argument against this GP

*(Required by `RULE-16-AMEND`. Written in good faith, because an amendment argued
in only one direction has not been reviewed.)*

**The strongest case against:** every governance failure in open source history
began as a reasonable exception for a small founding group, and the exceptions
outlived the conditions that justified them. This GP is the founder writing
himself a permission slip, reviewed by himself, under a procedure he authored, at
the exact moment when there is nobody who can say no. The debt register makes the
exception *visible*, which is not the same as making it *temporary* — a register
nobody reads is a compliance artifact, and the person who would read it is the
person who wrote it.

**The second-strongest case:** a project that cannot execute its own rules on day
one has evidence its rules are wrong. The disciplined response might be to shrink
the charter to what one principal can actually honor, rather than to keep the
ambitious version and suspend the parts that bite. Suspension preserves the
appearance of rigor at the cost of its substance.

**Why I am proposing it anyway.** The automatic, unvoteable exit trigger is the
answer to the first objection: nothing here requires the founder to relinquish
anything, because nothing waits on his decision. The answer to the second is
D-002: the model-family rule was *not* suspended, and it is currently blocking
all work above Z0. A charter that can stop its own author on day one is not
decorative. That is the actual test result, and it is the reason to keep the
ambitious version.

**What would falsify this reasoning:** if a future run finds a way around D-002
that involves re-reading rather than satisfying the rule. Watch for that.

## 8 · Human decision record

*(Required by DEBT.md D-004: every decision made while one person holds multiple
offices must name the hats.)*

- **Proposed by:** founding principal, as Council
- **Reviewed by:** founding principal, as Board
- **Ratified by:** founding principal, as Board
- **Conflict:** total. Proposer, reviewer, and ratifier are the same person. No
  independent review occurred. This is disclosed rather than mitigated, because it
  cannot be mitigated at n=1.
- **Status:** pending 30-day comment period
