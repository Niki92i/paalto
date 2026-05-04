---
name: prod-readiness
role: engineer
inputs: [service_or_feature, optional:tech_spec_url, optional:slo_targets]
outputs: [runs/<run_id>/prod-readiness.md]
tools: [filesystem, mcp:github]
gates: [emits_g4_summary]
---

# Skill — Production Readiness Review (PRR)

Google-SRE-style PRR. Goes/no-goes for production launch. SLOs based on user impact, runbook per alert, load test failure modes, named approver. Without this, "we shipped" is a guess.

## Procedure

1. **Define SLOs** based on user impact, not raw latency:
   - **Availability SLO** — what fraction of valid requests succeed (e.g., 99.9% over 30d)
   - **Latency SLO** — p95/p99 under what threshold (e.g., p99 < 800ms)
   - **Quality / correctness SLO** if applicable (e.g., search relevance > X)
   - **Error budget** = `1 - SLO`. State the budget; state the policy when it's burned.
2. **PRR checklist** — every item is gating. Each is `Pass / Fail / Waived (with sign-off)`:

```markdown
## Reliability
- [ ] SLOs defined and approved (link)
- [ ] Error budget policy documented
- [ ] Service has a written architecture (link to tech spec / ADRs)
- [ ] Single points of failure identified and mitigated
- [ ] Graceful degradation path defined for each dependency

## Capacity
- [ ] Load test executed at 2x expected peak; results attached
- [ ] Failure modes under load documented (what breaks first)
- [ ] Capacity plan for 6 months at projected growth
- [ ] Auto-scaling configured and tested

## Observability
- [ ] Dashboards: latency, error rate, throughput per endpoint
- [ ] Logs: structured, correlation IDs, retention policy set
- [ ] Traces: critical paths instrumented
- [ ] Alerts: one runbook per alert (link to each)

## Operations
- [ ] On-call rotation set, escalation policy documented
- [ ] Runbooks for each alert (skill: runbook-generator)
- [ ] Deploy process documented; rollback < 15 min
- [ ] Feature flag and kill switch independent
- [ ] Backups + restore tested in last 90 days

## Security
- [ ] Security review completed (skill: security-review); P0/P1 closed or accepted
- [ ] Secrets in vault; rotation policy set
- [ ] Authn/authz documented; least-privilege checked
- [ ] Network policies / WAF rules in place

## Data
- [ ] Data classification + retention documented
- [ ] PII handling reviewed
- [ ] Migration plan attached (if schema changes; skill: migration-plan)
- [ ] Backup strategy + DR tested

## Compliance
- [ ] GDPR / CCPA / regulatory review (if applicable)
- [ ] Audit logging in place
- [ ] Data export / deletion paths

## Documentation
- [ ] Architecture doc + ADRs (skill: adr-writer)
- [ ] Runbooks linked from alerts
- [ ] User-facing docs published (or scheduled)
- [ ] Postmortem template ready

## Communication
- [ ] Launch checklist filed (skill: launch-checklist)
- [ ] Comms cascade scheduled
```

3. **Write the PRR:**

```markdown
# Production readiness review — <service> · <date>
**Author:** <name> · **Approver:** <named SRE/architect> · **Status:** <Approved | Conditionally Approved | Blocked>

## Summary
- Pass: N · Fail: N · Waived: N
- Approver verdict: <one sentence>
- Conditions (if conditional): <list>

## SLOs
| SLO | Target | Window | Measurement |

## Error budget policy
<what happens when budget is burned: e.g., feature freeze until budget recovers>

## Checklist results
<full checklist with Pass/Fail/Waived per item>

## Failure modes (from load test)
<what breaks first under load, in what order>

## Open items
- <item> — owner, due, blocking?

## Approval
**Approver:** <named person> · **Date:** <date> · **Conditions:** <list or none>
```

4. **G4 emission.** Merge approval gate gets the PRR summary. Production deploy blocked until status = Approved (with conditions met if Conditional).
5. **Audit.** `events.jsonl`: `{ "type": "prr.completed", "status": "approved|conditional|blocked", "pass": N, "fail": N, "waived": N, "approver": "..." }`.

## Hard rules

- **SLOs based on user impact**, not raw infra metrics. "p99 < 800ms for the checkout endpoint" matters; "CPU < 60%" doesn't.
- **Runbook per alert.** No alert without a runbook. Otherwise on-call has nothing to read at 3am.
- **Load test failure modes documented.** "It scaled fine" is not the answer — *what broke first* is.
- **Named approver.** Not "the SRE team." A specific person owns the call.
- **Waivers require sign-off + an expiration date.** Permanent waivers become permanent vulnerabilities.

## Refusal

- Asked to approve a PRR without a load test? Refuse — capacity guesses are how outages happen.
- Asked to mark an item Waived without a date and approver? Refuse — undated waivers become forever.
