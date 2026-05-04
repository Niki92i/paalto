---
name: market-radar
role: pm
inputs: [topic, optional:competitors, optional:sources]
outputs: [runs/<run_id>/market-radar.md, optional:notion_page_url]
tools: [filesystem, mcp:github, shell:sandboxed]
gates: []
---

# Skill — Market Radar

Continuously scan public market signal: Reddit, Hacker News, Product Hunt, GitHub repos/issues, competitor changelogs, app-store reviews, docs, community forums, and public transcripts. The output is a sourced signal map, not a trend essay.

## Procedure

1. **Define the radar question.** One sentence: `What are we trying to learn about <topic> this week?` Reject vague scans like "what's happening in AI"; narrow to a product surface, ICP, workflow, or competitor set.
2. **Select sources.** Default to public, high-signal sources only:
   - Reddit: relevant subreddits, sorted by recent + top month.
   - Hacker News: threads and comments with product/operator signal.
   - Product Hunt / launches: positioning, comments, upvotes, follow-on discussion.
   - GitHub: public repos, issues, discussions, stars/forks trend, release cadence.
   - Competitor changelogs/docs/blogs: shipped features, pricing/package moves.
   - App-store / marketplace reviews: complaints, switching triggers, praise.
   - Public podcasts/transcripts/webinars: operator language and repeated pain.
3. **Collect evidence.** Every captured item needs: source URL, date, author/community if public, exact quote/snippet, and why it matters. Do not scrape private communities, logged-in-only content, or anything disallowed by terms.
4. **Classify signal strength:**
   - **Strong:** appears across 3+ independent sources or has quantified traction.
   - **Medium:** appears in 2 sources or one source with rich firsthand detail.
   - **Weak:** one anecdote; useful as a question, not a conclusion.
5. **Separate observations from implications.** Write what happened first. Then the product implication. Never collapse the two.
6. **Write the report:**

```markdown
# Market radar — <topic> · <date>

## Radar question
<one sentence>

## TL;DR
- Strong signal: <1-3 bullets>
- Medium signal: <1-3 bullets>
- Weak / watchlist: <1-3 bullets>

## Sources scanned
| Source | Query / URL | Date range | Items reviewed |

## Signal map
### Signal 1 — <short user-language title> · strength: strong
**Observation:** <what public evidence says>
**Evidence:**
- "<quote>" — <source>, <date>, <url>
- ...
**Implication:** <what this suggests for our roadmap, positioning, or research plan>
**Confidence:** high/med/low

### Signal 2 — ...

## Competitor moves
| Competitor | Move | Source | Likely reason | Threat / opportunity |

## Public repo intelligence
| Repo | What changed | Evidence | Product implication |

## Questions to test with users
- <question> — suggested owner / method

## What NOT to conclude yet
- <guardrail against over-reading weak signal>
```

7. **Mirror to Notion** under Strategy or Research if configured.
8. **Audit.** `events.jsonl`: `{ "type": "market.radar", "sources": N, "signals_strong": N, "signals_medium": N, "signals_weak": N, "competitor_moves": N }`.

## Hard rules

- **Public and permitted sources only.** No private communities, paid screenshots, leaked docs, or login-gated scraping.
- **Quote before interpretation.** Every implication traces to exact evidence.
- **Strong signal requires triangulation.** One viral Reddit thread is not a market trend.
- **Freshness matters.** Default window is 30 days unless the operator asks for historical analysis.
- **Always include `What NOT to conclude yet`.** Public internet signal is biased toward loud users.

## Refusal

If asked to scrape private chats, bypass paywalls, deanonymize users, or treat one anecdote as proof, refuse. If the topic is too broad, refuse the broad scan and ask for a narrower radar question.
