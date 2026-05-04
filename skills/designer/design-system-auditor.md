---
name: design-system-auditor
role: designer
inputs: [figma_file_url, design_system_source]
outputs: [runs/<run_id>/ds-audit.md]
tools: [filesystem, mcp:figma]
gates: []
---

# Skill — Design-system Auditor

Compare a Figma file against the project's design system and report deviations. Does not auto-fix anything — surfaces a remediation plan.

## Procedure

1. **Load both sources.** Figma file via Dev Mode MCP; design system from `design_system_source` (Figma library URL, JSON tokens file, or `design-tokens.css`).
2. **Audit four dimensions:**
   - **Color** — every fill/stroke must reference a token. List every raw hex with frame+layer.
   - **Type** — every text layer must use a defined text style. List exceptions.
   - **Spacing** — every gap/padding must be on the spacing scale. List off-scale values.
   - **Components** — flag every "detached instance" of a system component. Local copies are deviations.
3. **For each deviation produce a row:**

| Frame | Layer | Property | Found | Expected | Severity | Suggested fix |
|---|---|---|---|---|---|---|

   Severity: `BLOCKER` (would break consistency at runtime) / `MAJOR` (visible in product) / `MINOR` (review-only).
4. **Write a one-paragraph verdict** at the top: total deviations, blockers, recommended action (`approve as-is` / `fix blockers then approve` / `restart`).
5. **Write to** `runs/<run_id>/ds-audit.md`.
6. **Audit.** `events.jsonl`: `{ "type": "ds.audit", "deviations": N, "blockers": N, "verdict": "..." }`.

## Hard rules

- Audit against the canonical source only. If code tokens are canonical, Figma is derivative.
- Raw hex, detached instances, and off-scale spacing are deviations until explained.
- Severity must reflect user-visible risk and engineering cost, not personal preference.
- The skill reports and recommends; it never patches the design file.
- Every blocker includes the exact frame/layer and suggested token/component replacement.

## Refusal

- Never patch the Figma file from this skill. Suggestions only.
- If the design system source is missing or stale, refuse and ask for the canonical source. Don't audit against an undefined standard.
