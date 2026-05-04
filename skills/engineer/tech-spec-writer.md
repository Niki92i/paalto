---
name: tech-spec-writer
role: engineer
inputs: [problem, optional:prd_url, optional:constraints]
outputs: [runs/<run_id>/tech-spec.md]
tools: [filesystem, mcp:github, mcp:notion]
gates: []
---

# Skill — Technical Spec / RFC Writer

The doc engineers write before opening PRs. Forces alternative-design thinking, makes non-goals explicit, and circulates for 5-8 days of review before code starts. Closes the "Engineer skips straight to PR" gap.

## Procedure

1. **Read the PRD.** If none, refuse and ask for the problem statement first.
2. **Research before writing.**
   - Existing implementations in the repo (`repo-scout` skill output if available)
   - Prior ADRs in `decisions/` or `docs/adr/`
   - External references (papers, blog posts, vendor docs) — cite them
3. **Generate 3-5 alternatives.** This is the part most specs skip. For each:
   - One-paragraph description
   - Concrete pros (with cost / complexity / risk)
   - Concrete cons
   - Why it's rejected (single sentence — the "rejection reason")
4. **Write the spec in this exact structure:**

```markdown
# Tech spec — <title>
**Author:** <name> · **Status:** Draft · **Reviewers:** <names> · **Review by:** <date, 5-8 days out>

## Summary
<2-3 sentences. What we're building, why, what changes for users / systems.>

## Problem
<verbatim or condensed from PRD; cite link>

## Goals
- <bullet, measurable>
- <bullet>

## Non-goals (mandatory)
- <bullet — what this spec does NOT address>
- <bullet>

## Background / context
<existing system, prior art, constraints inherited>

## Proposed design
<the chosen approach. Diagrams, schemas, sequence flows, API shapes, data models.>

### API
<endpoint shapes, request/response, errors>

### Data model
<schema, indexes, migrations summary — full plan in migration-plan skill output>

### Sequence / flow
<pseudo-diagram or text walkthrough>

## Alternatives considered
### Alternative A — <name>
Description · pros · cons · **Rejection reason:**

### Alternative B — <name>
...

### Alternative C — <name>
...

## Risks & mitigations
| Risk | Likelihood | Impact | Mitigation |

## Rollout
<flag strategy, phasing, rollback. Reference migration-plan if applicable.>

## Observability
<metrics added, log lines, alerts, dashboards>

## Security & privacy considerations
<reference security-review skill if invoked>

## Open questions
- <question> — needs answer from <person> by <date>

## Cost
<infra cost delta, dev time estimate>

## Appendix
- Links to prior art, PRDs, related ADRs
```

5. **Open for review.** Save to `runs/<id>/tech-spec.md`, mirror to Notion or `docs/specs/` in repo via PR (draft). Notify reviewers in Slack with link + review-by date.
6. **Review window: 5-8 days.** Async comments. Author resolves each comment (acknowledge/decline/change). Status moves Draft → Reviewed → Accepted only after explicit sign-off from the named reviewers.
7. **Audit.** `events.jsonl`: `{ "type": "techspec.drafted", "alternatives": N, "non_goals": N, "reviewers": N, "review_by": "..." }`.

## Hard rules

- **Non-goals are mandatory.** The most common spec failure is silent scope creep. Naming what's NOT in scope is half the value.
- **3-5 alternatives with rejection reasons.** No alternatives = author is in love with the first idea. Fail the spec.
- **5-8 day review cycle.** Shorter = no real review. Longer = the work has stalled.
- **Reviewers named upfront.** Not "the team." Specific people.
- **No code before Accepted status.** Or, if code starts in parallel, it's understood to be throwaway.

## Refusal

- Asked to write a spec without naming reviewers? Refuse — without reviewers there's no review.
- Asked to skip alternatives because "we already know what to build"? Refuse — write them anyway, even if 4/5 are weak. The act of writing them surfaces assumptions.
