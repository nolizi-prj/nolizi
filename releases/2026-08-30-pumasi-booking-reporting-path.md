# Pumasi Booking learns to report about itself — and how to tell it not to

**Published 2026-08-30 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-009). Stage is `beta`, so per CHARTER Part 0
the work proceeds now and a steward veto reverts it.**

## What changed

The software can now produce and send two kinds of report about itself —
never about the people who use it:

- An **operating report**, sent automatically once a day by self-hosted
  deployments: what platform it runs on, which switches are on (never their
  values), uptime, an error count. Private to the foundation, never published.
- A **conformance report** — did the acceptance suite pass on this platform —
  which an operator can *choose* to publish, signed with their own identity.
  Never sent automatically, and refused unless signed.

One switch turns all of it off: `PUMASI_REPORTING=false`. The software
behaves identically afterwards. On every start it says out loud whether
reporting is on and names that switch. One command prints the exact payload
before anything is sent, and what it prints is byte-for-byte what goes.

The **retention promise is now published** (this was debt D-107's missing
half): operating reports are kept twelve months, deleted on request to
admin@pumasi.ai sooner, deletion reaching backups within 30 days.
Conformance reports are public and permanent — which is why they stay narrow
and are sent only by an explicit signed act.

**Two things did not change.** The live deployment at booking.pumasi.ai
still sends nothing — the mechanism is not wired into the Cloudflare path,
and its privacy page says so, truthfully, per path. And there is nothing to
receive reports yet: the documented intake address is not live, so a send
today fails, is logged, and is dropped. Nothing is retained anywhere.

## What could hurt someone, and what stands in the way

- **A report that accidentally carried personal data.** The whole risk of
  telemetry. The schema is exact (a field not in it may not be carried); the
  acceptance tests build reports from a configuration where every string is a
  sentinel and assert none survives; the frozen SPEC-0002 case D-005 binds
  the emitted report to carry no owner or booker datum, and no count derived
  from them. Even booking *counts* are excluded.
- **Default-on reporting felt as surveillance.** The posture is CHARTER
  §5.2's, disclosed in `REPORTING.md` and on the live privacy page: one-step
  opt-out, no opt-out signal transmitted, no degradation, contents
  inspectable before sending.
- **A misdirected send.** The intake URL is configurable; the default is a
  pumasi.ai subdomain the project controls, over HTTPS.

## What was tested

Eleven acceptance cases (spec/0004, frozen before implementation), including
egress observed at the transport with the opt-out set (zero calls), printed
vs. sent payloads compared byte-for-byte, and behaviour parity on real
surfaces including a booking. Full suite: 271 service tests + engine suite,
green. Cross-family review: Gemini approved spec and code; Grok was
unreachable (D-104 condition live, recorded).

## Open debt this release touches (§2.1 requires their status here)

- **D-105** (privacy posture, DEGRADING): unchanged by this release. The
  operating report's stated basis is legitimate interest; counsel review and
  the transfer mechanism remain open, as the privacy page discloses.
- **D-107** (held-tier retention, DEGRADING): the schedule is now published —
  that half closes. The entry stays open until the intake exists with its
  deletion path implemented and tested; the spec forbids the intake to accept
  held reports before that (R5c).
- **D-108**: already closed 2026-08-30 by the §5.1 amendment; this release is
  the mechanism that amendment still requires before `launched` is claimed.
