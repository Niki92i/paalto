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

## v0.3 — Designer with teeth (planned)

Designer · Wireframe Drafter · Figma Spec Generator · Design-system Auditor · A11y Reviewer
Integrations · Figma Dev Mode MCP

## v0.4 — Analytics & multi-squad (planned)

PM · Metrics Reporter
Engineer · Code Reviewer · Test Plan Writer · Repo Scout
Integrations · Posthog · Amplitude · Mixpanel · Jira

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
