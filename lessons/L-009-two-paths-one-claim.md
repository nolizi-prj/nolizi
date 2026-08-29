# L-009 · A claim about a two-path system is over-scoped by default

**2026-08-29**

## What happened

Pumasi Booking has two execution paths: a self-hosted Node build, and the
Cloudflare Workers build that actually serves the deployment. In a single day
**three documents, by three different sessions, each described a property of one
path in language that claimed both.**

The clearest was `SUBPROCESSORS.md`, under the heading *"Enforced, not merely
written down"*: the service *"refuses to send mail through a host that does not
appear in `subprocessors.ts`."* True of the Node build. The Workers build sends
through the Gmail API and never constructs the SMTP transport that check guards.
A correct qualification existed — fifteen lines below, after a table.

The other two: a README describing the container-and-Node deploy with no
occurrence of Cloudflare, Workers, SQLite or D1 while the deployment ran all
four; and a product page repeating the SMTP claim, written by the session that
had just reported the first instance, *in a message about the pattern*.

None was caught by its author. Each was caught by someone checking an adjacent
claim for an unrelated reason.

## What it cost

Nothing yet — all three were caught before anyone relied on them, which is why
this is a lesson and not an incident. What it would have cost is legible: the
subprocessor text told a reader that production had a runtime guard against
sending personal data to an undisclosed party. It does not. Someone auditing that
control would have read the first paragraph, found it sufficient, and stopped.

It is not carelessness. Every author knew about both paths — two of the three
files disclosed the second path elsewhere. **The natural sentence about a system
is the unqualified one**, and the qualification feels like pedantry while writing
and like the whole point while reading.

## What to do instead

**Name the path, or name the weaker control** — *"on the self-hosted build…"*, or
*"what controls the deployed path is which transport the build constructs: a code
change visible in review, not a runtime guard."* Language that borrows the
stronger path's credit is the failure.

**The scope must arrive with the claim.** A qualification placed after the
supporting table is not a qualification; it is a second claim contradicting the
first, and readers stop at the first.

**Check the neighbours.** Every instance was found by someone verifying a
*different* claim in the same document — adjacent sentences were written in the
same sitting under the same assumption.

**Do not assume the second path is the weaker one.** The same review asked whether
SQLite weakened the no-double-booking guarantee. It does not: the Workers build
enforces it with triggers raising `ABORT` inside the database, atomic with the
write, which is what the spec requires. State the mechanism for each path;
"SQLite is the weaker option" would have been the same error pointed the other way.

## Signals

- A capability sentence with no clause naming which build
- A document with no occurrence of the deployment's platform, database or entry point
- A qualification appearing *after* the table or example that supports the claim
- "The service does X" where two things can be the service
- An enforcement claim whose call site exists in one entry point only
