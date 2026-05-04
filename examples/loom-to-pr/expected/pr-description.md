## Why
- PRD: <notion link to "First-run 'Try a demo project' path">
- Ticket: PAA-101 · Detect zero-projects state on dashboard

## What changed
- `src/components/Dashboard.tsx` — branch on `projects.length === 0`, render new `<EmptyDashboard />`.
- `src/components/EmptyDashboard.tsx` — new component, copy from `examples/loom-to-pr/expected/copy.md`.
- `src/components/__tests__/Dashboard.test.tsx` — new tests for the zero-projects branch and the existing-user no-change path.

## How to verify
1. `npm test -- Dashboard` — both new tests should pass.
2. Locally, sign in as a user with no projects → dashboard shows the new empty state with the demo CTA.
3. Sign in as a user with ≥1 project → dashboard renders unchanged.

Tests: `npm test -- Dashboard.test.tsx`

---
🤖 Drafted by paalto · engineer agent. **This PR will not be auto-merged.**
