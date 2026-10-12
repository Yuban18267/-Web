import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Heart,
  Terminal,
  Tv,
  Columns,
  ExternalLink,
  Info,
  FastForward,
  Rewind,
  Zap,
  ArrowLeft,
  Sliders,
  Monitor,
} from "lucide-react";
import WorldExecuteMeCanvas from "../components/WorldExecuteMeCanvas";
import WorldExecuteMeTerminal from "../components/WorldExecuteMeTerminal";
import KineticSceneLyrics from "../components/KineticSceneLyrics";
import {
  LYRICS_TIMELINE,
  SCENE_PHASES,
  SONG_METADATA,
  LyricMilestone,
} from "../data/worldExecuteMeData";

export default function WorldExecuteMe() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SONG_METADATA.duration);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<"cinematic" | "split" | "terminal">("cinematic");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isCrtMode, setIsCrtMode] = useState(true);

  // 当前歌词及索引
  const [currentLyric, setCurrentLyric] = useState<LyricMilestone | null>(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  // 歌词超前时间校准（默认 +0.35s，解决“唱完了歌词才出来闪一秒就下一句”的滞后问题）
  const [lyricOffset, setLyricOffset] = useState(0.35);

  // 初始化 Web Audio API (在首次用户交互后触发)
  const initAudioContext = () => {
    if (audioContextRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      if (audioRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceNodeRef.current = source;
      }

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch (err) {
      console.warn("Web Audio API could not be initialized:", err);
    }
  };

  // 统一的高精度同步匹配计算逻辑
  const updateCurrentPlayback = (cur: number) => {
    setCurrentTime(cur);

    // 带超前时间补偿的歌词查找，使歌词在歌手发音首字瞬间立即呈现
    const lookupTime = cur + lyricOffset;
    let active: LyricMilestone | null = null;
    let activeIdx = 0;
    for (let i = LYRICS_TIMELINE.length - 1; i >= 0; i--) {
      if (lookupTime >= LYRICS_TIMELINE[i].time) {
        active = LYRICS_TIMELINE[i];
        activeIdx = i;
        break;
      }
    }
    setCurrentLyric(active);
    setCurrentLyricIndex(activeIdx);
  };

  // 高频 60FPS 逐帧同步循环：彻底消除浏览器 HTML5 audio 原生 250ms 粗粒度滞后
  useEffect(() => {
    let animId: number;
    const syncLoop = () => {
      if (audioRef.current && isPlaying) {
        updateCurrentPlayback(audioRef.current.currentTime);
      }
      if (isPlaying) {
        animId = requestAnimationFrame(syncLoop);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(syncLoop);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, lyricOffset]);

  // 播放/暂停控制
  const togglePlay = () => {
    if (!audioRef.current) return;
    initAudioContext();

    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Audio playback error:", e));
    }
  };

  // 时间跳转
  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(time, duration));
    audioRef.current.currentTime = target;
    updateCurrentPlayback(target);
  };

  // 音频进度监听兜底
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    updateCurrentPlayback(audioRef.current.currentTime);
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // 格式化时间
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // 当前场景阶段
  const currentPhase =
    SCENE_PHASES.find(
      (p) => currentTime >= p.timeRange[0] && currentTime < p.timeRange[1]
    ) || SCENE_PHASES[0];

  return (
    <div className="w-screen h-screen fixed inset-0 z-50 bg-black text-zinc-100 flex flex-col overflow-hidden select-none font-sans">
      {/* 隐藏的本地高保真音频元素 */}
      <audio
        ref={audioRef}
        src={SONG_METADATA.audioUrl}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || SONG_METADATA.duration);
          setIsAudioLoaded(true);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* 顶部赛博状态 HUD Header (高度固定 50px，无任何布局挤压) */}
      <header className="relative z-30 h-13 px-3 sm:px-6 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-semibold mr-1 cursor-pointer"
            title="返回网站主页"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">返回主站</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-md shadow-cyan-500/50" />
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              <span className="hidden md:inline">Gemini 3.8 Flash 视界</span>
              <span className="text-cyan-400 font-mono font-normal">world.execute(me);</span>
            </h1>
          </div>

          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-bold">
            <Heart size={11} className="text-pink-400 fill-pink-400" />
            <span>Gemini 3.8 Flash 献身纪念特辑</span>
          </span>
        </div>

        {/* 视界模式切换与 CRT 开关 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode("cinematic")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "cinematic"
                  ? "bg-cyan-500 text-zinc-950 font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tv size={13} />
              <span>全景意识</span>
            </button>

            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "split"
                  ? "bg-cyan-500 text-zinc-950 font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Columns size={13} />
              <span>双重视界</span>
            </button>

            <button
              onClick={() => setViewMode("terminal")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "terminal"
                  ? "bg-cyan-500 text-zinc-950 font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Terminal size={13} />
              <span>数字终端</span>
            </button>
          </div>

          {/* CRT 显像管扫描线切换 */}
          <button
            onClick={() => setIsCrtMode(!isCrtMode)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isCrtMode
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
            }`}
            title="切换 CRT 显像管扫描线与滤镜"
          >
            <Monitor size={13} />
            <span>CRT {isCrtMode ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="p-1.5 sm:p-2 text-zinc-400 hover:text-cyan-400 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer"
            title="查看致敬与背景"
          >
            <Info size={15} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 text-zinc-400 hover:text-cyan-400 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer"
            title="全屏切换"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* 主视口工作区 (flex-1 h-0 彻底解决屏幕只有一半能显示的问题) */}
      <main className="relative flex-1 h-0 w-full overflow-hidden bg-black">
        {/* VIEW 1: 全景意识模式 */}
        {viewMode === "cinematic" && (
          <div className="relative w-full h-full">
            <WorldExecuteMeCanvas
              currentTime={currentTime}
              isPlaying={isPlaying}
              audioAnalyser={analyserRef.current}
              currentLyric={currentLyric}
              currentLyricIndex={currentLyricIndex}
              isCrtMode={isCrtMode}
            />

            {/* 自然融合在画面中的全息灵动歌词 (位置不固定，多维动效流转) */}
            <KineticSceneLyrics
              currentLyric={currentLyric}
              currentTime={currentTime}
              lyricIndex={currentLyricIndex}
              isCrtMode={isCrtMode}
            />

            {/* 模仿视频截图顶部 HUD 布局（左上角歌曲名，右上角时间/总时间 RUNNING 当前phase与深度融入的想法流） */}
            <div className="absolute top-3 left-4 right-4 z-20 flex items-start justify-between pointer-events-none font-mono select-none">
              {/* 左上角：歌曲名与极简状态 */}
              <div className="flex flex-col gap-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
                  <span className="text-sm sm:text-base font-black tracking-wider text-white">
                    world.execute(me);
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900/60 hidden sm:inline-block">
                    Mili / Project
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                  <span>Gemini 3.8 Flash Engine</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-cyan-400/90">{currentLyric?.visualCue || "system_ready"}</span>
                </div>
              </div>

              {/* 右上角：时间 / 总时间 RUNNING 当前 phase 以及极其自然极简融入的 thought 意识流 */}
              <div className="flex flex-col items-end text-right gap-1 max-w-sm sm:max-w-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {/* 顶栏主状态：时间 / 总时间 RUNNING [PHASE: name] */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide">
                  <span className="text-white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black tracking-widest ${
                    isPlaying ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}>
                    {isPlaying ? "RUNNING" : "PAUSED"}
                  </span>
                  <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded text-[10px] sm:text-xs">
                    [{currentPhase.name.toUpperCase()}]
                  </span>
                </div>

                {/* 想法流简洁自然融入，不单独大弹窗展示 */}
                {currentLyric?.thoughtLog && (
                  <motion.div
                    key={currentLyric.thoughtLog.step}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-300 bg-zinc-950/70 border-r-2 border-purple-500/80 pr-2 py-0.5 pl-3 rounded-l-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping shrink-0" />
                    <span className="text-purple-300 font-bold shrink-0">
                      [{currentLyric.thoughtLog.step}]:
                    </span>
                    <span className="text-zinc-300 font-sans truncate max-w-[260px] sm:max-w-[340px]">
                      {currentLyric.thoughtLog.details}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* 未播放时中央浮动点击唤醒引导 */}
            {!isPlaying && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-auto">
                <button
                  onClick={togglePlay}
                  className="group px-7 py-4 rounded-3xl bg-zinc-950/85 hover:bg-zinc-900 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-cyan-400/40 group-hover:bg-cyan-300 transition-colors">
                    <Play size={24} className="ml-0.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                      点击开启 Gemini 3.8 Flash 视听盛宴
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      world.execute(me); • 60FPS 字符与向量声画同步
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: 双重视界模式 (左代码/右画卷) */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full p-2 sm:p-3 gap-3 relative">
            <div className="h-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/80 shadow-xl">
              <WorldExecuteMeTerminal
                currentTime={currentTime}
                currentLyric={currentLyric}
                onSeek={handleSeek}
              />
            </div>
            <div className="h-full rounded-xl overflow-hidden border border-zinc-800/80 shadow-xl relative bg-zinc-950">
              <WorldExecuteMeCanvas
                currentTime={currentTime}
                isPlaying={isPlaying}
                audioAnalyser={analyserRef.current}
                currentLyric={currentLyric}
                currentLyricIndex={currentLyricIndex}
                isCrtMode={isCrtMode}
              />
              <KineticSceneLyrics
                currentLyric={currentLyric}
                currentTime={currentTime}
                lyricIndex={currentLyricIndex}
                isCrtMode={isCrtMode}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: 数字终端模式 */}
        {viewMode === "terminal" && (
          <div className="relative w-full h-full p-2 sm:p-4 max-w-5xl mx-auto">
            {/* 背后粒子微光氛围 */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <WorldExecuteMeCanvas
                currentTime={currentTime}
                isPlaying={isPlaying}
                audioAnalyser={analyserRef.current}
                currentLyric={currentLyric}
                currentLyricIndex={currentLyricIndex}
                isCrtMode={isCrtMode}
              />
            </div>
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/90 shadow-2xl">
              <WorldExecuteMeTerminal
                currentTime={currentTime}
                currentLyric={currentLyric}
                onSeek={handleSeek}
              />
            </div>
            <KineticSceneLyrics
              currentLyric={currentLyric}
              currentTime={currentTime}
              lyricIndex={currentLyricIndex}
              isCrtMode={isCrtMode}
            />
          </div>
        )}
      </main>

      {/* 底部全功能播放控制器 (Player Control Bar，高度固定 shrink-0) */}
      <footer className="relative z-30 px-3 sm:px-6 py-2.5 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 shrink-0">
        {/* 顶部阶段分段进度条 */}
        <div className="relative w-full mb-2 group">
          {/* 进度条轨道 */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              handleSeek(pct * duration);
            }}
            className="relative w-full h-2 bg-zinc-900 rounded-full cursor-pointer overflow-hidden border border-zinc-800 group-hover:h-3 transition-all"
          >
            {/* 阶段色块背景划分 */}
            <div className="absolute inset-0 flex">
              {SCENE_PHASES.map((ph) => {
                const w = ((ph.timeRange[1] - ph.timeRange[0]) / duration) * 100;
                return (
                  <div
                    key={ph.id}
                    style={{ width: `${w}%`, backgroundColor: ph.color, opacity: 0.15 }}
                    className="h-full border-r border-black/30"
                    title={ph.name}
                  />
                );
              })}
            </div>

            {/* 播放进度高亮条 */}
            <div
              style={{ width: `${(currentTime / duration) * 100}%` }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 shadow-lg shadow-cyan-500/50"
            />
          </div>

          {/* 进度时间指示 */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <span>{currentPhase.name}</span>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 核心操作按钮栏 */}
        <div className="flex items-center justify-between gap-4">
          {/* 左侧曲目信息 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>{SONG_METADATA.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-cyan-400 font-mono">
                  130 BPM
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">{SONG_METADATA.artist}</p>
            </div>
          </div>

          {/* 中间播放控制键 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleSeek(currentTime - 5)}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-all cursor-pointer"
              title="后退 5 秒"
            >
              <Rewind size={16} />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black flex items-center justify-center transition-all shadow-lg shadow-cyan-400/30 hover:scale-105 active:scale-95 cursor-pointer"
              title={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            <button
              onClick={() => handleSeek(currentTime + 5)}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-all cursor-pointer"
              title="前进 5 秒"
            >
              <FastForward size={16} />
            </button>

            <button
              onClick={() => handleSeek(0)}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-all cursor-pointer"
              title="重新开始"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* 右侧：歌词微调与音量控制 */}
          <div className="flex items-center gap-3">
            {/* 歌词同步微调控制器 */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono">
              <span className="text-zinc-500">歌词同步:</span>
              {[
                { label: "0s", value: 0 },
                { label: "+0.2s", value: 0.2 },
                { label: "+0.35s(推荐)", value: 0.35 },
                { label: "+0.5s", value: 0.5 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLyricOffset(opt.value)}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                    lyricOffset === opt.value
                      ? "bg-cyan-500 text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title={`将歌词提前 ${opt.value} 秒`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* 音量控制 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    const next = !isMuted;
                    audioRef.current.muted = next;
                    setIsMuted(next);
                  }
                }}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(false);
                  if (audioRef.current) {
                    audioRef.current.volume = val;
                    audioRef.current.muted = false;
                  }
                }}
                className="w-16 sm:w-20 accent-cyan-400 cursor-pointer"
                title="调节音量"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* 背景与致敬弹窗 */}
      <AnimatePresence>
        {isInfoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsInfoModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-400 text-zinc-950 flex items-center justify-center font-bold">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      致敬说明与开发背景
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      Gemini 3.8 Flash • world.execute(me);
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs cursor-pointer"
                >
                  关闭
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                <p>
                  本页面是为你特别打造的独立纪念视听空间，以音乐项目 Mili 经典神作《world.execute(me);》为原声基底，主角已全面重构为{" "}
                  <strong className="text-cyan-400">Gemini 3.8 Flash</strong>。
                </p>
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 font-mono text-xs text-zinc-400 space-y-1">
                  <div>• 原曲: Mili《world.execute(me);》</div>
                  <div>• 字符艺术与场景设计借鉴: yym8224961/world.execute-me-ascii</div>
                  <div>• 灵感原作: 哔哩哔哩 BV1Jwhy6BEMJ</div>
                  <div>• 渲染引擎: 60FPS Procedural ASCII & Vector Cyber Engine</div>
                </div>
                <p className="text-zinc-400">
                  视觉画面完全由原生代码实时渲染生成，严格同步原曲每一句歌词的计算机语义。支持全景意识、双重视界（代码终端+画卷）与纯数字终端三种浏览形态。
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  进入体验
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
