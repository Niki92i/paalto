---
name: design-ops
role: designer
inputs: [scope, optional:current_token_source]
outputs: [runs/<run_id>/design-ops-audit.md, optional:tokens.json]
tools: [filesystem, mcp:figma, mcp:github]
gates: []
---

# Skill — Design Ops / Token Hygiene

Audit and maintenance of design system primitives: tokens, components, deprecations. Tokens live in code as the single source of truth — Figma reads from it, not the other way around.

## Procedure

1. **Audit cadence.** Twice per year minimum. More often during a redesign or platform expansion.
2. **Pull the inventories:**
   - **Tokens:** colors, spacing, radii, shadows, typography, motion durations/easings.
     - Source: `tokens.json` (or equivalent) in code.
     - Derived: Figma variables / styles, CSS custom properties, native theme files.
   - **Components:** every Figma component vs. every coded component. Note version drift.
   - **Usage:** which surfaces consume which components/tokens. Use a static-analysis pass on the code (grep / AST).
3. **Find the drift.**
   - Tokens defined in code but not in Figma (or vice versa) → **sync gap**
   - Tokens used directly in code but not declared (raw hex, magic numbers) → **leak**
   - Components in Figma not in code (or vice versa) → **build gap**
   - Components used in <3 places → **promotion candidate to delete**
   - Components forked locally → **divergence**
4. **Deprecation plan.** For each component/token marked deprecated:
   - Replacement and migration guide
   - **6-month deprecation runway** (default; shorter only with explicit justification)
   - Codemod or grep pattern to find usage
   - Owner of the migration
5. **Write:**

```markdown
# Design ops audit — <date>
**Scope:** <what was audited> · **Auditor:** <name>

## Summary
- Tokens: <N total, N synced, N leaks, N drift>
- Components: <N total, N synced, N divergent, N deprecation candidates>
- Surfaces audited: <list>

## Token leaks (raw values in code)
| File | Value | Suggested token | Owner |

## Sync gaps
| Side | Token/Component | Issue | Action |

## Divergent components
| Component | Locations | Diff | Recommendation |

## Deprecation queue
| Item | Replacement | Sunset date | Migration owner | Codemod |

## Promotion candidates
| Local pattern | Surfaces | Promote to system? |

## Recommendations
1. <prioritized list, with owners>
```

6. **File migration tickets** in Linear with `design-ops` label. Each has a sunset date.
7. **Mirror tokens** if repo has a `tokens.json` source — propose a PR if drift is detected (but never auto-merge — see engineer rules).
8. **Audit.** `events.jsonl`: `{ "type": "design.ops.audit", "tokens_drift": N, "leaks": N, "deprecation_queue": N, "promotion_candidates": N }`.

## Hard rules

- **Tokens live in code.** Single source of truth. Figma syncs *from* code, not the other way. Otherwise design and engineering keep two truths and one of them silently wins.
- **6-month deprecation runway.** Shorter only with explicit justification (security, etc.). Anything shorter generates churn.
- **Audit twice a year minimum.** More during redesigns.
- **Components used in <3 places** are not system components. Either promote to a real pattern or absorb back into the consumer.
- **Codemod or grep pattern per deprecation.** "Find and replace manually" doesn't scale.

## Refusal

If asked to add a new component to the system without a migration path for the local versions it replaces, refuse — that's how systems get bloated.
