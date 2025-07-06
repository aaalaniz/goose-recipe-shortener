const { HttpClient } = require('../http');
const { GooseDeepLinkShortener } = require('./base');

class BitlyShortener extends GooseDeepLinkShortener {
  constructor(apiKey, domain) {
    super();
    this.apiKey = apiKey;
    this.domain = domain;
    this.httpClient = new HttpClient();
  }

  async shorten(url, path) {
    const customBitlinkId = `${this.domain.replace(/^https?:\/\//, '')}/${path.replace(/^\//, '')}`;
    const bitlinkUrl = `https://api-ssl.bitly.com/v4/bitlinks/${encodeURIComponent(customBitlinkId)}`;
    const customBitlinkUrl = `https://api-ssl.bitly.com/v4/custom_bitlinks/${encodeURIComponent(customBitlinkId)}`;
    const createUrl = 'https://api-ssl.bitly.com/v4/bitlinks';
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
    let exists = false;
    try {
      const getResp = await this.httpClient.get(bitlinkUrl, { headers });
      if (getResp.status === 200 && getResp.data && getResp.data.id) {
        exists = true;
      }
    } catch (err) {
      if (err.message && !/404/.test(err.message)) {
        throw new Error(`Bitly API error: ${err.message}`);
      }
    }
    // 2. If exists, update it
    if (exists) {
      const patchBody = { long_url: url };
      const patchResp = await this.httpClient.patch(customBitlinkUrl, patchBody, { headers });
      if (patchResp.data && patchResp.data.link) {
        return patchResp.data.link;
      }
      throw new Error('Failed to update existing Bitlink');
    }
    // 3. If not, create it
    const postBody = {
      long_url: url,
      domain: this.domain.replace(/^https?:\/\//, ''),
      custom_bitlink: customBitlinkId,
    };
    const postResp = await this.httpClient.post(createUrl, postBody, { headers });
    if (postResp.data && postResp.data.link) {
      return postResp.data.link;
    }
    throw new Error('Failed to create Bitlink');
  }
}

module.exports = { BitlyShortener }; 