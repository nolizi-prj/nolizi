#!/usr/bin/env bash
# Which model families can actually review right now — CHARTER §3, DEBT D-104.
#
# D-104's harm is not that reviewer breadth degrades. It is that it degrades
# SILENTLY: the spec-reviewer separation in §3 requirement 1 is written "where
# three or more model families are available", so if a provider disappears the
# rule stops applying and nothing says so. This script is what makes that
# audible. It answers a question nobody was asking automatically: how many
# families are there TODAY, rather than on the day D-002 was closed.
#
# Usage: tools/families.sh [--quiet]
# Exit:  0 three or more available · 1 fewer than three · 2 could not probe
set -uo pipefail

# family -> the CLI review.sh drives. Keep in step with tools/review.sh.
FAMILIES="claude:claude gemini:agy grok:grok"
TIMEOUT="${FAMILY_PROBE_TIMEOUT:-45}"
QUIET=0; [ "${1:-}" = "--quiet" ] && QUIET=1

AVAILABLE=0; TOTAL=0; MISSING=""
for PAIR in $FAMILIES; do
  FAMILY="${PAIR%%:*}"; CLI="${PAIR##*:}"
  TOTAL=$((TOTAL+1))
  if ! command -v "$CLI" >/dev/null 2>&1; then
    [ "$QUIET" -eq 0 ] && printf '  %-8s UNAVAILABLE (no %s on PATH)\n' "$FAMILY" "$CLI"
    MISSING="$MISSING $FAMILY"; continue
  fi
  if printf '%s' "$(timeout "$TIMEOUT" "$CLI" -p 'Reply with exactly: OK' 2>/dev/null)" \
       | grep -q 'OK'; then
    [ "$QUIET" -eq 0 ] && printf '  %-8s available (%s)\n' "$FAMILY" "$CLI"
    AVAILABLE=$((AVAILABLE+1))
  else
    [ "$QUIET" -eq 0 ] && printf '  %-8s UNREACHABLE (%s did not answer in %ss)\n' "$FAMILY" "$CLI" "$TIMEOUT"
    MISSING="$MISSING $FAMILY"
  fi
done

[ "$QUIET" -eq 0 ] && echo "  -> $AVAILABLE of $TOTAL families available"
if [ "$AVAILABLE" -ge 3 ]; then exit 0; fi
if [ "$QUIET" -eq 0 ]; then
  echo ""
  echo "  DEBT D-104 CONDITION IS LIVE:$MISSING unavailable."
  echo "  CHARTER §3 req 1 (the spec reviewer must not be among the code"
  echo "  reviewers' families) cannot bind below three families, and §4's"
  echo "  can-hurt gate needs two families other than the builder's."
  echo "  This is the notice D-104 exists to make sure you get."
fi
exit 1
