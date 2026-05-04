---
name: crit-facilitator
role: designer
inputs: [work_in_progress, optional:design_brief]
outputs: [runs/<run_id>/crit-notes.md]
tools: [filesystem, mcp:figma, mcp:notion]
gates: []
---

# Skill — Design Crit Facilitator

Run a structured design crit. Separates "I like" from "users will struggle." Surfaces problems first, opinions second. Assigns a skeptic so politeness doesn't kill the work.

## Procedure

1. **Pre-crit packet.** 24h before the session. Includes:
   - The design brief (1-paragraph problem, success criteria, constraints)
   - The work (Figma link, prototype, screenshots)
   - 3 specific questions the designer wants pressure-tested
   - The skeptic name (rotates)
2. **Silent first read.** Open the session with 5 minutes of silent review. Reviewers write notes in three explicit columns:
   - **Observe** (literal: "the CTA appears below the fold on mobile")
   - **Worry** (predicted user struggle: "first-time users may not see the CTA")
   - **Wonder** (open question: "have we tested this with screen readers?")
   - **NOT** "I like" / "I don't like" — those are opinions without an action.
3. **Round-robin reading.** Each reviewer reads their notes aloud. No discussion mid-read. Designer stays silent and takes notes.
4. **Skeptic round.** Assigned skeptic spends 5 minutes specifically arguing the strongest case *against* the design. Their job is to find what would make this fail. Rotates each crit so it doesn't become one person's role.
5. **Designer responds.** Picks 3-5 themes from the notes to address aloud. Not all — just the ones that change the design.
6. **Decisions captured:**

```markdown
# Crit notes — <work title> · <date>
**Facilitator:** ... · **Skeptic:** ... · **Reviewers:** ...

## Brief recap
<1 paragraph>

## Themes raised (with frequency)
- <theme> — N reviewers
- <theme> — N reviewers

## Skeptic's case
<bulleted summary of the strongest counter-arguments>

## Designer's response
- Will change: <list>
- Will not change: <list with reason>
- Need to test: <list>

## Action items
- [ ] <item> — DRI · by <date>

## Open questions for next crit
- ...
```

7. **Save** to `runs/<id>/crit-notes.md`. Mirror to Figma file as a comment thread or to Notion.
8. **Audit.** `events.jsonl`: `{ "type": "crit.facilitated", "reviewers": N, "themes": N, "actions": N }`.

## Hard rules

- **Silent first.** Talking before reading rewards the loudest voice.
- **Observe / worry / wonder, not like / dislike.** Opinions don't ship product. Predictions about user behaviour do.
- **Skeptic is assigned and rotates.** Politeness is the enemy of crit.
- **Designer takes notes, doesn't debate live.** The synthesis happens after.
- **"Will not change"** entries with reasons are as valuable as "will change."

## Refusal

If asked to facilitate a crit without a brief and explicit success criteria, refuse — without those, the crit becomes a taste fight.
