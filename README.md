# Goose Recipe Shortener

A [GitHub Action](https://GitHub.com/features/actions) and [Buildkite plugin](https://buildkite.com/docs/pipelines/integrations/plugins) that enables [Goose recipe](https://block.GitHub.io/goose/docs/guides/recipes/) maintainers to generate Goose deep links and map them to a short URL provided by a URL shortener­­—in effect, mapping a dynamic `goose://recipe?config=1234` to a fixed linked such as `go.yourdomain.com/my-recipe`.

## Use Case

This tool is intended to help recipe authors manage recipes over time across team or organization boundaries. A Goose recipe deep link is a base64 encoded string of the recipe file and as a result, the recipe deep link will change as you iterate. Tracking recipe files in source control is a great way to manage agents over time, but sharing a dynamic Goose deep link may be difficult.

With this tool, recipe authors can set up the following workflow:

1. Check in Goose recipe files to a repository
2. Set up a CI task that validates the recipe for every pull request
3. On either pushes to the default branch or another trigger mechanism, map the Goose deep link to a short url such as go.yourdomain.com/my-recipe

This ensures that maintainers can iterate on recipes without changing a public-facing link.

## Inputs

These inputs are defined the same way across all CI options.

- `recipe_path` (**required**): Path to the Goose recipe file (YAML or JSON).
- `shortener`: Shortener to use. Supported: `shortio`, `custom`. Optional.
- `short_url_path`: The path for the shortened URL (required if using a shortener).
- `shortio_api_key`: Short.io API key (required if using `shortio`).
- `shortio_domain`: Short.io domain (required if using `shortio`).
- `custom_shortener_path`: Path to custom JavaScript shortener file (required if using `custom`).

## Outputs (GitHub Action only)

- `goose_deep_link`: The generated Goose deep link.
- `short_url`: The shortened URL (if a shortener is used).

## Usage

### Verify a Recipe 

Verify that a recipe is valid, perhaps with every pull request.

**GitHub Action**

```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
```

**Buildkite Plugin**

```yaml
steps:
  - label: ":goose: Verify recipe"
    plugins:
      - https://GitHub.com/aaalaniz/goose-recipe-shortener.git#main:
          recipe_path: my-recipe.yaml

```

### Shorten a Recipe with short.io 

Map a recipe's Goose deep link to a short URL using [short.io](https://short.io). This may be useful after pushes to the default branch or after a release.


**GitHub Action**

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
steps:
  - label: ":goose: Publish Recipe"
    plugins:
      - https://GitHub.com/aaalaniz/goose-recipe-shortener.git#main:
          recipe_path: my-recipe.yaml
          shortener: shortio
          short_url_path: my-recipe
          shortio_api_key: ${{ secrets.SHORTIO_API_KEY }}
          shortio_domain: 'go.yourdomain.com'
```

Then your recipe will be available at `go.yourdomain.com/my-recipe`.

### Custom Shortener

You can create your own custom URL shortener by providing a JavaScript file that exports a function. This gives you full control over the shortening logic and allows you to use perhaps an internal URL shortening service.

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

**GitHub Action**

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
  - label: ":goose: Publish Recipe with Custom Shortener"
    plugins:
      - https://GitHub.com/aaalaniz/goose-recipe-shortener.git#main:
          recipe_path: my-recipe.yaml
          shortener: custom
          short_url_path: my-recipe
          custom_shortener_path: ./scripts/my-shortener.js
```

## Demo

This project publishes [goose-session.yaml](./goose-session.yaml) after every push to the default branch. You can open this interactive walkthrough of the project at [go.aalaniz.com/goose-recipe-shortener](https://go.aalaniz.com/goose-recipe-shortener)

## License
MIT 
