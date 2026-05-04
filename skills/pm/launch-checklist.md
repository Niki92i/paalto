---
name: launch-checklist
role: pm
inputs: [feature_name, prd_url, target_date]
outputs: [runs/<run_id>/launch-checklist.md, linear_issue_urls[]]
tools: [filesystem, mcp:linear, mcp:notion, mcp:slack]
gates: []
---

# Skill — Launch Checklist

Cross-functional launch coordination. Generates the checklist, files prep tickets in Linear, schedules the comms cascade. Optimizes for "support can handle this on day one" — that's the gating signal.

## Procedure

1. **Read the PRD.** Pull feature name, target date, scope.
2. **Generate the checklist** with these sections. **Each item gets a DRI and an `unblock-by` date** (working backwards from `target_date`):

```markdown
# Launch checklist — <feature> (target: <date>)

## T-3 weeks · Plan
- [ ] PMM brief written + reviewed (DRI: PMM, by <date>)
- [ ] Sales/CS talking points drafted (DRI: PMM/sales lead, by <date>)
- [ ] Pricing & packaging confirmed (DRI: PM, by <date>)
- [ ] Legal / privacy / compliance review filed (DRI: legal, by <date>)
- [ ] Internal stakeholders identified (PM, design, eng, support, sales, marketing)

## T-2 weeks · Prepare
- [ ] Help-center article drafted (DRI: docs, by <date>)
- [ ] Support FAQ written (DRI: support lead, by <date>)
- [ ] In-app announcement copy + design (DRI: designer, by <date>)
- [ ] Email blast / changelog post drafted (DRI: PMM, by <date>)
- [ ] Sales enablement deck/Loom (DRI: PMM, by <date>)
- [ ] Demo video / screencast (DRI: PM/designer, by <date>)

## T-1 week · Rehearse
- [ ] Support team can demo the feature (DRI: support lead) — **gating signal**
- [ ] Internal announcement posted (DRI: PM)
- [ ] Beta cohort identified + opted in (DRI: PM)
- [ ] On-call rotation aware of launch + escalation path
- [ ] Rollback plan documented + tested (DRI: engineer)
- [ ] Metrics dashboard live + alerts configured (DRI: engineer)

## Launch day
- [ ] Feature flag flipped at <time>
- [ ] In-app announcement live
- [ ] Email/blog/changelog posted
- [ ] Social posts queued
- [ ] On-call engineer + support lead in war room channel for first 4h
- [ ] Hourly check on error rate + support volume for first 8h

## T+1 week · Land
- [ ] Adoption metrics vs. baseline (DRI: PM)
- [ ] Support ticket volume + themes (DRI: support lead)
- [ ] Win/loss / customer feedback collected
- [ ] Retro scheduled (DRI: PM, within 14 days)

## T+2 weeks · Learn
- [ ] Launch retrospective doc written
- [ ] Action items filed
- [ ] Decision log updated
```

3. **File the prep work as Linear tickets.** Each `T-3` / `T-2` / `T-1` checkbox becomes a Linear issue with the DRI as assignee, due date set, label `launch:<feature>`. Do not file `Launch day` or post-launch items as tickets — those live in the checklist.
4. **Schedule the comms cascade.** Generate Slack draft messages for: internal announce (T-2 days), beta announce (T-0), broad announce (T-0 + 1 day). Save drafts to `runs/<id>/slack-drafts/`.
5. **Audit.** `events.jsonl`: `{ "type": "launch.checklist", "tickets_filed": N, "drafts_prepared": N, "target_date": "..." }`.

## Hard rules

- **Support readiness is the gating signal.** If support can't demo it, don't launch. Write this rule into the checklist as a blocker, not a checkbox.
- **Comms cascade matters.** Internal → beta → broad. Out of order = bad day.
- **Monitoring before launch.** Alerts and dashboards are pre-launch items, not post-launch.
- **Retro is mandatory.** The skill emits a calendar nudge at T+7.
- **Cross-functional DRI is one person.** Not "the launch committee."

## Refusal

If asked to launch in <T-1 week without an explicit "we accept the risk" sign-off from the operator, refuse and surface the missing items.
