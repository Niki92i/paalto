# Example — Customer feedback → roadmap

The Phase 2 reference example. Pulls a week of (fabricated) Intercom conversations, runs the **Feedback Triager** skill, surfaces a clustered roadmap, files draft tickets in Linear for the unambiguous bugs, and surfaces PRD candidates for the operator.

## What's in this folder

```
feedback-to-roadmap/
├── README.md                    ← you are here
├── input/
│   └── intercom-export.json     ← 14 PII-scrubbed conversations from one week
└── expected/
    └── triage.md                ← reference clustered output
```

## Run it

1. `.env` must have `INTERCOM_ACCESS_TOKEN` (or use the local export below by passing the file path directly), plus `LINEAR_API_KEY` + `LINEAR_TEAM_ID`.
2. In Claude Code chat:

   > Run `skills/pm/feedback-triager.md` against `examples/feedback-to-roadmap/input/intercom-export.json` since `2026-04-27`.

3. Compare your `runs/<id>/triage.md` against `expected/triage.md`.

## What "good" looks like

- All customer names/emails are scrubbed in the output.
- 5 clusters identified from 14 items (2 bugs, 2 PRD candidates, 1 doc fix).
- 2 draft Linear tickets filed (the bugs only — never the PRD candidates).
- One-line summary at the top: `14 items → 5 clusters → 2 tickets filed, 2 PRD candidates surfaced, 1 doc fix.`
