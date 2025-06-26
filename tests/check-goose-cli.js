const { execSync } = require('child_process');

function checkGooseCli() {
  try {
    execSync('goose --version', { stdio: 'ignore' });
  } catch {
    throw new Error('Goose CLI is required for these tests but was not found in PATH.');
  }
}

module.exports = { checkGooseCli }; 