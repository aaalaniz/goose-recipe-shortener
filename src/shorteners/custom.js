const path = require('path');
const { HttpClient } = require('../http');
const { GooseDeepLinkShortener } = require('./base');

class CustomShortener extends GooseDeepLinkShortener {
  constructor(customShortenerPath) {
    super();
    this.customShortenerPath = path.resolve(customShortenerPath);
  }

  async shorten(longUrl, shortPath) {
    try {
      // Dynamically require the custom shortener file
      const customShortener = require(this.customShortenerPath);
      
      // Create HTTP client instance to pass to the custom function
      const httpClient = new HttpClient();
      
      // Call the custom shortener function
      const shortUrl = await customShortener(longUrl, shortPath, httpClient);
      
      if (!shortUrl || typeof shortUrl !== 'string') {
        throw new Error('Custom shortener must return a valid URL string');
      }
      
      return shortUrl;
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error(`Custom shortener file not found: ${this.customShortenerPath}`);
      }
      throw new Error(`Custom shortener error: ${error.message}`);
    }
  }
}

module.exports = { CustomShortener }; 