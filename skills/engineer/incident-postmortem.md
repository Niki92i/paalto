---
name: incident-postmortem
role: engineer
inputs: [incident_id, timeline_data, optional:slack_channel]
outputs: [runs/<run_id>/postmortem.md, optional:docs/postmortems/<slug>.md]
tools: [filesystem, mcp:github, mcp:slack]
gates: []
---

# Skill — Incident Postmortem

Blameless write-up of a production incident. Never names "human error" as the root cause. Action items have owners and dates. Published within 3 business days while memory is fresh.

## Procedure

1. **Pull the timeline.** Sources:
   - Slack incident channel transcript
   - PagerDuty / alert timeline
   - Deploy log
   - Customer support ticket spike
   - Status page updates
2. **Compute impact:**
   - Duration (detection → mitigation → full resolution)
   - Users affected (count, %)
   - Revenue / SLO impact
   - Customer-visible (yes/no)
3. **Reconstruct the timeline** with timestamps in UTC, one row per signal:

```
14:02 UTC  alert fires: payment-api 5xx > 1%
14:03 UTC  on-call ack
14:07 UTC  on-call identifies recent deploy at 13:55
14:09 UTC  rollback initiated
14:14 UTC  rollback complete; error rate falling
14:21 UTC  full recovery; monitoring continues
```

4. **Five-whys (or causal chain).** Walk the chain *without naming individuals*. "The deploy contained an unhandled null case" — not "Engineer X missed a null check."
5. **Identify contributing factors:**
   - Technical (the bug)
   - Process (review, testing, deploy gates)
   - Tooling (alerts, dashboards)
   - Organizational (on-call coverage, knowledge gaps)
6. **Write:**

```markdown
# Postmortem — <incident name> · <date>
**Status:** Final · **Severity:** <SEV-X> · **Author:** <name> · **Reviewed:** <names>

## Summary
<2-3 sentences: what happened, impact, what fixed it>

## Impact
- Duration: <HH:MM>
- Users affected: <count> (<%>)
- SLO impact: <e.g., "burned 30% of monthly availability budget">
- Customer-visible: <yes/no, status page issued>

## Timeline (UTC)
| Time | Event | Actor (role only) |

## Root cause (causal chain)
1. <fact>
2. → <fact>
3. → <fact>
4. → <user-visible failure>

## Contributing factors
- **Technical:** <list>
- **Process:** <list>
- **Tooling:** <list>
- **Organizational:** <list>

## What went well
- <list — actually identify these; reinforces the muscle>

## What went poorly
- <list>

## Where we got lucky
- <list — near-misses that didn't bite us this time but will next time>

## Action items
| Action | Type (prevent/detect/mitigate) | Owner | Due | Linear issue |

## Detection & mitigation effectiveness
- Time to detect: <X min> (target: <Y>)
- Time to mitigate: <X min> (target: <Y>)
- If above target, why?

## Lessons (1-3, no more)
- ...

## Appendix
- Slack channel link
- Related incidents: <links>
```

7. **Action items in Linear.** Each becomes a Linear issue with the owner assigned, due date set, label `postmortem:<incident>`. **Track to completion** — a postmortem with stale action items is worse than no postmortem.
8. **Publish within 3 business days.** Past that, memory degrades and the document becomes fiction.
9. **Audit.** `events.jsonl`: `{ "type": "postmortem.published", "severity": "...", "duration_min": N, "actions": N, "blameless_check_passed": true }`.

## Hard rules

- **Blameless.** Never name individuals as causes. Name roles, systems, processes. The system that lets one engineer cause an outage is the bug.
- **"Human error" is never the root cause.** It's a symptom. The root cause is the system that allowed it.
- **Action items have owners and dates.** Otherwise nothing changes.
- **Publish in 3 days.** Past that the doc is reconstructed memory, not record.
- **`Where we got lucky`** is mandatory. Near-misses are the highest-signal section.
- **Action items split into prevent / detect / mitigate.** Forces balanced thinking, not just bug-fix-and-move-on.

## Refusal

- Asked to write a postmortem that names individuals? Refuse and rewrite blameless.
- Asked to skip publication "because it makes us look bad"? Refuse — opacity costs more than the embarrassment.
