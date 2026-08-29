# L-002 · Different model families catch different errors

**2026-07-30 → 2026-08-01**

## What happened

Work authored by one model (Claude) was reviewed by two others (Gemini via `agy`,
Grok). Across the session the non-authoring models found, in the author's work:

- A false claim about the project's own charter — that a model-family floor had
  been met — asserted confidently, and wrong.
- A contradiction making three booking clauses jointly unsatisfiable: replay
  returns the original result, cancellation releases the interval, and a third
  party then books it. No implementation could honour all three.
- An acceptance case whose assertion could pass without ever exercising the
  clause it named.
- A governance clause that let founder powers extend themselves — **twice**, in
  two different drafts, written by the same author who had just been corrected.
- A "frozen definitions" clause that froze terms which were never defined.
- A date contradiction between two parts of the same document.

Every one was a **reasoning error, not a slip**. Each was confidently stated and
internally consistent. None would have been caught by proofreading.

## What it cost

Nothing — that is the point. All six were caught before anything was applied.
The cost was paid in review rounds, roughly three per artifact, and the same
artifacts would otherwise have shipped wrong.

## What to do instead

Never let one model be the only check on its own reasoning. The whitepaper's
principle 3 — *"different models make different mistakes"* — is not a slogan; it
is the only control that repeatedly worked here.

Concretely: the reviewer must be a different model family from the author, and
where three families are available, the reviewer of the plan should not also be
the reviewer of the execution. A same-family reviewer shares the author's blind
spots precisely because it shares the author's way of being wrong.

Instruct the adversary to **refute**, not to check. Rounds prompted with "verify
this" returned approvals; rounds prompted with "attack this, default to refuted
if uncertain" returned the findings above.

## Signals

- A review that agrees quickly and in the author's own vocabulary
- The author explaining why the objection is unnecessary rather than testing it
- One model reviewing both a design and its implementation
