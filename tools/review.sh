#!/usr/bin/env bash
# Executable cross-family review — CHARTER §3. Where this script and the
# charter prose disagree, the prose governs and this script is a bug.
#
# Usage:
#   tools/review.sh spec <path-to-spec-dir>  [family...]
#   tools/review.sh code <git-range>         [family...]
#
# Families and their CLIs (must be on PATH):
#   gemini -> agy -p · grok -> grok -p · claude -> claude -p
# Default reviewers: gemini grok. The builder's own family never counts
# toward its own review (P5); do not list it.
#
# Each reviewer's full transcript is saved under reviews/ (public, P6/WP 6)
# and must end with exactly one of:
#   VERDICT: APPROVE
#   VERDICT: OBJECT — <citation of a failing test or a specific clause>
# An objection without a citation is discarded per CHARTER §3, but is still
# saved in the transcript. Exit 0 only if every family approves.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
ROLE="${1:?usage: tools/review.sh <spec|code> <target> [family...]}"
TARGET="${2:?missing target (spec dir or git range)}"
shift 2
FAMILIES=("${@:-}")
[ -z "${FAMILIES[0]:-}" ] && FAMILIES=(gemini grok)

VERDICT_RULES="End your reply with exactly one final line: either
'VERDICT: APPROVE' or 'VERDICT: OBJECT — <citation>'. Per the charter, an
objection MUST cite a failing acceptance test or a specific clause of the spec
or governance/CHARTER.md; an uncited objection is discarded. Do not modify any
file."

case "$ROLE" in
  spec)
    PROMPT="You are performing the cross-family SPEC review required by
governance/CHARTER.md Part 3 requirement 1, in this repository. Review the
specification in '$TARGET' (read SPEC.md, INTENT.md, and acceptance/ there,
plus governance/CHARTER.md and lessons/README.md). Check: coherence and
internal consistency; edge cases the acceptance tests miss; conformance to the
charter; whether any acceptance case can pass without exercising the clause it
names (lessons/L-006); and whether the spec matches its intent statement.
$VERDICT_RULES"
    ;;
  code)
    PROMPT="You are performing the cross-family CODE review required by
governance/CHARTER.md Part 3 requirement 3, in this repository. Review the
changes shown by: git diff $TARGET   (run it yourself; read any file you
need). Check the diff against the frozen specification and acceptance tests it
claims to implement (see the commit messages' Spec: trailer), for correctness,
for edge cases, and for anything the tests cannot catch. The builder may not
have edited frozen acceptance tests — flag it if the diff touches them.
$VERDICT_RULES"
    ;;
  *) echo "role must be 'spec' or 'code'" >&2; exit 2 ;;
esac

mkdir -p reviews
STAMP="$(date +%Y%m%d-%H%M%S)"
FAIL=0
for FAMILY in "${FAMILIES[@]}"; do
  case "$FAMILY" in
    # Headless flags are required: without them each CLI auto-denies its own
    # `git diff` and produces no verdict, which is how this was found.
    gemini) CMD=(agy --dangerously-skip-permissions -p "$PROMPT") ;;
    grok)   CMD=(grok --always-approve -p "$PROMPT") ;;
    claude) CMD=(claude --dangerously-skip-permissions -p "$PROMPT") ;;
    *) echo "unknown family: $FAMILY" >&2; exit 2 ;;
  esac
  OUT="reviews/$STAMP-$ROLE-$FAMILY.md"
  echo "── $FAMILY reviewing ($ROLE: $TARGET) → $OUT"
  {
    echo "# Cross-family $ROLE review"
    echo
    echo "- **Target:** $TARGET"
    echo "- **Family:** $FAMILY"
    echo "- **Date:** $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "- **Invoked as:** ${CMD[0]} -p ..."
    echo
    echo "---"
    echo
  } > "$OUT"
  if ! "${CMD[@]}" >> "$OUT" 2>&1; then
    echo "reviewer CLI failed for $FAMILY (transcript kept)" >&2
    FAIL=1
    continue
  fi
  VERDICT="$(grep -E '^VERDICT:' "$OUT" | tail -1 || true)"
  echo "   $FAMILY → ${VERDICT:-NO VERDICT LINE}"
  case "$VERDICT" in
    "VERDICT: APPROVE") ;;
    VERDICT:*OBJECT*) FAIL=1 ;;
    *) echo "   no valid verdict line — treated as not approved" >&2; FAIL=1 ;;
  esac
done

if [ "$FAIL" -eq 0 ]; then
  echo "ALL FAMILIES APPROVE — cite transcripts in the commit, e.g.:"
  for FAMILY in "${FAMILIES[@]}"; do
    echo "Reviewed-By: $FAMILY reviews/$STAMP-$ROLE-$FAMILY.md"
  done
else
  echo "REVIEW NOT PASSED — read the transcripts in reviews/, address cited"
  echo "objections (uncited ones are discarded per CHARTER §3), and rerun."
fi
exit "$FAIL"
