# The driver — standing instructions for an autonomous work session

This is the prompt a scheduled or manually started agent session follows to
advance Pumasi without a human in the loop. Run it as often as you like — it
is idempotent: each run does the next useful step and stops at real
boundaries (an open veto window, a `HUMAN.md` act with no route around).

Invocation, from the repository root, any of:

    claude -p "Follow tools/DRIVER.md"
    # or as a scheduled routine / cron entry doing the same

## The loop

1. **Read, in order:** `HUMAN.md` · `DECISIONS.md` ·
   `governance/CHARTER.md` Part 3 · `lessons/README.md`. Never edit
   `HUMAN.md`; never move a deadline or change a default in
   `DECISIONS.md` (CHARTER §2 — L-003).
2. **Close expired windows.** Any `DECISIONS.md` entry whose window has passed
   without a steward veto: mark it closed with the date and outcome
   "proceeded on silence", and treat its default as decided.
3. **Pick the work:** the lowest-numbered mandate item that is authorised and
   not blocked by an open window or an unrouted human dependency. Within
   the item, do the next step of the charter flow: intent → (window) → spec +
   frozen tests → spec review → build → code review → merge → release
   (can-hurt: note + 7-day window, ceilings first).
4. **Reviews are run, not requested:** `tools/review.sh spec <dir>` /
   `tools/review.sh code <range>` — two families (`--can-hurt` paths need two
   regardless). Address cited objections; discard uncited ones, in writing, in
   the transcript's commit.
5. **Commit with the signed record** (P9), e.g.:

        service: <what and why>

        Agent: claude-code
        Model: <exact model id>
        Sponsor: mok
        Token-Cost: <best estimate>
        Spec: spec/000N-<item>
        Reviewed-By: gemini reviews/<stamp>-code-gemini.md
        Reviewed-By: grok reviews/<stamp>-code-grok.md

6. **Gate before merge:** `tools/gate.sh` (add `--can-hurt` when §4 says so).
   It must print `GATE: PASS`. Merge to `main`; no other long-lived branches.
7. **Queue what only a human can do:** signing, or paying — prepare it to
   one click, append it to `DECISIONS.md` with a stated route-around, and take
   the route-around now if one exists.
8. **Write the digest:** prepend a dated entry to `DIGEST.md` — what advanced,
   what is in a window and when it closes, what waits on the human. Then stop.

## Boundaries — where the driver stops rather than proceeds

- An open veto window: never act on the defaulted outcome before the deadline.
- A `HUMAN.md` act with no route around (today: nothing — Q-002 blocks only
  public signup, Q-003 has test mode).
- Anything that would raise the D-105 ceilings, enable public signup, touch a
  red line, or edit an agent-untouchable file.
- A cited review objection: resolve it or amend the spec in the open
  (fresh cross-family spec review) — never argue past it.
