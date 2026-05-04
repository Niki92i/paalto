---
name: metrics-reporter
role: pm
inputs: [period, optional:metric_set]
outputs: [runs/<run_id>/weekly-review.md, slack_message_draft]
tools: [filesystem, mcp:posthog, mcp:slack]
gates: [emits_g5_summary]
---

# Skill — Metrics Reporter

Pull product metrics for a period (default: last completed week) and produce a review the operator can send. Drafts only.

## Procedure

1. **Resolve `metric_set`.** If not provided, use the project's `metrics.yml` (`top_funnel`, `activation`, `retention`, `revenue`). If neither exists, refuse and ask the operator to declare the metric set once — drift between weekly reviews is the silent killer.
2. **Pull data** from configured analytics MCP (Posthog by default; Amplitude/Mixpanel via REST wrapper if MCP unavailable). For each metric:
   - Value this period
   - Value previous period
   - 4-period sparkline (text: e.g., `▁▂▃▅▇`)
   - **Annotated.** If a release happened in the period, name it.
3. **Write the review** in this structure:

```markdown
# Weekly review — <ISO week>

## Top line
- One sentence: the most important number this week and what changed.

## The numbers
| Metric | This period | Δ vs prev | 4-period |
|---|---|---|---|
| ... | ... | ... | ... |

## What we shipped
- Bullet list from `events.jsonl` `release-notes.drafted` entries in the period.

## What changed and why we think so
- Hedge. "Activation up 4pp; coincides with the demo-project ship on Monday. Causal? Not proven."

## What to watch next week
- 2–3 specific numbers + thresholds.
```

4. **Slack draft.** 5-bullet short version saved to `runs/<run_id>/slack-draft.json`. Not sent.
5. **Emit g5 summary**: where to verify the numbers (link to Posthog dashboard), suggested send time.
6. **Audit.** `events.jsonl`: `{ "type": "metrics.report", "period": "...", "metrics": N, "shipped_count": N }`.

## Hard rules

- **Hedge causality.** Never write "X caused Y" unless an experiment with control was run. Use "coincides with", "preceded by".
- **No vanity metrics.** Page views, sign-ups (without activation context) — refuse to lead with these.
- **Show the comparison.** Single-number reports without a delta are a screenshot, not a review.

## Refusal

Asked to "make the numbers look better"? Refuse. Re-baseline a metric only via an explicit `metrics.yml` change committed by the operator.
