#!/usr/bin/env bash
# The executable merge gate — CHARTER §3. Run before any merge to main.
# Where this script and the charter prose disagree, the prose governs and
# this script is a bug.
#
# Checks, for HEAD (or a given commit):
#   1. The test suites pass (frozen acceptance tests included).
#   2. The signed record: Agent, Model, Spec trailers present
#      (Sponsor, Token-Cost warned about if absent — P9 wants them).
#   3. At least one Reviewed-By trailer naming a family and a transcript
#      that exists and ends in VERDICT: APPROVE. One suffices for every
#      class since 2026-08-29; --can-hurt is kept for compatibility and
#      changes nothing.
#
# Usage: tools/gate.sh [--can-hurt] [commit]
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

CAN_HURT=0
[ "${1:-}" = "--can-hurt" ] && { CAN_HURT=1; shift; }
COMMIT="${1:-HEAD}"
FAIL=0

echo "── 1/4 tests"
if npm test; then echo "   tests: PASS"; else echo "   tests: FAIL"; FAIL=1; fi

MSG="$(git log -1 --format=%B "$COMMIT")"
trailer() { printf '%s\n' "$MSG" | git interpret-trailers --parse | grep -i "^$1:" || true; }

echo "── 2/4 signed record on $COMMIT"
for T in Agent Model Spec; do
  if [ -z "$(trailer "$T")" ]; then echo "   missing trailer: $T:"; FAIL=1; fi
done
for T in Sponsor Token-Cost; do
  [ -z "$(trailer "$T")" ] && echo "   warning: no $T: trailer (P9 wants it)"
done

echo "── 3/4 cross-family review"
REVIEWS="$(trailer Reviewed-By)"
COUNT=0
FAMILIES_SEEN=""
while IFS= read -r LINE; do
  [ -z "$LINE" ] && continue
  # format: Reviewed-By: <family> <transcript-path>
  FAMILY="$(printf '%s' "$LINE" | awk '{print $2}')"
  FILE="$(printf '%s' "$LINE" | awk '{print $3}')"
  if [ ! -f "$FILE" ]; then echo "   transcript missing: $FILE"; FAIL=1; continue; fi
  if grep -qE '^VERDICT: APPROVE' "$FILE"; then
    case " $FAMILIES_SEEN " in *" $FAMILY "*) echo "   duplicate family $FAMILY ignored";;
      *) COUNT=$((COUNT+1)); FAMILIES_SEEN="$FAMILIES_SEEN $FAMILY";; esac
    echo "   $FAMILY approved ($FILE)"
  else
    echo "   $FILE has no VERDICT: APPROVE"; FAIL=1
  fi
done <<EOF2
$REVIEWS
EOF2

# 2026-08-29: the steward reduced the can-hurt bar to P5's single
# non-builder review, so --can-hurt no longer raises the count.
NEED=1
if [ "$COUNT" -lt "$NEED" ]; then
  echo "   need $NEED approving famil$( [ "$NEED" -eq 1 ] && echo y || echo ies), have $COUNT"
  FAIL=1
fi

# ── 4/4 · reviewer breadth, reported rather than assumed (D-104) ──────────
# This step never fails the gate on its own. Breadth degrading is not a defect
# in the change being merged; it is a fact about the commons that D-104 says
# must not arrive silently. Skippable for a fast local loop, and the skip is
# announced too — an unannounced skip would reintroduce exactly the silence.
echo "── 4/4 reviewer breadth available today (D-104)"
if [ "${SKIP_FAMILY_PROBE:-0}" = "1" ]; then
  echo "   SKIPPED by SKIP_FAMILY_PROBE=1 — breadth is UNVERIFIED for this run"
elif [ -x tools/families.sh ]; then
  tools/families.sh || echo "   (recorded, not fatal: this gate still applies the rules it can)"
else
  echo "   tools/families.sh missing — breadth UNVERIFIED"
fi

if [ "$FAIL" -eq 0 ]; then echo "GATE: PASS"; else echo "GATE: FAIL"; fi
exit "$FAIL"
