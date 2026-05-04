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

function init() {
  ensureRoot();
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

  console.log('paalto init complete.');
  if (created.length) console.log(`created: ${created.join(', ')}`);
  if (skipped.length) console.log(`already present: ${skipped.join(', ')}`);
  console.log('\nNext:');
  console.log('1. Fill .env with sandbox tool credentials when you are ready for live writes.');
  console.log('2. Edit context/*.md with your product voice, design system, strategy, and engineering rules.');
  console.log('3. Run npm run doctor && npm run demo.');
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
  console.log(`paalto\n\nUsage:\n  paalto init             Create .env from .env.example and point to context files\n  paalto doctor           Check setup, wiring, guardrails, MCP, and artifact safety\n  paalto demo             Create a no-API local Loom-to-PR run folder\n  paalto validate         Validate skill structure and agent wiring\n  paalto guardrails       Validate security boundaries and edge cases\n  paalto build            Build the static site into dist/\n  paalto run loom-to-pr   Print the Claude Code prompt for the live workflow\n`);
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
