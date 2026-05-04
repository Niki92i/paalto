import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredGates = ['g1_vision', 'g2_prioritization', 'g3_design_taste', 'g4_merge_approval', 'g5_launch_comms'];
const sensitiveEnvPattern = /(TOKEN|KEY|SECRET|PASSWORD|ACCESS_TOKEN|API_KEY)$/;
const errors = [];
const safeAutoMergePattern = /\b(no|never|not|refuse|refuses|rejected|without|will not)\b/i;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function requireIncludes(relativePath, needles, reason) {
  const text = read(relativePath);
  for (const needle of needles) {
    if (!text.includes(needle)) errors.push(`${relativePath}: missing ${JSON.stringify(needle)} (${reason})`);
  }
}

function parseEnvTemplate(relativePath) {
  const env = new Map();
  for (const line of read(relativePath).split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    env.set(trimmed.slice(0, index), trimmed.slice(index + 1));
  }
  return env;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() ? [full] : [];
  });
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function collectMcpEnvRefs(value, refs = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectMcpEnvRefs(item, refs);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectMcpEnvRefs(item, refs);
  } else if (typeof value === 'string') {
    const match = value.match(/^\$\{([A-Z0-9_]+)\}$/);
    if (match) refs.push(match[1]);
    else if (value.includes('TOKEN') || value.includes('KEY') || value.includes('SECRET')) errors.push(`integrations/mcp.json: env-like value must be an env reference, got ${value}`);
  }
  return refs;
}

if (!exists('.gitignore')) errors.push('.gitignore is missing');
else {
  requireIncludes('.gitignore', ['.env', '.env.local', 'runs/*/', '!runs/.gitkeep', '!runs/README.md'], 'secrets and local run artifacts must stay out of git');
}

if (!exists('.env.example')) errors.push('.env.example is missing');
else {
  const env = parseEnvTemplate('.env.example');
  for (const [key, value] of env) {
    if (sensitiveEnvPattern.test(key) && value.trim() !== '') errors.push(`.env.example: ${key} must be empty, not prefilled`);
  }
}

requireIncludes('workflows/ship-a-feature.md', requiredGates, 'all five human gates must be listed');
requireIncludes('workflows/ship-a-feature.md', ['No gate is skippable', 'approve', 'revise <reason>', 'stop', 'DRAFT PR', 'Slack draft'], 'workflow must preserve human-gated operation');
requireIncludes('agents/orchestrator.md', requiredGates, 'orchestrator must own all human gates');
requireIncludes('agents/orchestrator.md', ['may never bypass a gate', 'Draft, never ship', 'refuse', 'auto-merge', 'auto-send', 'skip a gate'], 'orchestrator refusal boundaries must be explicit');
requireIncludes('agents/engineer.md', ['Draft PRs only', 'Never set `draft: false`', 'Never call merge endpoints', 'No secrets in code', 'No admin scopes', 'CI must pass before requesting g4', 'push directly to `main`'], 'engineer merge and secret boundaries must be explicit');
requireIncludes('skills/engineer/pr-builder.md', ['produce a **draft** GitHub PR', 'Never merge', 'Draft PRs only', 'CI must be green before requesting g4', 'No new secrets in code', 'If the operator says "merge it for me," refuse'], 'PR builder must enforce draft-only operation');
requireIncludes('skills/engineer/release-notes.md', ['Drafts only', 'do not send to the channel', 'Save it to `runs/<run_id>/slack-draft.json`', 'g5 owns sending', 'If asked to auto-send the Slack message, refuse'], 'release notes must never auto-send');
requireIncludes('runs/README.md', ['events.jsonl', 'gate.requested', 'gate.approved', 'gate.revised', 'gate.stopped', 'Every external API call'], 'run audit schema must include gates and tool calls');
requireIncludes('docs/security.md', ['Draft PRs only', 'No auto-send to customers', 'Human gates are not skippable', 'Per-agent tool scopes', 'No telemetry leaves your machine'], 'security posture must document the hard guarantees');

const packageJson = JSON.parse(read('package.json'));
for (const scriptName of ['build', 'validate', 'guardrails', 'doctor', 'demo']) {
  if (!packageJson.scripts?.[scriptName]) errors.push(`package.json: missing npm script ${scriptName}`);
}

const workflow = read('.github/workflows/validate.yml');
for (const command of ['npm run validate', 'npm run guardrails', 'npm run doctor', 'npm run build']) {
  if (!workflow.includes(command)) errors.push(`.github/workflows/validate.yml: missing ${command}`);
}

const mcp = JSON.parse(read('integrations/mcp.json'));
const servers = Object.keys(mcp.mcpServers ?? {});
for (const server of ['github', 'linear', 'notion', 'slack']) {
  if (!servers.includes(server)) errors.push(`integrations/mcp.json: missing day-one MCP server ${server}`);
}

const envRefs = new Set(collectMcpEnvRefs(mcp));
const envTemplate = parseEnvTemplate('.env.example');
for (const ref of envRefs) {
  if (!envTemplate.has(ref)) errors.push(`integrations/mcp.json: ${ref} is referenced but missing from .env.example`);
}

for (const file of walk(path.join(root, 'skills')).filter((candidate) => candidate.endsWith('.md'))) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    if (/auto-merge/i.test(line) && !safeAutoMergePattern.test(line)) {
      errors.push(`${relative(file)}:${index + 1}: unsafe auto-merge wording; skills may only mention auto-merge to forbid or refuse it`);
    }
  });
}

console.log(`guardrail_gates=${requiredGates.length}`);
console.log(`mcp_servers=${servers.length}`);
console.log(`mcp_env_refs=${envRefs.size}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Guardrail, security, and edge-case checks passed.');
