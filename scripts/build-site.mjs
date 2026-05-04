import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'site');
const outputDir = path.join(root, 'dist');
const ignored = new Set(['README.md', 'vercel.json']);

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyDir(sourceDir, outputDir);

const indexPath = path.join(outputDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  throw new Error('Build failed: dist/index.html was not created.');
}

console.log('Built static site to dist/');
