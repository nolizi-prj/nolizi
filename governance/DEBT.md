# Governance Debt Register

**Every rule this project is currently running below, why, what compensates for
it, and what turns it back on.** Published. Entries are closed with a date, never
deleted.

A commons that quietly runs below its own rules is worse than one with no rules,
because it claims a guarantee it isn't providing. This file is how Pumasi runs
below its rules honestly.

**Current state.** One steward. Three model families working: Anthropic/Claude,
Google/Gemini (via `agy`), xAI/Grok (via `grok`). A fourth, OpenAI/gpt-oss, is
responsive but has not performed an independent review.

---

## Open

### D-101 · The steward authorises items they also sponsor
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §2 — deciding what deserves to exist is meant to be an independent judgment. |
| **Why** | One human. The person choosing what to build, sponsoring it, and authorising it is the same person. This check is real against *agent* error; it is not independent of *steward* preference. |
| **Narrowed 2026-08-01** | The steward no longer reviews specs, tests, or diffs (WP 2 assigns specification to agents). The conflict now covers four decisions per item — authorisation, **confirming the intent statement**, can-hurt surface authorisation, and release sign-off — rather than a judgment on every feature. Smaller surface, same conflict. |
| **Narrowed again 2026-08-27 (v0.4)** | The four decisions became one standing mandate plus a veto. The conflict is unchanged in kind — the person holding the veto is still the sponsor — but its surface is now: what enters `MANDATE.md`, and what goes unvetoed. |
| **Residual, stated plainly** | Adversarial review (2026-08-01) held that a one-page intent statement is *narrower* accountability than reviewing what gets built, and it is right. Three specific gaps remain open by choice: an intent statement can be accurate on the happy path while burying a hard case in "not building"; nothing re-confirms intent when scope expands mid-spec; and open questions can be resolved inside the spec without returning to the steward. The steward confirming the page is also the person who sponsored the item. These are the price of removing per-feature human review, and they are recorded rather than argued away. |
| **Compensating controls** | Specs are reviewed by a **different model family** than authored them, and acceptance tests are frozen before implementation — so the standard is fixed before anyone knows whether the code will meet it. That freeze is the control that survives at any population size. Every authorisation is published with both roles named. |
| **Clears when** | A second accountable party exists, or 2028-01-28 — whichever is first. A second human also resolves the residual above, since confirming an intent statement and sponsoring the item would no longer be the same person. |
| **Opened** | 2026-07-28 · **carried into v0.3** |

### D-102 · Acceptance-test determinism depends on environment data
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §3 requirement 2 — "the tests pass" assumes tests are a function of the code alone. |
| **Why** | Found while writing `spec/0001`. Timezone-dependent tests are a function of code **and** the IANA tzdata version on the machine. Identical code passes on one environment and fails on another. Not a flake — a category of test whose truth is environment-relative. |
| **Compensating controls** | Specs depending on environment data **must** declare a pinned data version and assert it at test setup, failing loudly on mismatch. The release matrix must include ≥2 versions and report divergence as a finding, not a flake. |
| **Clears when** | Never by itself — this is a permanent property of such tests. The controls above are the answer, not a workaround. |
| **Opened** | 2026-07-28 · **carried into v0.3** |

### D-103 · Ordinary merges take the weaker reading of the whitepaper
| | |
|---|---|
| **Severity** | INFORMATIONAL |
| **Rule affected** | CHARTER §3 requirement 3. |
| **Why** | Whitepaper principle 3 says a change needs *"independent approval from reviewer agents built on different model **families**"* — plural, in both nouns. §3 requires **one** review from one other family for ordinary changes; only the can-hurt gate requires two. The plural reading may demand two everywhere. |
| **Why we took the weaker one** | Speed, deliberately, for an MVP with three families and no users. Requiring two reviews on every documentation fix spends the scarce resource — reviewer availability — on the changes least able to cause harm. |
| **Compensating controls** | The can-hurt gate does require two other families plus steward sign-off, and risk is inherited by dependencies (§4), so anything reaching a harmful path gets the plural reading. |
| **Clears when** | Either the plural reading is adopted for all merges, or a defect reaches production that a second ordinary-tier reviewer would have caught — whichever comes first. The second outcome is the evidence that settles it. |
| **Opened** | 2026-08-01 |

### D-104 · Reviewer-breadth rule is inert at two model families
| | |
|---|---|
| **Severity** | INFORMATIONAL |
| **Rule affected** | CHARTER §3 requirement 1 — the spec reviewer must not be among the code reviewers' families, where three or more families are available. |
| **Why** | At two families the rule cannot bind: one family authors, the other must review both the spec and the code, so a single family is the only independent check on both the plan and its execution. |
| **Status now** | **Three families verified available 2026-08-29** — `claude`, `agy` (Gemini) and `grok` each answered a live probe. This is the first check since D-002 was closed on 2026-08-01; for four weeks "three families work" was an inherited claim nobody had retested, which is the same *matching-a-restatement* error [L-007](../lessons/L-007-restating-a-rule-forks-it.md) now warns about. The rule binds today, on evidence rather than memory. |
| **Compensating controls — added 2026-08-29** | [`tools/families.sh`](../tools/families.sh) probes each family's CLI and reports how many can actually review; `tools/gate.sh` runs it as step 4/4 on every merge and prints the result. Below three it prints the D-104 condition by name and says which rules have stopped binding. Verified it can fail, per [L-006](../lessons/L-006-tests-that-cannot-fail.md), by removing a CLI from `PATH`: 1 of 3, exit 1, condition announced. The probe never fails the gate on its own — degraded breadth is a fact about the commons, not a defect in the change being merged — and skipping it via `SKIP_FAMILY_PROBE=1` is itself announced, because an unannounced skip is the original silence wearing a flag. |
| **What is fixed and what is not** | The **silence** is fixed; the **degradation** is not. Below three families §3 req 1 still cannot bind and §4's can-hurt gate still cannot be met. What changed is that this is now stated at the moment it happens instead of being discovered later. Making the rule unconditional so merges block was the other option in the original entry and is **not** taken: a provider outage would then deadlock every merge, which is the v0.1 failure [L-001](../lessons/L-001-governance-ahead-of-evidence.md) records, traded for a risk that announcing already addresses. |
| **Clears when** | The severity stands while the rule remains conditional. It closes if §3 req 1 is made unconditional, or downgrades to a standing note once the probe has run on every merge for long enough that breadth is observed rather than asserted. |
| **Opened** | 2026-08-01 |

### D-105 · Privacy basis stated, not yet reviewed by counsel
| | |
|---|---|
| **Severity** | **DEGRADING** (reduced from BLOCKING on 2026-08-29). It blocks no release, no ceiling, and no signup. |
| **Rules affected** | None suspended. |
| **What was unresolved when this was filed** | No lawful basis had been articulated for holding bookers' names and email addresses, or for publishing signed reports that identify a natural person. |
| **What is resolved, 2026-08-29** | The basis is stated, in force, and checkable in the source (`service/src/legal.ts`, version 1.0): for account holders, performance of the contract plus legitimate interest in operating and securing the service; for bookers, the account holder's legitimate interest with this service acting as their **processor**; for the public conformance report, the sender's own decision to publish a signed contribution; for the private operating tier (CHARTER §5.2), legitimate interest in operating and improving the software, which is why that tier is not published, is retained to a stated schedule, and is deletable on request. Deletion reach and subprocessors are documented rather than implied. |
| **The exact registered string, confirmed separately** | The published string is **`ATX APPLE LLC`** — uppercase, no comma. This was confirmed as a **distinct question** on 2026-08-29, because "ATX APPLE LLC" and "ATX Apple, LLC" are different names and a controller named slightly wrong is a defect even where the company is right. The chain, stated exactly, since that is the point of this row: the steward typed that string to one session in their original instruction; confirmed the entity and its LLC form to that session on challenge; and confirmed the *spelling* to a **second** session, which relayed it here. The first is direct evidence of the string, the third is corroboration of it, and the live page was checked against both. No agent has seen the Texas SOS filing itself — nobody here can, and that limit is what this row exists to make visible rather than hide. |
| **Supplied by the steward, 2026-08-29** | **Operator: ATX APPLE LLC, a Texas limited liability company.** **Governing law: Texas.** Given as a direct instruction and then **re-confirmed on challenge** — a peer session held its deploy and asked for provenance before publishing a corporate identity outward, and the steward confirmed the name and the LLC form explicitly. Recorded here because the assertion is now live on `/privacy`, `/terms` and `/dpa`, and a fact a public page states should be traceable to something better than a chat log. The **registered address was supplied and is deliberately unpublished** at the steward's instruction; an email contact discharges the duty to be reachable, and nothing published depends on it. |
| **What remains open, and it is narrow** | The **international transfer mechanism**, and a **review by counsel**, which has still not happened. Both are `HUMAN.md` items; agents have drafted everything around them. No standard contractual clauses exist, so the documents state the fact — operated from the United States, processed there — rather than name a safeguard that does not exist. |
| **Why the blocking posture was lifted** | The entry had become the thing it was written to prevent. It blocked public signup permanently and froze the ceilings at 5 owners and 200 bookings with **no deadline and no default on silence**, on the strength of a question nobody had been assigned to answer. The mandate directs building a product a real person can use instead of Cal.com; an unanswerable permanent block made that unreachable. Holding a booker's name, email and meeting time in scheduling software on a legitimate-interest basis is the ordinary posture of every product in this category — the failure here was never illegality, it was an undecided question treated as a prohibition. Recorded plainly because the opposite error, quietly relaxing a control and calling it progress, is the one this register exists to catch. |
| **What is genuinely irreversible, and is therefore where the care now sits** | Publication, not collection. The ledger is mirrorable by design (P3), so anything **published** cannot be recalled from a fork. CHARTER §5.2 was accordingly split into a narrow published tier and a richer held tier: the commons now collects more and publishes no more than before. The earlier posture had this backwards — maximal strictness on a private, deletable database of booking details, and default-on permanent publication of a natural person's identity and environment fingerprint. |
| **Compensating controls, retained** | `SPEC-0002` D2 purpose-scoped collection, D3 deletion by absence, D4 no booker email in URLs, logs or reports, D6 named subprocessors, D7 stated deletion reach, D9 notice at the point of collection. The published tier stays narrow. The one-step opt-out covers both tiers. |
| **The one thing that is not deferred** | **Any release note for an item that reports must still state this entry's status.** Lifting the blocking posture does not remove the disclosure: the person choosing not to veto a release should know a lawyer has not reviewed this. Writing a risk down must not become a way of authorising it. |
| **Clears when** | Counsel has reviewed the privacy pack and the three blanks in `legal.ts` are filled with real values. |
| **Opened** | 2026-08-01 · **Narrowed** 2026-08-29 |

### D-106 · Work can proceed on silence — the veto model's residual
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §2 (v0.4) — accountability by veto assumes the steward reads what is published within the window. |
| **Why** | v0.4 replaced blocking signatures with veto windows because the recorded evidence was 24 days of stall behind self-addressed signature boxes. The cost of the fix, stated plainly: an intent statement or a can-hurt release note that nobody reads proceeds anyway. The human confirmation L-005 argued for is now optional in practice. |
| **Compensating controls** | Open questions in intent statements must state the default the agents will assume (§2.1), so silence selects a named outcome, never an unnamed one. Can-hurt releases keep the 7-day window, the two-extra-family gate, staged ceilings, and the D-105 rule that the note must state open debt — the risk is in front of whoever chooses not to read. `DIGEST.md` makes silence informed rather than blind. |
| **Clears when** | A second accountable party exists (two vetoes are a quorum, one is a hope), **or** a veto-window release causes harm an affirmative signature would have caught — in which case the affirmative sign-off returns for can-hurt releases and this entry records why. |
| **Opened** | 2026-08-27 |

### D-107 · The held reporting tier has no published retention schedule yet
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §5.2 — the held tier is promised "a stated retention period and a deletion that actually reaches", and that promise is the price of collecting more. |
| **Why** | §5.2 was broadened on 2026-08-29 to collect operating and quality signal. The guarantee that makes the broader collection defensible — a published retention schedule and a working deletion path — is specified but not yet built or published. A commitment that exists only in the charter is enforced by conscience, which §3 says is the component that does not scale. |
| **Compensating controls** | No catalog item has been released, so no held data exists yet. The tier is unpublished by construction, so nothing collected under it is irrecoverable. The opt-out covers it and works. |
| **Clears when** | The retention period is published in `REPORTING.md` and the deletion path is implemented and tested, **before** the first release of an item that collects held data. |
| **Opened** | 2026-08-29 |

### D-108 · Released without a reporting path — Part 5.1 run below, by decision
| | |
|---|---|
| **Severity** | **BLOCKING for the rule itself**: Pumasi Booking does not satisfy CHARTER §5.1 and is being released anyway. Not blocking the release, because the steward has decided otherwise. |
| **Rule affected** | **CHARTER §5.1** — an in-scope item must implement reporting **and a working opt-out** before it releases. §5.1 is not on this register's never-suspend list, so it may be run below with an entry. This is that entry. |
| **What is actually true** | `PUMASI_REPORTING` is read into `Config.reportingEnabled` and then **read by nothing**. There is no egress code, no payload, no `report --show`, no first-run notice. §5.1 names *"a flag nothing reads"* as a specific way to fail its gate, so this is not a near miss — it is the exact failure the clause was written to catch. All five gate checks (`reporting_path_exists`, `opt_out_stops_egress`, `opt_out_behaviour_parity`, `payload_inspectable`, `first_run_notice_present`) fail vacuously. |
| **Decision** | **Taken by the steward on 2026-08-29**, on an agent's recommendation, with the alternative — build the reporting path before opening public sign-up — offered and declined. Recorded as a decision, not an oversight. |
| **The reasoning, so it can be argued with later** | Building a reporting pipeline for a service with no users is [L-001](../lessons/L-001-governance-ahead-of-evidence.md): governance ahead of evidence, which is the failure that produced a charter unable to merge a documentation change. It is the same argument [`GAP-0003`](https://github.com/pumasi-ai/pumasi/blob/main/gap/0003-defect-reporting.md) already makes for not building the defect-report tiers yet, and applying it to one and not the other would be inconsistent. A reporting path built before any real environment exists would be designed against imagined ones. |
| **Who this can hurt** | **Nobody outside the project, which is why it is defensible.** §5.1 is a promise the commons makes to *itself* — that releases earn their way by passing in many environments rather than on one machine. Running below it costs the project its evidence, not any user their safety or privacy. This is the whole reason it is separable from D-105, which *can* hurt someone and is treated far more carefully. |
| **What it costs, stated rather than glossed** | The test matrix stays one machine wide. Nothing tells us whether the service works anywhere but where it was built. The first real defect in the wild will be reported by a person, if at all, rather than by the software — which is precisely the gap §5.1 exists to close and precisely the failure GAP-0003 §7's trigger 2 is waiting for. |
| **Compensating controls** | The release note ([`releases/2026-08-29-pumasi-booking-public-signup.md`](../releases/2026-08-29-pumasi-booking-public-signup.md)) states the non-compliance in plain language, so the 7-day veto window runs with this in front of whoever declines to veto. `Q-005` records it as named non-compliance. The privacy pack was corrected so it does **not** claim a reporting stream that does not exist — the one version of this that would have been dishonest rather than merely incomplete. |
| **What would make this indefensible** | Shipping a stub that returns success, or a flag with a reader that sends nothing, in order to pass the gate on paper. §5.1 forbids exactly that, and an absent mechanism honestly named is worth more than a present one that lies. The absence stays visible until it is filled. |
| **Clears when** | A reporting path and a working opt-out exist and pass all five §5.1 checks. **Trigger, so this does not sit open indefinitely the way D-105 did:** the first of — a defect found in the wild that a conformance report would have surfaced; the first deployment the project does not itself operate; or **any release after this one**. This release is the exception; it is not a standing permission. |
| **Opened** | 2026-08-29 |

---

## Closed

### D-002 · Model-family heterogeneity unmet — **CLOSED 2026-08-01**
Opened 2026-07-28 at one working family, blocking. Closed at **three**:
Claude, Gemini (independent review recorded 2026-07-28), and Grok, which on
2026-07-30 independently reviewed SPEC-0001 against the charter and found an
unratified proposal cited as binding, a scope mismatch against the duplication
finding, an ungated semantic clause, and a defect in the merged draft its own
author had missed. Three families satisfy §3's ordinary gate and §4's can-hurt
gate. `gpt-oss` responds but has performed no review and is not counted.

*Still not permitted:* two sizes of one lineage counted as two families.

### D-007 · Builder's own family counted toward its own review — **CLOSED 2026-08-01**
The v0.1 rule dropped the builder's *identity* from the quorum but never required
any approver to be from a different *family*, so a change could merge with one
genuinely independent reviewer while the rule read as though there were two.
**Fixed in the rule itself:** v0.3 §3 requirement 3 requires the review to come
from a family other than the builder's. Debt closed by correction, not by
compensation.

---

## Voided by v0.3

These suspended rules that **no longer exist**. Voiding is not clearing: the
condition did not improve, the rule was removed. Recorded so the difference is
visible.

| Entry | Suspended | Why it is void |
|---|---|---|
| D-001 | Principal-diversity clauses across the trust ladder | No ladder in v0.3. One steward is stated plainly in §2 rather than suspended in a register. |
| D-003 | Separation of duty across Scout/Curator/Specifier/Builder offices | Those offices do not exist. The surviving conflict is the steward's, carried forward as **D-101**. |
| D-004 | Board, Council, Ombuds, Registrar, Chief Auditor independence | None of these bodies exist in v0.3. Inventing seven bodies for one person produced a structure where that person wore every hat. |
| D-005 | Credit system uncalibrated | The **rationing** mechanism it described — metering submissions by verification cost — does not exist in v0.3. The whitepaper's earn loop is a different thing and is **present** as P9. |
| D-006 | — | Renumbered **D-102**, unchanged in substance. |
| D-008 | Ladder trust floors bypassed at genesis | No ladder, so no genesis exception is needed. The bootstrap deadlock it existed to solve was removed by deleting its cause. |

---

## Rules explicitly NOT suspended, at any severity

If any of these ever appears in the Open table, that is the signal that the
project has started lying to itself.

- **Part 1** — all permanent commitments, P1–P12
- **Acceptance tests frozen at approval** — the builder may not edit them
- **Cross-family review** — a same-family review never satisfies §3
- **Risk inheritance and reclassification** — §4's can-hurt bar, and the rule that relabelling a path is itself a can-hurt change
- **Uncited objections discarded** — no unfalsifiable authorities
- **Sole-steward authority ends 2028-01-28** — and may not extend itself
- **Governance is tested** — a rule without a test is reported unverified
