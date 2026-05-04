---
name: ship-a-feature
owner: orchestrator
description: The canonical long flow — brief in, draft PR + release-note draft out, with five human gates.
gates: [g1_vision, g2_prioritization, g3_design_taste, g4_merge_approval, g5_launch_comms]
---

# Workflow — Ship a Feature

The orchestrator runs this end-to-end. Steps marked **GATE** must pause for explicit `approve` / `revise <reason>` / `stop`. No gate is skippable.

```
[brief + optional transcripts/feedback]
        │
        ▼
1. PM · interview-synthesizer        (only if transcripts attached)
        │
        ▼
─── GATE g1 · Vision ────────────────────────────────────────
   Operator answers: "Is this the right thing to build?"
─────────────────────────────────────────────────────────────
        │
        ▼
2. PM · prd-drafter                  → Notion PRD (Draft)
        │
        ▼
─── GATE g2 · Prioritization ───────────────────────────────
   Operator answers: "Is this the right thing to build NOW?"
─────────────────────────────────────────────────────────────
        │
        ▼
3. Designer · ux-copy                → runs/<id>/copy.md
   Designer · wireframe-drafter      (v0.3+)
        │
        ▼
─── GATE g3 · Design taste ─────────────────────────────────
   Designer presents 2–3 options. Operator picks one.
─────────────────────────────────────────────────────────────
        │
        ▼
4. PM · ticket-breaker               → Linear tickets (1..N)
        │
        ▼
5. Engineer · pr-builder             → DRAFT PR for ticket 1/N
        │   (CI must be green)
        ▼
─── GATE g4 · Merge approval ───────────────────────────────
   Operator reviews PR, merges manually. Signals back.
─────────────────────────────────────────────────────────────
        │
        ▼  (loop back to step 5 for ticket 2/N, 3/N, …)
        │
        ▼  (after final ticket merged)
6. Engineer · release-notes          → Slack draft + runs/<id>/release-notes.md
        │
        ▼
─── GATE g5 · Launch comms ─────────────────────────────────
   Operator sends the message.
─────────────────────────────────────────────────────────────
        │
        ▼
[done — append run summary to runs/<id>/summary.md]
```

## Inputs

- `brief` (required) — free text. Short is fine; the synthesizer fills gaps.
- `transcripts/` (optional) — Loom/Granola/Fireflies plain-text or VTT.
- `feedback/` (optional) — exported Intercom/Zendesk threads.
- `repo` (required at step 5) — `<owner>/<name>`.

## Outputs

- Notion PRD URL.
- N Linear ticket URLs.
- N draft PR URLs (one per ticket).
- One release-note draft per release cycle.
- A complete `runs/<run_id>/` folder with `transcript.md`, `events.jsonl`, all intermediate artifacts.

## Failure modes

- **CI red on attempt 3** → Engineer escalates with stack trace + suspected cause. No g4 request.
- **PRD has unsourced claims** → PM stops at g1 summary, lists the unsourced lines.
- **Ticket count > 7** → PM refuses to break down; asks operator to scope down PRD.
- **Operator silent for >24h at any gate** → orchestrator pings once per day, never auto-advances.
