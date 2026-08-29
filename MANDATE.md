# Mandate — the can-hurt surface list

**Edited by the steward only. Agents never modify this file** (CHARTER §2, §7 —
[L-003](lessons/L-003-scoped-power-needs-exclusions.md)).

This file used to do two jobs. **One of them is gone and one is load-bearing.**

**Gone — sequencing.** It held an ordered list of what to build next. That went
stale: the product now has its own roadmap, beside the code that has to change
([`pumasi-booking/roadmap/`](https://github.com/pumasi-ai/pumasi-booking/tree/main/roadmap)),
and agents take work from there without asking. A commons-level queue for a
product that owns its own is a copy that drifts — [L-007](lessons/L-007-restating-a-rule-forks-it.md).

**Load-bearing — authorising can-hurt surfaces.** CHARTER §4 says a can-hurt
change needs no per-change human sign-off *because* the surface was authorised
here in advance. `charter.yaml` records that as
`risk.can_hurt.surface_authorised_by: mandate_entry`. Delete this file and that
authorisation has no source: credentials, personal data, and anything that books
or sends on a real person's behalf would have neither a named surface nor a
per-change sign-off. `risk.can_hurt` is also listed in `amendment.may_not_touch`
— *"by effect, under any name"* — so the alternative is not obviously available
even to the steward.

So the file stays, at two lines of actual content, doing only the job that
cannot be done anywhere else.

---

## Authorised can-hurt surfaces

Listing a surface here **is** the authorisation (CHARTER §4). Removing one
withdraws it. Nothing else in this file authorises anything.

| Surface | Why it can hurt someone | Authorised |
|---|---|---|
| **Calendar connection** — Google and Microsoft busy-time reading, and the separate write-back grant | Holds credentials that read a real person's calendar, and writes events to it | 2026-08-27 |
| **The booking service** — accounts, public booking pages, confirmation mail, management links | Holds third parties' names, email addresses and meeting times; sends mail on their behalf | 2026-08-02 |
| **Public sign-up** | Admits people the steward has not met to the surface above | 2026-08-29, subject to `DECISIONS.md` Q-005 |

## Red lines

These are recorded independently in
[`GAP-0004`](https://github.com/pumasi-ai/pumasi-booking/blob/main/roadmap/0004-feature-parity.md)
and repeated here only as a pointer, not as a second source
([L-007](lessons/L-007-restating-a-rule-forks-it.md)):

- No payments, no AI-suggestion features (§3).
- The clean-room rule on anything that studies Cal.com or Calendly (§2.1),
  protecting P1.
