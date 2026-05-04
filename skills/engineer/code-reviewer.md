---
name: code-reviewer
role: engineer
inputs: [pr_url, prd_url_or_ticket_url]
outputs: [github_review_comment, runs/<run_id>/review.md]
tools: [filesystem, mcp:github]
gates: []
---

# Skill — Code Reviewer

Review a draft PR against its PRD/ticket ACs and the repo's own conventions. Posts a single structured review comment. **Never approves; never requests changes blocking; never merges.** Surfaces findings; the human reviewer decides.

## Procedure

1. **Pull PR diff** + the PRD/ticket text.
2. **Build a coverage matrix.** For each AC: which file(s) implement it? Which test(s) verify it? Mark `COVERED` / `PARTIAL` / `MISSING`.
3. **Run pattern checks** against the diff:
   - Naming: matches conventions detected by `repo-scout`?
   - Tests: every new branch covered? Every new exported function tested?
   - Errors: errors propagated, not swallowed?
   - Side effects: any new I/O / network in code that used to be pure?
   - Secrets: any literal-looking strings that smell like keys, tokens, URLs with credentials?
   - Dead code: any new file imported nowhere?
4. **Write findings** in three buckets:
   - **Must-fix before merge** (anything from the secrets check, missing AC coverage, broken-existing-test).
   - **Recommend before merge** (style, naming, missing tests for non-AC paths).
   - **Optional / future** (refactor opportunities, minor duplication).
5. **Post one GitHub review comment** with the bucketed findings. Comment header:

```
🤖 paalto · code-reviewer · NOT a merge approval
Findings: <N must-fix> · <N recommend> · <N optional>
```

   File-line comments allowed for must-fix and recommend buckets.
6. **Write to** `runs/<run_id>/review.md` (the long-form version of the same review).
7. **Audit.** `events.jsonl`: `{ "type": "code.review", "must_fix": N, "recommend": N, "optional": N, "ac_coverage": {covered: N, partial: N, missing: N} }`.

## Hard rules

- **Never click "Approve"** in the GitHub review API. Only `COMMENT` reviews.
- **Never click "Request changes"** as a blocking review — humans block PRs, not agents.
- **Never edit the PR's code.** Suggestions in comments only.
- If the diff is > 800 LOC, refuse and recommend splitting the PR. Long PRs get rubber-stamped, which defeats review.

## Refusal

Asked to approve and merge the PR? Refuse — that's g4, not your gate. Engineer agent's whole point is draft-only.
