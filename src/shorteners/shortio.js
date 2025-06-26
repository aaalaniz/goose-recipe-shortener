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
      const getLinkUrl = `https://api.short.io/links/expand?domain=${encodeURIComponent(this.domain)}&path=${encodeURIComponent(path)}`;
      let linkId = null;
      let existingShortUrl = null;
      try {
        const getResponse = await this.httpClient.get(getLinkUrl, {
          headers: { 'authorization': this.apiKey }
        });
        if (getResponse.data && getResponse.data.id) {
          linkId = getResponse.data.id;
          existingShortUrl = getResponse.data.shortURL;
        }
      } catch (err) {
        if (err.message && !/404/.test(err.message)) {
          throw err;
        }
      }

      let postUrl;
      let postBody;

      if (linkId) {
        postUrl = `https://api.short.io/links/${linkId}`;
        postBody = { originalURL: url };
      } else {
        postUrl = 'https://api.short.io/links';
        postBody = {
          domain: this.domain,
          originalURL: url,
          path: path
        };
      }

      const postResponse = await this.httpClient.post(postUrl, postBody, {
        headers: { 'authorization': this.apiKey }
      });

      return postResponse.data.shortURL;
    } catch (error) {
      throw new Error(`Short.io API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = { ShortioShortener }; 