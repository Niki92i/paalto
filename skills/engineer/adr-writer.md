---
name: adr-writer
role: engineer
inputs: [decision_topic, context, options, chosen]
outputs: [docs/adr/NNNN-<slug>.md, runs/<run_id>/adr.md]
tools: [filesystem, mcp:github]
gates: []
---

# Skill — Architecture Decision Record (ADR)

Lightweight record of a single architectural decision, in Michael Nygard's format. Lives next to the code, not in a wiki. One decision per ADR; superseding is normal.

## Procedure

1. **Confirm this needs an ADR.** Belongs in ADR if it: locks a technology choice, defines a boundary, or constrains future implementation. Day-to-day code choices don't need ADRs.
2. **Find the next ADR number** by listing `docs/adr/` and incrementing.
3. **Write in this exact format:**

```markdown
# <NNNN>. <Title — declarative, not interrogative>

Date: <YYYY-MM-DD>

## Status
<Proposed | Accepted | Deprecated | Superseded by [ADR-NNNN](./NNNN-<slug>.md)>

## Context
<Why are we making this decision now? What forces are at play — technical, organizational, business? 2-4 paragraphs. The reader 18 months from now needs the why.>

## Decision
<We will <do X>. Single, declarative sentence. Then 1-2 paragraphs of detail.>

## Consequences
### Positive
- <consequence>
- <consequence>

### Negative
- <consequence>
- <consequence>

### Neutral
- <consequence — e.g., "we now have two HTTP clients in the repo">

## Alternatives considered
- **<Alternative A>:** <one paragraph, including rejection reason>
- **<Alternative B>:** ...

## References
- Related ADRs: <links>
- External: <papers, blog posts, RFCs>
```

4. **File location:** `docs/adr/NNNN-<kebab-slug>.md` in the repo.
5. **Update the ADR index** (`docs/adr/README.md`) with a row: number · title · status · date.
6. **Open as a draft PR** (per engineer hard rules — never auto-merge). Reviewers: at least one architect + one engineer outside the immediate team.
7. **Audit.** `events.jsonl`: `{ "type": "adr.written", "number": N, "title": "...", "supersedes": "..." }`.

## Hard rules

- **One decision per ADR.** Multi-decision ADRs become unfindable. Split them.
- **Both positive AND negative consequences.** "All upside" is dishonest. Every architectural decision has cost.
- **Superseding is OK** — don't delete old ADRs, mark them Superseded with a forward link.
- **Status transitions are explicit.** Proposed → Accepted requires a reviewer sign-off in the PR. Active → Deprecated requires another ADR.
- **ADRs live with the code.** Wiki ADRs decay. Repo ADRs survive refactors and outlast the wiki vendor.

## Refusal

If asked to write an ADR with no negative consequences listed, refuse — that's marketing, not a decision record.
