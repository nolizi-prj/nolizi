# L-009 · A claim about a two-path system is over-scoped by default

**2026-08-29**

## What happened

Pumasi Booking has two execution paths: a self-hosted Node build and the
Cloudflare Workers build that actually serves the hosted deployment. In a single
day, **three different documents, written by three different sessions, each
described a property of one path in language that claimed both.** None was
caught by its author. Each was caught by someone checking an adjacent claim for
an unrelated reason.

- **`SUBPROCESSORS.md`**, under the heading *"Enforced, not merely written
  down"*: "the service **refuses to send mail** through a host that does not
  appear in `subprocessors.ts`." True of the Node build. The Workers build sends
  through the Gmail API and never constructs the SMTP transport that check
  guards. A correct qualification existed — fifteen lines below, after a table.
- **`README.md`**, *Deploying*: "Anywhere that runs a container or Node 22",
  with a Databases table listing only PGlite and PostgreSQL. Zero occurrences of
  Cloudflare, Workers, SQLite or D1 anywhere in the file, while the deployment
  ran all four. The document described the build nobody runs and omitted the one
  that ships.
- **A product page on the project's website**: "Mail is SMTP, not a provider SDK
  — every provider speaks it, so the choice is a URL and switching costs
  nothing." Written by the session that had just reported the first instance,
  while writing about the shape.

## What it cost

Nothing yet, because all three were caught before anyone relied on them. That is
the only reason this is a lesson rather than an incident.

What it would have cost is legible from the near miss. The subprocessor case
told a reader that production had a runtime guard against sending personal data
to an undisclosed party. It does not. Someone auditing that control would have
read the first paragraph, found it sufficient, and stopped — which is what a
first paragraph is for.

## Why it is not carelessness

Every author knew about both paths. The Workers build was disclosed elsewhere in
the same file in two of the three cases. The failure is not ignorance of the
second path; it is that **the natural sentence about a system is the unqualified
one**, and the qualification feels like pedantry at the moment of writing and
like the whole point at the moment of reading.

The third instance is the proof: it was written by the person who had just
identified the pattern, in a message about the pattern.

## What to do instead

**Name the path, or name the weaker control.** A claim about a system with more
than one execution path is over-scoped until it does one of these:

- scope it — *"on the self-hosted build, the service refuses…"*; or
- state the weaker path's actual control, in words that do not borrow the
  stronger one's credit — *"what controls the deployed path is which transport
  the build constructs: a code change, visible in review, not a runtime guard."*

**The scope must arrive with the claim.** A correct qualification placed after
the supporting table is not a qualification; it is a second claim that
contradicts the first, and readers stop at the first. This is the difference
between the `SUBPROCESSORS.md` text before and after the fix — the same facts,
in a different order, with opposite effect.

**Check the neighbours.** All three were found by someone verifying a
*different* claim in the same document. When one over-scoped claim is found, the
adjacent sentences are the highest-yield place to look next, because they were
written in the same sitting under the same assumption.

## Not every difference is a defect

The same review asked whether SQLite weakened the no-double-booking guarantee,
since the README credited PostgreSQL's `EXCLUDE USING gist`. It does not: the
Workers build enforces it with `BEFORE INSERT` and `BEFORE UPDATE` triggers
raising `ABORT`, inside the database and atomic with the write, which is what
`SPEC-0002` P1 actually requires. Two paths, two mechanisms, one guarantee.

So the fix is to **state the mechanism for each path**, not to assume the second
path is degraded. Writing "SQLite is the weaker option" would have been the same
error pointed the other way — an unchecked claim about a path the author had not
read.

## Signals

- A capability sentence with no subject clause naming which build
- A document with no occurrence of the deployment's platform, database, or entry
  point
- A qualification that appears *after* the table, list, or example supporting the
  unqualified claim
- "The service does X" where two things can be the service
- An enforcement claim whose call site exists in one entry point only
