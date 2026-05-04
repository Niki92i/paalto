---
name: research-plan
role: pm
inputs: [research_question, optional:audience]
outputs: [runs/<run_id>/research-plan.md]
tools: [filesystem, mcp:notion]
gates: []
---

# Skill — User Research Plan

The pre-interview artifact. Produces a screener, an interview guide, and an explicit list of hypotheses to validate / falsify before talking to anyone. Pairs with `interview-synthesizer` (post).

## Procedure

1. **Sharpen the research question.** One sentence. If "do users like X?" — push back; rewrite to a behaviour-revealing question. ("Walk me through the last time you tried to do X" beats "do you like X?")
2. **State falsifiability.** What finding would make us drop the bet? If you can't answer, you're not ready to research.
3. **Build screener.** 4-6 questions. **Recruit to exclusion criteria first** — wrong participants waste weeks. Examples:
   - Used the product in last 30 days (Y/N)
   - Role / company size
   - Disqualify: in-house testers, friends of team
4. **Hypotheses to validate / falsify.** List 3-7. Each has a falsifier. ("If 4/5 participants don't mention X unprompted in the first 5 minutes, the bet is wrong.")
5. **Interview guide.** 5-8 open questions, behaviour-first. Order: warm-up → context → behaviour → reflection. Each question has a follow-up prompt. **No "would you" / "do you like" / "is this useful" — those are unreliable.**
6. **Recruit, format, logistics.**
   - Sample size (5-8 for usability, 10-15 for discovery)
   - Format (45-60 min, video, recorded with consent)
   - Incentive
   - Note-taker / observer protocol
7. **Analysis plan.** How will we synthesize? (Hand off to `interview-synthesizer` skill.) Where will quotes live? Who reads the synthesis?
8. **Write the plan:**

```markdown
# Research plan — <topic>

## Question
<one sentence>

## Falsifier
<what finding kills the bet>

## Hypotheses (and what would falsify each)
- H1: ... — falsifier: ...
- H2: ... — falsifier: ...

## Audience & screener
- Target: <description>
- Disqualifiers: <list>
- Screener questions: <list>

## Sample size & recruitment
- N = <X>; recruited via <channel>
- Incentive: <amount/type>

## Format
- Duration: <min>; format: <video/in-person>; recording: <consent process>

## Interview guide
1. Warm-up: ...
2. Context: ...
3. Behaviour: ... (follow-up: ...)
...

## Logistics
- DRI: <name> · note-taker: <name> · observer cap: <N>
- Tooling: <Granola / Fireflies / Zoom>
- Timeline: kickoff <date> → readout <date>

## Analysis plan
- Synthesizer skill: pm/interview-synthesizer
- Output: runs/<id>/synthesis.md mirrored to Notion under <db>
```

9. **Audit.** `events.jsonl`: `{ "type": "research.planned", "n": N, "hypotheses": N, "format": "..." }`.

## Hard rules

- **Behaviour over self-report.** "Do you like X" is unreliable; "walk me through the last time" is data.
- **Falsifier is mandatory.** No falsifier = not research, just confirmation seeking.
- **Recruit to exclusion first.** Wrong participants > 0 participants.
- **5 users for usability** (Nielsen) — diminishing returns past 8. For generative discovery, 10-15.
- **Continuous discovery beats annual research.** Schedule weekly slots, not quarterly sprints (Teresa Torres).

## Refusal

If asked to plan research without a falsifiable hypothesis, refuse and ask for the bet first. "Just talking to users" is a luxury most teams can't afford as a default.
