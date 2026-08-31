#!/usr/bin/env bash
# Executable cross-family review — CHARTER §3. Where this script and the
# charter prose disagree, the prose governs and this script is a bug.
#
# Usage:
#   tools/review.sh [--builder <family>] spec <path-to-spec-dir> [family...]
#   tools/review.sh [--builder <family>] code <git-range>        [family...]
#   tools/review.sh --families          # the family table, one name per line
#   tools/review.sh --driver <family>   # its argv prefix, one word per line
#
# Families and the CLIs they are driven by (must be on PATH):
#   claude -> claude -p · gemini -> agy -p · grok -> grok -p
#   qwen -> recruit -f qwen -p · glm -> recruit -f glm -p · kimi -> recruit -f kimi -p
#
# tools/families.sh probes this same table by ASKING THIS SCRIPT FOR IT
# (--families / --driver). There is one list, not two files that agree today
# and fork tomorrow (lessons/L-007-restating-a-rule-forks-it.md).
#
# THE DEFAULT SET OF REVIEWERS IS DERIVED, NOT STATIC — and it cannot be
# static. The rule the default exists to serve is that the builder's own family
# never counts toward its own review (P5), so a default that is right for a
# claude builder is wrong for a gemini one. The old static `gemini grok` was
# only ever correct for a claude builder, and half of it now returns HTTP 402.
# Declare the builder and the default follows from it:
#
#   BUILDER_FAMILY=claude tools/review.sh code <range>
#   tools/review.sh --builder claude code <range>
#
# which takes the first REVIEW_WIDTH (default 2, unchanged from the old
# two-family default) entries of KNOWN_FAMILIES below that are not the
# builder's. With no family named on the command line AND no builder declared,
# this script refuses to guess and exits 2. Guessing is how a builder ends up
# reviewing itself.
#
# Each reviewer's full transcript is saved under reviews/ (public, P6/WP 6)
# and must end with exactly one of:
#   VERDICT: APPROVE
#   VERDICT: OBJECT — <citation of a failing test or a specific clause>
# An objection without a citation is discarded per CHARTER §3, but is still
# saved in the transcript. Exit 0 only if every family approves.
#
# A reviewer that CANNOT ANSWER is not an objection and is not printed like
# one. `grok` returning 402 and `gemini` finding a real defect both used to set
# FAIL=1 and look alike in a skimmed log; they now print as UNREACHABLE and
# OBJECT respectively, and the run says how many families actually returned a
# verdict.
#
# This script COMMITS NOTHING. It ends every run by naming the transcripts it
# wrote and saying whether git can see them, because a transcript a clean
# checkout cannot see is not the public record P6 asks for — job 0043 had to
# sweep up 24 of them that DIGEST was already citing by path.
set -euo pipefail

# ── The family table · single source of truth ────────────────────────────────
# Order matters twice: it is the order families are probed in, and it is the
# preference order the derived default draws from. It is ordered by what each
# family has been SHOWN to do on a real diff, not by what answers a probe:
#
#   claude gemini  agentic — they run `git diff` and open files themselves,
#                  which is the stronger review, so they come first.
#   qwen kimi      demonstrated 2026-08-31 on 2b29a0d~1..2b29a0d: both
#                  returned a cited VERDICT: OBJECT naming tools/gate.sh and
#                  the charter clause it misses (see reviews/20260831-160735-).
#   glm            demonstrated on the same range, but on the SECOND attempt:
#                  the first timed out at curl's 600s ceiling with no verdict
#                  line (reviews/20260831-160735-code-glm.md), the second
#                  returned a cited OBJECT (reviews/20260831-162514-code-glm.md).
#                  One in two is drivable, not dependable, so it sits behind
#                  kimi and the derived default does not reach for it.
#   grok           HTTP 402, "Grok Build usage balance exhausted", measured
#                  2026-08-31 15:35 CDT. Kept drivable and kept probed by
#                  families.sh — a family that has gone is a fact worth
#                  reporting — but last, because a default must not reach for
#                  a CLI that cannot answer.
KNOWN_FAMILIES="claude gemini qwen kimi glm grok"

# family_driver <family> — print the argv prefix, one word per line, that
# `-p <prompt>` is appended to. Returns 1 for an unknown family.
#
# Headless flags are required: without them each CLI auto-denies its own
# `git diff` and produces no verdict, which is how this was found.
family_driver() {
  case "$1" in
    claude)        printf '%s\n' claude --dangerously-skip-permissions ;;
    gemini)        printf '%s\n' agy --dangerously-skip-permissions ;;
    grok)          printf '%s\n' grok --always-approve ;;
    qwen|glm|kimi) printf '%s\n' recruit -f "$1" ;;
    *) return 1 ;;
  esac
}

# family_reads_the_tree <family> — 0 if the reviewer is an agent that can run
# `git diff` and open files for itself; 1 if it is a single completion call
# that will only ever see the prompt.
#
# The recruit families are the second kind: `recruit -f qwen` is one
# OpenRouter chat completion with no tools and no filesystem. Tell one of them
# to "run git diff yourself" and it reviews nothing, which is exactly what
# pumasi-sign/reviews/20260831-143359-code-qwen.md is — 9 lines, 464 bytes, no
# findings, no verdict. So for these families the target has to travel INSIDE
# the prompt, and the transcript header records how many bytes of it did.
family_reads_the_tree() {
  case "$1" in claude|gemini|grok) return 0 ;; *) return 1 ;; esac
}

# ── Table queries · no repository and no model call needed ───────────────────
case "${1:-}" in
  --families) printf '%s\n' $KNOWN_FAMILIES; exit 0 ;;
  --driver)
    family_driver "${2:?--driver needs a family}" \
      || { echo "unknown family: $2" >&2; exit 2; }
    exit 0 ;;
esac

cd "$(git rev-parse --show-toplevel)"

BUILDER="${BUILDER_FAMILY:-}"
if [ "${1:-}" = "--builder" ]; then
  BUILDER="${2:?--builder needs a family}"
  shift 2
fi

ROLE="${1:?usage: tools/review.sh [--builder <family>] <spec|code> <target> [family...]}"
TARGET="${2:?missing target (spec dir or git range)}"
shift 2
FAMILIES=("$@")

# ── The derived default ──────────────────────────────────────────────────────
WIDTH="${REVIEW_WIDTH:-2}"
if [ "${#FAMILIES[@]}" -eq 0 ]; then
  if [ -z "$BUILDER" ]; then
    cat >&2 <<'EOF'
no reviewers named, and no builder family declared.

There is no static default to fall back on. CHARTER P5 says the builder's own
family never counts toward its own review, so the correct default depends on
who is building: `gemini grok` was only ever right for a claude builder, and
grok is currently returning HTTP 402. Rather than pick a new static default
that is wrong for some builder, this script asks. Either:

  BUILDER_FAMILY=<family> tools/review.sh <role> <target>
  tools/review.sh --builder <family> <role> <target>

and the default becomes the first REVIEW_WIDTH (default 2) of
EOF
    printf '  %s\n' "$KNOWN_FAMILIES" >&2
    echo "that are not yours — or name the reviewers yourself:" >&2
    echo "  tools/review.sh <role> <target> gemini qwen" >&2
    exit 2
  fi
  family_driver "$BUILDER" >/dev/null \
    || { echo "unknown builder family: $BUILDER" >&2; exit 2; }
  for F in $KNOWN_FAMILIES; do
    [ "${#FAMILIES[@]}" -ge "$WIDTH" ] && break
    if [ "$F" != "$BUILDER" ]; then FAMILIES+=("$F"); fi
  done
  echo "── default reviewers for a '$BUILDER' builder (P5, derived): ${FAMILIES[*]}"
elif [ -n "$BUILDER" ]; then
  for F in "${FAMILIES[@]}"; do
    if [ "$F" = "$BUILDER" ]; then
      echo "refusing: '$F' is the builder's own family — it cannot review its own work (P5)." >&2
      exit 2
    fi
  done
fi

# Reject unknown families before spending a single model call.
for F in "${FAMILIES[@]}"; do
  family_driver "$F" >/dev/null || { echo "unknown family: $F" >&2; exit 2; }
done

VERDICT_RULES="End your reply with exactly one final line: either
'VERDICT: APPROVE' or 'VERDICT: OBJECT — <citation>'. Per the charter, an
objection MUST cite a failing acceptance test or a specific clause of the spec
or governance/CHARTER.md; an uncited objection is discarded. Do not modify any
file."

# ── The prompt, and the context bundle the completion families need ──────────
# NEED_BUNDLE is built only if some selected family cannot read the tree, but
# the TARGET is validated either way: an unreadable range or an empty diff is
# the same silent nothing-was-reviewed as an empty transcript, one step earlier.
BUNDLE=""
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
    [ -d "$TARGET" ] || { echo "spec target is not a directory: $TARGET" >&2; exit 2; }
    build_bundle() {
      local F
      while IFS= read -r F; do
        printf '\n===== FILE: %s =====\n' "$F"
        cat "$F"
      done < <(find "$TARGET" -type f \( -name '*.md' -o -name '*.yaml' -o -name '*.yml' \
                 -o -name '*.ts' -o -name '*.js' -o -name '*.txt' \) | sort)
      for F in governance/CHARTER.md lessons/README.md; do
        [ -f "$F" ] || continue
        printf '\n===== FILE: %s =====\n' "$F"
        cat "$F"
      done
    }
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
    if ! DIFF="$(git --no-pager diff "$TARGET" 2>&1)"; then
      echo "cannot read the range '$TARGET':" >&2
      printf '%s\n' "$DIFF" >&2
      exit 2
    fi
    if [ -z "$DIFF" ]; then
      echo "git diff $TARGET is EMPTY — there is nothing to review." >&2
      echo "A review of an empty diff is the findings-free transcript this" >&2
      echo "script exists to stop. Check the range." >&2
      exit 2
    fi
    build_bundle() {
      printf '\n===== git log %s =====\n' "$TARGET"
      git --no-pager log --format='commit %H%n%an <%ae>%n%n%B' "$TARGET" 2>/dev/null || true
      printf '\n===== git diff %s =====\n' "$TARGET"
      printf '%s\n' "$DIFF"
    }
    ;;
  *) echo "role must be 'spec' or 'code'" >&2; exit 2 ;;
esac

for F in "${FAMILIES[@]}"; do
  if ! family_reads_the_tree "$F"; then BUNDLE="$(build_bundle)"; break; fi
done
BUNDLE_BYTES=0
[ -n "$BUNDLE" ] && BUNDLE_BYTES="$(printf '%s' "$BUNDLE" | wc -c)"

mkdir -p reviews
STAMP="$(date +%Y%m%d-%H%M%S)"
FAIL=0
WROTE=()
OUTCOMES=()
APPROVED=0
ANSWERED=0

for FAMILY in "${FAMILIES[@]}"; do
  mapfile -t CMD < <(family_driver "$FAMILY")
  DRIVER_STR="${CMD[*]}"
  if family_reads_the_tree "$FAMILY"; then
    FULL_PROMPT="$PROMPT"
    CONTEXT_NOTE="none — this reviewer runs \`git diff\` and opens files itself"
    CMD+=(-p "$FULL_PROMPT"); ON_STDIN=0
    INVOKED="$DRIVER_STR -p ..."
  else
    FULL_PROMPT="$PROMPT

You cannot run commands or open files: you are a single completion call. Do
not say you will run anything. Everything you are reviewing is reproduced
below verbatim. Cite by file and line from it.
$BUNDLE"
    CONTEXT_NOTE="$BUNDLE_BYTES bytes inlined (this reviewer has no tools)"
    # `-p -` reads the prompt from stdin. It has to: Linux caps a SINGLE argv
    # entry at MAX_ARG_STRLEN (128 KiB), and a bundled review prompt goes past
    # that on any sizeable diff — a 132 KiB one produced
    # "recruit: Argument list too long" and a reviewer that never saw the
    # change. The failure was at least loud, but a size at which review stops
    # happening is not a size anyone would think to check for.
    CMD+=(-p -); ON_STDIN=1
    INVOKED="$DRIVER_STR -p -  (prompt on stdin, $BUNDLE_BYTES bytes of context)"
  fi

  OUT="reviews/$STAMP-$ROLE-$FAMILY.md"
  WROTE+=("$OUT")
  echo "── $FAMILY reviewing ($ROLE: $TARGET) → $OUT"
  {
    echo "# Cross-family $ROLE review"
    echo
    echo "- **Target:** $TARGET"
    echo "- **Family:** $FAMILY"
    echo "- **Date:** $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "- **Invoked as:** \`$INVOKED\` by tools/review.sh"
    echo "- **Context supplied:** $CONTEXT_NOTE"
    echo
    echo "---"
    echo
  } > "$OUT"
  HDR_BYTES="$(wc -c < "$OUT")"

  if [ "$ON_STDIN" -eq 1 ]; then
    printf '%s' "$FULL_PROMPT" | "${CMD[@]}" >> "$OUT" 2>&1 && RC=0 || RC=$?
  else
    "${CMD[@]}" >> "$OUT" 2>&1 && RC=0 || RC=$?
  fi
  if [ "$RC" -ne 0 ]; then
    DETAIL="$(grep -oiE '402|payment required|usage balance|quota|rate.?limit|no OpenRouter key|openrouter error|not found|command not found' "$OUT" | head -1 || true)"
    OUTCOMES+=("$FAMILY|UNREACHABLE|${CMD[0]} exited $RC${DETAIL:+ ($DETAIL)}")
    echo "   $FAMILY → UNREACHABLE (transcript kept: $OUT)" >&2
    FAIL=1
    continue
  fi

  BODY_BYTES=$(( $(wc -c < "$OUT") - HDR_BYTES ))
  VERDICT="$(grep -E '^VERDICT:' "$OUT" | tail -1 || true)"
  case "$VERDICT" in
    "VERDICT: APPROVE")
      ANSWERED=$((ANSWERED+1)); APPROVED=$((APPROVED+1))
      OUTCOMES+=("$FAMILY|APPROVE|$BODY_BYTES bytes")
      echo "   $FAMILY → APPROVE" ;;
    VERDICT:*OBJECT*)
      ANSWERED=$((ANSWERED+1)); FAIL=1
      OUTCOMES+=("$FAMILY|OBJECT|${VERDICT#VERDICT: OBJECT}")
      echo "   $FAMILY → $VERDICT" ;;
    *)
      FAIL=1
      OUTCOMES+=("$FAMILY|NO-VERDICT|CLI exited 0 but returned $BODY_BYTES bytes and no VERDICT: line")
      echo "   $FAMILY → NO VERDICT LINE — treated as not approved" >&2 ;;
  esac
done

# ── Outcome, with unreachable told apart from objecting ──────────────────────
echo
echo "── outcome ($ANSWERED of ${#FAMILIES[@]} families returned a verdict; $APPROVED approved)"
for O in "${OUTCOMES[@]}"; do
  printf '   %-8s %-12s %s\n' "${O%%|*}" "$(F="${O#*|}"; echo "${F%%|*}")" "${O##*|}"
done
case " ${OUTCOMES[*]} " in
  *"|UNREACHABLE|"*)
    echo
    echo "   AT LEAST ONE FAMILY COULD NOT ANSWER. That is not an objection and it"
    echo "   is not a review: nobody of that family looked at this target. Do not"
    echo "   read this run as breadth you did not get. tools/families.sh reports"
    echo "   the standing breadth (DEBT D-104)." ;;
esac

# ── The transcripts, and the fact that nothing here committed them ───────────
echo
echo "── transcripts written (this script commits NOTHING)"
UNTRACKED=""
for F in "${WROTE[@]}"; do
  if git ls-files --error-unmatch "$F" >/dev/null 2>&1; then
    printf '   %s  (tracked)\n' "$F"
  else
    printf '   %s  UNTRACKED\n' "$F"; UNTRACKED="yes"
  fi
done
if [ -n "$UNTRACKED" ]; then
  echo "   Those files are UNTRACKED. A transcript a clean checkout cannot see is"
  echo "   not the public record P6 asks for, and citing one by path in DIGEST or"
  echo "   a Reviewed-By trailer makes a gate look met that nothing can verify"
  echo "   (job 0043 swept up 24 of these). Stage them yourself:"
  echo "     git add ${WROTE[*]}"
fi

echo
if [ "$FAIL" -eq 0 ]; then
  echo "ALL FAMILIES APPROVE — cite transcripts in the commit, e.g.:"
  for I in "${!FAMILIES[@]}"; do
    echo "Reviewed-By: ${FAMILIES[$I]} ${WROTE[$I]}"
  done
else
  echo "REVIEW NOT PASSED — read the transcripts in reviews/, address cited"
  echo "objections (uncited ones are discarded per CHARTER §3), and rerun."
fi
exit "$FAIL"
