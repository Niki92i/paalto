# How paalto works

paalto is not a hosted app and it is not an autonomous merge bot. It is a local operating system for product work that Claude Code can run from plain files.

## The moving parts

| Part | Where it lives | What it does |
|---|---|---|
| Role agents | `agents/*.md` | Define PM, Designer, Engineer, and Orchestrator behavior, tools, and skill lists. |
| Skills | `skills/<role>/*.md` | Reusable procedures for product tasks: synthesis, PRDs, wireframes, tickets, PRs, reviews, launch notes, and more. |
| Workflow | `workflows/ship-a-feature.md` | The canonical gated path from brief to PRD to tickets to draft PR to launch draft. |
| Integrations | `integrations/mcp.json` | MCP server configuration for GitHub, Linear, Notion, Slack, Figma, Posthog, Jira, Intercom, and Zendesk. |
| Runs | `runs/<run_id>/` | Local audit folders with `transcript.md`, `events.jsonl`, and intermediate artifacts. |
| Examples | `examples/*` | Reference inputs and expected outputs you can compare against. |
| Checks | `scripts/*.mjs` | Structural validation, setup doctor, and a no-API demo runner. |

## The control model

The Orchestrator moves work forward, but five gates stop the workflow until a human approves, revises, or stops:

1. `g1_vision` — is this the right thing to build?
2. `g2_prioritization` — is this the right thing to build now?
3. `g3_design_taste` — which design direction wins?
4. `g4_merge_approval` — should the draft PR be merged manually?
5. `g5_launch_comms` — should the launch message be sent?

Engineer skills are constrained to draft PRs. Slack output is drafted, not sent. Run artifacts are local and gitignored by default.

## What happens in a real run

1. You give Claude Code a brief, optional transcripts, and a target repo.
2. PM skills synthesize the signal and draft product artifacts.
3. The workflow pauses for human vision and prioritization gates.
4. Designer skills draft copy, wireframes, specs, and QA/a11y checks.
5. PM breaks the approved scope into tickets.
6. Engineer inspects the repo, creates a plan, changes code, and opens draft PRs.
7. The operator reviews and merges manually.
8. Engineer drafts release notes and Slack copy.
9. The operator sends launch comms.
10. Every step appends to `runs/<run_id>/events.jsonl`.

## What works without API keys

Run:

```bash
npm run doctor
npm run demo
```

`doctor` checks Node, repo structure, skill wiring, MCP config, `.env.example`, and run-artifact safety.

`demo` creates a local `runs/<timestamp>__demo__loom-to-pr__<id>/` folder from the Loom-to-PR example. It writes `transcript.md`, `events.jsonl`, PRD, tickets, copy, draft PR text, release notes, and a Slack draft JSON without calling any external service.

## What needs API keys

Real workflow runs need the services you want to touch. Day-one integrations are GitHub, Linear, Notion, and Slack. Optional integrations include Figma, Posthog, Jira, Intercom, and Zendesk.

The product degrades by scope: if you only configure GitHub, you can still use repo and PR-related skills; if you configure Notion and Linear, PM planning can write external artifacts; if you configure Slack, launch comms can be drafted against the real channel.

## Why this is not AI slop

- The behavior is inspectable as markdown, not hidden prompts.
- The validator enforces skill structure and agent wiring.
- The doctor checks setup before users waste time on API failures.
- The demo creates concrete local artifacts and an audit trail.
- The workflow has explicit human gates and no auto-merge path.
- The repo contains examples, expected outputs, security docs, support docs, issue templates, and CI.

The test is practical: a new user should be able to clone the repo, run `npm run doctor`, run `npm run demo`, inspect the generated run folder, then decide whether to connect real tools.
