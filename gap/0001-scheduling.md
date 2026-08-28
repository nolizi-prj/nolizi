# GAP-0001 — Availability computation and booking

**Office:** Scout · **Filed:** 2026-07-28 · **Status:** converted to SPEC-0001 ([`core/spec`](https://github.com/pumasi-ai/pumasi-booking/tree/main/core/spec))
**Signed:** *(single identity; the steward is also the sponsor — `governance/DEBT.md` D-101)*
**Updated 2026-08-01:** rewritten against charter v0.3, which replaced graded risk
zones with one question and removed the phase and credit machinery.

---

## 1 · The need

Meeting scheduling — "show me your open slots, let me claim one" — is bought by
essentially every company (Calendly, SavvyCal, Chili Piper, Microsoft Bookings)
and rebuilt inside essentially every product that needs to book anything: sales
demos, support callbacks, interviews, medical appointments, tutoring, field
service, rentals, restaurant covers.

The visible product is a page with time slots. The thing that is actually being
rebuilt each time is smaller and harder: **given availability rules, existing
commitments, and a set of constraints, compute the bookable slots correctly — and
then let exactly one person claim each one.**

## 2 · Evidence of duplication

- **Category ubiquity.** Scheduling appears as a feature inside CRMs, ATSs,
  helpdesks, EMRs, LMSs, and field-service tools, none of which sell scheduling.
  Each contains its own implementation.
- **Agent-level duplication.** GitClear/GitKraken's analysis of 623M code changes
  (2023–2026) reports **code duplication up 81% and reuse down 70%** in the agentic
  coding era, with agentic tools specifically "flying in the face of DRY" —
  regenerating rather than reusing. Availability computation is a textbook case:
  small enough that an agent writes it inline, subtle enough that the inline
  version is usually wrong.
- **Failure signature.** The recurring bugs are the same everywhere: DST
  transitions, cross-timezone slot boundaries, buffers interacting with adjacent
  bookings, minimum-notice measured against an ambient clock, and double-booking
  under concurrency. These are not product differences. They are the same six
  mistakes, made independently, thousands of times.

## 3 · Catalog search performed

Searched the Pumasi catalog for: `scheduling`, `availability`, `booking`,
`calendar`, `slot`, `appointment`, `recurrence`, `timezone`.

**Result: zero items.** The catalog is empty — this is run one. Recorded for
completeness and because a negative search is a filed deliverable
(CHARTER.md §8.3): if this gap is later duplicated, this record is the evidence.

## 4 · What is in scope

The **computational core**, not the product:

- availability rules → bookable slots, given constraints
- booking commit with double-booking prevention
- correct handling of timezones, DST, recurrence, buffers, notice, granularity

## 5 · What is explicitly out of scope

Deferred so that run one tests the pipeline rather than the surface area:

- UI of any kind
- Calendar-provider integration (Google/Microsoft/CalDAV OAuth) — **can-hurt, deferred to
  GAP-0002.** Deferring this removes the only credential-handling surface, which
  keeps the risk at can-hurt-by-correctness rather than can-hurt-by-secrets.
- Notifications, payments, routing, round-robin, team pooling
- Persistence engine — the core is storage-agnostic by contract

## 6 · Why this gap was chosen for run one

Selected by the founding principal. Properties that make it a useful first test
rather than merely a useful first product:

1. **Deterministic acceptance criteria.** Slot computation is a pure function.
   "Done" can be stated as a table of inputs and expected outputs, which is what
   Principle 3 requires and what makes the Specifier's work checkable.
2. **A real risk boundary.** Docs and fixtures are ordinary; the availability
   engine and the booking commit path are can-hurt (a race condition double-books a
   real person, which is real-world harm, not a code-quality issue).
3. **A strong incumbent.** Cal.com exists and is excellent. The Curator's
   duplication finding is therefore a real adjudication with a real possible
   answer of "don't build this" — see [`core/spec/DUPLICATION.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/core/spec/DUPLICATION.md).
4. **Known-hard for agents.** Timezone and DST correctness is a domain where
   plausible-looking generated code is routinely wrong, which stress-tests the
   claim that specification-plus-tests beats trusted authorship.

## 7 · Credit

Filed with no credit accounting — charter v0.3 has none. The former estimate
(gap report `2`, plus `15` on conversion) is kept only as a note; the debt entry
that tracked it, D-005, was voided when the credit machinery was removed. No
balance was debited or credited, and none exists.
