# `runs/` — the audit trail

Every invocation of the orchestrator (or any skill, when run standalone) creates a folder here:

```
runs/
└── 2026-05-04T18-22-10Z__ship-a-feature__a3f1/
    ├── transcript.md       # human-readable narrative of the run
    ├── events.jsonl        # one JSON object per agent action
    ├── plan.md             # Engineer's pre-diff plan (when applicable)
    ├── prd.md              # PM's local copy of the Notion PRD
    ├── copy.md             # Designer's UX copy tables
    ├── release-notes.md    # Engineer's long-form release note
    ├── slack-draft.json    # Slack blocks, NOT sent
    └── summary.md          # final run summary
```

This folder is **gitignored by default** because it can contain customer data, transcripts, and internal links. If you want to commit a run as a teaching example (like `examples/loom-to-pr/`), copy it manually into `examples/` and scrub PII first.

## `events.jsonl` schema

One JSON object per line. Required fields:

```json
{ "ts": "2026-05-04T18:22:10Z",
  "run_id": "a3f1",
  "agent": "engineer",
  "skill": "pr-builder",
  "type": "step.start",
  "inputs_hash": "sha256:...",
  "tool_calls": [] }
```

Event `type` values:
- `run.start` / `run.end`
- `step.start` / `step.end`
- `gate.requested` / `gate.approved` / `gate.revised` / `gate.stopped`
- Skill-specific terminal events: `prd.drafted`, `tickets.created`, `pr.opened`, `release-notes.drafted`, etc.

Every external API call should be reflected as a `tool_calls` entry on the enclosing `step.end`.
