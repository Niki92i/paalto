# Proof Path

paalto should prove itself before it touches customer systems. Use this sequence for a fresh clone, a review, or a demo.

## 1. Local readiness

```bash
npm run init
npm run doctor
npm run validate
npm run guardrails
```

Expected result:

- `.env` exists locally and is ignored by git.
- Required agents, skills, workflows, context files, examples, docs, and MCP config are present.
- Skill references resolve.
- Five human gates, draft-only PR behavior, draft-only launch comms, secret hygiene, and CI checks are enforced.

## 2. No-key demo

```bash
npm run demo
```

Expected result:

- A new ignored `runs/<timestamp>__demo__loom-to-pr__<id>/` folder exists.
- `events.jsonl` contains the run lifecycle and gate events.
- `prd.md`, `tickets.md`, `copy.md`, `pr-description.md`, `release-notes.md`, and `slack-draft.json` show the expected artifacts.
- `slack-draft.json` has `send: false`.

## 3. Context load

Before any live workflow, fill:

- `context/product-voice.md`
- `context/company-strategy.md`
- `context/design-system.md`
- `context/engineering-standards.md`

The goal is to keep outputs from sounding generic and to make PM, design, and engineering tradeoffs specific to the team.

## 4. Live sandbox run

```bash
npm run run:loom-to-pr
```

Paste the generated prompt into Claude Code from the repo root. Use sandbox credentials and a non-production GitHub repository first.

Expected live result:

- Notion PRD is created in Draft status.
- Linear tickets are created in the sandbox team.
- GitHub draft PR is opened and left unmerged.
- Slack release note is drafted locally and never sent automatically.
- `runs/<run_id>/events.jsonl` records the gates and external write attempts.

## 5. Evidence before broader rollout

A team should not point paalto at production until the sandbox run has:

- Completed all five human gates.
- Produced useful artifacts without manual rewriting.
- Left no secrets in git status, generated files, logs, or PR bodies.
- Passed repo CI.
- Been reviewed by a PM, designer, and engineer who would actually use the outputs.
