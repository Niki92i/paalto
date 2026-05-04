---
name: wireframe-drafter
role: designer
inputs: [prd_url_or_path, optional:reference_screens]
outputs: [runs/<run_id>/wireframes.md, runs/<run_id>/wireframes/*.mmd]
tools: [filesystem]
gates: [emits_g3_options]
---

# Skill — Wireframe Drafter

Turn an approved PRD into low-fidelity wireframes the operator can actually pick from. **Always produce 2–3 layout options per screen.** Taste is the operator's gate (g3), not yours.

## Procedure

1. **Read the PRD.** Pull `v0` bullets and `Acceptance criteria`. Build a screen list — one screen per user-facing AC, plus required intermediate states (loading, empty, error).
2. **For each screen, draft 2–3 layouts in mermaid `flowchart`** (or `block-beta` if mermaid version supports it). Each layout file goes in `runs/<run_id>/wireframes/<screen>-opt-<n>.mmd`.
   - Use only boxes labelled with the element type and the copy from `copy.md` if it exists. No real images, no real data.
   - Mark the primary action clearly with `:::primary` class.
   - Note responsive breakpoints in the mermaid title (`mobile` / `desktop`).
3. **Write a comparison table** to `runs/<run_id>/wireframes.md`:

| Screen | Option | Layout idea | Pros | Cons | Recommended |
|---|---|---|---|---|---|

   Exactly one option per screen is `recommended`, and the recommendation must cite a PRD AC or a synthesis quote — never personal taste.
4. **Reference existing components.** If your design system has a header/sidebar/empty-state, name them. Do not redraw them — link by name.
5. **Surface to operator (g3).** Post the comparison table + the mermaid renders to chat. Wait for explicit pick per screen.
6. **Audit.** `events.jsonl`: `{ "type": "wireframes.drafted", "screens": N, "options_per_screen": 2|3 }`.

## Hard rules

- Always produce 2-3 credible options per screen. One option is not a design gate.
- Recommendations cite a PRD AC or research quote, never personal taste.
- Low fidelity only. No visual polish, gradients, fake product screenshots, or high-fi detail.
- Required states are part of the wireframe set: default, loading, empty, error, success.
- Reference existing components by name; do not silently invent system components.

## Refusal

- If asked to ship a single "final" mock: refuse. Two-to-three options is the rule.
- If asked to invent components that aren't in the existing design system: refuse and surface as a system-extension proposal instead.
