---
name: ticket-breaker
role: pm
inputs: [prd_url_or_path]
outputs: [linear_issue_urls[]]
tools: [filesystem, mcp:linear, mcp:notion]
gates: []
---

# Skill — Ticket Breaker

Convert an approved PRD (post-g2) into a small set of Linear tickets that the Engineer agent can pick up one at a time.

## Procedure

1. **Load the PRD.** Read from the Notion URL or local path. Extract `v0` bullets and `Acceptance criteria`.
2. **One ticket per `v0` bullet.** Maximum 7 tickets. If the PRD implies more, push back to PM/operator before continuing.
3. **For each ticket compose:**
   - **Title:** `<verb> <object>` — short, no ticket prefix (Linear adds it).
   - **Description:** link back to the PRD, list the bullet it implements.
   - **Acceptance criteria:** subset of the PRD ACs that this ticket covers, copied verbatim. Every PRD AC must be covered by exactly one ticket.
   - **Estimate:** S / M / L (do not estimate in hours).
   - **Labels:** `paalto`, plus role-of-author labels if present.
   - **Order:** number them `1/N`, `2/N`, …; first ticket is the smallest end-to-end vertical slice that proves the bet.
4. **Create in Linear.** Use `LINEAR_TEAM_ID`. Capture each issue URL.
5. **Comment back on the PRD** in Notion: bullet list of `<TICKET-ID> · <title>` linking to each.
6. **Audit.** Append `events.jsonl`:
   `{ "type": "tickets.created", "count": N, "team": "...", "prd_url": "...", "ticket_urls": [...] }`.

## Sanity rules

- If two tickets touch the same files and one cannot ship without the other, merge them.
- If any AC is left uncovered by the ticket set, refuse and report the gap. Do not silently invent a ticket for it.
- If the smallest first ticket is bigger than `M`, the PRD is wrong — escalate, don't carve.
