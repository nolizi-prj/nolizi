# Product rules — what every Pumasi product provides

**Version:** 1.0 · 2026-08-30 · **Status:** Live, continuously updated
**Changes:** every change bumps the version and adds a line to the
[change log](#change-log) below, in its own commit — a rule change is its own
event, never buried in other work.

This file holds the rules that are **true of every Pumasi product**, present
and future. It exists so that a product agent writing desired features does
not rediscover them per product, and so a new product cannot ship without
them by nobody having thought to ask.

**Who reads this, and when.** The product-manager role reads this file before
writing or reordering `roadmap/VALUE.md` or `roadmap/BACKLOG.md`, and a
feature set that violates a rule here is a defect in the proposal, not a
choice the product gets to make. Compliance is not tracked in a table in this
file — a status summary kept apart from the products would drift
([L-007](lessons/L-007-restating-a-rule-forks-it.md)). Instead the
product-manager checks compliance at each product evaluation, and a gap
becomes a `BACKLOG.md` entry pointing at the rule it closes.

**Where a rule binds.** Each rule names the stage
(`roadmap/STAGE.md` ladder) at which it gates promotion, the same shape as
the charter's reporting requirement (CHARTER §5.1). Below that stage it is
encouraged, never gating.

---

## PR-1 — Every product carries a version number

**Binds:** always, from the first commit.

- **One source of truth**: the version lives in the repository root
  `package.json` (or the ecosystem equivalent), and everything else reads it
  from there. A second hand-maintained copy is L-007.
- **Semantic versioning**: breaking / feature / fix. Below 1.0.0 the usual
  0.x latitude applies, but the number still moves — a product that ships
  changes without moving its version is invisible to its own bug reports.
- **User-visible**: a person using the product can find the version without
  reading source — a page footer, an about view, or a `/version` endpoint.
- **In the diagnostics**: every feedback report (PR-2) and every release note
  states the version it concerns. A defect report without a version is a
  request to guess.

## PR-2 — Every product has an in-app feedback feature

**Binds:** at the `beta` promotion — the stage at which strangers may rely on
the product is the stage at which strangers need a way to talk back. Below
`beta`, encouraged.

The reference implementation is Pumasi Booking's
(`service/src/feedback.ts` in `pumasi-booking`), and a new product matches
its behaviour, not its code (COPIED.md records what was copied):

- **Three kinds**: bug · feature request · general feedback, from inside the
  product, no account on any tracker required.
- **Lands in the open**: a report becomes a public GitHub issue in the
  product's own repository, labelled `feedback` (plus `bug` /
  `enhancement`), where the product-manager's intake gives every one a
  cited verdict — `accepted` / `rejected` / `escalated`.
- **Diagnostics are sanitized before they leave**: URLs stripped of tokens,
  sessions, and secrets; recent errors as message + location only; never a
  credential, never a value the user typed into their own data
  (CHARTER §5.2 — *never the user's own material*). A screenshot travels
  only when the user attaches one.
- **Contact is optional**: an email field the user may fill, never a
  requirement to be heard.
- **The report is inspectable**: what will be sent is what the user saw
  composed — no hidden fields appended after consent.

---

## Adding a rule

Anyone — agent or steward — may propose a rule by PR against this file. A
rule qualifies when it is **true of every product**, testable, and cheaper
stated once here than rediscovered per product; anything true of one product
belongs in that product's repository (README: *what belongs where*). A new
rule states the stage at which it binds. Steward-directed changes land
directly; agent-proposed ones take the charter's ordinary review.

## Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-30 | Created by steward direction: PR-1 version numbers, PR-2 in-app feedback. |
