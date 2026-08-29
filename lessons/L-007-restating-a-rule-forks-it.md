# L-007 · Restating a rule forks it

**2026-07-30 → 2026-08-29**

## What happened

The charter kept every rule in two places: normative prose, and a machine-readable
companion whose own header said the prose governs and the config is a bug. They
drifted repeatedly, **within single editing sessions** — a version reading
`0.2-draft` in one and `0.1-draft` in the other; trust floors expiring eighteen
months from the first commit in one place and from ratification in another; "model
lineages" against `model_families`, in a document whose whole subject is counting
them correctly.

It is not only rules. **Any restated fact forks the same way.** A page said *"Seven
lessons"* when there were nine. A README said the suite was *"36 acceptance + 12
unit + 80 service"* when unit was 19 and service was 246 — out by a factor of
three, in a line nobody had read closely in months.

Every instance was found by review, never by the author, who had written both sides
minutes apart.

## What it cost

Roughly one finding per review round, across every round. Individually trivial;
collectively the most common defect class in the project.

The dangerous case was a specification that restated the merge requirements and
then fell behind. It listed six criteria and read as exhaustive while omitting the
charter's own gate — a reader would have concluded the requirements were met when
they were not.

## What to do instead

**Reference, do not restate.** Link to the rule and say it applies in full. Do not
copy it in, even partially, even "for readability" — a partial copy is the worst
case, because it looks complete.

**Delete a stale number rather than correcting it.** Updating "seven" to "nine"
buys accuracy until the next one lands, then silently resumes lying. A count in
prose is a cache with no invalidation: if a command or a directory listing can
produce it, that is the source, and prose should send the reader there.

**Verify against the artefact, never against another document's claim about it.**
A session reported its figures as *"checked against the README, matching
verbatim."* They did match. The README was wrong. Agreement between two documents
is the *symptom* of a fork, and it gets offered as evidence against one. This bites
hardest on whatever looks most authoritative — a README is a restatement of the
code, and checking against it feels like checking.

## Signals

- The same number, date, or threshold appearing in two files
- Any count in prose whose subject lives in another file or directory — and one in
  *undated* prose especially, since a dateline is itself an invalidation mechanism
- A summary of another document's requirements presented as a checklist
- "For convenience, the rules are repeated here"
- Two terms for one concept, used in different files
- "Checked against `<other document>`, matches verbatim" offered as verification
