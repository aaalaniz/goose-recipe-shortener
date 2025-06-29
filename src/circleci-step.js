const { runGooseRecipeShortener } = require('./index');

async function main() {
  try {
    const recipePath = process.env.RECIPE_PATH;
    const shortener = process.env.SHORTENER;
    const shortUrlPath = process.env.SHORT_URL_PATH;
    const shortioApiKey = process.env.SHORTIO_API_KEY;
    const shortioDomain = process.env.SHORTIO_DOMAIN;

    const result = await runGooseRecipeShortener({
      recipePath,
      shortener,
      shortUrlPath,
      shortioApiKey,
      shortioDomain,
    });

    console.log(`goose_deep_link=${result.gooseDeepLink}`);
    if (result.shortUrl) {
      console.log(`short_url=${result.shortUrl}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main(); 