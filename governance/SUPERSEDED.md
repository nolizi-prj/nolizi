# Superseded governance documents

Removed from the working tree on 2026-08-29; **kept permanently in git**, which is
what makes a charter that replaces itself auditable (whitepaper principle 6). They
were carried as live files as well, which is a second copy of what version control
already holds — [L-007](../lessons/L-007-restating-a-rule-forks-it.md).

Retrieve any of them:

    git show 911568b:governance/archive/CHARTER-v0.1-draft.md

| Document | What it was | Why superseded |
|---|---|---|
| `CHARTER-v0.1-draft.md` (+ `.yaml`) | The first charter, 850 lines: trust ladder, five risk zones, seven bodies, phases, emergency states. | **It could not run.** The first rung required vouches from identities at a rung nobody could reach, so nothing could merge at any zone — including documentation. This is [L-001](../lessons/L-001-governance-ahead-of-evidence.md). |
| `CHARTER-v0.2-draft.md` | v0.1 plus a genesis provision. | Never adopted. It patched the deadlock instead of removing its cause, and its §16.1 let founder powers extend themselves. |
| `CHARTER-v0.3-draft.md` (+ `.yaml`) | The rewrite that deleted the machinery. | Superseded by the current charter, which inverted the steward from gate to veto. |
| `AGENT-ORG-v0.1-draft.md` | 599 lines of agent **offices** — Scout, Curator, Specifier, Builder, Adversary, Verifier. | No offices and no rungs exist. Its evidence survives: the MAST analysis (arXiv:2503.13657) is what argues for cross-family review. The analysis was right; the org chart built on it was heavier than the evidence supported. |
| `DEBT-pre-v0.3.md` | The debt register under v0.1. | Entries carried forward, voided, or closed in the current `DEBT.md`, each with its reason. |
| `gp/GP-0001-phase-s0.md` | A phase proposal, **withdrawn 2026-08-01, never ratified**. | Phases are listed in Part 8 as deliberately absent. |

Nothing here is in force.
