export interface CdnLine {
  id: string;
  name: string;
  region: string;
  transform: (url: string) => string;
}

export const CDN_LINES: CdnLine[] = [
  {
    id: "gitmirror",
    name: "GitMirror 极速源 (境内多线加速)",
    region: "多线 BGP (阿里云/腾讯云优化环路)",
    transform: (url: string) => {
      return url.replace("raw.githubusercontent.com", "raw.gitmirror.com");
    },
  },
  {
    id: "ghp_ci",
    name: "GHP.ci 稳健源 (高通量数据中继)",
    region: "联通/电信中继专线",
    transform: (url: string) => {
      // https://ghp.ci/https://raw.githubusercontent.com/owner/repo/branch/foo
      return "https://ghp.ci/" + url;
    },
  },
  {
    id: "jsdelivr",
    name: "JSDelivr 全球静态加速 (字节跳动/Fastly 承载)",
    region: "全球 Anynet CDN (智能路由)",
    transform: (url: string) => {
      // Match raw.githubusercontent.com/owner/repo/branch/path
      const match = url.match(
        /raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)/,
      );
      if (match) {
        const [, owner, repo, branch, path] = match;
        // Turn into cdn.jsdelivr.net / fastly.jsdelivr.net format
        return `https://fastly.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
      }
      return url;
    },
  },
  {
    id: "ghproxy",
    name: "GHProxy 官方经典源 (备用缓冲)",
    region: "亚洲/北美缓存节点",
    transform: (url: string) => {
      return "https://ghproxy.net/" + url;
    },
  },
  {
    id: "direct",
    name: "GitHub 官方源 (海外直通/科学上网)",
    region: "GitHub 各地公网节点",
    transform: (url: string) => url,
  },
];

export function getOptimizedImageUrl(
  url: string,
  overrideLineId?: string,
): string {
  if (!url) return url;

  // Convert full GitHub URLs for your own repo into local relative paths.
  // This bypasses the GitHub blocks and fetches directly from your Vercel/CloudRun domain!
  const repoPublicPrefix1 = "github.com/Yuban18267/-Web/blob/main/public/";
  const repoPublicPrefix2 =
    "raw.githubusercontent.com/Yuban18267/-Web/main/public/";

  if (url.includes(repoPublicPrefix1)) {
    return "/" + url.split(repoPublicPrefix1)[1];
  }
  if (url.includes(repoPublicPrefix2)) {
    return "/" + url.split(repoPublicPrefix2)[1];
  }

  // Replace GitHub blob web page URLs with raw URLs
  if (url.includes("github.com/") && url.includes("/blob/")) {
    url = url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  }

  // Rewrite raw.githubusercontent.com based on selected or fallback CDN line
  if (url.includes("raw.githubusercontent.com")) {
    try {
      const selectedId =
        overrideLineId ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem("selected_cdn_line_key")
          : null) ||
        "gitmirror";
      const line = CDN_LINES.find((l) => l.id === selectedId) || CDN_LINES[0];
      return line.transform(url);
    } catch {
      return CDN_LINES[0].transform(url);
    }
  }

  return url;
}
