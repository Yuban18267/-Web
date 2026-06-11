import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Palette, 
  User, 
  Settings, 
  Check, 
  Sliders, 
  Sun, 
  Moon, 
  Flower, 
  Zap, 
  Leaf, 
  Orbit, 
  Eye,
  Mail,
  Flame
} from "lucide-react";
import { useTheme, Theme, ThemeCharacter, AmbientEffect } from "../hooks/useTheme";

export default function Personalization() {
  const { 
    theme, 
    setTheme, 
    character, 
    setCharacter, 
    ambientEffect, 
    setAmbientEffect, 
    bgBlur, 
    setBgBlur, 
    bgOpacity, 
    setBgOpacity 
  } = useTheme();

  // Presets structures with designed matching icons and color indicators
  const themePresets = [
    { 
      id: "light" as Theme, 
      name: "极简素白", 
      desc: "清爽干净，高对比度的轻快主页体验", 
      dotBg: "#f8fafc",
      dotAccent: "#2563eb",
      dotText: "#0f172a",
      icon: <Sun className="text-amber-500" size={18} />
    },
    { 
      id: "dark" as Theme, 
      name: "深灰极夜", 
      desc: "纯正深邃，温和护眼且沉静高雅", 
      dotBg: "#09090b",
      dotAccent: "#3b82f6",
      dotText: "#f4f4f5",
      icon: <Moon className="text-indigo-400 dark:text-indigo-300" size={18} />
    },
    { 
      id: "sakura" as Theme, 
      name: "樱落千歌", 
      desc: "浅粉娇姿，仿佛有微风轻拂的梦幻氛围", 
      dotBg: "#fff5f6",
      dotAccent: "#db2777",
      dotText: "#4c0519",
      icon: <Flower className="text-rose-400" size={18} />
    },
    { 
      id: "neon" as Theme, 
      name: "漫步霓虹", 
      desc: "炫彩赛博，夜色霓虹与科幻光粒子相伴", 
      dotBg: "#0b0514",
      dotAccent: "#d946ef",
      dotText: "#fdf4ff",
      icon: <Zap className="text-fuchsia-400" size={18} />
    },
    { 
      id: "forest" as Theme, 
      name: "林间随风", 
      desc: "幽静林落，伴随古老藤萝与轻微萤粉", 
      dotBg: "#f3f7f5",
      dotAccent: "#059669",
      dotText: "#022c22",
      icon: <Leaf className="text-emerald-500" size={18} />
    },
    { 
      id: "starry" as Theme, 
      name: "星之彼岸", 
      desc: "无垠深空，群星闪烁勾勒永恒的轨迹", 
      dotBg: "#030811",
      dotAccent: "#06b6d4",
      dotText: "#ecfeff",
      icon: <Orbit className="text-cyan-400" size={18} />
    }
  ];

  // Restricting characters strictly to Akane or none
  const characterPresets = [
    {
      id: "none" as ThemeCharacter,
      name: "无桌面伙伴",
      subtitle: "极简纯粹",
      desc: "关闭右下角可交互的二次元伴侣，保留最专注的纯净阅读与浏览排版布局",
      color: "from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900"
    },
    {
      id: "miku" as ThemeCharacter,
      name: "赤音 (Akane)",
      subtitle: "歌姬之声",
      desc: "唤醒屏幕右下角一个可自由拖拽、支持点击触控对话反馈的趣味虚拟桌面伙伴。页面背景大图已移除，让布局更清爽简约。",
      color: "from-teal-400 to-cyan-500"
    }
  ];

  const renderCharacterThumbnail = (id: ThemeCharacter, subtitle: string) => {
    if (id === "none") {
      return (
        <div className="w-16 h-22 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900/60 dark:to-zinc-900 border border-theme-border/60 transition-transform duration-300 group-hover:scale-105 shrink-0 relative overflow-hidden shadow-xs">
          <svg className="w-7 h-7 text-theme-muted opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
          </svg>
          <div className="absolute inset-x-0 bottom-1.5 flex items-center justify-center">
            <span className="text-[8px] text-theme-muted opacity-80 uppercase tracking-wider font-mono font-bold leading-none">Focus</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-16 h-22 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-teal-500/10 to-cyan-500/20 dark:from-teal-950/40 dark:to-cyan-950/40 border border-teal-400/30 transition-transform duration-300 group-hover:scale-105 shrink-0 relative overflow-hidden shadow-xs">
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <div className="w-10 h-10 rounded-full border border-teal-400 border-dashed animate-spin" style={{ animationDuration: "10s" }} />
          </div>
          <svg className="w-8 h-8 text-cyan-500 dark:text-cyan-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2Zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2ZM9 10l12-3" />
          </svg>
          <div className="absolute left-1 top-4 w-1 h-5 rounded bg-gradient-to-b from-teal-400 to-cyan-400 animate-pulse" />
          <div className="absolute right-1 top-4 w-1 h-5 rounded bg-gradient-to-b from-teal-400 to-cyan-400 animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-x-0 bottom-1.5 flex items-center justify-center">
            <span className="text-[8px] font-mono text-cyan-500 font-black uppercase tracking-wider leading-none z-10">AKANE</span>
          </div>
        </div>
      );
    }
  };

  const effectPresets = [
    { id: "none" as AmbientEffect, name: "静止恒夜", desc: "关闭一切漂浮、微茫动效" },
    { id: "particles" as AmbientEffect, name: "灵动微芒", desc: "莹亮粒子幽幽由下而上无轨漂浮，自带景深模糊" },
    { id: "sakura_leaf" as AmbientEffect, name: "浮生落樱", desc: "梦幻浅粉花瓣乘风打转，自左上往右下悠然纷飞" }
  ];

  return (
    <div className="pt-28 pb-24 px-6 max-w-6xl mx-auto min-h-screen">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14 text-center max-w-4xl mx-auto mt-4"
      >
        <div className="w-16 h-16 bg-accent-light text-accent rounded-3xl flex items-center justify-center mb-6 mx-auto rotate-6 shadow-sm border border-theme-border">
          <Palette size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter mb-4">
          拾壹美学系统
        </h1>
        <p className="text-theme-muted text-lg leading-relaxed max-w-2xl mx-auto">
          在这里，您可以自由挑选喜欢的主题基调，与您一同航行。
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Presets Selectors */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Preset Theme Selector */}
          <section className="bg-theme-card p-8 rounded-3xl border border-theme-border shadow-sm transition-all">
            <h2 className="text-xl font-black text-theme-text flex items-center gap-2 mb-6">
              <Palette className="text-accent" size={22} />
              主页色彩色调
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {themePresets.map((preset) => {
                const isSelected = theme === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setTheme(preset.id)}
                    className={`flex flex-col justify-between p-5 rounded-3xl border text-left cursor-pointer transition-all duration-300 relative group overflow-hidden bg-theme-card border-theme-border ${
                      isSelected 
                        ? "ring-2 ring-accent border-accent" 
                        : "hover:border-theme-border-hover hover:shadow-xs hover:translate-y-[-2px]"
                    }`}
                  >
                    {/* Visual Mini Palette Capsule */}
                    <div className="flex items-center gap-1.5 mb-1.5 w-full bg-theme-bg/60 p-1 rounded-xl border border-theme-border/30">
                      <span className="w-3.5 h-3.5 rounded-full select-none shadow-xs inline-block" style={{ backgroundColor: preset.dotBg }} />
                      <span className="w-2.5 h-2.5 rounded-full shadow-xs inline-block animate-pulse" style={{ backgroundColor: preset.dotAccent }} />
                      <span className="text-[10px] font-mono opacity-50 ml-auto mr-1 truncate">
                        {preset.id.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-full mt-2 mb-3">
                      <div className="p-1.5 bg-theme-bg border border-theme-border/50 rounded-xl">
                        {preset.icon}
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white dark:text-zinc-900 text-xs font-bold shadow">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-extrabold text-sm text-theme-text mb-1">
                        {preset.name}
                      </h3>
                      <p className="text-xs text-theme-muted font-normal leading-relaxed">
                        {preset.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Premium Character Selector */}
          <section className="bg-theme-card p-8 rounded-3xl border border-theme-border shadow-sm transition-all">
            <h2 className="text-xl font-black text-theme-text flex items-center gap-2 mb-6">
              <User className="text-accent" size={22} />
              虚拟桌面伙伴
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characterPresets.map((char) => {
                const isSelected = character === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => setCharacter(char.id)}
                    className={`flex gap-5 p-5 rounded-3xl border text-left cursor-pointer transition-all duration-300 active:scale-95 group relative overflow-hidden bg-theme-card ${
                      isSelected 
                        ? "ring-2 ring-accent border-accent" 
                        : "border-theme-border hover:border-theme-border-hover hover:shadow-xs"
                    }`}
                  >
                    {/* Tiny thumbnail preview */}
                    {renderCharacterThumbnail(char.id, char.subtitle)}

                    <div className="flex-1 min-w-0 pr-4 flex flex-col justify-center">
                      <h3 className="font-extrabold text-sm text-theme-text flex items-center gap-2">
                        {char.name}
                        {isSelected && (
                          <span className="text-[10px] font-bold text-accent bg-accent-light px-1.5 rounded py-0.5">
                            已就绪
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-theme-muted mt-1 leading-relaxed lines-clamp-3">
                        {char.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white dark:text-zinc-900 text-xs shadow-sm">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Micro Ambient Effect Switcher */}
          <section className="bg-theme-card p-8 rounded-3xl border border-theme-border shadow-sm transition-all">
            <h2 className="text-xl font-bold text-theme-text flex items-center gap-2 mb-6">
              <Sparkles className="text-accent" size={22} />
              背景微光与漂浮特效
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {effectPresets.map((effect) => {
                const isSelected = ambientEffect === effect.id;
                return (
                  <button
                    key={effect.id}
                    onClick={() => setAmbientEffect(effect.id)}
                    className={`p-5 rounded-3xl border text-center cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? "bg-accent-light border-accent text-accent font-bold" 
                        : "bg-theme-card border-theme-border hover:border-theme-border-hover text-theme-muted hover:text-theme-text"
                    }`}
                  >
                    <span className="block text-sm font-extrabold mb-1.5">{effect.name}</span>
                    <span className="text-[11px] font-normal opacity-85 leading-relaxed">{effect.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Column: Fine Tuning Sliders & Character Preview Card */}
        <div className="space-y-8">
          
          {/* Real-time Fine Tuning Panel */}
          <section className="bg-theme-card p-8 rounded-3xl border border-theme-border shadow-sm transition-all">
            <h2 className="text-xl font-bold text-theme-text flex items-center gap-2 mb-6">
              <Sliders className="text-accent" size={22} />
              画卷景深与融合微调
            </h2>
            <div className="space-y-6">
              
              {/* Opacity Slider */}
              <div>
                <div className="flex justify-between text-sm font-bold text-theme-text mb-2">
                  <span className="flex items-center gap-1.5">
                    <Eye size={15} className="text-accent" />
                    画卷透明度
                  </span>
                  <span className="text-accent font-mono text-xs">{bgOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-theme-bg rounded-lg cursor-pointer accent-accent focus:outline-none"
                  disabled={character === "none"}
                />
                <p className="text-[11px] text-theme-muted mt-2 leading-relaxed">
                  调整动漫角色与底层页面交互的淡入融合。高透明度赏心悦目，低透明度对文字阅读更加专注温和。
                </p>
              </div>

              {/* Blur Slider */}
              <div>
                <div className="flex justify-between text-sm font-bold text-theme-text mb-2">
                  <span className="flex items-center gap-1.5">
                    <Settings size={15} className="text-accent" />
                    景深模糊度
                  </span>
                  <span className="text-accent font-mono text-xs">{bgBlur} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={bgBlur}
                  onChange={(e) => setBgBlur(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-theme-bg rounded-lg cursor-pointer accent-accent focus:outline-none"
                  disabled={character === "none"}
                />
                <p className="text-[11px] text-theme-muted mt-2 leading-relaxed">
                  施加高斯模糊以分离文字图层与背景。推荐使用 2px - 6px 以呈现出奶油般的梦幻景深融入质感。
                </p>
              </div>

            </div>
          </section>

          {/* Theme Interactive Visual Card Previewer */}
          <section className="bg-theme-card p-6 rounded-3xl border border-theme-border shadow-xs flex flex-col justify-between text-center relative overflow-hidden group">
            
            <div className="relative z-10 py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-[10px] font-bold uppercase tracking-wider mb-3">
                <Flame size={12} className="animate-pulse" />
                当前环境运行中
              </span>
              <h3 className="font-extrabold text-base text-theme-text mb-1">
                拾壹屿美学引擎
              </h3>
              <p className="text-xs text-theme-muted px-4 leading-relaxed font-serif">
                "在这片随风起落的多维岛屿中，用光影与随笔将每一次心跳和思绪封存。"
              </p>
            </div>

            <div className="mt-4 p-4 bg-theme-bg/80 rounded-2xl border border-theme-border/60 text-left text-xs text-theme-muted space-y-2 relative z-10 shadow-xs">
              <div className="flex justify-between">
                <span>渲染配色方案:</span>
                <span className="font-bold font-mono text-theme-text uppercase">{theme}</span>
              </div>
              <div className="flex justify-between">
                <span>活跃动漫看板:</span>
                <span className="font-bold text-accent">
                  {characterPresets.find(c => c.id === character)?.name || "无"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>微光氛围模组:</span>
                <span className="font-bold text-accent">
                  {effectPresets.find(e => e.id === ambientEffect)?.name || "无"}
                </span>
              </div>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}
