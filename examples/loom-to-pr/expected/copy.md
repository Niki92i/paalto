# UX Copy — First-run demo path  *(reference output)*

## Screen 1 — Empty dashboard (zero projects)

| State | Element | Copy | Notes |
|---|---|---|---|
| Default | H1 (option A · **recommended**) | Start with a demo project | concrete, verb-first; matches PRD bet |
| Default | H1 (option B) | Nothing here yet — try a demo | softer, but two ideas in one line |
| Default | Subhead | See what paalto does in 90 seconds. | mirrors the time goal in the PRD |
| Default | Primary CTA | Try a demo project | verb-first, 4 words |
| Default | Secondary link | I'll start from scratch | escape hatch; opens the original `+` flow |
| Loading | Button label | Setting up your demo… | replaces CTA label during the 2s copy |
| Error | Inline | We couldn't set up the demo. Try again, or start a project from scratch. | names cause + offers next action |
| Success | (none — route into the demo project) | — | toast feels redundant once the user lands inside |

A11y: CTA must meet WCAG AA (≥4.5:1 against background). Loading state needs `aria-busy="true"` on the button.

---

## Screen 2 — Inside the demo project (first frame)

| State | Element | Copy | Notes |
|---|---|---|---|
| Default | Banner | This is a demo project. Click around — nothing here is real. | sets expectations; dismissable |
| Default | Banner CTA | Got it | sentence case, no period |
| Default | Highlight on primary action | Try this first | thin pulse animation, ≤2s |

A11y: banner uses `role="status"`; pulse animation respects `prefers-reduced-motion`.

---

## Screen 3 — After "aha" action

| State | Element | Copy | Notes |
|---|---|---|---|
| Success | Toast | You did the thing. That's the demo. | past tense, ≤6 words; specific to the demo's primary action |
| Success | Inline CTA (in toast) | Start a real project | one click to leave the demo |

A11y: toast `role="status"`, `aria-live="polite"`, auto-dismiss after 6s but keyboard-focusable.
