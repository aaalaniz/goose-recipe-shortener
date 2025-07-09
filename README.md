# Goose Recipe Shortener

A [Github Action](https://github.com/features/actions) and [Buildkite plugin](https://buildkite.com/docs/pipelines/integrations/plugins) that enables [Goose recipe](https://block.github.io/goose/docs/guides/recipes/) maintainers to generate Goose deep links and map them to a short URL provided by a URL shortener­­—in effect, mapping a dynamic `goose://recipe?config=1234` to a fixed linked such as `go.yourdomain/my-recipe`.

## Use Case

This tool is intended to help recipe authors manage recipes over time across team or organization boundaries. A Goose recipe deep link is a base64 encoded string of the recipe file and as a result, the recipe deep link will change as you iterate on agents. Tracking recipe files in source control is great way to manage agents over time, but sharing a dynamic Goose deep link may be difficult to manage over time.

TKTK

## Inputs

These are the inputs defined the same across all CI options.

- `recipe_path` (**required**): Path to the Goose recipe file (YAML or JSON).
- `shortener`: Shortener to use. Supported: `shortio`, `custom`. Optional.
- `short_url_path`: The path for the shortened URL (required if using a shortener).
- `shortio_api_key`: Short.io API key (required if using `shortio`).
- `shortio_domain`: Short.io domain (required if using `shortio`).
- `custom_shortener_path`: Path to custom JavaScript shortener file (required if using `custom`).

## Outputs (Github Action only)

- `goose_deep_link`: The generated Goose deep link.
- `short_url`: The shortened URL (if a shortener is used).

## Usage

TKTK

### Verify a Recipe 

TKTK

**Github Action**

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
```

**Buildkite Plugin**

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
```

Then your recipe will be available at `go.yourdomain.com/my-recipe`.

### Shorten a Recipe with short.io 

**Github Action**

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
    shortener: shortio
    short_url_path: my-recipe
    shortio_api_key: ${{ secrets.SHORTIO_API_KEY }}
    shortio_domain: 'go.yourdomain.com'
```

**Buildkite Plugin**

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
    shortener: shortio
    short_url_path: my-recipe
    shortio_api_key: ${{ secrets.SHORTIO_API_KEY }}
    shortio_domain: 'go.yourdomain.com'
```


### Custom Shortener

You can create your own custom URL shortener by providing a JavaScript file that exports a function. This gives you full control over the shortening logic and allows you to use any URL shortening service.

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

**Github Action**

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
    shortener: custom
    short_url_path: my-recipe
    custom_shortener_path: ./scripts/my-shortener.js
```

**Buildkite Plugin**

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
    shortener: custom
    short_url_path: my-recipe
    custom_shortener_path: ./scripts/my-shortener.js
```

## Requirements
- The `goose` CLI must be available in the Docker image or runner environment.

## License
MIT 
