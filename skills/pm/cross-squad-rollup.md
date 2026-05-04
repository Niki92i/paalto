---
name: cross-squad-rollup
role: pm
inputs: [squads[], period]
outputs: [runs/<run_id>/rollup.md, slack_message_draft]
tools: [filesystem, mcp:linear, mcp:notion, mcp:posthog, mcp:slack]
gates: [emits_g5_summary]
---

# Skill — Cross-squad Rollup (Head of Product mode)

For 2+ squads, produce one weekly digest that the Head of Product can send up. Aggregates each squad's PRDs, shipped PRs, and headline metric. Surfaces conflicts (two squads chasing the same OKR; two squads blocking each other).

## Procedure

1. **For each squad in `squads`:**
   - Pull `events.jsonl` from any `runs/` folder owned by that squad (folder convention: `runs/<squad>/<timestamp>__*`).
   - Pull active PRDs from Notion filtered by squad tag.
   - Pull merged PRs in the period from GitHub.
   - Pull the squad's headline metric from analytics (declared in `squads/<name>/metrics.yml`).
2. **Per-squad block:**

```markdown
### Squad: <name>
- **This week:** <1 sentence>
- **Shipped:** <N PRs> — <bulleted list, user-voice, max 5>
- **Headline metric:** <name> · <value> · <Δ>
- **Active PRDs:** <count> — <list with status>
- **Asks:** <blockers / decisions needed from leadership>
```

3. **Conflict scan:**
   - Same OKR claimed by ≥2 squads.
   - Cross-squad ticket blocks (a Linear issue in squad A blocked by an issue in squad B).
   - Same code area touched by ≥2 PRs in the period (potential merge conflict surface).
4. **Top section (executive summary).** 5 bullets max:
   - The single most important number across all squads.
   - The single most important ship across all squads.
   - The most pressing ask requiring leadership input.
   - The biggest cross-squad conflict.
   - One thing to watch next week.
5. **Slack draft.** Channel: leadership channel from `.env`. Saved to `runs/<id>/slack-draft.json`, not sent.
6. **Emit g5 summary** to operator with the link to the long-form rollup and the Slack draft.
7. **Audit.** `events.jsonl`: `{ "type": "rollup.drafted", "squads": N, "shipped_total": N, "conflicts": N }`.

## Hard rules

- **Compare don't rank.** No leaderboard. Surfacing relative performance between squads from a script is a culture-breaker.
- **Asks must come from the squad.** Don't infer asks the squad didn't raise.
- **Never aggregate the headline metric across squads** unless the squads share an explicit shared OKR. Different squads optimize different things.

## Refusal

Asked to write a per-person performance summary? Refuse — this skill operates on squads, not individuals. Performance is a manager's job, not a system's.
