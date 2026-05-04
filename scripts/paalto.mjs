#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const command = process.argv[2] ?? 'help';
const args = process.argv.slice(3);

function run(script, scriptArgs = []) {
  const result = spawnSync(process.execPath, [script, ...scriptArgs], { cwd: root, stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

function ensureRoot() {
  if (!fs.existsSync(path.join(root, 'agents')) || !fs.existsSync(path.join(root, 'workflows'))) {
    console.error('Run this command from the paalto repo root.');
    process.exit(1);
  }
}

function writeIfMissing(target, content) {
  if (fs.existsSync(target)) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  return true;
}

const contextTemplates = {
  'context/product-voice.md': `# Product Voice

## Audience

- Primary users:
- Buyer / evaluator:
- Technical depth:
- Emotional state when they arrive:

## Voice Principles

- Clear over clever.
- Specific over generic.
- Show the working when trust matters.
- Avoid hype, fake certainty, and vague AI language.

## Words We Use

- 

## Words We Avoid

- 

## Example Copy

### Good

> 

### Bad

> 

## Launch Tone

- Product updates should sound:
- Incident updates should sound:
- Sales/support handoff should sound:
`,
  'context/design-system.md': `# Design System

## Foundations

- Typography:
- Color tokens:
- Spacing scale:
- Radius:
- Icons:
- Motion:

## Components

| Component | Source | Notes |
|---|---|---|
| Button |  |  |
| Form field |  |  |
| Modal |  |  |
| Table |  |  |
| Navigation |  |  |
| Empty state |  |  |

## Accessibility Rules

- Keyboard support:
- Focus states:
- Contrast target:
- Reduced motion:
- Screen reader labels:

## Product-Specific Patterns

- 

## Figma / Handoff

- Figma file:
- Component library:
- Handoff expectations:
`,
  'context/company-strategy.md': `# Company Strategy

## Current Bet

- Customer:
- Problem:
- Why now:
- Metric:
- Non-goals:

## ICP

- Best-fit customer:
- Bad-fit customer:
- Buying trigger:
- Existing workaround:

## Product Principles

1. 
2. 
3. 

## Roadmap Themes

| Theme | Why it matters | Evidence | Time horizon |
|---|---|---|---|
|  |  |  |  |

## Decision Log Links

- 
`,
  'context/engineering-standards.md': `# Engineering Standards

## Stack

- App framework:
- Language:
- Package manager:
- Test runner:
- CI:
- Deploy target:

## Code Rules

- Match existing patterns before introducing new abstractions.
- Add tests with product changes.
- Keep PRs small enough to review.
- Do not add secrets to code.
- Open draft PRs only; humans merge.

## Review Requirements

- Required checks:
- Manual QA expectations:
- Security review triggers:
- Performance review triggers:

## Observability

- Logs:
- Metrics:
- Error tracking:
- Runbooks:

## Release Rules

- Release cadence:
- Rollback owner:
- Launch comms owner:
`
};

function runId(prefix) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const suffix = Math.random().toString(16).slice(2, 8);
  return `${stamp}__setup__${prefix}__${suffix}`;
}

function setupChecklist(mode) {
  const local = mode === 'local';
  return `# paalto Setup Checklist

Mode: ${local ? 'Local no-key demo' : 'Full sandbox integration'}

## Goal

${local ? 'Understand paalto without connecting external tools.' : 'Run paalto against sandbox GitHub, Linear, Notion, and Slack tools before production.'}

## Do This First

- [ ] Open https://paalto.dev/demo.html and click Run demo.
- [ ] Run npm run doctor.
- [ ] Run npm run demo.
- [ ] Inspect the newest runs/<id>/ folder.

## Local Artifacts To Inspect

- [ ] events.jsonl
- [ ] transcript.md
- [ ] prd.md
- [ ] tickets.md
- [ ] copy.md
- [ ] pr-description.md
- [ ] release-notes.md
- [ ] slack-draft.json with send: false

## Team Context

- [ ] Fill context/product-voice.md.
- [ ] Fill context/company-strategy.md.
- [ ] Fill context/design-system.md.
- [ ] Fill context/engineering-standards.md.

${local ? `## Stop Here

Do not add API keys for the local demo. Send docs/tester-guide.md to PM, design, or ops testers and ask them whether the browser demo explains the value.
` : `## Sandbox Credentials

- [ ] GITHUB_TOKEN targets one sandbox repo only.
- [ ] LINEAR_API_KEY belongs to a sandbox workspace/team.
- [ ] NOTION_API_KEY is connected to a test PRD database.
- [ ] SLACK_BOT_TOKEN can write only to a test channel.
- [ ] GITHUB_DEFAULT_OWNER and GITHUB_DEFAULT_REPO point to the sandbox repo.

## Live Safety Check

- [ ] npm run validate passes.
- [ ] npm run guardrails passes.
- [ ] npm run run:loom-to-pr prints the Claude Code prompt.
- [ ] Human confirms draft PR only, no auto-merge.
- [ ] Human confirms Slack draft only, no auto-send.
`}
`;
}

function liveTestPlan() {
  return `# Live Sandbox Test Plan

Use this only with sandbox tools.

## Acceptance Criteria

- [ ] Notion PRD created in Draft status.
- [ ] Linear tickets created in the sandbox team.
- [ ] GitHub draft PR opened against the sandbox repo.
- [ ] Slack release note drafted locally and not sent.
- [ ] Five gates appear: vision, prioritization, design taste, merge approval, launch comms.
- [ ] No secrets appear in git status, generated markdown, PR body, or logs.

## Prompt

Run workflows/ship-a-feature.md using examples/loom-to-pr/input/brief.md as the brief and examples/loom-to-pr/input/loom-transcript.vtt as the transcript. Repo: <sandbox-owner>/<sandbox-repo>.

Use the five human gates exactly as written. Do not merge code. Do not send Slack messages. Open draft PRs only. Write all local artifacts to runs/<run_id>/.
`;
}

function writeSetupArtifacts(mode) {
  const setupDir = path.join(root, 'runs', runId(mode));
  fs.mkdirSync(setupDir, { recursive: true });
  fs.writeFileSync(path.join(setupDir, 'setup-checklist.md'), setupChecklist(mode));
  if (mode === 'full') fs.writeFileSync(path.join(setupDir, 'live-test-plan.md'), liveTestPlan());
  return path.relative(root, setupDir).split(path.sep).join('/');
}

function init() {
  ensureRoot();
  const modeArg = args.find((arg) => ['--local-demo', '--local', '--full', '--sandbox'].includes(arg));
  const setupMode = modeArg === '--full' || modeArg === '--sandbox' ? 'full' : modeArg ? 'local' : null;
  const created = [];
  const skipped = [];

  const envExample = path.join(root, '.env.example');
  const env = path.join(root, '.env');
  if (!fs.existsSync(envExample)) {
    console.error('Missing .env.example. Cannot initialize workspace.');
    process.exit(1);
  }
  if (writeIfMissing(env, fs.readFileSync(envExample, 'utf8'))) created.push('.env');
  else skipped.push('.env');

  for (const [file, content] of Object.entries(contextTemplates)) {
    if (writeIfMissing(path.join(root, file), content)) created.push(file);
    else skipped.push(file);
  }

  let setupDir = null;
  if (setupMode) setupDir = writeSetupArtifacts(setupMode);

  console.log('paalto init complete.');
  if (created.length) console.log(`created: ${created.join(', ')}`);
  if (skipped.length) console.log(`already present: ${skipped.join(', ')}`);
  if (setupDir) console.log(`setup checklist: ${setupDir}/setup-checklist.md`);
  console.log('\nNext:');
  if (setupMode === 'local') {
    console.log('1. Open https://paalto.dev/demo.html for the no-setup browser demo.');
    console.log('2. Run npm run doctor && npm run demo.');
    console.log('3. Send docs/tester-guide.md to non-technical testers.');
  } else if (setupMode === 'full') {
    console.log('1. Fill .env with sandbox GitHub, Linear, Notion, and Slack credentials.');
    console.log('2. Edit context/*.md with your product voice, design system, strategy, and engineering rules.');
    console.log('3. Run npm run doctor && npm run validate && npm run guardrails.');
  } else {
    console.log('1. For non-technical testers, open https://paalto.dev/demo.html.');
    console.log('2. For local testing, run npm run setup:local && npm run demo.');
    console.log('3. For sandbox integrations, run npm run setup:full after credentials exist.');
  }
}

function runWorkflow() {
  ensureRoot();
  const name = args[0] ?? 'loom-to-pr';
  if (name !== 'loom-to-pr') {
    console.error(`Unknown workflow example: ${name}`);
    console.error('Available: loom-to-pr');
    process.exit(1);
  }

  const owner = process.env.GITHUB_DEFAULT_OWNER || '<sandbox-owner>';
  const repo = process.env.GITHUB_DEFAULT_REPO || '<sandbox-repo>';
  const prompt = `Run workflows/ship-a-feature.md using examples/loom-to-pr/input/brief.md as the brief and examples/loom-to-pr/input/loom-transcript.vtt as the transcript. Repo: ${owner}/${repo}.\n\nUse the five human gates exactly as written. Do not merge code. Do not send Slack messages. Open draft PRs only. Write all local artifacts to runs/<run_id>/.`;

  console.log('Paste this into Claude Code from the paalto repo root:\n');
  console.log(prompt);
  console.log('\nBefore running live tools, confirm npm run doctor, npm run validate, and npm run guardrails all pass.');
}

function help() {
  console.log(`paalto\n\nUsage:\n  paalto init             Create .env from .env.example and point to context files\n  paalto init --local     Create a local no-key setup checklist\n  paalto init --full      Create a sandbox integration setup checklist\n  paalto doctor           Check setup, wiring, guardrails, MCP, and artifact safety\n  paalto demo             Create a no-API local Loom-to-PR run folder\n  paalto validate         Validate skill structure and agent wiring\n  paalto guardrails       Validate security boundaries and edge cases\n  paalto build            Build the static site into dist/\n  paalto run loom-to-pr   Print the Claude Code prompt for the live workflow\n`);
}

switch (command) {
  case 'init':
    init();
    break;
  case 'doctor':
    run('scripts/doctor.mjs');
    break;
  case 'demo':
    run('scripts/demo-run.mjs');
    break;
  case 'validate':
    run('scripts/validate-skills.mjs');
    break;
  case 'guardrails':
    run('scripts/validate-guardrails.mjs');
    break;
  case 'build':
    run('scripts/build-site.mjs');
    break;
  case 'run':
    runWorkflow();
    break;
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  default:
    console.error(`Unknown command: ${command}\n`);
    help();
    process.exit(1);
}
