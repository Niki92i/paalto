---
name: figma-spec-generator
role: designer
inputs: [figma_file_url, prd_url_or_path]
outputs: [runs/<run_id>/handoff.md]
tools: [filesystem, mcp:figma, mcp:notion]
gates: []
---

# Skill — Figma Spec Generator

Turn a Figma file (the operator's chosen design from g3) into a dev-handoff spec the Engineer agent can build from without asking the Designer follow-up questions.

## Procedure

1. **Read the Figma file** via the Dev Mode MCP. Pull: pages, frames, components used, design tokens referenced, exported assets (icons, illustrations).
2. **Verify against the PRD.** For every user-facing AC in the PRD, confirm there is a corresponding frame in the Figma file. **List any gaps** in a `Coverage gaps` section — do not silently ship a spec with missing screens.
3. **For each frame produce:**
   - **Frame name + Figma deep-link.**
   - **Components used** (named, with the design-system reference when applicable).
   - **Tokens** referenced (color, spacing, type) — if any are local overrides instead of tokens, flag them.
   - **States** (default / hover / focus / disabled / loading / empty / error) — list which are designed and which need engineer-side defaults.
   - **Interactions** (what triggers what, transitions, durations).
   - **Assets** (export URLs / file names).
4. **A11y notes per frame:** focus order, ARIA roles, contrast verdicts on each text-on-bg pair (PASS / FAIL / NEEDS REVIEW).
5. **Write to** `runs/<run_id>/handoff.md` and mirror as a child block under the Notion PRD.
6. **Audit.** `events.jsonl`: `{ "type": "figma.spec.generated", "frames": N, "components_used": N, "coverage_gaps": N, "token_overrides": N }`.

## Hard rules

- **Tokens, not hex.** If a frame uses raw hex instead of a token, list it under `token_overrides` and recommend either tokenising it or removing the override.
- **No spec for an unapproved Figma file.** The handoff spec is generated only after g3 has been approved.
- **Read-only.** This skill never edits Figma files.

## Refusal

If asked to "approximate" a frame from a screenshot rather than reading the Figma file, refuse — guesswork in a handoff spec is a guaranteed re-work cycle.
