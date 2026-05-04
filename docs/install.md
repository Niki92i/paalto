# Install

paalto runs as markdown agents inside Claude Code on your machine. There's no service to deploy, no account to create — just a repo and a few API keys.

## No-setup path

If you are evaluating paalto as a PM, designer, operator, founder, or non-technical tester, start here:

```text
https://paalto.dev/demo.html
```

No GitHub clone, API key, Claude Code setup, or terminal is required.

## Cloud path

If you want the repo without local machine setup, use [cloud-setup.md](cloud-setup.md) for GitHub Codespaces.

## Prerequisites

- **Claude Code** ([install](https://docs.anthropic.com/claude-code)) — paalto's host runtime.
- **Node.js ≥ 20** — required by the official MCP servers in `integrations/mcp.json`.
- **git**.
- API access (any subset — paalto degrades gracefully):
  - GitHub fine-grained PAT, scoped to one repo, `contents` + `pull_requests` only.
  - Linear personal API key.
  - Notion internal integration shared on your PRD, Roadmap, Strategy, Decisions, Research, and Retros databases if you use those skills.
  - Slack bot token with `chat:write` to one channel.
  - Optional: Figma, Posthog, Jira, Intercom, Zendesk.

## Steps

```bash
# 1. Clone
git clone https://github.com/paalto-dev/paalto.git
cd paalto

# 2. Verify the local project before adding secrets
npm run setup:local
npm run doctor
npm run demo

# 3. Configure real integrations when ready
npm run setup:full
$EDITOR .env       # fill day-one keys first; optional integrations can stay blank
$EDITOR context/product-voice.md
$EDITOR context/design-system.md
$EDITOR context/company-strategy.md
$EDITOR context/engineering-standards.md

# 4. Wire MCP servers into Claude Code
#    Either point Claude Code at integrations/mcp.json,
#    or copy its `mcpServers` block into your Claude Code config.

# 5. Open this folder in Claude Code and verify
#    In chat: "List the agents in agents/." — Claude Code should respond with
#    orchestrator, pm, designer, engineer.
```

## Verify the install

Run the no-API demo first:

```bash
npm run demo
```

It writes a local `runs/<timestamp>__demo__loom-to-pr__<id>/` folder with `transcript.md`, `events.jsonl`, and reference artifacts. Nothing is sent to GitHub, Linear, Notion, or Slack.

Then run the real reference example in Claude Code: [examples/loom-to-pr/README.md](../examples/loom-to-pr/README.md).

Before pointing paalto at production tools, run the sandbox acceptance test in [live-integration-test.md](live-integration-test.md).

For a fast structural check before connecting real APIs, run the same validation the repo uses in CI:

```bash
npm run validate
```

If you reach a green-CI draft PR in under 60 minutes, the install is good. If not, see [docs/quickstart.md](quickstart.md) for the common failure points.

## Security defaults

- `runs/` is gitignored.
- `.env` is gitignored.
- The PR Builder is hard-coded to `draft: true` and refuses any merge call.
- See [docs/security.md](security.md) for the full posture.
