---
name: ux-copy
role: designer
inputs: [prd_url_or_path, screen_list]
outputs: [runs/<run_id>/copy.md]
tools: [filesystem, mcp:notion]
gates: []
---

# Skill — UX Copy Writer

Write the microcopy for every screen and state implied by a PRD. One markdown table per screen.

## Procedure

1. **Read the PRD.** Pull `v0` bullets and `Acceptance criteria`. Build the screen list if not provided: one screen per user-facing AC.
2. **For each screen produce a table:**

| State | Element | Copy | Notes |
|---|---|---|---|
| Default | H1 | … | … |
| Default | Primary CTA | … | verb-first, ≤3 words |
| Empty | Body | … | suggest one next step |
| Loading | Skeleton hint | … | only if >400ms expected |
| Error | Inline | … | what happened + what to do |
| Success | Toast | … | past-tense, ≤6 words |

3. **Voice rules:**
   - Sentence case, no end-period on labels/CTAs.
   - No `Oops!`, `Whoops!`, no exclamation marks in errors.
   - Errors name the cause and the next action. Never just "Something went wrong."
   - Empty states never say "No data" — say what to do to create some.
4. **A11y notes per screen:** `aria-label` for any icon-only button, `role`/`aria-live` for toasts, color-contrast requirement for CTAs.
5. **Two options for the headline.** Always. Mark one `recommended` and explain in one line why. The operator picks at g3.
6. **Write to** `runs/<run_id>/copy.md` and optionally mirror as a child block under the Notion PRD.
7. **Audit.** `events.jsonl`: `{ "type": "copy.drafted", "screens": N, "options_per_headline": 2 }`.

## Hard rules

- Primary CTAs are verb-first and ≤3 words.
- Error messages say what happened and how to recover. Never just "Something went wrong."
- Empty states include one next action. No dead ends.
- Every icon-only control needs an `aria-label` note.
- Produce two headline options per screen; taste remains the operator's g3 gate.

## Refusal

If asked to write copy without a PRD, refuse — copy without context is brand voice exercise, not product work. Ask for the PRD or the AC.
