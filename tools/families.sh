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
# The list of families is NOT kept here. It is read from tools/review.sh
# (`review.sh --families`, `review.sh --driver <family>`), which is the script
# that actually drives them. This file used to carry a second copy under the
# comment "Keep in step with tools/review.sh" — two files that agree today
# (lessons/L-007-restating-a-rule-forks-it.md). Now there is one list, and each
# family is probed with the exact argv it would be reviewed with.
#
# Usage: tools/families.sh [--quiet]
# Exit:  0 three or more available · 1 fewer than three · 2 could not probe
set -uo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REVIEW="$SELF_DIR/review.sh"
TIMEOUT="${FAMILY_PROBE_TIMEOUT:-45}"
QUIET=0; [ "${1:-}" = "--quiet" ] && QUIET=1

if [ ! -x "$REVIEW" ]; then
  echo "  cannot probe: $REVIEW is missing or not executable" >&2
  echo "  breadth UNVERIFIED — this is not a count of zero, it is no count." >&2
  exit 2
fi
if ! FAMILY_LIST="$("$REVIEW" --families)" || [ -z "$FAMILY_LIST" ]; then
  echo "  cannot probe: $REVIEW --families returned nothing" >&2
  echo "  breadth UNVERIFIED — this is not a count of zero, it is no count." >&2
  exit 2
fi

AVAILABLE=0; TOTAL=0; MISSING=""; SHARED=0
for FAMILY in $FAMILY_LIST; do
  mapfile -t DRIVER < <("$REVIEW" --driver "$FAMILY")
  CLI="${DRIVER[0]:-}"
  TOTAL=$((TOTAL+1))
  # `recruit` reaches its families through one OpenRouter account and one API
  # key. Three families behind one credential are three families until that
  # credential lapses, and then they are none — which the count alone cannot
  # show, so it is said out loud below.
  [ "$CLI" = "recruit" ] && SHARED=$((SHARED+1))
  if [ -z "$CLI" ] || ! command -v "$CLI" >/dev/null 2>&1; then
    [ "$QUIET" -eq 0 ] && printf '  %-8s UNAVAILABLE (no %s on PATH)\n' "$FAMILY" "${CLI:-driver}"
    MISSING="$MISSING $FAMILY"; continue
  fi
  if printf '%s' "$(timeout "$TIMEOUT" "${DRIVER[@]}" -p 'Reply with exactly: OK' 2>/dev/null)" \
       | grep -q 'OK'; then
    [ "$QUIET" -eq 0 ] && printf '  %-8s available (%s)\n' "$FAMILY" "${DRIVER[*]}"
    AVAILABLE=$((AVAILABLE+1))
  else
    [ "$QUIET" -eq 0 ] && printf '  %-8s UNREACHABLE (%s did not answer in %ss)\n' "$FAMILY" "${DRIVER[*]}" "$TIMEOUT"
    MISSING="$MISSING $FAMILY"
  fi
done

if [ "$QUIET" -eq 0 ]; then
  echo "  -> $AVAILABLE of $TOTAL families available"
  # A probe answers 'OK'. It does not show that the family can produce a citing
  # verdict on a real diff, and the count must not be read as if it did — the
  # 9-line, findings-free pumasi-sign/reviews/20260831-143359-code-qwen.md
  # answered a probe just fine. Whether this number satisfies CHARTER §3
  # requirement 1 or §4's can-hurt gate is a reading, and it is the steward's.
  echo "  (a probe is 'can it answer', not 'can it review'; $SHARED of $TOTAL"
  echo "   reach their model through one shared OpenRouter credential)"
fi
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
