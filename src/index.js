const { generateGooseDeepLink } = require('./goose');
const { ShortioShortener } = require('./shorteners/shortio');
const { BitlyShortener } = require('./shorteners/bitly');
const { CustomShortener } = require('./shorteners/custom');

/**
 * Runs the Goose recipe shortener logic.
 * @param {Object} params
 * @param {string} params.recipePath - Path to the Goose recipe file (YAML or JSON).
 * @param {string} [params.shortener] - Shortener to use. Supported: 'shortio', 'bitly', 'custom'. Optional.
 * @param {string} [params.shortUrlPath] - The path for the shortened URL (required if using a shortener).
 * @param {string} [params.shortioApiKey] - Short.io API key (required if using 'shortio').
 * @param {string} [params.shortioDomain] - Short.io domain (required if using 'shortio').
 * @param {string} [params.bitlyApiKey] - Bitly API key (required if using 'bitly').
 * @param {string} params.bitlyDomain - Bitly domain (required if using 'bitly').
 * @param {string} [params.customShortenerPath] - Path to custom JavaScript shortener file (required if using 'custom').
 * @returns {Promise<{gooseDeepLink: string, shortUrl?: string}>}
 */
async function runGooseRecipeShortener({
  recipePath,
  shortener,
  shortUrlPath,
  shortioApiKey,
  shortioDomain,
  bitlyApiKey,
  bitlyDomain,
  customShortenerPath,
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
      case 'bitly': {
        if (!bitlyApiKey) throw new Error('bitlyApiKey is required for bitly');
        if (!bitlyDomain) throw new Error('bitlyDomain is required for bitly');
        shortenerInstance = new BitlyShortener(bitlyApiKey, bitlyDomain);
        break;
      }
      case 'custom': {
        if (!customShortenerPath) throw new Error('customShortenerPath is required for custom shortener');
        shortenerInstance = new CustomShortener(customShortenerPath);
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