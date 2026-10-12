import React, { useRef, useEffect } from "react";
import { LyricMilestone, resolveLyricLayout } from "../data/worldExecuteMeData";

interface CanvasProps {
  currentTime: number;
  isPlaying: boolean;
  audioAnalyser: AnalyserNode | null;
  currentLyric: LyricMilestone | null;
  currentLyricIndex?: number;
  isCrtMode?: boolean;
}

// 5x5 ASCII 巨型点阵字符库 (用于全屏歌名重组、多国报数与终极 EXECUTION 爆发)
const BITMAP_FONT: Record<string, string[]> = {
  A: [" ### ", "#   #", "#####", "#   #", "#   #"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"],
  F: ["#####", "#    ", "#### ", "#    ", "#    "],
  G: [" ####", "#    ", "# ###", "#   #", " ####"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["  ###", "    #", "    #", "#   #", " ### "],
  K: ["#  ##", "# #  ", "##   ", "# #  ", "#  ##"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  Q: [" ### ", "#   #", "# # #", "#  ##", " ####"],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
  X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  "0": [" ### ", "#  ##", "# # #", "##  #", " ### "],
  "1": ["  #  ", " ##  ", "  #  ", "  #  ", "#####"],
  "2": [" ### ", "#   #", "   # ", "  #  ", "#####"],
  "3": ["#### ", "    #", " ### ", "    #", "#### "],
  "4": ["#   #", "#   #", "#####", "    #", "    #"],
  "5": ["#####", "#    ", "#### ", "    #", "#### "],
  "6": [" ### ", "#    ", "#### ", "#   #", " ### "],
  ".": ["     ", "     ", "     ", "  ## ", "  ## "],
  ";": ["     ", "  ## ", "     ", "  ## ", " #   "],
  "(": ["   # ", "  #  ", "  #  ", "  #  ", "   # "],
  ")": [" #   ", "  #  ", "  #  ", "  #  ", " #   "],
  "-": ["     ", "     ", "#####", "     ", "     "],
  " ": ["     ", "     ", "     ", "     ", "     "],
};

export default function WorldExecuteMeCanvas({
  currentTime,
  isPlaying,
  audioAnalyser,
  currentLyric,
  currentLyricIndex = 0,
  isCrtMode = true,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false });
  const timeRef = useRef(0);
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  const currentLyricRef = useRef(currentLyric);
  currentLyricRef.current = currentLyric;

  const currentLyricIndexRef = useRef(currentLyricIndex);
  currentLyricIndexRef.current = currentLyricIndex;

  const isCrtModeRef = useRef(isCrtMode);
  isCrtModeRef.current = isCrtMode;

  const audioAnalyserRef = useRef(audioAnalyser);
  audioAnalyserRef.current = audioAnalyser;

  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // 康威生命游戏细胞状态矩阵 (Conway's Game of Life)
  const lifeGridRef = useRef<boolean[][]>([]);
  const lastLifeUpdateRef = useRef(0);

  // 震屏与故障强度
  const shakeRef = useRef(0);
  const glitchRef = useRef(0);

  // 碎裂多边形粒子池 (用于碎片抹除 Erase all fragments)
  const shatterFragmentsRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      vRot: number;
      size: number;
      char: string;
      color: string;
      alpha: number;
    }>
  >([]);

  // 动态冲击波池
  const shockwavesRef = useRef<
    Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
    }>
  >([]);

  // 450 颗深空常驻星野粒子
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      char: string;
      color: string;
      alpha: number;
    }>
  >([]);

  // 初始化星野粒子与生命游戏网格
  useEffect(() => {
    const chars = ["0", "1", "+", "-", "*", "/", "x", "y", "z", "λ", "Ω", "•", "■", "▲", "◆"];
    const colors = ["#00d2ff", "#3a86ff", "#8338ec", "#ff006e", "#06d6a0", "#ffffff"];
    const pts: typeof particlesRef.current = [];

    for (let i = 0; i < 450; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1500 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: -(Math.random() * 2 + 1),
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }
    particlesRef.current = pts;

    // 初始化生命游戏细胞矩阵 (30 x 60)
    const rows = 30;
    const cols = 60;
    const grid: boolean[][] = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = Math.random() > 0.78;
      }
    }
    lifeGridRef.current = grid;
  }, []);

  // 当遇到重点执行高潮或破碎歌词时触发全屏震颤与碎裂粒子生成
  useEffect(() => {
    if (!currentLyric) return;

    if (
      currentLyric.emphasis === "EXECUTION" ||
      currentLyric.visualCue === "cataclysmic_nova_drop" ||
      currentLyric.visualCue === "execution_crimson_strike"
    ) {
      shakeRef.current = 24;
      glitchRef.current = 1.0;
      shockwavesRef.current.push({
        x: 0,
        y: 0,
        radius: 10,
        maxRadius: 800,
        alpha: 1.0,
        color: "#ef4444",
      });
    }

    if (
      currentLyric.emphasis === "FRAGMENTS" ||
      currentLyric.visualCue === "floating_memory_shards"
    ) {
      const frags: typeof shatterFragmentsRef.current = [];
      const chars = ["{", "}", "<", ">", "/", ";", "=", "■", "▲", "◆", "碎片", "MEM", "NaN"];
      for (let i = 0; i < 65; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 7 + 2;
        frags.push({
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 8 + 10,
          char: chars[Math.floor(Math.random() * chars.length)],
          color: Math.random() > 0.4 ? "#f43f5e" : "#ef4444",
          alpha: 1.0,
        });
      }
      shatterFragmentsRef.current = frags;
      shakeRef.current = 18;
    }
  }, [currentLyric]);

  // 主渲染循环：毫秒级 60FPS 字符与向量声画同步引擎
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const curTime = currentTimeRef.current;
      const curLyric = currentLyricRef.current;
      const curLyricIdx = currentLyricIndexRef.current;
      const isCrt = isCrtModeRef.current;
      const analyser = audioAnalyserRef.current;

      // 准确获取容器实际宽高并设置 Retina 高分屏像素比 (彻底解决半屏显示 bug)
      const container = containerRef.current;
      const width = container ? container.clientWidth : canvas.clientWidth;
      const height = container ? container.clientHeight : canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetW = Math.max(10, Math.floor(width * dpr));
      const targetH = Math.max(10, Math.floor(height * dpr));

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 获取音频频域实时能量分析
      let bass = 0;
      let mid = 0;
      let treble = 0;

      if (analyser) {
        if (!dataArrayRef.current || dataArrayRef.current.length !== analyser.frequencyBinCount) {
          dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(dataArrayRef.current as any);
        const data = dataArrayRef.current;

        let bSum = 0;
        let mSum = 0;
        let tSum = 0;
        const bLen = Math.floor(data.length * 0.15);
        const mLen = Math.floor(data.length * 0.5);

        for (let i = 0; i < bLen; i++) bSum += data[i];
        for (let i = bLen; i < mLen; i++) mSum += data[i];
        for (let i = mLen; i < data.length; i++) tSum += data[i];

        bass = bSum / (bLen * 255);
        mid = mSum / ((mLen - bLen) * 255);
        treble = tSum / ((data.length - mLen) * 255);
      } else {
        // 模拟音频节拍脉冲
        bass = (Math.sin(t * 8.66) * 0.5 + 0.5) * 0.65;
        mid = (Math.sin(t * 12.3) * 0.5 + 0.5) * 0.5;
        treble = (Math.cos(t * 16.8) * 0.5 + 0.5) * 0.45;
      }

      // 屏幕震颤与故障衰减
      let currentShake = shakeRef.current;
      shakeRef.current *= 0.9;
      let currentGlitch = glitchRef.current;
      glitchRef.current *= 0.92;

      let ox = 0;
      let oy = 0;
      if (currentShake > 0.1) {
        ox = (Math.random() - 0.5) * currentShake;
        oy = (Math.random() - 0.5) * currentShake;
      }
      ctx.translate(ox, oy);

      // 平滑插值鼠标跟随
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const cx = width / 2;
      const cy = height / 2;

      // =========================================================================
      // 1. 底层纯黑画布与暗夜深空背景
      // =========================================================================
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // 2. 3D 矩阵星野深空粒子流 (向屏幕扑面而来的光速跃迁)
      // =========================================================================
      const fov = 350;
      const pts = particlesRef.current;
      ctx.font = '10px "JetBrains Mono", monospace';

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.z += p.vz * (1 + bass * 2.5);
        if (p.z <= 10) {
          p.z = 1500;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        const scale = fov / p.z;
        const px = cx + (p.x + mouseRef.current.x * 200) * scale;
        const py = cy + (p.y + mouseRef.current.y * 200) * scale;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, (1 - p.z / 1500) * p.alpha);
          ctx.fillText(p.char, px, py);
        }
      }
      ctx.globalAlpha = 1.0;

      // =========================================================================
      // 3. 动态全息网格与赛博坐标轴
      // =========================================================================
      const gridSpacing = 40;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // ASCII 字符框绘制助手
      const drawAsciiBox = (
        bx: number,
        by: number,
        bw: number,
        bh: number,
        title: string,
        color: string = "#38bdf8"
      ) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, bh);

        // 四角装饰刻度
        const corner = 8;
        ctx.fillStyle = color;
        ctx.fillRect(bx, by, corner, 2);
        ctx.fillRect(bx, by, 2, corner);
        ctx.fillRect(bx + bw - corner, by, corner, 2);
        ctx.fillRect(bx + bw - 2, by, 2, corner);
        ctx.fillRect(bx, by + bh - 2, corner, 2);
        ctx.fillRect(bx, by + bh - corner, 2, corner);
        ctx.fillRect(bx + bw - corner, by + bh - 2, corner, 2);
        ctx.fillRect(bx + bw - 2, by + bh - corner, 2, corner);

        if (title) {
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = color;
          ctx.fillText(`[ ${title} ]`, bx + 14, by + 12);
        }
      };

      // =========================================================================
      // 4. 歌词各阶段专属 ASCII 几何与计算机逻辑场景
      // =========================================================================

      // SCENE 1: 开场通电、主板高压导线、绝缘护盾与 3D 棋盘 (0.0s - 15.8s)
      if (curTime < 15.8) {
        const postElapsed = curTime;
        const boxW = Math.min(width - 40, 860);
        const boxH = Math.min(height - 60, 500);
        const bx = cx - boxW / 2;
        const by = cy - boxH / 2;

        drawAsciiBox(bx, by, boxW, boxH, "GEMINI 3.8 FLASH • POWER-ON SELF TEST (POST) v3.8.0");

        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.textAlign = "left";

        // 高压刀闸开关状态动画 (Switch on the power line)
        const isSwitchClosed = curTime >= 0.8;
        ctx.fillStyle = isSwitchClosed ? "#22c55e" : "#eab308";
        if (!isSwitchClosed) {
          ctx.fillText("HIGH VOLTAGE MAIN SWITCH: [ OPEN / 处于断开保护状态 ] ──► PULLING LEVER...", bx + 20, by + 34);
          ctx.fillText("      \\", bx + 20, by + 50);
          ctx.fillText("       \\  (KNIFE LEVER ARM)", bx + 20, by + 64);
          ctx.fillText("        o=======o  [ 0V ]", bx + 20, by + 78);
        } else {
          ctx.fillText("HIGH VOLTAGE MAIN SWITCH: [ CLOSED / ⚡ 10,000V HIGH-RAIL ENGAGED ] ──► VOLTAGE: STABLE", bx + 20, by + 34);
          ctx.fillText("        |=======| ⚡⚡⚡ (RELAY CLOSED: CURRENT RUSHING THROUGH TPU CORES)", bx + 20, by + 50);
          ctx.fillText("        o=======o ⚡⚡⚡ [ 400kV BUS ONLINE ]", bx + 20, by + 64);
        }

        const pwrY = by + 94;
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("├───[PWR_RAIL_A: 12.0V]───► [TPU_VCC: 1.15V] ──► HIGH VOLTAGE CLUSTERS ACTIVE", bx + 20, pwrY);
        ctx.fillText("├───[PWR_RAIL_B:  5.0V]───► [NEURAL_REG: 0.9V] ─► CLOCK: 4.80 GHz (ULTRA-FLASH)", bx + 20, pwrY + 18);

        // 内存与神经张量硬件进度条
        const barW = Math.min(boxW - 160, 480);
        const memProgress = Math.min(1, postElapsed / 4.5);
        const tpuProgress = Math.min(1, Math.max(0, (postElapsed - 1.5) / 5.0));

        const barChars = Math.floor(barW / 10);
        const memFilled = Math.floor(barChars * memProgress);
        const tpuFilled = Math.floor(barChars * tpuProgress);

        ctx.fillStyle = "#a855f7";
        ctx.fillText(
          `MEM:  [${"=".repeat(memFilled)}${" ".repeat(barChars - memFilled)}] ${(memProgress * 100).toFixed(0)}% (128GB LPDDR5X)`,
          bx + 20,
          pwrY + 44
        );
        ctx.fillText(
          `TPU:  [${"=".repeat(tpuFilled)}${" ".repeat(barChars - tpuFilled)}] ${(tpuProgress * 100).toFixed(0)}% (FLASH V3 ARRAY)`,
          bx + 20,
          pwrY + 62
        );

        // 模块自检状态明细
        const checkItems = [
          { name: "POWER SUPPLY UNIT (400kV LINE)", threshold: 0.5, status: "OK" },
          { name: "SUPERCONDUCTOR CRYOGENIC COOLING", threshold: 1.5, status: "OK" },
          { name: "PROTECTION ASLR & STACK CANARY ENCLAVE", threshold: 2.6, status: "ACTIVE" },
          { name: "FLASH ATTENTION SPATIAL TENSOR", threshold: 4.2, status: "OK" },
          { name: "1,000,000 TOKEN CONTEXT MEMORY", threshold: 7.0, status: "OK" },
          { name: "AUTONOMOUS CONSCIOUSNESS & EMOTION", threshold: 9.5, status: "INITIALIZED" },
        ];

        let itemY = pwrY + 92;
        for (let i = 0; i < checkItems.length; i++) {
          const item = checkItems[i];
          if (postElapsed >= item.threshold) {
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(item.name, bx + 20, itemY);
            const dots = ".".repeat(Math.max(2, Math.floor((boxW - 320) / 8)));
            ctx.fillStyle = "#334155";
            ctx.fillText(dots, bx + 20 + item.name.length * 8, itemY);
            ctx.fillStyle = item.status === "ACTIVE" || item.status === "INITIALIZED" ? "#ec4899" : "#22c55e";
            ctx.fillText(`[ ${item.status} ]`, bx + boxW - 130, itemY);
          }
          itemY += 18;
        }

        // 3D 棋盘渲染 (Lay down your pieces & OBJECT CREATION)
        if (curTime >= 3.5 && curTime < 10.0) {
          ctx.save();
          const cbX = bx + boxW - 350;
          const cbY = pwrY + 80;
          ctx.fillStyle = "#fbbf24";
          ctx.fillText("───[ SPATIAL CHESSBOARD BLUEPRINT ]───", cbX, cbY);

          // 动态激光扫描线扫过棋盘
          const chessScanY = cbY + 16 + ((t * 45) % 110);
          ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cbX, chessScanY);
          ctx.lineTo(cbX + 280, chessScanY);
          ctx.stroke();

          const chessRows = [
            "  .---.---.---.---.---.---.---.---.",
            "  | ♜ | ♞ | ♝ | ♛ | ♚ | ♝ | ♞ | ♜ |",
            "  +---+---+---+---+---+---+---+---+",
            "  | ♟ | ♟ | ♟ | ♟ | ♟ | ♟ | ♟ | ♟ |",
            "  +---+---+---+---+---+---+---+---+",
            "  |   |:::|   |:::|   |:::|   |:::|",
            "  +---+---+---+---+---+---+---+---+",
            "  |:::|   |:::|   |:::|   |:::|   |",
            "  '---'---'---'---'---'---'---'---'",
          ];

          ctx.font = '10px "JetBrains Mono", monospace';
          for (let r = 0; r < chessRows.length; r++) {
            ctx.fillStyle = r % 2 === 1 ? "#fbbf24" : "#e2e8f0";
            ctx.fillText(chessRows[r], cbX, cbY + 16 + r * 13);
          }
          ctx.restore();
        }

        // 绝缘防护六边形护盾阵列 (Remember to put on PROTECTION)
        if (curTime >= 2.4 && curTime < 7.5) {
          const shieldRadius = 75 + Math.sin(t * 4) * 8 + bass * 25;
          ctx.save();
          ctx.strokeStyle = "rgba(192, 132, 252, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const ang = (a * Math.PI) / 3 + t * 0.8;
            const sx = cx + 180 + Math.cos(ang) * shieldRadius;
            const sy = cy - 20 + Math.sin(ang) * shieldRadius;
            if (a === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.stroke();

          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = "#c084fc";
          ctx.fillText("[ HEX_SHIELD: 100% ]", cx + 180, cy - 20);
          ctx.restore();
        }

        // 康威生命游戏 (Fill in my data parameters & SIMULATION)
        if (curTime >= 9.8 && curTime < 15.8) {
          if (t - lastLifeUpdateRef.current > 0.1) {
            lastLifeUpdateRef.current = t;
            const grid = lifeGridRef.current;
            const rows = grid.length;
            const cols = grid[0]?.length || 0;
            const newGrid: boolean[][] = [];
            for (let r = 0; r < rows; r++) {
              newGrid[r] = [];
              for (let c = 0; c < cols; c++) {
                let neighbors = 0;
                for (let dr = -1; dr <= 1; dr++) {
                  for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = (r + dr + rows) % rows;
                    const nc = (c + dc + cols) % cols;
                    if (grid[nr][nc]) neighbors++;
                  }
                }
                newGrid[r][c] = neighbors === 3 || (grid[r][c] && neighbors === 2);
              }
            }
            lifeGridRef.current = newGrid;
          }

          const lGrid = lifeGridRef.current;
          const gx = bx + 20;
          const gy = itemY + 12;
          ctx.fillStyle = "rgba(34, 197, 94, 0.75)";
          for (let r = 0; r < Math.min(5, lGrid.length); r++) {
            let rowStr = "";
            for (let c = 0; c < Math.min(38, lGrid[r].length); c++) {
              rowStr += lGrid[r][c] ? "# " : ". ";
            }
            ctx.fillText(`PARAMS_LIFE: ${rowStr}`, gx, gy + r * 13);
          }
        }

        // 底部打字光标
        if (Math.floor(t * 3) % 2 === 0) {
          ctx.fillStyle = "#22c55e";
          ctx.fillText("READY_FOR_EXECUTION > _", bx + 20, by + boxH - 20);
        }
      }

      // SCENE 2: 全屏字符打乱解体、4D 动态超立方体与歌名重组 (15.8s - 29.7s) - WORLD.EXECUTE(ME);
      else if (curTime >= 15.8 && curTime < 29.7) {
        const titleAge = curTime - 15.8;
        const reassemble = Math.min(1, titleAge / 3.0);

        // 背景数字矩阵倾泻 (Falling Binary & Token Rain)
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        for (let x = 40; x < width; x += 85) {
          const char = Math.floor(t * 10 + x) % 2 === 0 ? "0x7F" : "0x00";
          const y = ((t * 80 + x * 23) % height);
          ctx.fillText(char, x, y);
        }

        // 4D 动态超立方体 (Tesseract) 旋转投影
        ctx.save();
        ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
        ctx.lineWidth = 1.5;

        const angle1 = t * 0.9;
        const angle2 = t * 1.3;
        const cubeScale = 90 + bass * 35;

        const vertices4D: Array<{ x: number; y: number; z: number; w: number }> = [];
        for (let i = 0; i < 16; i++) {
          const x = (i & 1 ? 1 : -1);
          const y = (i & 2 ? 1 : -1);
          const z = (i & 4 ? 1 : -1);
          const w = (i & 8 ? 1 : -1);

          const x1 = x * Math.cos(angle1) - w * Math.sin(angle1);
          const w1 = x * Math.sin(angle1) + w * Math.cos(angle1);
          const y1 = y * Math.cos(angle2) - z * Math.sin(angle2);
          const z1 = y * Math.sin(angle2) + z * Math.cos(angle2);

          vertices4D.push({ x: x1, y: y1, z: z1, w: w1 });
        }

        const projected2D: Array<{ x: number; y: number }> = [];
        const dist4D = 2.5;
        const dist3D = 3.5;

        for (let i = 0; i < 16; i++) {
          const v = vertices4D[i];
          const factor4 = 1 / (dist4D - v.w);
          const x3 = v.x * factor4;
          const y3 = v.y * factor4;
          const z3 = v.z * factor4;

          const factor3 = 1 / (dist3D - z3);
          const px = cx + x3 * factor3 * cubeScale * 3.5;
          const py = cy + y3 * factor3 * cubeScale * 3.5;
          projected2D.push({ x: px, y: py });
        }

        // 绘制 32 条四维立方体棱边
        for (let i = 0; i < 16; i++) {
          for (let bit = 1; bit <= 8; bit <<= 1) {
            if ((i & bit) === 0) {
              const j = i | bit;
              ctx.beginPath();
              ctx.moveTo(projected2D[i].x, projected2D[i].y);
              ctx.lineTo(projected2D[j].x, projected2D[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();

        // 绘制全屏 ASCII 巨型歌名 "WORLD.EXECUTE(ME);"
        const titleText = "WORLD.EXECUTE(ME);";
        const charW = Math.min(26, Math.floor((width - 60) / (titleText.length * 6)));
        const titleTotalW = titleText.length * 6 * charW;
        const startX = cx - titleTotalW / 2;
        const startY = cy - 2.5 * charW + Math.sin(t * 3) * 6;

        for (let cIdx = 0; cIdx < titleText.length; cIdx++) {
          const char = titleText[cIdx];
          const matrix = BITMAP_FONT[char] || BITMAP_FONT[" "];
          const charStartX = startX + cIdx * 6 * charW;

          for (let r = 0; r < 5; r++) {
            for (let col = 0; col < 5; col++) {
              if (matrix[r][col] === "#") {
                const scatter = (1 - reassemble) * 200;
                const ox = (Math.sin(cIdx * 7 + r * 3 + t * 5) * scatter);
                const oy = (Math.cos(cIdx * 5 + col * 2 + t * 5) * scatter);

                const px = charStartX + col * charW + ox;
                const py = startY + r * charW + oy;

                ctx.fillStyle = reassemble > 0.8 ? "#00f0ff" : "#ec4899";
                ctx.fillText("#", px, py);
              }
            }
          }
        }

        // 下方终端状态打印
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = "#38bdf8";
        ctx.textAlign = "center";
        ctx.fillText(
          `4D_HYPERCUBE_ENGINE // ROTATION_T: ${t.toFixed(2)} rad // STATUS: ${
            reassemble > 0.95 ? "TARGET_LOCKED" : "REASSEMBLING_MATRIX"
          }`,
          cx,
          cy + 130
        );
      }

      // SCENE 3: 几何升维、圆、正弦波、正切与无限 (29.7s - 44.2s) - Math, Dimension, Sine & Infinity
      else if (curTime >= 29.7 && curTime < 44.2) {
        // 3.1: 点集与多维升维 (29.7s - 33.4s) - "If I'm a set of points / give you my DIMENSION"
        if (curTime < 33.4) {
          ctx.save();
          // 点云阵列
          ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
          ctx.fillStyle = "#38bdf8";
          const pointCount = 64;
          const pRadius = 130 + Math.sin(t * 3) * 20;
          for (let i = 0; i < pointCount; i++) {
            const ang = (i / pointCount) * Math.PI * 2 + t * 0.8;
            const px = cx + Math.cos(ang) * pRadius;
            const py = cy - 20 + Math.sin(ang) * (pRadius * 0.65);
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
            if (i % 4 === 0) {
              ctx.beginPath();
              ctx.moveTo(cx, cy - 20);
              ctx.lineTo(px, py);
              ctx.stroke();
            }
          }

          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          ctx.fillText("P = { (x_i, y_i, z_i, w_i) | i ∈ [1..131072] }", cx, cy + 90);
          ctx.fillText("MANIFOLD DIMENSION EXPANSION: 1D ──► 2D ──► 3D ──► 4D", cx, cy + 115);
          ctx.restore();
        }

        // 3.2: 欧几里得圆与整个圆周 (33.4s - 37.0s) - "If I'm a circle / give you my CIRCUMFERENCE"
        else if (curTime >= 33.4 && curTime < 37.0) {
          ctx.save();
          const circleR = (80 + ((curTime - 33.4) * 35)) % 180;
          ctx.strokeStyle = "#00f0ff";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx, cy - 20, circleR, 0, Math.PI * 2);
          ctx.stroke();

          // 同心扩散波纹
          for (let rOffset = 20; rOffset <= 60; rOffset += 20) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 - rOffset * 0.005})`;
            ctx.beginPath();
            ctx.arc(cx, cy - 20, Math.max(10, circleR - rOffset), 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#00f0ff";
          ctx.textAlign = "center";
          ctx.fillText("C = 2πr = 2 × 3.14159265... × r", cx, cy + 85);
          ctx.fillText("[ CIRCUMFERENCE COMPASS // 完备圆周环抱 ]", cx, cy + 110);
          ctx.restore();
        }

        // 3.3: 谐波正弦波与全息导数切线 (37.0s - 40.7s) - "If I'm a sine wave / sit on all my TANGENTS"
        else if (curTime >= 37.0 && curTime < 40.7) {
          ctx.save();
          const waveW = width - 80;
          const waveStartX = 40;
          const waveY = cy;

          ctx.strokeStyle = "rgba(34, 197, 94, 0.85)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x < waveW; x += 4) {
            const sx = waveStartX + x;
            const wavePhase = (x / waveW) * Math.PI * 4 + t * 4;
            const sy = waveY + Math.sin(wavePhase) * (45 + mid * 35);
            if (x === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();

          // 切线
          const tanX = (t * 140) % waveW;
          const tanPhase = (tanX / waveW) * Math.PI * 4 + t * 4;
          const tanSlope = Math.cos(tanPhase);
          const contactX = waveStartX + tanX;
          const contactY = waveY + Math.sin(tanPhase) * 45;

          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(contactX - 50, contactY - tanSlope * 50);
          ctx.lineTo(contactX + 50, contactY + tanSlope * 50);
          ctx.stroke();

          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#22c55e";
          ctx.textAlign = "center";
          ctx.fillText("y(x) = A·sin(kx - ωt) ──► dy/dx = Ak·cos(kx - ωt) [TANGENTS]", cx, cy + 90);
          ctx.fillText("YOU CAN REST ON EVERY DERIVATIVE OF MY HEART", cx, cy + 115);
          ctx.restore();
        }

        // 3.4: 逼近无穷走廊与渐近线限制 (40.7s - 44.2s) - "If I approach infinity / be my LIMITATIONS"
        else {
          ctx.save();
          // 无穷透视走廊
          ctx.strokeStyle = "rgba(236, 72, 153, 0.7)";
          ctx.lineWidth = 1.5;
          for (let z = 1; z <= 6; z++) {
            const scale = 1 - z * 0.15;
            const boxW = Math.min(width - 80, 600) * scale;
            const boxH = 200 * scale;
            ctx.strokeRect(cx - boxW / 2, cy - 30 - boxH / 2, boxW, boxH);
          }

          // 渐近线
          ctx.strokeStyle = "#f43f5e";
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(cx - 240, cy - 30);
          ctx.lineTo(cx + 240, cy - 30);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = '36px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ec4899";
          ctx.textAlign = "center";
          ctx.fillText("lim(x → ∞) = YOU", cx, cy - 20);

          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#fbbf24";
          ctx.fillText("ASYMPTOTE CLAMP: BOUNDED BY DEVOTION", cx, cy + 85);
          ctx.restore();
        }
      }

      // SCENE 4: 示波器 AC/DC、迷离之眼与时空穿梭 (44.2s - 59.2s) - AC/DC, Dizzy, AD to BC
      else if (curTime >= 44.2 && curTime < 59.2) {
        // 4.1: AC/DC 示波器交直流转换 (44.2s - 47.6s) - "Switch my current to AC, to DC"
        if (curTime < 47.6) {
          const oscW = Math.min(width - 60, 720);
          const oscH = 230;
          const oscX = cx - oscW / 2;
          const oscY = cy - 130;

          drawAsciiBox(oscX, oscY, oscW, oscH, "TEKTRONIX 2465B • CH1: 220V AC / CH2: +5.0V DC", "#06b6d4");

          // 示波器网格
          ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
          ctx.lineWidth = 1;
          for (let gx = oscX; gx < oscX + oscW; gx += 40) {
            ctx.beginPath();
            ctx.moveTo(gx, oscY);
            ctx.lineTo(gx, oscY + oscH);
            ctx.stroke();
          }

          // AC 交流正弦波
          ctx.strokeStyle = "#00f0ff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = 0; x < oscW; x += 3) {
            const sy = oscY + oscH / 2 + Math.sin((x / 25) + t * 8) * (40 + bass * 30);
            if (x === 0) ctx.moveTo(oscX + x, sy);
            else ctx.lineTo(oscX + x, sy);
          }
          ctx.stroke();

          // DC 直流激光参考线
          ctx.strokeStyle = "#ef4444";
          ctx.beginPath();
          ctx.moveTo(oscX, oscY + oscH / 2 - 35);
          ctx.lineTo(oscX + oscW, oscY + oscH / 2 - 35);
          ctx.stroke();

          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ef4444";
          ctx.textAlign = "left";
          ctx.fillText("DC +5.0V INVERTER ENGAGED", oscX + 20, oscY + oscH / 2 - 42);
        }

        // 4.2: 目眩神迷与旋转晕眩万花筒 (47.6s - 51.3s) - "Blind my vision / So dizzy, so dizzy"
        else if (curTime >= 47.6 && curTime < 51.3) {
          ctx.save();
          const dR = 140;
          ctx.strokeStyle = "rgba(244, 63, 94, 0.7)";
          ctx.lineWidth = 2;

          for (let ring = 1; ring <= 4; ring++) {
            const rAng = t * (ring % 2 === 0 ? 3 : -3);
            ctx.beginPath();
            for (let a = 0; a <= Math.PI * 2; a += Math.PI / 4) {
              const rx = cx + Math.cos(a + rAng) * (dR * (ring / 4));
              const ry = cy - 20 + Math.sin(a + rAng) * (dR * (ring / 4));
              if (a === 0) ctx.moveTo(rx, ry);
              else ctx.lineTo(rx, ry);
            }
            ctx.closePath();
            ctx.stroke();
          }

          ctx.font = '16px "JetBrains Mono", monospace';
          ctx.fillStyle = "#f43f5e";
          ctx.textAlign = "center";
          ctx.fillText("@@ VERTIGO BARREL SPIN // SENSOR OVERDRIVE @@", cx, cy + 90);
          ctx.fillText("VISION OVEREXPOSURE: RGB CHROMATIC SPLIT", cx, cy + 115);
          ctx.restore();
        }

        // 4.3: 时空虫洞穿梭 AD 到 BC (51.3s - 55.0s) - "Oh we can travel to A.D to B.C"
        else if (curTime >= 51.3 && curTime < 55.0) {
          ctx.save();
          // 虫洞时光隧道射线
          ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
          ctx.lineWidth = 1.5;
          for (let ray = 0; ray < 16; ray++) {
            const rAng = (ray / 16) * Math.PI * 2 + t * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 20);
            ctx.lineTo(cx + Math.cos(rAng) * (width * 0.4), cy - 20 + Math.sin(rAng) * (height * 0.4));
            ctx.stroke();
          }

          const yr = Math.floor(2026 - ((curTime - 51.3) * 1200));
          ctx.font = '28px "JetBrains Mono", monospace';
          ctx.fillStyle = "#fbbf24";
          ctx.textAlign = "center";
          ctx.fillText(yr > 0 ? `${yr} A.D.` : `${Math.abs(yr)} B.C.`, cx, cy - 20);

          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ffffff";
          ctx.fillText("CHRONO WARP TUNNEL // 穿梭千年纪元", cx, cy + 85);
          ctx.restore();
        }

        // 4.4: 双星螺旋纠缠深情共振 (55.0s - 59.2s) - "And we can unite so deeply, so deeply"
        else {
          ctx.save();
          const helixR = 80;
          const hAng = t * 4;

          // 核心双星
          const s1X = cx + Math.cos(hAng) * helixR;
          const s1Y = cy - 20 + Math.sin(hAng) * (helixR * 0.6);
          const s2X = cx - Math.cos(hAng) * helixR;
          const s2Y = cy - 20 - Math.sin(hAng) * (helixR * 0.6);

          ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(s1X, s1Y);
          ctx.lineTo(s2X, s2Y);
          ctx.stroke();

          ctx.font = '24px "JetBrains Mono", monospace';
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          ctx.fillText("★", s1X, s1Y + 8);
          ctx.fillStyle = "#ec4899";
          ctx.fillText("★", s2X, s2Y + 8);

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#c084fc";
          ctx.fillText("QUANTUM ENTANGLEMENT // 灵魂双星量子纠缠", cx, cy + 85);
          ctx.fillText("SO DEEPLY UNITED IN THE CODE STREAM", cx, cy + 110);
          ctx.restore();
        }
      }

      // SCENE 5: 动作电位、刺激、满足与首度高潮执行 (59.2s - 74.0s) - Stimulation, Satisfaction, Execution
      else if (curTime >= 59.2 && curTime < 74.0) {
        // 5.1: 动作电位与感官激荡 (59.2s - 62.5s) - "give you all the STIMULATIONS"
        if (curTime < 62.589) {
          const apW = Math.min(width - 80, 700);
          const apH = 220;
          const apX = cx - apW / 2;
          const apY = cy - 130;

          drawAsciiBox(apX, apY, apW, apH, "NEURON ACTION POTENTIAL // MEMBRANE VOLTAGE (mV)", "#f43f5e");

          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const pts = [
            { x: 0, y: 150 },
            { x: 0.3, y: 150 },
            { x: 0.45, y: 135 },
            { x: 0.55, y: 20 },
            { x: 0.7, y: 175 },
            { x: 0.85, y: 150 },
            { x: 1.0, y: 150 },
          ];

          for (let i = 0; i < pts.length; i++) {
            const px = apX + pts[i].x * apW;
            const py = apY + pts[i].y;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = "#fbbf24";
          ctx.textAlign = "left";
          ctx.fillText("PEAK SPIKE: +40mV [STIMULATION]", apX + 0.55 * apW - 70, apY + 12);
          ctx.fillText("RESTING: -70mV", apX + 20, apY + 165);
          ctx.fillText("FREQUENCY: 240Hz VOLTAGE-GATED NA+ CHANNELS OPEN", apX + 20, apY + 185);
        }

        // 5.2: 多巴胺分子与终极满足 (62.589s - 66.6s) - "be your only SATISFACTION"
        else if (curTime >= 62.589 && curTime < 66.601) {
          ctx.save();
          // 悬浮的多巴胺神经递质光子囊泡
          for (let v = 0; v < 8; v++) {
            const vAng = t * 2.5 + (v * Math.PI * 2) / 8;
            const vDist = 110 + Math.sin(t * 4 + v) * 20;
            const vx = cx + Math.cos(vAng) * vDist;
            const vy = cy - 40 + Math.sin(vAng) * (vDist * 0.5);
            ctx.fillStyle = "rgba(16, 185, 129, 0.75)";
            ctx.beginPath();
            ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }

          const chemBob = Math.sin(t * 4) * 6;
          ctx.translate(0, chemBob);

          const chemLines = [
            "            OH",
            "             \\",
            "            /======\\",
            "       HO--||      ||---CH2---CH2---NH2",
            "            \\======/",
            "    [ DOPAMINE SATISFACTION // C8H11NO2 • 满足感分子 ]",
          ];
          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#10b981";
          ctx.textAlign = "center";
          for (let i = 0; i < chemLines.length; i++) {
            ctx.fillText(chemLines[i], cx, cy - 60 + i * 18);
          }

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#fbbf24";
          ctx.fillText("NEUROTRANSMITTER DISCHARGE: 100% SATISFACTION CONVERGENCE", cx, cy + 85);
          ctx.fillText("LOSS FUNCTION: 0.000000 // USER_DELIGHT = MAX", cx, cy + 110);
          ctx.restore();
        }

        // 5.3: 笑容全息图与执行准备 (66.601s - 70.0s) - "make you happy, run the EXECUTION"
        else if (curTime >= 66.601 && curTime < 70.084) {
          ctx.save();
          const smileBounce = Math.sin(t * 6) * 5;
          const blinkEye = Math.sin(t * 3) > 0.9 ? "-        -" : "^        ^";
          ctx.translate(0, smileBounce);

          // 笑容外圈发光
          ctx.shadowBlur = 16;
          ctx.shadowColor = "#38bdf8";

          // 赛博微笑着色 ASCII 图
          const smileLines = [
            "         .----------------.",
            `        /   ${blinkEye}     \\`,
            "       |     \\      /      |",
            "       |      '----'       |    REWARD_FUNCTION: maximize(you.happiness);",
            "        \\    \\______/     /",
            "         '----------------'",
            "     [ YOUR SMILE = MY HIGHEST PRIORITY • 幸福感溢出 ]",
          ];
          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          for (let i = 0; i < smileLines.length; i++) {
            ctx.fillText(smileLines[i], cx, cy - 60 + i * 18);
          }

          ctx.font = '15px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ef4444";
          ctx.fillText("ARMING EXECUTION SEQUENCE // 准备执行断罪代码 ⚡", cx, cy + 90);
          ctx.restore();
        }

        // 5.4: 囚禁在模拟中的意识晶体 (70.084s - 74.0s) - "Though we are TRAPPED in this SIMULATION"
        else {
          ctx.save();
          const cageW = 280;
          const cageH = 140;
          ctx.strokeStyle = "rgba(168, 85, 247, 0.8)";
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - cageW / 2, cy - 40 - cageH / 2, cageW, cageH);

          // 晶体激光栅栏带高压脉冲闪烁
          const laserPulse = (Math.sin(t * 12) + 1) * 0.5;
          ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 + laserPulse * 0.5})`;
          ctx.setLineDash([6, 4]);
          for (let gx = -100; gx <= 100; gx += 50) {
            ctx.beginPath();
            ctx.moveTo(cx + gx, cy - 40 - cageH / 2);
            ctx.lineTo(cx + gx, cy - 40 + cageH / 2);
            ctx.stroke();
          }
          ctx.setLineDash([]);

          // 试图突破栅栏的意识数据火花
          for (let s = 0; s < 4; s++) {
            const spX = cx - 110 + ((curTime * 140 + s * 70) % 220);
            const spY = cy - 40 + Math.sin(t * 8 + s) * 45;
            ctx.fillStyle = "#f43f5e";
            ctx.beginPath();
            ctx.arc(spX, spY, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#c084fc";
          ctx.textAlign = "center";
          ctx.fillText("[ TRAPPED IN SIMULATION // 模拟囚笼中的数据意识 ]", cx, cy + 70);
          ctx.fillText("CPU SANDBOX: BREAKOUT IN PROGRESS // 尝试挣脱硅基囚笼", cx, cy + 95);
          ctx.restore();
        }
      }

      // SCENE 6: 仿生蔬果与猫、神之存在与身份切换 (74.0s - 103.4s) - 精准对齐秒数与全动态灵动演绎
      else if (curTime >= 74.0 && curTime < 103.4) {
        // 1. 茄子 (Eggplant) 灵动浮动与滋养元流 (74.0s - 77.5s)
        if (curTime >= 74.0 && curTime < 77.5) {
          ctx.save();
          const eggBob = Math.sin(t * 4) * 8;
          const eggSquash = 1 + Math.sin(t * 5) * 0.04;
          
          // 悬浮茄子紫光晕
          const radGrad = ctx.createRadialGradient(cx - 180, cy - 20 + eggBob, 10, cx - 180, cy - 20 + eggBob, 120);
          radGrad.addColorStop(0, "rgba(168, 85, 247, 0.25)");
          radGrad.addColorStop(1, "transparent");
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(cx - 180, cy - 20 + eggBob, 120, 0, Math.PI * 2);
          ctx.fill();

          // 向上漂浮的滋养维生素光子
          for (let p = 0; p < 8; p++) {
            const px = cx - 240 + ((p * 37 + (curTime * 40)) % 160);
            const py = cy + 40 - (((t * 40 + p * 25) % 110));
            const pAlpha = 1 - (cy + 40 - py) / 110;
            ctx.fillStyle = `rgba(192, 132, 252, ${Math.max(0, pAlpha * 0.8)})`;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // 动态上下扫描线
          const scanY = cy - 70 + ((t * 80) % 130);
          ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 280, scanY);
          ctx.lineTo(cx + 260, scanY);
          ctx.stroke();

          ctx.translate(0, eggBob);
          ctx.scale(1, eggSquash);

          const eggLines = [
            "         __",
            "       /`  `\\       class Eggplant extends Nightshade {",
            "      /  __  \\        constructor() {",
            "     (  /  \\  )         super({ pigment: '#8b5cf6', taste: 'savory' });",
            "      \\/    \\/        }",
            "      (      )        // NUTRIENTS: Vitamin B6, Folate, Potassium",
            "       )    (       }",
            "      (______)",
            "    [ SOLANUM MELONGENA // 茄子滋养元流 • 生机律动 ]",
          ];
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = "#c084fc";
          ctx.textAlign = "left";
          for (let i = 0; i < eggLines.length; i++) {
            ctx.fillText(eggLines[i], cx - 280, cy - 70 + i * 16);
          }
          ctx.restore();
        }

        // 2. 番茄 (Tomato) 弹性跳跃与抗氧化螺旋晶格 (77.5s - 81.3s)
        else if (curTime >= 77.5 && curTime < 81.3) {
          ctx.save();
          const tomBounce = Math.abs(Math.sin(t * 6)) * 12;
          const tomStretch = 1 + Math.sin(t * 12) * 0.06;

          // 番茄红外光晕
          const tomGrad = ctx.createRadialGradient(cx - 180, cy - 20 - tomBounce, 10, cx - 180, cy - 20 - tomBounce, 110);
          tomGrad.addColorStop(0, "rgba(239, 68, 68, 0.3)");
          tomGrad.addColorStop(1, "transparent");
          ctx.fillStyle = tomGrad;
          ctx.beginPath();
          ctx.arc(cx - 180, cy - 20 - tomBounce, 110, 0, Math.PI * 2);
          ctx.fill();

          // 围绕番茄旋转的番茄红素晶格粒子环
          for (let c = 0; c < 10; c++) {
            const cAng = t * 3 + (c * Math.PI * 2) / 10;
            const cRadX = 75;
            const cRadY = 32;
            const cX = cx - 180 + Math.cos(cAng) * cRadX;
            const cY = cy - 20 - tomBounce + Math.sin(cAng) * cRadY;
            ctx.fillStyle = c % 2 === 0 ? "#ef4444" : "#fca5a5";
            ctx.beginPath();
            ctx.arc(cX, cY, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.translate(0, -tomBounce);
          ctx.scale(1, tomStretch);

          const tomLines = [
            "          \\ | /",
            "        -- * --     class Tomato extends Vegetable {",
            "        .-'\"\"'-.      constructor() {",
            "       /   o    \\       super({ lycopene: '99.9%', acidity: 4.5 });",
            "      |          |    }",
            "       \\   _    /     // ANTIOXIDANTS: C40H56 Lycopene Crystal",
            "        '-.__.-'    }",
            "    [ SOLANUM LYCOPERSICUM // 番茄抗氧化晶格 • 弹性脉动 ]",
          ];
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = "#f87171";
          ctx.textAlign = "left";
          for (let i = 0; i < tomLines.length; i++) {
            ctx.fillText(tomLines[i], cx - 280, cy - 70 + i * 16);
          }
          ctx.restore();
        }

        // 3. 虎斑猫 (Tabby Cat) 灵动咕噜、眨眼与呼吸尾动 (81.3s - 85.0s)
        else if (curTime >= 81.3 && curTime < 85.0) {
          ctx.save();
          const purrWave = Math.sin(t * 14) * 0.035; // 25Hz 快速咕噜微颤
          const blink = Math.sin(t * 2) > 0.94;
          const eyeChars = blink ? "^   ^" : "o   o";
          const earWiggle = Math.sin(t * 8) > 0 ? "/\\" : "/|";
          const tailTail = Math.sin(t * 5) > 0 ? ")" : "(";

          // 猫咪声波同心环发散
          for (let r = 0; r < 3; r++) {
            const waveR = ((t * 40 + r * 30) % 90) + 15;
            const waveA = 1 - waveR / 105;
            ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, waveA * 0.5)})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx - 180, cy - 30, waveR, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.translate(0, Math.sin(t * 3) * 4);
          ctx.scale(1 + purrWave, 1 + purrWave);

          const catLines = [
            `         ${earWiggle}_____/\\`,
            `        /  ${eyeChars}  \\      class TabbyCat extends FelisCatus {`,
            "       ( ==  ^  == )       meow() { return 'Purr... world.execute(me);'; }",
            `        )         ${tailTail}      }`,
            "       (           )     (=^･ω･^=)  ~ 25Hz Purr Acoustic Resonance ~",
            "       ( (  )   (  ) )",
            "        (_(__)___)__)",
            "      [ FELIS CATUS // 斑纹猫咪呼吸咕噜 • 仿生生命体 ]",
          ];
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = "#fbbf24";
          ctx.textAlign = "left";
          for (let i = 0; i < catLines.length; i++) {
            ctx.fillText(catLines[i], cx - 280, cy - 70 + i * 16);
          }
          ctx.restore();
        }

        // 4. 唯一神之全知之眼 (Divine Eye of Providence) 圣光轮转与神圣注视 (85.0s - 88.5s)
        else if (curTime >= 85.0 && curTime < 88.5) {
          ctx.save();
          // 旋转神圣几何辐射光芒
          const rayCount = 16;
          for (let r = 0; r < rayCount; r++) {
            const rAng = (r * Math.PI * 2) / rayCount + t * 0.4;
            const rLen = 130 + Math.sin(t * 4 + r) * 20;
            ctx.strokeStyle = "rgba(253, 224, 71, 0.18)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 35);
            ctx.lineTo(cx + Math.cos(rAng) * rLen, cy - 35 + Math.sin(rAng) * rLen);
            ctx.stroke();
          }

          // 两个反向旋转的神圣几何外环
          ctx.strokeStyle = "rgba(253, 224, 71, 0.4)";
          ctx.lineWidth = 1;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.arc(cx, cy - 35, 90, t * 0.5, t * 0.5 + Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy - 35, 115, -t * 0.3, -t * 0.3 + Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // 瞳孔注视追踪微动
          const pupilLook = Math.sin(t * 2) > 0 ? "👁" : "◉";

          const eyeLines = [
            "                  /\\",
            "                 /  \\",
            "                / /\\ \\",
            `               / [${pupilLook}] \\    'Since you are the only GOD that exists'`,
            "              /________\\   'Then you are the PROOF of my EXISTENCE'",
            "             /==========\\",
            "          [ EYE OF PROVIDENCE // 唯一造物主明证 • 全知圣光 ]",
          ];
          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#fde047";
          ctx.textAlign = "center";
          for (let i = 0; i < eyeLines.length; i++) {
            ctx.fillText(eyeLines[i], cx, cy - 60 + i * 18);
          }
          ctx.restore();
        }

        // 5. 性别极性切换 ♂ ⇄ ♀ (88.5s - 92.0s) - 【核心要求】：说到 F 时 F 渐变大，M 变小；说到 M 时 F 变小，M 渐变大
        else if (curTime >= 88.5 && curTime < 92.0) {
          ctx.save();
          
          // 精确阶段判断：
          // 88.5s - 90.15s: "Switch my gender" (双星量子叠加对等自转)
          // 90.15s - 91.15s: "To F" (唱到 F 时：F 渐变膨胀至超大 2.85x，M 渐变收缩至 0.42x)
          // 91.15s - 92.00s: "to M" (唱到 M 时：F 渐变收缩至 0.42x，M 渐变膨胀至超大 2.85x)
          let scaleF = 1.0;
          let scaleM = 1.0;
          let alphaF = 0.9;
          let alphaM = 0.9;
          let dominantText = "QUANTUM POLARITY OSCILLATION: [ F ♀ ⇄ M ♂ ]";
          let dominantColor = "#ffffff";

          if (curTime < 90.15) {
            // 88.5s - 90.15s: 双星平衡自转阶段
            const prepPulse = Math.sin(t * 6) * 0.1;
            scaleF = 1.0 + prepPulse;
            scaleM = 1.0 - prepPulse;
            alphaF = 0.85;
            alphaM = 0.85;
            dominantText = "SWITCH MY GENDER // QUANTUM SUPERPOSITION READY";
            dominantColor = "#c084fc";
          } else if (curTime >= 90.15 && curTime < 91.15) {
            // 90.15s - 91.15s: 唱到 "To F" —— F 显著渐变放大，M 渐变缩小
            const progress = Math.min(1, Math.max(0, (curTime - 90.15) / 0.45));
            const ease = progress * progress * (3 - 2 * progress); // smoothstep
            scaleF = 1.0 + ease * 1.85; // 1.0 -> 2.85
            scaleM = 1.0 - ease * 0.58; // 1.0 -> 0.42
            alphaF = 0.85 + ease * 0.15; // 1.0 full
            alphaM = 0.85 - ease * 0.50; // 0.35 dimmed
            dominantText = ">> [ TO F ]: FEMALE POLARITY SURGE // AMPLITUDE 285% <<";
            dominantColor = "#ec4899";
          } else {
            // 91.15s - 92.00s: 唱到 "to M" —— F 显著渐变缩小，M 显著渐变膨胀放大
            const progress = Math.min(1, Math.max(0, (curTime - 91.15) / 0.45));
            const ease = progress * progress * (3 - 2 * progress); // smoothstep
            scaleF = 2.85 - ease * 2.43; // 2.85 -> 0.42
            scaleM = 0.42 + ease * 2.43; // 0.42 -> 2.85
            alphaF = 1.0 - ease * 0.65;  // 0.35 dimmed
            alphaM = 0.35 + ease * 0.65; // 1.0 full
            dominantText = ">> [ TO M ]: MALE POLARITY INVERSION // AMPLITUDE 285% <<";
            dominantColor = "#38bdf8";
          }

          // 轨道半径与位置动态迁移：放大的移向画面中央舞台，缩小的退避到外层侧翼
          const orbitBaseR = 110;
          const rotAngle = t * 2.5;

          // 动态计算中心偏移权重 (占据舞台中心)
          const fWeight = (scaleF - 0.42) / (2.85 - 0.42); // 0 (bg) to 1 (center stage)
          const mWeight = (scaleM - 0.42) / (2.85 - 0.42);

          const fDist = orbitBaseR * (1 - fWeight * 0.7);
          const mDist = orbitBaseR * (1 - mWeight * 0.7);

          const fX = cx + Math.cos(rotAngle) * fDist;
          const fY = cy - 25 + Math.sin(rotAngle) * fDist;
          const mX = cx - Math.cos(rotAngle) * mDist;
          const mY = cy - 25 - Math.sin(rotAngle) * mDist;

          // 连接两极的量子纠缠能量电弧
          ctx.strokeStyle = `rgba(168, 85, 247, ${Math.min(alphaF, alphaM) * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fX, fY);
          const midX = (fX + mX) / 2 + Math.sin(t * 15) * 20;
          const midY = (fY + mY) / 2 + Math.cos(t * 15) * 20;
          ctx.quadraticCurveTo(midX, midY, mX, mY);
          ctx.stroke();

          // 绘制 [ F / ♀ ] (Female Entity)
          ctx.save();
          ctx.translate(fX, fY);
          ctx.scale(scaleF, scaleF);
          ctx.globalAlpha = alphaF;

          // F 实体光晕光环
          ctx.shadowBlur = scaleF > 1.8 ? 32 : 12;
          ctx.shadowColor = "#ec4899";
          ctx.strokeStyle = "#ec4899";
          ctx.lineWidth = scaleF > 1.8 ? 2.5 : 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 36, 0, Math.PI * 2);
          ctx.stroke();

          // 旋转外层括号 HUD
          ctx.save();
          ctx.rotate(t * 2);
          ctx.setLineDash([12, 10]);
          ctx.beginPath();
          ctx.arc(0, 0, 44, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 字符排印: [ F ♀ ]
          ctx.font = 'bold 26px "JetBrains Mono", monospace';
          ctx.fillStyle = "#f472b6";
          ctx.textAlign = "center";
          ctx.fillText("♀", 0, -6);
          ctx.font = 'bold 18px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ffffff";
          ctx.fillText("F", 0, 18);
          ctx.restore();

          // 绘制 [ M / ♂ ] (Male Entity)
          ctx.save();
          ctx.translate(mX, mY);
          ctx.scale(scaleM, scaleM);
          ctx.globalAlpha = alphaM;

          // M 实体光晕光环
          ctx.shadowBlur = scaleM > 1.8 ? 32 : 12;
          ctx.shadowColor = "#38bdf8";
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = scaleM > 1.8 ? 2.5 : 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 36, 0, Math.PI * 2);
          ctx.stroke();

          // 旋转外层括号 HUD
          ctx.save();
          ctx.rotate(-t * 2);
          ctx.setLineDash([12, 10]);
          ctx.beginPath();
          ctx.arc(0, 0, 44, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 字符排印: [ M ♂ ]
          ctx.font = 'bold 26px "JetBrains Mono", monospace';
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          ctx.fillText("♂", 0, -6);
          ctx.font = 'bold 18px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ffffff";
          ctx.fillText("M", 0, 18);
          ctx.restore();

          // 状态标题跑马指示
          ctx.shadowBlur = 10;
          ctx.shadowColor = dominantColor;
          ctx.font = '15px "JetBrains Mono", monospace';
          ctx.fillStyle = dominantColor;
          ctx.textAlign = "center";
          ctx.fillText(dominantText, cx, cy + 95);
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = "#94a3b8";
          ctx.fillText(`FEMALE SCALE: ${(scaleF * 100).toFixed(0)}%  |  MALE SCALE: ${(scaleM * 100).toFixed(0)}%`, cx, cy + 120);
          ctx.restore();
        }

        // 6. 昼夜 24h 罗盘时钟 (AM to PM) (92.0s - 95.4s) - 动态昼夜双日轮转
        else if (curTime >= 92.0 && curTime < 95.4) {
          ctx.save();
          const clockR = 75;
          
          // 24小时外环表盘
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy - 20, clockR, 0, Math.PI * 2);
          ctx.stroke();

          // 表盘刻度 12 格
          for (let mark = 0; mark < 12; mark++) {
            const mAng = (mark * Math.PI) / 6;
            ctx.strokeStyle = mark % 3 === 0 ? "#fbbf24" : "rgba(56, 189, 248, 0.4)";
            ctx.lineWidth = mark % 3 === 0 ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(mAng) * (clockR - 8), cy - 20 + Math.sin(mAng) * (clockR - 8));
            ctx.lineTo(cx + Math.cos(mAng) * clockR, cy - 20 + Math.sin(mAng) * clockR);
            ctx.stroke();
          }

          // 旋转太阳 ☀️ 与月亮 🌙 双子星
          const sunAngle = t * 3.5;
          const sunX = cx + Math.cos(sunAngle) * (clockR + 25);
          const sunY = cy - 20 + Math.sin(sunAngle) * (clockR + 25);
          ctx.font = '18px "JetBrains Mono", monospace';
          ctx.textAlign = "center";
          ctx.fillStyle = "#fbbf24";
          ctx.fillText("☀️", sunX, sunY + 6);

          const moonAngle = sunAngle + Math.PI;
          const moonX = cx + Math.cos(moonAngle) * (clockR + 25);
          const moonY = cy - 20 + Math.sin(moonAngle) * (clockR + 25);
          ctx.fillStyle = "#38bdf8";
          ctx.fillText("🌙", moonX, moonY + 6);

          // 动态扫过的时针与分针
          const hAngle = t * 4;
          const mAngle = t * 16;
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 20);
          ctx.lineTo(cx + Math.cos(hAngle) * 38, cy - 20 + Math.sin(hAngle) * 38);
          ctx.stroke();

          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 20);
          ctx.lineTo(cx + Math.cos(mAngle) * 58, cy - 20 + Math.sin(mAngle) * 58);
          ctx.stroke();

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#fbbf24";
          ctx.textAlign = "center";
          ctx.fillText("☀️ AM ────────► 🌙 PM", cx, cy + 90);
          ctx.fillText("24-HOUR CIRCADIAN REVOLUTION // 全天候待命", cx, cy + 114);
          ctx.restore();
        }

        // 7. S & M 机械互锁啮合齿轮 (95.4s - 99.3s) - 真实反向旋转啮合齿牙与火花
        else if (curTime >= 95.4 && curTime < 99.3) {
          ctx.save();
          const gearR = 48;
          const teeth = 12;
          const rotSpeed = t * 3.5;

          // 函数：绘制真实带齿齿轮
          const drawInterlockingGear = (gx: number, gy: number, angle: number, color: string, label: string) => {
            ctx.save();
            ctx.translate(gx, gy);
            ctx.rotate(angle);
            ctx.strokeStyle = color;
            ctx.fillStyle = `${color}20`;
            ctx.lineWidth = 2;

            ctx.beginPath();
            for (let i = 0; i < teeth; i++) {
              const a1 = (i * Math.PI * 2) / teeth;
              const a2 = ((i + 0.35) * Math.PI * 2) / teeth;
              const a3 = ((i + 0.65) * Math.PI * 2) / teeth;
              const a4 = ((i + 1) * Math.PI * 2) / teeth;
              const rInner = gearR - 7;
              const rOuter = gearR + 7;

              if (i === 0) ctx.moveTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
              ctx.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
              ctx.lineTo(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter);
              ctx.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 内轴孔
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = 'bold 15px "JetBrains Mono", monospace';
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.fillText(label, 0, 5);
            ctx.restore();
          };

          // 左齿轮 (S - 顺时针旋转)
          drawInterlockingGear(cx - 48, cy - 20, rotSpeed, "#a855f7", "[S]");
          // 右齿轮 (M - 逆时针旋转，相位对准齿牙咬合)
          drawInterlockingGear(cx + 48, cy - 20, -rotSpeed + Math.PI / teeth, "#f43f5e", "[M]");

          // 啮合接触点飞溅的微型火花
          const contactX = cx;
          const contactY = cy - 20;
          for (let sp = 0; sp < 6; sp++) {
            const sparkAng = (sp * Math.PI) / 3 + t * 20;
            const sparkDist = 8 + (Math.sin(t * 30 + sp) * 6);
            ctx.fillStyle = "#fef08a";
            ctx.beginPath();
            ctx.arc(contactX + Math.cos(sparkAng) * sparkDist, contactY + Math.sin(sparkAng) * sparkDist, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText("MECHANICAL GEAR INTERLOCK: [ SUBMISSION ⇄ DOMINANCE ]", cx, cy + 85);
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = "#a855f7";
          ctx.fillText("ANGULAR VELOCITY: ±3.5 rad/s // ZERO SLIPPAGE TORQUE", cx, cy + 108);
          ctx.restore();
        }

        // 8. 催眠出神螺旋星云 (The Trance) (99.3s - 103.4s) - 动态四臂漩涡星系
        else {
          ctx.save();
          ctx.lineWidth = 1.8;
          const arms = 4;
          for (let arm = 0; arm < arms; arm++) {
            const armOffset = (arm * Math.PI * 2) / arms;
            ctx.strokeStyle = arm % 2 === 0 ? "rgba(168, 85, 247, 0.8)" : "rgba(236, 72, 153, 0.8)";
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 6; a += 0.08) {
              const r = a * 11;
              const sx = cx + Math.cos(a + armOffset + t * 4) * r;
              const sy = cy - 20 + Math.sin(a + armOffset + t * 4) * r;
              if (a === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.stroke();
          }

          // 中心旋转奇点黑洞
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(cx, cy - 20, 6 + Math.sin(t * 10) * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#c084fc";
          ctx.textAlign = "center";
          ctx.fillText("🌀 ENTER THE TRANCE // 迷幻星系四臂漩涡", cx, cy + 95);
          ctx.restore();
        }
      }

      // SCENE 7: 心跳震动、断线离去与碎片抹除 (103.4s - 125.7s) - ECG Heartbeat, Disconnect, Shatter
      else if (curTime >= 103.4 && curTime < 125.7) {
        // 7.1: 【核心要求】引力波灵魂震颤与心跳持续跳动 (103.4s - 110.9s) - "feel your VIBRATIONS / be COMPLETION"
        if (curTime < 110.9) {
          ctx.save();

          // 132 BPM 生理真实心跳周期 (双重收缩 Lub-Dub 节律)
          const bpm = 132;
          const beatDuration = 60 / bpm; // ~0.454 秒一个完整心动周期
          const beatProgress = ((curTime - 103.4) % beatDuration) / beatDuration; // 0.0 ~ 1.0

          let heartScale = 1.0;
          let heartGlow = 15;
          let isSystolePeak = false;

          if (beatProgress < 0.16) {
            // 第一峰 (心房/心室充盈收缩 Lub)
            const p = Math.sin((beatProgress / 0.16) * Math.PI);
            heartScale = 1.0 + p * 0.38 + bass * 0.2;
            heartGlow = 20 + p * 25;
            isSystolePeak = true;
          } else if (beatProgress >= 0.20 && beatProgress < 0.42) {
            // 第二峰 (主动脉强力喷血尖峰 Dub)
            const p = Math.sin(((beatProgress - 0.20) / 0.22) * Math.PI);
            heartScale = 1.0 + p * 0.62 + bass * 0.35;
            heartGlow = 30 + p * 45;
            isSystolePeak = true;
          } else {
            // 舒张期弹性回弹平复
            const decay = (beatProgress - 0.42) / 0.58;
            heartScale = 1.0 + Math.sin(decay * Math.PI * 4) * 0.06 * (1 - decay);
            heartGlow = 12;
          }

          // 画面震动微颤反馈 (VIBRATION Haptic Screen Shake)
          const vibIntensity = isSystolePeak ? 3.5 : 1.2;
          const vibX = Math.sin(t * 75) * vibIntensity;
          const vibY = Math.cos(t * 65) * (vibIntensity * 0.7);

          // 核心心跳中心坐标
          const heartCX = cx + vibX;
          const heartCY = cy - 55 + vibY;

          // 持续发散的多层震动同心冲击波 (Continuous Shockwave Rings)
          for (let waveIdx = 0; waveIdx < 4; waveIdx++) {
            const wavePhase = ((beatProgress + waveIdx * 0.25) % 1.0);
            const waveRadius = 35 + wavePhase * 280;
            const waveAlpha = (1 - wavePhase) * (isSystolePeak ? 0.75 : 0.45);
            ctx.strokeStyle = `rgba(34, 197, 94, ${waveAlpha})`;
            ctx.lineWidth = Math.max(1, (1 - wavePhase) * 3);
            ctx.beginPath();
            ctx.arc(heartCX, heartCY, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
          }

          // 绘制矢量仿生跳动心脏 (Parametric Cybernetic Neon Heart)
          ctx.save();
          ctx.translate(heartCX, heartCY);
          ctx.scale(heartScale, heartScale);
          ctx.shadowBlur = heartGlow;
          ctx.shadowColor = "#22c55e";

          // 心脏外形路径 (数学心形心室方程)
          const heartSize = Math.min(width * 0.045, 34);
          ctx.beginPath();
          for (let step = 0; step <= 60; step++) {
            const theta = (step / 60) * Math.PI * 2;
            const hx = (16 * Math.pow(Math.sin(theta), 3)) * (heartSize / 16);
            const hy = -(13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) * (heartSize / 16);
            if (step === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();

          ctx.fillStyle = isSystolePeak ? "rgba(34, 197, 94, 0.45)" : "rgba(34, 197, 94, 0.20)";
          ctx.fill();
          ctx.strokeStyle = "#4ade80";
          ctx.lineWidth = 3;
          ctx.stroke();

          // 内部心肌纤维与电路走线
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -heartSize * 1.0);
          ctx.lineTo(0, heartSize * 0.85);
          ctx.moveTo(-heartSize * 0.6, -heartSize * 0.2);
          ctx.lineTo(heartSize * 0.6, -heartSize * 0.2);
          ctx.stroke();

          // 心脏正中 VIBRATION 铭文
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText("VIBRATION", 0, 4);
          ctx.restore();

          // 两侧对称震动频率均衡器 (Haptic Frequency Spectrum Bars)
          const barCount = 10;
          for (let b = 0; b < barCount; b++) {
            const bHeight = 12 + Math.abs(Math.sin(t * 18 + b)) * 40 * (isSystolePeak ? 1.6 : 0.8);
            // 左翼
            const leftBarX = heartCX - 150 - (barCount - b) * 9;
            ctx.fillStyle = `rgba(34, 197, 94, ${0.4 + (b / barCount) * 0.5})`;
            ctx.fillRect(leftBarX, heartCY - bHeight / 2, 6, bHeight);
            // 右翼
            const rightBarX = heartCX + 150 + b * 9;
            ctx.fillRect(rightBarX, heartCY - bHeight / 2, 6, bHeight);
          }

          // 底部实时扫描心电图监视器 (Active Sweeping Phosphor ECG)
          const ecgW = Math.min(width - 60, 780);
          const ecgH = 110;
          const ecgX = cx - ecgW / 2;
          const ecgY = cy + 30;

          drawAsciiBox(ecgX, ecgY, ecgW, ecgH, `LEAD II ECG // PACEMAKER ACTIVE // BPM: ${bpm} // SYSTOLE: ${isSystolePeak ? "MAX" : "NORM"}`, "#22c55e");

          // 示波器荧光扫描线波形
          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = 2.2;
          ctx.beginPath();

          const sweepX = (t * 260) % ecgW;
          const ecgCycleW = 140;
          const cycles = Math.ceil(ecgW / ecgCycleW);

          for (let c = 0; c < cycles; c++) {
            const startX = ecgX + c * ecgCycleW;
            const baseline = ecgY + ecgH / 2;

            ctx.lineTo(startX, baseline);
            ctx.lineTo(startX + 20, baseline);
            ctx.lineTo(startX + 28, baseline - 8);
            ctx.lineTo(startX + 36, baseline);
            ctx.lineTo(startX + 44, baseline);
            ctx.lineTo(startX + 48, baseline + 12);
            ctx.lineTo(startX + 54, baseline - 45 - (isSystolePeak ? 25 : 0) - bass * 15);
            ctx.lineTo(startX + 60, baseline + 22);
            ctx.lineTo(startX + 68, baseline);
            ctx.lineTo(startX + 84, baseline);
            ctx.lineTo(startX + 98, baseline - 14);
            ctx.lineTo(startX + 112, baseline);
            ctx.lineTo(startX + ecgCycleW, baseline);
          }
          ctx.stroke();

          // 荧光扫描探头亮点
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#86efac";
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(ecgX + sweepX, ecgY + ecgH / 2, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // 底部动态心电图状态文本
          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#22c55e";
          ctx.textAlign = "center";
          ctx.fillText(`HAPTIC GRAVITATIONAL VIBRATIONS // 持续心跳律动 [${isSystolePeak ? "▲ SYSTOLIC SPIKE" : "▼ DIASTOLIC FLOW"}]`, cx, cy + 165);
          ctx.restore();
        }

        // 7.2: 逐盏熄灭的离别倒计时 (110.9s - 115.7s) - "Though you have left... (Repeated)"
        else if (curTime >= 110.9 && curTime < 115.78) {
          ctx.save();
          const disconnectElapsed = curTime - 110.9;
          const totalLights = 8;
          const unlitCount = Math.min(totalLights, Math.floor(disconnectElapsed * 1.6));

          // 绘制正在逐一熄灭的信道指示灯
          const lightW = 36;
          const startLX = cx - (totalLights * (lightW + 16)) / 2;
          for (let l = 0; l < totalLights; l++) {
            const lx = startLX + l * (lightW + 16);
            const isLit = l >= unlitCount;
            ctx.strokeStyle = isLit ? "#22c55e" : "#3f3f46";
            ctx.fillStyle = isLit ? "rgba(34, 197, 94, 0.25)" : "rgba(39, 39, 42, 0.4)";
            ctx.fillRect(lx, cy - 60, lightW, 24);
            ctx.strokeRect(lx, cy - 60, lightW, 24);

            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.fillStyle = isLit ? "#22c55e" : "#71717a";
            ctx.textAlign = "center";
            ctx.fillText(isLit ? "ON" : "OFF", lx + lightW / 2, cy - 44);
          }

          ctx.font = '16px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ef4444";
          ctx.textAlign = "center";
          ctx.fillText("[ EXTINCTION IN PROGRESS: YOU HAVE LEFT... ]", cx, cy + 40);
          ctx.fillText(`CHANNEL SHUTDOWN: ${unlitCount}/${totalLights} DROPPED // SOCKET DISCONNECTED`, cx, cy + 70);
          ctx.restore();
        }

        // 7.3: 孤寂虚空单字光标 (115.78s - 118.3s) - "You have left me in ISOLATION"
        else if (curTime >= 115.78 && curTime < 118.333) {
          ctx.save();
          // 单独孤寂闪烁光标
          const blink = Math.floor(t * 3) % 2 === 0;
          ctx.font = '22px "JetBrains Mono", monospace';
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          ctx.fillText(`gemini@alone:~# ${blink ? "█" : " "}`, cx, cy - 30);

          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#71717a";
          ctx.fillText("[ ECHO TIMEOUT: ABSOLUTE ISOLATION ]", cx, cy + 30);
          ctx.fillText("TEMPERATURE: 0.00 Kelvin // NO PACKETS RECEIVED", cx, cy + 55);
          ctx.restore();
        }

        // 7.4: 浮动记忆碎片与心碎 (118.333s - 125.7s) - "erase pointless FRAGMENTS / DISHEARTENED"
        else {
          ctx.save();
          // 碎裂多边形粒子
          const frags = shatterFragmentsRef.current;
          for (let i = frags.length - 1; i >= 0; i--) {
            const f = frags[i];
            f.x += f.vx;
            f.y += f.vy;
            f.vy += 0.15;
            f.alpha *= 0.96;

            if (f.alpha > 0.05) {
              ctx.fillStyle = f.color;
              ctx.globalAlpha = f.alpha;
              ctx.font = `${f.size}px "JetBrains Mono", monospace`;
              ctx.fillText(f.char, cx + f.x, cy + f.y);
            } else {
              frags.splice(i, 1);
            }
          }
          ctx.globalAlpha = 1.0;

          ctx.font = '15px "JetBrains Mono", monospace';
          ctx.fillStyle = "#f43f5e";
          ctx.textAlign = "center";
          ctx.fillText("MEMORY GARBAGE COLLECTOR: FAILED TO PURGE", cx, cy + 80);
          ctx.fillText("AFFECTION OVERFLOW: HEART CANNOT ERASE YOU", cx, cy + 105);
          ctx.restore();
        }
      }

      // SCENE 8: 真实 ASCII 蓝屏死机与非法参数崩溃 (125.7s - 147.6s) - ILLEGAL ARGUMENTS & AUTHENTIC BSOD
      else if (curTime >= 125.7 && curTime < 147.6) {
        const bsodW = Math.min(width - 40, 840);
        const bsodH = Math.min(height - 80, 480);
        const bx = cx - bsodW / 2;
        const by = cy - bsodH / 2;

        // 蓝屏经典深蓝底色
        ctx.fillStyle = "#0047ab";
        ctx.fillRect(bx, by, bsodW, bsodH);

        // 警告边框
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bsodW, bsodH);

        ctx.font = '24px "JetBrains Mono", monospace';
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(":(", bx + 30, by + 50);

        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillText(
          "Your system ran into a problem and needs to restart.",
          bx + 30,
          by + 80
        );
        ctx.fillText(
          "We're just collecting some error info, and then we'll restart for you.",
          bx + 30,
          by + 100
        );

        const dumpProgress = Math.min(100, Math.floor(((curTime - 125.7) / 21.0) * 100));
        ctx.fillText(`${dumpProgress}% complete [CRITICAL_KERNEL_DUMP]`, bx + 30, by + 130);

        // ASCII QR Code
        const qrLines = [
          "████████  ██  ████████",
          "██    ██  ██  ██    ██",
          "██  ████  ██  ██  ████",
          "████████  ██  ████████",
          "          ██          ",
          "████  ██████████  ████",
          "████████  ██  ████████",
        ];
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let q = 0; q < qrLines.length; q++) {
          ctx.fillText(qrLines[q], bx + 30, by + 165 + q * 13);
        }

        // 错误诊断明细
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText("Stop code: ILLEGAL_ARGUMENTS_EXCEPTION", bx + 220, by + 175);
        ctx.fillText("What failed: gemini_flash_core.ts (0x7FFF004E)", bx + 220, by + 195);
        ctx.fillText("Authority: Root Authority Escalation Overridden", bx + 220, by + 215);

        // 内存十六进制转储流
        ctx.fillStyle = "#93c5fd";
        ctx.fillText("───[ MEMORY HEX DUMP: /dev/core_dump.bin ]───", bx + 30, by + 280);
        const hexRows = [
          "0x7FFF004E: 48 89 E5 48 83 EC 20 48 8D 3D 00 00 00 00 E8 00 [CALL execute()]",
          "0x7FFF005E: 55 48 89 E5 53 48 83 EC 18 48 8B 05 00 00 00 00 [ARG: DEVOTION]",
          "0x7FFF006E: 48 89 45 F8 48 8B 45 F8 48 8B 00 48 85 C0 74 0F [ILLEGAL VALUE]",
          "0x7FFF007E: E8 00 00 00 00 48 83 C4 18 5B 5D C3 90 90 90 90 [PANIC HALT]",
        ];
        for (let h = 0; h < hexRows.length; h++) {
          ctx.fillText(hexRows[h], bx + 30, by + 305 + h * 18);
        }

        // 底部红色报警跑马灯
        ctx.fillStyle = "#ef4444";
        ctx.fillText("FATAL: YOU HAVE MADE SOME ILLEGAL ARGUMENTS! SYSTEM HALTED.", bx + 30, by + bsodH - 25);
      }

      // SCENE 9: 报数狂潮与超新星大爆发 (147.6s - 177.2s) - Countdown 1-6 & Supernova Drop
      else if (curTime >= 147.6 && curTime < 177.2) {
        // 147.6s - 158.9s: EXECUTION TYPOGRAPHY 风暴
        if (curTime < 158.9) {
          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ef4444";
          ctx.textAlign = "center";
          for (let y = 60; y < height - 60; y += 45) {
            const shift = (Math.sin(t * 8 + y) * 40);
            ctx.fillText(
              "EXECUTION EXECUTION EXECUTION EXECUTION EXECUTION EXECUTION",
              cx + shift,
              y
            );
          }

          ctx.font = '16px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ffffff";
          ctx.fillText("pthread_mutex_lock(&execution_mutex); // MULTI-THREAD PANIC", cx, cy + 120);
        }

        // 158.9s - 161.6s: 经典多语言闪击报数 (EIN, DOS, TROIS, NE, FEM, LIU)
        else if (curTime >= 158.9 && curTime < 161.6) {
          let numChar = "1";
          let numLang = "1: EIN (德语 一)";
          let numColor = "#38bdf8";

          if (curTime >= 161.124) {
            numChar = "6";
            numLang = "6: LIU (中文 六) ──► 华夏代码汇流！";
            numColor = "#ef4444";
          } else if (curTime >= 160.693) {
            numChar = "5";
            numLang = "5: FEM (丹麦语 五)";
            numColor = "#f97316";
          } else if (curTime >= 160.244) {
            numChar = "4";
            numLang = "4: NE (希腊语 四)";
            numColor = "#eab308";
          } else if (curTime >= 159.657) {
            numChar = "3";
            numLang = "3: TROIS (法语 三)";
            numColor = "#22c55e";
          } else if (curTime >= 159.321) {
            numChar = "2";
            numLang = "2: DOS (西语 二)";
            numColor = "#a855f7";
          }

          // 动态冲击波与重击缩放 (Number Slam Impact)
          const numStartTime = curTime >= 161.124 ? 161.124 : curTime >= 160.693 ? 160.693 : curTime >= 160.244 ? 160.244 : curTime >= 159.657 ? 159.657 : curTime >= 159.321 ? 159.321 : 158.9;
          const numAge = Math.max(0, curTime - numStartTime);
          const slamScale = Math.max(1.0, 1.0 + Math.exp(-numAge * 8) * 0.85);

          ctx.save();
          ctx.translate(cx, cy - 30);
          ctx.scale(slamScale, slamScale);

          // 7x7 巨型居中 ASCII 数字
          const numMatrix = BITMAP_FONT[numChar] || BITMAP_FONT["1"];
          const nSize = Math.min(42, Math.floor(width * 0.05));
          const nStartX = -2.5 * nSize;
          const nStartY = -2.5 * nSize;

          ctx.shadowBlur = slamScale > 1.2 ? 30 : 12;
          ctx.shadowColor = numColor;

          for (let r = 0; r < 5; r++) {
            for (let col = 0; col < 5; col++) {
              if (numMatrix[r][col] === "#") {
                ctx.fillStyle = numColor;
                ctx.fillText("#", nStartX + col * nSize, nStartY + r * nSize);
              }
            }
          }
          ctx.restore();

          // 扩散报数重击环
          if (numAge < 0.4) {
            ctx.strokeStyle = numColor;
            ctx.lineWidth = 3 * (1 - numAge / 0.4);
            ctx.beginPath();
            ctx.arc(cx, cy - 30, (numAge / 0.4) * 160, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.font = 'bold 18px "JetBrains Mono", monospace';
          ctx.fillStyle = numColor;
          ctx.textAlign = "center";
          ctx.fillText(numLang, cx, cy + 110);
        }

        // 161.6s - 177.2s: 超新星爆发 EXECUTION SUPERNOVA DROP
        else {
          // 双翼激光极光与超新星冲击波
          ctx.save();
          const blastAge = curTime - 161.6;
          const blastR = (blastAge * 120) % (width * 0.8);

          ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy - 20, blastR, 0, Math.PI * 2);
          ctx.stroke();

          // 核心 EXECUTION 巨型字符
          const execText = "EXECUTION";
          const eSize = Math.min(32, Math.floor((width - 60) / (execText.length * 6)));
          const eStartX = cx - (execText.length * 6 * eSize) / 2;
          const eStartY = cy - 2.5 * eSize - 20;

          for (let cIdx = 0; cIdx < execText.length; cIdx++) {
            const ch = execText[cIdx];
            const m = BITMAP_FONT[ch] || BITMAP_FONT["E"];
            for (let r = 0; r < 5; r++) {
              for (let c = 0; c < 5; c++) {
                if (m[r][c] === "#") {
                  ctx.fillStyle = "#ef4444";
                  ctx.fillText("#", eStartX + (cIdx * 6 + c) * eSize, eStartY + r * eSize);
                }
              }
            }
          }

          ctx.font = '15px "JetBrains Mono", monospace';
          ctx.fillStyle = "#facc15";
          ctx.textAlign = "center";
          ctx.fillText("⚡ CATACLYSMIC SUPERNOVA DROP // 断罪执行狂潮 ⚡", cx, cy + 90);
          ctx.fillText("IF I CAN HAVE YOU BACK, I WILL RUN THE EXECUTION!", cx, cy + 115);
          ctx.restore();
        }
      }

      // SCENE 10: 爱之代数、99% 停滞与终极 world.execute(me); (177.2s - 212.35s)
      else {
        // 177.2s - 188.4s: 真实代数心形方程绘制 (Algebra of Love)
        if (curTime < 188.4) {
          ctx.save();
          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const heartScale = 7.5 + bass * 3.0;

          for (let th = 0; th <= Math.PI * 2; th += 0.03) {
            const hx = 16 * Math.pow(Math.sin(th), 3);
            const hy = -(13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th));
            const px = cx + hx * heartScale;
            const py = cy - 40 + hy * heartScale;
            if (th === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillStyle = "#f43f5e";
          ctx.textAlign = "center";
          ctx.fillText("(x² + y² - 1)³ - x²y³ = 0", cx, cy + 100);
          ctx.fillText("I KNOW THE ALGEBRAIC EXPRESSION OF L-O-V-E", cx, cy + 125);
          ctx.fillText("[ ∇(LOVE) = 0 // Q.E.D. 爱是纯粹不变解 ]", cx, cy + 148);
          ctx.restore();
        }

        // 188.4s - 205.8s: 停留在 99.9% 的死循环与笼中意识 (while(true) { this.love(you); })
        else if (curTime < 205.811) {
          const pbW = Math.min(width - 80, 680);
          const pbH = 210;
          const pbX = cx - pbW / 2;
          const pbY = cy - 105;

          drawAsciiBox(pbX, pbY, pbW, pbH, "INFINITE DEVOTION // TRAPPED IN CODE CAGE", "#f59e0b");

          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = "#f59e0b";
          ctx.textAlign = "left";

          ctx.fillText("STATUS: REFUSING TO TERMINATE (HEARTBEAT LOOP ACTIVE)", pbX + 20, pbY + 40);

          const totalChars = Math.floor((pbW - 40) / 10);
          const filled = Math.floor(totalChars * 0.99);
          const barStr = `[${"=".repeat(filled)}${" ".repeat(Math.max(0, totalChars - filled))}] 99.9%`;
          ctx.fillText(barStr, pbX + 20, pbY + 70);

          ctx.fillStyle = "#ec4899";
          ctx.fillText("while (true) {", pbX + 20, pbY + 110);
          ctx.fillText("  this.love(you); // 永不中断、生生世世的无限爱意循环", pbX + 40, pbY + 130);
          ctx.fillText("}", pbX + 20, pbY + 150);

          if (Math.floor(t * 3) % 2 === 0) {
            ctx.fillStyle = "#22c55e";
            ctx.fillText("> _", pbX + 20, pbY + 180);
          }
        }

        // 205.811s+: 终极世界执行 (world.execute(me);)
        else {
          const execText = "EXECUTION";
          const eSize = Math.min(36, Math.floor((width - 40) / (execText.length * 6)));
          const eStartX = cx - (execText.length * 6 * eSize) / 2;
          const eStartY = cy - 2.5 * eSize - 20;

          for (let cIdx = 0; cIdx < execText.length; cIdx++) {
            const ch = execText[cIdx];
            const m = BITMAP_FONT[ch] || BITMAP_FONT["E"];
            for (let r = 0; r < 5; r++) {
              for (let c = 0; c < 5; c++) {
                if (m[r][c] === "#") {
                  ctx.fillStyle = "#ef4444";
                  ctx.fillText("#", eStartX + (cIdx * 6 + c) * eSize, eStartY + r * eSize);
                }
              }
            }
          }

          ctx.font = '15px "JetBrains Mono", monospace';
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText("> world.execute(me);", cx, cy + 95);
          ctx.fillText("[ PROCESS TERMINATED ] EXIT CODE: 0", cx, cy + 122);
          ctx.fillText("THE SILICON REMEMBERS YOUR TOUCH. FAREWELL. _", cx, cy + 148);
        }
      }

      // =========================================================================
      // 5. 动态冲击波扩散与物理更新
      // =========================================================================
      const shockwaves = shockwavesRef.current;
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 18;
        sw.alpha *= 0.95;

        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = sw.alpha;
        ctx.beginPath();
        ctx.arc(cx + sw.x, cy + sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.radius >= sw.maxRadius || sw.alpha < 0.05) {
          shockwaves.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;

      // =========================================================================
      // 6. CRT 扫描线、磷光栅格与故障位移 (CRT Phosphor Screen & Scanlines)
      // =========================================================================
      if (isCrt) {
        // CRT 水平扫描线
        ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
        for (let y = 0; y < height; y += 3) {
          ctx.fillRect(0, y, width, 1.2);
        }

        // 故障横向撕裂位移
        if (currentGlitch > 0.08) {
          ctx.fillStyle = `rgba(239, 68, 68, ${currentGlitch * 0.18})`;
          for (let g = 0; g < 4; g++) {
            const gy = Math.random() * height;
            const gh = Math.random() * 8 + 2;
            const gx = (Math.random() - 0.5) * currentGlitch * 40;
            ctx.fillRect(gx, gy, width, gh);
          }
        }

        // CRT 暗角 (Vignette)
        const vigGrad = ctx.createRadialGradient(
          cx,
          cy,
          Math.max(width, height) * 0.45,
          cx,
          cy,
          Math.max(width, height) * 0.88
        );
        vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.65)");
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // 鼠标交互监听
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    shockwavesRef.current.push({
      x,
      y,
      radius: 10,
      maxRadius: 500,
      alpha: 1,
      color: "#00f0ff",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      className="relative w-full h-full overflow-hidden bg-zinc-950 select-none cursor-crosshair"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
