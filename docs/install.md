# Install

paalto runs as markdown agents inside Claude Code on your machine. There's no service to deploy, no account to create — just a repo and a few API keys.

## Prerequisites

- **Claude Code** ([install](https://docs.anthropic.com/claude-code)) — paalto's host runtime.
- **Node.js ≥ 20** — required by the official MCP servers in `integrations/mcp.json`.
- **git**.
- API access (any subset — paalto degrades gracefully):
  - GitHub fine-grained PAT, scoped to one repo, `contents` + `pull_requests` only.
  - Linear personal API key.
  - Notion internal integration shared on your PRD database.
  - Slack bot token with `chat:write` to one channel.

## Steps

```bash
# 1. Clone
git clone https://github.com/Niki92i/paalto.git
cd paalto

# 2. Configure
cp .env.example .env
$EDITOR .env       # fill in the four day-one keys

# 3. Wire MCP servers into Claude Code
#    Either point Claude Code at integrations/mcp.json,
#    or copy its `mcpServers` block into your Claude Code config.

# 4. Open this folder in Claude Code and verify
#    In chat: "List the agents in agents/." — Claude Code should respond with
#    orchestrator, pm, designer, engineer.
```

## Verify the install

Run the reference example: [examples/loom-to-pr/README.md](../examples/loom-to-pr/README.md).

If you reach a green-CI draft PR in under 60 minutes, the install is good. If not, see [docs/quickstart.md](quickstart.md) for the common failure points.

## Security defaults

- `runs/` is gitignored.
- `.env` is gitignored.
- The PR Builder is hard-coded to `draft: true` and refuses any merge call.
- See [docs/security.md](security.md) for the full posture.
