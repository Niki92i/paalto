---
name: test-plan
role: engineer
inputs: [prd_url_or_path, optional:repo]
outputs: [runs/<run_id>/test-plan.md]
tools: [filesystem, mcp:github]
gates: []
---

# Skill — Test Plan Writer

Convert a PRD into a test plan the operator can execute manually before merge, and the Engineer can encode as automated tests.

## Procedure

1. **Read the PRD.** Extract every AC.
2. **For each AC produce two rows:**

| AC | Test type | Steps | Expected | Auto / Manual | Source |
|---|---|---|---|---|---|

   - **Test type:** unit / integration / e2e / manual.
   - **Steps:** numbered, observable, no internal jargon.
   - **Expected:** what the operator sees (UI) or asserts (API).
   - **Auto / Manual:** automate by default; mark `Manual` only when automation cost > value (visual regression, vendor flakiness, real-money flow).
   - **Source:** verbatim AC text or the PRD section it derives from.

3. **Add a "Risks not covered" section.** Include at least 2: data we can't simulate, browsers/devices we don't test, third-party dependencies that could break us silently.
4. **Add a "Pre-merge checklist"** the operator runs at g4: 3–7 manual steps, max 5 minutes total. Anything longer goes in automated tests.
5. **Write to** `runs/<run_id>/test-plan.md`.
6. **Audit.** `events.jsonl`: `{ "type": "test-plan.drafted", "auto": N, "manual": N, "acs_uncovered": N }`.

## Hard rules

- Every AC must produce ≥1 row. If an AC is too vague to test, refuse and surface to PM for sharpening — not a system gap, a PRD gap.
- "Looks good" is never an expected outcome. Specify the assertion.
- The Pre-merge checklist must fit on one screen. Long manual checklists are not run.

## Refusal

If asked to write a test plan without ACs, refuse — testing without acceptance criteria is theatre.
