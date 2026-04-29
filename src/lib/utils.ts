export function getOptimizedImageUrl(url: string): string {
  if (!url) return url;
  
  // Convert full GitHub URLs for your own repo into local relative paths.
  // This bypasses the GitHub blocks and fetches directly from your Vercel domain!
  const repoPublicPrefix1 = 'github.com/Yuban18267/-Web/blob/main/public/';
  const repoPublicPrefix2 = 'raw.githubusercontent.com/Yuban18267/-Web/main/public/';
  
  if (url.includes(repoPublicPrefix1)) {
    return '/' + url.split(repoPublicPrefix1)[1];
  }
  if (url.includes(repoPublicPrefix2)) {
    return '/' + url.split(repoPublicPrefix2)[1];
  }

  // Replace GitHub blob web page URLs with raw URLs
  if (url.includes('github.com/') && url.includes('/blob/')) {
    url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }

  // Rewrite raw.githubusercontent.com to proxy because GFW blocks it in Mainland China
  if (url.includes('raw.githubusercontent.com')) {
    return 'https://ghproxy.net/' + url;
  }
  
  return url;
}
