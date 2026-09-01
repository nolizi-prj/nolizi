# Pumasi Sign stops deleting the message you wrote to your signers

**Published 2026-09-01 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in [`DECISIONS.md`](../DECISIONS.md) (Q-037).
`pumasi-sign/roadmap/STAGE.md` says `alpha`, so per CHARTER Part 0 the work
proceeds now and a steward veto reverts it.**

**Read the last section first if you are waiting for this to reach you.** It is
merged and it is **not deployed**. `sign.pumasi.ai` still behaves exactly as
described below under *What was wrong*, and will until somebody deploys.

## What was wrong

When you send a document for signature, Pumasi Sign gives you a box for a
message to the people signing it. It is the covering note on the agreement —
*"Please sign by Friday."*, *"This replaces the draft I sent Tuesday."* — and
it is shown to every recipient when they open the signing link. Often it is the
only explanation they get for what they are being asked to sign.

Elsewhere on the same screen there is a pencil for the expiration date and the
reminder settings. **Opening it, changing nothing, and pressing save deleted
your message.** The dialog then said

> Envelope settings updated.

and closed. Nothing warned you. Nothing asked. Nothing on the screen afterwards
said the message was gone — it simply was not there any more, for you and for
everybody who had not yet opened the link.

The cause is one missing clause. The service kept your **title** when a request
did not mention it, and had no equivalent rule for your **message**, so a
request that never mentioned the message was treated as a request to erase it.
The settings dialog never mentions it, because it is not about it.

## Who could this hurt, and how

**You, and then everyone you sent the document to.** You wrote the note and had
no reason to think a settings dialog would touch it. Your recipients open a
signing link and find a document with no explanation attached, and no way to
know one was ever written.

**It hit hardest exactly where the product pushed you.** An envelope whose
deadline has passed shows the sender *"Its expiration date has already passed —
set a new one"* and draws the pencil that opens that dialog. So the product
invited you into the one action that destroyed your own words. And a change we
released the same day makes that pencil start working — which would have meant
more people using it, and every use still wiping the message.

## What changed

- **Changing the expiration date or the reminder settings leaves your message
  alone.** That is the whole repair, and it is one line of the service.
- **You can still delete a message on purpose.** The dialog that is actually
  about the title and the message still clears it when you empty the box. The
  service now tells the difference between *a field nobody mentioned* and *a
  field somebody deliberately emptied* — and that difference is the one the
  repair is built around, because getting it wrong the other way would have
  made a message impossible to remove.
- **The envelope's history now names what a correction changed.** If a
  correction changed the title or the message, the history line says so — the
  same way it already named the expiration date and the reminders. Before this,
  it named a reminder interval and said nothing about the words of the
  agreement, which was the wrong way round.

**Nothing else about corrections changed.** The same people may correct the
same envelopes at the same times, and a correction refused before is refused
now, in the same words.

## What this takes away, stated plainly

**On the merits, nothing is taken from anybody.** Nobody ever asked that dialog
to delete their message, and nobody could have been relying on it doing so.
This note carries a veto window because the repository this product lives in
has no risk map yet, and the charter's rule is that an unmapped path counts as
one that can hurt someone. The window is opened rather than argued down.

There is one honest debit, and it is about **records** rather than about
people. The envelope's history will start naming a title or message change
where before it named nothing at all. That is more truthful, not less — but it
is a change to what a past-facing document says about a correction, so it is
said here rather than found in a diff.

**And one thing this cannot do.** Messages already deleted are gone. They were
overwritten with nothing and there is nowhere to read them back from. This
stops the next one; it cannot undo the last one. We would rather say that than
let the word "fixed" imply otherwise.

## What this deliberately does not do

- **The settings dialog is not given a message box.** Two dialogs edit two
  things, and that is fine. The defect was never that one of them was missing a
  field — it was that it silently cleared one it never showed you.
- **No warning, no confirmation step, no new screen.** After this change there
  is nothing to warn about.

## What was tested

- **Three new frozen acceptance cases** (A-417 – A-419) drive the real service
  through its own entry point. They send *literally the request the settings
  dialog sends* and check the message survives — on the stored record, in the
  reply the screen reloads from, and on the recipient's own view of the
  document. They check that emptying the box still clears it, that a long
  message is still shortened at the same limit, and that the history names a
  change only when something actually changed.
- **The repair was checked in both directions**, which is the part worth
  trusting. Three wrong versions of it were built and run: the original defect,
  the tempting shortcut that would have made a message impossible to delete,
  and the version that fixes the deletion but leaves the history silent. Each
  turns a different one of the three new cases red. A test that cannot fail is
  not evidence, so this is recorded in the specification as a table rather than
  asserted.
- **No existing frozen test was changed.** A-416, from the deadline release
  earlier the same day, passes unaltered.
- Root `npm test` across both trees, run twice before and twice after,
  identical each time: `Test Files 6 passed (6)`, `Tests 85 passed (85)`, and
  `# pass 28 → 31 · # fail 0`,
  `assert-service-suite-ran: 28 → 31 passing, 0 failing, from 5 → 6 compiled`.
- **Reviewed by four model families other than the one that built it**, and the
  specification reviewers and the code reviewers share no family: gemini and
  glm on the specification before the build, qwen and kimi on the code after
  it. All four approved. glm's three non-blocking notes were taken into the
  build rather than filed, and the transcripts are in the repository including
  the reasoning that was corrected.

## What is still unknown, and what this does not claim

- **The tests run on Node's SQLite, not Cloudflare's.** They are evidence about
  this product's own logic, not about Cloudflare's storage engine. That limit
  is recorded in the specification rather than left to a reader.
- **One claim in this change is not covered by a test**: that the history line
  reads naturally with the new words in it. That was read in the source at the
  commit and reported as read, not as measured. A reviewer flagged it as an
  observation and it is repeated here rather than smoothed over.

## It has not reached you

**Merged, not deployed.** Serving `sign.pumasi.ai` means `wrangler deploy` from
`service/`, and **who may carry a merged build to users is
[`DECISIONS.md`](../DECISIONS.md) Q-012, which is open** and explicitly outside
CHARTER Part 0's proceed-on-default rule. The live service is built from
`0e26917`; **Q-028** counted three repairs already waiting in that same
undeployed bundle and **this is the fourth**. No seat on this job deployed
anything, proposed a deployer, or set a date.

So, as of publication: **the settings dialog on `sign.pumasi.ai` still deletes
the sender's message to signers, silently, and still says "Envelope settings
updated."** This note describes a branch.
