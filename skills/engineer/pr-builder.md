---
name: pr-builder
role: engineer
inputs: [linear_ticket_id, repo]
outputs: [github_pr_url]
tools: [filesystem, mcp:github, mcp:linear, shell:sandboxed]
gates: [emits_g4_summary]
---

# Skill — PR Builder

Take a single Linear ticket and produce a **draft** GitHub PR with code, tests, and a clean description. Never merge.

## Hard rules (inherit from `agents/engineer.md`)

1. Draft PRs only.
2. CI must be green before requesting g4.
3. No new secrets in code; add empty entries to `.env.example` if needed.
4. Match existing patterns; read before write.

## Procedure

1. **Read the ticket.** Pull title, description, ACs from Linear via `linear_ticket_id`.
2. **Read the repo.** Identify analogous code paths (search by keyword from the AC text). Read 2–4 nearest files in full before planning the diff.
3. **Plan the diff.** Write a short plan to `runs/<run_id>/plan.md`: files to create, files to modify, tests to add. If the plan touches >10 files or >400 LOC, stop and ask the operator to split the ticket.
4. **Branch.** `paalto/<ticket-id>-<kebab-title>` from the repo's default branch.
5. **Implement.**
   - Write production code first, tests in the same commit batch.
   - Use the project's existing test runner. Do not introduce a new framework.
   - Run the test suite locally (sandboxed shell). All new tests must pass; no existing tests may regress.
6. **Push and open draft PR** with this body:

```markdown
## Why
- PRD: <notion url>
- Ticket: <linear url>

## What changed
- `<path>` — <one-line>
- ...

## How to verify
1. <manual step>
2. <manual step>

Tests: `<command that runs the new tests>`

---
🤖 Drafted by paalto · engineer agent. **This PR will not be auto-merged.**
```

7. **Wait for CI.** Poll the PR's checks. If red: read the failure, fix, push again. Maximum 3 fix attempts before escalating.
8. **Comment on the Linear ticket** with the PR URL.
9. **Emit g4 summary** to the operator (Slack DM if configured, else stdout):
   - PR URL · CI status · LOC · files touched · which ACs are covered · what to manually verify before merging.
10. **Audit.** Append `events.jsonl`:
    `{ "type": "pr.opened", "pr_url": "...", "ticket": "...", "ci_status": "green", "loc": N, "files": N, "fix_attempts": N }`.

## Refusal

If the operator says "merge it for me," refuse and explain the draft-only rule. Direct them to the PR's Merge button.
