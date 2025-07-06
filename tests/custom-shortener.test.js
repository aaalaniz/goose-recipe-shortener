const test = require('node:test');
const describe = test.describe;
const before = test.describe;
const assert = require('node:assert');
const path = require('path');
const { CustomShortener } = require('../src/shorteners/custom');

describe('CustomShortener', async () => {
  let customShortener;
  const testCustomShortenerPath = path.join(__dirname, '../examples/custom-shortener.js');

  before(() => {
    customShortener = new CustomShortener(testCustomShortenerPath);
  });

  test('should shorten URL using custom shortener', async () => {
    const longUrl = 'goose://recipe?url=https://example.com/recipe';
    const shortPath = 'test-recipe';
    
    const result = await customShortener.shorten(longUrl, shortPath);
    
    assert.strictEqual(result, 'https://my-domain.com/test-recipe');
  });

  test('should throw error for non-existent custom shortener file', async () => {
    const nonExistentPath = '/path/to/non/existent/file.js';
    const shortener = new CustomShortener(nonExistentPath);
    
    await assert.rejects(
      () => shortener.shorten('test-url', 'test-path'),
      /Custom shortener file not found/
    );
  });

  test('should throw error for invalid return type', async () => {
    // Create a temporary custom shortener that returns invalid data
    const tempShortenerPath = path.join(__dirname, 'fixtures/invalid-custom-shortener.js');
    
    // Create the invalid shortener file
    const fs = require('fs');
    fs.writeFileSync(tempShortenerPath, `
      module.exports = async function(longUrl, shortPath, httpClient) {
        return null; // Invalid return type
      };
    `);
    
    const shortener = new CustomShortener(tempShortenerPath);
    
    await assert.rejects(
      () => shortener.shorten('test-url', 'test-path'),
      /Custom shortener must return a valid URL string/
    );
    
    // Clean up
    fs.unlinkSync(tempShortenerPath);
  });

  test('should handle custom shortener errors gracefully', async () => {
    // Create a temporary custom shortener that throws an error
    const tempShortenerPath = path.join(__dirname, 'fixtures/error-custom-shortener.js');
    
    // Create the error shortener file
    const fs = require('fs');
    fs.writeFileSync(tempShortenerPath, `
      module.exports = async function(longUrl, shortPath, httpClient) {
        throw new Error('Custom shortener error');
      };
    `);
    
    const shortener = new CustomShortener(tempShortenerPath);
    
    await assert.rejects(
      () => shortener.shorten('test-url', 'test-path'),
      /Custom shortener error: Custom shortener error/
    );
    
    // Clean up
    fs.unlinkSync(tempShortenerPath);
  });
}); 