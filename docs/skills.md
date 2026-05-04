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

## v0.6 — Top-operator coverage (shipped)

The first five waves shipped the artifact production layer. v0.6 closes the gap to what top PMs / Designers / Engineers actually do day-to-day: strategy, decisions, experimentation, operations, ops-readiness, and cross-functional rituals. Built from canonical templates (Cagan/Wodtke for product strategy, Statsig/CXL for experimentation, Nielsen-Norman for usability and content, Nygard for ADRs, Google SRE for production readiness, expand-contract pattern for migrations).

### PM (10)
| Skill | Path | Source pattern |
|---|---|---|
| Narrative / Strategy Writer | [skills/pm/narrative-writer.md](../skills/pm/narrative-writer.md) | Amazon 6-pager |
| Roadmap Snapshotter | [skills/pm/roadmap-snapshotter.md](../skills/pm/roadmap-snapshotter.md) | Now/Next/Later, Cagan |
| OKR / Metric Tree | [skills/pm/okr-tree.md](../skills/pm/okr-tree.md) | Wodtke radical focus |
| Experiment Designer | [skills/pm/experiment-designer.md](../skills/pm/experiment-designer.md) | Statsig / CXL |
| Experiment Readout | [skills/pm/experiment-readout.md](../skills/pm/experiment-readout.md) | Pre-committed decision rule |
| Research Plan | [skills/pm/research-plan.md](../skills/pm/research-plan.md) | Teresa Torres / NN-g |
| Launch Checklist | [skills/pm/launch-checklist.md](../skills/pm/launch-checklist.md) | Support-readiness gating |
| Decision Log | [skills/pm/decision-log.md](../skills/pm/decision-log.md) | Bezos type-1/type-2 |
| Stakeholder Update | [skills/pm/stakeholder-update.md](../skills/pm/stakeholder-update.md) | <3min, R/Y/G, asks |
| Pricing & Packaging | [skills/pm/pricing-packaging.md](../skills/pm/pricing-packaging.md) | WTP empirical, segments first |

### Designer (6)
| Skill | Path | Source pattern |
|---|---|---|
| Crit Facilitator | [skills/designer/crit-facilitator.md](../skills/designer/crit-facilitator.md) | Silent-first, assigned skeptic |
| Interaction & Motion Spec | [skills/designer/interaction-spec.md](../skills/designer/interaction-spec.md) | Motion = affordance |
| Content Design / Microcopy | [skills/designer/content-design.md](../skills/designer/content-design.md) | NN-g error patterns |
| Design QA | [skills/designer/design-qa.md](../skills/designer/design-qa.md) | Weekly mid-build |
| Usability Synthesis | [skills/designer/usability-synthesis.md](../skills/designer/usability-synthesis.md) | Rainbow sheet, 3+/5 rule |
| Design Ops / Token Hygiene | [skills/designer/design-ops.md](../skills/designer/design-ops.md) | Tokens-in-code source of truth |

### Engineer (9)
| Skill | Path | Source pattern |
|---|---|---|
| Tech Spec / RFC Writer | [skills/engineer/tech-spec-writer.md](../skills/engineer/tech-spec-writer.md) | Non-Goals + 3-5 alternatives |
| ADR Writer | [skills/engineer/adr-writer.md](../skills/engineer/adr-writer.md) | Nygard format |
| Migration Plan | [skills/engineer/migration-plan.md](../skills/engineer/migration-plan.md) | Expand-contract, double-write |
| Runbook Generator | [skills/engineer/runbook-generator.md](../skills/engineer/runbook-generator.md) | Decision trees, time escalation |
| Incident Postmortem | [skills/engineer/incident-postmortem.md](../skills/engineer/incident-postmortem.md) | Blameless, 3-day publish |
| Performance Audit | [skills/engineer/perf-audit.md](../skills/engineer/perf-audit.md) | Budget-first, user-perceived |
| Security Review | [skills/engineer/security-review.md](../skills/engineer/security-review.md) | STRIDE, 5-15 pages |
| Dependency Triage | [skills/engineer/dependency-triage.md](../skills/engineer/dependency-triage.md) | Bundle by risk class |
| Production Readiness Review | [skills/engineer/prod-readiness.md](../skills/engineer/prod-readiness.md) | Google SRE PRR |

### Cross-role / Orchestrator (3)
| Skill | Path | Purpose |
|---|---|---|
| Kickoff Doc | [skills/orchestrator/kickoff-doc.md](../skills/orchestrator/kickoff-doc.md) | PM/Des/Eng joint one-pager at start |
| Async Standup | [skills/orchestrator/async-standup.md](../skills/orchestrator/async-standup.md) | 4-line written, blockers auto-escalate |
| Product Postmortem | [skills/orchestrator/product-postmortem.md](../skills/orchestrator/product-postmortem.md) | T+14-28d launch retro, predicted vs actual |

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
