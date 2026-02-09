#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  const out = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  if (!/\.changeset\//.test(out)) {
    console.error(
      '\nError: No changeset file staged. Create one with `npx changeset` and stage it before committing.'
    );
    process.exit(1);
  }
  process.exit(0);
} catch (err) {
  console.error('Could not check staged files for changesets. Ensure this is a git repo.');
  process.exit(1);
}
