---
name: usability-synthesis
role: designer
inputs: [session_notes_or_recordings, research_plan_url]
outputs: [runs/<run_id>/usability-synthesis.md, optional:rainbow_sheet.csv]
tools: [filesystem, mcp:notion]
gates: [emits_g3_options]
---

# Skill — Usability Test Synthesis

Post-test analysis. Rainbow spreadsheet → affinity grouping → severity-ranked findings → next steps. Severity is about user impact, not designer ego.

## Procedure

1. **Read the research plan.** Pull tasks tested, success criteria per task, hypotheses being validated.
2. **Build the rainbow spreadsheet.** Rows = observations. Columns = participants (P1, P2, …). A cell = ✓ if that participant exhibited that observation, color-coded per task. Saved as `runs/<id>/rainbow_sheet.csv`.
3. **Affinity-group the observations.** Cluster into themes. A theme exists if **3+ of N participants** exhibit it (Nielsen rule for n=5: anything at 3+ is a real pattern; n=8: anything at 4+).
4. **Severity-rank each theme** using a Nielsen-style rubric:
   - **0 — Not a problem.** Observed but no impact.
   - **1 — Cosmetic.** Fix if time permits.
   - **2 — Minor.** Low priority. User notices but recovers.
   - **3 — Major.** High priority. User struggles, may not recover unaided.
   - **4 — Catastrophe.** Blocks task completion. Must fix before launch.
5. **Per theme write:**
   - Description (in user's voice where possible — quote)
   - Frequency (N of N)
   - Severity (0-4)
   - Recommendation
   - Confidence (high/med/low)
6. **Write:**

```markdown
# Usability synthesis — <study> · <date>
N = <participants> · sessions: <links>

## Headline
<one paragraph: did the design pass the success criteria?>

## Themes (severity-ranked)
### Theme 1 — <short name> · severity 4 · 5/5 participants
<description, quotes>
**Recommendation:** ...
**Confidence:** high

### Theme 2 — ...

## Hypotheses revisited
| Hypothesis | Falsifier met? | Verdict |

## What worked
- <bullets>

## Recommendations (prioritized)
1. **Must fix before launch:** <items, severity 3-4>
2. **Should fix this cycle:** <severity 2>
3. **Backlog:** <severity 0-1>

## Method notes
- Recruitment: ...
- Bias risks: <e.g., moderator over-prompted on task 3>
- What we'd change about the protocol next time

## Appendix
- Per-participant summary
- Quotes pool (with timestamps + consent)
```

7. **Mirror to Notion** under Research database.
8. **Emit G3** — design taste gate gets a structured "options summary" with the severity-3+ themes and 2-3 design directions to address them.
9. **Audit.** `events.jsonl`: `{ "type": "usability.synthesized", "n": N, "themes": N, "severity_4": N, "severity_3": N }`.

## Hard rules

- **3+ of 5 (or 4+ of 8) is a pattern.** Below that, exploratory only — don't over-index on one participant.
- **Quote in the user's voice.** Designer paraphrases lose signal.
- **Severity is about user impact, not designer ego.** A clever but unused feature flagged as severity 4 is right.
- **Ask "what next" not "did you understand."** Self-report on understanding is unreliable; observed behaviour is data.
- **Method notes are mandatory.** Future readers need to know what biases shaped the findings.

## Refusal

If asked to draw a conclusion from a single participant, refuse — that's an anecdote. Surface as a hypothesis to test next round.
