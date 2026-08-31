# Pumasi Tunnel stops printing an address that nothing answers

**Published 2026-08-31 · can-hurt release note (CHARTER §2.1, Part 4) · 7-day
veto window in `DECISIONS.md` (Q-020). `roadmap/STAGE.md` says `Alpha`, so per
CHARTER Part 0 the work proceeds now and a steward veto reverts it.**

**Read the last section first if you operate a relay with TLS in front of it.**
There is one flag to set, and if you skip it your users are told `http://`
where `https://` used to be printed.

## What was wrong

Every tunnel this product opened was handed a URL beginning `https://`, and on
the relay that actually runs — `pumasi.link` — nothing has ever listened on
port 443.

Measured live at 15:30 and again at 15:37 UTC on 2026-08-31, not read off the
code:

```
$ curl -s http://pumasi.link/_pumasi/status
... "url":"https://sshsteward.pumasi.link" ...

$ curl https://sshsteward.pumasi.link/
curl: (7) Failed to connect to sshsteward.pumasi.link port 443 — exit 7

pumasi.link:443  → connection refused
pumasi.link:80   → open
```

`Registry.PublicURL` built `"https://" + name + "." + domain` unconditionally.
That one string is the first thing a user of this product reads, on all four
paths at once: the relay puts it in the auth response, the CLI prints it, the
zero-install ssh ingress writes it into the terminal of someone who installed
nothing of ours, and the console at the relay's apex renders it as a clickable
link. Every one of them was wrong, and wrong in the same way, because every one
of them was reading the same untrue constant.

The relay does not terminate TLS. That is deliberate and it stays that way —
an operator may want ACME, a purchased certificate, or none at all on a private
network. What was wrong was that the relay stated a consequence of a choice it
does not make and cannot see.

## What changed

- **The relay is told which scheme it serves, once.** `pumasi-relay` gains
  `-public-scheme`, defaulting to `http` — which is what the binary serves with
  nothing in front of it. An operator who put a TLS terminator in front passes
  `-public-scheme=https` and every address the relay announces says so together.
- **It is decided in one place.** The scheme lives on the registry and is
  applied by `Registry.PublicURL`. Nothing else in the tree puts a scheme in
  front of a tunnel hostname; the CLI's first line, the console's link and the
  ssh banner all read that one string, so they move together or not at all.
  An acceptance case fails if any of them acquires its own.
- **A scheme the relay cannot honour stops it starting.** `-public-scheme=ftp`
  is a refusal at startup with a named error, not a coerced guess. A relay that
  could not be told which scheme it serves must not pick one — picking one is
  the whole of this defect.
- **A test that asserted the untruth was corrected.** `TestRegistryRegisterAndLookup`
  had `https://myapi.pumasi.link` written into it as an expectation since the
  registry was first built. The defect was in the test suite as well as the code,
  which is why the suite never caught it.

## Why this is classed can-hurt

`pumasi-tunnel` has no `RISK_ZONES.yaml`. CHARTER Part 4 says an unmapped path
defaults to **can hurt someone**, and guessing wrong in the safe direction costs
one extra review — so it is classed can-hurt and carries this note and its
window. The cross-family reviewer read the same change as *ordinary* (no money,
credential or personal data is handled). Both readings are recorded rather than
one being quietly picked: the charter's default rule governs, and the substance
of the risk is the flag below, not the data.

## What could hurt someone, and what stands in the way

- **An operator who already terminates TLS and upgrades without reading this.**
  Their relay starts announcing `http://` where `https://` was printed, and
  users may follow a plain-HTTP link to a service that was being served over
  TLS. This is the real cost of the change and it is why the note exists. The
  remedy is one word in the unit file — `-public-scheme=https` — and it is
  stated in the flag's own help text, the package header of `cmd/pumasi-relay`,
  and the last section here. Today the set of affected operators is known and
  is size zero: `pumasi.link` has no terminator, which is the defect.
- **Reading this note as meaning `https://` now works.** It does not. Nothing
  listens on 443 on `pumasi.link` and this release does not change that. See
  below.
- **A scheme value from somewhere other than the operator.** There is one
  source — a command-line flag on the relay process — and it is validated
  against a two-element set at startup. No agent, no visitor, and no request
  header can influence it.
- **The value leaking somewhere it does not belong.** Raw TCP addresses are
  `host:port` and have no scheme; an acceptance case asserts the scheme reaches
  the scheme and nothing else.

## What did *not* change

- **No TLS in the relay.** The seam is exactly where it was. This makes the
  relay honest about the seam; it does not move it.
- **No certificate anywhere.** Putting a wildcard certificate for
  `*.pumasi.link` in front of the relay is `roadmap/BACKLOG.md` item 1 half
  **(b)**, which that file marks *operator action, not a build*, and which
  `DECISIONS.md` **Q-014** governs. Nothing here anticipates it.
- **Not the announce-before-bind race** (`BACKLOG.md` item 2): the relay still
  writes an agent's public TCP address before the listener exists. Separate
  root cause, separate review. It reproduced during this run — see below.
- **Nothing about routing, registration, port allocation, the ssh protocol
  handling, or what the console does with a tunnel once it has one.**

## What was tested

Ten acceptance cases (`spec/0001-public-scheme/acceptance/CASES.md`), frozen at
the spec review before implementation. A defect fix proves itself by failing
first (L-006), so they were run against trees with the change absent:

- **Against `e29dc0e`** — the tree before this work, with only the new cases
  added: both packages fail to build. Red, but only because the API does not
  exist yet, which is weak evidence.
- **Against three mutants of the finished tree**, which is the real evidence:
  restoring `PublicURL`'s hardcoded `https://` turns all three user-facing
  surfaces red with the address they would have printed; removing the startup
  validation turns the refusal case red for every illegal scheme; and giving
  the console its own copy of the scheme — the L-007 drift this is shaped to
  prevent — turns the agreement case red naming both values.

Worth stating precisely: the mutant that restores the hardcoded `https://` does
**not** fail the three-surfaces-agree case, because all three surfaces are then
wrong together. That case exists to catch a future copy, not this defect, and
it is the console mutant that proves it can fail.

Full suite `go test -count=1 ./...`: green — `core`, `mux`, `relay` ok;
`agent`, `cmd/pumasi-relay`, `cmd/pumasi-tunnel` still have no test files, which
is `BACKLOG.md` item 5. Coverage measured this run: core 80.3%, mux 84.0%,
relay 74.7% — the relay figure moves most because the ssh ingress had no test
before this one.

**The flake from `BACKLOG.md` item 2 reproduced, and it is worse than the
record says.** With `-cover`, 1 run in 12 (`TestServerSpeaksFirstOverTCP`).
Without `-cover`, 1 run in 20 (`TestTCPPortReleasedWhenAgentDisconnects`).
Always the same message: `dial tcp 127.0.0.1:34000: connect: connection
refused`. The previous measurement saw 12 of 12 pass without `-cover` and
concluded that coverage instrumentation was what widened the window; twenty
runs say the window is open without it, and that 12 was too small a sample.

Not caused by this change, checked rather than assumed: `e29dc0e` in a
separate worktree fails at the same 1 in 20, on the same test, with the same
message. Nothing here touches the ordering.

Two consequences worth stating plainly. That the failure moves between three
different tests in one file is evidence *for* the announce-before-bind
diagnosis, not against it — they all dial an address the relay handed out
before it bound. And Stage 1's exit gate, recorded as a green `go test ./...`,
was luck-dependent; it would have failed roughly one run in twenty on the
same tree. One gate run during this job hit it, and the gate passed on
re-run at this commit.

Cross-family review: Gemini approved the specification and the code. Grok was
unreachable — HTTP 402, balance exhausted (the D-104 condition, live all day).

## Open debt this release touches

- **D-104** (reviewer breadth): live. One family carried both the spec and the
  code review, so CHARTER §3's rule that the spec reviewer must not be among
  the code reviewers cannot bind and is off rather than pretended.
- **D-109** (no per-change human authorisation): unchanged; this note and its
  window are the mechanism that debt relies on.

## What a reader must not conclude

**This is merged and it is not running.** `pumasi.link` is serving the previous
build and still announces `https://`. The relay keeps no durable state — its
subdomain registry and TCP port pool are in-memory maps — and its one live
tunnel is `sshsteward`, `pumasi.link:20000` → port 22, open **9 h 19 m** at
15:37 UTC, which is how the machine this was built on is reached. Restarting
the relay drops it. Who may restart that host, and under what riders, is the
open question `DECISIONS.md` **Q-014**, which is explicitly outside CHARTER
Part 0's proceed-on-default rule. This run did not deploy and did not take it.

So nothing above describes what a visitor to `pumasi.link` meets today. It
describes `main`, and — because self-hosting is first-class (P10) — it describes
what anyone building from this repository gets right now.

## If you operate a relay

If a TLS terminator, reverse proxy or load balancer sits in front of your
relay and serves `https://*.<your domain>`, add one flag when you upgrade:

    pumasi-relay -domain example.com -public-scheme=https

Without it your relay will correctly, and unhelpfully, tell your users the
truth about itself rather than about your proxy. If nothing sits in front of
your relay, change nothing: the new default is what you were already serving.
