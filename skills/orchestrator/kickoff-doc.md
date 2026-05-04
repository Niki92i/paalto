---
name: kickoff-doc
role: orchestrator
inputs: [feature_or_initiative, optional:prd_url]
outputs: [runs/<run_id>/kickoff.md]
tools: [filesystem, mcp:notion, mcp:slack]
gates: [emits_g1_summary]
---

# Skill — Cross-functional Kickoff Doc

The alignment artifact at the start of a feature. PM/Designer/Engineer write one shared one-pager so the squad has the same model of what's being built. Written *before* design or code starts.

## Procedure

1. **Read the PRD or strategy memo.** If neither exists, refuse — kickoff without a problem statement is theatre.
2. **Convene the three roles.** PM, Designer, Engineer (and EM/TPM if relevant). The kickoff doc is *jointly authored* — the orchestrator just runs the template.
3. **Write the doc:**

```markdown
# Kickoff — <feature> · <date>
**PM:** <name> · **Designer:** <name> · **Engineer:** <name> · **EM:** <name>

## Problem (PM)
<1 paragraph from the PRD; user, pain, evidence>

## What success looks like (PM)
- Headline metric to move
- Leading indicator we'll watch weekly
- Time horizon

## What we're explicitly NOT doing (PM + Designer + Engineer)
- ...
- ...

## Design approach (Designer)
- 2-3 sentences on the shape of the solution
- Open design questions to resolve in week 1
- Inspirations / references (links)

## Technical approach (Engineer)
- 2-3 sentences on the shape of the solution
- Tech-spec to be written by <date> (skill: tech-spec-writer)
- Dependencies / unknowns

## Dependencies & blockers
- External teams: <list, with names>
- Sequencing: <what blocks what>

## Risks (each role names one)
- PM: <risk> · mitigation
- Designer: <risk> · mitigation
- Engineer: <risk> · mitigation

## Timeline (rough — refined after tech spec)
| Milestone | Owner | Target |
| Tech spec accepted | Eng | <date> |
| Design v1 | Designer | <date> |
| Build start | Eng | <date> |
| Internal demo | All | <date> |
| Launch | All | <date> |

## How we'll work
- Standup cadence: <e.g., async daily, sync weekly Tue 10am>
- Decision log: runs/<id>/decisions/
- Channel: #<slack channel>

## Open questions for the squad
- <q> — owner, due

## Definition of done
<one paragraph; concrete and observable>
```

4. **Mirror to Notion**, post to the squad channel, pin.
5. **G1 emission.** Vision gate gets the kickoff doc as the human-facing summary. Sign-off requires PM + Designer + Engineer ack.
6. **Audit.** `events.jsonl`: `{ "type": "kickoff.created", "feature": "...", "roles_acked": ["pm","designer","engineer"], "milestones": N }`.

## Hard rules

- **Joint authorship.** Not a PM doc that the others ack. Each role writes their section.
- **`What we're not doing` is mandatory and shared.** All three roles agree on scope cuts upfront.
- **Each role names one risk.** Forces honest pre-mortem thinking.
- **Definition of done is one paragraph, observable.** Not a checklist — a description of the world after launch.
- **Written before design or code.** Retroactive kickoffs miss the point.

## Refusal

If asked to publish a kickoff with one role missing, refuse — alignment requires everyone in the room.
