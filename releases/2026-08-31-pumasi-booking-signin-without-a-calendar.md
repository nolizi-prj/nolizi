# Signing in to Pumasi Booking no longer requires a Google calendar

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-022 is the intent window; Q-023 is this
note's). Stage is `beta`, so per CHARTER Part 0 the work
proceeds now and a steward veto reverts it.**

## Who this is for

Two groups, and neither of them is on `booking.pumasi.ai`.

- **The operator running their own copy** who set up a Microsoft app so their
  people could press "Continue with Microsoft", and did not set up Google
  Calendar.
- **A company that pointed Pumasi Booking at its own identity provider** —
  the per-organisation single sign-on `VALUE.md` C3 lists in the free tier —
  on a deployment without Google Calendar.

**This does not affect `booking.pumasi.ai`**, which has Google Calendar
configured, so neither door was ever shut there. It cost exactly the
self-hoster `VALUE.md` §1 courts by name, and it was a live counter-example to
that file's C5 claim that no host is load-bearing.

## What was wrong

Neither sign-in worked unless the operator had also configured **Google
Calendar** — not "a calendar", not Microsoft Calendar, but specifically Google
Calendar credentials, which is a different company's product from either of
the two things being asked for.

From outside it looked like this:

- The login page offered **"Continue with Microsoft"**, because it checks
  whether Microsoft is configured, and it was. Pressing it answered
  **"Microsoft sign-in is not configured."** The button and the answer
  disagreed, and the answer was wrong.
- A company configured its own single sign-on. Everyone who typed a work
  address was sent to that flow, and every one of them was told **"SSO is not
  configured on this deployment."** It was configured. The product read the
  wrong thing and stopped before it looked.

Nobody who hit either did anything wrong, and nothing they could read told
them the missing piece was a third-party calendar they never asked for.

## Why it happened

The same accident of placement fixed one surface over in the last release. The
signed ticket that travels out to an identity provider and comes back — the
thing that says which sign-in is arriving and whose — used to live inside the
calendar code, though it uses nothing but the deployment's own secret key.
That release moved it out and made it its own thing. These two doors were
never updated to ask for it directly: they kept asking *"is there a
calendar?"* and using the answer as if it were *"can I sign someone in?"*.

The organisation single sign-on half is the wider one. It was broken on **both**
the self-hosted build and the deployed Cloudflare one, because the Cloudflare
router does not answer that address itself — it hands it to the same code the
self-hosted build runs.

## What changed

- **Both doors now ask whether they can seal a ticket**, which is the question
  they were always really asking, using the same one piece of code the rest of
  the service already uses. Nothing is restated at either door.
- **A deployment with Microsoft credentials and no Google Calendar can sign a
  person in with Microsoft**, all the way through — the button, the trip out,
  and the trip back.
- **A deployment with an organisation's own single sign-on and no Google
  Calendar can sign that organisation's people in**, on both builds.
- **Where a calendar *is* configured, its own sealer keeps sealing.** A
  deployment can hold a calendar whose key never came from the environment
  variable, and a ticket must open under the key that sealed it.

## What did *not* change, deliberately

- **Every door still checks its own configuration.** No Microsoft app: still
  "Microsoft sign-in is not configured." An organisation with no single
  sign-on set up: still told exactly that. No secret key: both doors still
  refuse, and neither invents an unsigned ticket instead.
- **The tickets are still always signed.** Nothing started emitting a
  readable, writable one.
- **Google sign-in, connecting a calendar, and the page that receives all of
  these are untouched**, and each was tested at its own refusal rather than
  assumed unchanged.
- **Neither refusal's wording changed.** They are accurate for the only
  conditions that can still produce them, and the Microsoft one has to stay
  identical to the one the deployed build already returns.
- **The Cloudflare router was not touched at all.** Its "Continue with
  Microsoft" was never gated on a calendar and is already correct; changing it
  would have closed nothing. A test asserts the diff leaves it alone.
- **No new provider, account, app registration, or wider permission.** This is
  the correctness of a surface that already shipped, which is why it did not
  wait on `Q-007`.
- **No stored data touched.** A ticket lives fifteen minutes; nothing to
  migrate, nothing deleted.

## What could hurt someone, and what stands in the way

- **The real risk of a change like this is closing it the lazy way — making
  the doors reachable by making them unguarded.** That would be a worse defect
  than the one being closed: an unguarded organisation sign-on is a way into
  somebody's account. Three of the six acceptance cases exist for exactly
  this, and two deliberate breakages were run to prove they catch it: removing
  the Microsoft credential check, and removing the deployment gate from
  organisation sign-on, each turn a case red.
- **A ticket that opens under the wrong key, or is not really sealed.** Each
  door's ticket is checked to be opaque, to open only under the key that
  sealed it, and not to open under any other.
- **A neighbouring flow quietly opening up.** Google sign-in, calendar connect
  and the calendar callback are each asserted, on a deployment with no
  calendar, to answer exactly what they answer today — including the calendar
  callback's own 404 and its exact sentence.
- **Fixing the half that was already right and calling it done.** The
  Cloudflare router's Microsoft door was never the defect; the earlier spec
  said it "has the same shape", which was true of the shape and false of the
  effect. That correction is now a clause and a test, not a note.

## What was tested

Six acceptance cases (`service/spec/0007`, frozen before implementation at the
spec approval). **Three were verified failing** against a checkout with the
change absent — a defect spec proves itself by failing first (L-006):

- Microsoft sign-in: expected a redirect to Microsoft, got 404 "Microsoft
  sign-in is not configured."
- Organisation sign-on: expected a redirect to the identity provider, got 404
  "SSO is not configured on this deployment."
- The refusals themselves: expected "This organization has no SSO configured.",
  got "SSO is not configured on this deployment." — nothing was unguarded
  before, but the calendar gate answered first, so the guards underneath it
  could not be observed at all until it was gone.

The other three are green before *and* after on purpose — they are the claim
that nothing else moved — so each was made to fail deliberately. Five
breakages, each turning exactly one case red and leaving the rest green.

Full suite: **311 service tests + 19 engine tests, green** (305 + 19 before;
the six new are this spec's). `GATE: PASS`. Cross-family review: Gemini
approved the spec, the amendment to it, and the code; Grok unreachable
(D-104 condition live, recorded rather than worked around).

Honest note on the acceptance suite: the cross-family code review **objected**,
citing CHARTER Part 3 requirement 2 — a helper inside the frozen test runner
had been fixed during implementation instead of amended in the open. The
objection was correct and was not argued past. The fix was recorded in the
spec, took a fresh cross-family spec review, and only then was the code review
re-taken. The helper itself was the lesson the suite exists to respect, found
inside the suite: it picked an organisation by creation time on a clock the
tests freeze, so two organisations in one test tied and it silently returned
the wrong one.

## Open debt this release touches (§2.1 requires their status here)

- **D-104** (reviewer breadth): still live, third consecutive job on this
  product. One family carried spec and code review; CHARTER §3's rule that the
  spec reviewer must not be among the code reviewers cannot bind below three
  families, and is off rather than pretended.
- **D-105** (privacy posture, DEGRADING): unchanged. No new data, no new
  subprocessor, no new provider.
- **D-107** (held-tier retention): untouched. No reporting field is added.
- **D-109** (no per-change human authorisation): unchanged; this note and its
  window are the mechanism that debt relies on.

## What a reader must not conclude from this note

**This is merged, not deployed.** Who carries a merged build to
`booking.pumasi.ai` is the open question `Q-012`, which is explicitly outside
CHARTER Part 0's proceed-on-default rule, so this run did not deploy and did
not take `BACKLOG.md` item 1. This makes a **fourth** reviewed, gate-passed
build waiting on that answer, and saying so is the point rather than adding it
silently.

As with the last release, that costs less here than it might: the defect this
closes cannot occur on `booking.pumasi.ai` at all. The people it affects
deploy their own copy from this repository — so for them, merged genuinely is
the delivery mechanism, once they pull.

## Also found, not fixed here

Two things, both recorded in `service/spec/0007/SPEC.md` §5 for the roadmap
owner to rank rather than folded in:

- **Neither refusal names the missing secret key.** An operator who configures
  Microsoft or an identity provider and forgets `TOKEN_KEY` is told the feature
  is not configured — true, and unactionable. Fixing it well means changing the
  message on both builds at once, and it is user-visible wording rather than
  reachability.
- **The Cloudflare router opens its Google sign-in door on a client id alone,
  without the secret**, where the self-hosted build effectively requires both.
  On that build a half-configured deployment sends you to Google and then fails
  on the way back, rather than refusing at the button. It predates this work
  and is a divergence in the opposite direction from the one just closed; it
  was left alone because not touching that file is a clause of this spec.
