import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LyricMilestone, resolveLyricLayout } from "../data/worldExecuteMeData";
import { Sparkles, Terminal, Activity } from "lucide-react";

interface KineticSceneLyricsProps {
  currentLyric: LyricMilestone | null;
  currentTime: number;
  lyricIndex: number;
  isCrtMode?: boolean;
}

export default function KineticSceneLyrics({
  currentLyric,
  currentTime,
  lyricIndex,
}: KineticSceneLyricsProps) {
  if (!currentLyric) return null;

  const layout = resolveLyricLayout(currentLyric, lyricIndex);
  const isEmphasis = Boolean(currentLyric.emphasis);
  const themeColor = layout.themeColor || (isEmphasis ? "#ef4444" : "#38bdf8");

  return (
    <div className="absolute inset-x-0 bottom-7 sm:bottom-9 z-30 pointer-events-none flex flex-col items-center justify-end px-4 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentLyric.time}-${currentLyric.en}`}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-4xl pointer-events-auto"
        >
          {/* 顶部微型全息状态标（无底框、纯文字光标） */}
          <div className="flex items-center gap-2 mb-1.5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <span
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: themeColor }}
            />
            {/* 左右灵动音频跳动声波线 */}
            <span className="flex items-center gap-0.5 opacity-80" style={{ color: themeColor }}>
              <span className="w-0.5 h-2 bg-current animate-pulse inline-block" />
              <span className="w-0.5 h-3.5 bg-current animate-pulse inline-block" style={{ animationDelay: "100ms" }} />
              <span className="w-0.5 h-1.5 bg-current animate-pulse inline-block" style={{ animationDelay: "200ms" }} />
            </span>

            <span
              className="px-2 py-0.5 rounded-md font-mono"
              style={{
                color: themeColor,
                textShadow: `0 0 10px ${themeColor}66`,
              }}
            >
              {layout.badge || "GEMINI 3.8 FLASH // VOX_STREAM"}
            </span>

            <span className="text-zinc-500 font-normal">•</span>
            <span className="text-zinc-400 font-mono">
              {currentTime.toFixed(2)}s
            </span>

            <span className="flex items-center gap-0.5 opacity-80" style={{ color: themeColor }}>
              <span className="w-0.5 h-1.5 bg-current animate-pulse inline-block" style={{ animationDelay: "200ms" }} />
              <span className="w-0.5 h-3.5 bg-current animate-pulse inline-block" style={{ animationDelay: "100ms" }} />
              <span className="w-0.5 h-2 bg-current animate-pulse inline-block" />
            </span>
          </div>

          {/* 英文主歌词（无任何遮挡底框，采用高对比全息霓虹字体发光阴影） */}
          <div
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight flex items-center justify-center gap-2 flex-wrap transition-colors duration-200 ${
              isEmphasis ? "scale-105" : ""
            }`}
            style={{
              color: isEmphasis ? "#ffffff" : "#f8fafc",
              textShadow: isEmphasis
                ? `0 0 20px ${themeColor}, 0 0 40px ${themeColor}aa, 0 2px 10px rgba(0,0,0,0.95)`
                : `0 0 16px ${themeColor}88, 0 2px 8px rgba(0,0,0,0.9)`,
            }}
          >
            {isEmphasis && (
              <span
                className="text-xs sm:text-sm font-mono px-2 py-0.5 rounded uppercase font-bold tracking-widest animate-pulse inline-flex items-center gap-1 mr-1"
                style={{
                  color: themeColor,
                  border: `1px solid ${themeColor}66`,
                }}
              >
                <Activity size={12} />
                COMMAND
              </span>
            )}

            <span>{currentLyric.en}</span>

            {isEmphasis && (
              <span
                className="text-xs sm:text-sm font-mono px-2 py-0.5 rounded uppercase font-bold tracking-widest animate-pulse inline-flex items-center gap-1 ml-1"
                style={{
                  color: themeColor,
                  border: `1px solid ${themeColor}66`,
                }}
              >
                TRIGGER
              </span>
            )}
          </div>

          {/* 中文翻译字幕（纯净透亮，自然融入，绝不遮挡画布核心内容） */}
          <div
            className="mt-1 text-sm sm:text-base md:text-lg font-semibold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
            style={{
              color: isEmphasis ? themeColor : "#cbd5e1",
              textShadow: isEmphasis
                ? `0 0 12px ${themeColor}99, 0 1px 4px rgba(0,0,0,0.9)`
                : "0 1px 4px rgba(0,0,0,0.9)",
            }}
          >
            {currentLyric.zh}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
