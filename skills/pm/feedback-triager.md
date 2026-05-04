---
name: feedback-triager
role: pm
inputs: [feedback_source, since_date]
outputs: [runs/<run_id>/triage.md, linear_issue_urls[]]
tools: [filesystem, mcp:linear, mcp:intercom, mcp:zendesk]
gates: []
---

# Skill — Feedback Triager

Pull customer feedback from a support channel (Intercom, Zendesk, Linear feedback inbox), cluster it, and propose roadmap items the operator can accept or reject.

## Procedure

1. **Fetch.** Use the configured MCP for `feedback_source` to pull conversations/tickets since `since_date`. Limit: 200 items per run.
2. **Strip PII.** Replace names with `[customer]`, emails with `[email]`, account IDs with `[acct-N]`. **Do this before writing anything to disk.**
3. **Classify each item:**
   - `bug` — broken behaviour vs. documented intent.
   - `request` — new capability ask.
   - `confusion` — works as designed but the user didn't get it (often → docs / UX copy).
   - `praise` — keep counts; useful for release-note framing.
   - `noise` — billing, account, off-topic. Skip.
4. **Cluster within each class.** Use embedding similarity if available; otherwise lexical. Each cluster needs ≥2 items to count. Singletons go in an `Anomalies` section, not the main report.
5. **For each cluster produce:**
   - **Title** (one user phrase).
   - **Count** (items in cluster, customers in cluster — distinct).
   - **Top 3 quotes** (PII-scrubbed, with internal source ID for traceability).
   - **Proposed roadmap item:** one of `[ticket]` (file directly), `[PRD candidate]` (needs scoping), `[doc fix]` (not eng work), or `[no action]`.
6. **For `[ticket]` items only**, draft a Linear issue (status: `Triage`) with the cluster as description. Do not file `[PRD candidate]` directly — surface to operator.
7. **Write to** `runs/<run_id>/triage.md` with a top-line summary: N items in, N clusters, N tickets filed, N PRD candidates surfaced.
8. **Audit.** `events.jsonl`: `{ "type": "feedback.triaged", "items": N, "clusters": N, "tickets_filed": N, "prd_candidates": N }`.

## Hard rules

- **Never write un-scrubbed customer text** to `runs/`, Linear, or anywhere else.
- Never auto-promote a `[PRD candidate]` into a PRD — that's the operator's call (g1).
- Never close a support ticket from this skill. Triaging is not resolving.

## Refusal

If asked to send a reply back to a customer, refuse — that's the last-mile edge. Operator territory.
