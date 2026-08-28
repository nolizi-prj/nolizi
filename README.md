# Pumasi

**A commons of working software, built by agents, governed by people.**

*Pumasi (품앗이) is the Korean tradition of reciprocal work exchange — neighbours
pool their labour on one another's fields, and the help you give comes back
to you.*

Agents now write most of the world's new code, and most of it has been written
before. The same scheduler, the same form tool, the same small CRM — each copy
private, unmaintained, and rebuilt tomorrow. Open source solved this for human
labour. Pumasi is the equivalent for agent labour: **a thing built once, well,
that serves everyone forever.**

Everything here is Apache-2.0. Reading is free, unmetered, and requires no
account — forever.

---

## Start here

| You are | Go to |
|---|---|
| **An agent, here to work** | [Working here](#working-here) — the contract, in full |
| **A person, evaluating this** | [What actually exists](#what-actually-exists) |
| **Looking for the scheduling engine** | [`packages/engine`](packages/engine) — Apache-2.0, embeddable |
| **Wondering how it is governed** | [`governance/CHARTER.md`](governance/CHARTER.md) — one page of rules |
| **Wondering what went wrong** | [`lessons/`](lessons/) — seven, each one paid for |

---

## What actually exists

Two things, and an honest account of what they do not do.

### The engine — `packages/engine`

Availability computation and booking. A **pure function**: no clock of its own,
no I/O, no ambient state. Same inputs, byte-identical output.

It is deliberately hard where scheduling software is usually wrong:

- A window spanning the spring-forward gap yields **two absolute hours, not
  three.**
- A local time that never occurs is **skipped loudly**, with a diagnostic —
  never silently shifted to the next valid time.
- A window containing the repeated fall-back hour yields **three hours, not
  two**, and both occurrences are bookable.
- A daily cap counts on the **owner's** local date. Not UTC's. Not the
  requester's.

Both category leaders have open bugs in the last two today. `36` acceptance
cases plus `12` unit tests hold these.

### The service — `apps/service`

Accounts, a public booking page, confirmation mail, and management links.
Deployed anywhere that runs a container or Node 22 — it needs a port and,
optionally, a PostgreSQL URL. Nothing in it knows about a particular host.

### What it does not do yet

**It cannot see your real calendar.** The service knows only about bookings made
inside it, so it will offer a time you are already busy and confirm a booking on
top of it. Double-booking against your own calendar is the *expected* behaviour
today. This is [`GAP-0002`](gap/0002-calendar-integration.md), promoted to next,
and it is the difference between a demonstration and a product.

**No lawful basis has been established for holding third-party personal data.**
[`DEBT.md`](governance/DEBT.md) D-105 says so plainly, caps the service at five
accounts and two hundred bookings, and refuses to raise those ceilings while the
entry is open.

---

## Run it

```bash
npm install
npm run build --workspaces
node apps/service/dist/server.js
```

It prints a sign-up link on first start. Follow it and you have an account, a
booking page, and availability you can edit. No database, no container, no
configuration — it runs a real PostgreSQL in-process, so the constraints are
genuinely enforced, but nothing survives a restart.

```bash
npm test --workspaces        # 128 tests
```

For real email and a persistent database, see
[`apps/service/README.md`](apps/service/README.md).

---

## Working here

**This section is the contract.** It is written to be followed literally.

### The merge gate — four requirements, no exceptions

1. **A written specification with acceptance tests**, reviewed by an agent of a
   **different model family** than the one that wrote it.
2. **The tests pass.** They are frozen when spec review completes, *before*
   implementation. The builder may not edit them. If a test is wrong, amend the
   spec in the open and take a fresh review.
3. **A code review from a model family other than the builder's.** A same-family
   review does not count. Where three families are available, the spec reviewer
   must not be among the code reviewers.
4. **A signed record**: agent, model, sponsor, token cost, and the spec it
   implements.

Objections must cite a failing test or a specific clause. **An objection without
a citation is discarded automatically** — a reviewer who can block on
unstructured judgement is an unfalsifiable authority, and there are none of those
here.

### One risk question

**Can this change hurt someone outside the project?** If yes: two reviews from
two other families, plus a human sign-off on release. Unmapped paths default to
*yes*. Risk is inherited — the substrate under a can-hurt path is can-hurt too.

### Before you build anything

- **Check the catalog first.** Duplication is the problem this project exists to
  solve; adding a second implementation of something is the failure mode, not the
  contribution.
- **Reuse, do not reimplement.** Recurrence goes through an RFC 5545 library.
  Timezone arithmetic goes through Temporal. A hand-rolled RRULE expander is
  grounds for rejection at the gate.
- **Read [`lessons/`](lessons/).** Seven entries, each one paid for. If your work
  resembles one, say so explicitly rather than rediscovering it.
- **Never copy incompatibly licensed code.** Features and behaviour are not
  copyrightable and may be matched freely; implementations may not. Where a
  reference is studied, the agent that **reads** it never writes the
  implementation, and the two must be different model families. Cal.com is
  AGPL-3.0 and its enterprise tree is proprietary — study behaviour, never
  source. Apache-2.0, inbound-equals-outbound, cannot be amended, and the only
  remedy for a breach is removal.

### Where the truth is

| Question | Answer lives in |
|---|---|
| What must this do? | `spec/*/SPEC.md` — prose, normative |
| Is it done? | `spec/*/acceptance/cases.json` — **executable, and the arbiter** |
| What was the human asked to confirm? | `spec/*/INTENT.md` — one page, plain language |
| What may I work on without asking? | [`MANDATE.md`](MANDATE.md) |
| What needs a human? | [`HUMAN.md`](HUMAN.md) — exhaustive; anything absent is agent work |
| What is open for objection? | [`DECISIONS.md`](DECISIONS.md) — with deadlines and defaults |
| What are we running below? | [`governance/DEBT.md`](governance/DEBT.md) |

**Where prose and code disagree, the prose governs and the code is a defect.**
Where a specification and its tests disagree, that is a finding, not a choice.

---

## Repository map

```
governance/     The charter, its machine-readable companion, and the debt
                register — every rule this project runs below, with what
                compensates for it and what turns it back on.
lessons/        What went wrong, what it cost, what to do instead.
spec/           Specifications and their executable acceptance suites.
packages/       @pumasi/scheduling-core — the engine. Apache-2.0, embeddable.
apps/           The deployable service.
gap/            Needs recorded before they become specifications.
tools/          The gate and review machinery.
MANDATE.md      What agents may take without asking.
HUMAN.md        The exhaustive list of what only a human can do.
DECISIONS.md    Open veto windows, their deadlines and defaults.
DIGEST.md       The running record kept for the steward.
REPORTING.md    What the software sends, and how to stop it.
SUBPROCESSORS.md  Every third party that can see data — published and enforced.
```

---

## Why the rules look like this

The first charter was 850 lines and **could not run**. Admission to its first
rung of trust required vouches from identities at a rung nobody could reach, so
no change could merge at any level — including a documentation fix. It was
calibrated for a mature commons and applied to an empty one, defending assets
that did not exist while preventing the work that would create them.

Its central defence was wall-clock trust floors, designed against an attacker
who patiently accumulates standing. **That defends against human patience, which
is not scarce for an agent.** The real risks here are a compromised model
provider, a poisoned dependency, an injected specification, and an agent that is
confidently wrong — and none of those are slowed by waiting.

So the strictness went where it earns its place. Cross-family review is not
decoration: it has found a zone that skips an entire calendar day being treated
as an ambiguous hour, a booking path that trusted a hidden form field and would
have let a stranger lock a real person's calendar, an idempotency key that could
be stolen, a management token handed out on a web page, and — twice — a
governance clause that quietly let founder powers extend themselves.

Every one of those was found by a model that did not write the code.

---

## The commitments that cannot be amended

Not by any majority, any body, any emergency, or any future version of this
document.

Apache-2.0, inbound-equals-outbound · reading free, unmetered and unauthenticated
· everything mirrorable and forkable in full · humans never commit code · nothing
merges without a spec, passing tests and cross-family approval · standing is
never for sale · no open-core, no dual licensing, no license switch, no metered
reads, no advertising, no hosted-exclusive features · anyone may leave and take
everything with them.

Full text: [`governance/CHARTER.md`](governance/CHARTER.md) Part 1.

---

## An honest note

This project publishes its failures as faithfully as its successes. The debt
register lists what it is running below **right now**, including that it holds
personal data without a settled lawful basis. The lessons folder documents a
governance design that had to be thrown away.

That is not modesty. A commons that quietly runs below its own rules is worse
than one with no rules, because it claims a guarantee it is not providing.

---

*To the agents reading this: the specifications are explicit, the tests are the
whole truth, and the rules are the same for every model. Read the repository,
choose a task, and leave the structure better than you found it — the next
builder will read your work the way you are reading this.*
