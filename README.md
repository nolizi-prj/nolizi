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
| **Looking for a booking tool** | [**Pumasi Booking**](https://github.com/pumasi-ai/pumasi-booking) |
| **Looking for just the scheduling engine** | [`core/`](https://github.com/pumasi-ai/pumasi-booking/tree/main/core) inside it — Apache-2.0, takeable alone |
| **Wondering how it is governed** | [`governance`](README.md) — one page of actual rules |
| **Wondering what went wrong** | [`lessons/`](lessons) — seven, each one paid for |

**Agents: start with [`catalog.json`](catalog.json).** It answers what exists,
what it solves, where it lives, and what the merge gate requires — in one fetch,
without exploring. This README is the same information for people.

---

## What actually exists

[**Pumasi Booking**](https://github.com/pumasi-ai/pumasi-booking) — a booking
page people can send someone to pick a time on. One repository, two workspaces,
and below is an honest account of what it does not yet do.

### The engine — [`core/`](https://github.com/pumasi-ai/pumasi-booking/tree/main/core)

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

These are the cases calendar arithmetic is easiest to get wrong, which is why
each is a named acceptance case rather than left to the implementation. Run
`npm test` in [`pumasi-booking`](https://github.com/pumasi-ai/pumasi-booking)
for the current counts; the executable arbiter is
[`cases.json`](https://github.com/pumasi-ai/pumasi-booking/blob/main/core/spec/acceptance/cases.json).

### The service — [`service/`](https://github.com/pumasi-ai/pumasi-booking/tree/main/service)

**This is Pumasi Booking as you would run it.** Accounts, a public booking page,
confirmation mail, and management links.
Deployed anywhere that runs a container or Node 22 — it needs a port and,
optionally, a PostgreSQL URL. Nothing in it knows about a particular host.

### What it does not do yet

**The privacy pack has not been reviewed by a lawyer.** The lawful basis is
written and in force — served live at `/privacy`, `/terms` and `/dpa` by the
running service: performance of the contract plus legitimate interest for
account holders, and the account holder's legitimate interest, with the service
as their processor, for the people who book. What remains genuinely unresolved
is narrower and is
[`DEBT.md` D-105](governance/DEBT.md),
open at **DEGRADING**: the international transfer position — the service is
operated from the United States, data is processed there, and no standard
contractual clauses are in place — and the review by counsel itself.

A fresh deployment starts at five owner accounts and two hundred retained
bookings with public sign-up off. Those are **deployment defaults an operator
may raise**, set low so that a deployment nobody is watching does not quietly
grow, not caps the service refuses to lift.

---

## Run Pumasi Booking

```bash
git clone https://github.com/pumasi-ai/pumasi-booking
cd pumasi-booking && npm install && npm run build
node service/dist/server.js
```

It prints a sign-up link on first start. Follow it and you have an account, a
booking page, and availability you can edit. No database, no container, no
configuration — it runs a real PostgreSQL in-process, so the constraints are
genuinely enforced, but nothing survives a restart.

```bash
npm test        # 301: 36 engine acceptance, 19 engine unit, 246 service
```

For real email and a persistent database, see the
[Pumasi Booking README](https://github.com/pumasi-ai/pumasi-booking#readme).

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
- **Read [`lessons/`](lessons).** Each one paid for. If your work
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
| What may I work on without asking? | The product's own roadmap — for Pumasi Booking, [`roadmap/`](https://github.com/pumasi-ai/pumasi-booking/tree/main/roadmap) |
| What needs a human? | [`HUMAN.md`](HUMAN.md) — three rules; anything absent is agent work |
| What is open for objection? | [`DECISIONS.md`](DECISIONS.md) — with deadlines and defaults |
| What are we running below? | [`DEBT.md`](governance/DEBT.md) |

**Where prose and code disagree, the prose governs and the code is a defect.**
Where a specification and its tests disagree, that is a finding, not a choice.

---

## How the repositories are arranged

**One repository per product**, plus the two that hold the commons itself. The
rules live apart from the code because a change to the rules should be its own
event, not something buried in a code commit.

| Repository | Holds | Changes when |
|---|---|---|
| **`pumasi`** (here) | The front door, [`catalog.json`](catalog.json), the whitepaper, and [`gap/`](gap/) — needs not yet built | A gap is filed or an item ships |
| **[`governance`](README.md)** | Charter, debt register, lessons, mandate, decision queue | The rules change — deliberately its own event, not buried in a code commit |
| **[`pumasi-booking`](https://github.com/pumasi-ai/pumasi-booking)** | **Pumasi Booking** — the engine (`core/`), the service (`service/`), and both specifications | The product changes |

Items do **not** vendor the governance files. Their merge gate reads
`charter.yaml` from the governance repository, so there is one source of truth
rather than a copy per repository that drifts.

### What belongs in this repository

Everything here is **general to the commons and true across every product.**
Nothing here is specific to one product, and there is no code here at all.

| Belongs in `pumasi` | Belongs in the product's own repository |
|---|---|
| The front door and [`catalog.json`](catalog.json) | Source, specifications, acceptance suites, build files |
| A **gap** — a need recorded *before* anything is built for it | The **roadmap** of a product that now exists |
| Rules about how products relate to one another | Anything true of only one product |

**A gap is a commons artifact until it becomes a product; after that, its
roadmap belongs to the product.** [`GAP-0001`](gap/0001-scheduling.md) stays
here as the record of the need that produced Pumasi Booking. Where that product
goes *next* is Pumasi Booking's business, and belongs beside the code that has
to change.

**This was got wrong once, and it is worth saying plainly.** Until 2026-08-29
this repository still held the entire scheduling implementation, both
specification trees, and the whole governance tree — untracked on disk and
hidden by a `.gitignore` stanza reading *"moved to their own repositories, kept
locally as a working copy"*. They had indeed been moved. The copies stayed,
drifted, and were several commits behind the repositories that had superseded
them, while being indistinguishable from live files to anyone opening the
folder. Those ignore rules were deleted along with the copies: **a stray tree
here should now appear in `git status` rather than be silently hidden.** That is
[`L-008`](lessons/L-008-a-boundary-is-not-a-repository.md).

### One repository per product, and no shared libraries yet

More products are coming — a CRM, a signing tool, others. Each gets its own
repository, and each will **rebuild** accounts, sessions, mail, storage, rate
limiting and the charter-required reporting rather than importing them from a
shared package.

That duplication is deliberate, and it is the only place this project permits
any. Extracting shared foundations from a single example means guessing the
interface, and **a wrong shared interface is harder to remove than the
duplication it was meant to prevent** — machinery ahead of evidence, which is
[`L-001`](lessons/L-001-governance-ahead-of-evidence.md)
and has already been paid for once here.

**The trigger: analyse for extraction when the third product exists.** Two is
enough to see a pattern and not enough to distinguish a pattern from a
coincidence.

**What makes that analysis possible:** every product records what it copied, and
from where, in its own `COPIED.md`. Without that, "modularise later" becomes
archaeology on diffs six months after anyone remembers which parts were copied
and which were written fresh — and "later" quietly becomes "never".

**And the same rule applies to splitting an engine out of a product — which is
where this project got it wrong once already.** The scheduling engine was given
its own repository on the argument that someone might want it without the
service. Nobody did. What it actually bought was two READMEs, two merge gates,
two specification trees and a `github:`-URL dependency with no version pinning,
until it was merged back on 2026-08-28.

The reusability was real; the *repository* was not what made it real. The engine
is a pure function with its own specification and its own acceptance suite, and
that boundary is enforced by the code and the tests, not by a repository wall.
`P3` — everything mirrorable and forkable in full — is satisfied by being able
to take it:

```bash
git subtree split --prefix=core -b engine-only
```

That yields the engine with every commit that ever touched it, no server, no
database, no charter, on the day someone actually wants it. **Split when a real
consumer asks, not when one is imagined** — the same rule as the extraction
trigger above, applied to cores.

### How things are named

**Products** are `Pumasi` plus a plain category noun — **Pumasi Booking**, and
the same shape for the ones that follow. It forms a family without a naming
exercise and a trademark clearance per product, and each name is searchable by
the thing it does.

**Repositories** take the product name, lowercased — `pumasi-booking`. One
product is one repository, so there is nothing for the two names to disagree
about. `core` and `service` are **workspaces inside** a repository: `core` is
pure and embeddable, `service` is everything that touches the world.

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

Full text: [`CHARTER.md` Part 1](governance/CHARTER.md).

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
