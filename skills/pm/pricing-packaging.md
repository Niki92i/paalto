---
name: pricing-packaging
role: pm
inputs: [product_or_feature, optional:wtp_research, optional:current_plans]
outputs: [runs/<run_id>/pricing-packaging.md]
tools: [filesystem, mcp:notion]
gates: []
---

# Skill — Pricing & Packaging Proposal

Structured proposal for how to package and price a product or feature. Segmentation comes before pricing. Migration is treated as the hard part — because it always is.

## Procedure

1. **Segment first.** Identify 2-4 customer segments with distinct willingness-to-pay (WTP) and use intensity. Cite evidence: WTP survey (van Westendorp / Gabor-Granger), conjoint, sales call notes, win/loss data. **Refuse to price without segmentation evidence.**
2. **Map value drivers per segment.** What does each segment hire the product to do? What's the alternative they'd otherwise pay for?
3. **Choose value metric.** The unit customers will scale on (seats, MAUs, events, GB, transactions). Test: as customers get more value, does this metric grow with it? If not, pick another.
4. **Draft packaging.** 3-tier default (Free/Team/Business). Each tier:
   - Who it's for (segment)
   - Headline price + value metric
   - 3-5 included capabilities
   - 2-3 capabilities reserved for the next tier (the "reason to upgrade")
5. **Pricing levels.** Anchor at WTP P50 of target segment for that tier. Explicitly call out what evidence informs each price. Never round to a "feels right" number without data.
6. **Migration plan.** The hardest part:
   - Existing customers: grandfathered, opt-in to new plan, or forced migration?
   - Communication cascade (T-60, T-30, T-7, T-0)
   - Refund / credit policy
   - Sales / CS scripts
   - Risk: churn cohort estimate + acceptable threshold
7. **Write the proposal:**

```markdown
# Pricing & packaging proposal — <product>

## TL;DR
<one paragraph: segments, value metric, tiers, expected ARPU lift, migration risk>

## Segments
- **<Segment 1>:** <who, size, WTP P50, evidence>
- **<Segment 2>:** ...

## Value metric
**<Metric>** — rationale and validation.

## Tiers
| Tier | Audience | Price | Value metric included | Reserved for upgrade |

## Pricing rationale
- Tier 1 price: <evidence>
- Tier 2 price: <evidence>
- Tier 3 price: <evidence>

## Migration plan
- Existing customers: <approach>
- Communication cascade: T-60 ... T-0
- Refund/credit policy: ...
- Sales/CS enablement: ...
- Risk: estimated churn <X%>; acceptable threshold <Y%>

## Risks & open questions
- ...

## Decision asked
DRI: <person> · Sign-off needed by: <date> · Approver: <name>
```

8. **Audit.** `events.jsonl`: `{ "type": "pricing.proposal", "tiers": N, "segments": N, "evidence_sources": N, "migration_risk_pct": "..." }`.

## Hard rules

- **Segmentation precedes pricing.** Without segments, you're guessing.
- **WTP must be empirical.** Survey, conjoint, or sales-call data. "Feels right" is not data.
- **Value metric scales with value.** If a customer doubles their value and the metric doesn't move, pick another metric.
- **Migration is the hard part.** A pricing proposal without a migration plan is incomplete.
- **Reason to upgrade is explicit.** Each tier names what the next tier unlocks, in 2-3 capabilities.

## Refusal

- Asked to set a price without WTP data? Refuse — propose a 2-week WTP study instead.
- Asked to skip the migration plan to "ship faster"? Refuse — surprise re-pricing is the fastest path to a churn event.
