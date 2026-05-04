# Example — Loom transcript → draft PR

The reference end-to-end demo. A single Loom transcript walks all the way through the `ship-a-feature` workflow and produces a draft GitHub PR plus a Slack release-note draft. Target time on a fresh clone: **under 60 minutes.**

## What's in this folder

```
loom-to-pr/
├── README.md             ← you are here
├── input/
│   ├── brief.md          ← the operator's two-sentence brief
│   └── loom-transcript.vtt   ← raw transcript from a 12-min user interview
├── expected/
│   ├── prd.md            ← what the PM agent should produce (reference)
│   ├── tickets.md        ← what the Ticket Breaker should produce (4 tickets)
│   ├── copy.md           ← UX copy for the 3 screens
│   ├── pr-description.md ← reference body of the draft PR
│   └── release-notes.md  ← reference long-form release note
└── recording.md          ← link to a 5-min screencast of a real run
```

> The example ships with the `expected/` artifacts so you can diff your run against a reference. They are *not* the only valid outputs — agents that produce equivalent quality artifacts are fine.

## Run it

1. Make sure `.env` is filled in for **GitHub, Linear, Notion, Slack** (see `../../.env.example`).
2. Open the `paalto/` repo root in Claude Code.
3. In chat, paste:

   > Run `workflows/ship-a-feature.md` using `examples/loom-to-pr/input/brief.md` as the brief and `examples/loom-to-pr/input/loom-transcript.vtt` as the transcript. Repo: `Niki92i/paalto-sandbox`.

4. Approve at each gate when prompted.
5. Compare your run's `runs/<id>/` folder against `expected/`.

## Cloneability bar

If a stranger can clone `paalto`, fill in `.env`, and reach a green-CI draft PR using this example in **under 60 minutes**, the MVP is doing its job. If not, file an issue with the timestamp where you got stuck.
