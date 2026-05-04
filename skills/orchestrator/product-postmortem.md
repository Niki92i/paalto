---
name: product-postmortem
role: orchestrator
inputs: [feature, launch_date, optional:metrics_window_days]
outputs: [runs/<run_id>/product-postmortem.md]
tools: [filesystem, mcp:notion, mcp:posthog, mcp:linear]
gates: [emits_g5_summary]
---

# Skill — Product Postmortem (Launch Retro)

Different from incident postmortem. Asks: we shipped this — what worked, what changed our mind, what would we do differently? Run 2-4 weeks after launch when real usage data is in. Blameless and forward-looking.

## Procedure

1. **Wait for the data.** Run 14-28 days after launch. Earlier = guessing. Later = memory has decayed.
2. **Pull source data:**
   - Adoption metrics vs. baseline (DAU/MAU on the surface, conversion to use, repeat usage)
   - Headline metric vs. PRD prediction
   - Support tickets / NPS / customer interviews mentioning the feature
   - Roll-back / hot-fix count
   - PRD predictions vs. actual outcomes
3. **Convene PM + Designer + Engineer** (same trio as kickoff). 60-min session, async pre-reads sent 24h before.
4. **Frame the questions** (not "what went wrong" — that's incident framing):
   - What did we get right?
   - What did we change our mind about during the build?
   - What did the data tell us we were wrong about?
   - What would we do differently if we restarted today?
   - What should we do *now* (within 14 days)?
5. **Write:**

```markdown
# Product postmortem — <feature> · launched <date> · retro <date>
**PM:** <name> · **Designer:** <name> · **Engineer:** <name>

## Bottom line
<2-3 sentences: did the bet pay off? what's the verdict?>

## Predicted vs. actual
| Metric | PRD predicted | Actual (T+<days>) | Δ |
| <headline> | ... | ... | ... |
| <leading> | ... | ... | ... |
| <guardrail> | ... | ... | ... |

## What we got right
- <bullet>
- <bullet>

## What we changed our mind about during the build
- <bullet — what we believed at kickoff vs. what we believe now>
- <bullet>

## What the data told us we were wrong about
- <bullet>

## What we'd do differently if we restarted today
- <bullet>

## Customer voice
- Quotes from support / interviews / NPS (with consent)
- Themes (3-5)

## Decisions revisited
- <decision-log entry> — still valid? · supersede?

## Action items (within 14 days)
| Action | Owner | Due | Linear issue |

## Bigger lessons (for the team's pattern library)
- <one or two — not too many>

## Appendix
- Kickoff doc: <link>
- PRD: <link>
- Launch retro raw notes: <link>
```

6. **Mirror to Notion** under Retros database.
7. **G5 emission.** Launch comms gate gets the postmortem summary as the closing artifact for the feature lifecycle.
8. **Audit.** `events.jsonl`: `{ "type": "product.postmortem", "feature": "...", "actions": N, "metric_delta_pct": "...", "themes": N }`.

## Hard rules

- **Different from incident postmortem.** This is for shipped features at +14-28 days, not for outages.
- **Run at +14-28 days.** Earlier = no data; later = no memory.
- **Blameless and forward-looking.** "What would we do differently" — not "whose fault."
- **Predicted vs. actual is mandatory.** Forces honesty about the PRD's claims.
- **3-5 customer quotes minimum.** The numbers without the voices miss the qualitative shift.
- **Action items capped at what can ship in 14 days.** Otherwise the retro becomes wishlist.

## Refusal

If asked to run a product postmortem before T+14, refuse — without real usage data, the retro is opinion.
