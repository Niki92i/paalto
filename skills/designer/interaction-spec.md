---
name: interaction-spec
role: designer
inputs: [feature_or_component, optional:figma_url]
outputs: [runs/<run_id>/interaction-spec.md]
tools: [filesystem, mcp:figma]
gates: []
---

# Skill — Interaction & Motion Spec

The handoff doc for non-static behaviour: state changes, transitions, gestures, motion, focus, z-order. The level of specification engineers need to ship without guessing.

## Procedure

1. **Inventory states.** For the component/feature, list every state:
   - Default · hover · focus · active · loading · empty · error · success · disabled
   - Permission/role variations
   - Density variations (mobile vs. desktop)
   - Theme variations (light/dark/high-contrast)
2. **For each transition between states, specify:**
   - Trigger (user action, system event)
   - Duration (ms) and easing curve (cubic-bezier or named: `ease-in`, `ease-out`, `ease-in-out`)
   - Properties animated (opacity, transform, color, height — never animate `width`/`height` if `transform: scale` works)
   - **Reduced-motion fallback** (mandatory)
3. **Motion = affordance, not delight.** Each motion answers "what just happened?" or "where did it go?" If a motion answers neither, cut it.
4. **Z-order / stacking.** Document the z-index scale (e.g., base 0, dropdown 100, modal 1000, toast 10000). Note conflicts with existing patterns.
5. **Focus management.** For modals, drawers, route changes: where does focus land? Where does it return? Is there a focus trap? Tab order documented.
6. **Gestures (mobile/touch).** Tap, long-press, swipe, pinch. Specify thresholds (px, ms). Document conflicts (e.g., swipe-back vs. horizontal scroll).
7. **Write the spec:**

```markdown
# Interaction spec — <component/feature>
Linked Figma: <url>

## States
| State | Trigger | Visual delta | Notes |

## Transitions
| From → To | Trigger | Duration | Easing | Properties | Reduced-motion |

## Motion principles applied
- Disappearing: ease-out (fast out)
- Appearing: ease-in-out
- Continuous: linear
- Total motion budget: < N ms across the flow

## Z-order
| Layer | z-index | Examples |

## Focus management
- On open: focus moves to <element>
- On close: focus returns to <element>
- Focus trap: <yes/no, scope>
- Tab order: <list>

## Gestures (if mobile)
| Gesture | Threshold | Action | Conflicts |

## Edge cases
- Slow network: ...
- Interrupted transition: ...
- Rapid repeated triggers: ...

## Test on
- iPhone SE (lowest-end target)
- 3G throttle
- Reduced-motion enabled
- VoiceOver / TalkBack
```

8. **Audit.** `events.jsonl`: `{ "type": "interaction.spec", "states": N, "transitions": N, "reduced_motion_covered": true }`.

## Hard rules

- **Motion is affordance.** "What happened" or "where it went" — otherwise cut.
- **Ease-out for disappearing, ease-in-out for state changes.** Linear only for continuous motion (loaders, scroll-linked).
- **Reduced-motion fallback is mandatory** (`prefers-reduced-motion`). Not optional.
- **Z-order documented before merge.** Stacking bugs are the #1 motion regression.
- **Test on the lowest-end device** in the supported matrix. Smooth on M3 Pro means nothing.

## Refusal

If asked to spec motion without naming the trigger and the affordance it provides, refuse — that's decoration, and decoration belongs in marketing pages, not product UI.
