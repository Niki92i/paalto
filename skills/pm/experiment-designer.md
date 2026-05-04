---
name: experiment-designer
role: pm
inputs: [hypothesis_seed, optional:prd_url]
outputs: [runs/<run_id>/experiment-design.md]
tools: [filesystem, mcp:notion, mcp:posthog]
gates: []
---

# Skill — Experiment Design Doc

Convert a hypothesis seed into a runnable experiment design with a pre-committed decision rule. Catches under-powered tests and post-hoc segment fishing before the test runs.

## Procedure

1. **Force the hypothesis into canonical form:**
   `If <change>, then <metric will move by direction/range>, because <causal mechanism>.`
   If the operator gives "let's test the new onboarding," push back and rewrite as the canonical form. Without `because`, the result is uninterpretable.
2. **Compute power.**
   - Baseline metric value + variance.
   - Minimum detectable effect (MDE) — the smallest lift worth shipping. Set this *first*, then derive sample size and runtime. Never reverse the order.
   - Required sample size (two-sample test by default; declare unit of randomization: user / session / org).
   - Expected runtime given current traffic.
3. **Write the design in this exact structure:**

```markdown
# Experiment design — <name>

## Hypothesis
If <change>, then <metric> will <direction> by <range>, because <mechanism>.

## Variants
- **Control:** <description>
- **Treatment:** <description, single change vs. control>

## Unit of randomization
<user | session | org> · sticky for <duration>

## Metrics
| Role | Metric | Definition | Source | Target / Threshold |
|---|---|---|---|---|
| Primary | ... | ... | ... | MDE = X% |
| Secondary | ... | ... | ... | directional |
| Guardrail | ... | ... | ... | must not move >X% |

## Pre-specified segments
Declared upfront. Subgroup analysis outside this list is exploratory only.
- ...

## Sample size & runtime
- Baseline: <value>, variance: <value>
- MDE: <X%>, alpha 0.05, power 0.80
- N required: <N> per arm
- Expected runtime: <days> at current traffic <Y/day>

## Decision rule (pre-committed)
- If primary lift's 95% CI is entirely above MDE: **ship**.
- If CI overlaps zero or MDE: **iterate or kill** based on guardrail check.
- If any guardrail moves >threshold: **roll back regardless of primary**.

## Risks
- Novelty effect (run for ≥ N weeks)
- Network effect (consider cluster randomization)
- Interaction with concurrent experiments: <list>

## Owner & dates
DRI · start · earliest decision date
```

4. **Write to** `runs/<run_id>/experiment-design.md`. Mirror under PRD in Notion if applicable.
5. **Audit.** `events.jsonl`: `{ "type": "experiment.designed", "mde": "...", "n_per_arm": N, "runtime_days": N, "guardrails": N }`.

## Hard rules

- **Hypothesis must include `because`.** No mechanism = no experiment.
- **Decision rule pre-committed.** Written before the test starts. No "we'll see what happens."
- **Guardrails are hard stops.** Not "nice to know."
- **Segments declared upfront.** Anything else is post-hoc fishing — surfaced in the readout as exploratory only.
- **MDE drives sample size, not the other way around.** "Run for two weeks" is not an experiment design.

## Refusal

- If the hypothesis can't be reduced to one change vs. control, refuse — multivariate without explicit factorial design is uninterpretable.
- If the operator wants to "just turn it on for some people and see," that's a soft launch, not an experiment. Refuse the framing and write the soft-launch plan instead.
