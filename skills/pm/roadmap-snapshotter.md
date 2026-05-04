---
name: roadmap-snapshotter
role: pm
inputs: [period, optional:squads]
outputs: [runs/<run_id>/roadmap.md, optional:notion_page_url]
tools: [filesystem, mcp:linear, mcp:notion]
gates: []
---

# Skill — Roadmap Snapshotter

Produce a weekly outcome-based roadmap snapshot in `Now / Next / Later` format. Outcomes, not output. What we're explicitly *not* doing is as important as what we are.

## Procedure

1. **Pull source data.**
   - Active PRDs in Notion with status in `{In Progress, Approved}`.
   - Active Linear issues grouped by project/squad, status in `{In Progress, In Review, In QA}`.
   - PRDs with status `Backlog` or `Triage` for `Next` and `Later`.
   - Recent shipped PRs (last 7 days) for the "since last snapshot" diff.
2. **Bucket every item:**
   - **Now** — committed this cycle (current quarter or sprint). Each item must have a target date and a DRI.
   - **Next** — committed next cycle. High confidence. Each item must reference a strategy theme.
   - **Later** — exploring / not committed. Hypothesis stage.
   - **Not doing** — explicitly deferred. Each item must say *why now is not the right time*.
3. **For each item write:**

```markdown
- **<Outcome>** — <one sentence describing the user/business outcome, not the feature>
  - Theme: <strategy anchor>
  - Evidence: <link to PRD / synthesis / metric>
  - DRI: <person>  ·  Confidence: <high/med/low>  ·  Target: <date>
```

4. **Write the snapshot:**

```markdown
# Roadmap snapshot — <ISO date>

## Themes (this quarter)
- <Theme 1> — <one-line>
- <Theme 2> — <one-line>

## Now
<bullets per above>

## Next
<bullets>

## Later
<bullets>

## Not doing (and why)
- <Outcome> — <reason>: <one of: not validated / capacity / dependency blocked / strategic deprioritization>

## Since last snapshot
- Shipped: <bullets, user-voice>
- Cut: <bullets with reason>
- Added: <bullets with reason>

## Risks & dependencies
- <bullets, blockers and external waits>

## Metrics baseline
| Headline metric | Current | Δ vs last snapshot |
```

5. **Mirror to Notion** if a Roadmap database is configured.
6. **Audit.** `events.jsonl`: `{ "type": "roadmap.snapshot", "now": N, "next": N, "later": N, "not_doing": N, "shipped_since_last": N }`.

## Hard rules

- **Outcomes, not outputs.** "Reduce day-1 churn 5pp" not "Build onboarding tour."
- **`Not doing` section is mandatory** and at least as long as `Now`. Marty Cagan's pushback: feature roadmaps lie about confidence. State what you're deferring.
- **Refresh weekly.** A monthly roadmap is a fiction. Weekly forces honesty.
- **Layer by confidence, not by calendar.** A "Q3 commitment" with low confidence belongs in `Later`, not `Next`.
- **Never reorder without a reason.** If `Next` shifts, the diff in `Since last snapshot` must explain why.

## Refusal

If asked to publish a roadmap without DRIs or evidence links, refuse — accountability is the whole point of the artifact.
