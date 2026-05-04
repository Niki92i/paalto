---
name: perf-audit
role: engineer
inputs: [scope, optional:perf_budget, optional:baseline_metrics]
outputs: [runs/<run_id>/perf-audit.md]
tools: [filesystem, mcp:github, shell:sandboxed]
gates: []
---

# Skill — Performance Audit

Performance audit ranked by user-perceived impact, not raw numbers. Set the budget first; measure on prod-like infra; account for device and network variance.

## Procedure

1. **Set or read the performance budget.** A budget defines the bar:
   - Web: LCP < 2.5s p75, INP < 200ms p75, CLS < 0.1, JS bundle < 250KB gz, image budget per route, network requests per route
   - API: latency p50 / p95 / p99 per endpoint, error rate, throughput
   - Mobile: cold start, frame drops, battery per session
   - **No budget = no audit.** Refuse and write the budget first.
2. **Capture baseline.** Real-user metrics (RUM) preferred over synthetic. If only synthetic available, use prod-like infra (same DB tier, same network conditions, same regions).
3. **Define test matrix:**
   - Devices: lowest-end target + median target + high-end
   - Networks: throttled 3G + 4G + WiFi
   - Geographies: at least one cold-cache, far-from-origin location
4. **Profile.** Use the right tool for the surface:
   - Web: Lighthouse + WebPageTest + Chrome DevTools Performance + RUM (CrUX, RUM beacon)
   - API: load test (k6 / Locust) + APM trace samples (Datadog / New Relic / Honeycomb)
   - DB: slow-query log + EXPLAIN on top-N
   - Mobile: Xcode Instruments / Android Profiler
5. **Rank findings by user-perceived impact.** A 50ms backend save matters less than a 500ms first-contentful-paint regression. Use a simple rubric:
   - **P0:** breaks the budget AND is on a high-traffic path
   - **P1:** breaks the budget on a low-traffic path OR within budget but trending wrong
   - **P2:** within budget, optimization opportunity
6. **Each finding documents:**
   - Symptom (what the user notices)
   - Measurement (numbers from the test matrix)
   - Cause (specific code / config / query)
   - Fix proposal (with estimated win)
   - Risk of fix
7. **Write:**

```markdown
# Performance audit — <scope> · <date>
**Auditor:** <name> · **Budget reference:** <link>

## Summary
- <N P0 · N P1 · N P2>
- Worst regression vs. budget: <metric, value vs. target>
- Best opportunity: <metric, estimated win>

## Test matrix
| Device | Network | Geo | RUM/synthetic |

## Budget vs. actual
| Metric | Budget | Actual (p75) | Status |

## Findings (ranked by user-perceived impact)
### P0 — <title>
- Symptom: ...
- Measurement: <numbers across matrix>
- Cause: ...
- Fix: ... (est. win: <X>)
- Risk: ...

### P1 — ...
### P2 — ...

## Trends
<is performance getting better or worse? chart link>

## Recommendations
1. <action> — owner, est. effort, est. win
2. ...

## What we did NOT measure
<scope honesty>
```

8. **File P0/P1 in Linear** with `perf` label.
9. **Audit.** `events.jsonl`: `{ "type": "perf.audit", "p0": N, "p1": N, "budget_breaches": N, "matrix_devices": N }`.

## Hard rules

- **Budget first.** A "perf audit" without a budget is just numbers without a verdict.
- **User-perceived impact ranking.** A 200ms backend save < a 500ms LCP regression. Always.
- **Prod-like infra for tests.** Localhost numbers lie.
- **Device + network variance documented.** Median device on median network is not "the user."
- **Trend over single snapshot.** A bad number that's been bad for a year is different from a bad number that regressed yesterday.

## Refusal

If asked to audit without a budget, refuse and produce the budget proposal first.
