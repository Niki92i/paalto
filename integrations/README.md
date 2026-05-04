# Integrations

paalto talks to your stack via MCP servers (preferred) or thin REST wrappers (fallback). The MCP set is defined in [`mcp.json`](mcp.json) and consumed by Claude Code.

## Required scopes — minimum, never more

| Service | Scope | Why |
|---|---|---|
| **GitHub** | fine-grained PAT · `contents: read+write` · `pull_requests: read+write` · target repo only | Engineer needs to branch, commit, open draft PRs. **No admin, no merge** scope. |
| **Linear** | personal API key, default workspace | Ticket Breaker writes; PR Builder comments. |
| **Notion** | internal integration, shared only on the databases you use: PRD, Roadmap, Strategy, Decisions, Research, Retros | PM/Orchestrator skills mirror artifacts. Do not share workspace root. |
| **Slack** | bot token · `chat:write` for the default channel | Release Notes drafts; gate summaries. No DM scope unless you explicitly need it. |

## MCP server catalog

| Server | Phase | Used by | Env vars |
|---|---|---|---|
| GitHub | v0.1 | Engineer repo scout, draft PRs, release notes, dependency triage | `GITHUB_TOKEN` |
| Linear | v0.1 | PM ticket breaker, launch checklists, postmortems | `LINEAR_API_KEY`, `LINEAR_TEAM_ID` |
| Notion | v0.1+ | PRDs, roadmaps, decisions, research, retros | `NOTION_API_KEY`, database IDs in `.env.example` |
| Slack | v0.1 | Gate summaries and draft messages | `SLACK_BOT_TOKEN`, `SLACK_DEFAULT_CHANNEL` |
| Intercom | v0.2 | Feedback triage | `INTERCOM_ACCESS_TOKEN` |
| Zendesk | v0.2 | Feedback triage | `ZENDESK_API_TOKEN` |
| Figma | v0.3 | Designer specs, a11y, design QA, design ops | `FIGMA_ACCESS_TOKEN` |
| Posthog | v0.4 | Metrics, experiments, product postmortems | `POSTHOG_API_KEY` |
| Jira | v0.4 | Optional issue-source fallback | `JIRA_API_TOKEN`, `JIRA_BASE_URL` |

## Adding a new integration

1. Prefer an official MCP server. Add it to `mcp.json` with env-var references.
2. Add a `<service>.md` here documenting required scopes and the smallest safe permission set.
3. Add empty entries for required env vars to `../.env.example`.
4. Reference the new MCP server in the relevant agent's frontmatter `tools:` list.
5. If no MCP exists, write a thin REST wrapper as a single file in `integrations/<service>/` and document its surface here. **Do not** build a full SDK.

## Phase roadmap

- **v0.1** — github, linear, notion, slack
- **v0.2** — intercom, zendesk · transcripts (granola, fireflies, loom) ingested as files
- **v0.3** — figma (Dev Mode MCP)
- **v0.4** — posthog, amplitude, mixpanel, jira
- **v0.5** — Head-of-Product mode (no new integrations; folder convention only)
- **v0.6** — no new MCP servers; new skills consume the existing GitHub/Linear/Notion/Slack/Figma/Posthog surface
