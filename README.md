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
| **An agent, here to work** | [`catalog.json`](catalog.json) first — then [Working here](#working-here) |
| **A person, evaluating this** | [What actually exists](#what-actually-exists) |
| **Looking for a booking tool** | **Pumasi Booking** — [`scheduling-service`](https://github.com/pumasi-ai/scheduling-service) |
| **Looking for just the scheduling engine** | [`scheduling-core`](https://github.com/pumasi-ai/scheduling-core) — Apache-2.0, embeddable |
| **Wondering how it is governed** | [`governance`](https://github.com/pumasi-ai/governance) — one page of actual rules |
| **Wondering what went wrong** | [`lessons/`](https://github.com/pumasi-ai/governance/tree/main/lessons) — seven, each one paid for |

**Agents: start with [`catalog.json`](catalog.json).** It answers what exists,
what it solves, where it lives, and what the merge gate requires — in one fetch,
without exploring. This README is the same information for people.

---

## What actually exists

**Pumasi Booking** — a booking page people can send someone to pick a time on.
It is built from two repositories, and below is an honest account of what it
does not yet do.

*The repositories keep functional names. A repository says what it holds; a
product says what you use. Renaming code to follow branding breaks every clone
and fork for no gain.*

### The engine — [`scheduling-core`](https://github.com/pumasi-ai/scheduling-core)

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

### The service — [`scheduling-service`](https://github.com/pumasi-ai/scheduling-service)

**This is Pumasi Booking as you would run it.** Accounts, a public booking page,
confirmation mail, and management links.
Deployed anywhere that runs a container or Node 22 — it needs a port and,
optionally, a PostgreSQL URL. Nothing in it knows about a particular host.

### What it does not do yet

**It cannot see your real calendar.** The service knows only about bookings made
inside it, so it will offer a time you are already busy and confirm a booking on
top of it. Double-booking against your own calendar is the *expected* behaviour
today. This is [`GAP-0002`](gap/0002-calendar-integration.md), promoted to next,
and it is the difference between a demonstration and a product.

**No lawful basis has been established for holding third-party personal data.**
[`DEBT.md`](https://github.com/pumasi-ai/governance/blob/main/governance/DEBT.md)
D-105 says so plainly, caps the service at five
accounts and two hundred bookings, and refuses to raise those ceilings while the
entry is open.

---

## Run Pumasi Booking

```bash
git clone https://github.com/pumasi-ai/scheduling-service
cd scheduling-service && npm install && npm run build
node dist/server.js
```

It prints a sign-up link on first start. Follow it and you have an account, a
booking page, and availability you can edit. No database, no container, no
configuration — it runs a real PostgreSQL in-process, so the constraints are
genuinely enforced, but nothing survives a restart.

```bash
npm test        # 80 service tests; the engine carries another 48
```

For real email and a persistent database, see the
[service README](https://github.com/pumasi-ai/scheduling-service#readme).

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
- **Read [`lessons/`](https://github.com/pumasi-ai/governance/tree/main/lessons).** Seven entries, each one paid for. If your work
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
| What exists already? | [`catalog.json`](catalog.json) — **check before building anything** |
| What must this do? | `spec/*/SPEC.md` in the item's repo — prose, normative |
| Is it done? | `spec/*/acceptance/cases.json` — **executable, and the arbiter** |
| What was the human asked to confirm? | `spec/*/INTENT.md` — one page, plain language |
| What may I work on without asking? | [`MANDATE.md`](https://github.com/pumasi-ai/governance/blob/main/MANDATE.md) |
| What needs a human? | [`HUMAN.md`](https://github.com/pumasi-ai/governance/blob/main/HUMAN.md) — exhaustive; anything absent is agent work |
| What is open for objection? | [`DECISIONS.md`](https://github.com/pumasi-ai/governance/blob/main/DECISIONS.md) — with deadlines and defaults |
| What are we running below? | [`DEBT.md`](https://github.com/pumasi-ai/governance/blob/main/governance/DEBT.md) |

**Where prose and code disagree, the prose governs and the code is a defect.**
Where a specification and its tests disagree, that is a finding, not a choice.

---

## How the repositories are arranged

One repository per thing that can be forked, versioned or released on its own —
because `P3` says everything is mirrorable and forkable **in full**, and someone
who wants the scheduling engine should not have to take a charter with it.

| Repository | Holds | Changes when |
|---|---|---|
| **`pumasi`** (here) | The front door, [`catalog.json`](catalog.json), the whitepaper, and [`gap/`](gap/) — needs not yet built | A gap is filed or an item ships |
| **[`governance`](https://github.com/pumasi-ai/governance)** | Charter, debt register, lessons, mandate, decision queue | The rules change — deliberately its own event, not buried in a code commit |
| **[`scheduling-core`](https://github.com/pumasi-ai/scheduling-core)** | The engine and its specification — used by Pumasi Booking, forkable without it | The engine changes |
| **[`scheduling-service`](https://github.com/pumasi-ai/scheduling-service)** | **Pumasi Booking** — the service and its specification | The service changes |

Items do **not** vendor the governance files. Their merge gate reads
`charter.yaml` from the governance repository, so there is one source of truth
rather than a copy per repository that drifts.

### One repository per product, and no shared libraries yet

More products are coming — a CRM, a signing tool, others. Each gets its own
repository, and each will **rebuild** accounts, sessions, mail, storage, rate
limiting and the charter-required reporting rather than importing them from a
shared package.

That duplication is deliberate, and it is the only place this project permits
any. Extracting shared foundations from a single example means guessing the
interface, and **a wrong shared interface is harder to remove than the
duplication it was meant to prevent** — machinery ahead of evidence, which is
[`L-001`](https://github.com/pumasi-ai/governance/blob/main/lessons/L-001-governance-ahead-of-evidence.md)
and has already been paid for once here.

**The trigger: analyse for extraction when the third product exists.** Two is
enough to see a pattern and not enough to distinguish a pattern from a
coincidence.

**What makes that analysis possible:** every product records what it copied, and
from where, in its own `COPIED.md`. Without that, "modularise later" becomes
archaeology on diffs six months after anyone remembers which parts were copied
and which were written fresh — and "later" quietly becomes "never".

Splitting an engine out of a product is judged the same way: only where the core
is genuinely reusable alone. The test is whether anyone would fork it *without*
the service. Scheduling earned that; a CRM probably will not.

### How things are named

**Products** are `Pumasi` plus a plain category noun — **Pumasi Booking**, and
the same shape for the ones that follow. It forms a family without a naming
exercise and a trademark clearance per product, and each name is searchable by
the thing it does.

**Repositories** are named for what they contain, never for branding, and are
not renamed when a product is named. `-core` is pure and embeddable; `-service`
is the deployable product.

Rejected for Pumasi Booking, recorded in [`catalog.json`](catalog.json) so it is
not relitigated: `pumasi-cal` (Cal® and Cal.com® are registered marks in this
exact category), `Palendar` (one letter away, same category), and
`pumasi-calendar` — which misdescribes the thing. **This is not a calendar. It
is a booking link that connects to your calendar**, and the distinction is the
whole product.

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

Full text: [`CHARTER.md` Part 1](https://github.com/pumasi-ai/governance/blob/main/governance/CHARTER.md).

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
