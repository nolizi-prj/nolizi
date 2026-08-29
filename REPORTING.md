# What this software will report, and how to stop it

> ## Nothing implements this yet
>
> **No catalog item sends anything.** `PUMASI_REPORTING` is read into
> configuration and then read by nothing; there is no egress code, no payload,
> no first-run notice. This document is the design and the commitments, not a
> description of live behaviour. Tracked as
> [`DEBT.md` D-108](governance/DEBT.md).
>
> The booking service's own privacy page says the same thing in its own words.
> When the mechanism ships, this page changes and that one does with it.

**Plain language. No agreement to accept.** Pumasi software is Apache-2.0. You
may use, study, self-host, fork and sell it, and none of that is conditional on
anything here. This is disclosure, not terms of use. Apache-2.0 would let us
attach terms; we choose not to, because a commons whose pitch is free use should
not gate use behind an agreement.

## Two halves, and the difference matters most

| | Carries | Where it goes |
|---|---|---|
| **Published** | Which tests passed in your environment, and the platform facts that explain a failure. **Signed** with the agent, model and sponsor. | The public record: readable and mirrorable by anyone, permanently. |
| **Held** | How the software behaved — feature usage, timings, error and crash detail, configuration shape. | Kept by the foundation to a stated retention period, deletable on request. **Not published, never signed.** |

The split is the whole design. Anything published cannot be recalled from a fork
(P3), so the public half stays narrow; the half that can be corrected and deleted
carries the detail.

## The limits, all binding

- **Running only, never reading.** Reading the catalog stays free, unmetered and
  unauthenticated (P2). Nothing is collected from anyone reading code, specs,
  history or the ledger.
- **Never the user's own material.** Not the content you process, your
  credentials or connection strings, your customers' records, or the code you
  wrote around ours. *How our software behaved* is ours to learn from; *what you
  put into it* is yours. Structure, shape, timing and counts cross that line;
  contents never do.
- **The published half identifies you.** Reports are signed (P9), so the commons
  cannot claim to publish nothing personal. It publishes an identity attached to
  an environment fingerprint, permanently. The obligation that creates is plain
  disclosure and a real one-step opt-out — not a claim of anonymity the mechanism
  contradicts.
- **Crash traces are scrubbed of values, arguments and paths, then sent.** A trace
  the scrubber cannot clean goes to the held half, where it can be deleted —
  never to the published half. Scrubbing is best-effort and nobody can prove it
  exhaustive; the promise is the fallback, and the rules are in the source.
- **Inspectable before it leaves**, in either half, and documented in the
  repository.
- **Opt out in one step, covering both halves.** The software behaves identically
  afterwards. What differs is that unsent reports earn no ledger standing (P9) —
  the absence of a reward, not a penalty. **No opt-out signal is transmitted**;
  the choice is held locally, and a gap in someone's history is never treated as
  a signal about them.
- **Never sold, and never an input to ranking** (P6). Held data improves the
  software; that is the whole of its use, and it is the condition on which
  collecting it is defensible.

If a limit cannot be kept for some category of report, that category is not
collected.

## Why it will be on by default

Opt-in reporting collects almost nothing, and a test matrix is only as wide as the
environments that report back. That is the trade, and default-on is the commons
taking the benefit. The limits above are what it accepts in exchange.

## Honest limits of this document

**Not legal advice, and not reviewed by a lawyer.** A signed report contains
personal data when the sponsor is a person, so the "no personal data, therefore no
consent needed" argument does not apply. We rely on disclosure plus a genuine
one-step opt-out, which is weaker footing than consent. Status is tracked as
`D-105`. Default-on is harder to defend for the published half than the held one,
precisely because publishing cannot be undone — if a regulator says so, the
published half goes opt-in and the held half stays as it is.

---

*The binding rules behind this document are `CHARTER.md` Parts 5.1 and 5.2. Where
this document and the charter disagree, the charter governs and this is a bug.*
