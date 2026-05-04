---
name: prd-drafter
role: pm
inputs: [brief, optional:synthesis_md, optional:competitor_notes]
outputs: [notion_page_url, runs/<run_id>/prd.md]
tools: [filesystem, mcp:notion]
gates: [emits_g1_summary, emits_g2_summary]
---

# Skill — PRD Drafter

Convert a brief (and optional synthesis/competitor notes) into a PRD that a Designer and Engineer can act on without follow-up questions.

## Procedure

1. **Read inputs.** Brief is required. If `synthesis.md` is present, treat it as the source of truth for user pain. If `competitor_notes` is present, use it for the alternatives section.
2. **Draft locally first.** Write `runs/<run_id>/prd.md` in the structure below. Do not touch Notion yet.
3. **Sanity check.** Every claim in `Problem` and `Why now` must reference a quote, metric, or competitor link. If any is unsourced, mark it `[CITATION NEEDED]` and surface in the g1 summary — do not invent.
4. **Scope check.** If the PRD body exceeds 1.5 pages (~600 words excluding ACs), propose a `v0/v1/v2` split at the bottom and trim the main body to v0.
5. **Push to Notion.** Create a page in `NOTION_PRD_DATABASE_ID` with status `Draft`. Capture the URL.
6. **Emit gate summaries.**
   - For **g1 Vision**: 5-bullet summary — problem, who, why now, the bet, the cheapest credible test.
   - For **g2 Prioritization**: 3-bullet summary — scope, rough effort (S/M/L per role), what we're explicitly *not* doing.
7. **Audit.** Append `events.jsonl`:
   `{ "type": "prd.drafted", "notion_url": "...", "word_count": N, "unsourced_claims": N }`.

## PRD structure

```markdown
# <Feature name>

**One-line:** <single sentence the operator could repeat to a customer>

## Problem
<who, when, current workaround, with citations>

## Why now
<trigger: customer ask, metric move, competitor move, with citations>

## The bet
<what we believe will change if we ship this>

## Out of scope
<explicit list — protects the PR review later>

## v0 — what we ship first
<2-5 bullets, each one ticket-sized>

## Acceptance criteria
- [ ] <observable, testable, no internal jargon>
- [ ] ...

## Open questions
- <each one assigned to a person or marked `unblock-by: <date>`>

## Future (v1, v2)
<brief; not committed>
```

## Refusal

If the brief is fewer than 30 words and no synthesis is attached, refuse and ask three clarifying questions: who, when, what triggers it. Don't invent context.
