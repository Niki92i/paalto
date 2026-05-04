---
name: experiment-readout
role: pm
inputs: [experiment_id_or_design_url, results_data]
outputs: [runs/<run_id>/experiment-readout.md, slack_message_draft]
tools: [filesystem, mcp:posthog, mcp:notion, mcp:slack]
gates: [emits_g5_summary]
---

# Skill — Experiment Readout

Convert experiment results into a readout that matches the pre-committed decision rule and ends with a recommendation. Triangulates quant + qual before concluding.

## Procedure

1. **Load the design doc.** Pull pre-committed metrics, segments, decision rule. The readout must be evaluated *against* the design — never invent new criteria post-hoc.
2. **Pull results.** Primary, secondary, guardrails. With confidence intervals at 95%. Per declared segment only.
3. **Run the decision rule mechanically.** Apply the pre-committed rule. Note the verdict before writing prose.
4. **Triangulate.** Pull qualitative signal from the same period: support tickets mentioning the feature, session-recording notes, NPS comments. If quant says "ship" and qual says "users are confused," surface the conflict.
5. **Write in this structure:**

```markdown
# Experiment readout — <name>

## Verdict
**<SHIP | NO SHIP | ITERATE | EXTEND | INVESTIGATE>** — applied per the pre-committed decision rule.

## Hypothesis recap
<verbatim from design doc>

## Primary result
| Variant | Value | Δ vs control | 95% CI | Sig |
| Control | ... | — | — | — |
| Treatment | ... | +X% | [a%, b%] | yes/no |

Verdict against MDE (X%): <CI entirely above MDE | overlaps MDE | overlaps zero>.

## Secondary metrics
| Metric | Δ | CI | Direction |

## Guardrails
| Metric | Δ | Triggered? |

## Pre-specified segments
<results per declared segment; no new segments>

## Qualitative triangulation
- Support tickets mentioning treatment in period: N (<themes>)
- Notable session-recording observations: ...
- NPS / survey comments: ...
- **Quant ↔ qual alignment:** <aligned | conflict — describe>

## Recommendation
<one paragraph; references the verdict and the qualitative signal>

## Learnings (regardless of ship)
- 2-3 things we now believe more strongly
- 2-3 things we now believe less strongly
- One thing to test next

## Appendix
- Full statistical output
- Exploratory segments (clearly labeled exploratory; not basis for decision)
```

6. **Slack draft.** 5-bullet summary. Channel: results channel from `.env`. Saved to `runs/<id>/slack-draft.json`. Not sent.
7. **Audit.** `events.jsonl`: `{ "type": "experiment.readout", "verdict": "...", "primary_lift": "...", "guardrails_triggered": N, "quant_qual_aligned": true|false }`.

## Hard rules

- **Apply the pre-committed decision rule first.** Do not write the recommendation before computing the verdict.
- **Statistical significance ≠ ship.** A significant result smaller than MDE is not actionable. Say so.
- **Practical significance + segment effects** must be in the body, not buried in the appendix.
- **Exploratory segments** are clearly labeled and never the basis for the verdict.
- **Triangulate.** A quant-only readout is incomplete.

## Refusal

- Asked to "find a positive segment to ship on"? Refuse — that's p-hacking. Run a follow-up experiment targeted at that segment.
- Asked to extend a test that's already past the pre-committed end date *to chase significance*? Refuse — that's also p-hacking (multiple-comparisons in time).
