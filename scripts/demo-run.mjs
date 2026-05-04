import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const exampleRoot = path.join(root, 'examples/loom-to-pr');
const expectedRoot = path.join(exampleRoot, 'expected');
const inputRoot = path.join(exampleRoot, 'input');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const runId = crypto.randomBytes(3).toString('hex');
const runDir = path.join(root, 'runs', `${timestamp}__demo__loom-to-pr__${runId}`);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function write(name, content) {
  fs.writeFileSync(path.join(runDir, name), content.endsWith('\n') ? content : `${content}\n`);
}

function copyExpected(sourceName, targetName = sourceName) {
  const source = path.join(expectedRoot, sourceName);
  if (!fs.existsSync(source)) throw new Error(`Missing expected artifact: ${source}`);
  fs.copyFileSync(source, path.join(runDir, targetName));
}

fs.mkdirSync(runDir, { recursive: true });

const brief = read('examples/loom-to-pr/input/brief.md').trim();
const transcript = read('examples/loom-to-pr/input/loom-transcript.vtt').trim();
const transcriptExcerpt = transcript.split('\n').slice(0, 18).join('\n');
const now = new Date().toISOString();

function event(fields) {
  return { ts: now, run_id: runId, inputs_hash: 'sha256:demo', tool_calls: [], ...fields };
}

const events = [
  event({ agent: 'orchestrator', skill: 'demo-run', type: 'run.start' }),
  event({ agent: 'pm', skill: 'interview-synthesizer', type: 'step.end', artifact: 'transcript.md' }),
  event({ agent: 'orchestrator', skill: 'ship-a-feature', type: 'gate.approved', gate: 'g1_vision' }),
  event({ agent: 'pm', skill: 'prd-drafter', type: 'prd.drafted', artifact: 'prd.md' }),
  event({ agent: 'orchestrator', skill: 'ship-a-feature', type: 'gate.approved', gate: 'g2_prioritization' }),
  event({ agent: 'designer', skill: 'ux-copy', type: 'step.end', artifact: 'copy.md' }),
  event({ agent: 'pm', skill: 'ticket-breaker', type: 'tickets.created', artifact: 'tickets.md' }),
  event({ agent: 'engineer', skill: 'pr-builder', type: 'pr.opened', artifact: 'pr-description.md', draft: true }),
  event({ agent: 'engineer', skill: 'release-notes', type: 'release-notes.drafted', artifact: 'release-notes.md' }),
  event({ agent: 'orchestrator', skill: 'demo-run', type: 'run.end', outputs: ['prd.md', 'tickets.md', 'copy.md', 'pr-description.md', 'release-notes.md', 'summary.md'] })
];

write('transcript.md', `# Demo Run Transcript\n\nThis is a local, no-API dry run generated from examples/loom-to-pr. It proves the repo can create a run folder and audit trail without touching GitHub, Linear, Notion, or Slack.\n\n## Brief\n\n${brief}\n\n## Transcript Excerpt\n\n${transcriptExcerpt}\n\n## Gates\n\n- g1_vision: auto-approved for demo only\n- g2_prioritization: auto-approved for demo only\n- g3_design_taste: represented by reference copy artifact\n- g4_merge_approval: represented by draft PR description artifact\n- g5_launch_comms: represented by release-note draft artifact\n`);

copyExpected('prd.md');
copyExpected('tickets.md');
copyExpected('copy.md');
copyExpected('pr-description.md');
copyExpected('release-notes.md');

write('slack-draft.json', JSON.stringify({
  channel: '${SLACK_DEFAULT_CHANNEL}',
  send: false,
  reason: 'Demo runs never post externally.',
  text: fs.readFileSync(path.join(expectedRoot, 'release-notes.md'), 'utf8').split('\n').slice(0, 12).join('\n')
}, null, 2));

write('events.jsonl', events.map((event) => JSON.stringify(event)).join('\n'));
write('summary.md', `# Demo Run Summary\n\nRun ID: ${runId}\n\nCreated a local audit folder from the Loom-to-PR example. No external services were called.\n\n## Artifacts\n\n- transcript.md\n- events.jsonl\n- prd.md\n- tickets.md\n- copy.md\n- pr-description.md\n- release-notes.md\n- slack-draft.json\n\n## Next Real Run\n\n1. Fill .env with GitHub, Linear, Notion, and Slack keys.\n2. Open this repo in Claude Code.\n3. Ask Claude Code to run workflows/ship-a-feature.md on examples/loom-to-pr.\n`);

console.log(`Demo run created: ${path.relative(root, runDir).split(path.sep).join('/')}`);
console.log('No external APIs were called. Inspect transcript.md and events.jsonl in that folder.');
