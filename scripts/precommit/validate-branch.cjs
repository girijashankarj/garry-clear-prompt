const { execSync } = require('child_process');

function getBranchName() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const branch = getBranchName();
if (!branch) process.exit(0);

const allowed = /^(main|qa|develop|feature\/.+|fix\/.+|hotfix\/.+|release\/\d{2}-\d{2}-\d{4})$/;

if (!allowed.test(branch)) {
  console.error(`Invalid branch name: ${branch}`);
  console.error('Allowed: main, qa, develop, feature/*, fix/*, hotfix/*, release/DD-MM-YYYY');
  process.exit(1);
}
