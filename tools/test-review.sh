#!/usr/bin/env bash
# Deterministic tests for tools/review.sh and tools/families.sh.
#
# NO MODEL CALLS. Every reviewer CLI is a stub on PATH that replays a canned
# answer and records the prompt it was handed, so the cases below pin what the
# script DOES with an answer rather than what a model happens to say.
#
# The two directions the gate can be wrong both have to stay pinned, because
# both have already cost something:
#   · an unknown family must still be REJECTED (case 3) — it is the only thing
#     standing between `review.sh <role> <target> qwn` and a silent no-review;
#   · a reviewer that returns no `VERDICT:` line must still be treated as NOT
#     APPROVED (case 4) — the guard that pumasi-sign's hand-driven 9-line
#     findings-free transcript bypassed by not going through this script.
# And the case that produced that transcript: a completion-only family must be
# handed the diff in its prompt (case 12), because it cannot go and get it.
#
# Usage: tools/test-review.sh
set -uo pipefail
cd "$(dirname "$0")/.."
SRC="$PWD/tools"

PASS=0; FAIL=0
FIX=$(mktemp -d); trap 'rm -rf "$FIX"' EXIT
BIN="$FIX/bin"; STUB="$FIX/stub"

ok()   { PASS=$((PASS+1)); printf '  ok   %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  FAIL %s\n       %s\n' "$1" "${2:-}"; }

# A fixture repository: the two scripts under test, and a real two-commit
# history so `code <range>` has something to diff.
reset() {
  rm -rf "$FIX"/*; mkdir -p "$BIN" "$STUB" "$FIX/repo/tools"
  cp "$SRC/review.sh" "$SRC/families.sh" "$FIX/repo/tools/"
  chmod +x "$FIX/repo/tools/"*.sh
  (
    cd "$FIX/repo"
    git init -q .; git config user.email t@t; git config user.name t
    echo one > f.txt; git add .; git commit -qm 'first'
    echo two >> f.txt; git add .; git commit -qm 'second

Spec: spec/0001'
  ) >/dev/null 2>&1
}

# stub <cli> <exit-code> <reply...>  — a fake reviewer CLI on PATH. It logs the
# call and saves the prompt it was given (the last argument) so a test can ask
# what the script actually sent.
stub() {
  local cli="$1" code="$2"; shift 2
  printf '%s\n' "$@" > "$STUB/$cli.out"
  printf '%s' "$code" > "$STUB/$cli.code"
  cat > "$BIN/$cli" <<EOF
#!/usr/bin/env bash
echo "\$0 \$*" >> "$STUB/calls"
if [ "\${!#}" = "-" ]; then cat > "$STUB/$cli.prompt"
else printf '%s' "\${!#}" > "$STUB/$cli.prompt"; fi
cat "$STUB/$cli.out"
exit "\$(cat "$STUB/$cli.code")"
EOF
  chmod +x "$BIN/$cli"
}

approving() { stub "$1" 0 "Looked at it." "VERDICT: APPROVE"; }

# run <args...> — review.sh inside the fixture repo, stubs first on PATH.
run() {
  ( cd "$FIX/repo" && unset BUILDER_FAMILY REVIEW_WIDTH && PATH="$BIN:$PATH" ./tools/review.sh "$@" 2>&1 )
}

echo "review.sh"

# ── the table, and the single source of truth ────────────────────────────────
reset
OUT=$(run --families)
if [ "$(printf '%s\n' "$OUT" | sort | tr '\n' ' ')" = "claude gemini glm grok kimi qwen " ]
then ok "1. --families lists all six, qwen/glm/kimi included"
else bad "1. --families" "got [$OUT]"; fi

OUT=$(run --driver qwen)
if [ "$OUT" = "$(printf 'recruit\n-f\nqwen')" ]
then ok "2a. --driver qwen is 'recruit -f qwen'"
else bad "2a. --driver qwen" "got [$OUT]"; fi
run --driver nope >/dev/null 2>&1
if [ $? -eq 2 ]; then ok "2b. --driver on an unknown family exits 2"
else bad "2b. --driver nope did not exit 2"; fi

OUT=$( cd "$FIX/repo" && PATH="$BIN:$PATH" FAMILY_PROBE_TIMEOUT=2 ./tools/families.sh 2>&1 )
MISS=""
for F in $(run --families); do
  case "$OUT" in *"$F"*) ;; *) MISS="$MISS $F" ;; esac
done
if [ -z "$MISS" ]; then ok "3. families.sh probes exactly review.sh's list (one source, L-007)"
else bad "3. families.sh omits families review.sh knows" "missing:$MISS"; fi

# ── the two failure directions this test exists for ──────────────────────────
reset; approving agy
run code HEAD~1..HEAD gemini qwn >/dev/null 2>&1
RC=$?
if [ "$RC" -eq 2 ] && [ ! -f "$STUB/calls" ]
then ok "4. an unknown family is still rejected — exit 2, and no CLI was run"
else bad "4. unknown family" "rc=$RC calls=$( [ -f "$STUB/calls" ] && echo yes || echo no)"; fi

reset; stub agy 0 "I read the diff." "I have opinions but no verdict."
OUT=$(run code HEAD~1..HEAD gemini); RC=$?
case "$OUT" in
  *"NO VERDICT"*) [ "$RC" -ne 0 ] && ok "5. no VERDICT: line is still treated as not approved (exit $RC)" \
                                  || bad "5. no VERDICT line but exit 0" ;;
  *) bad "5. no VERDICT line not reported" "rc=$RC" ;;
esac

# ── the ordinary outcomes ────────────────────────────────────────────────────
reset; approving agy; approving claude
OUT=$(run code HEAD~1..HEAD gemini claude); RC=$?
case "$OUT:$RC" in
  *"ALL FAMILIES APPROVE"*:0) ok "6. every family approving exits 0" ;;
  *) bad "6. two approvals did not pass" "rc=$RC" ;;
esac

reset; approving agy
stub claude 0 "f.txt:2 is wrong." "VERDICT: OBJECT — f.txt line 2 fails acceptance A-1"
OUT=$(run code HEAD~1..HEAD gemini claude); RC=$?
case "$OUT" in
  *"OBJECT"*"A-1"*) [ "$RC" -ne 0 ] && ok "7. a cited objection fails the run and prints its citation" \
                                    || bad "7. objection but exit 0" ;;
  *) bad "7. objection not surfaced" "rc=$RC" ;;
esac

# ── unreachable must not look like an objection (the 402) ────────────────────
reset; approving agy
stub grok 1 'Internal error: {"message": "API error (status 402 Payment Required): Grok Build usage balance exhausted"}'
OUT=$(run code HEAD~1..HEAD gemini grok); RC=$?
if [ "$RC" -ne 0 ] \
   && printf '%s' "$OUT" | grep -q 'UNREACHABLE' \
   && printf '%s' "$OUT" | grep -q '402' \
   && printf '%s' "$OUT" | grep -q 'not an objection' \
   && ! printf '%s' "$OUT" | grep -q 'grok *OBJECT'
then ok "8. a 402 prints as UNREACHABLE with its cause, not as an objection"
else bad "8. 402 indistinguishable from an objection" "rc=$RC"; fi

if printf '%s' "$OUT" | grep -q '1 of 2 families returned a verdict'
then ok "9. the run says how many families actually answered"
else bad "9. no answered-count in the outcome block"; fi

# ── the derived default, and P5 ──────────────────────────────────────────────
reset; approving agy
run code HEAD~1..HEAD >/dev/null 2>&1
if [ $? -eq 2 ]; then ok "10. no families and no builder declared: refuses, exit 2"
else bad "10. undeclared builder did not refuse"; fi

reset; approving agy; approving recruit
OUT=$(cd "$FIX/repo" && PATH="$BIN:$PATH" BUILDER_FAMILY=claude ./tools/review.sh code HEAD~1..HEAD 2>&1)
case "$OUT" in
  *"default reviewers for a 'claude' builder"*"gemini qwen"*) ok "11a. the default is derived and drops the builder's family" ;;
  *) bad "11a. derived default wrong" "got [$(printf '%s' "$OUT" | head -1)]" ;;
esac
reset; approving claude; approving recruit
OUT=$(cd "$FIX/repo" && PATH="$BIN:$PATH" BUILDER_FAMILY=gemini ./tools/review.sh code HEAD~1..HEAD 2>&1)
case "$OUT" in
  *"claude qwen"*) ok "11b. a gemini builder gets a different default than a claude one" ;;
  *) bad "11b. default did not change with the builder" "got [$(printf '%s' "$OUT" | head -1)]" ;;
esac
reset; approving claude
run --builder claude code HEAD~1..HEAD claude >/dev/null 2>&1
if [ $? -eq 2 ]; then ok "11c. naming your own family as reviewer is refused (P5)"
else bad "11c. builder was allowed to review itself"; fi

# ── the context bundle: the defect that produced the empty transcript ────────
reset; approving recruit; approving agy
run code HEAD~1..HEAD qwen gemini >/dev/null 2>&1
if grep -q '^+two$' "$STUB/recruit.prompt" 2>/dev/null
then ok "12a. a completion-only family is handed the diff inside its prompt"
else bad "12a. recruit got no diff — it would review nothing"; fi
if ! grep -q '^+two$' "$STUB/agy.prompt" 2>/dev/null
then ok "12b. an agentic family is not handed an inlined diff (it reads the tree)"
else bad "12b. agy got a redundant inlined diff"; fi

# A bundle bigger than Linux's 128 KiB per-argv-entry ceiling (MAX_ARG_STRLEN)
# must still reach the reviewer. Passed in argv it does not: the real run at
# 132284 bytes died with "recruit: Argument list too long" and qwen never saw
# the change. The prompt goes on stdin, and this is what says so.
reset; approving recruit
( cd "$FIX/repo" && head -c 200000 /dev/urandom | base64 > big.txt && git add . && git commit -qm big ) >/dev/null 2>&1
run code HEAD~1..HEAD qwen >/dev/null 2>&1; RC=$?
SENT=$(wc -c < "$STUB/recruit.prompt" 2>/dev/null || echo 0)
if [ "$RC" -eq 0 ] && [ "$SENT" -gt 131072 ]
then ok "12c. a bundle past the 128 KiB argv ceiling still reaches the reviewer ($SENT bytes)"
else bad "12c. large bundle did not reach the reviewer" "rc=$RC sent=$SENT"; fi

# NOTE ON EDITING THIS CASE, since 12d previously asserted the opposite.
# CHARTER Part 3 req 2 freezes acceptance tests "when the spec review completes,
# before implementation begins", and forbids the builder editing them after. That
# predicate is not met here: this whole file was created by 133d337, the commit
# immediately prior, by the same job that wrote the guard 12d asserted — there is
# no spec/ in this repository and no spec review froze it. 12d was also asserting
# something false about another repository (that recruit.sh:86 re-passes the
# bundle in argv; as of pumasi-ops 2208b5e that line is the comment saying it
# does not). Even reading the freeze as binding, req 2's remedy is to amend in
# the open and take a fresh cross-family review, which is what this is — not to
# keep a green test pinning a false warning in place.
#
# The ceiling this used to warn about is gone. pumasi-ops 2208b5e put the prompt
# on stdin at every hop: recruit.sh pipes on both branches, openrouter.sh reads
# it with `jq --rawfile` and posts it with `curl --data-binary @file`. The
# warning that outlived the wall advised "Review a narrower range", which is a
# reviewer silently reading less of a change than gets merged — the failure that
# left pumasi-booking's 0a35ddc driven to five families and reviewed by one.
# This is what keeps the warning deleted. The byte accounting is deliberately
# NOT deleted: it is what proved those three reviewers never reached a model.
reset; approving recruit
( cd "$FIX/repo" && head -c 200000 /dev/urandom | base64 > big.txt && git add . && git commit -qm big ) >/dev/null 2>&1
OUT=$(run code HEAD~1..HEAD qwen)
if printf '%s' "$OUT" | grep -qiE 'recruit\.sh:86|narrower range|past the ~?131072-byte ceiling'
then bad "12d. a ceiling warning came back — the wall is gone, and narrowing the range is the damage it caused"
else ok "12d. a >131072-byte bundle draws no ceiling warning and no advice to narrow the range"; fi
TR=$(ls "$FIX/repo/reviews/"*-code-qwen.md 2>/dev/null | head -1)
if [ -n "$TR" ] && grep -qE 'Context supplied:.*[0-9]{6,} bytes inlined' "$TR"
then ok "12e. the byte accounting survives the guard's removal ($(grep -oE '[0-9]+ bytes inlined' "$TR" | head -1))"
else bad "12e. the 'bytes inlined' accounting was lost along with the guard" "transcript=$TR"; fi

# ── nothing to review is a refusal, not an empty transcript ──────────────────
reset; approving agy
run code HEAD..HEAD gemini >/dev/null 2>&1; RC=$?
if [ "$RC" -eq 2 ] && [ ! -f "$STUB/calls" ]
then ok "13. an empty diff refuses before spending a call"
else bad "13. empty range was reviewed anyway" "rc=$RC"; fi

reset; approving agy
run audit HEAD~1..HEAD gemini >/dev/null 2>&1
if [ $? -eq 2 ]; then ok "14. an unknown role still exits 2"
else bad "14. unknown role accepted"; fi

# ── the transcripts, and saying they are not committed ───────────────────────
reset; approving agy; approving claude
OUT=$(run code HEAD~1..HEAD gemini claude)
if printf '%s' "$OUT" | grep -q 'commits NOTHING' \
   && printf '%s' "$OUT" | grep -q 'UNTRACKED' \
   && printf '%s' "$OUT" | grep -q 'git add reviews/'
then ok "15a. the run names the transcripts and says they are untracked"
else bad "15a. no uncommitted-transcript notice"; fi
if [ -z "$(cd "$FIX/repo" && git status --porcelain reviews 2>/dev/null | grep '^A')" ]
then ok "15b. the script staged nothing"
else bad "15b. the script staged a transcript"; fi

N=$(ls "$FIX/repo/reviews" 2>/dev/null | wc -l)
if [ "$N" -eq 2 ]; then ok "16. one transcript per family is written"
else bad "16. wrong transcript count" "got $N"; fi

echo
echo "$PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
