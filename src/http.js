const https = require('https');
const http = require('http');
const { URL } = require('url');

class HttpClient {
  constructor() {
    this.defaultTimeout = 30000; // 30 seconds
  }

  async post(url, data = {}, options = {}) {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data)),
        ...options.headers
      },
      timeout: options.timeout || this.defaultTimeout
    };

    return new Promise((resolve, reject) => {
      const req = client.request(requestOptions, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve({
              data: parsedData,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers
            });
          } catch (error) {
            resolve({
              data: responseData,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      // Send the request body
      req.write(JSON.stringify(data));
      req.end();
    });
  }

  async get(url, options = {}) {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        ...options.headers
      },
      timeout: options.timeout || this.defaultTimeout
    };

    return new Promise((resolve, reject) => {
      const req = client.request(requestOptions, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve({
              data: parsedData,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers
            });
          } catch (error) {
            resolve({
              data: responseData,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }
}

module.exports = { HttpClient }; 