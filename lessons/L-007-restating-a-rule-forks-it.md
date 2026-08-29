# L-007 · Restating a rule forks it

**2026-07-30 → 2026-08-01**

## What happened

The charter kept every rule in two places: normative prose, and a machine-readable
companion. The companion's own header said the prose governs on conflict and the
config is a bug.

They drifted repeatedly, **within single editing sessions**:

- A version number said `0.2-draft` in the prose and `0.1-draft` in the config.
- The prose said trust floors expired eighteen months from the first commit; a
  different part of the same document said eighteen months from ratification — a
  six-month discrepancy in a rule specifically written to be unmovable.
- The prose said "model lineages"; the config said `model_families`. Two names,
  one concept, in a document whose entire subject is counting them correctly.
- A specification restated the charter's merge requirements and then fell behind
  when the charter changed — presenting an incomplete gate as complete.

Every instance was found by review, not by the author, who had written both sides
minutes apart.

## What it cost

Roughly one finding per review round, across every round. Individually trivial;
collectively they were the single most common defect class in the project.

The specification case was the dangerous one: it listed six merge criteria and
read as exhaustive while omitting the charter's own gate entirely. A reader would
have concluded the requirements were met when they were not.

## It applies to derived facts, not only to rules — 2026-08-29

The original evidence was all normative: version numbers, thresholds, merge
criteria. Two instances on the same day showed the same failure with plain
**counts**, which are restatements of whatever they count:

- A website page said *"Seven lessons, each one paid for."* There were nine. It
  had been wrong since before that day's additions, so nobody caught it while it
  was merely one out.
- The product README said the suite was *"36 acceptance cases + 12 unit + 80
  service"*. Acceptance was still 36. Unit was 19. Service was **246** — out by
  a factor of three, in a line nobody had read closely in months.

Neither was a rule. Both were facts whose truth lived in another directory, with
nothing tying the two together. That is L-007 exactly, and the remedy was the
one below: **do not restate; point at the thing**.

Both were fixed by **deleting the number rather than correcting it**, which is
the part worth copying. Updating "seven" to "nine" buys accuracy until the next
lesson lands and then silently resumes lying. Both replacements also say what
the text used to claim and why the claim is gone, so the correction is legible
instead of the document quietly becoming right and waiting to be wrong again.

A count in prose is a cache with no invalidation. If a command or a directory
listing can produce it, that is the canonical source, and prose should send the
reader there.

## What to do instead

**Reference, do not restate.** Where a document depends on a rule that lives
elsewhere, link to it and say the rule applies in full. Do not copy it in, even
partially, even "for readability" — a partial copy is the worst case, because it
looks complete.

Where two representations genuinely must exist — prose for humans, config for
machines — state which governs, and make agreement a test that fails the build
rather than a convention that holds until someone is in a hurry.

## Signals

- The same number, date, or threshold appearing in two files
- A summary of another document's requirements presented as a checklist
- "For convenience, the rules are repeated here"
- Two terms for one concept, used in different files
- **Any count in prose** — of tests, lessons, families, entries — whose subject
  lives in another file or directory
- A number that has to be edited when something *else* is added
