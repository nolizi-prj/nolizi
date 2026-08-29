# L-008 · A boundary is not a repository

**2026-08-25 → 2026-08-28**

## What happened

The scheduling engine was given its own repository, separate from the service, on
the reasoning that `P3` makes everything forkable **in full** and someone wanting
the engine should not have to take a charter with it.

The engine really is separable — a pure function, no clock, no I/O, its own
specification and acceptance suite. That was not the error. The error was
concluding that a **separate repository** was what made it so, and paying for that
before anyone had asked. Nobody ever did: zero external consumers, zero forks,
never published to a registry.

Three days later the steward asked why one product needed two repositories, and
there was no answer that survived contact with the rule this project had already
accepted for shared libraries.

## What it cost

Two READMEs, two merge gates, two specification trees, two build setups, and a
`github:`-URL dependency with **no version pinning** — the service fetched
whatever was on the engine's default branch, so the two could not be released or
rolled back together.

It also hid defects, because a split repository has surfaces nobody exercises. The
`Dockerfile` and `railway.json` still referenced the pre-split layout and had been
broken since the day it happened, because no container build was ever run. A spec
linked the engine at a path that existed in neither repository. Nine cross-repo
links stayed as relative paths from the old monorepo — every one resolved on a
local checkout and 404-ed on GitHub, which is the worst kind of broken link:
invisible precisely to the people who could fix it.

None of it was found by review. It was found by merging the repositories back and
walking the result with a path checker.

## What to do instead

**Split when a real consumer asks, not when one is imagined.** The project had
already adopted this for shared libraries — analyse for extraction once three
products exist. The engine was held to a looser standard because the split felt
architecturally tidy.

Keep the boundary where it is actually enforced: in the code. Purity, a
specification and an acceptance suite are what make a component takeable; a
repository wall adds no guarantee those three do not already give. `P3` is
satisfied by being **able** to take it — for a subtree that is one
`git subtree split`, and it yields the full history.

## Signals

- A repository split justified by a consumer who does not exist yet
- A dependency expressed as a `github:` URL, or any dependency with no version
- Two repositories that must always be changed together in the same commit
- A "reusable" component with no reusers, unpublished, after weeks
- Deployment or CI files referencing a layout the repository no longer has — a
  reliable sign that nothing exercises the path they describe

## Related

[`L-001`](L-001-governance-ahead-of-evidence.md) — the same failure applied to
code layout rather than governance.
