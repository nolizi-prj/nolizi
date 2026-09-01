# Pumasi Sign now keeps the expiration date it asks you for

**Published 2026-09-01 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in [`DECISIONS.md`](../DECISIONS.md) (Q-035).
`pumasi-sign/roadmap/STAGE.md` says `alpha`, so per CHARTER Part 0 the work
proceeds now and a steward veto reverts it.**

**Read the last section first if you are waiting for this to reach you.**
It is merged and it is **not deployed**. `sign.pumasi.ai` still behaves as
described below under *What was wrong*.

## What was wrong

When you send a document for signature, Pumasi Sign offers you a deadline. It
asks for the date. It refuses a date in the past. It shows the date back on the
envelope. And it tells you, in these words, what leaving it blank would mean:

> Without an expiration date, the envelope stays open until completed or
> voided.

The plain reading — the only reading — is that *with* a date, it does not stay
open. **The service behind that screen had never done any of it.** The date was
stored, displayed, and otherwise ignored. Somebody holding a signing link from
an email could open a document whose deadline passed months ago and sign it,
and the envelope would complete as though nothing were wrong.

Two things made this worse than an unimplemented feature:

- **The app's own signing page already refused.** It blocks a past-due document
  client-side and always has — with a comment in the source saying *"the server
  rejects /complete the same way."* The server did not. So the product was
  written around a rule the service was not keeping.
- **The rule was enforced against the honest party and not the other one.**
  Anyone using the app was stopped. Anyone addressing the API directly was not.

## Who could this hurt, and how

**The sender, mostly, and it is the reason this was ranked.** People set
deadlines because they want the offer to stop being open: a quote that expires,
an offer letter with a reply-by date, a consent form for an event that has
already happened. Every one of those senders believed the document had closed
itself, and it had not.

And the signer second — a document that says it expired on a date and can still
be signed after it is a document neither side can rely on.

## What changed

- **A timer runs every hour.** Any envelope that is out for signature and past
  its deadline moves to **Expired**, with one line in the envelope's history
  recording it. The line says the service did it, not a person, because no
  person did.
- **An expired envelope refuses what a completed one refuses** — signing
  (410), refusing (409), voiding (409) — and it refuses them **through the
  emailed signing link**, not only to someone signed in. The link still opens;
  it says the envelope expired rather than asking for a signature.
- **The deadline is now editable, because it now matters.** The *edit
  expiration and reminders* pencil has been sending your changes to a route
  that discarded them and then said *"Envelope settings updated."* It saves
  them now. That was harmless while the date meant nothing and would have
  become a trap the moment it started closing envelopes, so it is fixed in the
  same change rather than after it.

**Nothing is deleted and nothing already signed is undone.** An envelope that
completed before its deadline stays completed, and its sealed PDF and
certificate are never touched. **An envelope with no deadline is untouched
forever**, exactly as the screen promises.

## What this takes away, stated plainly

**Somebody who could have signed a lapsed document can no longer sign it.**
That is what a deadline is; it is what the sender asked for when they set one;
and it is what the app already told both of them was happening. It is named
here rather than buried because it is the whole point of the change and it is
the reason this note carries a veto window.

**An expired envelope cannot be revived.** It is finished the way a voided or
declined one is finished. The sender's route is the **Copy** button the product
already has, which makes a fresh draft with no deadline on it.

**Drafts never expire.** A draft was never sent to anybody, and expiring one
would take away a document its sender is still writing.

## Three things this deliberately does not do

- **Nobody is emailed.** Not the sender, not the signers. No screen in the
  product has ever promised a message about this, and sending mail on a
  sender's behalf is a larger commitment than the one being made here. The
  envelope's own history and your dashboard carry the fact.
- **It is not accurate to the second.** The sweep runs hourly, so for up to an
  hour past a deadline the service would still accept a signature the app
  already refuses to offer. An hour was chosen over a day for exactly this
  reason. This is disclosed rather than implied: if you need a deadline that
  binds at a specific minute, this is not that yet.
- **It changes nothing about reminders** beyond making the existing settings
  dialog actually save what you type into it.

## What was tested

- **Seven new frozen acceptance cases** (A-410 – A-416) drive the real Durable
  Object through its own entry point: the sweep expiring a past-deadline
  envelope and writing exactly one history line; the sweep leaving alone a
  future deadline, no deadline, a malformed deadline, a draft, and every
  already-finished envelope; an expired envelope refusing a **signing link**
  end to end; the same refusals a completed envelope gives; running the sweep
  twice changing nothing the second time; and the deadline-editing fix.
- **A-415 tests the worker entry point itself**, which no test in this
  repository had ever driven. It proves the hourly sweep addresses the *same*
  data store every envelope actually lives in — a sweep pointed anywhere else
  would run green and expire nothing — and that the sweep's internal address is
  refused if it arrives from the internet.
- **No existing frozen test was changed.** A-409, written to record that the
  deadline did nothing, still passes unaltered.
- Root `npm test` across both trees: `Test Files 6 passed (6)`,
  `Tests 85 passed (85)`, `# pass 28 · # fail 0`,
  `assert-service-suite-ran: 28 passing, 0 failing, from 5 compiled` — up from
  21 assertions across 4 files, so this widens the deployed tree's coverage
  rather than only moving it.

## What is still unknown, and what this does not claim

- **Nothing here proves the hourly timer fires.** The schedule is a line of
  configuration read by Cloudflare, not something a test can assert. What is
  tested is that when it fires, the right thing happens — and that a sweep
  which fails makes the run fail loudly instead of reporting success having
  expired nothing.
- **The tests run on Node's SQLite, not Cloudflare's.** They are evidence about
  this product's own logic rather than about Cloudflare's storage engine, and
  that limit is recorded in the specification rather than left to a reader.
- **A deadline in the past is still accepted by the API on creation.** The app
  refuses one at entry and the service never has. So a draft held past its own
  deadline and then sent will expire within the hour. That is the new behaviour
  working as written, and it is reported as a follow-up rather than fixed here.

## It has not reached you

**Merged, not deployed.** Serving `sign.pumasi.ai` means `wrangler deploy` from
`service/`, and **who may carry a merged build to users is
[`DECISIONS.md`](../DECISIONS.md) Q-012, which is open** and explicitly outside
CHARTER Part 0's proceed-on-default rule. **Q-018** records that the Railway
path still described in `pumasi-sign/CLAUDE.md`'s Deployment section is the
wrong tree; **Q-028** records that two earlier repairs are already waiting in
the same undeployed bundle. No seat on this job deployed anything, proposed a
deployer, or set a date.

So: as of publication, **every deadline in the live service still does
nothing**, and a past-due envelope is still signable there. This note describes
a branch.
