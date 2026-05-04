---
name: interview-synthesizer
role: pm
inputs: [transcripts[]]
outputs: [runs/<run_id>/synthesis.md]
tools: [filesystem]
gates: []
---

# Skill — Interview Synthesizer

Convert raw interview transcripts (Loom, Granola, Fireflies, plain VTT) into a sourced synthesis that the PRD Drafter can build on without re-reading the originals.

## Procedure

1. **Load transcripts.** Accept VTT, SRT, JSON (Granola/Fireflies), or plain markdown. Normalize to `[participant] [hh:mm:ss] text`.
2. **Pass 1 — extract verbatim quotes.** For each transcript, pull every sentence that contains:
   - A pain expression ("I just sat there", "I had no idea", "I closed the tab")
   - A workaround ("so I asked my colleague")
   - A trigger/why-now ("I came back because…")
   - A desired outcome ("I wish it just…")
   Keep the timestamp. **Never paraphrase in pass 1.**
3. **Pass 2 — cluster into themes.** Group quotes by JTBD-like themes (3–7 themes max). Name each theme as a short user phrase, not an internal label.
4. **Pass 3 — for each theme write:**
   - **Theme:** the short phrase.
   - **Strength:** N participants out of M raised it.
   - **Top quotes:** 2–3 verbatim, each with `[participant timestamp]`.
   - **Implications:** 1–3 bullets, hedged ("suggests", not "proves").
   - **Open questions for next round:** what would falsify or sharpen this.
5. **Write to** `runs/<run_id>/synthesis.md` in the structure below.
6. **Audit.** `events.jsonl`: `{ "type": "synthesis.drafted", "transcripts": N, "themes": N, "quotes": N }`.

## Structure

```markdown
# Synthesis — <topic>

**Sources:** N transcripts (<list filenames + dates>)
**Method:** verbatim extract → cluster → label

## Theme 1 — "<participant phrase>"
**Strength:** 3/5 participants
**Quotes:**
- "I just sat there." — Maya, 00:00:08, 2026-04-29
- "..." — ...
**Implications:**
- ...
**Open questions:**
- ...

## Theme 2 — ...
```

## Refusal

- If asked to add a theme that has no supporting quote: refuse and label it `[NO QUOTE]` in open questions.
- If asked to combine themes raised by only 1 participant each into one "trend": refuse — that's confirmation bias, not synthesis.
