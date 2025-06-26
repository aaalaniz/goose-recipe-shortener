const core = require('@actions/core');
const { generateGooseDeepLink } = require('./goose');
const { ShortioShortener } = require('./shorteners/shortio');

async function run() {
  try {
    const recipePath = core.getInput('recipe_path', { required: true });

    // Generate the Goose deep link
    const gooseDeepLink = await generateGooseDeepLink(recipePath);
    core.setOutput('goose_deep_link', gooseDeepLink);

    // Shorten the URL if a shortener is provided
    const shortenerType = core.getInput('shortener');

    if (shortenerType && shortenerType !== 'none') {
      let shortener;
      const path = core.getInput('short_url_path', {required: true })
      switch (shortenerType) {
        case 'shortio': {
          const shortioApiKey = core.getInput('shortio_api_key', { required: true });
          const shortioDomain = core.getInput('shortio_domain', { required: true });
          shortener = new ShortioShortener(shortioApiKey, shortioDomain);

          break;
        }
        default:
          // No-op
          throw new Error(`Unknown shortener type ${shortenerType}`)
      }

      const shortUrl = await shortener.shorten(gooseDeepLink, path);
      core.setOutput('short_url', shortUrl);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run(); 