# Digest

The running record agents keep for the steward (CHARTER §2). Newest first.
Read it or don't — nothing here blocks. Each entry: what advanced, what sits
in a veto window, what waits on `HUMAN.md`.

---

## 2026-08-30 — triage ran on this repository's own issue queue

- **All three open issues resolved.** #1 (continuous triage loop) and #2
  (README slimming) were both rejected as duplicates: `tools/TRIAGE.md`,
  `.github/workflows/triage.yml`, and the `accepted`/`rejected`/`escalated`
  labels already existed for #1; the README was already cut back to a link
  for #2. Neither needed anything built — verdict comments cite the current
  file state, both closed.
- **#3 accepted, implemented, not merged.** A credential failure in the
  triage workflow now opens a `credential-failure` issue (dedup guard and
  notification in one — GitHub emails this repository's watchers on
  open/close, no SMTP credential needed) instead of only logging a
  `::warning::`. Verified live: a simulated failure opened #8, a repeat
  failure left it open without recreating it, and a simulated success closed
  it. **Left as branch `issue-3-credential-failure-notice` / a PR, not merged
  to `main`** — `tools/families.sh` found 0 of 3 reviewer families reachable
  in this session (no `agy`, no `grok`, and `claude` itself did not answer its
  own probe), so `tools/review.sh code` could not obtain the one non-builder
  approval Part 3 requires. Failed transcripts are committed on the branch.
  Issue #3 stays open and `accepted` for a run with a reachable reviewer
  family to pick up.
- **Not done, and named rather than assumed:** true email delivery to
  `admin@pumasi.ai` specifically (rather than to whoever watches this repo on
  GitHub) still needs a mail-provider credential, which is `HUMAN.md` ground
  this session does not decide.

## 2026-08-29 (evening) — the ops loop is live; first project-manager tick

- **The queue works.** Dispatcher plus a cron project-manager tick are installed
  in `pumasi-ops`. Both lifecycle paths verified: smoke job `0001` exited 0 into
  `jobs/done/`; the designed-to-fail job `0002` landed in `jobs/failed/`.
- **Enqueued this tick: job `0003`, web page manager.** `pumasi-web`'s last
  commit (`dc2acf5`, 11:56) predates today's catalog rewrite (`5a49afc`, 17:15),
  the governance merge (`a843df1`), D-110, and the Q-005 release note. The
  packet asks the site to match `pumasi` @ `27095f6`.
- **Legal but deferred to a later tick:** triage. Unlabelled open issues exist
  on `pumasi-booking` (#3–#6) and on `pumasi` itself (#1–#3) — the latter
  despite `.github/workflows/triage.yml` existing there, which may mean the
  workflow is not firing.
- **Not enqueued, and why:** hunt already ran today (tour-review session
  recorded `798b000`); no hunt candidate is `selected`. No coder packet — the
  product's roadmap sits on an unmerged branch
  (`roadmap/the-product-owns-its-roadmap`) and the checkout holds in-flight
  `cloudflare-workers` work, so `main` names no next roadmap item and the repo
  may have a writer.
- **Windows and `HUMAN.md`:** unchanged from the entry below — D-105's transfer
  mechanism and counsel review, and the `PUBLIC_SIGNUP` flip, still wait on you.

## 2026-08-29 — the busiest two days: privacy posture, the org, one repository

- **Privacy and legal strictness rebalanced.** The charter now inherits risk along
  the *handling path* rather than the whole dependency graph (§4), gates reporting
  at release rather than merge (§5.1), and splits collection into a narrow
  **published** tier and a richer **held** tier (§5.2) — the commons collects more
  and publishes no more than before.
- **D-105 went BLOCKING → DEGRADING.** The lawful basis was already written and in
  force; what remained was the transfer position and a review by counsel. The
  5-owner / 200-booking ceilings are now raisable defaults and public sign-up is a
  deployment decision. You removed the mandate red line that froze them.
- **Pumasi Booking:** an account-takeover hole closed — public sign-up granted a
  14-day session for any unverified address; it now mails a single-use link, and
  answers identically for taken addresses so it cannot enumerate accounts.
  Operator identity (**ATX APPLE LLC**, Texas) is live on `/privacy`, `/terms`,
  `/dpa`. Design fixes shipped: destructive delete moved to Settings and styled as
  destructive; ambiguous weekday headers fixed.
- **`pumasi-ai` is now an organisation.** `pumasi-dev` is the agent identity,
  `pumasiAI` the owner. Branch protection was applied to five public repos and
  then **removed at your instruction** — direct pushes to `main` work again, and
  restoring it is one command.
- **One repository.** `governance` merged into `pumasi` with full history and was
  archived read-only behind a redirect. `MANDATE.md` deleted; the front door lost
  77 lines of product documentation that had already drifted from the product's
  own README.
- **New debt:** `D-107` (held tier has no retention schedule), `D-108` (released
  without a reporting path, by your decision), `D-109` (can-hurt surfaces are now
  classified by agents with no human step, by your decision). `D-104` gained a
  live breadth probe — three model families verified working today, the first
  check in four weeks.
- **In a veto window:** **Q-005**, the public sign-up release note — closes
  **2026-09-05**.
- **Waiting on you (`HUMAN.md`):** the transfer mechanism and counsel review
  (D-105); **two cross-family reviews** from Gemini and Grok, which Part 4
  requires before the can-hurt release can proceed and which no agent here can
  obtain; and the `PUBLIC_SIGNUP` flip itself.

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
