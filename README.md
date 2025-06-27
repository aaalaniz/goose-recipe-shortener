# Goose Recipe Shortener GitHub Action

Generate a Goose deep link from a recipe file and optionally shorten it using [short.io](https://short.io).

## Inputs
- `recipe_path` (**required**): Path to the Goose recipe file (YAML or JSON).
- `shortener`: Shortener to use. Supported: `shortio`. Optional.
- `short_url_path`: The path for the shortened URL (required if using a shortener).
- `shortio_api_key`: Short.io API key (required if using `shortio`).
- `shortio_domain`: Short.io domain (required if using `shortio`).

## Outputs
- `goose_deep_link`: The generated Goose deep link.
- `short_url`: The shortened URL (if a shortener is used).

## Example Usage
```yaml
- uses: aaalaniz/goose-recipe-shortener@main
  with:
    recipe_path: my-recipe.yaml
    shortener: shortio
    short_url_path: my-recipe
    shortio_api_key: ${{ secrets.SHORTIO_API_KEY }}
    shortio_domain: 'go.yourdomain.com'
```

Then your recipe will be available at `go.yourdomain.com/my-recipe`

## How it works
- Validates the provided Goose recipe file using the `goose` CLI.
- Generates a Goose deep link from the recipe.
- Optionally shortens the deep link using [short.io](https://short.io/) if the relevant inputs are provided.

## Requirements
- The `goose` CLI must be available in the Docker image or runner environment.

## License
MIT 
