/**
 * Example Custom Shortener for Goose Recipe Shortener
 * 
 * This file demonstrates how to create a custom URL shortener that can be used
 * with the Goose Recipe Shortener GitHub Action.
 * 
 * The function receives:
 * - longUrl: The Goose deep link URL to shorten
 * - shortPath: The desired path for the shortened URL
 * - httpClient: An HTTP client instance with get(), post(), and patch() methods
 * 
 * The function should return a Promise that resolves to the shortened URL string.
 */

module.exports = async function(longUrl, shortPath, httpClient) {
  // Example 1: Mock shortener (for testing/demo purposes)
  // In a real implementation, you would make API calls to your shortener service
  
  console.log(`Shortening URL: ${longUrl}`);
  console.log(`Desired path: ${shortPath}`);
  
  // Mock response - replace this with actual API call
  const mockShortUrl = `https://my-domain.com/${shortPath}`;
  
  // Example 2: Real implementation with API call (commented out)
  /*
  try {
    // Example: Using a custom API service
    const response = await httpClient.post('https://my-shortener-api.com/shorten', {
      longUrl: longUrl,
      customPath: shortPath,
      apiKey: process.env.MY_SHORTENER_API_KEY
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MY_SHORTENER_API_KEY}`
      }
    });
    
    return response.data.shortUrl;
  } catch (error) {
    throw new Error(`Failed to shorten URL: ${error.message}`);
  }
  */
  
  // Example 3: Using a self-hosted shortener (commented out)
  /*
  try {
    // Example: Using YOURLS or similar self-hosted shortener
    const response = await httpClient.post('https://my-shortener.com/yourls-api.php', {
      format: 'json',
      action: 'shorturl',
      url: longUrl,
      keyword: shortPath,
      signature: process.env.YOURLS_SIGNATURE
    });
    
    return response.data.shorturl;
  } catch (error) {
    throw new Error(`Failed to shorten URL: ${error.message}`);
  }
  */
  
  // Example 4: Using environment variables for configuration (commented out)
  /*
  const apiEndpoint = process.env.CUSTOM_SHORTENER_API_ENDPOINT;
  const apiKey = process.env.CUSTOM_SHORTENER_API_KEY;
  
  if (!apiEndpoint || !apiKey) {
    throw new Error('Missing required environment variables for custom shortener');
  }
  
  const response = await httpClient.post(apiEndpoint, {
    url: longUrl,
    path: shortPath
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data.shortUrl;
  */
  
  // Return the mock URL for this example
  return mockShortUrl;
}; 