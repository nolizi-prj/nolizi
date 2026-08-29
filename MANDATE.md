# Mandate

**Edited by the steward only. Agents never modify this file** (CHARTER §2, §7 —
[L-003](lessons/L-003-scoped-power-needs-exclusions.md)). Agents take the next
item from the sequence below without asking. Listing an item here **is** the
"deserves to exist" decision; marking it *can-hurt: yes* **is** the surface
authorisation (CHARTER §4).

**Adopted:** 2026-08-27 · **Steward:** mok

---

## Standing direction

Build the scheduling product to the point where a real person can use it
instead of Cal.com or Calendly, in the order GAP-0004 sets out, one item at a
time. The commons process (charter, tooling, ledger) is maintained as the means
of building it, never as a substitute for building it.

## Sequence

| # | Item | Can-hurt | Status |
|---|---|---|---|
| 1 | Make the merge gate executable — `tools/` review + gate scripts, digest, decision queue | no | authorised now |
| 2 | Merge outstanding work to `main`; keep `main` the only long-lived branch | no | authorised now |
| 3 | **Calendar busy-time integration** (`spec/0003`, GAP-0002) — Google first, read-busy-times first, write-back as a later option, per the published intent statement | **yes** — holds credentials that read a person's calendar | authorised; intent in its veto window (`DECISIONS.md` Q-001) |
| 4 | Booking limits and periods (GAP-0004 item 2) | no | after item 3 |
| 5 | Recurrence via RFC 5545 library reuse (GAP-0004 item 3) | no | after item 4 |

## Budget

No numeric token cap is set. Every change records its token cost (P9); the
steward will set a cap if the digest shows spend worth capping.

## Red lines

- No payments. No AI-suggestion features. (Steward decision 2026-08-01,
  GAP-0004 §3 — revisit on evidence, never by accretion.)
- P1 licensing and the clean-room rule (GAP-0004 §2.1) on anything that studies
  Cal.com or Calendly.
- Nothing in `HUMAN.md` is performed by an agent, ever — prepared fully, queued
  in `DECISIONS.md`, and routed around where a routed-around version exists.
