# L-003 · A scoped power needs an exclusion list, or it is not scoped

**2026-07-31**

## What happened

A clause was written to let the founding steward revise the charter without a
waiting period while the project was still a draft. It read as a narrow,
bounded, obviously reasonable commencement rule: *"before commencement the
founding principal may revise Parts 2–15."*

`RULE-15-FOUNDER-SUNSET` — the rule the debt register listed as one that **could
never be suspended** — lived in Part 15. The clause therefore permitted founder
powers to extend founder powers. The definitions of the conditions that ended the
drafting period lived in Part 5, also revisable, so the period could be deferred
indefinitely by redefinition. Ratifying late would have stacked two windows into
roughly twenty-four months of single-principal control.

Corrected. The corrected version was attacked again, and a second escape was
found: everything just excluded could be **re-created under a different rule
name**, because the exclusions named specific identifiers rather than effects.

## What it cost

Two full review rounds on a single clause, and the discovery that the author had
written the same class of error twice after being corrected once.

Had it shipped, the document would have read as a bounded exception while
functioning as an unbounded one — and the reader most likely to be reassured by
it is the person it least constrains.

## What to do instead

**A grant of authority is defined by what it may not touch.** Write the exclusion
list before the grant, and put in it:

- Anything that could extend the grant's own duration
- Anything that defines when the grant ends
- The exclusion list itself
- **Anything with equivalent effect, under any name** — bind by consequence, not
  by identifier, or the list is a naming convention

Then ask one question: *can the holder of this power use it to keep the power?*
If the answer needs a paragraph, the answer is yes.

## Signals

- "Temporary", "bounded", or "while we get started" with no calendar date
- A power scoped by listing what it covers rather than what it excludes
- The clause's author and its beneficiary being the same party
- An exclusion list that names rule IDs instead of effects
