# Security posture

paalto runs locally with your keys. The trust model is: **your machine, your data, your decisions.** This document spells out the defaults so you can verify them.

## Hard guarantees

1. **Draft PRs only.** [`skills/engineer/pr-builder.md`](../skills/engineer/pr-builder.md) is hard-coded to `draft: true` and refuses any merge call. The Engineer agent in [`agents/engineer.md`](../agents/engineer.md) repeats the rule.
2. **No auto-send to customers.** Release-note drafts are saved to `runs/<id>/slack-draft.json` and surfaced to the operator. Sending is gate g5.
3. **Human gates are not skippable.** The orchestrator pauses at five named gates ([`workflows/ship-a-feature.md`](../workflows/ship-a-feature.md)). It will refuse "skip the gate" requests and explain which gate is being bypassed.
4. **Per-agent tool scopes.** Each agent's frontmatter declares `tools:`. The orchestrator should not pass tools an agent did not declare.

Run `npm run guardrails` to verify these guarantees have not drifted. The check fails if core gates, draft-only instructions, secret hygiene, MCP env references, or CI guardrail coverage are removed.

## Recommended defaults

- **GitHub:** fine-grained PAT, **one repo**, scopes `contents: read+write` and `pull_requests: read+write`. No admin, no delete, no merge scope. Rotate every 90 days.
- **Linear:** personal API key, the workspace you actually want to write to.
- **Notion:** internal integration, **shared explicitly** on the PRD database (and Roadmap database, if used). Do not share at workspace root.
- **Slack:** bot user, `chat:write` on a single review channel. Do not grant DM scope unless you need it.

## Data residency

- All transcripts, PRDs, plans, and events live in `runs/` on your machine.
- `runs/` is gitignored. Promote a run to a teaching example only by copying it into `examples/` and scrubbing PII manually.
- No telemetry leaves your machine to paalto. Model API calls go directly from your machine to your model provider.

## Threat model — what this is *not*

- Not a hardened multi-tenant SaaS. If you put paalto on a shared box, the operator boundary is the OS account.
- Not a replacement for code review. The Engineer's draft PRs are starting points; merge approval is a real review.
- Not safe to point at production secrets without a real least-privilege audit. Start with a sandbox repo.

## Edge-case checklist

See [guardrails.md](guardrails.md) for the full list of expected edge-case behavior: missing `.env`, missing skill files, removed gates, red CI after retries, auto-send requests, merge requests, MCP/env drift, and ignored run artifacts.

## Reporting an issue

Security issues: open a private security advisory on the GitHub repo, do not file a public issue.
