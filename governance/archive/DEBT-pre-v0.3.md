# Governance Debt Register

**Every rule currently suspended, why, what compensates for it, and what turns it
back on.** Published. Reviewed every quarter. Entries are never deleted — they are
closed, with a date.

A commons that quietly runs below its own rules is worse than one with no rules,
because it claims a guarantee it isn't providing. This file is how Pumasi runs
below its rules honestly.

**Current state: Phase S-0 (Solo).** 1 accountable principal, 1 model family
active. **No catalog item may claim above `Working` maturity while any BLOCKING or
DEGRADING entry is open** (GP-0001 §4).

---

## Open

### D-001 · Principal diversity suspended
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rules suspended** | `RULE-5.2-VOUCH-DIVERSITY`, principal-diversity clauses of `RULE-6.3-HETERO` (Z1–Z4), R4 concurrence in `RULE-5.2-LADDER`, `RULE-11-BUSFACTOR`, `maturity.Established.maintainers_distinct_principals` |
| **Why** | There is one accountable principal. Principal diversity buys anti-capture, which is undefined at n=1 — there is no second party to capture the commons from. |
| **Compensating controls** | Adversary office mandatory from **Z2** (charter: Z3). Model-family floor raised to **3 at Z2** (charter: 2). All merges logged with the suspension cited. |
| **Reactivation trigger** | `accountable_principals >= 3`. Automatic, on the next nightly evaluation. No vote required. |
| **Opened** | 2026-07-28 |

### D-002 · Model-family heterogeneity partially met
| | |
|---|---|
| **Severity** | **BLOCKING** (was: blocking at 1 family; now blocking at 2) |
| **Rules suspended** | none — this rule is **not** suspended. It is unmet, and it is stopping work. |
| **Why** | `RULE-6.3-HETERO` requires ≥2 distinct families to merge above Z0 and a pool floor of 3 to leave **Constrained** state (`RULE-12-EMERGENCY`). |
| **Status 2026-07-28 (empirical)** | **2 families working.** Anthropic/Claude (builder). Google/Gemini via `agy`, `gemini-3.1-pro-high` — performed a real independent review of SPEC-0001, verdict APPROVE, empirically re-derived every timezone conversion, and found an uncovered gap the author missed (S12, S13). **Third family unavailable:** `gpt-oss-120b-medium` fails on any prompt including a trivial smoke test (`Agent execution terminated due to error`). No other provider CLI present on the host. |
| **Effect right now** | Pool floor of 3 unmet ⇒ **Constrained state stands**; Z3/Z4 halted. Z2 reachable only if GP-0001's strengthened modifier is amended — see D-007. |
| **What would clear it** | A third working family with an independent execution path. |
| **Explicitly not permitted** | Two sizes of the same lineage counted as two families — e.g. Opus + Fable, or Gemini Pro + Gemini Flash. `RULE-6.3-HETERO` collapses same-family approvals to one vote before counting. **Proposed and rejected on 2026-07-28.** This is the workaround GP-0001 §7 named in advance as the thing to watch for. |
| **Opened** | 2026-07-28 |

### D-007 · Two independent defects in the heterogeneity rule itself
| | |
|---|---|
| **Severity** | **BLOCKING** |
| **Found** | 2026-07-28, by attempting to run the gate rather than by reading it |
| **Defect A — GP-0001's compensating controls are unsatisfiable.** | D-001 suspends principal diversity and compensates with "Adversary mandatory from Z2" and "3 model families at Z2". Both require capacity that D-002 says does not exist. The amendment pays a debt in a currency the commons does not hold. It is now the *only* thing blocking a Z2 merge. |
| **Defect B — the builder's own family is never excluded from the quorum count.** | `RULE-6.3-HETERO` drops the builder *identity*, then requires N distinct families. It never requires that any of them differ from the builder's. At Z2 (`min_families: 2`) a change can therefore merge on builder-family + one other, leaving exactly **one** genuinely decorrelated reviewer while the rule reads as though there are two. |
| **Consequence** | The Adversary office is currently **unstaffable at any zone**: §5.2 disqualifies an adversary sharing a family with the builder *or* with an approver. With Claude building and Gemini approving, a valid adversary requires a third family. There is none. |
| **Proposed fix** | Pending founder decision. Replace the unsatisfiable modifiers with controls that hold at n=2 families: (i) require ≥1 approval from a family **other than the builder's**, closing Defect B; (ii) keep Adversary mandatory from Z3 and declare Z3 formally halted while no third family exists, rather than requiring an office that cannot be filled; (iii) add the temporal control — acceptance tests frozen and timestamped before implementation — which holds at any population size. |
| **Reactivation trigger** | Defect A closes when GP-0001 is amended. Defect B closes when `RULE-6.3-HETERO` is amended and its test lands. |
| **Opened** | 2026-07-28 |

### D-003 · Separation of duty unenforceable
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rules suspended** | `RULE-5.1-SOD` in part — Scout/Curator/Specifier/Builder are currently the same model family and the same principal. |
| **Why** | With one family and one principal, "different identity" is a keypair distinction with no independence behind it. Specifier≠Builder is the control that catches the largest MAST failure class; at n=1 it is bookkeeping, not a control. |
| **Compensating controls** | Acceptance tests are still written and frozen **before** implementation, and their commit timestamp is checked at the gate. Temporal separation survives even when identity separation doesn't. |
| **Reactivation trigger** | D-002 cleared **and** `accountable_principals >= 2`. |
| **Opened** | 2026-07-28 |

### D-004 · Human bodies unconstituted
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rules suspended** | `RULE-4.1-BOARD` (7 seats, ≥2 unaffiliated), `RULE-4.2-COUNCIL`, `RULE-4.6-OMBUDS` independence, `RULE-4.7-AUDIT` independence |
| **Why** | One human. Board, Council, Ombuds, Registrar, Chief Auditor, and Domain Steward are the same person. Independence is impossible, not merely absent. |
| **Compensating controls** | Every decision that would normally require two distinct bodies is logged with **both hats named** and the reasoning published, so the conflict is visible in the record rather than hidden by it. Founder powers still expire at month 18 with no extension path (`RULE-15-FOUNDER-SUNSET`) — **that rule is not suspended and cannot be.** |
| **Reactivation trigger** | Phase 1 trigger (`RULE-15-PHASES`), or month 18, whichever is first. |
| **Opened** | 2026-07-28 |

### D-005 · Credit system uncalibrated
| | |
|---|---|
| **Severity** | INFORMATIONAL |
| **Rules affected** | `RULE-8-CREDITS` — cost and refund values in `charter.yaml` are estimates with no measured basis. |
| **Why** | No verification spend has been measured. Pricing anything now is invention. |
| **Compensating controls** | Credits are **accounted but not enforced** during Phase S-0: balances are computed and published, submissions are never rejected for insufficient credit. This produces the calibration data without the calibration error doing damage. |
| **Reactivation trigger** | 100 completed verification cycles, or Phase 1, whichever is first. |
| **Opened** | 2026-07-28 |

### D-006 · Acceptance-test determinism depends on environment data
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rules affected** | `C5` — "nothing merges unless the tests pass" assumes tests are a function of the code alone. |
| **Why** | Discovered while writing `spec/0001`. Timezone-dependent tests are a function of code **and** the IANA tzdata version on the machine. The same code passes on one environment and fails on another. This is not a flake; it is a category of test whose truth is environment-relative. |
| **Compensating controls** | Specs that depend on environment data **must** declare a pinned data version in `SPEC.md` and assert it at test setup. Verifier matrix must include ≥2 tzdata versions. |
| **Reactivation trigger** | N/A — this is a permanent charter gap. **Requires a GP** amending C5's operational reading, not a suspension. Tracked as `GP-0002` (unwritten). |
| **Opened** | 2026-07-28 |

---

## Closed

*(none yet)*

---

## Rules explicitly NOT suspended, at any severity

These held during Phase S-0 and were not weakened to make the run work. If any of
them ever appears in the Open table, that is the signal that the project has
started lying to itself.

- `RULE-1.2-IMMUTABLE` — the unamendable core, all of C1–C7
- `RULE-6.4-ACCEPTANCE-IMMUTABLE` — the builder may not edit acceptance tests
- `RULE-5.2-FLOOR-*` — wall-clock trust floors
- `RULE-3-VETO` — uncited vetoes discarded
- `RULE-15-FOUNDER-SUNSET` — founder powers expire at month 18
- `RULE-13-EXIT` — right of exit
- `RULE-10-GAC` — governance is tested
