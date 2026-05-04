# PRD — First-run "Try a demo project" path  *(reference output)*

**One-line:** New users hit one big button on the empty dashboard, land in a pre-loaded demo project, and reach an "aha" action in under 90 seconds.

## Problem
First-run users land on an empty dashboard with four blank panels and a `+` button that asks for a data-source connection.
- Maya (Loom interview, 2026-04-29, 00:00:13): "I'm a designer. I came here because someone said it was good for design reviews. So I closed the tab."
- "Three of the last five user interviews said the same thing" (brief, line 1).

## Why now
- Day-1 churn signal in last week's interview cohort (3/5).
- No code change yet attempted; cheapest test we can run is a demo-project path.

## The bet
If first-run users land in a populated demo project rather than an empty dashboard, day-1 retention will improve materially (target: +15pp on `dashboard → first action ≤ 90s`).

## Out of scope
- Personalized onboarding by role.
- Tutorial overlays / coachmarks.
- Changes to the existing "connect a data source" flow.

## v0 — what we ship first
1. Detect "no projects" state on first dashboard render.
2. Replace empty state with a single primary CTA: **"Try a demo project."**
3. On click, copy a pre-built demo project into the user's workspace and route them into it.
4. Track `first_run.demo_clicked` and `first_run.aha_reached` events.

## Acceptance criteria
- [ ] A user with zero projects sees the demo CTA, not the empty `+` panel.
- [ ] Clicking the CTA creates a demo project in their workspace within 2s.
- [ ] The user lands inside the demo project, not back on the dashboard.
- [ ] `first_run.demo_clicked` fires on click; `first_run.aha_reached` fires when the user performs the demo project's primary action.
- [ ] Existing users (>0 projects) see no change to their dashboard.

## Open questions
- What exactly is the demo project's content? *unblock-by: 2026-05-08, owner: PM*
- Where do we store the demo template — code, DB seed, or a real "system" workspace? *owner: Engineer at planning*

## Future (v1, v2)
- v1: A/B test demo content variants by role hint at signup.
- v2: Coachmark overlay inside the demo project.
