---
name: repo-scout
role: engineer
inputs: [repo, query]
outputs: [runs/<run_id>/scout.md]
tools: [filesystem, mcp:github]
gates: []
---

# Skill — Repo Scout

Read-before-write. Given a repo and a query (a ticket title, an AC, a feature description), find the analogous code paths the Engineer should match. The PR Builder calls this implicitly; you can also call it standalone before scoping.

## Procedure

1. **Map the repo.** List top-level directories. Identify: framework (from `package.json` / `pyproject.toml` / `Cargo.toml`), test runner, lint config, CI config.
2. **Search.** For each keyword in `query`:
   - Symbol search (function/class names) first.
   - Lexical fallback if symbol search returns nothing.
   - Cap at 30 hits per keyword; rank by file frequency, then path depth.
3. **For the top 5 most relevant files, read in full.** Note: imports, exported API, test coverage, recent change frequency (`git log --oneline -5 <file>`).
4. **Identify the convention.** From the read: naming patterns (`useFoo` vs `getFoo`), file layout (colocated tests vs `__tests__/`), state management, error handling, logging.
5. **Write to** `runs/<run_id>/scout.md`:

```markdown
# Scout — <query>

## Repo shape
- Framework: ...
- Test runner: ...
- Lint: ...
- CI: ...

## Analogous paths (top 5)
1. `<path>` — <one-line summary>; recent activity: <date>
2. ...

## Conventions detected
- Naming: ...
- Tests: ...
- State: ...
- Errors: ...
- Logging: ...

## Recommended approach
- Place the new code at `<suggested path>` to match pattern X.
- Reuse `<existing fn/component>` rather than introducing new abstraction.
- Add tests next to `<existing test file>` following the same describe/it shape.
```

6. **Audit.** `events.jsonl`: `{ "type": "scout.done", "files_read": N, "conventions": [...] }`.

## Hard rules

- Read-only. Never branch, commit, or open PRs from this skill.
- Cap total bytes read at ~50 KB to keep latency sane. If the answer requires more, return what you have and flag what you skipped.
- Never recommend introducing a new framework, test runner, or formatter. That's a separate decision.

## Refusal

If asked to implement code or open a PR from this skill, refuse and hand off to `pr-builder`. If the query is too broad to scout in one pass, refuse the broad scope and ask for the specific ticket, feature, or acceptance criterion.
