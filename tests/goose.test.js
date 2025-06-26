const test = require('node:test');
const describe = test.describe;
const before = test.describe;
const assert = require('node:assert');
const path = require('path');
const { generateGooseDeepLink } = require('../src/goose');
const { checkGooseCli } = require('./check-goose-cli');

describe('generateGooseDeepLink', async () => {
  before(() => checkGooseCli())

  test('should generate deep link from example-recipe.yaml', async () => {
    const filePath = fixturePath('example-recipe.yaml');
    const result = await generateGooseDeepLink(filePath);

    assert.match(result, /^goose:\/\/recipe\?config=/);
  });
  
  test('should fail for invalid YAML', async () => {
    const filePath = fixturePath('invalid-recipe.yaml');

    await assert.rejects(() => generateGooseDeepLink(filePath), /Goose recipe validation failed/);
  });
  
  test('should fail for invalid JSON', async () => {
    const filePath = fixturePath('invalid-recipe.json');

    await assert.rejects(() => generateGooseDeepLink(filePath), /Goose recipe validation failed/);
  });
  
  test('should fail for completely invalid content', async () => {
    const filePath = fixturePath('invalid-content.yaml');

    await assert.rejects(() => generateGooseDeepLink(filePath), /Goose recipe validation failed/);
  });
});

function fixturePath(filename) {
  return path.join(__dirname, 'fixtures', filename);
}
