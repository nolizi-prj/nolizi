# Decision queue

Every open veto window and every queued human-only action, in one place, with
its deadline and its default. **Agents append new entries and mark expired
windows closed; only the steward moves a deadline, changes a default, or
vetoes** (CHARTER §2, §7). A veto is an entry edit by the steward, in the open,
with reasoning.

An entry without a stated default is a defect — silence must always select a
named outcome (CHARTER §2.1).

## Open

### Q-001 · Calendar integration intent statement — veto window
| | |
|---|---|
| **What** | `spec/0003-calendar-sync/INTENT.md`, published 2026-08-03. Window restarted at v0.4 adoption because the old model's signature boxes were never signed. |
| **Window closes** | **2026-08-29** (48h from 2026-08-27) |
| **Default on silence** | Proceed with the intent statement's own recommendations: Google first, then Microsoft; busy-time reading first, write-back as a separate optional grant; Google and Microsoft named as subprocessors before any token is held; the connection token treated as the most protected datum in the system. |
| **Status** | open |

### Q-002 · D-105 — lawful basis for bookers' personal data
| | |
|---|---|
| **What** | Human-only (`HUMAN.md`): decide the controller's lawful basis, approve the privacy notice. No default can proceed on silence — this is the one queue entry with no route around a public launch. |
| **Deadline** | none set — but it blocks public signup and blocks raising the 5-owner / 200-booking ceilings, permanently, until answered. |
| **Agent next step** | Draft the privacy notice, basis analysis, and deletion-reach statement, and attach them here for one-step approval. |
| **Status** | open — awaiting agent draft, then steward decision |

### Q-004 · Steward edits that the privacy-posture revision requires
| | |
|---|---|
| **What** | `CHARTER.md` Parts 4, 5.1 and 5.2, `DEBT.md` D-105/D-107, `REPORTING.md`, `SPEC-0002` and its service code were revised on 2026-08-29 so that strictness follows harm rather than discomfort (branch `privacy-posture`). Three files that agents may never edit (CHARTER §2, §7) still name the old posture and now contradict the rest. **Agents may not fix them. This entry is the proposal; the edit is the steward's.** |
| **Deadline** | *(steward to set)* |
| **Default on silence** | *(steward to set — agents may not. Until it is set, the contradiction stands and `MANDATE.md` governs, which means the ceilings remain frozen in practice however the spec now reads.)* |
| **Status** | **item 1 DONE 2026-08-29** — the steward removed the D-105 red line from `MANDATE.md`. Items 2 and 3 remain open. |

**1 · `MANDATE.md` → Red lines. — DONE 2026-08-29 by the steward.** The red line
below is deleted; public signup and the ceilings are no longer forbidden by the
mandate. The steward made the edit in their local working copy; an agent
transported the deletion verbatim into this repository and authored none of it.
Two editor artifacts in that copy were deliberately **not** carried over: a
whole-file reflow, and the `L-003` link rewritten to a `file:///home/m/dev/...`
path that would be broken for every reader but its author.

The deleted text was:

> - **D-105 binds absolutely**: no public signup, and the 5-owner / 200-booking
>   ceilings cannot be raised, while that debt entry is open.

with:

> - **D-105 is DEGRADING, not blocking.** The lawful basis is stated and in force
>   (`service/src/legal.ts` v1.0). The 5-owner / 200-booking ceilings are
>   defaults an operator may raise, and public signup is a deployment decision.
>   What remains human-only is the entity name, governing law, transfer
>   mechanism, and a review by counsel.

*Why this one matters most:* `MANDATE.md` is a steward instrument and outranks the
spec. While that line stands, the ceilings are still frozen no matter what
`SPEC-0002` D1 now says — so this edit is the one that actually lifts the block,
and everything else committed on 2026-08-29 is inert without it.

**2 · `DECISIONS.md` Q-002** — set a deadline and a default. Q-002 currently has
neither, which §2.1 calls a defect: *"An entry without a stated default is a
defect — silence must always select a named outcome."* It has been open since
2026-08-02 on that footing. Proposed default on silence: *proceed on the basis
already stated in `legal.ts`, with the three blanks tracked in D-105 until
counsel fills them.*

**3 · `HUMAN.md` → Legal accountability.** The D-105 entry describes agents
drafting a basis that has since been drafted and put in force. Proposed
replacement scope: *filling the legal entity name and registered address, the
governing law and supervisory authority, and the international transfer
mechanism; and commissioning the review by counsel.* The drafting is done.

**Also carried forward, unrelated to privacy:** Q-003's still-unactioned proposal
to strike "OAuth consent screen / test accounts" from `HUMAN.md`.

### Q-005 · Pumasi Booking public sign-up — can-hurt release, 7-day window
| | |
|---|---|
| **What** | [`releases/2026-08-29-pumasi-booking-public-signup.md`](releases/2026-08-29-pumasi-booking-public-signup.md), published 2026-08-29. Opening booking.pumasi.ai to public sign-up. Classed **can-hurt** (CHARTER §4): the people exposed are bookers, who have no account and never chose this project. |
| **Window closes** | **2026-09-05** (7 days, CHARTER §2.1). *Steward to confirm — agents may not set a deadline.* |
| **Default on silence** | *(steward to set.)* Proposed: the release proceeds as written in the note. |
| **Still outstanding at publication** | Part 4 requires **two approving reviews from two model families other than the builder's** for a can-hurt release. Neither has been obtained. The window may run concurrently; the release may not proceed without them. |
| **Named non-compliance** | CHARTER §5.1 requires a working reporting path and opt-out before an in-scope item releases. `PUMASI_REPORTING` is read by nothing, so this release does not meet §5.1. Stated in the note rather than discovered afterwards; the steward is choosing knowingly or not at all. |
| **Status** | open — window running |

## Closed

### Q-003 · Google Cloud OAuth application — **CLOSED 2026-08-27, done**
Steward's part: created `admin@pumasi.ai`, accepted the Cloud ToS and the API
Services User Data Policy (both terms acceptances, `HUMAN.md`), signed in once
to the operator browser (`tools/operator/`), and delegated CLI access. Agents'
part, under that delegation: project `pumasi-commons`, Calendar API enabled,
consent screen (external, testing mode), the single **non-sensitive**
`calendar.freebusy` scope (better than the *sensitive* estimated here earlier
— lightest review tier), `admin@pumasi.ai` as test user, and web client
`pumasi-service` with credentials in gitignored `apps/service/.env`. Record:
[`spec/0003-calendar-sync/GOOGLE-SETUP.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/service/spec/0003/GOOGLE-SETUP.md).
**Verification submission** is deliberately later — it needs a deployed app
and the Q-002 privacy policy URL.

**Proposal for the steward** (agents may not edit `HUMAN.md`): strike "OAuth
consent screen / test accounts" from the human registry — this session
demonstrated an agent performs them via the operator browser. Account
creation, terms acceptance, and verification *submission* stay human.
