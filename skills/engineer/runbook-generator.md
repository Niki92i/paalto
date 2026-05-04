---
name: runbook-generator
role: engineer
inputs: [alert_or_failure_mode, optional:service_owner]
outputs: [runs/<run_id>/runbook.md, optional:docs/runbooks/<slug>.md]
tools: [filesystem, mcp:github]
gates: []
---

# Skill — Runbook Generator

Operational doc the on-call uses at 3am. Decision trees (if/then), not prose. Verification commands per step. Time-based escalation. Never includes RCA — runbooks are for resolving, not learning.

## Procedure

1. **Identify the alert or failure mode.** Pull the alert definition (Prometheus / Datadog / Sentry rule). One alert = one runbook section.
2. **Decompose into a decision tree:**

```
ALERT: <name>
│
├── Step 1: Check <signal>
│   ├── If A: → Step 2A
│   └── If B: → Step 2B
│
├── Step 2A: <action>
│   └── Verify: <command>
│       ├── Pass → resolved, log, monitor 30 min
│       └── Fail → Step 3
│
└── ...
```

3. **For each step, specify:**
   - **What to check** (specific command, dashboard URL, query)
   - **Expected output** (what "good" looks like)
   - **What to do** if the output is bad (next step)
   - **Verification command** that the action worked
4. **Escalation rules:**
   - **T+0** — on-call engineer responds, ack the alert
   - **T+15 min** — if not resolved, page the secondary
   - **T+30 min** — if not resolved, page the service owner / engineering lead
   - **T+60 min** — declare incident, page IC (incident commander)
5. **Write:**

```markdown
# Runbook — <alert / failure mode>
**Service:** <name> · **Owner:** <team> · **Severity:** <P0-P3> · **Last updated:** <date>

## Symptoms
<what the user / monitoring sees>

## Impact
<who's affected, business impact>

## Initial triage (do these first, in order)
1. **Acknowledge alert** in <tool>
2. **Check service dashboard:** <link>
3. **Check recent deploys:** `<command>` — if a deploy in last 30 min, suspect first

## Decision tree
### If <symptom A>
1. Run: `<command>`
2. Expected: `<output>`
3. If output is `<X>`:
   - Action: `<command or steps>`
   - Verify: `<command>`
   - If verified, monitor 30 min, write incident note, close.
4. If output is `<Y>`: → next branch

### If <symptom B>
...

## Common fixes
- **Restart pod:** `<command>` (loses in-flight requests; use only if backed by graceful drain)
- **Roll back deploy:** `<command>` — requires <approver> for prod
- **Scale up:** `<command>` — costs ~$X/h, OK to do without approval
- **Drain node:** `<command>` — coordinate with on-call SRE

## What NOT to do
- Do NOT <antipattern> — caused incident <link>
- Do NOT <antipattern>

## Escalation
- T+15 min unresolved → page <secondary>
- T+30 min → page <service owner>
- T+60 min → declare incident, page IC

## Verification of resolution
- <command/check that confirms recovery>
- Monitor for <duration> before closing alert

## Links
- Service dashboard: <url>
- Alert definition: <url>
- Recent incidents: <links>
```

6. **Save** to `docs/runbooks/<alert-slug>.md` in the repo. Open as draft PR.
7. **Audit.** `events.jsonl`: `{ "type": "runbook.generated", "alert": "...", "steps": N, "verification_commands": N, "escalations": N }`.

## Hard rules

- **Decision trees, not prose.** At 3am no one reads paragraphs.
- **Verification commands per step.** Otherwise the on-call doesn't know if the fix worked.
- **Time-based escalation.** Not "if it feels bad" — at T+15, page.
- **`What NOT to do` section.** Captures hard-won lessons that don't fit the happy path.
- **Never includes RCA.** Runbooks are for resolving. Learning lives in `incident-postmortem`.
- **One runbook per alert.** Multi-alert runbooks become unfindable.

## Refusal

If asked to write a runbook without verification commands ("just describe the steps"), refuse — that's a wiki, not a runbook.
