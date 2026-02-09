import fs from 'fs';
import path from 'path';

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const testRoot = path.join(root, 'tests', 'src');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function expectedTestPath(srcFile) {
  const rel = path.relative(srcRoot, srcFile);
  const ext = path.extname(rel);
  const base = rel.slice(0, -ext.length);
  const testExt = ext === '.tsx' ? '.test.tsx' : '.test.ts';
  return path.join(testRoot, `${base}${testExt}`);
}

const srcFiles = walk(srcRoot)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
  .filter((file) => !file.endsWith('.d.ts'));

const missing = [];
for (const file of srcFiles) {
  const expected = expectedTestPath(file);
  if (!fs.existsSync(expected)) missing.push(expected);
}

if (missing.length > 0) {
  console.error('Missing tests for src files:');
  for (const file of missing) console.error(`- ${path.relative(root, file)}`);
  process.exit(1);
}

console.log('Test structure OK');
