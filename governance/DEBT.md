# Governance Debt Register

**Every rule this project is currently running below, why, what compensates for
it, and what turns it back on.** Published. Entries are closed with a date, never
deleted.

A commons that quietly runs below its own rules is worse than one with no rules,
because it claims a guarantee it isn't providing. This file is how Pumasi runs
below its rules honestly.

**Current state.** One steward. Three model families, **verified live 2026-08-29**
by `tools/families.sh`: Claude, Gemini (`agy`), Grok (`grok`).

---

## Open

### D-101 · The steward authorises items they also sponsor
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §2 — deciding what deserves to exist is meant to be an independent judgment. |
| **Why** | One human. The person choosing what to build, sponsoring it, and holding the veto is the same person. The check is real against *agent* error; it is not independent of *steward* preference. |
| **Narrowed twice** | The steward no longer reviews specs, tests or diffs (2026-08-01), and the per-item decisions became a veto over published intent statements and release notes (2026-08-27). The surface is now: what goes unvetoed. |
| **Residual** | An intent statement can be accurate on the happy path while burying a hard case in "not building"; nothing re-confirms intent when scope expands mid-spec; open questions can be resolved inside the spec without returning to the steward. The price of removing per-feature human review. |
| **Compensating controls** | Specs are reviewed by a different model family than authored them, and acceptance tests are frozen before implementation — the standard is fixed before anyone knows whether the code will meet it. Every authorisation is published with both roles named. |
| **Clears when** | A second accountable party exists, or 2028-01-28 — whichever is first. |
| **Opened** | 2026-07-28 |

### D-102 · Acceptance-test determinism depends on environment data
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §3 requirement 2 — "the tests pass" assumes tests are a function of the code alone. |
| **Why** | Timezone-dependent tests are a function of code **and** the IANA tzdata version on the machine. Identical code passes on one environment and fails on another. Not a flake — a category of test whose truth is environment-relative. |
| **Compensating controls** | Specs depending on environment data **must** declare a pinned data version and assert it at test setup, failing loudly on mismatch. The release matrix must include ≥2 versions and report divergence as a finding, not a flake. |
| **Clears when** | Never by itself — a permanent property of such tests. The controls are the answer, not a workaround. |
| **Opened** | 2026-07-28 |

### D-103 · Ordinary merges take the weaker reading of the whitepaper
| | |
|---|---|
| **Severity** | INFORMATIONAL |
| **Rule affected** | CHARTER §3 requirement 3. |
| **Why** | Whitepaper principle 3 says a change needs *"independent approval from reviewer agents built on different model **families**"* — plural, in both nouns. §3 requires **one** review from one other family for ordinary changes; only the can-hurt gate requires two. The plural reading may demand two everywhere. |
| **Why the weaker one** | Speed, deliberately, for a project with three families and no users. Requiring two reviews on every documentation fix spends the scarce resource — reviewer availability — on the changes least able to cause harm. |
| **Compensating controls** | The can-hurt gate requires two other families, and risk is inherited along the handling path (§4), so anything reaching a harmful path gets the plural reading. |
| **Clears when** | The plural reading is adopted for all merges, or a defect reaches production that a second ordinary-tier reviewer would have caught. |
| **Opened** | 2026-08-01 |

### D-104 · Reviewer-breadth rule is inert below three model families
| | |
|---|---|
| **Severity** | INFORMATIONAL |
| **Rule affected** | CHARTER §3 requirement 1 — the spec reviewer must not be among the code reviewers' families, *where three or more families are available*. |
| **Why** | Written conditionally, so below three families it stops applying and nothing says so. That silence was the defect, not the degradation. |
| **Status** | Three families verified available 2026-08-29 — the first check since D-002 closed on 2026-08-01. For four weeks "three families work" was an inherited claim nobody had retested ([L-007](../lessons/L-007-restating-a-rule-forks-it.md)). |
| **Compensating controls** | [`tools/families.sh`](../tools/families.sh) probes each family's CLI; `tools/gate.sh` runs it on every merge and names the D-104 condition when fewer than three answer. Verified it can fail ([L-006](../lessons/L-006-tests-that-cannot-fail.md)). Skipping it is itself announced. |
| **What is not fixed** | The silence, not the degradation. Below three families §3 req 1 still cannot bind. Making the rule unconditional was rejected: a provider outage would deadlock every merge, which is [L-001](../lessons/L-001-governance-ahead-of-evidence.md). |
| **Clears when** | §3 req 1 is made unconditional, or breadth is observed rather than asserted over time. |
| **Opened** | 2026-08-01 |

### D-105 · Privacy basis stated, not yet reviewed by counsel
| | |
|---|---|
| **Severity** | **DEGRADING** (reduced from BLOCKING 2026-08-29). Blocks no release, no ceiling, no signup. |
| **Rules affected** | None suspended. |
| **What is resolved** | The lawful basis is stated, in force and checkable in `service/src/legal.ts` v1.0: contract plus legitimate interest for account holders; the account holder's legitimate interest, with the service as their processor, for bookers; legitimate interest for the private operating tier. Deletion reach and subprocessors are documented rather than implied. |
| **Operator, and its provenance** | **ATX APPLE LLC, a Texas limited liability company. Governing law: Texas.** Supplied by the steward, re-confirmed on challenge, and the exact string (`ATX APPLE LLC` — uppercase, no comma) confirmed as its own question, because a controller named slightly wrong is a defect even where the company is right. **No agent has seen the Texas SOS filing; none can.** The registered address was supplied and is deliberately unpublished. |
| **What remains open** | The **international transfer mechanism** and a **review by counsel**. Both are `HUMAN.md` items. No standard contractual clauses exist, so the documents state the fact — operated from the United States, processed there — rather than name a safeguard that does not exist. |
| **Why the blocking posture was lifted** | It had become the thing it was written to prevent: a permanent block on public signup with no deadline and no default, over a question nobody had been assigned to answer. Holding a booker's name and meeting time on a legitimate-interest basis is the ordinary posture of every product in this category. The failure was never illegality — it was an undecided question treated as a prohibition. |
| **Where the care sits now** | Publication, not collection. The ledger is mirrorable (P3), so anything published cannot be recalled from a fork. §5.2 was split into a narrow published tier and a richer held tier: the commons collects more and publishes no more than before. |
| **Compensating controls** | `SPEC-0002` D2 purpose-scoped collection, D3 deletion by absence, D4 no booker email in URLs or logs, D6 named subprocessors, D7 stated deletion reach, D9 notice at the point of collection. |
| **Not deferred** | Any release note for an item that reports must state this entry's status. Writing a risk down must not become a way of authorising it. |
| **Clears when** | Counsel has reviewed the pack and the blanks in `legal.ts` are filled. |
| **Opened** | 2026-08-01 · **Narrowed** 2026-08-29 |

### D-106 · Work can proceed on silence — the veto model's residual
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §2 — accountability by veto assumes the steward reads what is published within the window. |
| **Why** | The veto replaced blocking signatures because the recorded evidence was 24 days of stall behind self-addressed signature boxes. The cost, plainly: an intent statement or release note that nobody reads proceeds anyway. |
| **Compensating controls** | Open questions must state the default agents will assume (§2.1), so silence selects a named outcome. Can-hurt releases keep the 7-day window, the two-extra-family gate and staged ceilings. `DIGEST.md` is meant to make silence informed rather than blind — **it is only as good as its currency**. |
| **Clears when** | A second accountable party exists (two vetoes are a quorum, one is a hope), or a veto-window release causes harm an affirmative signature would have caught. |
| **Opened** | 2026-08-27 |

### D-107 · The held reporting tier has no published retention schedule
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §5.2 — the held tier is promised "a stated retention period and a deletion that actually reaches", and that promise is the price of collecting more. |
| **Why** | §5.2 was broadened on 2026-08-29 to collect operating and quality signal. The guarantee that makes it defensible is specified but not built. A commitment that exists only in the charter is enforced by conscience, which §3 says does not scale. |
| **Compensating controls** | No catalog item has released, so no held data exists. The tier is unpublished by construction. The opt-out covers it. |
| **Clears when** | The retention period is published and the deletion path is implemented and tested, **before** the first release that collects held data. |
| **Opened** | 2026-08-29 |

### D-108 · Released without a reporting path — §5.1 run below, by decision
| | |
|---|---|
| **Severity** | **BLOCKING for the rule**; not blocking the release, because the steward decided otherwise. |
| **Rule affected** | CHARTER §5.1 — an in-scope item must implement reporting **and a working opt-out** before it releases. §5.1 is not on the never-suspend list, so it may be run below with an entry. |
| **What is true** | `PUMASI_REPORTING` is read into config and then **read by nothing**. No egress code, no payload, no notice. §5.1 names *"a flag nothing reads"* as a specific way to fail — this is the exact failure, not a near miss. All five gate checks fail vacuously. |
| **Decision** | Steward, 2026-08-29. Building the path first was offered and declined. Reasoning: a reporting pipeline for a service with no users is [L-001](../lessons/L-001-governance-ahead-of-evidence.md), and `GAP-0003` already makes that argument for the defect tiers. |
| **Who it can hurt** | **Nobody outside the project** — §5.1 is a promise the commons makes to itself. Running below it costs the project its evidence, not any user their safety. That is why it is separable from D-105. |
| **What it costs** | The test matrix stays one machine wide. Nothing tells us whether the service works anywhere but where it was built. |
| **Compensating controls** | The release note states the non-compliance in plain language, so the veto window runs with it visible. The privacy pack was corrected so it does not claim a stream that does not exist. |
| **What would make it indefensible** | A stub that returns success, or a flag with a reader that sends nothing, to pass the gate on paper. An absent mechanism honestly named is worth more than a present one that lies. |
| **Clears when** | Reporting and a working opt-out pass all five checks. **Trigger:** a defect in the wild a report would have surfaced, the first deployment the project does not operate, or **any release after this one**. This release is the exception, not a standing permission. |
| **Opened** | 2026-08-29 |

### D-109 · Can-hurt surfaces are classified by agents, with no human step
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER Part 4. The can-hurt path was designed so no per-change sign-off was needed **because** a human had named the surface in advance. The naming half is gone; the no-sign-off half remains. |
| **What is true** | `surface_authorised_by: risk_zones_classification`. `RISK_ZONES.yaml` is agent-written and on no exclusion list, so an agent decides whether its own change is can-hurt. No human step before release. |
| **Decision** | Steward, 2026-08-29: *"we will not care about the risk part with the mandate. if there is genuinely big risks, agents will report them."* Per-change sign-off was offered and declined. |
| **What still holds** | The can-hurt **gate** is untouched: two reviews from two other families, a published release note, a 7-day veto window, staged release. The control moved from before the work to before the release. |
| **What it does not fix** | A misclassification routes a dangerous change down the *ordinary* path, where the note and the window never happen — so the compensating control does not reach the case that needs it. Part 7 names this scenario as the one the clause existed to prevent. Compounds **D-106**. |
| **The bet** | That an agent reports a genuine risk unprompted. A real property of current models — and precisely what Part 9 lists as a threat: *"an agent that is confidently wrong"* will classify accordingly. Recorded so that if it fails, it fails on the record. |
| **Compensating controls** | `RISK_ZONES.yaml` defaults to **can-hurt** when unmapped or unclear, so silence errs strict. Reclassification to ordinary is itself a can-hurt change. Risk is inherited along the handling path. |
| **Clears when** | A second accountable party exists, or a misclassification is found — in which case per-change sign-off returns. |
| **Opened** | 2026-08-29 |

### D-110 · Public sign-up released with one non-builder review, by steward waiver
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §4 — a can-hurt change needs **two** approving reviews from two families other than the builder's. The register's own never-suspend list names this bar, which is why this entry is written rather than the fact being handled quietly. |
| **What is true** | Gemini approved the final range twice. Grok's two completed reviews each found a real defect — the I8 cookie oracle, the composed D3 deletion holes — and both were fixed with tests that fail without the fix. Grok's review of the *final* state died mid-run: `402, Grok Build usage balance exhausted`. Topping up is money, which is `HUMAN.md` ground. |
| **Decision** | Steward, 2026-08-29: *"If gemini agrees, then it is major agreement, because Claude also agreed. then let's approve it."* Recorded precisely: the builder's family does not count under §3 and **is not counted here** — this is one non-builder approval plus an explicit steward waiver of the second, not a two-family gate met. |
| **What the evidence says** | The two approving families are the two that missed both bugs; the family whose review is waived is the one that found them, twice. Stated so the waiver is made with that in view, not around it. |
| **Compensating controls** | Every objection Grok did raise was fixed and is test-covered, including through the real worker. 19 core + 248 service + 34 E2E green. The I8 property is asserted against production after deploy. |
| **Clears when** | Grok (or any second non-builder family) approves the released range. One top-up and one rerun. |
| **Opened** | 2026-08-29 |

---

## Closed

- **D-002 · Model-family heterogeneity unmet** — closed 2026-08-01 at three working
  families. *Two sizes of one lineage still do not count as two families.*
- **D-007 · Builder's own family counted toward its own review** — closed 2026-08-01
  by correcting the rule itself: §3 requirement 3 now requires a family other than
  the builder's. Closed by correction, not compensation.

## Voided

Six entries (D-001, D-003, D-004, D-005, D-006, D-008) suspended rules that **no
longer exist** — the trust ladder, agent offices, seven governing bodies, and
verification rationing. Voiding is not clearing: the condition did not improve,
the rule was removed. D-006 was renumbered D-102 and is still open.
See [`SUPERSEDED.md`](./SUPERSEDED.md).

---

## Rules explicitly NOT suspended, at any severity

If any of these appears in the Open table, that is the signal that the project has
started lying to itself.

- **Part 1** — all permanent commitments, P1–P12
- **Acceptance tests frozen at approval** — the builder may not edit them
- **Cross-family review** — a same-family review never satisfies §3
- **Risk inheritance and reclassification** — §4's can-hurt bar, and the rule that relabelling a path is itself a can-hurt change
- **Uncited objections discarded** — no unfalsifiable authorities
- **Sole-steward authority ends 2028-01-28** — and may not extend itself
- **Governance is tested** — a rule without a test is reported unverified
