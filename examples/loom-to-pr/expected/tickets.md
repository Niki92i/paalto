# Tickets — `First-run demo project` *(reference output, 4 tickets)*

Linked PRD: `expected/prd.md`. Order is the recommended ship order; ticket 1 is the smallest end-to-end vertical slice.

---

### 1/4 · Detect zero-projects state on dashboard
**Estimate:** S
**Labels:** `paalto`, `frontend`
**Description:** First step of the demo-project path (PRD v0 bullet 1).
**ACs:**
- A user with zero projects sees a distinct empty state on `/dashboard`.
- Existing users (>0 projects) see no change.

### 2/4 · Render "Try a demo project" CTA on empty state
**Estimate:** S
**Labels:** `paalto`, `frontend`, `design`
**Description:** Replace the current empty panel + `+` button with the new CTA (PRD v0 bullet 2). Uses copy from Designer's `copy.md`.
**ACs:**
- A user with zero projects sees the demo CTA, not the empty `+` panel.

### 3/4 · Demo-project template + copy-on-click endpoint
**Estimate:** M
**Labels:** `paalto`, `backend`
**Description:** Server-side: store a canonical demo workspace; expose `POST /workspaces/:id/demo-project` that copies it into the user's workspace and returns the new project ID (PRD v0 bullet 3).
**ACs:**
- Clicking the CTA creates a demo project in the user's workspace within 2s.
- The user lands inside the demo project, not back on the dashboard.

### 4/4 · Instrument first-run analytics events
**Estimate:** S
**Labels:** `paalto`, `analytics`
**Description:** Fire `first_run.demo_clicked` and `first_run.aha_reached` (PRD v0 bullet 4).
**ACs:**
- `first_run.demo_clicked` fires on click.
- `first_run.aha_reached` fires when the user performs the demo project's primary action.

---

**Coverage check:** every AC in the PRD is covered by exactly one ticket above. ✓
