const { generateGooseDeepLink } = require('./goose');
const { ShortioShortener } = require('./shorteners/shortio');

/**
 * Runs the Goose recipe shortener logic.
 * @param {Object} params
 * @param {string} params.recipePath - Path to the Goose recipe file (YAML or JSON).
 * @param {string} [params.shortener] - Shortener to use. Supported: 'shortio'. Optional.
 * @param {string} [params.shortUrlPath] - The path for the shortened URL (required if using a shortener).
 * @param {string} [params.shortioApiKey] - Short.io API key (required if using 'shortio').
 * @param {string} [params.shortioDomain] - Short.io domain (required if using 'shortio').
 * @returns {Promise<{gooseDeepLink: string, shortUrl?: string}>}
 */
async function runGooseRecipeShortener({
  recipePath,
  shortener,
  shortUrlPath,
  shortioApiKey,
  shortioDomain,
}) {
  if (!recipePath) {
    throw new Error('recipePath is required');
  }
  const gooseDeepLink = await generateGooseDeepLink(recipePath);
  let shortUrl;

  if (shortener && shortener !== 'none') {
    let shortenerInstance;
    if (!shortUrlPath) {
      throw new Error('shortUrlPath is required when using a shortener');
    }
    switch (shortener) {
      case 'shortio': {
        if (!shortioApiKey) throw new Error('shortioApiKey is required for shortio');
        if (!shortioDomain) throw new Error('shortioDomain is required for shortio');
        shortenerInstance = new ShortioShortener(shortioApiKey, shortioDomain);
        break;
      }
      default:
        throw new Error(`Unknown shortener type ${shortener}`);
    }
    shortUrl = await shortenerInstance.shorten(gooseDeepLink, shortUrlPath);
  }

  return { gooseDeepLink, ...(shortUrl ? { shortUrl } : {}) };
}

module.exports = { runGooseRecipeShortener }; 