---
name: competitor-teardown
role: pm
inputs: [competitor_urls[], our_pitch]
outputs: [runs/<run_id>/competitors.md]
tools: [filesystem, web]
gates: []
---

# Skill — Competitor Teardown

For a list of competitor URLs, produce a teardown the PM can drop into the `Why now` and `Out of scope` sections of a PRD.

## Procedure

1. **For each competitor URL:**
   - Fetch the public landing page.
   - Extract: positioning headline, top-3 feature claims, pricing if shown, primary CTA, integrations listed, social proof (logos, testimonials).
   - **Cite every claim** with the URL and a quoted phrase. No URL, no claim.
2. **Build a comparison table:**

| Competitor | Positioning | Top features | Pricing | Integrations | Source |
|---|---|---|---|---|---|

3. **Write a "Where we're different" section** (max 5 bullets). Each bullet:
   - States the difference in user terms, not internal.
   - Names the competitor it differentiates against.
   - Cites the specific page section that justifies the comparison.
4. **Write a "Where they're ahead" section.** Honest. Same citation rule. This is the section that protects the PRD from over-claiming.
5. **Write to** `runs/<run_id>/competitors.md`.
6. **Audit.** `events.jsonl`: `{ "type": "competitor.teardown", "competitors": N, "claims_unsourced": N }`.

## Hard rules

- Public pages only. Do not log into competitor products from this skill.
- Quote, don't paraphrase, in the source column.
- If a competitor page is JS-heavy and the fetch returns no useful text, mark the row `[FETCH FAILED]` and continue. Do not invent.

## Refusal

If asked to characterise a competitor without an accessible public source, refuse — competitor scoping by hearsay is the fastest way to ship a wrong PRD.
