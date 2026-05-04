---
name: stakeholder-update
role: pm
inputs: [period, optional:audience]
outputs: [runs/<run_id>/stakeholder-update.md]
tools: [filesystem, mcp:notion, mcp:slack, mcp:linear]
gates: []
---

# Skill — Stakeholder Update

Weekly/biweekly written update for execs and adjacent teams. <3-minute read. Green/yellow/red on metrics. Ends with a specific ask, not a generic "let me know."

## Procedure

1. **Pull source data.**
   - Headline metrics for the period (vs. baseline + vs. previous period).
   - Shipped items (Linear closed, PRs merged in production).
   - In-flight items by status.
   - Blockers requiring escalation.
2. **Write in this exact structure (cap: 400 words excluding tables):**

```markdown
# <Squad> update — <ISO date>

## Bottom line
<two sentences: what changed this period, what we're asking for>

## Metrics (R/Y/G)
| Metric | Current | Δ vs. last | Status |
|---|---|---|---|
| ... | ... | ... | 🟢 / 🟡 / 🔴 |

## Shipped
- <user-voice bullet>
- <user-voice bullet>

## In flight
- <item> — DRI · target · confidence
- <item>

## Blocked / at risk
- <item> — what's blocked, by whom, what we need

## Decisions made this period
- <link to decision log entries>

## Asks
- **<Specific ask>** from <person/team> by <date> — reason
- (If no ask: write "None this week" — do not pad)

## Next period
- <2-3 bullets, outcomes>
```

3. **Sacred cadence.** Same day, same time, every week. Note the next send date in footer.
4. **Save** to `runs/<id>/stakeholder-update.md`. Mirror to Notion. Generate Slack draft for #updates channel — saved, not sent.
5. **Audit.** `events.jsonl`: `{ "type": "stakeholder.update", "metrics_red": N, "asks": N, "blockers": N }`.

## Hard rules

- **<3 minutes to read.** ~400 words body. Tables don't count.
- **R/Y/G on metrics is mandatory.** No prose-only status. Forces honesty.
- **Asks are specific** — "<person> please review <doc> by Friday" not "would love feedback."
- **No padding.** "None this week" is a valid ask. Padding teaches readers to skim.
- **Sacred cadence.** Skipping a week erodes trust faster than a missed metric.

## Refusal

If asked to omit a red metric to "manage the message," refuse. The whole value of the update is calibrated honesty.
