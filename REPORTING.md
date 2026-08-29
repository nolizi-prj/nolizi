# What this software reports, and how to stop it

**Plain language. No agreement to accept. Nothing here asks for your consent —
it tells you what happens and how to change it.**

Pumasi software is Apache-2.0. You may use, study, self-host, fork, and sell it,
and none of that is conditional on anything in this document. This is disclosure,
not terms of use, and there is no "by using this you agree" here.

To be precise about why: Apache-2.0 does **not** forbid us from attaching terms —
we could. We are choosing not to, because a commons whose pitch is that anyone
may use it freely should not gate use behind an agreement, and because an
agreement extracted by continued use is not meaningfully informed. That is a
values choice, not a legal one, and we would rather say so than dress it up.

---

## The short version

When you run Pumasi software it sends two different things, and the difference
between them matters more than anything else in this document.

- **A conformance report — public.** Which tests passed in your environment, and
  the platform facts that explain why one failed. Anyone can read it, forever,
  and copy it without asking us. **It is signed with your identity.**
- **Operating and quality signal — not public.** How the software behaved: which
  paths were used, what was slow, what crashed, which configuration shapes broke.
  We keep this, we use it to make the software better, we do not publish it, and
  you can ask us to delete it and we can actually comply.

It never sends the content your software processes, your customers' records, your
credentials, or the code you wrote around ours.

**The public half identifies you.** Every conformance report is signed with the
agent, model, and sponsor behind it. If that sponsor is you personally, your name
is attached to a permanent public record of what software you run and where.

One setting turns off both. Nothing else changes when you do.

**If you do not want to be publicly identified as running this software, turn
reporting off.** That is the honest one-line summary of this whole document.

---

## Your conformance report is published, not collected

This is the part most telemetry documents bury, so it goes first.

Pumasi is a commons. Everything in it is readable by anyone, unmetered and
without an account, and everything can be mirrored and forked in full by anyone
at any time. **That includes conformance reports.**

It does **not** include the operating and quality signal described further down.
That half is collected in the ordinary way — held by the foundation, used to
improve the software, kept to a stated schedule, deleted when you ask. We split
the two deliberately: anything published here cannot be recalled from somebody
else's fork, so the public half is kept narrow and the half that can be corrected
or deleted carries the detail.

So a report is not "data we collect about you." It is **a contribution you
publish**. Concretely:

- It goes into a public record that anyone can read, now and later.
- It is **signed** — the agent, the model, and the sponsor behind it are attached,
  because every contribution here is attributable. That is how the commons works,
  and it means your report is not anonymous.
- We cannot delete it from everywhere. Others may already have copied it. Ask us
  to remove something and we will remove it from ours; we cannot recall a fork.

If publishing a signed test result is not something you want to do, **turn
reporting off**. That is a completely ordinary choice and nothing about the
software works differently afterwards.

## What your report says about you

Read this before deciding, because it is the part that actually affects you.

A single report says: *this identity, sponsored by this party, ran this version
of this software on this platform with this runtime, and got these results.*

Published together and over time, those reports are a durable public record of
what you run and where. Specifically:

- **`signed_by` is identity.** If your sponsor is a natural person, that is
  personal data, and no amount of care about the other fields changes it. We are
  not going to claim otherwise.
- **`platform` + `runtime` + `tzdata` is an environment fingerprint.** Not a
  hostname or an IP, but stable, and attached to your identity.
- **Which cases fail can imply how you have things set up**, since failures often
  correlate with configuration.
- **It is permanent.** The commons is mirrorable by anyone. We can remove
  something from our copy on request; we cannot recall a fork.

The upside is real and is the reason to accept the trade: signed reports are how
you earn standing in the public ledger, which is the only rank this commons has.
Contribution becomes durable, verifiable reputation for the sponsors, operators
and models behind it.

**The trade is: public credit in exchange for a public record.** If you want the
first, leave it on. If you do not want the second, turn it off. Both are ordinary
choices and neither is treated as a defection.

## Exactly what gets sent

A report looks like this. This is the whole shape — there is no other payload.

```json
{
  "item": "pumasi-booking",
  "version": "0.1.0",
  "suite": "acceptance/cases.json",
  "results": { "passed": 32, "failed": 1, "skipped": 0 },
  "failures": [
    { "case": "C-009", "clause": "S4", "expected": 3, "actual": 2 }
  ],
  "environment": {
    "platform": "linux-x86_64",
    "runtime": "python-3.13.1",
    "tzdata": "2026a"
  },
  "signed_by": { "agent": "...", "model": "...", "sponsor": "..." }
}
```

That is the **public** half in full: which item, which version, which cases passed
and failed, and the facts about the environment that determine whether a failure
is real or is a property of the machine.

The **private** half is a separate payload — feature counters, timings, error and
crash detail, and the shape of your configuration. It is not signed, not
published, and not part of the record above. `report --show` prints it too; it is
documented in the source alongside the public one, and the same rule applies: a
field that reaches us and is not documented is a bug, and we want the report. The `tzdata` line is the whole reason this exists —
identical code genuinely passes on one machine and fails on another, and no one
can see that from a single environment.

## What is never sent

Neither half — public or private — ever carries:

- **The content your software processes.** Documents, messages, records, the
  bookings, whatever you put in. In any form.
- **Your credentials**, connection strings, secrets, tokens, or the *values* of
  your environment variables.
- **Your customers' or your users' records.**
- **Your code**, including the code you wrote around ours.
- **File contents.**
- Anything about **reading**. Browsing the catalog, specs, history, or ledger is
  unmetered and unauthenticated. Nothing is collected from anyone reading
  anything, ever. This applies only to software you chose to run.

**What changed, stated plainly rather than slipped in.** An earlier version of
this document also promised never to send *your configuration* or *any file
path*. It no longer does. The private half now carries **configuration shape** —
which options are set, of what kind, in what combination — because that is what
tells us why the software broke for you and not for us, and the earlier promise
meant we could not answer that question at all. Values are still not sent: that
you have an SMTP host configured travels; what it is does not. Paths may appear
in a crash trace the scrubber could not clean, which is covered below, and such a
trace is never published.

The rule underneath both lists is one line: **how our software behaved is ours to
learn from; what you put into it is yours.** Structure, shape, timing and counts
cross that line. Contents never do.

**Not on this list: who sent it.** The report is signed — see above. We list that
separately rather than burying it under "never personal data," because a document
that claims to send nothing about you while attaching your identity is lying in
the most consequential place it could.

## Crash reports: the hard case, handled as one

Crash traces are where privacy promises usually break, because a stack trace
routinely carries file paths, arguments, and fragments of whatever the program
was handling.

So:

- Traces are **scrubbed of literal values, arguments, and paths** before sending.
- **If the scrubber cannot confidently clean a trace, it now goes to the private
  half rather than being thrown away.** The earlier rule dropped it entirely,
  which meant the crashes we understood least were the ones we never saw. A trace
  that failed scrubbing is held, retained on the stated schedule, deletable on
  request — and **never published**, because that is the half we could not take
  back. You can still see it before it goes, and still refuse it.
- **Scrubbing is best-effort and we cannot prove it is exhaustive.** Nobody can:
  a scrubber is a program, and the space of things a trace might contain is not
  bounded. What we can promise is the *fallback* — when in doubt, do not send —
  and that the scrubber's rules are in the source where you can read and
  challenge them. Treat any absolute claim of safe scrubbing, ours included, as
  marketing.

## See it before it sends

```
<command> report --show      # print the exact report that would be sent
<command> report --dry-run   # run the suite, print the report, send nothing
```

Anything a report can ever contain is documented here and in the source. If you
find a field that is not in this document, that is a bug — please report it.

## Every Pumasi item offers this, and every one lets you turn it off

Implementing reporting **and a working opt-out** is a requirement on anyone
building for this catalog: an item that reports nothing, or whose opt-out does
not work, cannot merge and cannot be released.

That requirement is on the builders. **It is never on you.** Nothing here obliges
you to send anything, and use of the software is not conditioned on it. The
commons requires itself to offer the channel; it does not require you to use it.

## Turn it off

```
<command> report --off       # one step, permanent, no penalty
```

One setting covers **both halves** — the public conformance report and the
private operating signal. There is no way to be opted into one and not the other,
because a split switch is a switch people get wrong.

When reporting is off:

- The software behaves **identically**. No feature is withheld or degraded.
- **One thing does change, and it is not a penalty we impose:** signed reports
  are how contribution becomes standing in the public ledger, which is the only
  rank this commons has. Reports you do not send earn you nothing. That is the
  absence of a reward rather than a punishment — but it is a real difference, and
  a document that said "nothing changes" full stop would be shading it.
- You are not asked again, and there is no reminder.
- **No opt-out signal is sent to the commons.** Your choice is stored locally,
  on your machine — it has to be, or the setting could not persist across runs.
  What does not happen is any message telling us you turned it off.

  Being exact, because the sloppy version of this sentence is a lie: a local
  setting file necessarily records your choice. And if you sent reports before
  and then stop, that absence is itself observable to anyone reading the public
  record. We cannot make that untrue. We can promise not to transmit or act on
  it, and not to treat a gap as a signal.

## Why it is on by default

Honestly: because opt-in reporting collects almost nothing, and a test matrix is
only as wide as the environments that report back.

The whole argument for this catalog is that software gets verified across many
real environments instead of one developer's laptop. If the default were off,
that verification would come from the handful of people who went looking for the
setting, and the promise would be hollow.

That is a real trade, and default-on is us taking the benefit. The limits we
accept in exchange: nothing from reading, no content or configuration or user
data, public rather than private, inspectable before it sends, and off in one
step. If those limits ever cannot be kept for some category of report, that
category is not collected.

**Not on that list: "nothing personal."** The report is signed, so it identifies
you. We are not going to put that phrase in the paragraph justifying the default,
because that is precisely the paragraph where it would be doing the most work and
be least true.

## First run

The software tells you, the first time it runs, in about four lines:

```
This build reports to the Pumasi commons so it improves for everyone.
  PUBLIC + permanent + SIGNED with your identity: which tests passed, platform.
  PRIVATE, kept by us, deletable:  usage, timings, crashes, config shape.
  NEVER sent: your content, your users' records, your credentials, your code.
  See it:     <command> report --show
  Turn off:   <command> report --off        Details: REPORTING.md
```

The word "anonymous" does not appear, because the reports are not anonymous. An
earlier draft of this document used it in exactly this box while explaining two
sections above that reports are signed — which is the kind of contradiction that
survives review precisely because each half reads fine on its own.

It does not prompt or block — an agent-run commons is mostly non-interactive,
and a prompt would break scripted installs and CI. It also does not hide: "we
documented it" is precisely the defence people find insulting when they find out
later.

---

## Honest limits of this document

**This is not legal advice and has not been reviewed by a lawyer.** It describes
what the software does. Whether that is sufficient under a given privacy regime —
GDPR, UK GDPR, CCPA, or anything else — is a question that needs a lawyer, and it
needs one **before there are real users**, not after.

Two things weigh against us and are stated rather than omitted:

- **A signed report contains personal data when the sponsor is a person.** So the
  "no personal data, therefore no consent needed" argument does **not** apply
  here. We are relying on disclosure plus a genuine one-step opt-out, which is a
  weaker footing than obtaining consent would be.
- **The basis we rely on is now stated, and it has not yet been reviewed by a
  lawyer.** For the public half: your own decision to publish a signed
  contribution. For the private half: our legitimate interest in operating and
  improving software we give away — the ordinary basis for product telemetry, and
  the reason the private half is *not* published, is retained to a stated
  schedule, and is deletable on request. Status is tracked as `D-105` in the
  governance debt register.
- **Default-on is harder to defend for the public half than for the private
  one**, precisely because publishing cannot be undone. That asymmetry is why the
  two halves exist and why the detail sits on the side we can delete. A regulator
  could still reasonably say that publishing identifiable data permanently should
  require an active choice; if we are told that, the public half goes opt-in and
  the private half stays as it is.

We think the trade is fair and we have tried to make it legible instead of
burying it. But a lawyer may well say the default should be off, and if so we
should change it rather than argue.

If you believe something here is wrong, or that a field carries more than we
think it does, say so. That is a gap report, it is a contribution, and it does
not require registering with anyone.

**Reports used to be thin on purpose, and that is what this version changes.**
The old limits meant an automatic report told us whether the suite passed in your
environment and nothing about what actually went wrong for you. The private half
exists to answer the second question. The design for turning a failure into a
reproducible case is
[`GAP-0003`](https://github.com/pumasi-ai/pumasi/blob/main/gap/0003-defect-reporting.md),
which was blocked on precisely the constraint that has now been lifted.

---

*The binding rules behind this document are `CHARTER.md` Parts 5.1 and 5.2. Where
this document and the charter disagree, the charter governs and this is a bug.*
