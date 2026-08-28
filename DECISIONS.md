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

## Closed

### Q-003 · Google Cloud OAuth application — **CLOSED 2026-08-27, done**
Steward's part: created `admin@pumasi.ai`, accepted the Cloud ToS and the API
Services User Data Policy (both terms acceptances, `HUMAN.md`), signed in once
to the operator browser (`tools/operator/`), and delegated CLI access. Agents'
part, under that delegation: project `pumasi-commons`, Calendar API enabled,
consent screen (external, testing mode), the single **non-sensitive**
`calendar.freebusy` scope (better than the *sensitive* estimated here earlier
— lightest review tier), `admin@pumasi.ai` as test user, and web client
`pumasi-service` with credentials in gitignored `apps/service/.env`. Record:
[`spec/0003-calendar-sync/GOOGLE-SETUP.md`](spec/0003-calendar-sync/GOOGLE-SETUP.md).
**Verification submission** is deliberately later — it needs a deployed app
and the Q-002 privacy policy URL.

**Proposal for the steward** (agents may not edit `HUMAN.md`): strike "OAuth
consent screen / test accounts" from the human registry — this session
demonstrated an agent performs them via the operator browser. Account
creation, terms acceptance, and verification *submission* stay human.
