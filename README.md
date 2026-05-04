# paalto

**Your product team operating system, from Claude Code.**

One conversation replaces the swivel-chair work between PM, Designer, and Engineer. paalto lives on your machine, uses your data, and gets sharper every time you ship.

```
We run your product team   ·   Clone the repo
```

---

## Humans own the edges. The system compounds the middle.

Every AI coding agent wants to own the whole pipeline — from idea to merged PR. We think the opposite.

**Vision is human. Taste is human. Trust is human.** Repeatable work in the middle is what a system should do. paalto is built on that line.

| First mile · Operators | Middle · System | Last mile · Operators |
|---|---|---|
| Vision, ICP, the bet | Synthesize, draft, scaffold, log | Approve the merge, ship the message |
| Prioritization | PRDs, tickets, draft PRs, release notes | Talk to the customer |
| Design taste sign-off | Design specs, a11y audits | Press the button |

The system never auto-merges. The operator never wastes a Tuesday on ticket grooming.

---

## An entire product team. Zero headcount.

Three role agents, configured as plain markdown files you own.

### DISCOVER · PM
Interview Synthesizer · Market Radar · Competitor Teardown · Research Plan · PRD Drafter · Narrative Writer · Roadmap Snapshotter · OKR Tree · Experiment Designer · Experiment Readout · Feedback Triager · Metrics Reporter · Launch Checklist · Decision Log · Stakeholder Update · Pricing & Packaging

### DESIGN · Designer
Wireframe Drafter · UX Copy · Content Design · Crit Facilitator · Interaction Spec · Figma Spec Generator · Design-system Auditor · A11y Reviewer · Design QA · Usability Synthesis · Design Ops

### SHIP · Engineer
Repo Scout · Tech Spec Writer · ADR Writer · Migration Plan · **PR Builder (draft only)** · Code Reviewer · Test Plan Writer · Security Review · Performance Audit · Dependency Triage · Production Readiness Review · Runbook Generator · Incident Postmortem · Release Note Generator

### COORDINATE · Orchestrator
Kickoff Doc · Async Standup · Product Postmortem · five non-skippable human gates

All orchestrated by [`agents/orchestrator.md`](agents/orchestrator.md), which knows the long flow `brief → discovery → PRD → design → tickets → PRs → release notes` and pauses at five named human gates.

---

## Six properties

1. **Agnostic** — your repo, your stack, your models. Claude by default; swap freely.
2. **Interoperable** — GitHub, Linear, Notion, Slack on day one. Anything with an MCP or API.
3. **Intelligent** — frontier models under the hood, updated as they ship.
4. **Compounding** — every run lands in `runs/`. What worked becomes default.
5. **Modifiable** — agents, skills, prompts are `.md` files. Fork, extend, prune.
6. **Headless** — chat is the interface. Transcripts are the audit trail.

---

## Quickstart

```bash
git clone https://github.com/Niki92i/paalto.git
cd paalto
npm run doctor             # checks structure, Node, MCP config, and setup gaps
npm run demo               # creates a local no-API run in runs/<id>/
cp .env.example .env       # add API keys when you are ready for real tool writes
# open this folder in Claude Code, then in chat:
#   "run workflows/ship-a-feature.md on examples/loom-to-pr"
```

The no-API demo proves the local run folder and audit trail without touching external services. A real Claude Code run takes the Loom transcript and can produce a PRD in Notion, Linear tickets, a draft GitHub PR, and a Slack release-note draft — without auto-merging anything. Target: under 60 minutes on a fresh clone after keys are configured.

Full setup: [docs/install.md](docs/install.md) · [docs/quickstart.md](docs/quickstart.md) · [docs/how-it-works.md](docs/how-it-works.md)

## Capability coverage

paalto currently ships **46 detailed skills** across PM, Design, Engineering, and orchestration. The full matrix is in [docs/skills.md](docs/skills.md); the readiness audit and remaining roadmap are in [docs/readiness.md](docs/readiness.md).

---

## Built to be audited

Every agent action is appended to `runs/<timestamp>/transcript.md` and a structured `events.jsonl`. Every sensitive move (open PR, post to Slack, write to Notion) gates on human approval. Each agent's tool scope is declared in its `.md` header.

---

## Two paths

- **Done for you.** We deploy paalto on your machine, wire it to your stack, and run the motion alongside your team. → email `hellopaalto@gmail.com`.
- **Open source.** This repo. MIT license. Documented setup. Pull new skills any time. Community support via GitHub Discussions.

---

## License

MIT — see [LICENSE](LICENSE).
