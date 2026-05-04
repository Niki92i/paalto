# Quickstart

After [install](install.md), the fastest way to feel paalto is to run the reference example end-to-end.

## 5-minute no-API path

This is the fastest way to prove the repo is real before you trust it with keys:

```bash
git clone https://github.com/Niki92i/paalto.git
cd paalto
npm run doctor
npm run demo
```

Open the generated `runs/<timestamp>__demo__loom-to-pr__<id>/` folder and inspect:

- `events.jsonl` — structured audit events.
- `transcript.md` — demo narrative.
- `prd.md`, `tickets.md`, `copy.md`, `pr-description.md`, `release-notes.md` — reference artifacts.
- `slack-draft.json` — a draft payload with `send: false`.

No external API is called in this path.

## 60-minute real-tool path

1. **Make sure all four day-one keys are in `.env`** (GITHUB, LINEAR, NOTION, SLACK).
2. **Pick a sandbox repo on GitHub** that you don't mind paalto opening draft PRs against. (Don't point it at production on day one.) Set it as `GITHUB_DEFAULT_REPO` in `.env`.
3. **Open the `paalto/` folder in Claude Code.**
4. **In chat, paste:**

   > Run `workflows/ship-a-feature.md` using `examples/loom-to-pr/input/brief.md` as the brief and `examples/loom-to-pr/input/loom-transcript.vtt` as the transcript. Repo: `<your-sandbox-repo>`.

5. **Approve at each gate.** You'll see five pauses — Vision, Prioritization, Design taste, Merge approval, Launch comms. Approve, revise, or stop.
6. **At the end** you should have:
   - A PRD page in your Notion `PRD` database (Draft status).
   - 4 tickets in your Linear `LINEAR_TEAM_ID` team.
   - 1 draft PR on GitHub with green CI.
   - 1 release-note draft saved to `runs/<id>/slack-draft.json`, surfaced in chat (not sent).

## No-API dry check

Before wiring real tools, run:

```bash
npm run doctor
npm run validate
```

This confirms every skill has the required frontmatter, `Procedure`, `Hard rules`, `Refusal`, and `events.jsonl` audit instruction; it also verifies every agent-listed skill file exists.

## Common failure points

| Symptom | Likely cause | Fix |
|---|---|---|
| "I don't see the agents listed" | Claude Code isn't reading `agents/` | Open the folder, not a parent. Or paste the agent file path explicitly. |
| Notion 401 | Integration not shared on the database | In Notion, open your PRD database → `…` menu → Connections → add your integration. |
| Linear 403 | Wrong workspace | API keys are workspace-scoped. Generate one from the workspace whose `LINEAR_TEAM_ID` you set. |
| GitHub 403 on PR open | PAT is not fine-grained, or scopes wrong | Recreate as fine-grained, target one repo, `contents` + `pull_requests` write. |
| Slack 403 | Bot not in channel | Invite your bot user to `SLACK_DEFAULT_CHANNEL`. |
| CI red after 3 fix attempts | Engineer escalates by design | Read `runs/<id>/plan.md` and `events.jsonl`; fix locally and push, or revise the PRD. |
| Skill listed but not found | Agent wiring drift | Run `npm run validate`; fix the missing path before running workflows. |
| Unsure whether the repo is safe to try | You have not run the dry path yet | Run `npm run doctor && npm run demo`; inspect the generated ignored run folder before adding keys. |

## Next

- Try a real ticket: skip the example, give it a brief from your own product.
- Read [docs/skills.md](skills.md) to see what's available and how to add your own.
- Read [docs/security.md](security.md) before pointing it at a production repo.
