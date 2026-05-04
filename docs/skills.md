# Skills

A skill is a single `.md` file that an agent knows how to execute. Skills are the unit of extension in paalto — the system gets sharper by getting more skills, not by getting more agents.

## v0.1 — shipped

| Role | Skill | Path |
|---|---|---|
| PM | PRD Drafter | [skills/pm/prd-drafter.md](../skills/pm/prd-drafter.md) |
| PM | Ticket Breaker | [skills/pm/ticket-breaker.md](../skills/pm/ticket-breaker.md) |
| Designer | UX Copy Writer | [skills/designer/ux-copy.md](../skills/designer/ux-copy.md) |
| Engineer | PR Builder | [skills/engineer/pr-builder.md](../skills/engineer/pr-builder.md) |
| Engineer | Release Note Generator | [skills/engineer/release-notes.md](../skills/engineer/release-notes.md) |

## v0.2 — Discovery suite (shipped)

| Role | Skill | Path |
|---|---|---|
| PM | Interview Synthesizer | [skills/pm/interview-synthesizer.md](../skills/pm/interview-synthesizer.md) |
| PM | Competitor Teardown | [skills/pm/competitor-teardown.md](../skills/pm/competitor-teardown.md) |
| PM | Feedback Triager | [skills/pm/feedback-triager.md](../skills/pm/feedback-triager.md) |

Integrations added: Intercom (MCP), Zendesk (MCP), Granola / Fireflies / Loom (transcript ingest is filesystem-based — drop files into `runs/<id>/transcripts/`).

Reference example: [examples/feedback-to-roadmap/](../examples/feedback-to-roadmap/README.md)

## v0.2.next — still planned

PM · Market Radar (trend ingestion from Hacker News / Product Hunt / Substack)

## v0.3 — Designer suite (shipped)

| Role | Skill | Path |
|---|---|---|
| Designer | Wireframe Drafter | [skills/designer/wireframe-drafter.md](../skills/designer/wireframe-drafter.md) |
| Designer | Figma Spec Generator | [skills/designer/figma-spec-generator.md](../skills/designer/figma-spec-generator.md) |
| Designer | Design-system Auditor | [skills/designer/design-system-auditor.md](../skills/designer/design-system-auditor.md) |
| Designer | A11y Reviewer | [skills/designer/a11y-reviewer.md](../skills/designer/a11y-reviewer.md) |

Integrations added: Figma Dev Mode (MCP).

Reference example: [examples/prd-to-figma-handoff/](../examples/prd-to-figma-handoff/README.md)

## v0.4 — Engineer & Analytics (shipped)

| Role | Skill | Path |
|---|---|---|
| Engineer | Repo Scout | [skills/engineer/repo-scout.md](../skills/engineer/repo-scout.md) |
| Engineer | Code Reviewer | [skills/engineer/code-reviewer.md](../skills/engineer/code-reviewer.md) |
| Engineer | Test Plan Writer | [skills/engineer/test-plan.md](../skills/engineer/test-plan.md) |
| PM | Metrics Reporter | [skills/pm/metrics-reporter.md](../skills/pm/metrics-reporter.md) |

Integrations added: Posthog (MCP), Jira (MCP), Amplitude / Mixpanel (REST wrappers).

## v0.5 — Head of Product mode (shipped)

| Role | Skill | Path |
|---|---|---|
| PM | Cross-squad Rollup | [skills/pm/cross-squad-rollup.md](../skills/pm/cross-squad-rollup.md) |

Folder convention: `runs/<squad>/<timestamp>__*` for per-squad audit isolation.

## Adding a skill

See [CONTRIBUTING.md](../CONTRIBUTING.md). Short version:

1. `skills/<role>/<name>.md` with the standard frontmatter (`name`, `role`, `inputs`, `outputs`, `tools`, `gates`).
2. Body is the prompt, in the role's voice.
3. Add the skill path to the role agent's `skills:` list.
4. Demonstrate it in a `runs/` excerpt or extend an example.

## Skill vs. agent vs. workflow — when to use which

- **Skill** — one focused, parameterised job (PRD, ticket breakdown, PR open).
- **Agent** — a role with voice, taste, refusal rules. Owns a set of skills.
- **Workflow** — a long flow that calls multiple skills across multiple agents, with named human gates.
