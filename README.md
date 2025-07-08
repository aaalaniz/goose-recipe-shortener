# Goose Recipe Shortener

Generate a Goose deep link from a recipe file and optionally shorten it using [short.io](https://short.io) or a custom shortener. Supported environments include: a [Github Action](https://github.com/features/actions) and a [Buildkite plugin](https://buildkite.com/docs/pipelines/integrations/plugins).

## Inputs
- `recipe_path` (**required**): Path to the Goose recipe file (YAML or JSON).
- `shortener`: Shortener to use. Supported: `shortio`, `custom`. Optional.
- `short_url_path`: The path for the shortened URL (required if using a shortener).
- `shortio_api_key`: Short.io API key (required if using `shortio`).
- `shortio_domain`: Short.io domain (required if using `shortio`).
- `custom_shortener_path`: Path to custom JavaScript shortener file (required if using `custom`).

## Outputs
- `goose_deep_link`: The generated Goose deep link.
- `short_url`: The shortened URL (if a shortener is used).

## GitHub Action Usage

### Example Usage

### short.io
```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
    shortener: shortio
    short_url_path: my-recipe
    shortio_api_key: ${{ secrets.SHORTIO_API_KEY }}
    shortio_domain: 'go.yourdomain.com'
```

Then your recipe will be available at `go.yourdomain.com/my-recipe`.

### Custom Shortener

You can create your own custom URL shortener by providing a JavaScript file that exports a function. This gives you full control over the shortening logic and allows you to use any URL shortening service.

#### Creating a Custom Shortener

Create a JavaScript file in your repository (e.g., `scripts/my-shortener.js`):

```javascript
module.exports = async function(longUrl, shortPath, httpClient) {
  // Your custom shortening logic here
  // Use httpClient.get(), httpClient.post(), or httpClient.patch() for API calls
  
  // Example: Call your custom API
  const response = await httpClient.post('https://my-api.com/shorten', {
    url: longUrl,
    path: shortPath,
    apiKey: process.env.MY_API_KEY
  });
  
  return response.data.shortUrl;
};
```

#### Using the Custom Shortener

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
    shortener: custom
    short_url_path: my-recipe
    custom_shortener_path: ./scripts/my-shortener.js
```

#### Custom Shortener Function Signature

Your custom shortener function should have this signature:

```javascript
async function(longUrl, shortPath, httpClient) {
  // longUrl: The Goose deep link URL to shorten
  // shortPath: The desired path for the shortened URL
  // httpClient: An HTTP client instance with get(), post(), and patch() methods
  
  // Return the shortened URL as a string
  return 'https://your-domain.com/shortened-url';
}
```

#### Example Custom Shortener

See [`examples/custom-shortener.js`](./examples/custom-shortener.js) for a complete example with multiple implementation patterns.

## How it works
- Validates the provided Goose recipe file using the `goose` CLI.
- Generates a Goose deep link from the recipe.
- Optionally shortens the deep link using [short.io](https://short.io/), or a custom shortener.

## Buildkite Plugin Usage

The same functionality is available as a Buildkite plugin. The plugin accepts the same parameters as the GitHub Action.

### Example Usage

#### short.io
```yaml
steps:
  - label: "Generate Goose deep link"
    plugins:
      - aaalaniz/goose-recipe-shortener#main:
          recipe_path: my-recipe.yaml
          shortener: shortio
          short_url_path: my-recipe
          shortio_api_key: $SHORTIO_API_KEY
          shortio_domain: go.yourdomain.com
```

#### Custom Shortener
```yaml
steps:
  - label: "Generate Goose deep link"
    plugins:
      - aaalaniz/goose-recipe-shortener#main:
          recipe_path: my-recipe.yaml
          shortener: custom
          short_url_path: my-recipe
          custom_shortener_path: ./scripts/my-shortener.js
```

### Plugin Parameters

The Buildkite plugin accepts the same parameters as the GitHub Action:

- `recipe_path` (**required**): Path to the Goose recipe file (YAML or JSON).
- `shortener`: Shortener to use. Supported: `shortio`, `custom`. Optional.
- `short_url_path`: The path for the shortened URL (required if using a shortener).
- `shortio_api_key`: Short.io API key (required if using `shortio`).
- `shortio_domain`: Short.io domain (required if using `shortio`).
- `custom_shortener_path`: Path to custom JavaScript shortener file (required if using `custom`).

### Output

The plugin will output the generated URLs in the Buildkite logs and can be used in subsequent pipeline steps.

### Important Note: Environment Variable Naming

Since this repository does not end with `-buildkite-plugin`, Buildkite will prefix all configuration environment variables with `_GIT_`. This means the plugin reads from:

- `BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_RECIPE_PATH`
- `BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTENER`
- `BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORT_URL_PATH`
- `BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTIO_API_KEY`
- `BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_SHORTIO_DOMAIN`
- `BUILDKITE_PLUGIN_GOOSE_RECIPE_SHORTENER_GIT_CUSTOM_SHORTENER_PATH`

This is the standard Buildkite behavior for plugins that don't follow the `-buildkite-plugin` naming convention.

## Requirements
- The `goose` CLI must be available in the Docker image or runner environment.

## License
MIT 
