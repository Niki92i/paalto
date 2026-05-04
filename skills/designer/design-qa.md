---
name: design-qa
role: designer
inputs: [feature, optional:figma_url, optional:pr_url]
outputs: [runs/<run_id>/design-qa.md]
tools: [filesystem, mcp:figma, mcp:github]
gates: []
---

# Skill — Design QA

Compares built UI against Figma source of truth. Catches drift before launch. Cadence is **weekly mid-build**, not a single pass at the end — late QA produces unfixable backlog.

## Procedure

1. **Pull both sides.**
   - Figma source: components, frames, tokens
   - Built UI: PR preview URL or staging environment, ideally on multiple breakpoints + themes
2. **Run the comparison checklist** for each surface:
   - **Spacing** — measure, don't eyeball. Use browser inspector against Figma's spacing tokens.
   - **Typography** — font, weight, size, line-height, letter-spacing. Compare computed CSS vs. Figma.
   - **Color** — measure on rendered output (themes alter rendered values). Use a color picker on screenshots — not on the Figma file.
   - **Contrast** — WCAG AA minimum (4.5:1 for body, 3:1 for large text and UI components). Measured on rendered output.
   - **State coverage** — every state from `interaction-spec.md` is present.
   - **Responsive breakpoints** — checked at each declared breakpoint, not just the design canvas.
   - **Theme variants** — light + dark + high-contrast all checked.
   - **Motion / transitions** — match the interaction spec.
3. **Categorize each delta:**
   - **Bug** — must fix (regression from spec)
   - **Filed for follow-up** — known limitation, ticketed
   - **By design** — implementation diverged intentionally; document why
   - **Won't fix** — acceptable trade-off, document why
4. **Write:**

```markdown
# Design QA — <feature> · <date>
**PR / build:** <url> · **Figma:** <url> · **Reviewer:** <name>

## Summary
<N bugs · N filed · N by design · N won't fix>

## Bugs (must fix before merge)
| Surface | Delta | Severity | Linear issue |

## Filed for follow-up
| Surface | Delta | Reason | Linear issue |

## By design
| Surface | Delta | Reason |

## Won't fix
| Surface | Delta | Reason |

## Coverage
- Breakpoints checked: <list>
- Themes checked: <list>
- States checked: <count> / <total>

## Tooling
- Contrast checker: <tool, version>
- Spacing measure: <tool>
- Screenshots saved: runs/<id>/screenshots/
```

5. **File bugs in Linear** with label `design-qa:<feature>`, link the screenshot, set DRI = engineer who shipped the surface.
6. **Audit.** `events.jsonl`: `{ "type": "design.qa", "bugs": N, "filed": N, "by_design": N, "wont_fix": N, "coverage_pct": "..." }`.

## Hard rules

- **Weekly mid-build cadence.** A single end-of-cycle QA produces unfixable bugs. Schedule it like a standup.
- **Measure on rendered output.** Themes, density modes, and CSS variables all change the rendered value vs. the design file.
- **Document `won't fix` and `by design`.** Silent trade-offs become bug reports later from someone who doesn't know the history.
- **Contrast is measured, not assumed.** A token that meets contrast on Figma may not on rendered HTML with subpixel rendering.
- **Severity rubric:**
  - **P0** — accessibility, broken state, regression from prod
  - **P1** — visible to users, off-spec
  - **P2** — minor (≤2px), polish

## Refusal

If asked to sign off on a feature without breakpoint and theme coverage, refuse — partial QA is misleading.
