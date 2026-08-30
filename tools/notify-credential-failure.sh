#!/usr/bin/env bash
# Turns a model-authentication failure into a notification, without an SMTP
# credential — CHARTER Part 2 (HUMAN.md: accounts and spend are steward-only,
# so this deliberately does not need either). Issue #3.
#
# A single open `credential-failure` issue is both the notification (GitHub
# emails whoever watches this repository when an issue opens or closes) and
# the dedup guard: the first failure opens it; later failures see it already
# open and stay quiet; the next success closes it.
#
# Usage: tools/notify-credential-failure.sh "<failure reason, or empty>"
# Requires: gh, authenticated with issues:write on the current repository.
set -euo pipefail

REASON="${1:-}"
GUARD="$(gh issue list --label credential-failure --state open --json number --jq '.[0].number // empty')"

if [ -n "$REASON" ]; then
  echo "::warning::$REASON Skipping this run."
  if [ -z "$GUARD" ]; then
    RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-}"
    gh issue create \
      --title "Model credential failure: an agent run could not authenticate" \
      --label credential-failure \
      --body "$(cat <<BODY
$REASON

Run: $RUN_URL

Remediation: run \`claude setup-token\` and update the \`CLAUDE_CODE_OAUTH_TOKEN\`
repository secret (Settings → Secrets and variables → Actions), or set
\`ANTHROPIC_API_KEY\` instead.

This issue is the dedup guard as well as the notification: it stays open
across repeated failures rather than being recreated, and closes itself the
next time a run authenticates successfully.
BODY
)" \
      >/dev/null
    echo "::warning::Opened a credential-failure issue — GitHub notifies this repository's watchers."
  else
    echo "::warning::credential-failure issue #$GUARD is already open — not recreating."
  fi
  exit 0
fi

if [ -n "$GUARD" ]; then
  gh issue close "$GUARD" --comment "A run authenticated successfully. Closing — the credential is working again."
fi
