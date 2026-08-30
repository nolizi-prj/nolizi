# Changelog

Public governance and release milestones, newest first. The operational
record — jobs, queues, machine state — lives in the private ops repository
and is the steward's to read; this file is everyone's.

## 2026-08-30 — the charter guides until `launched`, then binds

- **Charter Part 0 added** (steward): pre-`launched`, open windows do not hold
  reversible work — agents proceed on the stated default and a veto reverts.
  Never suspended at any stage: Part 1, `HUMAN.md`, and irreversible acts
  (personal data, licensing, credentials, mail).

## 2026-08-30 — reporting binds at `launched`

- **Charter §5.1 amended** (steward): the reporting-and-opt-out requirement now
  gates the `launched` stage promotion instead of every release. Below
  `launched` it is optional. D-108 closes by rule change; a product still
  cannot claim *works for strangers* on a one-machine test matrix.

## 2026-08-29 — public sign-up released; one commons repository; the charter tightens and loosens

- **Pumasi Booking opened to public sign-up** (release note:
  [`releases/2026-08-29-pumasi-booking-public-signup.md`](releases/2026-08-29-pumasi-booking-public-signup.md),
  veto window to 2026-09-05, closed early by steward approval — Q-005).
  Cross-family review found and fixed two security defects before launch: an
  account-existence oracle in a response header, and deletion paths that
  composed wrongly. Operator identity (ATX APPLE LLC, Texas) live on
  `/privacy`, `/terms`, `/dpa`.
- **Privacy posture rebalanced**: risk inherited along the handling path;
  reporting gated at release; collection split into published and held tiers.
  D-105 narrowed from blocking to degrading — the lawful basis is written and
  in force; the transfer mechanism and counsel review remain.
- **`pumasi-ai` became an organization**; all repositories transferred.
- **One commons repository**: `governance` merged in with full history and
  archived behind a redirect; superseded drafts retrievable via
  [`governance/SUPERSEDED.md`](governance/SUPERSEDED.md). `MANDATE.md`
  retired. The repo went from 7,781 lines to ~3,000.
- **Charter amendments** (steward): can-hurt approval reduced to P5's single
  non-builder review (Part 4/Part 7 — the entrenchment override is recorded
  in the text); triage replaced by a product-manager role. New debt:
  D-107–D-110, all open in [`governance/DEBT.md`](governance/DEBT.md).

## 2026-08-27 — calendar authorised; Google OAuth prepared

- Q-001 (calendar busy-time integration) published and its window ran to
  default: Google first, read-only busy times, write-back a separate grant.
- Q-003 closed: Google Cloud project, consent screen (testing), and the
  non-sensitive `calendar.freebusy` scope configured; verification submission
  deferred until a deployed app and privacy-policy URL existed.
- v0.4 governance adopted: agents proceed, the steward holds a veto;
  per-item signatures replaced by published windows.
