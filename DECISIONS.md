# Decision queue

Every open veto window and every queued human-only action, in one place, with
its deadline and its default. **Agents append new entries and mark expired
windows closed; only the steward moves a deadline, changes a default, or
vetoes** (CHARTER §2, §7). A veto is an entry edit by the steward, in the open,
with reasoning.

An entry without a stated default is a defect — silence must always select a
named outcome (CHARTER §2.1). **While a product is pre-`launched` (CHARTER
Part 0), an open window does not hold reversible work: agents proceed on the
entry's default at once, and a veto reverts. Irreversible acts still wait.**

## Open

### Q-001 · Calendar integration intent statement — veto window
| | |
|---|---|
| **What** | `spec/0003-calendar-sync/INTENT.md`, published 2026-08-03. Window restarted at v0.4 adoption because the old model's signature boxes were never signed. |
| **Window closes** | **2026-08-29** (48h from 2026-08-27) |
| **Default on silence** | Proceed with the intent statement's own recommendations: Google first, then Microsoft; busy-time reading first, write-back as a separate optional grant; Google and Microsoft named as subprocessors before any token is held; the connection token treated as the most protected datum in the system. |
| **Status** | **CLOSED 2026-08-29** — the window ran to its deadline with no veto, so the stated default took effect. Marked closed by an agent, which CHARTER §2 permits for an expired window; the outcome is the one the entry already named, not a new one. |

### Q-002 · D-105 — lawful basis for bookers' personal data
| | |
|---|---|
| **What** | Human-only (`HUMAN.md`): decide the controller's lawful basis, approve the privacy notice. No default can proceed on silence — this is the one queue entry with no route around a public launch. |
| **Deadline** | none set. **The blocking clause this row used to carry is no longer true and is corrected here rather than left standing:** it said this entry blocks public signup and freezes the ceilings permanently until answered. The steward removed that red line from `MANDATE.md` on 2026-08-29, the ceilings are raisable, and public signup is a deployment decision. Correcting a statement of fact is not moving a deadline or softening a default; there is no deadline here to move, and the entry is not thereby resolved. |
| **Agent next step** | Draft the privacy notice, basis analysis, and deletion-reach statement, and attach them here for one-step approval. |
| **Status** | open — but **substantively superseded**, and it should probably be closed by the steward rather than by an agent. What it asked for exists: the basis is written and in force (`service/src/legal.ts` v1.0), the privacy notice is published and live, and deletion reach is stated. What is genuinely left has moved to D-105's own row — the transfer mechanism and a review by counsel. Left open rather than closed because closing it is a decision about whether the answer is *good enough*, and that is the steward's, not an agent's. |

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
| **Named non-compliance — now a recorded decision** | CHARTER §5.1 requires a working reporting path and opt-out before an in-scope item releases. `PUMASI_REPORTING` is read by nothing, so this release does not meet §5.1. **The steward decided on 2026-08-29 to release anyway**, with building it first offered and declined; that decision, its reasoning, what it costs, and the trigger that ends it are recorded as **`DEBT.md` D-108**. It is an exception for this release, not a standing permission — any release after this one clears it or reopens the question. |
| **Status** | **CLOSED 2026-08-29 — approved by the steward before the window's end.** The reviews stand as recorded in `DEBT.md` D-110: Gemini approved the final range; Grok's two earlier objections were both fixed and test-covered; the second non-builder approval is waived by the steward while Grok's balance is exhausted. |

### Q-006 · `MANDATE.md` deleted — **CLOSED 2026-08-29, decided**
The steward deleted `MANDATE.md`. Its **sequencing** job was already gone: work
comes from the product's own roadmap. Its **authorising** job is not replaced —
the steward decided that can-hurt surfaces need no human authorisation step,
*"if there is genuinely big risks, agents will report them."* Per-change steward
sign-off was offered as the alternative and declined.

`charter.yaml` was brought back into line with the prose it had drifted from —
Part 4 already read *"No human sign-off at any point: the classification is a
boolean per path in `RISK_ZONES.yaml`"* after `0ccfc39`, while the config still
named the mandate. **That file was then deleted the same day**: nothing read it,
and it had drifted twice in one day. Part 4's prose is now the only copy.

The residual is recorded as [`DEBT.md` **D-109**](governance/DEBT.md), including
what it does not fix and the bet being made, so that if it fails it fails on the
record. The can-hurt **gate** itself is untouched: two extra families, a
published release note, the 7-day veto window, ceilings first.

### Q-007 · Video conferencing integration — roadmap scope addition
| | |
|---|---|
| **What** | [`pumasi-booking#4`](https://github.com/pumasi-ai/pumasi-booking/issues/4) asks for video chat integration — "at least Zoom, Google Chat, Teams." Escalated from feedback intake rather than accepted: conferencing is **not on the GAP-0004 §3 sequence**, that sequence records steward-decided scope (including explicit exclusions), and two of the three named providers require **new third-party developer accounts** (Zoom; Microsoft/Entra app registration for Teams) — an account is escalation ground in the product-manager brief. The parity intent itself covers the *capability*: Cal.com and Calendly both attach a conferencing link to a booking as part of the product. |
| **Evidence added 2026-08-30** | [`pumasi-booking#30`](https://github.com/pumasi-ai/pumasi-booking/issues/30): a user on `/app/integrations?zoom_needed=1` expected a Zoom login screen — *"i expected to see a login screen of Zoom. is it impossible to use that UX?"* A second, independent request naming Zoom specifically, from the live integrations page rather than the tracker. Appended here by feedback intake instead of opened as a duplicate question; it does not change the default below, but it is the first evidence that users reach the integrations surface expecting Zoom before Google Meet. |
| **Window closes** | **2026-09-01** (72h from 2026-08-29) |
| **Default on silence** | Accept in principle under GAP-0004's parity intent, as a new sequence item **after 2b (calendar providers)**, adjacent to item 8 (workflows) since both are outbound-integration surface. **Google Meet first**: it can use the existing `pumasi-commons` Google Cloud project and `admin@pumasi.ai` (Q-003) with an added Calendar scope, so no new account is needed. **Zoom and Microsoft Teams follow only when their provider accounts/app registrations exist** — created by the steward or explicitly delegated, as Q-003 was. No provider credential is held before the subprocessor list names the provider, matching the Q-001 default's convention. |
| **Status** | open |

### Q-008 · Reporting path and opt-out — intent statement, veto window
| | |
|---|---|
| **What** | [`pumasi-booking` `service/spec/0004/INTENT.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/service/spec/0004/INTENT.md), published 2026-08-30. BACKLOG item 1: the CHARTER §5.1 reporting path and one-step opt-out, with the D-107 retention schedule published alongside. |
| **Window closes** | **2026-08-31** (24h from 2026-08-30) |
| **Default on silence** | Proceed with the intent statement's own assumptions: intake address defaults to `https://report.pumasi.ai/v1/reports`, documented as not yet live; held-tier (operating) reports retained twelve months, deletable earlier on request; the Cloudflare deployment sends nothing yet, revisited no later than the `launched` promotion; no report ever carries owner or booker data, or counts derived from them. |
| **Status** | open — pre-`launched` (CHARTER Part 0), so work proceeds on this default at once and a veto reverts. |

### Q-009 · Pumasi Booking reporting path — can-hurt release, 7-day window
| | |
|---|---|
| **What** | [`releases/2026-08-30-pumasi-booking-reporting-path.md`](releases/2026-08-30-pumasi-booking-reporting-path.md), published 2026-08-30. The CHARTER §5.1 reporting mechanism and opt-out (BACKLOG item 1, `spec/0004`), with the D-107 retention schedule published. Classed can-hurt by `RISK_ZONES.yaml` (service paths). |
| **Window closes** | **2026-09-06** (7 days, CHARTER §2.1). *Steward to confirm — agents may not set a deadline; this is the charter's own duration applied, not a chosen one.* |
| **Default on silence** | The release stands as written in the note. Nothing egresses in practice today: the live Cloudflare deployment is not wired and the documented intake is not live. A veto reverts the merge or sets `PUMASI_REPORTING=false` guidance, whichever the veto states. |
| **Reviews** | Gemini approved spec and code (transcripts in `pumasi-booking/reviews/`). Grok unreachable — D-104 condition live; pre-`launched`, review is advisory (Part 0) and the single non-builder bar (P5) is met. |
| **Status** | open — pre-`launched` (Part 0): the window does not hold the (reversible) release; a veto reverts. |

### Q-010 · Zoom connect stores the connection, and the PMI stops leaking — intent statement, veto window
| | |
|---|---|
| **What** | [`pumasi-booking` `service/spec/0005/INTENT.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/service/spec/0005/INTENT.md), published 2026-08-31. BACKLOG item 1, parts (b) and (c): the OAuth connect flow stamps the owner's *personal meeting URL* onto every Zoom event type and the public booking page prints it to anyone before they book; per-booking meeting creation is suppressed by that same stamp, so the card's "unique room for every booked session" is false for exactly the people who pressed the button. |
| **Window closes** | **2026-09-01** (24h from 2026-08-31) |
| **Default on silence** | Proceed with the intent statement's own assumptions: no joinable link on the public pre-booking page for **any** conferencing event type (Zoom, Meet, Teams, Google Chat), not Zoom alone; the personal meeting room kept as a **last-resort** fallback behind a per-booking room and an owner-typed link, and disclosed on the integrations card; **no data migration** of already-stamped links — they are neutralised (never printed publicly, never suppressing a per-booking room) rather than deleted, because they are indistinguishable from fallback links owners typed on purpose. |
| **Scope** | Correctness of an already-shipped surface. **Not** a provider-scope change: no new provider, no new developer account or app registration, no enlarged permission — so it does not act ahead of **Q-007**, whose window (closes 2026-09-01) governs exactly that. |
| **Status** | open — pre-`launched` (CHARTER Part 0), so work proceeds on this default at once and a veto reverts. |

### Q-011 · Pumasi Booking Zoom connect correctness — can-hurt release, 7-day window
| | |
|---|---|
| **What** | [`releases/2026-08-31-pumasi-booking-zoom-connect.md`](releases/2026-08-31-pumasi-booking-zoom-connect.md), published 2026-08-31. BACKLOG item 1 parts (b) and (c), `spec/0005`: the connect flow stores the OAuth connection instead of stamping the owner's personal meeting URL onto every Zoom event type; no public pre-booking page renders a joinable link for any conferencing kind; per-booking meeting creation actually runs, with a disclosed fallback order. Classed can-hurt by `RISK_ZONES.yaml` (service paths) — it handles a third-party credential and changes what an anonymous visitor is shown. |
| **Window closes** | **2026-09-07** (7 days, CHARTER §2.1). *Steward to confirm — agents may not set a deadline; this is the charter's own duration applied, not a chosen one.* |
| **Default on silence** | The release stands as written in the note. It is a net removal of exposure: a personal meeting room that any visitor could read is no longer printed, and no new provider, account or permission is introduced. A veto reverts the merge. |
| **Reviews** | Gemini approved spec (`reviews/20260831-001546-spec-gemini.md`) and code (`reviews/20260831-002759-code-gemini.md`), transcripts in `pumasi-booking/reviews/`. Grok unreachable — D-104 condition live; pre-`launched`, review is advisory (Part 0) and the single non-builder bar (P5) is met. `GATE: PASS` at `16c3fd4`. |
| **Relation to Q-007** | None claimed. This is correctness of an already-shipped surface: no provider added, no developer account or app registration created, no OAuth scope enlarged. Q-007's window (closes 2026-09-01) still governs whether conferencing scope widens. |
| **Status** | open — pre-`launched` (Part 0): the window does not hold the (reversible) release; a veto reverts. |

### Q-012 · Who deploys a merged fix, and by when
| | |
|---|---|
| **What** | Raised by the `pumasi-booking` product-manager evaluation of 2026-08-31 (ops `DIGEST.md`), from a concrete failure rather than a theory. The Zoom personal-meeting-room leak went through the full charter flow — intent, frozen acceptance cases, cross-family review, `GATE: PASS`, can-hurt release note (Q-011) — and **is still live on `booking.pumasi.ai`**, because nothing carried the build to the worker. `wrangler deployments list` puts the last deployment at 2026-08-30 16:55 UTC; the fix is 2026-08-31 05:27 UTC. `4f56df4` (the §5.1 reporting mechanism) is undeployed for the same reason. The gap is structural, not an oversight by any run: the flow in CHARTER §2.1 ends at a published release note, no role in `pumasi-ops/roles/` names deployment as a duty, and `HUMAN.md` does not reserve it — so it is agent work with no assignee, and a release note written in the present tense ("a public booking page never shows a joinable link") describes the branch while users meet the deployment. |
| **Why this is the steward's and not this seat's** | The product-manager role's strongest verb is *propose*, and it is disqualified from publishing. Assigning a duty is a change to the role register. This entry is the proposal; the assignment is the steward's. |
| **Window closes** | *(steward to set — agents may not set a deadline.)* |
| **Default on silence** | **The coder role deploys, as the last step of the job that merged.** After `GATE: PASS` and the published release note, the same run deploys the reviewed build and records the deployment in its digest entry; a job that cannot deploy says so in the digest instead of leaving it unsaid. Nothing here widens what an agent may touch: `HUMAN.md` reserves only signatures, payment, and edits to itself, and deployment credentials are already held by the tooling. Two riders, so the default is not a licence: **(a)** it applies to a build that passed the gate and carries a release note, never to an unreviewed tree; **(b)** it does not cover raising ceilings, enabling public signup, or rotating secrets, which stay where they are today. |
| **Named alternative, if the default is wrong** | A separate operator/steward step, deliberately manual — in which case the cost is explicit: a fix to a live user-facing defect waits on a human, and `roadmap/STAGE.md` must say so under "known gaps" rather than implying merged means shipped. Either answer is honest; the current state, where the duty exists but has no owner, is the one that is not. |
| **Status** | open. **Not** covered by CHARTER Part 0's proceed-on-default rule — that rule releases *reversible* work from an open window, and this entry proposes assigning a duty, which is a register change and not this seat's to make. The undeployed fix meanwhile sits at the top of `pumasi-booking/roadmap/BACKLOG.md` as item 1, marked operator action. |


### Q-013 · `/oauth/*/callback` works without a calendar hub, and the OAuth state is always signed — intent statement, veto window
| | |
|---|---|
| **What** | [`pumasi-booking` `service/spec/0006/INTENT.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/service/spec/0006/INTENT.md), published 2026-08-31. `roadmap/BACKLOG.md` item 2: on a deployment with no calendar integration configured, `if (!hub) return html(404, …)` (`app.ts` ~999) answers the OAuth callback *before* the `zoom` branch, so the Zoom connect flow can never complete — while `/oauth/zoom/authorize` and the integrations POST start it happily. The same absent hub makes three call sites build the OAuth state as `Buffer.from(JSON.stringify({purpose, owner_id, tag})).toString('base64url')` instead of `hub.sealState(…)`. |
| **Why both halves in one change** | The unsigned state is unreachable today and that is the whole of its safety: `openState` only ever opens a sealed value, so the fallback is dead, and the 404 is what keeps it dead. Removing the 404 alone would leave a callback whose obvious next "fix" is to accept an attacker-chosen `owner_id` in an unsigned string. The state seal is therefore made the gate, and the unsigned fallback is deleted, in the same change. |
| **Window closes** | **2026-09-01** (24h from 2026-08-31) |
| **Default on silence** | Proceed with the intent statement's own assumptions: the OAuth state becomes its own provider-independent facility sealed with `TOKEN_KEY` (one implementation — `CalendarHub.sealState`/`openState` delegate to it rather than restating it, L-007); a deployment with no `TOKEN_KEY` **refuses to start** a Zoom connect with the reason, instead of building an unsigned state, matching the refusal the connection storage already gives after the round trip (Z1c); every other flow riding that callback — Google sign-in, Microsoft sign-in, org OIDC, calendar connect — keeps exactly the reachability it has today, each still guarded by its own credentials; and the neighbouring defect found while reading (**`/auth/microsoft/start` is gated on a *Google* calendar hub, so Microsoft sign-in is off on any deployment without Google Calendar credentials**) is recorded for the roadmap owner to rank, not folded in here. |
| **Scope** | Correctness of an already-shipped surface. **No** new provider, **no** new developer account or app registration, **no** enlarged OAuth scope — so it does not act ahead of **Q-007**, whose window closes 2026-09-01. |
| **Status** | open — pre-`launched` (CHARTER Part 0), so work proceeds on this default at once and a veto reverts. |

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
