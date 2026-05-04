---
name: async-standup
role: orchestrator
inputs: [period, optional:squad]
outputs: [runs/<run_id>/standup.md, slack_draft]
tools: [filesystem, mcp:linear, mcp:github, mcp:slack]
gates: []
---

# Skill — Async Standup

Daily or weekly written standup. Replaces synchronous standup ritual with a 4-line format per person: shipped, blocked, next, ask. The "ask" is the part most teams forget and the part that creates the most value.

## Procedure

1. **Pull source data per participant** (last period since last standup):
   - Linear: closed issues
   - GitHub: merged PRs, opened PRs awaiting review
   - Calendar: blocking meetings or absences
2. **Generate per-person draft** in this exact 4-line format:

```markdown
**<Name>** · <emoji or status>
- **Shipped:** <1-3 bullets, user-voice when possible>
- **Blocked:** <none | what + by whom + how long>
- **Next:** <1-3 bullets, what's actually next today/this week>
- **Ask:** <none | specific request from a specific person>
```

3. **Aggregate into squad standup:**

```markdown
# Standup — <date>
**Cadence:** <daily | weekly> · **Squad:** <name>

## At-a-glance
- 🟢 N people green · 🟡 N yellow · 🔴 N red
- N PRs awaiting review (>24h: <list>)
- N blockers needing escalation

## Per person
<one block per person, format above>

## Cross-cutting blockers (orchestrator only)
- <blocker> — affects <people>, escalating to <person>

## Decisions needed today
- <decision> — DRI, by when

## Reading list (optional)
- <PR/doc that the squad should glance at>
```

4. **Post draft** to the squad channel as a single Slack message. People can edit their own line in a thread; orchestrator merges edits into the canonical doc.
5. **PRs >24h without review** get auto-flagged. Reviewer pinged.
6. **Blockers >2 days** get escalated to EM/manager. Auto.
7. **Audit.** `events.jsonl`: `{ "type": "standup.posted", "people": N, "blockers": N, "stale_prs": N, "asks": N }`.

## Hard rules

- **4 lines per person, max.** Shipped / blocked / next / ask. No prose. No padding.
- **"None" is a valid answer for blocked and ask.** Don't pad to look busy.
- **Asks are specific.** "Need design review on X by EOD" not "would love thoughts."
- **Blockers >2 days auto-escalate.** Otherwise blockers rot.
- **PRs >24h without review auto-flagged.** Review latency is the silent killer of velocity.
- **Async-default.** Sync standup is allowed but not required. The doc is the source of truth.

## Refusal

If asked to write a standup that hides a blocker, refuse — that's the whole anti-pattern this skill exists to fix.
