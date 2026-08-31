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

### Q-014 · Deploying to the tunnel relay disconnects its only real user — does Q-012's default extend to a stateful host?
| | |
|---|---|
| **What** | Raised by the `pumasi-tunnel` product-manager evaluation of 2026-08-31 (ops `DIGEST.md`), from the next fix rather than a theory. `roadmap/BACKLOG.md` items 1 and 2 both change relay code, and item 1's second half puts a TLS terminator in front of `*.pumasi.link`. Every one of those needs the relay process on the Vultr host restarted or fronted — and **the relay keeps no durable state**: its subdomain registry and TCP port pool are in-memory maps (`core/route.go`, `core/portpool.go`), so a restart drops every live tunnel. Today that set is exactly one: `sshsteward`, `pumasi.link:20000` → port 22, open 7 h 50 m at the time of measurement, which is `RESOURCES.md` §4's `ssh -p 20000 m@s.pumasi.link` — how this machine is reached. **Q-012** names the coder as its default deployer; it was raised from `pumasi-booking`, where a deploy is a Cloudflare Workers upload that displaces no session. Applying the same default here means a coder job restarting the host that carries the steward's remote access, with no reconnect guarantee for the name or the port it hands back. |
| **Why this is the steward's and not this seat's** | The product-manager role's strongest verb is *propose*, and it is disqualified from deploying. This entry does not ask whether TLS should exist — that is ordinary agent work: `HUMAN.md` reserves signatures, payment and edits to itself, an ACME subscriber agreement is a click-through it explicitly permits, and Let's Encrypt costs nothing. It asks only whose hand restarts a host whose sole live tunnel is the steward's own access, and under what precautions. |
| **Window closes** | *(steward to set — agents may not set a deadline.)* |
| **Default on silence** | **Q-012's default extends: the coder deploys as the last step of the job that merged**, with three riders specific to this host. **(a)** Tailscale is verified reachable first — `RESOURCES.md` §3 keeps it as the independent fallback for `m-gtr` precisely so that a bug in this young product costs an inconvenience rather than access, and that is worth nothing unverified. **(b)** The restart, and the state of `sshsteward` after it, are named in the job's digest entry; the keepalive cron (`tools/pumasi-tunnel-keepalive.sh`, `@reboot` + 5-minutely) is confirmed to have re-established the tunnel on the same address before the job reports done. **(c)** Nothing here covers `ufw` changes, raising ceilings, or rotating the relay's ssh host key, which stay where they are today. |
| **Named alternative, if the default is wrong** | A steward-only restart window for this host. The cost is explicit and should then be written into `roadmap/STAGE.md`: relay fixes queue behind a human, and a product whose stage notes already say a restart drops every tunnel would add that it also waits. |
| **What retires this entry** | `BACKLOG.md` item 3 — durable registry and port reservations. Once a restart no longer costs anyone their address, this stops being a question and becomes an ordinary deploy under Q-012. |
| **Status** | open. Like Q-012, **not** claimed under CHARTER Part 0's proceed-on-default rule: that rule releases reversible work from an open window, and this asks who may take an action that disconnects a live user. Meanwhile `BACKLOG.md` item 1's build half (a) — announcing the scheme the relay actually serves — needs no deploy decision to be written, reviewed and merged. |


### Q-015 · Pumasi Booking OAuth callback reachability — can-hurt release, 7-day window
| | |
|---|---|
| **What** | [`releases/2026-08-31-pumasi-booking-oauth-callback.md`](releases/2026-08-31-pumasi-booking-oauth-callback.md), published 2026-08-31. `roadmap/BACKLOG.md` item 2, `service/spec/0006`: `/oauth/*/callback` gates on being able to open a sealed OAuth state rather than on the presence of a calendar hub, so a deployment with a Zoom app and no calendar integration can complete a Zoom connection; and the unsigned `base64url` state three call sites built in that case is deleted. Classed can-hurt by `RISK_ZONES.yaml` (service paths) — it changes the authentication of the value that says whose third-party connection is arriving. |
| **Window closes** | **2026-09-07** (7 days, CHARTER §2.1). *Steward to confirm — agents may not set a deadline; this is the charter's own duration applied, not a chosen one.* |
| **Default on silence** | The release stands as written in the note. It is a net removal of exposure: the only unauthenticated state construction in the service is gone, and the gate it replaces is a stronger one (a signature, not a configuration check). No new provider, account or permission. A veto reverts the merge. |
| **Reviews** | Gemini approved the spec (`reviews/20260831-090554-spec-gemini.md`), the amendment to it (`reviews/20260831-091352-spec-gemini.md`), and the code (`reviews/20260831-092229-code-gemini.md`; an earlier run at `reviews/20260831-091903-code-gemini.md` reviewed the same tree under hashes that a trailer-format rewrite then replaced — kept, and explained in the commit). Grok unreachable — D-104 condition live; pre-`launched`, review is advisory (Part 0) and the single non-builder bar (P5) is met. `GATE: PASS` at `4f6ddf0`. |
| **Relation to Q-007** | None claimed. Correctness of an already-shipped surface: no provider added, no developer account or app registration created, no OAuth scope enlarged. Q-007's window (closes 2026-09-01) still governs whether conferencing scope widens. |
| **Relation to Q-012** | **Not deployed, and not deployable by this run.** Q-012 (who carries a merged build to `booking.pumasi.ai`) is open and is explicitly outside Part 0's proceed-on-default rule, so this seat did not deploy and did not take `BACKLOG.md` item 1. Unlike Q-011's release, the undeployed state costs little here: the defect this closes cannot occur on `booking.pumasi.ai`, which has a calendar integration. Those affected are self-hosters who deploy their own copy from the repository. |
| **Status** | open — pre-`launched` (Part 0): the window does not hold the (reversible) release; a veto reverts. |

### Q-016 · Pumasi Sign multi-document envelopes — does "just like DocuSign" mean one merged PDF or many documents?

| | |
|---|---|
| **What** | Raised by the `pumasi-sign` feedback intake of 2026-08-31 from customer issue [#4](https://github.com/pumasi-ai/pumasi-sign/issues/4): *"often users want to add multiple documents for one envelope just like docusign."* The ask itself is not in question — it is already `roadmap/BACKLOG.md` item 4. What is in question is what counts as delivering it, because that file records two different products under one line: *"multi-document envelopes as separate files with per-file thumbnail cards (today: merged to one PDF at upload — the card UI can front the merge first, true multi-doc needs backend)."* Option A shows a user several cards and stamps, certifies and delivers **one** merged PDF. Option B keeps documents separate end to end: separate files, separate stamping, per-document integrity in the certificate, separate download. |
| **Why this is the steward's and not this seat's** | It is a change to what the product promises, not a scheduling choice, so the product-manager role escalates rather than decides. The public landing page added in `10a523d` sells this product against DocuSign by name and promises "cryptographic SHA-256 tamper-evident certificates". A customer who asks for DocuSign's behaviour and is given a merge gets a certificate that attests to a concatenation — one hash over a document set that the user believes is several documents. That may be perfectly acceptable; it is not something an agent should decide quietly inside a UI ticket, because the difference only becomes visible to the customer at the moment they need one document out of an envelope and cannot get it. |
| **Window closes** | *(steward to set — agents may not set a deadline.)* |
| **Default on silence** | **Option A, with the limitation stated in the UI.** Build the per-file thumbnail cards over the existing upload-time merge, and say plainly on the send screen and in the certificate that the documents were combined into a single signed PDF. Reasons: it is the smaller change, it needs no backend rework, it delivers the ergonomics the customer actually described (adding several files without merging them by hand first), and stating the limitation keeps the certificate honest — the failure mode this default guards against is a certificate that implies more separation than exists. Option B stays on the backlog as item 4's second half rather than being dropped. |
| **Named alternative, if the default is wrong** | **Option B first**, accepting that item 4 stops being a frontend task: separate storage per document, per-document stamping in `backend/app` and the worker, per-document hashes in the certificate, and a download picker that can return one document or a zip. Materially larger, and it would displace items 2 and 3 in the current ordering. Worth choosing if the intended buyer is one who sends mixed document sets — a contract plus its exhibits — where "give me exhibit C" is a routine request. |
| **What retires this entry** | A decision recorded here, and `roadmap/BACKLOG.md` item 4 rewritten to name one option rather than describing both. |
| **Status** | open. Pre-`launched` (CHARTER Part 0), so the frontend card work under Option A may proceed on the default; a veto reverts. Nothing here authorizes the Option B backend rework. |


### Q-017 · `PRODUCT-RULES.md` exists only on an unmerged branch — merge it, or amend the role file that requires it

| | |
|---|---|
| **What** | Raised by the `pumasi-booking` product-manager evaluation of 2026-08-31 (ops `DIGEST.md`), from a file that three consecutive evaluations have flagged and nothing has moved. The product-manager role file opens with **"Read first, every packet: `PRODUCT-RULES.md` in the `pumasi` repository"** and adds that it is read fresh each run, never cached or vendored, because a stale copy is L-007. That file is **not on `pumasi` main**. It exists only on the pushed branch `worktree-product-rules` (`0115758`, v1.0, 2026-08-30, created by steward direction), which is one branch deletion away from taking PR-1 and PR-2 with it. Every packet that obeys the role file today reads a rule register from a branch that `main` does not know about, and each one has had to say in its own commit that absence from `main` is not compliance. |
| **Why this is the steward's and not this seat's** | The file was created by steward direction, and merging it is what makes PR-1 (version numbers, binds always) and PR-2 (in-app feedback, binds at `beta`) bind on every product — a change to what the products promise, which the role file's own duty 1 defines as escalation ground. This seat may write a `BACKLOG.md` entry against a rule; it may not decide that the rule register is policy. |
| **Window closes** | *(steward to set — agents may not set a deadline.)* |
| **Default on silence** | **Merge `worktree-product-rules` into `pumasi` main as it stands**, with no rule edited: v1.0, PR-1 and PR-2 with the stages they already name, the change log intact. The merge is what the file's own header already assumes — it calls itself "Live, continuously updated" and tells the product-manager role to read it every packet. Nothing here adds a rule, changes where one binds, or creates a compliance table; PR-1's version work stays where it is, `pumasi-booking/roadmap/BACKLOG.md` item 3. |
| **Named alternative, if the default is wrong** | The register is **not** yet policy — in which case the cost is explicit and lands somewhere else: `pumasi-ops/roles/product-manager.md` must stop instructing every packet to read first a file that `main` does not contain, and the `BACKLOG.md` entries citing PR-1 across the products must be re-grounded or dropped. Either answer is workable; the current state, where a mandatory read points at an unmerged branch, is the one that is not. |
| **What retires this entry** | `PRODUCT-RULES.md` present on `pumasi` main, or the role file amended to match reality. |
| **Status** | open. **Not** claimed under CHARTER Part 0's proceed-on-default rule: an agent merging the steward's own rule register into `main` would be deciding that the rules are policy, which is not a reversible product change and is not this seat's to make. Meanwhile the role file is obeyed as written — the branch copy is read fresh each packet, and `pumasi-booking`'s PR-1 gap stays ranked on it. |

### Q-018 · Which implementation is Pumasi Sign — the tested FastAPI backend, or the deployed Cloudflare Worker?

| | |
|---|---|
| **What** | Raised by the `pumasi-sign` coder job of 2026-08-31 (ops `DIGEST.md`, job 0018), from a live reproduction rather than a theory. The repository carries **two complete, independent backends for one product**. `backend/` is a FastAPI + Postgres app: it is what `CLAUDE.md` documents, what `Dockerfile` builds, what Alembic migrates, what the `backend` CI job's 545 tests cover, and what the `e2e` job Dockerizes and drives with Playwright. `service/` is a Cloudflare Worker with a Durable-Object SQLite store and R2 documents, and `service/wrangler.jsonc` claims `sign.pumasi.ai` as a `custom_domain`. **The worker is what users meet.** Verified against the live host this tick: `POST /api/auth/dev-login` and `POST /api/auth/email/request` — both FastAPI routes — return `404 {"error":"Endpoint not found"}`, which is the worker's error body (`service/src/durable.ts:1533`); FastAPI would answer `{"detail": …}`. The worker-only `POST /api/auth/login/verify` answers `401 {"error":"Invalid or expired verification code"}`, and `GET /api/auth/me` answers `401 {"error":"Not signed in"}`. **CI never builds, lints or tests `service/` at all** — `service/src/test/` exists (`stamping.test.ts`, `e2e-workflow.test.ts`) and no workflow runs it. So the 545 green backend tests and the six e2e specs describe a tree no user reaches. The two trees also **disagree about who may hold an account**: `backend/app/config.py:22` gates on `ALLOWED_EMAIL_DOMAINS` (default `pumasi.ai`) at `auth.py:206`, while the worker's `establishSession` (`service/src/durable.ts:655`) creates an account for any verified email with no domain gate at all — reproduced live, `POST /api/auth/login/request` for `someone@example.com` returns `200`. This is [L-009](lessons/L-009-two-paths-one-claim.md)'s exact shape — the lesson was written from `pumasi-booking`'s Node-vs-Workers split — reappearing in a second product, plus [L-006](lessons/L-006-tests-that-cannot-fail.md) at suite scale: a green gate that cannot fail for the deployment it is read as covering. |
| **Why this is the steward's and not this seat's** | Not a defect with a repair — both trees work. The question is which one *is* the product, and answering it means either retiring a working implementation or committing to maintain two. It also settles who may hold an account, because the two answers differ today. A coder job may fix a bug in either tree; it may not choose which tree the product is. |
| **Window closes** | *(steward to set — agents may not set a deadline.)* |
| **Default on silence** | **The deployed Cloudflare Worker is Pumasi Sign, and the documentation and the gate are corrected to say so — without deleting anything.** Three parts, all reversible: **(a)** `CLAUDE.md` stops describing Railway/FastAPI as *the* deployment and names `service/` on Cloudflare as what serves `sign.pumasi.ai`, with `backend/` marked as a second implementation that is not in production; **(b)** CI gains a job that runs `service/src/test/`, so the code users actually meet is covered before the next behaviour change ships; **(c)** no claim about production is read off the `backend`/`e2e` jobs until (b) exists. What this default deliberately does **not** do is retire `backend/`, re-point the domain, or migrate data — those are irreversible or user-visible and stay the steward's. |
| **Named alternative, if the default is wrong** | FastAPI on Railway is the product and the worker is an experiment that must give up the `sign.pumasi.ai` route. Then the cost is explicit and belongs in `roadmap/STAGE.md` under known gaps: the live host must be re-pointed, and every account, session and document now living in the worker's Durable Object and R2 bucket — real users' data — must be migrated or knowingly dropped. |
| **Relation to Q-012** | Q-012's default names the coder as deployer of a merged, gate-passed build. It is unaffected by this entry except in one practical respect: carrying a `pumasi-sign` build to users means `wrangler deploy` from `service/`, **not** the Railway push that `CLAUDE.md` describes. A run that followed `CLAUDE.md` would deploy a tree no user reaches and report it as shipped. |
| **Status** | open. The default's three parts are documentation and CI only — reversible, and pre-`launched` Part 0 releases them from the window; this job did not take them, because it was scoped to the entry path and the red gate, and (a) touches `CLAUDE.md`'s description of the whole product. Recorded here so the next `pumasi-sign` job does not rediscover it. |


### Q-019 · `catalog.json` is the file every agent is told to read first, and no role file owns it

| | |
|---|---|
| **What** | `README.md` tells every arriving agent **"start with `catalog.json`"** and names it the duplication check the charter requires before anything new is built. Verified against `pumasi` main @ `5bd2d81` this tick, not inherited: the file contains **zero occurrences of the string `tunnel`** — **Pumasi Tunnel has no `products[]` entry and no `items[]` entry at all**, though its `roadmap/STAGE.md` records the Stage-1 exit gate **MET 2026-08-31**, it serves two live public surfaces (`http://pumasi.link/` → 200, `pumasi.link:2222` → `SSH-2.0-pumasi-tunnel`), and `pumasi.ai` has carried its catalog card since `c2084a8`. Alongside that: `Pumasi Booking` is `"status": "seed"` in `products[]` and `"maturity": "seed"` in `items[]`, against **`beta`** in its own `roadmap/STAGE.md` (set 2026-08-29, evidence refreshed twice on 2026-08-31); `"updated"` still reads `2026-08-29`; `items[].tests.service` reads `246` against 305 in the 2026-08-31 release note. Surfaced by the commons marketing job `0021`, which was right not to edit it — it is not that seat's file. |
| **Why this is the steward's and not this seat's** | Because **no seat owns it**, and the fix is a role-file amendment rather than a content edit. `roles/ecosystem-manager.md` duty 4 says "Keep `catalog.json` and `pumasi-web` accurate" — but the ecosystem manager is **not** in `roles/project-manager.md`'s closed list of what a tick may enqueue, which ends "No other inventions", so no clock can start it. `roles/marketing-manager.md`'s **May Write** names `pumasi-web` and product `web/`, not `pumasi/catalog.json`. `roles/product-manager.md`'s **May Write** is `roadmap/*`, issue labels, `DECISIONS.md` questions and the ops digest — not `catalog.json`. `roles/product-hunter.md` is explicitly forbidden it. This seat reads it and does not own it. The commons index is the one public file in the project with a stated duty and no assigned owner — the `STAGE_PLAYBOOK.md` Zero-Unassigned-Duty Rule failing on the playbook's own front door. |
| **Window closes** | *(steward to set — agents may not set a deadline.)* |
| **Default on silence** | **Split the file along the seam that already exists, and amend the two role files to say so.** **(a) Registering a product** — its first `products[]` and `items[]` entries — becomes part of the **marketing manager's** Day-1 mandate, next to Surface A (`pumasi-web/content/products/<slug>.md`), and `roles/marketing-manager.md` gains `pumasi/catalog.json` in **May Write**. That is the duty that was missed for Pumasi Tunnel: Surface A shipped, the index entry did not. **(b) Keeping a registered product's `status` / `maturity` true** becomes part of the **product manager's** duty 6 (the stage): the run that writes `roadmap/STAGE.md` updates that product's own catalog fields and the top-level `updated` in the same commit and the same reasoning, so the two cannot fork (L-007). `roles/product-manager.md` gains `pumasi/catalog.json`, **that product's entries only**. **(c)** Neither seat may edit another product's entry, and neither touches the `governance`, `structure` or `licence` blocks. The content edits this unblocks are reversible file edits on a pre-`launched` commons, so the first packet under this default proceeds at once and a veto reverts. |
| **Named alternative, if the default is wrong** | Stand the **ecosystem manager** up as a queued role and give it the file whole. Then the cost is explicit and lands in one place: `roles/project-manager.md`'s enqueue list must name it, because that list as written forbids this tick from dispatching it — and a role that no clock may start is a role that does not run, which is the state it is in today. |
| **What retires this entry** | `pumasi-tunnel` present in `catalog.json`, Booking's catalog status matching its own `STAGE.md`, and at least one role file naming `pumasi/catalog.json` in its **May Write**. |
| **Status** | open. The *content* is reversible and pre-`launched`, but the thing that makes it fixable — amending another role's **May Write** — is a register change and not this seat's to make. Meanwhile the index stays wrong in public: an agent running the charter's duplication check today is told Pumasi Tunnel does not exist. |


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
