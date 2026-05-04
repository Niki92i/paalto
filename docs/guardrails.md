# Guardrails and Edge Cases

paalto is designed to compress product-team busywork without taking ownership of irreversible decisions. This file is the operating checklist for the boundaries we enforce in docs, agent instructions, scripts, and CI.

## Non-negotiable guardrails

| Guardrail | Enforced where | What it prevents |
|---|---|---|
| Five human gates | `workflows/ship-a-feature.md`, `agents/orchestrator.md`, `npm run guardrails` | Vision, prioritization, design choice, merge, and launch cannot silently auto-advance. |
| Draft PRs only | `agents/engineer.md`, `skills/engineer/pr-builder.md`, `docs/security.md`, `npm run guardrails` | The system cannot merge code or pretend review happened. |
| Slack/customer comms draft only | `skills/engineer/release-notes.md`, workflow g5, `npm run guardrails` | Launch messages are generated as drafts and sent only by the operator. |
| Local audit trail | `runs/README.md`, every skill convention, `npm run validate` | Every run has a readable transcript and structured `events.jsonl`. |
| Secrets stay out of git | `.gitignore`, `.env.example`, `npm run guardrails` | API keys and customer run artifacts are not committed by default. |
| Least-privilege integrations | `integrations/README.md`, `.env.example`, `integrations/mcp.json` | MCP servers reference env vars and day-one scopes stay narrow. |
| No hidden backend | `docs/security.md`, landing page, README | Users understand paalto is local-first, not a hosted black box. |

## Edge cases the system must handle

| Edge case | Expected behavior |
|---|---|
| No `.env` file exists | `npm run doctor` warns, but passes. `npm run demo` still works without keys. |
| Missing or renamed skill file | `npm run validate` fails because every skill listed by an agent must exist. |
| Skill has no audit instruction | `npm run validate` fails unless the skill references `events.jsonl`. |
| Workflow gate is removed | `npm run guardrails` fails. |
| Engineer instructions stop saying draft-only | `npm run guardrails` fails. |
| Release-note skill allows auto-send | `npm run guardrails` fails. |
| `.env.example` contains a real-looking secret value | `npm run guardrails` fails for sensitive env names with non-empty values. |
| MCP references an env var missing from `.env.example` | `npm run guardrails` fails. |
| `runs/` stops being ignored | `npm run guardrails` fails. |
| CI config stops running guardrail checks | `npm run guardrails` fails locally, and the diff should not pass review. |
| PR touches too much code | `pr-builder` stops and asks the operator to split if plan touches more than 10 files or 400 LOC. |
| CI stays red after retries | `pr-builder` escalates after 3 fix attempts and does not request merge approval. |
| Dependency patches look low-risk | `dependency-triage` still opens draft PRs only; low-risk does not mean auto-merge. |
| Operator asks to merge, skip a gate, or auto-send | The relevant agent refuses and names the rule being bypassed. |

## Commands

```bash
npm run doctor      # setup and readiness check
npm run validate    # skill structure and agent wiring
npm run guardrails  # security, gates, draft-only, env, MCP, CI checks
npm run demo        # no-API local run artifact demo
```

## CI expectation

GitHub Actions must run all three checks on every push and pull request:

```bash
npm run validate
npm run guardrails
npm run doctor
```

`npm run demo` is intentionally not required in CI because it writes ignored local artifacts under `runs/`. It is still the recommended first command for a human evaluating the project.
