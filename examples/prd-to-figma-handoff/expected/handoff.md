# Handoff spec — First-run demo path  *(reference output)*

**Figma file:** `<deep-link to chosen design>`
**PRD:** `examples/prd-to-figma-handoff/input/prd.md`
**Coverage gaps:** none. All 5 PRD ACs map to a frame below.

---

## Frame 1/3 · Empty dashboard
**Figma:** `<deep-link>`
**Components used:** `<DashboardShell>`, `<EmptyState>` (new), `<Button variant="primary">`, `<TextLink>`
**Tokens:**
- color: `--brand-primary` (CTA bg), `--ink` (text), `--bone` (page bg)
- spacing: `space-6` (hero card padding), `space-4` (gap H1↔Sub), `space-2` (gap Sub↔CTA)
- type: `text-display-md` (H1), `text-body-lg` (Sub), `text-button-md` (CTA)
**States:** default · loading (button label "Setting up your demo…", `aria-busy="true"`) · error (inline message under CTA)
**Interactions:** click CTA → `POST /workspaces/:id/demo-project` → on 200, route to `/projects/:id` (the new demo project)
**Assets:** none (text + button only)

## Frame 2/3 · Inside the demo project (first frame)
**Figma:** `<deep-link>`
**Components used:** `<ProjectShell>`, `<Banner variant="info" dismissable>`, pulse-highlight wrapper (new utility)
**Tokens:** color: `--bone` (banner bg), `--rust` (pulse stroke); motion: `motion-pulse-2s` (respects `prefers-reduced-motion`)
**States:** default · banner-dismissed (banner removed, pulse remains until first interaction) · post-interaction (pulse removed)
**Interactions:** click "Got it" → dismiss banner (no toast) · first interaction with primary action → fire `first_run.aha_reached` → route to Frame 3 logic
**A11y:** banner `role="status"`; pulse animation hidden under `prefers-reduced-motion: reduce`

## Frame 3/3 · Post-aha toast
**Figma:** `<deep-link>`
**Components used:** `<Toast variant="success">`, `<TextLink variant="inline">`
**Tokens:** color: `--ink` (toast bg), `--brand-primary` (link)
**States:** showing · dismissed (auto after 6s, or via Esc / focus-out)
**Interactions:** "Start a real project" → opens the original `+` flow
**A11y:** `role="status"`, `aria-live="polite"`, focusable, dismiss restores prior focus
