# L-008 · A boundary is not a repository

**2026-08-25 → 2026-08-28**

## What happened

The scheduling engine was given its own repository, `scheduling-core`, separate
from `scheduling-service`. The reasoning was recorded in the front-door README:
`P3` says everything is mirrorable and forkable **in full**, and someone who
wants the engine should not have to take a charter with it.

The engine really is separable — a pure function, no clock, no I/O, its own
specification, its own acceptance suite. That was not the error. The error was
concluding that a **separate repository** was what made it so, and paying for
that conclusion before anyone had asked for the engine alone.

Nobody ever did. In the time the split existed there were zero external
consumers, zero forks of the engine, and it was never published to a registry.

Three days later the steward asked the obvious question — *why do we need two
repositories for one product?* — and there was no answer that survived contact
with the argument this project had already accepted for shared libraries.

## What it cost

Two READMEs, two merge gates, two specification trees, two build setups, and a
`github:`-URL dependency with **no version pinning** — the service fetched
whatever was on the engine's default branch, so the two could not be released or
rolled back together.

It also hid defects, because a split repository has surfaces nobody exercises:

- `Dockerfile` and `railway.json` still referenced `packages/engine` and
  `apps/service`, the layout from *before* the split. Both had been broken since
  the day it happened. No container build was ever run.
- SPEC-0002 linked the engine's specification at `../0001-scheduling-core`, a
  path that existed in neither repository afterwards.
- Nine cross-repository links into `gap/` and `lessons/` stayed as relative
  paths from the old monorepo. Every one resolved on a local checkout and
  404-ed on GitHub, which is the worst version of a broken link — invisible
  exactly to the people who could fix it.

None of this was found by review. It was found by merging the repositories back
and having a path checker walk the result.

## What to do instead

**Split when a real consumer asks, not when one is imagined.** This is the same
rule the project had already adopted for shared libraries — analyse for
extraction once three products exist — and the engine was simply held to a
looser standard because the split felt architecturally tidy.

Keep the boundary where it is actually enforced: in the code. Purity, a
specification, and an acceptance suite are what make a component takeable. A
repository wall adds no guarantee that those three do not already provide.

`P3` is satisfied by being **able** to take it, not by keeping a repository open
in advance. For a subtree, that is one command, and it yields the full history:

```bash
git subtree split --prefix=core -b engine-only
```

## Signals

- A repository split justified by a consumer who does not exist yet
- A dependency expressed as a `github:` URL, or any dependency with no version
- Two repositories that must always be changed together in the same commit
- A "reusable" component with no reusers, unpublished, after weeks
- Deployment or CI files referencing a layout the repository no longer has —
  a reliable sign that nothing exercises the path they describe

## Related

[`L-001`](L-001-governance-ahead-of-evidence.md) — machinery ahead of evidence.
This is the same failure applied to code layout rather than governance: the
structure was built for a situation that had been imagined rather than met.
