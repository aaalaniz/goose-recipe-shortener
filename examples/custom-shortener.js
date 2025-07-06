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
  // In a real implementation, you would make API calls to your shortener service
  console.log(`Shortening URL: ${longUrl}`);
  console.log(`Desired path: ${shortPath}`);
  
  const mockShortUrl = `https://my-domain.com/${shortPath}`;
  
  // Return the mock URL for this example
  return mockShortUrl;
}; 