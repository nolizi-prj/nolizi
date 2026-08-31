# Pumasi Booking's Zoom button now works if you self-host without a calendar

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-013 is the intent window; this note's window
is Q-015). Stage is `beta`, so per CHARTER Part 0 the work proceeds now and a
steward veto reverts it.**

## Who this is for

The operator running their own copy. `VALUE.md` §1 offers you "a port, and
optionally a PostgreSQL URL" — no provider load-bearing. If you took that at
its word, set up a Zoom app, and did **not** connect a Google calendar, the
Zoom button was broken end to end and nothing told you why.

**This does not affect `booking.pumasi.ai`**, which has a calendar
integration configured and never hit either half of this.

## What was wrong

Pressing "Connect with Zoom" sent you to Zoom, you approved, and the page Zoom
returned you to answered **"Calendar integration is not configured"** and
stopped. Not "Zoom" — *calendars*, which is not what you were connecting.
The check ran before the page ever looked at what kind of connection was
coming back, so the Zoom half of it was unreachable and the message named the
wrong thing.

The cause was where one piece of machinery had been put. The signed ticket
that travels out to the provider and comes back — the thing that says *whose*
connection this is — was written as a method on the calendar code, although it
uses nothing but the deployment's secret key. No calendar, no ticket, no way
back in.

Second symptom, same cause: with no calendar, three places in the code built
that ticket **unsigned** — plain readable, plain writable text carrying an
account id — instead of sealing it.

## Why both halves had to move together

The unsigned ticket could never be used. The page that receives it only ever
opens a sealed value and refuses everything else, and the 404 above killed the
request before it got that far anyway. Being unreachable was the entirety of
its safety.

So fixing the 404 on its own would have been the dangerous change: it would
have turned a dead branch into a live door, standing one plausible-looking
"fix" away from a callback that takes an attacker-chosen account id out of a
string anyone can write. That is why this is one release and not two, and why
the fix makes **the signature itself the gate** rather than removing a gate.

## What changed

- **The ticket is its own thing now, and there is exactly one of it.** Sealed
  under the deployment's existing `TOKEN_KEY` — the same key that encrypts
  stored credentials — with the format unchanged, so a ticket issued before
  this release still works after it. A rollout is not a broken deployment.
- **No unsigned version exists anywhere.** Deleted at all three places that
  built one; those three are now one piece of code, because three copies of a
  security check is how one of them gets fixed and the others do not.
- **The return page decides by reading the ticket.** A deployment with a Zoom
  app and no calendar can complete a Zoom connection.
- **With no `TOKEN_KEY`, the button refuses before the trip, and says so.**
  Previously it built an unsigned ticket and failed after. The connection
  storage already refused in this case; the refusal now comes first, where it
  is useful.
- **Calendar connections answer exactly what they answered before.** Same
  status, same sentence, checked by a test written to catch it moving.

## What did *not* change, deliberately

- **No new provider, account, app registration, or wider permission.** This is
  the correctness of a surface that already shipped. Whether conferencing scope
  widens is the open question `Q-007` governs (window closes 2026-09-01), and
  this does not anticipate it, exactly as `spec/0005` did not.
- **Nothing about what a booking page shows, what a confirmation contains, or
  how a meeting is created.** `spec/0005` settled those.
- **No stored data touched.** A ticket lives fifteen minutes; there is nothing
  to migrate and nothing was deleted.
- **No sign-in flow became reachable anywhere it was not already.** Google
  sign-in, Microsoft sign-in and organisation SSO each keep their own
  credential check, and a test asserts an unconfigured provider is not even
  contacted.

## What could hurt someone, and what stands in the way

- **The risk this release actually carries is the one it removes.** A
  reachable callback with an unsigned ticket would let a stranger name whose
  account a Zoom connection attaches to. Both halves land together, so that
  state never exists. A test forges the exact string the deleted code used to
  produce and asserts it opens as nothing.
- **A ticket accepted after it should have expired.** Fifteen minutes,
  unchanged, and tested: expired, tampered, sealed under another deployment's
  key, and sealed with no expiry at all each open as nothing.
- **A flow quietly opening up because a gate moved.** The gate did not go
  away — it changed from "is there a calendar" to "can this ticket be opened",
  which is the question the page was always asking. Every downstream branch
  keeps its own credential check and each is tested at its refusal.
- **A deployment mid-rollout, half old and half new.** The wire format is
  byte-identical; both directions are tested against each other.

## What was tested

Six acceptance cases (`service/spec/0006`, frozen before implementation at the
spec approval), of which two were verified **failing** against the previous
release before the fix and passing after — a defect spec proves itself by
failing first (L-006). Full suite: **305 service tests + 19 engine tests,
green**; `GATE: PASS`. Cross-family review: Gemini approved the spec, the
amendment to it, and the code; Grok unreachable (D-104 condition live,
recorded rather than worked around).

Honest note on the acceptance cases: one frozen assertion was **wrong** — it
required the string `base64url` to be absent from a file where an unrelated,
correct use of it predates this work. Rather than quietly loosen the test, the
spec was amended in the open and re-reviewed cross-family before the
implementation was accepted (CHARTER Part 3 req 2). The replacement is
narrower on the word and stronger on the behaviour.

## Open debt this release touches (§2.1 requires their status here)

- **D-104** (reviewer breadth): still live. One family carried spec and code
  review; CHARTER §3's rule that the spec reviewer must not be among the code
  reviewers cannot bind below three families, and is off rather than pretended.
- **D-105** (privacy posture, DEGRADING): unchanged. No new data, no new
  subprocessor — Zoom was already named.
- **D-107** (held-tier retention): untouched. No reporting field is added.
- **D-109** (no per-change human authorisation): unchanged; this note and its
  window are the mechanism that debt relies on.

## What a reader must not conclude from this note

**This is merged, not deployed.** `booking.pumasi.ai` is not serving it, and
was not serving the previous release either. Who carries a merged build to the
worker is the open question `Q-012`, which is explicitly outside CHARTER Part
0's proceed-on-default rule, so this run did not deploy and did not take it.
Nothing above describes what a user meets today; it describes `main`.

That costs less here than it did for the last release: the defect this closes
is not live on `booking.pumasi.ai` at all, because that deployment has a
calendar integration. The people it affects are self-hosters, who deploy their
own copy from this repository — so for them, merged genuinely is the delivery
mechanism, once they pull.

## Also found, not fixed here

`/auth/microsoft/start` is gated on a **Google** calendar hub, so "Sign in with
Microsoft" is switched off on any deployment that has Microsoft credentials and
no Google Calendar. It is the same accident of placement, one surface over —
but it is an authentication entry point rather than a conferencing one, with a
different blast radius, and folding it in would have made one review cover two
unrelated reachability changes. Recorded in `service/spec/0006/SPEC.md` §5 for
the roadmap owner to rank.
