const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const testRecipePath = path.join(__dirname, 'fixtures', 'example-recipe.yaml');

function clearEnvironmentVariables() {
  // Clear any existing environment variables
  // Since this repo doesn't end with -buildkite-plugin, variables include _GIT_
  delete process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_RECIPE_PATH;
  delete process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTENER;
  delete process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORT_URL_PATH;
  delete process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTIO_API_KEY;
  delete process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTIO_DOMAIN;
  delete process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_CUSTOM_SHORTENER_PATH;
}

test('should generate deep link without shortener', async () => {
  clearEnvironmentVariables();
  
  // Set required environment variable
  process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_RECIPE_PATH = testRecipePath;
  
  // Mock BUILDKITE environment
  process.env.BUILDKITE = 'true';
  
  // Import the main function directly instead of the full module
  const { runGooseRecipeShortener } = require('../src/index');
  
  // Call the function directly
  const result = await runGooseRecipeShortener({
    recipePath: testRecipePath,
  });
  
  // Verify the result
  assert(result.gooseDeepLink, 'Should return a deep link');
  assert(result.gooseDeepLink.startsWith('goose://'), 'Should start with goose:// protocol');
  assert(!result.shortUrl, 'Should not have a short URL when no shortener is specified');
});

test('should fail when recipe_path is not provided', async () => {
  clearEnvironmentVariables();
  
  // Mock BUILDKITE environment
  process.env.BUILDKITE = 'true';
  
  // Import the main function directly
  const { runGooseRecipeShortener } = require('../src/index');
  
  // Test that it throws an error when recipePath is not provided
  try {
    await runGooseRecipeShortener({});
    assert.fail('Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('recipePath is required'), 'Should contain correct error message');
  }
});

test('should handle shortio shortener configuration', async () => {
  clearEnvironmentVariables();
  
  // Mock BUILDKITE environment
  process.env.BUILDKITE = 'true';
  
  // Import the main function directly
  const { runGooseRecipeShortener } = require('../src/index');
  
  // Test that it throws an error when shortio is specified but required params are missing
  try {
    await runGooseRecipeShortener({
      recipePath: testRecipePath,
      shortener: 'shortio',
      shortUrlPath: 'test-recipe',
      // Missing shortioApiKey and shortioDomain
    });
    assert.fail('Should have thrown an error for missing shortio parameters');
  } catch (error) {
    assert(error.message.includes('shortioApiKey is required'), 'Should contain correct error message');
  }
  
  // Test that it throws an error when shortio is specified but domain is missing
  try {
    await runGooseRecipeShortener({
      recipePath: testRecipePath,
      shortener: 'shortio',
      shortUrlPath: 'test-recipe',
      shortioApiKey: 'test-key',
      // Missing shortioDomain
    });
    assert.fail('Should have thrown an error for missing shortio domain');
  } catch (error) {
    assert(error.message.includes('shortioDomain is required'), 'Should contain correct error message');
  }
}); 