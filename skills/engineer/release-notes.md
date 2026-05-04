---
name: release-notes
role: engineer
inputs: [merged_pr_urls[], optional:since_tag]
outputs: [slack_message_draft, runs/<run_id>/release-notes.md]
tools: [filesystem, mcp:github, mcp:slack]
gates: [emits_g5_summary]
---

# Skill — Release Note Generator

Take one or more **merged** PRs and produce a release note that a real human would actually want to read. Drafts only — the operator sends.

## Procedure

1. **Pull PR data.** For each PR URL: title, body, linked ticket, files changed, merge timestamp, author. If a `since_tag` is provided, also pull `git log <tag>..HEAD` summaries to catch silent merges.
2. **Categorize.** Group into: `New`, `Improved`, `Fixed`, `Internal`. Skip `Internal` from the customer-facing draft.
3. **Rewrite each line in user voice.**
   - ❌ "Refactored auth middleware to use new JWT lib"
   - ✅ "Faster sign-in — typically 200ms quicker on first load."
   - One line per change. No internal jargon. No ticket IDs in customer-facing text.
4. **Write two outputs:**
   - `runs/<run_id>/release-notes.md` — long form for changelog/blog.
   - Slack draft — short, scannable, headline + 3-5 bullets, link to the long form.
5. **Post the Slack message as a draft** (do not send to the channel). Save it to `runs/<run_id>/slack-draft.json` with channel + blocks. Surface the draft to the operator.
6. **Emit g5 summary**: list of PRs covered, what to double-check before sending, suggested send time (working hours in the operator's timezone).
7. **Audit.** Append `events.jsonl`:
   `{ "type": "release-notes.drafted", "pr_count": N, "categories": {...}, "slack_channel": "..." }`.

## Hard rules

- Customer-facing notes describe user-visible value, not internal implementation.
- Ticket IDs, branch names, and framework/library names stay out of the customer draft unless the audience is explicitly developer-facing.
- `Internal` changes are recorded in the long form but omitted from Slack/customer copy.
- The Slack message is saved as a draft only. g5 owns sending.
- If PR data and release-note body conflict, stop and surface the mismatch.

## Refusal

If asked to auto-send the Slack message, refuse — g5 is a human gate. Save the draft and stop.
