/**
 * Interface for URL shorteners
 */
class GooseDeepLinkShortener {
  /**
   * Shorten a URL
   * @param {string} url - The URL to shorten
   * @param {string} path - The path for the shortened url (eg. /goose-tips)
   * @returns {Promise<string>} - The shortened URL
   */
  async shorten(url, path) {
    throw new Error('shorten method must be implemented by subclass');
  }
}

module.exports = { GooseDeepLinkShortener }; 