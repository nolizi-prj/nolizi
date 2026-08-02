# SPEC-0002 — Scheduling Service

**Drafted:** 2026-08-01 · **Status:** awaiting cross-family spec review
**Intent:** [`INTENT.md`](./INTENT.md) — confirmed by the steward 2026-08-01
**Depends on:** [`spec/0001-scheduling-core`](../0001-scheduling-core/SPEC.md) — the engine
**Roadmap:** [`GAP-0004`](../../gap/0004-feature-parity.md) item 1b
**Acceptance suite:** [`acceptance/cases.json`](./acceptance/cases.json) — **frozen when spec review completes; the builder may not modify it**

---

## 1 · What this is

A deployable scheduling service. Accounts, availability configuration, a public
booking page, confirmation mail, and cancel/reschedule links. Deployed from
GitHub to Railway.

It **wraps** SPEC-0001 and does not reimplement it. The division is:

```
SPEC-0001 compute_slots   pure. no clock, no I/O, no state.
SPEC-0001 book/cancel/    stateful semantics — WHAT must be true of a booking.
          reschedule      Storage-agnostic by contract; it names no store.
SPEC-0002 (this)          the store, the I/O, the identity. HOW those hold.
```

SPEC-0001 is not stateless — B1 to B7 describe state transitions. What it does
not do is choose a store or perform I/O. This service supplies both, and P1 is
where its choice of store is what makes B2 and B6 true rather than aspirational.

Every question of the form *"which slots are available"* or *"may this booking be
made"* is answered by calling the engine. This service never re-derives a slot,
never adjusts a time, and never decides availability on its own. Where it is
tempted to, that is a defect in the engine's interface, not a licence to compute
here.

## 2 · Non-goals

Calendar-provider sync (`GAP-0002`) · teams, round-robin, pooled or multi-attendee
bookings · payments · AI suggestions · weekly/monthly/duration limits · recurring
bookings · SMS · a native mobile app.

**Public signup is a non-goal of this version, and is blocked** — see D1.

## 3 · Surfaces

| Surface | Who reaches it | Auth |
|---|---|---|
| Owner app | The account holder | Session cookie |
| Public booking page | Anyone with the link | None |
| Booking management link | Whoever holds the emailed link | Bearer token (L1) |
| Health and readiness | The platform | None |

Wire format is JSON over HTTPS for programmatic surfaces; the booking page is
server-rendered HTML. Instants are RFC 3339 with `Z`, as in the engine.

## 4 · Semantics

Every clause below exists because it is a documented way this gets built wrong.

### 4.1 · Identity and access — `I`

**I1 · Invite-only.** No account is created without a valid, unconsumed invite.
An invite is single-use and is consumed atomically with account creation; two
concurrent redemptions of one invite create **exactly one** account.

**I2 · Public signup is disabled by a flag that fails closed.** Absent or
unparseable configuration means disabled. Enabling it is an explicit act, and D1
forbids that act until the privacy basis exists.

**I3 · Sessions** are opaque server-side references in an `HttpOnly`, `Secure`,
`SameSite=Lax` cookie. Never a token containing claims the client can read, and
never the account identifier. Logout invalidates server-side, not only by
clearing the cookie.

**I4 · An owner may read and change only their own schedules and bookings.**
Enforced at the query, not by hiding controls in the interface. Every
owner-scoped read is filtered by the session's account at the point of data
access.

**I5 · The booker never authenticates.** Booking requires no account, ever.
Requiring one to book would defeat the purpose of a booking link.

**I6 · Unauthenticated surfaces are rate-limited, with stated numbers.** The
booking page and the management link accept requests from anyone with a URL.
Without a limit they are a free channel for enumeration, spam bookings against a
real person's calendar, and mail amplification to arbitrary addresses.

Defaults, configurable but never unbounded: **60 page views per IP per minute**,
**5 booking attempts per IP per minute**, **20 bookings per schedule per hour**,
**10 management-link lookups per IP per minute**. Exceeding a limit returns a
retry signal, and **sends no mail**. A rate limit with no number is a promise to
implement one later; these are the numbers.

### 4.2 · Persistence and exclusivity — `P`

**P1 · Exclusivity is enforced by the database, not by application code.** Two
constraints are required, and each enforces a *different* invariant. In
PostgreSQL:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- required for `WITH =` in GiST

-- P1a: no two confirmed bookings for one owner overlap  (SPEC-0001 B2)
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    owner_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status = 'confirmed');

-- P1b: one booking holds at most one confirmed interval  (SPEC-0001 B6)
CREATE UNIQUE INDEX bookings_one_confirmed_per_booking
  ON bookings (booking_id) WHERE (status = 'confirmed');
```

**P1a · No two confirmed bookings for one owner overlap.** *This is the clause
the whole service turns on.* The obvious implementation — query for a conflict,
then insert if none — is a time-of-check-to-time-of-use race: under concurrency both requests see a free slot and both insert. It passes
every test that does not run concurrently, which is most tests. SPEC-0001 B2
promises exactly one winner; **only the database can keep that promise.**

**P1b · One booking, at most one confirmed interval — and it is not redundant.**
P1a alone forbids
*overlap*. It does not forbid one booking holding *two non-overlapping* confirmed
intervals — which is exactly the state a reschedule passes through if it inserts
the new interval before demoting the old one. The rows do not overlap, P1a stays
satisfied, and SPEC-0001 B6 — *never both, never neither* — is violated with the
database reporting no problem. This was found in adversarial review of the first
draft of this spec, which had P1a only.

**P2a · A reschedule is one transaction.** The demotion of the old row and the
insertion of the new one commit together or not at all. Combined with P1b, there
is no observable moment in which a booking holds two intervals or none.

A violation of either constraint surfaces as an integrity error, which is caught
and returned as `conflict`.

**P2c · Two reschedules of the same booking are serialised, and the loser is
defined.** A reschedule takes a row-level lock on the booking's current confirmed
row and demotes *that* row — not the row it read earlier. Under concurrent
reschedules of one `booking_id`, **exactly one succeeds**; the other returns
`conflict` and the booking remains at whichever interval the winner set.

P1b makes the two-confirmed-row state impossible, but impossibility is not a
policy: without this clause the second writer either aborts with an integrity
error the caller cannot interpret, or silently last-writer-wins. Neither is
`conflict`, and SPEC-0001 B6 requires a losing reschedule to be a defined,
non-destructive outcome.

**P2b · The engine stays pure across the boundary.** `now` is supplied by this
service on every call. The engine is never given access to a clock, a connection,
or an environment variable. Asserted by test.

**P3 · Constraints are revalidated inside the committing transaction**, with the
commit-time clock, per SPEC-0001 B3. A slot valid when the page rendered may be
invalid when the button is pressed; the answer is `expired`, decided at commit,
not at render.

**P4 · Bookings are append-only in effect.** Cancelling and rescheduling record
new state and preserve the prior record. History is required to explain what
happened to a booking, and destroying it makes B5 and B6 unauditable.

**P5 · Storage is PostgreSQL.** Chosen for the exclusion constraint in P1, which
is the requirement, not a preference. A store without an equivalent primitive
cannot satisfy P1 and is therefore not a substitution.

**P6 · Migrations run to completion before the new version serves traffic**, and
are forward-only. A half-migrated schema serving requests is how a booking system
loses bookings.

### 4.3 · Booking flow — `F`

**F1 · The page shows what the engine returned.** Slots come from
`compute_slots`, unmodified. The page may format and filter for display; it may
not add, shift, or extend.

**F2 · Times are converted for display only, at the edge.** The engine returns
UTC (SPEC-0001 §2). Rendering converts to the viewer's timezone in one place,
and no converted value is ever sent back to the server or stored. This is the
architecture the steward confirmed on 2026-08-01, and F2 is where it is kept
honest.

**F3 · Booking requires a name and an email address. Nothing else.** No phone, no
address, no free-text notes in this version. Every additional field is personal
data we would have to justify holding (D2).

**F4 · The page is a snapshot and says so.** A slot may be taken between render
and submit. That returns `conflict` with the refreshed list, not an error page.
This is normal operation, not a failure.

**F5 · Double submission is idempotent.** The page carries an idempotency key;
replaying it returns the original booking rather than creating a second, per
SPEC-0001 B1 and B5.1. Users double-click.

### 4.4 · Management links — `L`

**L1 · A management link carries a bearer token of at least 128 bits from a
cryptographically secure source.** Not a booking id, not a sequence, not a hash of
anything guessable. Anyone holding the link can act; that is understood and is why
the token must be unguessable.

**L2 · A token authorises exactly one booking**, and reveals nothing about any
other. Enumerating tokens must not enumerate bookings.

**L3 · Tokens expire** at the later of the booking's end time plus a grace period,
or the point at which the booking is cancelled. An indefinitely valid link in an
old mailbox is a standing liability.

**L4 · Cancelling releases the interval immediately** (SPEC-0001 B5); the slot is
bookable by anyone at once. Rescheduling is atomic (B6) and preserves the
`booking_id`.

### 4.5 · Mail — `M`

**M1 · Mail is a port with one adapter.** The service calls a small interface;
the provider sits behind it. No provider type, field, or error appears outside
the adapter. The provider is unchosen (`INTENT.md` question 3) and this is what
makes that safe to defer.

**M2 · Mail is sent after commit, never inside the transaction.** A slow or
failing provider must not hold a database transaction open or roll back a
confirmed booking.

**M3 · Mail failure never invalidates a booking.** The booking is confirmed, the
page says so, and delivery is retried. A booking that exists only if an email was
delivered makes a third party's outage into lost meetings.

**M4 · Confirmation mail carries the management link (L1) and the meeting time in
the recipient's stated timezone**, converted at send, in one place, from the UTC
value.

**M5 · Both parties are notified** on booking, cancellation and reschedule. The
owner learns their calendar changed; the booker learns their meeting did. Omitting
either produces a person who believes something false about their own day.

### 4.6 · Data protection — `D`

**D1 · Operating without a settled privacy basis — deliberately, and with a
ceiling.** The steward decided on 2026-08-02 to take real bookings from a small
circle of personally known people before the basis in `DEBT.md` D-105 is
established. That is a recorded decision, and this clause is what keeps it
bounded rather than open-ended.

The reasoning for the decision is that the circle is small and known. **So the
size is enforced in code, not assumed:**

| Ceiling | Default | May be lowered | May be raised |
|---|---|---|---|
| Owner accounts | 5 | yes | **no, while D-105 is open** |
| Total bookings retained | 200 | yes | **no, while D-105 is open** |

Reaching a ceiling refuses the next write with a clear message and does not
degrade anything already stored. Raising one is refused while D-105 is open —
the same fail-closed mechanism as I2. **Public signup remains blocked**
regardless.

*Why a ceiling at all.* "A small known circle" is a justification that expires
silently. Nobody notices the booking that takes it from personal favour to
processing strangers' data at scale, because no single booking does. A number
that cannot be raised without answering the question is the only version of
"small" that stays true.

**D9 · The booker is told, at the point of collection, in one sentence.** The
booking form states what is stored, who can see it, and how to have it deleted,
with a link to the detail. Not a policy nobody opens — one visible line, next to
the field where the person is typing their address. This costs nothing and is the
minimum owed to someone handing over their email to software they have never
heard of.

**D2 · Collect the minimum that makes the feature work.** Owner: email, display
name, timezone, availability rules. Booker: name, email, the interval, and their
timezone for display. Nothing else, and no field is added without a reason
recorded next to it.

**D3 · Deletion works and is reachable.** An owner can delete their account and
everything belonging to it. A booker can delete their booking data from the
management link. Deletion removes the data; it does not merely hide it.

**D4 · A booker's email is never shown to anyone but the owner of that booking**,
and never appears in a URL, a log line, or a report.

**D5 · Automatic reporting carries no owner or booker data.** Not their names,
addresses, meeting times, counts, or anything derived from them. Charter Part 5.1
requires this item to implement reporting and a working opt-out; that reporting
is the conformance tier in `REPORTING.md` and this service's user data is outside
it entirely.

*Stated precisely, because the absolute version is false:* the report **is**
signed with the operator's own identity (`REPORTING.md`), which is personal data
about **the operator**. What D5 forbids is data about **the people the operator
serves** — who never chose to publish anything. The distinction is the whole
point: an operator publishes their own conformance result; their bookers do not
publish anything, ever.

**D6 · Every subprocessor is named before it holds anyone's data.** The mail
provider and the hosting platform both see personal data. Each is listed publicly
with what it receives and why, before the first message is sent. An unnamed
subprocessor is data shared without disclosure, whatever the intention.

**D7 · Deletion reaches as far as we control, and says where it stops.** D3
removes application data. Backups, replicas, and subprocessor copies expire on
their own schedules, and those schedules are documented rather than implied. A
deletion promise that quietly excludes backups is the most common false statement
in privacy policies.

**D8 · A management link is a bearer credential and its powers are bounded
accordingly.** Anyone holding it can cancel or reschedule (L1). It may **not**
delete personal data outright without a confirmation step from the same link,
because a forwarded email should not be able to destroy a record silently.

### 4.7 · Operations — `O`

**O1 · Deployment is from GitHub to Railway on push to the default branch.** The
running service corresponds to a commit, and which commit is discoverable from
the service itself.

**O2 · Secrets live in the platform, never in the repository.** Database URL, mail
credentials, session key. A secret in git is a secret to rotate, and the
`.gitignore` is a convenience rather than a control.

**O4 · The service refuses to start on a tzdata or PostgreSQL version
mismatch** (§5), and reports the versions it is running on its readiness surface.
Serving wrong times while reporting health is the failure §5 exists to prevent.

**O3 · Health and readiness are distinct.** Health means the process is up.
Readiness means migrations are complete and the database answers. The platform
must not route traffic to a ready-looking instance that cannot serve.

**O5 · Time is UTC everywhere server-side.** The server's local timezone is never
consulted. The only timezone-aware operations are the engine's, which take it as
an argument, and display conversion at the edge (F2).

## 5 · Environment dependency

Inherits SPEC-0001 §6 in full: the engine's behaviour depends on the IANA tzdata
version, which must be pinned and asserted at startup — **not only in tests.** A
service that starts with the wrong tzdata will compute wrong slots and report
that it is healthy.

- **Pinned:** `tzdata 2026a`, matching the engine.
- Startup asserts the version and **fails to start** on mismatch. Serving wrong
  times is worse than not serving.
- PostgreSQL version is pinned; the exclusion constraint in P1 is version-
  sensitive and is asserted by a migration test.

## 6 · Risk

`CHARTER.md` Part 4: **can this change hurt someone outside the project?**

**Yes, throughout.** This item holds third parties' personal data, books on their
behalf, and sends mail in their name. Per `RISK_ZONES.yaml`, everything except
documentation and tests is can-hurt, and the inheritance rule reaches the rest:
the whole service is substrate for the booking path.

**What that requires:** two approving code reviews from two model families other
than the builder's, plus a steward release sign-off on a plain-language note.
The release note must state D-105's status (`DEBT.md`).

## 7 · Acceptance criteria

The charter's merge gate applies in full and is **not restated here** — see
`CHARTER.md` Part 3, Part 4 and Part 5.1. Additional to it:

1. Every case in `acceptance/cases.json` passes.
2. **The exclusivity constraint is proven at the database level:** concurrent
   booking of one interval, ≥1000 iterations, exactly one `confirmed`. The test
   must fail if the constraint is dropped and the application check alone remains.
3. tzdata assertion fails startup on mismatch (§5).
4. The engine is called with an injected clock and performs no I/O — asserted by
   test across the boundary (P2).
5. Public signup cannot be enabled while D-105 is open — asserted by test.
6. Deletion is verified by absence, not by a flag (D3).
7. Reporting exists, the opt-out works, and behaviour is identical with it on and
   off — the five gate checks in `CHARTER.md` Part 5.1.
8. Provenance is recorded for any surface studied from Cal.com or Calendly: what
   was studied, by whom, and that the implementer did not read their code
   (`DUPLICATION.md` §5 condition 5).

## 8 · Suite coverage

The suite is a floor, not a ceiling.

**41 cases.** Every clause has at least one; the mapping is checked mechanically
rather than asserted here, because a hand-maintained coverage table drifts from
the suite it describes — that is [`L-007`](../../lessons/L-007-restating-a-rule-forks-it.md).

| Cases | Cover |
|---|---|
| I-001 – I-006 | Invite consumption under concurrency; signup flag fails closed; session properties; cross-account denial; booker needs no credential; rate limiting (I1–I6) |
| P-001 – P-008 | Exclusivity under concurrency; **both** constraints present structurally; engine purity; commit-time revalidation; **reschedule never holds two intervals or none**; history preserved; store primitive required; migration ordering (P1a–P6) |
| F-001 – F-005 | Slots unmodified; display conversion only; minimal fields; stale-slot conflict; double-submit idempotency (F1–F5) |
| L-001 – L-004 | Token entropy and scope; no cross-booking disclosure; expiry; cancel releases and reschedule preserves id (L1–L4) |
| M-001 – M-005 | Adapter isolation; sent after commit; provider outage leaves booking confirmed; recipient-timezone rendering; both parties notified (M1–M5) |
| D-001 – D-008 | Signup blocked while D-105 open; minimal collection; deletion by absence; no email disclosure; reporting excludes user data; subprocessors named; deletion reach stated; link cannot delete in one step (D1–D8) |
| O-001 – O-005 | Deployed commit discoverable; no secrets in repo; readiness distinct from health; refuses to start on version mismatch; host timezone irrelevant (O1–O5) |

**P-005 is the case that matters most.** The first draft of this spec would have
passed every other case in this suite while permitting a booking to hold two
intervals at once.

## 8.1 · Implementation status

*Recorded 2026-08-02 after the first implementation and its adversarial review.
A specification that lists clauses without saying which are built is a
specification that will be believed.*

**Built and tested** — the booker's path, end to end: F1–F5, B3/B4, L1/L2, M1–M5,
D1/D2/D8/D9, I5/I6, O1/O3, P1a/P1b/P2a/P2c/P3/P4/P5/P6.

**Declared but NOT implemented.** Each has schema or configuration but no route
or enforcement, and none of it should be assumed present:

| Clause | Missing |
|---|---|
| **I1** | Invite redemption. The table and its unique index exist; nothing consumes an invite. |
| **I2** | The flag fails closed and is refused while D-105 is open, but no signup route consults it. |
| **I3** | Sessions. Table only — no login, no cookie issued, no logout. |
| **I4** | The owner application. No owner-scoped route exists, so cross-account denial is untested by absence rather than enforced. |
| **L3** | Token expiry is never checked. A management link works indefinitely. |
| **L4** | Reschedule over HTTP. The store implements it and it is tested there; no route reaches it. |
| **D3** | Owner deletion. A booker can delete their own details; an owner cannot delete their account. |
| **D6/D7** | The subprocessor list and the retention statement are not published. |
| **O2** | No secret loading, because no real database connection is opened yet. |
| **O4** | Versions are reported on readiness but a mismatch does not refuse startup. |
| **O5** | Server timezone independence is asserted nowhere. |

**Also not real yet:** `DATABASE_URL` is never opened. The service runs on an
in-process PGlite, which is genuine PostgreSQL with `btree_gist` — so the
constraints are real — but nothing survives a restart. Deployment needs a pooled
driver and a connection per transaction; the single-connection lock in `db.ts`
exists because BEGIN/COMMIT issued from concurrent handlers onto one session
interleave and stop being request-scoped.

## 9 · Human involvement

Under `CHARTER.md` Part 2 the steward does not approve specifications or tests.
The confirmed decisions for this item are in [`INTENT.md`](./INTENT.md):

| Decision | Status |
|---|---|
| This deserves to exist | **yes**, 2026-08-01 |
| The intent statement is correct | **yes**, 2026-08-01 |
| May touch a can-hurt surface | **yes**, 2026-08-01 |
| May be released to the public | **blocked** — D-105 |

**Conflict disclosure.** The steward is also the sponsor (`DEBT.md` D-101). The
compensating control is that the acceptance suite is frozen when spec review
completes, before implementation, and that reviews come from model families that
did not write the work.
