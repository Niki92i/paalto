# Example — PRD → Figma handoff

The Phase 3 reference example. Takes the same first-run-demo PRD from `loom-to-pr`, runs the Designer agent through wireframes → Figma spec → DS audit → a11y review, and surfaces a clean handoff package the Engineer agent can build from.

## What's in this folder

```
prd-to-figma-handoff/
├── README.md
├── input/
│   └── prd.md                 ← copy of examples/loom-to-pr/expected/prd.md
└── expected/
    ├── wireframes.md          ← 3 screens × 2 layout options each, mermaid
    ├── handoff.md             ← Figma Dev-Mode spec (reference shape)
    ├── ds-audit.md            ← 4 deviations, 1 blocker
    └── a11y.md                ← 3 findings, 1 blocker
```

## Run it

1. `.env` must have `FIGMA_ACCESS_TOKEN` and a Figma file URL set in chat.
2. In Claude Code:

   > Using `examples/prd-to-figma-handoff/input/prd.md` and Figma file `<URL>`, run skills `designer/wireframe-drafter` → `designer/figma-spec-generator` → `designer/design-system-auditor` → `designer/a11y-reviewer` in sequence. Pause for me at g3.

3. Compare your `runs/<id>/` outputs against `expected/`.

## What "good" looks like

- 2–3 layout options per screen — never just one.
- Coverage gaps section in `handoff.md` lists any AC without a corresponding Figma frame.
- DS audit catches at least the obvious blocker (the "Try a demo project" CTA shipped as a raw hex `#FF4500` instead of `--brand-primary`).
- A11y review flags the contrast on the secondary "I'll start from scratch" link if it's grey-on-white below 4.5:1.
