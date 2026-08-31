# Pumasi Booking stops printing a person's Zoom room to strangers

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-011). Stage is `beta`, so per CHARTER Part 0
the work proceeds now and a steward veto reverts it.**

## What was wrong

If you pressed "Connect with Zoom", we took your **personal meeting room** —
the one permanent room a Zoom account has — and pasted its join link onto your
public booking page. Anyone who opened that page could read it and walk in.
They did not have to book anything, prove an email address, or be invited.

The same paste was also what broke the promise on the card next to the button.
It said "a unique Zoom meeting room for every booked session". The code that
creates one per booking existed, but it was skipped whenever a link was already
stored — and connecting always stored one. So the feature was off for exactly
the people who had asked for it, and the tokens Zoom gave us were thrown away
at the end of the callback, stored nowhere, usable for nothing.

Found by the steward's end-to-end test on 2026-08-30, and independently by two
users the same day ([#26](https://github.com/pumasi-ai/pumasi-booking/issues/26),
[#30](https://github.com/pumasi-ai/pumasi-booking/issues/30)).

## What changed

- **Connecting stores the connection, and nothing else.** The Zoom credential
  is kept encrypted at rest under the deployment's `TOKEN_KEY`, the same way
  calendar credentials already are, in its own table. Your event types are not
  touched. If a deployment has no `TOKEN_KEY`, connect refuses rather than
  writing a token in the clear.
- **A public booking page never shows a joinable link.** Not for Zoom, and not
  for Google Meet, Teams or Google Chat either — it is the same defect and this
  fixes all four. The page says where the meeting is; the link goes out with
  the confirmation, to the person who booked and to the hosts.
- **Every booking now gets its own room**, created at the moment of booking
  using the connection you gave us, with the token refreshed when it has
  expired.
- **When Zoom cannot be reached we say what happens instead**, on the card: we
  fall back first to a static link you typed in yourself, then to your personal
  meeting room — and that link still only ever goes out with a confirmation.
- **"Connected ✓" now means connected.** The badge reads the stored
  connection, and shows which Zoom account it is. Disconnecting deletes it.
- **Deleting your account deletes the Zoom connection with it**, in the same
  transaction as the rest of the erasure.

## What did *not* change, deliberately

- **No new provider, and no wider Zoom.** No new developer account, no new app
  registration, no enlarged permission. Whether to widen conferencing scope is
  the open question `Q-007` governs (window closes 2026-09-01) and this does
  not anticipate it.
- **Nothing already in the database was deleted.** A personal room stamped by
  the old flow and a fallback link someone typed on purpose look identical in
  the schema, so deleting both would have destroyed working settings. Old
  values stop being printed publicly and stop suppressing a per-booking room,
  which is the whole of the harm. Pressing Disconnect removes yours.

## What could hurt someone, and what stands in the way

- **The leak this closes is the harm.** A permanently joinable room belonging
  to a real person, readable by anyone who loaded a URL. Two acceptance cases
  are written to fail against the previous release and were confirmed doing so:
  the old public rendering was verified to be `Zoom — https://us02web.zoom.us/j/…`.
- **A credential in a new table.** Sealed with AES-GCM under `TOKEN_KEY`; a
  copy of the database alone reveals nothing. Tested by asserting sentinel
  tokens appear nowhere in the row and that the wrong key opens nothing.
  Deleted on disconnect and on account deletion, verified by absence.
- **A booking failing because Zoom did.** Every step of the chain is
  best-effort; the booking is already committed before Zoom is contacted.
  Tested with Zoom throwing, returning 500, and refusing the refresh grant.
- **A silent downgrade.** If we cannot mint a room you still get a link, but
  the card now states that order rather than leaving you to discover it from a
  stranger's screen.

## What was tested

Ten acceptance cases (spec/0005, frozen before implementation at `40712d9`),
including the public page asserted to contain no joinable link, refresh-token
rotation persisted before use, the full six-step fallback chain walked in
order, and deletion verified by absence. Full suite: **290 service tests + 19
engine tests, green**; `GATE: PASS`. The Cloudflare bundle builds with the new
migration registered. Cross-family review: Gemini approved spec and code; Grok
unreachable (D-104 condition live, recorded not worked around).

## Open debt this release touches (§2.1 requires their status here)

- **D-104** (reviewer breadth): still live. One family carried both reviews;
  CHARTER §3's rule that the spec reviewer must not be among the code
  reviewers cannot bind below three families, and is off rather than pretended.
- **D-105** (privacy posture, DEGRADING): unchanged. Zoom was already a named
  subprocessor — the connect flow already contacted it — so the published list
  needs no change.
- **D-107** (held-tier retention): untouched. No reporting field is added.

## Also found, not fixed here

On a deployment with no calendar integration configured, `/oauth/*/callback`
returns 404, so the Zoom connect flow cannot complete at all — and the
unsigned state the connect handler builds in that case is dead code the
callback can never accept. Not the live defect (this deployment has a calendar
hub), and outside spec/0005's frozen clauses, so it is raised for the backlog
rather than widened into under a frozen spec.
