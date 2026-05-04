# Integrations

paalto talks to your stack via MCP servers (preferred) or thin REST wrappers (fallback). Day-one set is GitHub, Linear, Notion, Slack — defined in [`mcp.json`](mcp.json) and consumed by Claude Code.

## Required scopes — minimum, never more

| Service | Scope | Why |
|---|---|---|
| **GitHub** | fine-grained PAT · `contents: read+write` · `pull_requests: read+write` · target repo only | Engineer needs to branch, commit, open draft PRs. **No admin, no merge** scope. |
| **Linear** | personal API key, default workspace | Ticket Breaker writes; PR Builder comments. |
| **Notion** | internal integration, shared on PRD + Roadmap databases only | PRD Drafter writes pages. |
| **Slack** | bot token · `chat:write` · `chat:write.public` for the default channel | Release Notes drafts; gate summaries. **No `chat:write` to DMs without explicit channel scope.** |

## Adding a new integration

1. Prefer an official MCP server. Add it to `mcp.json` with env-var references.
2. Add a `<service>.md` here documenting required scopes and the smallest safe permission set.
3. Add empty entries for required env vars to `../.env.example`.
4. Reference the new MCP server in the relevant agent's frontmatter `tools:` list.
5. If no MCP exists, write a thin REST wrapper as a single file in `integrations/<service>/` and document its surface here. **Do not** build a full SDK.

## Phase roadmap

- **v0.1** (now) — github, linear, notion, slack
- **v0.2** — intercom, zendesk, granola, fireflies, loom
- **v0.3** — figma (Dev Mode MCP)
- **v0.4** — posthog, amplitude, mixpanel, jira
