import React from "react";

interface SkeletonProps {
  type: "blog-list" | "photo-theme" | "video-theater";
}

export default function Skeleton({ type }: SkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {type === "blog-list" && <BlogListSkeleton />}
      {type === "photo-theme" && <PhotoThemeSkeleton />}
      {type === "video-theater" && <VideoTheaterSkeleton />}
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-8 md:p-10 bg-slate-200/50 dark:bg-zinc-900/40 rounded-3xl border border-slate-200/40 dark:border-zinc-800/60"
        >
          {/* Header row */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-16 bg-slate-300 dark:bg-zinc-800 rounded-full" />
            <div className="h-4 w-24 bg-slate-300 dark:bg-zinc-800 rounded" />
          </div>
          {/* Title */}
          <div className="h-8 w-2/3 bg-slate-300 dark:bg-zinc-800 rounded-lg mb-4" />
          {/* Description Paragraph */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-slate-300 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-11/12 bg-slate-300 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-4/5 bg-slate-300 dark:bg-zinc-800 rounded" />
          </div>
          {/* Footer link */}
          <div className="h-5 w-20 bg-slate-300 dark:bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  );
}

function PhotoThemeSkeleton() {
  return (
    <div className="space-y-20 max-w-7xl mx-auto">
      {[1, 2].map((i) => (
        <div key={i} className="relative">
          {/* Title area */}
          <div className="pl-6 md:pl-12 lg:pl-24 pr-6 mb-12 max-w-2xl">
            <div className="h-4 w-28 bg-slate-300 dark:bg-zinc-800 rounded mb-4" />
            <div className="h-10 w-1/2 bg-slate-300 dark:bg-zinc-800 rounded-lg mb-4" />
            <div className="h-4 w-4/5 bg-slate-300 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-2/3 bg-slate-300 dark:bg-zinc-800 rounded" />
          </div>

          {/* Horizontal list preview cards */}
          <div className="flex gap-6 md:gap-12 pl-6 md:pl-12 lg:pl-24 overflow-hidden pr-6">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="shrink-0 flex flex-col w-[85vw] md:w-[60vw] lg:w-[45vw]"
              >
                {/* Responsive rect outline */}
                <div className="aspect-[4/3] md:aspect-[3/2] rounded-2xl bg-slate-300 dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60" />
                {/* Meta outlines */}
                <div className="mt-5 flex items-start justify-between">
                  <div className="space-y-2 w-1/2">
                    <div className="h-5 w-full bg-slate-300 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-2/3 bg-slate-300 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="h-4 w-6 bg-slate-300 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoTheaterSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* Theater panel left */}
      <div className="lg:col-span-8 space-y-6">
        {/* Aspect Player */}
        <div className="aspect-video rounded-[24px] bg-slate-300 dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60" />
        {/* Info panel below */}
        <div className="p-6 bg-slate-100 dark:bg-zinc-900/20 border border-slate-200/40 dark:border-zinc-800/60 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 w-1/2">
              <div className="h-4 w-20 bg-slate-300 dark:bg-zinc-800 rounded-full" />
              <div className="h-8 w-full bg-slate-300 dark:bg-zinc-800 rounded-lg" />
            </div>
            <div className="h-6 w-24 bg-slate-300 dark:bg-zinc-800 rounded-full" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-300 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-5/6 bg-slate-300 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>

      {/* Interactions list right */}
      <div className="lg:col-span-4 space-y-6">
        {/* Custom links widget */}
        <div className="p-6 bg-slate-200/60 dark:bg-zinc-900/30 rounded-3xl border border-slate-200/40 dark:border-zinc-800/60 space-y-4">
          <div className="h-3 w-16 bg-slate-300 dark:bg-zinc-800 rounded" />
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-zinc-800" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 bg-slate-300 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-1/2 bg-slate-300 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
        {/* Empty comments loader */}
        <div className="p-6 bg-slate-200/50 dark:bg-zinc-900/40 rounded-3xl border border-slate-200/40 dark:border-zinc-800/60 h-[320px] flex flex-col justify-between">
          <div className="h-5 w-24 bg-slate-300 dark:bg-zinc-800 rounded" />
          <div className="space-y-3 flex-1 py-10">
            <div className="h-10 w-full bg-slate-300 dark:bg-zinc-800 rounded-xl" />
            <div className="h-12 w-full bg-slate-300 dark:bg-zinc-800 rounded-xl" />
          </div>
          <div className="h-12 w-full bg-slate-300 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
