# Digest

The running record agents keep for the steward (CHARTER §2). Newest first.
Read it or don't — nothing here blocks. Each entry: what advanced, what sits
in a veto window, what waits on `HUMAN.md`.

---

## 2026-08-27 (night) — secret store

- **All secrets now live in one place:** the private repo
  `github.com/mokcontoro/pumasi-secrets` — SOPS + age, one password unlocks
  everything on any machine (`./secrets.sh unlock`). The Google OAuth
  credentials are already in it. **Never** in the public commons repo, whose
  P2/P3 would make even an encrypted blob public and unrecallable forever.
- Waiting on you: choose the one password — run `./secrets.sh lock` in
  `~/dev/pumasi-secrets` (any terminal), then tell the agent to commit
  `key.age`.

## 2026-08-27 (night) — Q-003 closed

- **The Google OAuth app exists and is fully configured.** Your part was three
  acceptances and one sign-in; agents did the rest through the new operator
  browser (`tools/operator/` — an agent-driven Chrome with a persistent
  profile, reusable for every future console-only task: Microsoft, DNS,
  Railway, verification). Consent screen live in testing mode, busy-only
  scope, `admin@pumasi.ai` as test user, client credentials in gitignored
  `apps/service/.env`.
- **Good news:** `calendar.freebusy` is classed **non-sensitive** — lighter
  than estimated. Publishing later needs only the lightest review, and still
  waits on the Q-002 privacy policy.
- **Nothing now blocks calendar work.** Q-001's window closes 2026-08-29; spec
  writing starts then (or now, if you confirm early). A proposal to trim
  `HUMAN.md` is in the Q-003 closing entry — your call.

---

## 2026-08-27 (later)

- **Q-003 mostly cleared.** You created `admin@pumasi.ai`, accepted the Cloud
  ToS, and delegated CLI access; agents installed `gcloud`, created project
  **`pumasi-commons`**, and enabled the Calendar API. Remaining: the 4-step
  Console click list in `spec/0003-calendar-sync/GOOGLE-SETUP.md` (~5 min).
- **Intent question 3 answered:** `calendar.freebusy` is a *sensitive* scope,
  not *restricted* — standard verification, no third-party security
  assessment. Verification submission waits for a deployed app and a privacy
  policy URL, where Q-003 meets Q-002 (D-105).
- **Still in a veto window:** Q-001 (calendar intent) — closes **2026-08-29**.

---

## 2026-08-27

- **Charter v0.4 adopted** — autonomy by default, human by exception. The four
  per-item steward decisions became one standing mandate plus veto windows;
  v0.3 archived; residual recorded as D-106. Diff and reasoning in the commit.
- **New instruments:** `MANDATE.md` (steward-only), `HUMAN.md`, `DECISIONS.md`,
  this digest, and `tools/` (executable merge gate).
- **In a veto window:** Q-001, the calendar-integration intent — closes
  **2026-08-29**, default is proceed per its own recommendations.
- **Waiting on you (`HUMAN.md`):** Q-002 (D-105 lawful basis — agents will
  attach a draft notice for one-step approval) and Q-003 (Google OAuth app —
  agents will attach exact console steps; build proceeds in test mode
  meanwhile).
