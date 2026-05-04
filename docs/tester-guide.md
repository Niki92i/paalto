# Non-Technical Tester Guide

Use this guide when you want someone to understand paalto without setting up a developer environment first.

## Path A: I just want to understand it

Open:

```text
https://paalto.dev/demo.html
```

Do this:

1. Click **Run demo**.
2. Read the generated PRD, tickets, UX copy, draft PR plan, launch note, and audit trail.
3. Answer the tester questions below.

No GitHub account, terminal, Claude Code setup, API key, or production data is required.

## Path B: I can ask a technical teammate to run it

Send them this:

```text
Can you test paalto for me?

1. Clone https://github.com/Niki92i/paalto
2. Run:
   npm run setup:local
   npm run doctor
   npm run demo
3. Send me the generated runs/<id>/ folder summary, especially events.jsonl, prd.md, tickets.md, pr-description.md, and slack-draft.json.

Please do not connect production tools. Local demo only.
```

## Path C: I use Claude Code

```bash
git clone https://github.com/Niki92i/paalto.git
cd paalto
npm run setup:local
npm run doctor
npm run demo
npm run run:loom-to-pr
```

Paste the generated prompt into Claude Code from the repo root if you want to test the live workflow shape. Use sandbox tools only.

## Path D: I want a real sandbox test

Ask for sandbox credentials, not production credentials:

- GitHub sandbox repo
- Linear sandbox team
- Notion test database
- Slack test channel

Then run:

```bash
npm run setup:full
npm run doctor
npm run validate
npm run guardrails
npm run run:loom-to-pr
```

Expected behavior:

- Notion PRD is created in Draft status.
- Linear tickets are created in the sandbox team.
- GitHub PR is opened as a draft and left unmerged.
- Slack release note is drafted, not sent.
- Five human gates are respected.

## Tester Questions

Please answer these after Path A or Path B:

1. Could you explain what paalto does in one sentence?
2. Which artifact was most useful: PRD, tickets, copy, PR plan, launch note, or audit trail?
3. Did anything feel generic or fake?
4. Where did you feel stuck?
5. Would you use this after a Loom, customer call, or product review?
6. What would you need before trusting it with real tools?

## What Good Feedback Looks Like

Good feedback is specific:

- "The PRD was useful, but I wanted the risk section earlier."
- "I understood the browser demo, but the live setup still needs an engineer."
- "I would use this for customer-call followups, not for strategy decisions."

Avoid broad feedback like "looks cool" unless you also name the moment where it became useful.
