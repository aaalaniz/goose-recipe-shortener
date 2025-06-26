const { execFile } = require('child_process');
const util = require('util');
const execFileAsync = util.promisify(execFile);

async function generateGooseDeepLink(recipePath) {
  // Validate the recipe
  try {
    await execFileAsync('goose', ['recipe', 'validate', recipePath]);
  } catch (err) {
    throw new Error(`Goose recipe validation failed for ${recipePath}: ${err.stderr || err.message}`);
  }

  // Generate the deep link
  try {
    const { stdout } = await execFileAsync('goose', ['recipe', 'deeplink', recipePath]);
    const match = stdout.match(/goose:\/\/recipe[^\s]*/);
    if (match) {
      return match[0];
    }
    throw new Error('No goose://recipe deeplink found in output');
  } catch (err) {
    throw new Error(`Goose recipe deeplink generation failed for ${recipePath}: ${err.stderr || err.message}`);
  }
}

module.exports = { generateGooseDeepLink }; 