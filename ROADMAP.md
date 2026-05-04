# Roadmap

paalto is already usable as a markdown-agent operating system. The next work is about making setup, validation, and demonstration feel effortless for outside contributors.

## Near Term

- CLI helpers: `paalto init`, `paalto doctor`, `paalto validate`.
- Dry-run mode for examples that writes local artifacts without external API writes.
- Integration-specific setup pages for GitHub, Linear, Notion, Slack, Figma, Posthog, Intercom, Zendesk, and Jira.
- Design-partner onboarding checklist.
- Recorded walkthrough for each reference example.

## Later

- Skill marketplace format for community-contributed skill packs.
- Optional local dashboard for browsing `runs/` and `events.jsonl`.
- More example suites: pricing change, incident response, migration, product postmortem, security review.
- MCP server compatibility matrix by version.

## Non-Goals

- No hosted multi-tenant SaaS in this repo.
- No auto-merge, auto-send, or gate-skipping mode.
- No broad admin API scopes.
