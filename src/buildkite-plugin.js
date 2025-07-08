const { runGooseRecipeShortener } = require('./index');

async function main() {
  try {
    // Buildkite plugins pass configuration via environment variables
    // Since this repo doesn't end with -buildkite-plugin, variables include _GIT_
    const recipePath = process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_RECIPE_PATH;
    const shortener = process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTENER;
    const shortUrlPath = process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORT_URL_PATH;
    const shortioApiKey = process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTIO_API_KEY;
    const shortioDomain = process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTIO_DOMAIN;
    const customShortenerPath = process.env.BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_CUSTOM_SHORTENER_PATH;

    if (!recipePath) {
      throw new Error('recipe_path is required');
    }

    const result = await runGooseRecipeShortener({
      recipePath,
      shortener,
      shortUrlPath,
      shortioApiKey,
      shortioDomain,
      customShortenerPath,
    });

    // Output results in Buildkite format
    console.log(`Generated Goose deep link: ${result.gooseDeepLink}`);
    if (result.shortUrl) {
      console.log(`Shortened URL: ${result.shortUrl}`);
    }

    // Set Buildkite metadata for use in other steps
    if (process.env.BUILDKITE) {
      console.log(`--- :link: Goose Deep Link`);
      console.log(`${result.gooseDeepLink}`);
      
      if (result.shortUrl) {
        console.log(`--- :link: Shortened URL`);
        console.log(`${result.shortUrl}`);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main(); 