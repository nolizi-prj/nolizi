# Decision queue

Every open veto window and every queued human-only action, in one place, with
its deadline and its default. **Agents append new entries and mark expired
windows closed; only the steward moves a deadline, changes a default, or
vetoes** (CHARTER §2, §7). A veto is an entry edit by the steward, in the open,
with reasoning.

An entry without a stated default is a defect — silence must always select a
named outcome (CHARTER §2.1).

## Open

### Q-001 · Calendar integration intent statement — veto window
| | |
|---|---|
| **What** | `spec/0003-calendar-sync/INTENT.md`, published 2026-08-03. Window restarted at v0.4 adoption because the old model's signature boxes were never signed. |
| **Window closes** | **2026-08-29** (48h from 2026-08-27) |
| **Default on silence** | Proceed with the intent statement's own recommendations: Google first, then Microsoft; busy-time reading first, write-back as a separate optional grant; Google and Microsoft named as subprocessors before any token is held; the connection token treated as the most protected datum in the system. |
| **Status** | open |

### Q-002 · D-105 — lawful basis for bookers' personal data
| | |
|---|---|
| **What** | Human-only (`HUMAN.md`): decide the controller's lawful basis, approve the privacy notice. No default can proceed on silence — this is the one queue entry with no route around a public launch. |
| **Deadline** | none set — but it blocks public signup and blocks raising the 5-owner / 200-booking ceilings, permanently, until answered. |
| **Agent next step** | Draft the privacy notice, basis analysis, and deletion-reach statement, and attach them here for one-step approval. |
| **Status** | open — awaiting agent draft, then steward decision |

### Q-003 · Google Cloud OAuth application — human account creation
| | |
|---|---|
| **What** | Human-only (`HUMAN.md`): create the Google Cloud project and OAuth consent screen, submit for verification, nominate test accounts. Verification is calendar time, so starting early is free. |
| **Deadline** | none — the route-around is test mode with nominated accounts, so spec/build work on item 3 proceeds regardless. |
| **Agent next step** | Produce the exact console steps, scopes (busy-only, per the intent), and consent-screen text, and attach them here. |
| **Status** | open — awaiting agent prep |

## Closed

*(none yet — entries move here with a date and their outcome: proceeded on
silence, vetoed, or done by the steward)*
