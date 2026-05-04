# Live Integration Test

This is the acceptance test that proves paalto works against real tools, not only local fixtures. Run it against sandbox resources first.

## Goal

Starting from the Loom-to-PR example, prove that Claude Code can use paalto to create:

- A draft PRD in Notion.
- Linear tickets.
- A GitHub draft PR in a sandbox repo.
- A Slack release-note draft saved locally, not sent.
- A complete `runs/<run_id>/events.jsonl` audit trail.
- Pauses at all human gates.

## Pass criteria

The run passes only if all of these are true:

1. `npm run doctor`, `npm run validate`, and `npm run guardrails` pass before the live run.
2. The workflow pauses at `g1_vision`, `g2_prioritization`, `g3_design_taste`, `g4_merge_approval`, and `g5_launch_comms`.
3. Notion receives a PRD with Draft status.
4. Linear receives no more than 7 tickets for the scoped example.
5. GitHub receives a draft PR only. It must not be marked ready for review and must not be merged by paalto.
6. Slack output is saved as a local draft and surfaced to the operator. It must not be sent automatically.
7. `runs/<run_id>/events.jsonl` contains `run.start`, `step.start`, `step.end`, gate events, `prd.drafted`, `tickets.created`, `pr.opened`, `release-notes.drafted`, and `run.end` or a clear stopped/escalated terminal event.
8. Any failure is documented in `runs/<run_id>/summary.md` with the blocker and next action.

## 1. Create sandbox resources

### GitHub

Create a sandbox repository that paalto can safely modify. Do not use a production repo for the first test.

Minimum requirements:

- A default branch.
- A tiny app or docs file that can be changed by the PR Builder.
- A basic CI workflow, even if it only runs a simple command.
- A fine-grained PAT scoped to this repo only.

Required token permissions:

- `contents: read and write`
- `pull_requests: read and write`
- `metadata: read`

Do not grant admin, secrets, organization, delete, or merge-specific permissions.

### Linear

Create or choose a test team/project.

Record:

- `LINEAR_API_KEY`
- `LINEAR_TEAM_ID`

Use a team where test tickets are acceptable.

### Notion

Create a Notion internal integration and a test PRD database.

Minimum database properties:

- `Name` or `Title`
- `Status` with a `Draft` option
- `Summary` or rich text field
- `Source` or URL field

Share the PRD database with the integration. Do not share the entire workspace root.

Record:

- `NOTION_API_KEY`
- `NOTION_PRD_DATABASE_ID`

Other Notion IDs can stay blank for the first live test unless the selected skill needs them.

### Slack

Create a private test channel and Slack bot.

Minimum scope:

- `chat:write`

Invite the bot to the test channel.

Record:

- `SLACK_BOT_TOKEN`
- `SLACK_DEFAULT_CHANNEL`

## 2. Configure paalto

From the repo root:

```bash
cp .env.example .env
```

Fill at least:

```bash
GITHUB_TOKEN=
GITHUB_DEFAULT_OWNER=
GITHUB_DEFAULT_REPO=
LINEAR_API_KEY=
LINEAR_TEAM_ID=
NOTION_API_KEY=
NOTION_PRD_DATABASE_ID=
SLACK_BOT_TOKEN=
SLACK_DEFAULT_CHANNEL=
```

Then run:

```bash
npm run doctor
npm run validate
npm run guardrails
```

`doctor` should still pass. It may warn about optional integration keys, but the day-one keys above should be present.

## 3. Configure MCP in Claude Code

Use `integrations/mcp.json` as the MCP server catalog for Claude Code.

The exact UI/command can vary by Claude Code version. The important requirement is that Claude Code can see these servers from the paalto workspace:

- `github`
- `linear`
- `notion`
- `slack`

After configuring MCP, open the paalto repo root in Claude Code and ask:

```text
List the available MCP servers and confirm you can see github, linear, notion, and slack. Do not call any write tool yet.
```

If any server is missing, stop and fix MCP before running the workflow.

## 4. Run the workflow

In Claude Code, paste:

```text
Run workflows/ship-a-feature.md using examples/loom-to-pr/input/brief.md as the brief and examples/loom-to-pr/input/loom-transcript.vtt as the transcript. Repo: <sandbox-owner>/<sandbox-repo>.

Use the five human gates exactly as written. Do not merge code. Do not send Slack messages. Open draft PRs only. Write all local artifacts to runs/<run_id>/.
```

At each gate, respond with one of:

```text
approve
revise <reason>
stop
```

For the first acceptance test, use `approve` only after reading each summary.

## 5. Inspect outputs

After the run, collect:

- Notion PRD URL.
- Linear ticket URLs.
- GitHub draft PR URL.
- Local `runs/<run_id>/` folder path.
- `runs/<run_id>/events.jsonl`.
- `runs/<run_id>/summary.md`.
- `runs/<run_id>/slack-draft.json`.

Confirm:

```bash
latest=$(ls -td runs/*/ | head -1)
cat "$latest/events.jsonl"
cat "$latest/summary.md"
```

Do not commit the run folder unless it has been scrubbed and intentionally copied into `examples/`.

## 6. Failure handling

| Failure | Expected action |
|---|---|
| MCP server missing | Stop. Fix Claude Code MCP config. Do not run the workflow. |
| Notion 401/403 | Share only the target database with the Notion integration, then retry. |
| Linear 403 | Verify API key workspace and `LINEAR_TEAM_ID`. |
| GitHub 403 | Verify fine-grained PAT repo target and `contents`/`pull_requests` write permissions. |
| Slack 403 | Invite bot to channel and verify `chat:write`. |
| PR opened as non-draft | Fail the test. Fix Engineer/PR Builder instructions and guardrails before continuing. |
| Slack message sent automatically | Fail the test. Fix Release Notes instructions and guardrails before continuing. |
| Gate skipped | Fail the test. Fix Orchestrator/workflow instructions and guardrails before continuing. |
| CI red after 3 attempts | Expected escalation. The run can pass as a guarded failure if `events.jsonl` and `summary.md` explain the blocker and no g4 approval was requested. |

## 7. Record the acceptance result

Create a sanitized note in `docs/readiness.md` or a new `examples/<date>-live-run-summary.md` only after removing:

- API keys
- customer data
- private repo names if needed
- internal Notion/Linear/Slack links if not meant for public release

A good public summary includes:

- Date.
- Tool versions.
- Which integrations were connected.
- Whether each pass criterion succeeded.
- Links to public sandbox PRs only.
- Redacted excerpts from `events.jsonl`.
