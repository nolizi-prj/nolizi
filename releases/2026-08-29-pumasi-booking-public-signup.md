# Release note — Pumasi Booking opens to public sign-up

**Published:** 2026-08-29 · **Class:** can-hurt (CHARTER §4) ·
**Veto window closes:** 2026-09-05 · **Default on silence:** the release proceeds.

*This is a plain-language note, not a diff. It exists so that whoever chooses not
to veto knows what they are not vetoing.*

---

## What is changing

Anyone will be able to create an account at booking.pumasi.ai. Until now an
invite was required, and every account belonged to someone the steward knew.

## Who can get hurt, and how

**Bookers — people who have no account and never chose this project.** They give
a name, an email address, and the time of a meeting to a booking page. Opening
sign-up means strangers will run those pages, so the people typing details into
them will be strangers too. This is the real exposure and it is why the release
is classed can-hurt.

**Account holders**, who trust the service with their calendar connection and
their availability.

## What was done about it before shipping

- **Sign-up now proves the address.** Creating an account no longer hands out a
  session. A single-use link is mailed, and the session starts only when that
  link is used. Without this, anyone could have held a live session as
  `support@somecompany.com` and taken real bookings under that name. Google
  sign-in keeps its immediate session, because Google has already verified the
  address.
- **Sign-up cannot be used to find out who has an account.** Success and
  "already registered" return the same page. Three other endpoints already
  behaved this way; the rule is now stated once and covers all four.
- **Sign-up is rate-limited** to five per IP per hour, counted globally.
- **The privacy pack is complete and live.** Operator, governing law, what is
  collected, the lawful basis, how to delete, and who else sees data. Written in
  plain language on pages anyone can read without an account.
- **211 service tests and 19 engine tests pass**, plus the sharded end-to-end
  suite.

## What is still unknown, or still wrong

- **No lawyer has reviewed any of it.** `DEBT.md` **D-105** is open at DEGRADING.
  The lawful basis is written and in force; the review has not happened.
- **No standard contractual clauses exist.** The service is operated from the
  United States and data is processed there. For a UK or EU user, that transfer
  currently rests on nothing but the disclosure itself. The documents say this
  plainly rather than name a mechanism that does not exist.
- **The service does not report on itself.** `PUMASI_REPORTING` is read by
  nothing. CHARTER §5.1 requires a working reporting path and opt-out before an
  in-scope item releases, so **this release does not meet that requirement.** It
  is named here rather than discovered later. `DEBT.md` **D-107** covers the
  related retention gap.
- **Deletion does not reach mail already sent**, and never will.
- **Ceilings are now defaults rather than caps.** Five owners and two hundred
  bookings still apply until an operator raises them deliberately.

## What would make us stop

A booker's details reaching anyone they should not; sign-up being used to
enumerate or impersonate; or counsel telling us the transfer position is not
tenable. Any of those reverses this release rather than amending it.

---

*Vetoable until 2026-09-05 by the steward, publicly and with reasoning
(CHARTER §2). Silence advances it.*
