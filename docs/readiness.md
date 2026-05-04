# Readiness Audit

This is the current "world-class open source" checklist for paalto. It is intentionally blunt: green means present and wired; yellow means usable but worth improving; red means missing.

## Capability Coverage

| Area | Status | Evidence |
|---|---|---|
| PM skills | Green | 18 PM skills: discovery, public market radar, PRDs, roadmaps, OKRs, experiments, launch, decisions, pricing, stakeholder updates. |
| Designer skills | Green | 11 Designer skills: copy, wireframes, Figma spec, design system, a11y, crit, interaction, content, QA, usability synthesis, design ops. |
| Engineer skills | Green | 14 Engineer skills: repo scout, tech spec, ADR, migration, PR builder, review, tests, security, perf, dependencies, PRR, runbooks, incidents, release notes. |
| Orchestration | Green | Orchestrator owns five gates plus kickoff, async standup, product postmortem. |
| Human control | Green | Five non-skippable gates; Engineer opens draft PRs only; g5 drafts but never sends. |
| Audit trail | Green | Every skill requires `events.jsonl`; `runs/README.md` documents schema. |
| MCP integrations | Green | GitHub, Linear, Notion, Slack, Intercom, Zendesk, Figma, Posthog, Jira in `integrations/mcp.json`. |
| Examples | Green | End-to-end Loom-to-PR, feedback-to-roadmap, PRD-to-Figma handoff examples. |
| No-key local run | Green | `npm run demo` creates a local ignored run folder with `events.jsonl` and reference artifacts. |
| Setup doctor | Green | `npm run doctor` checks Node, required files, skill wiring, MCP config, env template, and run-artifact safety. |
| OSS trust files | Green | MIT license, contributing guide, security policy, support guide, code of conduct, roadmap, changelog. |
| CI validation | Green | GitHub Actions validates skill structure and agent wiring on push/PR. |

## Remaining High-Leverage Gaps

These are product roadmap items, not blockers for design partners:

- Promote `npm run doctor` and `npm run demo` into a packaged CLI (`paalto init`, `paalto doctor`, `paalto demo`).
- Add recorded demo assets for every reference example.
- Add integration-specific docs per service (`integrations/github.md`, `integrations/linear.md`, etc.) once the exact MCP server APIs stabilize.
- Expand `npm run demo` into a fixture runner for all examples, not only Loom-to-PR.
- Publish a design-partner onboarding checklist that maps their existing stack to the `.env` and MCP setup.

## Validation Command

```bash
npm run validate
```

Expected output:

```text
skills=46
agent_listed_skills=46
Skill structure and agent wiring checks passed.
```
