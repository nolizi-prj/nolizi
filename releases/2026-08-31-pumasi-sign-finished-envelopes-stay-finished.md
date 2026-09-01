# A finished envelope in Pumasi Sign now stays finished

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in [`DECISIONS.md`](../DECISIONS.md) (Q-031).
`pumasi-sign/roadmap/STAGE.md` says `alpha`, so per CHARTER Part 0 the work
proceeds now and a steward veto reverts it.**

**Read the last section first if you are waiting for this to reach you.**
It is merged and it is **not deployed**. `sign.pumasi.ai` still runs the
behaviour described below under *What was wrong*.

## What was wrong

Three different requests could reach into an envelope that had already ended —
signed and completed, refused by a signer, or voided by its sender — and change
it anyway. Each one also wrote a fresh line into the envelope's audit trail, as
though the change were a legitimate part of its history.

Concretely, on the Cloudflare Worker that answers `sign.pumasi.ai`
(`service/src/durable.ts`, read at `0c043f8`):

- **Voiding.** `POST /api/submissions/{id}/cancel` tested nothing at all before
  writing. A **completed** agreement could be flipped to `cancelled` after the
  fact, and so could one that had already been declined or already voided. A
  second `cancelled` event was appended each time.
- **Signing after completion.** The signing route refused a `cancelled` or
  `declined` envelope but **not** a `completed` one. That is not the harmless
  half of the bug it might look like: the outstanding-signer count deliberately
  ignores CC recipients, so a person who was only *copied* on an envelope is
  still marked pending when it completes — and could then sign it, running the
  completion machinery a second time and stamping a **second** "completed" line
  into the history of an agreement that had already finished once. Where the
  envelope carries a PDF, that path re-stamps the executed document.
- **Refusing.** `POST /api/sign/{id}/decline` carried none of the signing
  route's three checks. A signer who had **already signed** could then refuse;
  a **completed** envelope flipped to `declined`; and the sender was emailed to
  say their executed agreement had been refused. The same envelope, in the same
  breath, would refuse a signature and accept a refusal.

## Who could this have hurt, and how badly

**Narrower than it first sounds, and still worth fixing.** Two limits, both
checked rather than assumed:

1. **No screen in the product offers any of it.** The *Void envelope* button is
   drawn only for an envelope that is still pending or still a draft
   (`frontend/src/views/EnvelopeDetailView.vue:676`). The refusal route has no
   caller in the shipped app at all — the word appears only in status labels.
   All three paths were reachable only by addressing the API directly, which
   means a signed-in employee or a token-holding recipient doing so on purpose,
   not an ordinary misclick.
2. **The signed document itself was never at risk from the voiding path.**
   `VALUE.md`'s **C1** promises a cryptographic record of what was signed. The
   stamped PDF and its audit certificate live in R2 and a status overwrite does
   not touch them. **C1 was not falsified**, and this note does not claim it
   was.

What the overwrite damaged is narrower and real: **the stored envelope and its
audit log came to say `cancelled` about an agreement whose own certificate says
`completed`.** One product, two records, one claim — which is
[L-009](../lessons/L-009-two-paths-one-claim.md)'s shape at the scale of a
single row. Anyone reconciling the service against the certificates it issued
would have found them disagreeing, with nothing in the trail recording that
anything had been destroyed.

## What changed

Each of the three now refuses, and **writes nothing and audits nothing** when
it does.

| Route | Answer on a finished envelope |
| :--- | :--- |
| Void (`cancel`) | **409** — *This envelope is already closed* |
| Sign (`complete`) | **410** — *This envelope is no longer active* |
| Refuse (`decline`) | **409** — *This envelope is no longer active* |

Refusing (`decline`) also gained the two checks the signing route already had:
a signer who has already signed is told *Already signed* (409), and one whose
turn has not come is told *Earlier signers have not finished yet* (409).

**No capability was removed from anyone.** Every one of these was already
impossible through the product's own screens; the service now agrees with a
rule the app has been enforcing all along. If a sender ever does need to undo an
executed agreement — signed in error, superseded — that is a **new** capability
with its own button, its own word in the audit trail and its own design. It is
deliberately not this.

**One inconsistency, disclosed rather than smoothed over.** A finished envelope
answers a signature attempt with `410` and a refusal attempt with `409`. Both
mean refused and neither writes anything, but they are not the same number.
`410` is what the signing route already returned and changing it would alter an
answer the app reads today; `409` is what the voiding and refusing routes'
neighbours return.

## What was tested

- Three frozen acceptance cases — `A-404`, `A-406`, `A-407` — previously
  asserted that these guards were **absent**, on purpose, as a record of the
  defect. They were amended in the same commit as the repair, in the open, and
  each now asserts the guard instead. **Every refusing path is proved to write
  nothing by reading the envelope back out of the store and comparing its audit
  trail against a snapshot taken immediately before the attempt** — not by
  reading the code.
- The unamended cases, run against the repaired worker, fail exactly three and
  only three: measured `# pass 18 · # fail 3`.
- Root `npm test` across both trees, before and after, run by the builder:
  `Test Files 6 passed (6)`, `Tests 85 passed (85)`, `# pass 21 · # fail 0`,
  `assert-service-suite-ran: 21 passing, 0 failing, from 4 compiled` — identical
  either side. The merge gate printed `GATE: PASS`.

## What is still unknown, and what this does not claim

- **The re-stamping half is reasoned, not demonstrated.** The tests prove the
  second completion did not happen — one `completed` event, an unchanged
  completion timestamp — but no test in this suite gives an envelope a real PDF,
  so nothing here exercises the R2 write that a second completion would have
  performed.
- **This widens no coverage.** `service/` remains thinly tested; the gate prints
  the same 21 assertions it printed before. That is a separately ranked item and
  this release does not touch it.
- **Deadlines still do nothing.** The product tells senders an envelope can
  expire and the worker still never expires one. Also separately ranked, also
  untouched here.
- **The process shortcut, named.** The charter freezes acceptance tests before
  implementation and requires a fresh cross-family spec review before a builder
  amends them. That review was **taken after** the implementation rather than
  before. Per CHARTER Part 0 the product is at `alpha`, so this is a recorded
  pass-through rather than a stall; it is written into `spec/0006` §S4-review
  and into the merge commit. At `launched` it would have stopped the run.

## It has not reached you

**Merged, not deployed.** Serving `sign.pumasi.ai` means `wrangler deploy` from
`service/`, and **who may carry a merged build to users is
[`DECISIONS.md`](../DECISIONS.md) Q-012, which is open** and explicitly outside
CHARTER Part 0's proceed-on-default rule. **Q-028** records what that costs and
is also open; **Q-018** records that the Railway path still described in
`pumasi-sign/CLAUDE.md`'s Deployment section is the wrong tree. No seat on this
job deployed anything, proposed a deployer, or set a date.

So: as of publication, the three transitions above still behave the old way for
anyone using the live service. This note describes a branch.
