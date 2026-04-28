export function getOptimizedImageUrl(url: string): string {
  if (!url) return url;
  
  // Replace GitHub blob web page URLs with raw URLs
  if (url.includes('github.com/') && url.includes('/blob/')) {
    url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }

  // Rewrite raw.githubusercontent.com to proxy because GFW blocks it in Mainland China
  // We use ghproxy.net proxy here
  if (url.includes('raw.githubusercontent.com')) {
    // Alternatively if it's the user's specific repo, we could map it to a root path `/images/...`
    // but the most robust general method is using a working CDN proxy.
    return 'https://ghproxy.net/' + url;
  }
  
  return url;
}
