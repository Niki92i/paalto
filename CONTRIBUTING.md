# Contributing to paalto

paalto is a small set of markdown agents and skills wrapped around Claude Code. It's designed to be forked, pruned, and extended.

## Ground rules

1. **Never auto-merge.** Any change that makes the system close a loop without a human in it will be rejected.
2. **Edges stay human.** Vision, prioritization, taste, customer trust, launch comms — these are not automatable.
3. **Every action is auditable.** Skills must write to `runs/<timestamp>/transcript.md` and append a structured event to `events.jsonl`.
4. **Scope down.** Each agent's frontmatter declares the minimum tools it needs. No admin scopes.

## Project shape

```
agents/         role + orchestrator definitions (one .md per role)
skills/         one .md per skill, grouped by role folder
workflows/      long flows that compose multiple skills with human gates
integrations/   MCP server configs and lightweight REST wrappers
runs/           per-invocation transcripts + events.jsonl  (gitignored)
examples/       end-to-end reproducible demos with sample inputs
docs/           install, quickstart, security
```

## Adding a skill

1. Create `skills/<role>/<skill-name>.md`.
2. Frontmatter: `name`, `role`, `inputs`, `outputs`, `tools`, `gates`.
3. Body: the prompt, in the role's voice. Reference inputs and outputs by name.
4. List the skill under the matching role agent in `agents/<role>.md`.
5. If it touches a new external service, add an entry to `integrations/` and to `.env.example`.
6. Add a worked invocation to an example, or extend `examples/loom-to-pr/`.
7. Run `npm run validate` before opening a PR.

## Adding an integration

- Prefer official MCP servers. Fall back to a thin REST wrapper only if no MCP exists.
- Document required scopes in `integrations/<service>.md`.
- Default to read-only; ask explicitly for write scope.

## PRs

- Open as **draft**. A maintainer merges.
- Include a `runs/` excerpt showing the new skill or integration working end-to-end.
- Update `docs/skills.md` if you added a skill.

## Discussion

GitHub Discussions for design questions and usage help. Email `hellopaalto@gmail.com` for implementation help.
