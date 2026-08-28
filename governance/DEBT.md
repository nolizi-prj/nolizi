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
| **Status now** | Three families are working, so the rule binds today. This entry exists because it silently switches off if a provider becomes unavailable, and a rule that disappears without notice is worse than one that was never claimed. |
| **Compensating controls** | None available at two families. The gate still holds; only its breadth degrades. |
| **Clears when** | Three families are continuously available, or the rule is made unconditional and merges block when it cannot be met. |
| **Opened** | 2026-08-01 |

### D-105 · No privacy basis for signed public reports — deferred by decision
| | |
|---|---|
| **Severity** | **Escalated 2026-08-01 to BLOCKING for `spec/0002`.** It remains DEGRADING for `spec/0001`, which ships no service and holds nobody's data. |
| **Rules affected** | None suspended. This is a question that has not been answered, not a rule being run below. |
| **What is unresolved** | Reports are **signed, public, permanent and mirrorable** (CHARTER §5.2, P9). A signed report identifies its sender, which is personal data when that sender is a natural person. No lawful basis has been established, and no legal review has been performed, for publishing it. |
| **Decision** | **Deferred indefinitely on 2026-08-01** by the steward, to be revisited *"when it bites"*. Recorded as a decision, not an oversight — the alternative (resolve before first release) was offered and declined. |
| **Why deferring was defensible when filed** | There were no users. Nothing was exposed while the only person running the software was the person who wrote it, and premature legal work on an unbuilt system is `L-001`. |
| **What changed on 2026-08-01** | The steward directed a **deployable service with accounts** (`spec/0002`). That crosses the line the deferral rested on. Until now the only personal data in scope was the sender's own identity on a report they chose to publish. A service with accounts holds **third parties'** names, email addresses, and who they are meeting and when — people who never read `REPORTING.md`, never chose to contribute, and in many cases will not know this project exists. Deferral was reasonable for the first case and is not available for the second. |
| **Superseded reasoning, kept visible** | This entry originally said invite-only or single-user deployment "keeps the question theoretical." **That was wrong.** Adversarial review established that a booker is a stranger by design: the product works by an owner sharing a link with people who have no account and who type in their name and email. Third-party personal data arrives on the first real booking under *any* configuration where the service does its job. Invite-only limits who may *own* a schedule; it never protected bookers. |
| **The decision taken, 2026-08-02** | The steward accepted this: real bookings from a small circle of personally known people, **before** the basis is established. Offered and declined: moving the gate to the first real booker, and building a version that collects no booker email at all. |
| **What this blocks, and what it does not** | Blocks **public signup**, permanently, while this entry is open. Does **not** block building, deploying, or taking bookings from known people within the ceilings below. |
| **Compensating controls, added because the decision was taken** | `SPEC-0002` D1 enforces a **hard ceiling — 5 owner accounts, 200 bookings** — which may be lowered but **cannot be raised while this entry is open**. "A small known circle" is a justification that expires silently; a number that cannot be raised without answering the question is the only version of it that stays true. Alongside: D2 minimal collection, D3 deletion by absence, D6 named subprocessors, D7 stated deletion reach including backups, D9 a visible notice at the point of collection. |
| **What none of that fixes** | There is still no lawful basis, and the data cannot be recalled from backups or forks once written. The controls bound the blast radius; they do not make the collection lawful, and this row exists so that nobody later reads the control list and concludes it was. |
| **Why this debt is unlike the others** | Every other entry here describes a rule we can start honouring later, with no residue. This one does not. The ledger is mirrorable by design (P3), so personal data published once **cannot be recalled from forks**. The failure mode is not "we were non-compliant for a while"; it is "the data is out and stays out." |
| **Compensating controls** | The opt-out exists, is one step, and works. `REPORTING.md` discloses the position in plain language, including that reports are signed and that the no-personal-data argument does not apply. No release has occurred. |
| **Clears when** | For `spec/0001`: a decision is taken to resolve it; no automatic trigger was set. For `spec/0002`: it must be answered — what is collected, on what basis, how someone deletes it, where it lives — **before any account exists that is not the steward's.** |
| **The one thing that is not deferred** | **Any release note for an item that reports must state this entry's status.** Release sign-off is a human decision (CHARTER §2, decision 4), and this ensures the question is in front of the person making it rather than resolved by inattention. That is not a gate — release is not blocked — and it does not reopen the deferral. It only prevents the risk being shipped by someone who did not know they were shipping it. Writing a risk down must not become a way of authorising it, and a debt entry nobody encounters at the moment of decision is exactly that. |
| **Opened** | 2026-08-01 |

### D-106 · Work can proceed on silence — the veto model's residual
| | |
|---|---|
| **Severity** | DEGRADING |
| **Rule affected** | CHARTER §2 (v0.4) — accountability by veto assumes the steward reads what is published within the window. |
| **Why** | v0.4 replaced blocking signatures with veto windows because the recorded evidence was 24 days of stall behind self-addressed signature boxes. The cost of the fix, stated plainly: an intent statement or a can-hurt release note that nobody reads proceeds anyway. The human confirmation L-005 argued for is now optional in practice. |
| **Compensating controls** | Open questions in intent statements must state the default the agents will assume (§2.1), so silence selects a named outcome, never an unnamed one. Can-hurt releases keep the 7-day window, the two-extra-family gate, staged ceilings, and the D-105 rule that the note must state open debt — the risk is in front of whoever chooses not to read. `DIGEST.md` makes silence informed rather than blind. |
| **Clears when** | A second accountable party exists (two vetoes are a quorum, one is a hope), **or** a veto-window release causes harm an affirmative signature would have caught — in which case the affirmative sign-off returns for can-hurt releases and this entry records why. |
| **Opened** | 2026-08-27 |

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
