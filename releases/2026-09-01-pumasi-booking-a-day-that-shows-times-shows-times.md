# A booking page day that shows times, shows times

**Published 2026-09-01 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in [`DECISIONS.md`](../DECISIONS.md) (Q-038).
`pumasi-booking/roadmap/STAGE.md` says `beta`, so per CHARTER Part 0 the work
proceeds now and a steward veto reverts it.**

**Read the last section first if you are waiting for this to reach you.** It is
merged and it is **not deployed**. `booking.pumasi.ai` behaves exactly as
described below under *What was wrong*, and will until somebody deploys.

## What was wrong

Someone opened a booking page, saw that September 1st and 2nd were available,
tapped one of them, and got nothing. The heading told them which day they had
picked — *"Wednesday, September 2"*. The space underneath it, where the times
go, was empty. They wrote in:

> in the calendar booking page, i cannot see specific times.

That is the product not working, on the one page it exists to serve. A booking
page that cannot show a time cannot take a booking, so for anyone who met this,
**nothing on the other side of that page could happen at all** — no meeting
booked, no confirmation, no reminder. Whatever the page was for did not occur,
and neither person necessarily knew why.

The times were never missing. They were sent with the page, they were correct,
and the page built every one of the buttons — and then dropped them instead of
putting them on screen. One line that puts a button where a person can see it
had been deleted four weeks earlier, by a change about remembering your name
and email between visits, which had no business touching the calendar.

Nothing broke visibly when it happened. No error appeared anywhere. The
reporter's own diagnostics say **0 errors captured**, and they were right —
nothing went wrong in the sense a computer can detect. The page did exactly
what it was told, and what it was told was incomplete.

## Who could this hurt, and how

**Anyone sent to a public booking page, and the person who published it.**

The booker sees an empty list and has no way to tell whether the times are
loading, whether the day is actually full, or whether something is broken. The
reasonable thing to conclude is that there are no times — so they leave. There
is nothing on the page to suggest writing in, and one person did anyway, which
is the only reason this is known about at all.

The person who published the page sees nothing. No error reaches them, and a
booking that never happened leaves no trace. **We cannot say how many people
met this in the four weeks it was live, and we are not going to guess.** The
one report is the floor, not the estimate.

## What changed

- **A day the calendar marks available now shows that day's times**, in the
  visitor's own timezone, and tapping one books it. That is the whole repair,
  and it is one line of the page.
- **Nothing else about the booking page changed.** No redesign, no new
  dependency, no change to what a booking submits.
- **The report you send us now labels one field more carefully.** The
  diagnostics used to say **Page URL** next to your screenshot. Those two can
  legitimately differ — the field is the page the feedback button was on, and
  the screenshot is a screen capture where your browser lets you pick which
  window to share. In this very report they differed and it sent a reader to
  the wrong page. The field is now called **Reported From**, and the screenshot
  carries one line saying it may show something else.

## What was tested

The honest answer to *"how did this survive four weeks"* is that **nothing we
had ever ran the page.** The calendar — picking a month, picking a day, seeing
times, choosing one — runs in your browser. Every check we had read the page as
text and confirmed the right words were in it. They all were. A check that
reads the page could not have caught this.

So the repair is two things, and the second matters more:

- The line went back.
- **We now run the real booking page in a real browser on every test run**, in
  the timezone the reporter was in, and check that picking a day shows that
  day's times and that picking a time books the right instant. Those checks
  **fail** against the code as it was and **pass** against the repair — which
  is the only evidence worth having that a fix fixes anything. It costs 6.8
  seconds.

Also run: the full suite three times before and three times after (core 19,
core acceptance 36, service 331 → 338), and the whole browser check ten times
in a row without a single flake.

## What is still unknown

- **How many people met this.** One reported it. We have no way to count the
  rest and are not estimating.
- **Whether anything else on this page has the same shape of defect.** The new
  checks cover picking a day and picking a time. They do not yet cover changing
  months, changing timezone from the dropdown, or the booking form itself.
  Those paths are now *testable* in a way they were not this morning, and they
  are not yet tested.
- **One thing about the new checks themselves.** They pin the timezone but not
  the clock, and every green run so far comes from one evening. If some part of
  the page consults today's date, they could go red after 2026-09-02 — that
  would be a fault in the checks, not a return of this bug, and it is written
  down so nobody mistakes one for the other.

## Which build this is

*This section exists because **`DECISIONS.md` Q-034** says it should. Two
earlier `pumasi-booking` notes state that this product cannot show you its own
version number. That was true when they were published and is no longer true of
the code, so Q-034's named default is that the next note — this one — carries
the current fact rather than anyone editing a published record after the fact.*

`main` is at **0.2.0**, and the number is now visible without reading source:
on `/healthz`, `/version` and `/readyz`, in the page footer, and in the
diagnostics attached to any feedback you send.

**On the deployment it is only half true.** `booking.pumasi.ai/version` answers
`{"version":"0.2.0","commit":"2453adc"}`, measured 2026-09-01 03:53:01 UTC —
so the version is visible there, and `2453adc` is the build it names. That
build predates this repair. The commit identifier is still set at deploy time
and no merge can set it.

## When this reaches you

**It has not, and this note does not know when it will.**

The repair is merged, reviewed and gate-passed. It is not deployed. Who carries
a merged build to `booking.pumasi.ai` is an open question for the steward
(`DECISIONS.md` **Q-012**), and it is one of the few questions CHARTER Part 0's
proceed-anyway rule explicitly does not release. No agent on this work deployed,
proposed a deployer, or set a date.

So, plainly: **the person who reported this still sees an empty list.** Issue
[#32](https://github.com/pumasi-ai/pumasi-booking/issues/32) is deliberately
left open, because closing it would say something to them that is not true.
