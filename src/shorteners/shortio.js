const { HttpClient } = require('../http');
const { GooseDeepLinkShortener } = require('./base');

class ShortioShortener extends GooseDeepLinkShortener {
  constructor(apiKey, domain) {
    super();
    this.apiKey = apiKey;
    this.domain = domain;
    this.httpClient = new HttpClient();
  }

  async shorten(url, path) {
    try {
      const requestBody = {
        domain: this.domain,
        originalURL: url,
        path: path
      };

      const response = await this.httpClient.post('https://api.short.io/links', requestBody, {
        headers: { 'authorization': this.apiKey }
      });
      return response.data.shortURL;
    } catch (error) {
      throw new Error(`Short.io API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = { ShortioShortener }; 