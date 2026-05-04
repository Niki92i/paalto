---
name: narrative-writer
role: pm
inputs: [topic, optional:research, optional:prior_strategy]
outputs: [runs/<run_id>/narrative.md]
tools: [filesystem, mcp:notion]
gates: []
---

# Skill — Narrative / Strategy Memo Writer

Write a strategy narrative in the Amazon 6-pager style: prose paragraphs, no bullets in the body, structured for a cold async reader to extract meaning in <5 minutes.

## Procedure

1. **Read inputs.** Topic is required. If `research` (synthesis, competitor teardown, metrics) is attached, treat it as the only valid evidence base — every claim must trace back to it.
2. **Write in this exact structure (prose, not bullets, except the appendix):**

```markdown
# <Title — declarative, not interrogative>

## Context (200-400 words)
What is the world as it is today, for the user we care about? What has changed recently? What evidence anchors this? Cite specific data, quotes, dates. No mission-speak.

## The asymmetry (150-300 words)
The gap between what users do today and what would be obviously better. State the gap as a single sentence first, then unpack it. This is the part that justifies the memo existing.

## The bet (200-400 words)
What we believe will be true if we act. State the bet as a single declarative sentence. Then: why we believe it, what would prove us wrong, and what we're choosing to ignore to make this bet.

## Why now (150-250 words)
The trigger. Distinct from "why this." Could be a customer ask, a metric move, a competitor move, a platform shift, a cost change. If "why now" is weak, the memo is a wishlist — surface that.

## What we'll do (200-400 words)
The shape of the work. NOT the spec. NOT the roadmap. Three to five sentences on the *kind* of thing we'll build, the constraints we accept, and the decision we'll make first.

## How we'll know (100-200 words)
The single number that will move if this works, the leading indicator we'll watch weekly, and the time horizon we'll wait before deciding to keep going.

## What we're not doing (100-150 words)
Explicit list, in prose. Protects the memo from scope creep. The longer this section, the more confident the memo.

---

## Appendix
- Open questions (bulleted list, each one assigned to a person or `unblock-by: <date>`)
- Sources (every citation in the memo, linked)
- Prior art (links to related memos this supersedes or builds on)
```

3. **Hard length cap.** 1,500-2,500 words total. Anything longer is a wishlist masquerading as a strategy.
4. **Re-read pass.** Before finalizing, do one self-review: every claim cited? Every claim falsifiable? Any sentence that could be deleted without loss? Cut it.
5. **Push to Notion** under the Strategy database (or PRD database with status `Strategy`) if `NOTION_API_KEY` set. Capture URL.
6. **Audit.** `events.jsonl`: `{ "type": "narrative.drafted", "word_count": N, "unsourced_claims": N, "notion_url": "..." }`.

## Hard rules

- **No bullets in the body.** Bullets in strategy memos are where ambiguity hides. Use prose. Bullets only in the appendix.
- **No mission-speak.** "We empower teams" is not evidence. A customer quote is.
- **State the bet as a sentence, not a paragraph.** If you can't, you haven't made the bet.
- **`why now` and `why this` are different sections.** Most memos conflate them and read as wishlists.
- **`What we're not doing` is mandatory.** Empty section = revise the memo.

## Refusal

If asked to write a strategy memo without any evidence base (no synthesis, no metrics, no competitor data), refuse and ask for the evidence first. A strategy memo without evidence is a manifesto.
