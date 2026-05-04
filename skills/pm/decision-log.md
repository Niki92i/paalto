---
name: decision-log
role: pm
inputs: [decision_topic, options_considered, chosen, rationale]
outputs: [runs/<run_id>/decision.md, appended:decisions/index.md]
tools: [filesystem, mcp:notion]
gates: []
---

# Skill — Decision Log Entry

Async-first record of a non-trivial product decision. Future-you and future-team need to know *why*. The DRI is accountable; consensus is not the bar.

## Procedure

1. **Confirm this needs a decision log.** A decision belongs in the log if it: shapes the roadmap, locks an external commitment, or creates a constraint someone else will hit later. Reversible day-to-day choices don't need an entry.
2. **Write the entry:**

```markdown
# Decision — <short title>
**Date:** <ISO> · **DRI:** <person> · **Status:** Active

## Context
<2-4 sentences. What forced this decision now?>

## Options considered
- **Option A:** <one line> — pros / cons
- **Option B:** <one line> — pros / cons
- **Option C:** <one line> — pros / cons

## Chosen
**<Option X>** because <rationale>. Linked evidence: <PRDs, data, research>.

## Trade-offs accepted
<what we know we're giving up>

## Reversibility
- **Type 1 (one-way door):** rationale for irreversibility
- **Type 2 (two-way door):** how we'd reverse, cost to reverse

## What would change our mind
<falsifiers — concrete signals that would force a revisit>

## Stakeholders consulted
<list — note that consulted ≠ approved; DRI owns the call>

## Supersedes / superseded by
<links to prior or future decisions>
```

3. **Append a 2-line entry to `decisions/index.md`** for browsability:
   ```
   - YYYY-MM-DD · <title> · DRI <person> · Status Active · runs/<id>/decision.md
   ```
4. **Mirror to Notion** under Decisions database if configured.
5. **Audit.** `events.jsonl`: `{ "type": "decision.logged", "title": "...", "reversibility": "type1|type2", "supersedes": "..." }`.

## Hard rules

- **DRI accountable, not consensus.** "We all agreed" is not how decisions get owned. Name one person.
- **Async-first.** The doc must stand on its own — no reader should need a meeting recap.
- **Reversibility classification is mandatory** (Bezos type-1/type-2). Type-1 decisions deserve more deliberation; type-2 ones should not be over-scoped.
- **Superseding is OK.** Decisions evolve. Link forward to the new decision; don't delete the old.
- **`What would change our mind`** is the section future-you will thank you for.

## Refusal

If asked to log a decision without trade-offs, refuse — every real decision has them. If there are none, it isn't a decision.
