---
name: okr-tree
role: pm
inputs: [objective, optional:prior_quarter_okrs]
outputs: [runs/<run_id>/okr-tree.md]
tools: [filesystem, mcp:notion]
gates: []
---

# Skill — OKR / Metric Tree Builder

Decompose a single objective into a metric tree: north-star → input metrics → leading indicators → owned actions. Catches vanity metrics and uncontrollable outputs before the quarter starts.

## Procedure

1. **Take the objective.** Must be qualitative and outcome-focused. Reject objectives that are output-shaped ("Ship X feature" → not an objective).
2. **Build the tree (3 levels max):**

```
Objective (qualitative)
├── KR1 (output metric, lagging) — measurable, target range
│   ├── Input metric A (leading, controllable) — owner
│   └── Input metric B (leading, controllable) — owner
├── KR2 (output metric, lagging)
│   └── Input metric C
└── KR3 (output metric, lagging) — at most 4 KRs total
```

3. **Per KR write:**
   - **What it measures** (definition, not the number).
   - **Why it matters** (causal link to the objective; if you can't argue the link, the KR is correlation, not causation — flag it).
   - **Target range** (e.g., `5-8%`, never a point estimate).
   - **Confidence at start** (company-level: 70% · team-level: 80%+).
   - **Cadence** (weekly / monthly).
   - **DRI**.
4. **Per input metric write:**
   - **Definition** + the SQL/event name.
   - **What action moves it** (the team must own this — if no team owns it, it's not a real input metric).
   - **Baseline** + **target**.
5. **Vanity-metric scan.** For each metric, ask: "If this number doubles overnight with no other change, are we genuinely better off?" If no → flag as `[VANITY]` and require a replacement.
6. **Write to** `runs/<run_id>/okr-tree.md`.
7. **Audit.** `events.jsonl`: `{ "type": "okr.tree", "krs": N, "input_metrics": N, "vanity_flags": N }`.

## Hard rules

- **Max 4 KRs per objective.** More dilutes focus.
- **Inputs must be controllable.** Revenue is not an input metric for a product team. Conversion rate is.
- **Targets are ranges, not points.** Point estimates create false precision.
- **Confidence asymmetry.** Company-level OKRs at ~70% confidence. Team-level at 80%+. If a team OKR feels uncertain, it's a strategic bet — promote it to a memo, don't smuggle it in as an OKR.
- **Refresh independently of cadence.** Some KRs roll monthly, some quarterly. Do not force calendar alignment.

## Refusal

- If asked to set a KR for an output the team can't influence (e.g., total company revenue for a single squad), refuse and propose the controllable input instead.
- If asked to skip the vanity-metric scan, refuse — vanity is the most common OKR failure mode.
