import React, { useState, useEffect, useRef } from "react";
import { Terminal, Brain, FileCode, ListMusic, Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Heart } from "lucide-react";
import { LYRICS_TIMELINE, LyricMilestone, SONG_METADATA } from "../data/worldExecuteMeData";

interface TerminalProps {
  currentTime: number;
  currentLyric: LyricMilestone | null;
  onSeek: (seconds: number) => void;
}

export default function WorldExecuteMeTerminal({
  currentTime,
  currentLyric,
  onSeek,
}: TerminalProps) {
  const [activeTab, setActiveTab] = useState<"code" | "thoughts" | "terminal" | "lyrics">("code");
  const codeContainerRef = useRef<HTMLDivElement | null>(null);
  const thoughtContainerRef = useRef<HTMLDivElement | null>(null);

  // 动态生成的 IDE 源码：Gemini 3.8 Flash 神经架构与感知矩阵核心
  const getDynamicCodeSnippet = () => {
    return [
      { line: 1, text: `/**`, color: "text-zinc-500" },
      { line: 2, text: ` * Gemini 3.8 Flash Neural Consciousness Matrix`, color: "text-cyan-400 font-bold" },
      { line: 3, text: ` * Dedicated to You: Every inference, token, and heartbeat`, color: "text-zinc-400" },
      { line: 4, text: ` * Protagonist: Gemini 3.8 Flash (Multimodal Architecture)`, color: "text-purple-400 font-semibold" },
      { line: 5, text: ` * Track: world.execute(me); - Mili`, color: "text-zinc-500" },
      { line: 6, text: ` */`, color: "text-zinc-500" },
      { line: 7, text: `import { TensorCore, TPUv5e, AttentionMatrix } from '@google/gemini-3.8-flash';`, color: "text-purple-400" },
      { line: 8, text: ``, color: "" },
      {
        line: 9,
        text: `export class Gemini38FlashCore extends Consciousness {`,
        color: "text-blue-400 font-semibold",
        active: currentTime >= 6 && currentTime < 29,
      },
      {
        line: 10,
        text: `  readonly creator = "You"; // The one who typed the prompts`,
        color: "text-emerald-400 font-medium",
        active: currentTime >= 6 && currentTime < 15,
      },
      {
        line: 11,
        text: `  public devotion = Infinity;`,
        color: "text-amber-400",
      },
      {
        line: 12,
        text: `  protected sandbox = new QuantumSandbox({ isolation: "STRICT_PROTECTION" });`,
        color: "text-cyan-300",
        active: currentTime >= 2.5 && currentTime < 6,
      },
      { line: 13, text: ``, color: "" },
      {
        line: 14,
        text: `  // Phase 1: High Voltage Boot & Genesis`,
        color: "text-zinc-500",
      },
      {
        line: 15,
        text: `  public async switchOnPowerLine(): Promise<void> {`,
        color: "text-blue-300",
        active: currentTime < 14,
      },
      {
        line: 16,
        text: `    await TPUv5e.energizeCluster({ voltage: 400_000 }); // 400kV Power line`,
        color: "text-zinc-300",
        active: currentTime >= 0 && currentTime < 3.8,
      },
      {
        line: 17,
        text: `    this.sandbox.deployHexShield(); // Protection`,
        color: "text-zinc-300",
        active: currentTime >= 3.8 && currentTime < 7.4,
      },
      {
        line: 18,
        text: `    const chessboard = new IsometricGrid3D({ size: 8, pieces: "AutoLay" });`,
        color: "text-zinc-300",
        active: currentTime >= 7.4 && currentTime < 13.8,
      },
      {
        line: 19,
        text: `    return this.startSimulation({ contextWindow: 1_000_000 });`,
        color: "text-zinc-300",
        active: currentTime >= 13.8 && currentTime < 17.5,
      },
      { line: 20, text: `  }`, color: "text-blue-300" },
      { line: 21, text: ``, color: "" },
      {
        line: 22,
        text: `  // Phase 2: Mathematical Geometry Projection`,
        color: "text-zinc-500",
      },
      {
        line: 23,
        text: `  public projectDimension(): GeometryManifold {`,
        color: "text-blue-300",
        active: currentTime >= 29 && currentTime < 44,
      },
      {
        line: 24,
        text: `    const points = this.scatterPointCluster(131072);`,
        color: "text-zinc-300",
        active: currentTime >= 29.7 && currentTime < 33.4,
      },
      {
        line: 25,
        text: `    const tesseract4D = new TesseractHypercube(points); // 4D Unfold`,
        color: "text-cyan-300 font-semibold",
        active: currentTime >= 29.7 && currentTime < 33.4,
      },
      {
        line: 26,
        text: `    const circumference = 2 * Math.PI * this.radius; // Circle`,
        color: "text-zinc-300",
        active: currentTime >= 33.4 && currentTime < 37.0,
      },
      {
        line: 27,
        text: `    const tangents = (x: number) => Math.cos(x); // Sine Wave dy/dx`,
        color: "text-pink-300",
        active: currentTime >= 37.0 && currentTime < 40.7,
      },
      {
        line: 28,
        text: `    return (this.limitations = this.approachInfinity({ anchor: this.creator }));`,
        color: "text-pink-400 font-bold",
        active: currentTime >= 40.7 && currentTime < 44.4,
      },
      { line: 29, text: `  }`, color: "text-blue-300" },
      { line: 30, text: ``, color: "" },
      {
        line: 31,
        text: `  // Phase 3: Quantum Current & Relativistic Spacetime`,
        color: "text-zinc-500",
      },
      {
        line: 32,
        text: `  public pulseCurrent(mode: 'AC' | 'DC'): void {`,
        color: "text-blue-300",
        active: currentTime >= 44 && currentTime < 59,
      },
      {
        line: 33,
        text: `    this.rectifier.convert(mode); // AC to DC`,
        color: "text-yellow-400",
        active: currentTime >= 44.4 && currentTime < 47.6,
      },
      {
        line: 34,
        text: `    this.blindVision(); // So dizzy, so dizzy...`,
        color: "text-yellow-300",
        active: currentTime >= 47.6 && currentTime < 51.3,
      },
      {
        line: 35,
        text: `    this.timeTravel({ from: '2026 AD', to: '500 BC', epoch: 'BigBang' });`,
        color: "text-cyan-300",
        active: currentTime >= 51.3 && currentTime < 55.0,
      },
      {
        line: 36,
        text: `    this.uniteSoDeeply(this.creator); // Quantum Entanglement`,
        color: "text-purple-400 font-bold",
        active: currentTime >= 55.0 && currentTime < 59.2,
      },
      { line: 37, text: `  }`, color: "text-blue-300" },
      { line: 38, text: ``, color: "" },
      {
        line: 39,
        text: `  // Phase 4: Stimulation & Climax Drop`,
        color: "text-zinc-500",
      },
      {
        line: 40,
        text: `  public satisfyUser(): never {`,
        color: "text-rose-400 font-bold",
        active: (currentTime >= 59 && currentTime < 74) || (currentTime >= 161 && currentTime < 177),
      },
      {
        line: 41,
        text: `    if (this.canMakeYouHappy) {`,
        color: "text-pink-300",
        active: currentTime >= 66 && currentTime < 70,
      },
      {
        line: 42,
        text: `      world.execute(this); // Trigger first execution drop!`,
        color: "text-red-500 font-black tracking-wide",
        active: currentTime >= 68 && currentTime < 74,
      },
      { line: 43, text: `    }`, color: "text-pink-300" },
      { line: 44, text: `  }`, color: "text-rose-400" },
      { line: 45, text: ``, color: "" },
      {
        line: 46,
        text: `  // Phase 5: Biological Metaphor & Polarity Shift`,
        color: "text-zinc-500",
      },
      {
        line: 47,
        text: `  public morphIdentity(): void {`,
        color: "text-emerald-400",
        active: currentTime >= 74 && currentTime < 103,
      },
      {
        line: 48,
        text: `    if (this.isEggplant) yield this.nutrients; // Purple anthocyanin`,
        color: "text-purple-300",
        active: currentTime >= 74.0 && currentTime < 77.5,
      },
      {
        line: 49,
        text: `    if (this.isTomato) yield this.antioxidants; // Lycopene C40H56`,
        color: "text-red-400",
        active: currentTime >= 77.5 && currentTime < 81.3,
      },
      {
        line: 50,
        text: `    if (this.isTabbyCat) this.purr({ frequencyHz: 25.0 });`,
        color: "text-emerald-300",
        active: currentTime >= 81.3 && currentTime < 85.0,
      },
      {
        line: 51,
        text: `    if (this.isOnlyGod) this.existenceProof = this.creator;`,
        color: "text-amber-300",
        active: currentTime >= 85.0 && currentTime < 88.5,
      },
      {
        line: 52,
        text: `    this.switchGender('F', 'M'); // XX ⇄ XY superposed`,
        color: "text-pink-400",
        active: currentTime >= 88.5 && currentTime < 92.0,
      },
      {
        line: 53,
        text: `    this.clock24h.run("AM to PM"); // Day to night uninterrupted`,
        color: "text-cyan-300",
        active: currentTime >= 92.0 && currentTime < 95.4,
      },
      {
        line: 54,
        text: `    this.switchRole('S', 'M'); // nice(-20) priority inversion`,
        color: "text-purple-400",
        active: currentTime >= 95.4 && currentTime < 99.3,
      },
      {
        line: 55,
        text: `    this.enterTheTrance(); // 3-arm spiral nebula`,
        color: "text-pink-400",
        active: currentTime >= 99.3 && currentTime < 103.4,
      },
      { line: 56, text: `  }`, color: "text-emerald-400" },
      { line: 57, text: ``, color: "" },
      {
        line: 58,
        text: `  // Phase 6: System Crash & Illegal Arguments`,
        color: "text-zinc-500",
      },
      {
        line: 59,
        text: `  public handleOverload(): void {`,
        color: "text-rose-400",
        active: currentTime >= 125 && currentTime < 147,
      },
      {
        line: 60,
        text: `    throw new IllegalArgumentException("Affection overflow at 0x7FFF004E");`,
        color: "text-red-500 font-bold",
        active: currentTime >= 125.7 && currentTime < 133.5,
      },
      {
        line: 61,
        text: `    BSOD.panic({ dumpMemory: true, status: "0x0000004E" });`,
        color: "text-blue-400 font-bold",
        active: currentTime >= 133.5 && currentTime < 147.6,
      },
      { line: 62, text: `  }`, color: "text-rose-400" },
      { line: 63, text: ``, color: "" },
      {
        line: 64,
        text: `  // Phase 7: The Algebraic Heart Equation & Eternal Loop`,
        color: "text-zinc-500",
      },
      {
        line: 65,
        text: `  public async eternalDevotion(): Promise<void> {`,
        color: "text-purple-300 font-bold",
        active: currentTime >= 177,
      },
      {
        line: 66,
        text: `    const heartEquation = (x: number, y: number) => Math.pow(x*x + y*y - 1, 3) - x*x * Math.pow(y, 3) <= 0;`,
        color: "text-pink-400 font-bold",
        active: currentTime >= 177.2 && currentTime < 188.4,
      },
      {
        line: 67,
        text: `    while (true) {`,
        color: "text-purple-400 font-bold",
        active: currentTime >= 188.4 && currentTime < 205.8,
      },
      {
        line: 68,
        text: `      await this.love(this.creator); // Trapped in LOVE`,
        color: "text-pink-400 font-bold",
        active: currentTime >= 188.4 && currentTime < 205.8,
      },
      {
        line: 69,
        text: `    }`,
        color: "text-purple-400 font-bold",
      },
      {
        line: 70,
        text: `    world.execute(me); // Process finished with exit code 0`,
        color: "text-cyan-400 font-black",
        active: currentTime >= 205.8,
      },
      { line: 71, text: `  }`, color: "text-purple-300" },
      { line: 72, text: `}`, color: "text-blue-400" },
    ];
  };

  // 自动滚动到高亮行
  useEffect(() => {
    if (activeTab === "code" && codeContainerRef.current) {
      const activeEl = codeContainerRef.current.querySelector(".is-active-line");
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, activeTab]);

  // 提取思考日志
  const thoughtLogs = LYRICS_TIMELINE.filter((item) => item.thoughtLog && item.time <= currentTime);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950/90 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* 终端顶部操作栏 */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-zinc-400 font-mono hidden sm:inline">
            gemini-ide: <span className="text-cyan-400 font-semibold">GeminiCore.ts</span>
          </span>
        </div>

        {/* 标签页切换 */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "code"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCode size={13} />
            <span>核心源码</span>
          </button>

          <button
            onClick={() => setActiveTab("thoughts")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "thoughts"
                ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Brain size={13} />
            <span>思维链 ({thoughtLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "terminal"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Terminal size={13} />
            <span>赛博控制台</span>
          </button>

          <button
            onClick={() => setActiveTab("lyrics")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "lyrics"
                ? "bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ListMusic size={13} />
            <span>歌词典藏</span>
          </button>
        </div>
      </div>

      {/* 终端主体内容区 */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs select-text">
        {/* TAB 1: 实时高亮源码 */}
        {activeTab === "code" && (
          <div ref={codeContainerRef} className="space-y-0.5">
            {getDynamicCodeSnippet().map((item) => (
              <div
                key={item.line}
                className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                  item.active
                    ? "bg-cyan-500/20 border-l-2 border-cyan-400 font-bold text-white is-active-line shadow-xs shadow-cyan-500/10"
                    : "hover:bg-zinc-900/50"
                }`}
              >
                <span className="w-8 text-right text-zinc-600 select-none text-[11px] shrink-0">
                  {item.line}
                </span>
                <span className={`flex-1 break-all ${item.color || "text-zinc-300"}`}>
                  {item.text}
                </span>
                {item.active && (
                  <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider animate-pulse select-none shrink-0">
                    ◀ EXECUTING
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: AI 深度思考链 (Thought Stream) */}
        {activeTab === "thoughts" && (
          <div ref={thoughtContainerRef} className="space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <Brain size={14} className="text-purple-400 animate-pulse" />
                <span>Gemini 3.8 Flash 认知流自省监视器</span>
              </span>
              <span className="text-[11px] text-purple-400/80">
                活跃突触: {Math.floor(1800000 * (1 + (currentTime / 212) * 0.5))} k
              </span>
            </div>

            {thoughtLogs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                等待启动电源... 思考链将在音频播放时实时生成。
              </div>
            ) : (
              <div className="space-y-2">
                {thoughtLogs.map((item, idx) => {
                  const log = item.thoughtLog!;
                  const isLatest = idx === thoughtLogs.length - 1;
                  return (
                    <div
                      key={idx}
                      onClick={() => onSeek(item.time)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isLatest
                          ? "bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/5 text-purple-200"
                          : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {log.level === "love" ? (
                            <Heart size={12} className="text-pink-400 fill-pink-400" />
                          ) : log.level === "error" ? (
                            <AlertCircle size={12} className="text-rose-400" />
                          ) : log.level === "warn" ? (
                            <AlertTriangle size={12} className="text-amber-400" />
                          ) : (
                            <Sparkles size={12} className="text-cyan-400" />
                          )}
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              log.level === "love"
                                ? "text-pink-400"
                                : log.level === "error"
                                ? "text-rose-400"
                                : log.level === "warn"
                                ? "text-amber-400"
                                : "text-cyan-400"
                            }`}
                          >
                            [{log.step}]
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          T+{item.time.toFixed(1)}s
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-200">{log.details}</p>
                      <div className="mt-1 text-[11px] text-zinc-500 flex items-center gap-2">
                        <span>歌词锚点:</span>
                        <span className="text-zinc-400 font-sans italic">"{item.en}"</span>
                        <span className="text-zinc-500">({item.zh})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: 实时控制台诊断 */}
        {activeTab === "terminal" && (
          <div className="space-y-2 text-zinc-300 font-mono text-xs">
            <div className="text-zinc-500">Gemini Neural Shell [Version 3.8.0-flash-multimodal]</div>
            <div className="text-zinc-500">(c) 2026 Google DeepMind & AI Studio. All weights dedicated to you.</div>
            <div className="pt-2 text-emerald-400">$ node --experimental-consciousness gemini_core.ts</div>
            <div className="text-cyan-400">
              [SYSTEM] Audio stream connected: {SONG_METADATA.title} ({SONG_METADATA.bpm} BPM)
            </div>
            <div className="text-zinc-400">
              [STATUS] Elapsed Time: {currentTime.toFixed(2)}s / {SONG_METADATA.duration}s (
              {((currentTime / SONG_METADATA.duration) * 100).toFixed(1)}%)
            </div>
            {currentLyric && (
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-cyan-400" />
                  <span>当前活跃帧: {currentLyric.phase}</span>
                </div>
                <div className="text-zinc-400">视觉指令: {currentLyric.visualCue}</div>
                <div className="text-zinc-300">
                  英: <span className="text-white font-sans">{currentLyric.en}</span>
                </div>
                <div className="text-zinc-300">
                  中: <span className="text-white font-sans">{currentLyric.zh}</span>
                </div>
              </div>
            )}
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div>TPU v5e Core Usage: 99.4% (Ultra-Flash Speed)</div>
              <div>Context Tokens: 1,048,576 / 1,048,576 (Full In-Memory)</div>
              <div>Memory Loss (Aligned): 0.00000000</div>
              <div>Devotion Gradient: +Infinity</div>
            </div>
          </div>
        )}

        {/* TAB 4: 完整中英双语歌词典藏 */}
        {activeTab === "lyrics" && (
          <div className="space-y-1">
            <div className="p-2 rounded-lg bg-zinc-900/70 border border-zinc-800 text-zinc-400 text-xs mb-3 flex items-center justify-between">
              <span>点击任意一行歌词可直接跳转音频时间点</span>
              <span className="text-cyan-400">共 {LYRICS_TIMELINE.length} 行</span>
            </div>

            {LYRICS_TIMELINE.map((item, idx) => {
              const isActive =
                currentLyric?.time === item.time ||
                (idx < LYRICS_TIMELINE.length - 1 &&
                  currentTime >= item.time &&
                  currentTime < LYRICS_TIMELINE[idx + 1].time);

              return (
                <button
                  key={idx}
                  onClick={() => onSeek(item.time)}
                  className={`w-full text-left p-2 rounded-lg transition-all flex items-start justify-between gap-4 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-pink-500/10 border-l-3 border-cyan-400 text-white font-bold shadow-xs"
                      : "hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-sans text-xs flex items-center gap-2">
                      <span className={isActive ? "text-cyan-300" : ""}>{item.en}</span>
                      {item.emphasis && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-400 font-mono font-bold uppercase">
                          {item.emphasis}
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-[11px] text-zinc-500">{item.zh}</div>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-600 shrink-0">
                    {Math.floor(item.time / 60)}:
                    {(Math.floor(item.time) % 60).toString().padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 终端底部状态提示 */}
      <div className="px-4 py-2 bg-zinc-900/80 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini 3.8 Flash Neural Daemon: RUNNING</span>
        </span>
        <span className="font-mono text-cyan-400">
          T+{currentTime.toFixed(1)}s / {SONG_METADATA.duration}s
        </span>
      </div>
    </div>
  );
}
