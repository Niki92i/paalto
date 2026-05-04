# Changelog

## v0.8 — Runnable no-key product audit

- Added `npm run doctor` to check Node, required project files, skill wiring, MCP config, env templates, and run-artifact safety.
- Added `npm run demo` to create a local ignored Loom-to-PR run folder with `events.jsonl` and reference artifacts without calling external APIs.
- Added a local `paalto` CLI surface through `bin.paalto`, `npm run init`, and `npm run run:loom-to-pr`.
- Added `context/` templates for product voice, company strategy, design system, and engineering standards.
- Added `docs/proof-path.md` so reviewers can verify local readiness, no-key artifacts, context loading, and live sandbox expectations.
- Added `npm run guardrails` to enforce gates, draft-only behavior, secret hygiene, MCP env references, ignored run artifacts, and CI coverage.
- Added final-launch social metadata, absolute Open Graph/Twitter preview URLs, favicon PNG, Apple touch icon, and web app manifest icons.
- Added a no-setup browser demo for non-technical testers, plus tester guide, cloud setup guide, and Codespaces devcontainer.
- Added `npm run setup:local` and `npm run setup:full` guided setup modes that generate ignored setup checklists under `runs/`.
- Added `docs/how-it-works.md` with the product model, control gates, real-run flow, and why the repo is inspectable rather than AI theater.
- Added `docs/guardrails.md` with security boundaries and expected edge-case behavior.
- Added `docs/live-integration-test.md` with the sandbox acceptance test for real GitHub, Linear, Notion, Slack, and gate behavior.
- Removed stale dependency-triage auto-merge guidance; dependency updates now stay draft-only until human merge.
- Updated README, install, quickstart, support, contributing, example, readiness, and landing-page copy around the no-key path.
- Removed stale Discord/support claims and standardized help email references.

## v0.7 — OSS readiness audit

- Added `market-radar` PM skill for public internet, Reddit, GitHub, changelog, and community signal scanning.
- Normalized older skills to the full convention: frontmatter, Procedure, Hard rules, Refusal, and `events.jsonl` audit instruction.
- Added CI validation for skill structure and agent wiring.
- Added project readiness audit, security policy, support guide, code of conduct, and roadmap.
- Refreshed README, install, quickstart, integration docs, and `.env.example` to match the current capability set.

## v0.6 — Top-operator coverage

- Added PM, Designer, Engineer, and Orchestrator skills for strategy, experiments, design craft, engineering design, operations, production readiness, and launch retros.

## v0.1-v0.5

- Initial agents, long workflow, discovery suite, designer suite, engineer/analytics skills, Head-of-Product rollup, and landing page.
