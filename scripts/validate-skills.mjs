import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skillRoot = path.join(root, 'skills');
const agentRoot = path.join(root, 'agents');

const requiredFrontmatter = ['name', 'role', 'inputs', 'outputs', 'tools', 'gates'];
const requiredSections = ['# Skill — ', '## Procedure', '## Hard rules', '## Refusal'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (entry.isFile() && entry.name.endsWith('.md')) return [full];
    return [];
  });
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : null;
}

function parseAgentSkills(text) {
  const fm = parseFrontmatter(text);
  if (!fm) return [];
  const lines = fm.split('\n');
  const skills = [];
  let inSkills = false;
  for (const line of lines) {
    if (/^skills:/.test(line)) {
      inSkills = true;
      continue;
    }
    if (inSkills && /^[a-zA-Z_]+:/.test(line)) break;
    const match = line.match(/^\s*-\s+(skills\/[^\s#]+\.md)\s*$/);
    if (match) skills.push(match[1]);
  }
  return skills;
}

const errors = [];
const skillFiles = walk(skillRoot);
const skillNames = new Map();

for (const file of skillFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) {
    errors.push(`${rel(file)}: missing frontmatter`);
    continue;
  }

  for (const key of requiredFrontmatter) {
    if (!new RegExp(`^${key}:`, 'm').test(fm)) errors.push(`${rel(file)}: missing ${key}`);
  }

  for (const section of requiredSections) {
    if (!text.includes(section)) errors.push(`${rel(file)}: missing ${section}`);
  }

  if (!text.includes('events.jsonl')) errors.push(`${rel(file)}: missing events.jsonl audit instruction`);

  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (name) {
    if (skillNames.has(name)) errors.push(`${rel(file)}: duplicate skill name ${name} also in ${skillNames.get(name)}`);
    skillNames.set(name, rel(file));
  }
}

const agentFiles = walk(agentRoot);
const listedSkills = new Set();

for (const agent of agentFiles) {
  const text = fs.readFileSync(agent, 'utf8');
  const skills = parseAgentSkills(text);
  for (const skill of skills) {
    listedSkills.add(skill);
    if (!fs.existsSync(path.join(root, skill))) errors.push(`${rel(agent)}: listed skill does not exist: ${skill}`);
  }
}

for (const file of skillFiles.map(rel)) {
  if (!listedSkills.has(file)) errors.push(`${file}: not listed in any agent skills list`);
}

console.log(`skills=${skillFiles.length}`);
console.log(`agent_listed_skills=${listedSkills.size}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Skill structure and agent wiring checks passed.');
