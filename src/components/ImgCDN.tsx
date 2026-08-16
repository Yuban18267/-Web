import React, { useState, useEffect, useCallback } from "react";
import { CDN_LINES, getOptimizedImageUrl } from "../lib/utils";

interface ImgCDNProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  key?: React.Key;
}

const getActiveLineIndex = () => {
  try {
    const activeId = localStorage.getItem("selected_cdn_line_key") || "gitmirror";
    const idx = CDN_LINES.findIndex((l) => l.id === activeId);
    return idx >= 0 ? idx : 0;
  } catch {
    return 0;
  }
};

export default function ImgCDN({ src, alt, className, ...props }: ImgCDNProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(getActiveLineIndex);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const computeSrc = useCallback((idx: number) => {
    if (!src) return "";
    const isGithub = src.includes("raw.githubusercontent.com") || src.includes("github.com");
    if (!isGithub) return src;
    const line = CDN_LINES[idx] || CDN_LINES[0];
    return getOptimizedImageUrl(src, line.id);
  }, [src]);

  const [resolvedSrc, setResolvedSrc] = useState(() => computeSrc(currentLineIndex));

  // Sync when src or custom cdn line event triggers
  useEffect(() => {
    const activeIdx = getActiveLineIndex();
    setCurrentLineIndex(activeIdx);
    setHasFailedAll(false);
    setResolvedSrc(computeSrc(activeIdx));

    const handleCdnChange = () => {
      const newIdx = getActiveLineIndex();
      setCurrentLineIndex(newIdx);
      setHasFailedAll(false);
      setResolvedSrc(computeSrc(newIdx));
    };

    window.addEventListener("cdn-changed", handleCdnChange);
    return () => {
      window.removeEventListener("cdn-changed", handleCdnChange);
    };
  }, [src, computeSrc]);

  const handleError = () => {
    const nextIndex = currentLineIndex + 1;
    if (nextIndex < CDN_LINES.length) {
      setCurrentLineIndex(nextIndex);
      setResolvedSrc(computeSrc(nextIndex));
    } else {
      setHasFailedAll(true);
      setResolvedSrc("https://raw.gitmirror.com/Yuban18267/-Web/main/public/placeholder-photo.jpg");
    }
  };

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={`${className || ""} transition-opacity duration-300 ${
        hasFailedAll ? "opacity-40 grayscale" : ""
      }`}
      onError={handleError}
      {...props}
    />
  );
}
