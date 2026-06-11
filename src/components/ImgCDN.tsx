import React, { useState, useEffect } from "react";
import { CDN_LINES, getOptimizedImageUrl } from "../lib/utils";

interface ImgCDNProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  key?: React.Key;
}

export default function ImgCDN({ src, alt, className, ...props }: ImgCDNProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [resolvedSrc, setResolvedSrc] = useState("");
  const [hasFailedAll, setHasFailedAll] = useState(false);

  // Read current active line index
  const getActiveLineIndex = () => {
    try {
      const activeId =
        localStorage.getItem("selected_cdn_line_key") || "gitmirror";
      const idx = CDN_LINES.findIndex((l) => l.id === activeId);
      return idx >= 0 ? idx : 0;
    } catch {
      return 0;
    }
  };

  const recomputeSrc = () => {
    if (!src) return;

    // Only apply CDN proxy logic if it's a raw github image
    const isGithub =
      src.includes("raw.githubusercontent.com") || src.includes("github.com");
    if (!isGithub) {
      setResolvedSrc(src);
      return;
    }

    const activeIdx = getActiveLineIndex();
    setCurrentLineIndex(activeIdx);
    setHasFailedAll(false);

    const line = CDN_LINES[activeIdx] || CDN_LINES[0];
    setResolvedSrc(getOptimizedImageUrl(src, line.id));
  };

  useEffect(() => {
    recomputeSrc();

    // Listen for custom CDN routing changes dispatched by the Speed switcher widget
    const handleCdnChange = () => {
      recomputeSrc();
    };

    window.addEventListener("cdn-changed", handleCdnChange);
    return () => {
      window.removeEventListener("cdn-changed", handleCdnChange);
    };
  }, [src]);

  // Handle source re-evaluation whenever currentLineIndex shifts
  useEffect(() => {
    if (!src) return;
    const isGithub =
      src.includes("raw.githubusercontent.com") || src.includes("github.com");
    if (!isGithub) return;

    const line = CDN_LINES[currentLineIndex] || CDN_LINES[0];
    setResolvedSrc(getOptimizedImageUrl(src, line.id));
  }, [currentLineIndex]);

  const handleError = () => {
    // Attempt the next available cdn line in our pool of lines
    const nextIndex = currentLineIndex + 1;
    if (nextIndex < CDN_LINES.length) {
      console.warn(
        `[CDN Fallback Alert] Image load failed using line "${CDN_LINES[currentLineIndex].name}". Escalating automatically to "${CDN_LINES[nextIndex].name}"...`,
      );
      setCurrentLineIndex(nextIndex);
    } else {
      console.error(
        `[CDN Fallback Failure] All available proxy lines failed to load raw content: ${src}`,
      );
      setHasFailedAll(true);
      // Fallback to high compatibility placeholder to avoid broken image icon
      setResolvedSrc(
        "https://raw.gitmirror.com/Yuban18267/-Web/main/public/placeholder-photo.jpg",
      );
    }
  };

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        hasFailedAll ? "opacity-40 grayscale" : ""
      }`}
      onError={handleError}
      {...props}
    />
  );
}
