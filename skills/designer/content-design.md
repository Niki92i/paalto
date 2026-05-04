---
name: content-design
role: designer
inputs: [surface_or_flow, optional:figma_url, optional:terminology_glossary]
outputs: [runs/<run_id>/content-design.md, optional:terminology-updates.md]
tools: [filesystem, mcp:figma, mcp:notion]
gates: []
---

# Skill — Content Design / Microcopy

UI strings, error messages, empty states, button labels, system notifications. Owns the product's voice in the moment of use. Locks terminology early so engineers and support stay aligned.

## Procedure

1. **Inventory strings.** From the Figma file or component spec, list every visible string by type:
   - Buttons / CTAs
   - Headings / subheadings
   - Body / helper text
   - Placeholders
   - Error messages
   - Empty states
   - Success / confirmation messages
   - System notifications / toasts
   - Email subject + preview
2. **Apply voice rules** (from style guide; if none exists, generate one in `runs/<id>/voice-rules.md`):
   - Reading level (grade 6-8 default)
   - Person (2nd person "you" by default)
   - Tone modifier per surface (errors: calm + actionable; empty states: encouraging + directive; confirmations: brief)
3. **Rewrite each string** following these rules:
   - **Buttons:** verb-first. "Save changes" not "Click here to save." No "Please."
   - **Errors:** state what happened, why, and how to recover. Never blame the user. ("We couldn't save your work — your session expired. Sign in again to retry.")
   - **Empty states:** every empty state has a primary CTA. No dead ends.
   - **Loading/skeletons:** if >2s, give a hint ("Crunching numbers…"). Otherwise silent.
   - **Confirmations:** past tense, specific. "Project archived" not "Done!"
4. **Lock terminology.** Maintain a glossary with: term, definition, approved usage, deprecated synonyms, where it appears. **Frozen in week 1** of a feature; changes after that need a `terminology-updates.md` change log.
5. **Localization readiness.**
   - No string concatenation ("You have " + N + " items" → "You have {count} items")
   - Avoid idioms
   - Length budget per surface (German is ~30% longer than English)
6. **Write:**

```markdown
# Content design — <surface>

## Voice
Reading level <X>, person <Y>, tone <Z>

## Strings
| Surface | Type | Original | Revised | Reason | Char limit |

## Errors (full table)
| Trigger | Message | Recovery action | Severity |

## Empty states
| Surface | Headline | Body | CTA |

## Terminology (locked <date>)
| Term | Definition | Use | Don't use |

## Localization notes
- Variables: <list>
- Length budget: <surface>: <max>
- Edge cases for non-English: ...
```

7. **Audit.** `events.jsonl`: `{ "type": "content.designed", "strings": N, "errors_with_recovery": N, "empty_states_with_cta": N, "terminology_terms": N }`.

## Hard rules

- **Errors suggest recovery, never blame.** "Invalid email" → "Email looks off. Make sure it includes @ and a domain."
- **No "Please" in buttons.** Verbs only. Politeness in body, not CTAs.
- **Every empty state has a CTA.** Empty states are entry points, not dead ends.
- **Terminology frozen week 1.** Renames mid-build are the #1 source of post-launch confusion.
- **No concatenation.** Variables only. Future-localization tax is real.

## Refusal

If asked to write a string in passive voice for an action a user just performed, refuse and rewrite active. ("Saved" → "We saved your draft.")
