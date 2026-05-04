import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const requiredPaths = [
  'agents/orchestrator.md',
  'agents/pm.md',
  'agents/designer.md',
  'agents/engineer.md',
  'workflows/ship-a-feature.md',
  'integrations/mcp.json',
  '.env.example',
  'context/product-voice.md',
  'context/design-system.md',
  'context/company-strategy.md',
  'context/engineering-standards.md',
  'site/demo.html',
  'docs/tester-guide.md',
  'docs/cloud-setup.md',
  '.devcontainer/devcontainer.json',
  'examples/loom-to-pr/input/brief.md',
  'examples/loom-to-pr/input/loom-transcript.vtt',
  'examples/loom-to-pr/expected/prd.md',
  'docs/proof-path.md',
  'runs/README.md'
];
const dayOneEnv = ['GITHUB_TOKEN', 'LINEAR_API_KEY', 'NOTION_API_KEY', 'SLACK_BOT_TOKEN'];

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() ? [full] : [];
  });
}

function readEnv(file) {
  if (!fs.existsSync(file)) return new Map();
  const env = new Map();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    env.set(trimmed.slice(0, index), trimmed.slice(index + 1));
  }
  return env;
}

function print(status, message) {
  const prefix = status === 'ok' ? '[ok]' : status === 'warn' ? '[warn]' : '[fail]';
  console.log(`${prefix} ${message}`);
}

const failures = [];
const warnings = [];

const major = Number.parseInt(process.versions.node.split('.')[0], 10);
if (major >= 20) print('ok', `Node ${process.versions.node}`);
else {
  failures.push(`Node ${process.versions.node} found; Node >=20 is required for MCP servers.`);
  print('fail', failures.at(-1));
}

for (const requiredPath of requiredPaths) {
  const full = path.join(root, requiredPath);
  if (fs.existsSync(full)) print('ok', `${requiredPath} exists`);
  else {
    failures.push(`${requiredPath} is missing`);
    print('fail', failures.at(-1));
  }
}

const skillFiles = walk(path.join(root, 'skills')).filter((file) => file.endsWith('.md'));
const agentFiles = walk(path.join(root, 'agents')).filter((file) => file.endsWith('.md'));
print('ok', `${agentFiles.length} agent files found`);
print('ok', `${skillFiles.length} skill files found`);

const validation = spawnSync(process.execPath, ['scripts/validate-skills.mjs'], { cwd: root, encoding: 'utf8' });
if (validation.status === 0) print('ok', 'Skill structure and agent wiring validate');
else {
  failures.push('Skill validation failed');
  print('fail', 'Skill validation failed');
  process.stdout.write(validation.stdout);
  process.stderr.write(validation.stderr);
}

const guardrails = spawnSync(process.execPath, ['scripts/validate-guardrails.mjs'], { cwd: root, encoding: 'utf8' });
if (guardrails.status === 0) print('ok', 'Guardrail, security, and edge-case checks validate');
else {
  failures.push('Guardrail validation failed');
  print('fail', 'Guardrail validation failed');
  process.stdout.write(guardrails.stdout);
  process.stderr.write(guardrails.stderr);
}

try {
  const mcp = JSON.parse(fs.readFileSync(path.join(root, 'integrations/mcp.json'), 'utf8'));
  const servers = Object.keys(mcp.mcpServers ?? {});
  if (servers.length) print('ok', `MCP servers configured: ${servers.join(', ')}`);
  else {
    failures.push('integrations/mcp.json has no mcpServers');
    print('fail', failures.at(-1));
  }
} catch (error) {
  failures.push(`integrations/mcp.json is invalid JSON: ${error.message}`);
  print('fail', failures.at(-1));
}

const envExample = readEnv(path.join(root, '.env.example'));
for (const key of dayOneEnv) {
  if (envExample.has(key)) print('ok', `.env.example includes ${key}`);
  else {
    failures.push(`.env.example missing ${key}`);
    print('fail', failures.at(-1));
  }
}

const env = readEnv(path.join(root, '.env'));
if (!fs.existsSync(path.join(root, '.env'))) {
  warnings.push('No .env file found. Run `cp .env.example .env` before connecting real tools. `npm run demo` still works without keys.');
} else {
  const missingValues = dayOneEnv.filter((key) => !env.get(key));
  if (missingValues.length) warnings.push(`.env is missing day-one values: ${missingValues.join(', ')}. Real GitHub/Linear/Notion/Slack runs will pause or fail until these are filled.`);
  else print('ok', '.env has day-one integration values');
}

const ignoredRuns = fs.existsSync(path.join(root, '.gitignore')) && fs.readFileSync(path.join(root, '.gitignore'), 'utf8').includes('runs/*/');
if (ignoredRuns) print('ok', 'runs/*/ artifacts are gitignored by default');
else warnings.push('runs/*/ is not ignored; audit artifacts may contain customer data.');

for (const warning of warnings) print('warn', warning);

if (failures.length) {
  console.error(`\nDoctor failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log('\nDoctor passed. You can run `npm run demo` without API keys, or open the repo in Claude Code for a real gated workflow.');
