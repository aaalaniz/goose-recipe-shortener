const core = require('@actions/core');
const { runGooseRecipeShortener } = require('./index');

async function main() {
  try {
    const recipePath = core.getInput('recipe_path', { required: true });
    const shortener = core.getInput('shortener');
    const shortUrlPath = core.getInput('short_url_path');
    const shortioApiKey = core.getInput('shortio_api_key');
    const shortioDomain = core.getInput('shortio_domain');
    const bitlyApiKey = core.getInput('bitly_api_key');
    const bitlyDomain = core.getInput('bitly_domain');

    const result = await runGooseRecipeShortener({
      recipePath,
      shortener,
      shortUrlPath,
      shortioApiKey,
      shortioDomain,
      bitlyApiKey,
      bitlyDomain,
    });

    core.setOutput('goose_deep_link', result.gooseDeepLink);
    if (result.shortUrl) {
      core.setOutput('short_url', result.shortUrl);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main(); 