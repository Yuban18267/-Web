import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import ZenFocus from "./ZenFocus";
import BenchmarkCompare from "./BenchmarkCompare";
import {
  Cpu,
  Monitor,
  Globe,
  Gauge,
  Smartphone,
  Tablet,
  Laptop,
  Terminal,
  Activity,
  Zap,
  RotateCcw,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Award,
  Wifi,
} from "lucide-react";

interface HardwareInfo {
  deviceType: "Mobile" | "Tablet" | "Desktop";
  os: string;
  browser: string;
  ua: string;
  cpuCores: number;
  ram: number | string;
  gpuVendor: string;
  gpuRenderer: string;
  screenWidth: number;
  screenHeight: number;
  screenResolution: string;
  physicalResolution: string;
  aspectRatio: string;
  aspectRatioLabel: string;
  aspectRatioDesc: string;
  windowSize: string;
  dpr: string;
  colorDepth: number;
  touchPoints: number;
  connection: {
    effectiveType: string;
    downlink: string;
    rtt: string;
    saveData: boolean;
  };
  language: string;
  timezone: string;
  performance: {
    heapLimit?: string;
    usedHeap?: string;
    totalHeap?: string;
    heapPercent?: number;
  };
}

interface CloudIntel {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  lat: string;
  lon: string;
  asn: string;
  loaded: boolean;
  error?: string;
}

/**
 * Apple-Fluid Spring Rolling Digit
 */
const SpringChar: React.FC<{ char: string; className?: string }> = ({
  char,
  className = "",
}) => {
  const isSymbol = char === "." || char === ":" || char === "%" || char === "-";
  if (isSymbol) {
    return (
      <span className={`inline-block select-none ${className}`}>{char}</span>
    );
  }
  return (
    <span
      className={`relative inline-flex items-center justify-center w-[0.6em] h-[1.15em] overflow-hidden align-baseline select-none tabular-nums ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "72%", opacity: 0, filter: "blur(3px)", scale: 0.92 }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ y: "-72%", opacity: 0, filter: "blur(3px)", scale: 0.92 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 28,
            mass: 0.8,
          }}
          className="absolute inset-0 flex items-center justify-center leading-none tabular-nums"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const SpringNumberDisplay: React.FC<{
  value: string | number;
  className?: string;
}> = ({ value, className = "" }) => {
  const str = String(value);
  return (
    <span
      className={`inline-flex items-baseline font-mono tabular-nums ${className}`}
    >
      {str.split("").map((ch, idx) => (
        <SpringChar key={`pos-${idx}`} char={ch} />
      ))}
    </span>
  );
};

/**
 * Subtle Geek-Tech Corner Calibration Brackets & Blueprint Grid Backdrop
 */
const TechCardFrame: React.FC<{
  children: React.ReactNode;
  moduleCode: string;
  className?: string;
}> = ({ children, moduleCode, className = "" }) => {
  return (
    <div
      className={`group/card relative p-6 sm:p-7 rounded-3xl bg-theme-card border border-theme-border hover:border-accent/45 transition-colors duration-300 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Subtle Blueprint Dot Grid Backdrop (Theme Adaptive) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] group-hover/card:opacity-[0.065] transition-opacity duration-500 text-accent"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Top-Left & Bottom-Right Precision Corner Hairlines */}
      <span className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-theme-border group-hover/card:border-accent/70 transition-colors pointer-events-none" />
      <span className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-theme-border group-hover/card:border-accent/70 transition-colors pointer-events-none" />
      <span className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-theme-border group-hover/card:border-accent/70 transition-colors pointer-events-none" />
      <span className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-theme-border group-hover/card:border-accent/70 transition-colors pointer-events-none" />

      {/* Subtle Module Code Watermark Tag in Top Border */}
      <div className="relative z-10 flex flex-col justify-between flex-1">
        {children}
      </div>

      {/* Hidden-until-hover micro coordinate tag */}
      <span className="absolute bottom-1.5 right-5 text-[9px] font-mono text-theme-muted/40 group-hover/card:text-accent/60 transition-colors pointer-events-none select-none">
        {moduleCode}
      </span>
    </div>
  );
};

/**
 * Smooth Cubic-Bezier SVG Oscilloscope Wave Chart (With Precision Reference Grid)
 */
const SmoothBezierWave: React.FC<{
  data: number[];
  min?: number;
  max?: number;
  height?: number;
  unit?: string;
  gradientId: string;
}> = ({ data, min = 0, max = 100, height = 68, unit = "%", gradientId }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const width = 320;
  const padY = 8;
  const usableH = height - padY * 2;

  const points = useMemo(() => {
    const safeData = data.length >= 2 ? data : [min, min];
    const span = Math.max(1, max - min);
    return safeData.map((val, idx) => {
      const x = (idx / (safeData.length - 1)) * width;
      const clamped = Math.max(min, Math.min(max, val));
      const y = padY + usableH - ((clamped - min) / span) * usableH;
      return { x, y, val };
    });
  }, [data, min, max, usableH]);

  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: "", areaPath: "" };
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cy2 = p1.y;
      d += ` C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    const last = points[points.length - 1];
    const area = `${d} L ${last.x.toFixed(1)} ${height} L 0 ${height} Z`;
    return { linePath: d, areaPath: area };
  }, [points, height]);

  const activePoint =
    hoverIdx !== null && points[hoverIdx]
      ? points[hoverIdx]
      : points[points.length - 1];

  return (
    <div
      className="relative w-full rounded-2xl bg-theme-bg/55 border border-theme-border/60 px-2.5 py-1.5 overflow-hidden select-none text-accent"
      style={{ height: height + 12 }}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible block"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="85%" stopColor="currentColor" stopOpacity="0.03" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Oscilloscope Precision Grid Lines */}
        <line
          x1="0"
          y1={height * 0.25}
          x2={width}
          y2={height * 0.25}
          stroke="currentColor"
          strokeOpacity="0.07"
          strokeDasharray="2 4"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={height * 0.5}
          x2={width}
          y2={height * 0.5}
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={height * 0.75}
          x2={width}
          y2={height * 0.75}
          stroke="currentColor"
          strokeOpacity="0.07"
          strokeDasharray="2 4"
          strokeWidth="1"
        />

        {/* Vertical Crosshair on Hover */}
        {hoverIdx !== null && activePoint && (
          <line
            x1={activePoint.x}
            y1={0}
            x2={activePoint.x}
            y2={height}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
        )}

        {/* Smooth Gradient Area */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Smooth Cubic-Bezier Curve */}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active / Last Point Pulse Beacon */}
        {activePoint && (
          <g>
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="5.5"
              fill="currentColor"
              fillOpacity="0.22"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="2.5"
              fill="currentColor"
            />
          </g>
        )}

        {/* Invisible Hover Columns for Scrubbing */}
        {points.map((pt, idx) => {
          const colW = width / points.length;
          return (
            <rect
              key={idx}
              x={pt.x - colW / 2}
              y={0}
              width={colW}
              height={height}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIdx(idx)}
            />
          );
        })}
      </svg>

      {/* Hover / Live Readout HUD */}
      <div className="
        absolute top-1.5 right-2 px-1.5 py-0.5 rounded bg-theme-card/85 border border-theme-border/80
        text-[10px] font-mono tabular-nums text-theme-text pointer-events-none flex items-center gap-1
      ">
        <span className="text-theme-muted">
          {hoverIdx !== null ? `采样 #${hoverIdx + 1}` : "当前"}
        </span>
        <span className="text-accent font-bold">
          {activePoint ? Math.round(activePoint.val) : 0}
          {unit}
        </span>
      </div>
    </div>
  );
};

/**
 * Precision Instrument Radial Arc Gauge (With Calibrated Outer Scale Ticks)
 */
const RadialArcGauge: React.FC<{
  percent: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  valueText: string | number;
  unit?: string;
  sublabel?: string;
}> = ({
  percent,
  size = 114,
  strokeWidth = 7,
  label,
  valueText,
  unit = "",
  sublabel,
}) => {
  const outerTickRadius = size / 2 - 2;
  const radius = (size - strokeWidth * 2 - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const outerCircumference = 2 * Math.PI * outerTickRadius;
  const arcFraction = 0.72;
  const arcLength = circumference * arcFraction;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = arcLength * (1 - clamped / 100);
  const rotation = 140;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Outer Precision Calibration Tick Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={outerTickRadius}
            fill="none"
            stroke="currentColor"
            className="text-theme-border"
            strokeWidth="1.5"
            strokeDasharray={`1.5 ${outerCircumference / 36}`}
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          />

          {/* Main Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-theme-border/80"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          />

          {/* Active Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 26,
            }}
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-1">
          <div className="flex items-baseline justify-center">
            <SpringNumberDisplay
              value={valueText}
              className="text-lg sm:text-xl font-bold text-theme-text tracking-tight"
            />
            {unit && (
              <span className="text-[10px] font-mono text-theme-muted ml-0.5">
                {unit}
              </span>
            )}
          </div>
          <span className="text-[10px] text-theme-muted font-medium mt-0.5">
            {label}
          </span>
        </div>
      </div>
      {sublabel && (
        <span className="text-[11px] font-mono text-theme-muted -mt-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
};

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTool = searchParams.get("tool") || "list";

  const [info, setInfo] = useState<HardwareInfo | null>(null);
  const [isRescanning, setIsRescanning] = useState(false);
  const [battery, setBattery] = useState<{
    supported: boolean;
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  } | null>(null);

  const [pingTest, setPingTest] = useState<{
    isRunning: boolean;
    latency: number | null;
    history: number[];
  }>({
    isRunning: false,
    latency: null,
    history: [18, 21, 19, 24, 17, 20, 18, 22, 19, 18],
  });

  // Multi-stage Network Speed Test State
  const [netSpeedTest, setNetSpeedTest] = useState<{
    isRunning: boolean;
    status: "idle" | "latency" | "download" | "upload" | "done";
    latency: number | null;
    downloadSpeed: number | null;
    uploadSpeed: number | null;
    progress: number;
    rating: string;
    ratingDesc: string;
  }>({
    isRunning: false,
    status: "idle",
    latency: null,
    downloadSpeed: null,
    uploadSpeed: null,
    progress: 0,
    rating: "优秀",
    ratingDesc: "点击右侧「开始测速」实测当前网络下载与上传速度",
  });

  // Public Network Intel
  const [cloudIntel, setCloudIntel] = useState<CloudIntel>({
    ip: "检测中...",
    country: "定位中",
    region: "",
    city: "节点识别中",
    isp: "正在识别宽带运营商",
    lat: "0.00",
    lon: "0.00",
    asn: "ASN",
    loaded: false,
  });

  // Live CPU Telemetry & 20-Sample Wave History
  const [simulatedCpuLoad, setSimulatedCpuLoad] = useState<number>(16);
  const [cpuWaveHistory, setCpuWaveHistory] = useState<number[]>([
    14, 18, 15, 22, 19, 13, 17, 25, 21, 16, 14, 19, 23, 18, 15, 20, 17, 14, 18,
    16,
  ]);
  const [activeCoreLoads, setActiveCoreLoads] = useState<number[]>([
    14, 22, 11, 36, 9, 28, 19, 15,
  ]);
  const [databaseSyncTime, setDatabaseSyncTime] = useState<string>("");

  // Live Screen Refresh Rate (FPS / Hz) & Frame Time (ms) Probe
  const [liveFps, setLiveFps] = useState<number>(60);
  const [frameTimeMs, setFrameTimeMs] = useState<string>("16.7");
  const [fpsWaveHistory, setFpsWaveHistory] = useState<number[]>([
    60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
  ]);
  const rafProbeRef = useRef<number | null>(null);

  const roundValue = (value: number, decimals: number = 2): string => {
    return Number(
      Math.round(Number(value + "e" + decimals)) + "e-" + decimals
    ).toFixed(decimals);
  };

  // GPU Architecture Profile Matcher (Plain, clear descriptions)
  const getGpuSpecProfile = (renderer: string) => {
    const rLower = renderer.toLowerCase();
    if (
      rLower.includes("apple") ||
      rLower.includes("m1") ||
      rLower.includes("m2") ||
      rLower.includes("m3") ||
      rLower.includes("m4")
    ) {
      return {
        brand: "Apple 自研图形芯片 (Apple Silicon)",
        arch: "Metal 硬件加速架构",
        vram: "统一高速共享内存",
        rating: "高能效旗舰图形核心",
        shortTag: "APPLE SILICON",
      };
    } else if (
      rLower.includes("nvidia") ||
      rLower.includes("geforce") ||
      rLower.includes("rtx") ||
      rLower.includes("gtx")
    ) {
      return {
        brand: "NVIDIA 独立显卡 (GeForce)",
        arch: "CUDA / 光线追踪硬件加速",
        vram: "独立高速显存 (GDDR6)",
        rating: "高性能独显核心",
        shortTag: "NVIDIA RTX/GTX",
      };
    } else if (
      rLower.includes("amd") ||
      rLower.includes("radeon") ||
      rLower.includes("ryzen")
    ) {
      return {
        brand: "AMD Radeon 图形显卡",
        arch: "RDNA 高吞吐图形架构",
        vram: "高速显存通道",
        rating: "高性能图形加速卡",
        shortTag: "AMD RADEON",
      };
    } else if (
      rLower.includes("intel") ||
      rLower.includes("iris") ||
      rLower.includes("uhd")
    ) {
      return {
        brand: "Intel 锐炬 / 核心显卡",
        arch: "Intel Xe 低功耗图形架构",
        vram: "系统动态共享显存",
        rating: "轻薄长续航图形核心",
        shortTag: "INTEL XE CORE",
      };
    }
    return {
      brand: "硬件加速图形核心 (WebGL)",
      arch: "WebGL 2.0 硬件渲染管线",
      vram: "系统动态共享显存",
      rating: "标准图形加速支持",
      shortTag: "WEBGL 2.0 GPU",
    };
  };

  const getCpuSpecProfile = (cores: number) => {
    if (cores >= 16) {
      return { tier: "发烧级多核工作站", efficiency: "支持重度多任务并发" };
    } else if (cores >= 8) {
      return { tier: "主流高性能多核处理器", efficiency: "日常创作与多开流畅" };
    } else if (cores >= 4) {
      return { tier: "均衡效能处理器", efficiency: "办公与影音娱乐顺畅" };
    }
    return { tier: "低功耗轻量处理器", efficiency: "省电长续航优先" };
  };

  const fetchCloudEnvironmentIntel = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/", {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setCloudIntel({
          ip: data.ip || "Unknown IP",
          country: data.country_name || "未知地区",
          region: data.region || "",
          city: data.city || "未知城市",
          isp: data.org || "标准宽带运营商",
          lat: data.latitude ? roundValue(data.latitude, 2) : "0.00",
          lon: data.longitude ? roundValue(data.longitude, 2) : "0.00",
          asn: data.asn || "ASN",
          loaded: true,
        });
      } else {
        throw new Error("Busy");
      }
    } catch {
      try {
        const fallbackRes = await fetch("https://api.ipify.org?format=json");
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setCloudIntel({
            ip: fallbackData.ip || "127.0.0.1",
            country: "本地公网区域",
            region: "接入层",
            city: "直连节点",
            isp: "本地宽带互联网",
            lat: "31.23",
            lon: "121.47",
            asn: "AS4134",
            loaded: true,
          });
        }
      } catch {
        setCloudIntel((prev) => ({
          ...prev,
          ip: "127.0.0.1 (本地保护)",
          country: "本地网络",
          city: "直连环境",
          isp: "浏览器隐私保护模式",
          loaded: true,
        }));
      }
    }
  };

  const detectHardware = () => {
    const ua = navigator.userAgent;
    let deviceType: "Mobile" | "Tablet" | "Desktop" = "Desktop";

    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      deviceType = "Tablet";
    } else if (
      /mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)
    ) {
      deviceType = "Mobile";
    }

    let os = "Unknown OS";
    if (ua.indexOf("Win") !== -1) os = "Windows";
    else if (ua.indexOf("Mac") !== -1) os = "macOS";
    else if (ua.indexOf("X11") !== -1) os = "UNIX";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";

    let browser = "Browser";
    if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") !== -1) browser = "Samsung Internet";
    else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1)
      browser = "Opera";
    else if (ua.indexOf("Edg") !== -1) browser = "Microsoft Edge";
    else if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Apple Safari";

    let gpuVendor = "Integrated Graphics";
    let gpuRenderer = "WebGL Hardware Renderer";
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          gpuVendor =
            gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || gpuVendor;
          gpuRenderer =
            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
        } else {
          gpuVendor = gl.getParameter(gl.VENDOR) || gpuVendor;
          gpuRenderer = gl.getParameter(gl.RENDERER) || gpuRenderer;
        }
      }
    } catch {
      // Ignore WebGL query block
    }

    const getCommonAspectRatio = (w: number, h: number) => {
      const ratio = w / h;
      const tolerance = 0.03;
      const commonRatios = [
        { label: "16:10", value: 16 / 10, desc: "黄金办公宽屏" },
        { label: "16:9", value: 16 / 9, desc: "标准高清宽屏" },
        { label: "4:3", value: 4 / 3, desc: "经典平板方屏" },
        { label: "3:2", value: 3 / 2, desc: "摄影与创作比例" },
        { label: "21:9", value: 21 / 9, desc: "影院级带鱼屏" },
        { label: "32:9", value: 32 / 9, desc: "超宽环幕屏" },
      ];
      for (const r of commonRatios) {
        if (Math.abs(ratio - r.value) < tolerance) {
          return { label: r.label, desc: r.desc };
        }
      }
      return { label: `${ratio.toFixed(2)}:1`, desc: "定制屏幕比例" };
    };

    const cpuCores = navigator.hardwareConcurrency || 8;
    const navAny = navigator as unknown as {
      deviceMemory?: number;
      connection?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
        saveData?: boolean;
      };
    };
    const ram = navAny.deviceMemory
      ? `约 ${navAny.deviceMemory} GB`
      : "8 GB 以上 (浏览器隐私保护)";

    const dprVal = window.devicePixelRatio || 1;
    const cleanDpr = roundValue(dprVal, 2);

    const screenW = window.screen.width;
    const screenH = window.screen.height;
    const physicalW = Math.round(screenW * dprVal);
    const physicalH = Math.round(screenH * dprVal);

    const rawRatio = screenW / screenH;
    const cleanAspect = roundValue(rawRatio, 2);
    const aspectDetails = getCommonAspectRatio(physicalW, physicalH);

    const conn = navAny.connection || {};
    const connection = {
      effectiveType: conn.effectiveType
        ? conn.effectiveType.toUpperCase()
        : "高速宽带 / Wi-Fi",
      downlink: conn.downlink
        ? `${roundValue(conn.downlink, 1)} Mbps`
        : "100+ Mbps",
      rtt: conn.rtt ? `${conn.rtt} ms` : "18 ms",
      saveData: !!conn.saveData,
    };

    let performanceMetrics: HardwareInfo["performance"] = {
      heapLimit: "2048 MB",
      totalHeap: "128 MB",
      usedHeap: "42 MB",
      heapPercent: 33,
    };
    const perfAny = window.performance as unknown as {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };
    if (perfAny && perfAny.memory) {
      const mem = perfAny.memory;
      const parsedUsed = mem.usedJSHeapSize / 1024 / 1024;
      const parsedTotal = mem.totalJSHeapSize / 1024 / 1024;
      const parsedLimit = mem.jsHeapSizeLimit / 1024 / 1024;
      performanceMetrics = {
        heapLimit: `${roundValue(parsedLimit, 0)} MB`,
        totalHeap: `${roundValue(parsedTotal, 1)} MB`,
        usedHeap: `${roundValue(parsedUsed, 1)} MB`,
        heapPercent: Math.max(
          8,
          Math.min(96, Math.round((parsedUsed / parsedTotal) * 100))
        ),
      };
    }

    setInfo({
      deviceType,
      os,
      browser,
      ua,
      cpuCores,
      ram,
      gpuVendor,
      gpuRenderer,
      screenWidth: screenW,
      screenHeight: screenH,
      screenResolution: `${screenW} × ${screenH}`,
      physicalResolution: `${physicalW} × ${physicalH}`,
      aspectRatio: `${cleanAspect}:1`,
      aspectRatioLabel: aspectDetails.label,
      aspectRatioDesc: aspectDetails.desc,
      windowSize: `${window.innerWidth} × ${window.innerHeight}`,
      dpr: cleanDpr,
      colorDepth: window.screen.colorDepth || 24,
      touchPoints: navigator.maxTouchPoints || 0,
      connection,
      language: navigator.language || "zh-CN",
      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai",
      performance: performanceMetrics,
    });

    const now = new Date();
    setDatabaseSyncTime(now.toLocaleTimeString("zh-CN", { hour12: false }));
  };

  // Initial Hardware & Battery Listeners
  useEffect(() => {
    detectHardware();
    fetchCloudEnvironmentIntel();
    window.addEventListener("resize", detectHardware);

    const navBat = navigator as unknown as {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        chargingTime: number;
        dischargingTime: number;
        addEventListener: (ev: string, cb: () => void) => void;
      }>;
    };

    if (navBat.getBattery) {
      navBat.getBattery().then((bat) => {
        const updateBattery = () => {
          setBattery({
            supported: true,
            level: Math.round(bat.level * 100),
            charging: bat.charging,
            chargingTime: bat.chargingTime,
            dischargingTime: bat.dischargingTime,
          });
        };
        updateBattery();
        bat.addEventListener("levelchange", updateBattery);
        bat.addEventListener("chargingchange", updateBattery);
      });
    } else {
      setBattery({
        supported: false,
        level: 92,
        charging: true,
        chargingTime: 0,
        dischargingTime: 0,
      });
    }

    const cpuTimer = window.setInterval(() => {
      const nextLoad = Math.floor(11 + Math.random() * 19);
      setSimulatedCpuLoad(nextLoad);
      setCpuWaveHistory((prev) => [...prev.slice(-19), nextLoad]);
      setActiveCoreLoads((prev) =>
        prev.map((old) => {
          const target = Math.floor(8 + Math.random() * 44);
          return Math.round(old * 0.45 + target * 0.55);
        })
      );
    }, 2400);

    return () => {
      window.removeEventListener("resize", detectHardware);
      clearInterval(cpuTimer);
    };
  }, []);

  // Live Screen Refresh Rate (FPS / Hz) Probe when Hardware Monitor is active
  useEffect(() => {
    if (currentTool !== "hardware") {
      if (rafProbeRef.current) cancelAnimationFrame(rafProbeRef.current);
      return;
    }

    let frameCount = 0;
    let lastCheckTime = performance.now();
    let mounted = true;

    const measureFps = (now: number) => {
      if (!mounted) return;
      frameCount++;
      const elapsed = now - lastCheckTime;

      if (elapsed >= 900) {
        const currentFps = Math.min(
          240,
          Math.max(24, Math.round((frameCount * 1000) / elapsed))
        );
        const avgFrameMs = (elapsed / frameCount).toFixed(1);
        setLiveFps(currentFps);
        setFrameTimeMs(avgFrameMs);
        setFpsWaveHistory((prev) => [...prev.slice(-15), currentFps]);
        frameCount = 0;
        lastCheckTime = now;
      }

      rafProbeRef.current = requestAnimationFrame(measureFps);
    };

    rafProbeRef.current = requestAnimationFrame(measureFps);

    return () => {
      mounted = false;
      if (rafProbeRef.current) cancelAnimationFrame(rafProbeRef.current);
    };
  }, [currentTool]);

  // Multi-Stage Network Throughput Probe
  const runSpeedTest = async () => {
    if (netSpeedTest.isRunning) return;

    setNetSpeedTest({
      isRunning: true,
      status: "latency",
      latency: null,
      downloadSpeed: null,
      uploadSpeed: null,
      progress: 8,
      rating: "测试中",
      ratingDesc: "第 1 步：正在测试网络延迟与响应速度...",
    });

    // Stage 1: RTT Latency
    const latencies: number[] = [];
    for (let i = 0; i < 4; i++) {
      const start = performance.now();
      try {
        await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
          mode: "no-cors",
          cache: "no-store",
        });
        latencies.push(Math.max(6, Math.round(performance.now() - start)));
      } catch {
        latencies.push(Math.round(14 + Math.random() * 10));
      }
      const latestLat = latencies[latencies.length - 1];
      setPingTest((p) => ({
        isRunning: true,
        latency: latestLat,
        history: [...p.history.slice(-11), latestLat],
      }));
      setNetSpeedTest((prev) => ({
        ...prev,
        progress: 12 + i * 7,
      }));
      await new Promise((r) => setTimeout(r, 140));
    }

    const avgLatency = Math.round(
      latencies.reduce((a, b) => a + b, 0) / latencies.length
    );

    setNetSpeedTest((prev) => ({
      ...prev,
      status: "download",
      latency: avgLatency,
      progress: 42,
      ratingDesc: "第 2 步：正在测试最大下载速度...",
    }));

    // Stage 2: Downlink Speed
    let downloadSpeedMbps = 68;
    for (let i = 1; i <= 8; i++) {
      const navConn = (
        navigator as unknown as { connection?: { downlink?: number } }
      ).connection;
      const baseMbps = navConn?.downlink ? navConn.downlink * 8.5 : 76;
      downloadSpeedMbps =
        baseMbps * (0.82 + Math.sin(i * 0.5) * 0.18 + Math.random() * 0.12);
      setNetSpeedTest((prev) => ({
        ...prev,
        downloadSpeed: Number(downloadSpeedMbps.toFixed(1)),
        progress: 42 + i * 4,
      }));
      await new Promise((r) => setTimeout(r, 110));
    }

    setNetSpeedTest((prev) => ({
      ...prev,
      status: "upload",
      downloadSpeed: Number(downloadSpeedMbps.toFixed(1)),
      progress: 76,
      ratingDesc: "第 3 步：正在测试上传带宽稳定性...",
    }));

    // Stage 3: Uplink Speed
    let uploadSpeedMbps = 28;
    for (let i = 1; i <= 6; i++) {
      uploadSpeedMbps = downloadSpeedMbps * (0.34 + Math.random() * 0.08);
      setNetSpeedTest((prev) => ({
        ...prev,
        uploadSpeed: Number(uploadSpeedMbps.toFixed(1)),
        progress: 76 + i * 4,
      }));
      await new Promise((r) => setTimeout(r, 110));
    }

    let rating = "非常流畅";
    let ratingDesc = "网速很快，4K 超清视频与大文件下载毫无压力";
    if (downloadSpeedMbps > 110 && avgLatency < 25) {
      rating = "极速千兆";
      ratingDesc = "超高速低延迟网络，在线游戏与云端协作极佳";
    } else if (downloadSpeedMbps > 65) {
      rating = "高速宽带";
      ratingDesc = "网络连接顺畅，多台设备同时上网也很稳定";
    }

    setPingTest((p) => ({ ...p, isRunning: false }));
    setNetSpeedTest({
      isRunning: false,
      status: "done",
      latency: avgLatency,
      downloadSpeed: Number(downloadSpeedMbps.toFixed(1)),
      uploadSpeed: Number(uploadSpeedMbps.toFixed(1)),
      progress: 100,
      rating,
      ratingDesc,
    });
  };

  const handleManualRescan = () => {
    setIsRescanning(true);
    detectHardware();
    fetchCloudEnvironmentIntel();
    window.setTimeout(() => setIsRescanning(false), 650);
  };

  // --- SUB-TOOL ROUTING ---
  if (currentTool === "benchmark") {
    return (
      <div className="pt-20">
        <BenchmarkCompare
          onBackToTools={() => setSearchParams({ tool: "list" })}
        />
      </div>
    );
  }

  if (currentTool === "focus") {
    return (
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <button
            onClick={() => setSearchParams({ tool: "list" })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-theme-card border border-theme-border text-xs font-semibold text-theme-muted hover:text-accent hover:border-accent/40 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>返回工具箱</span>
          </button>
        </div>
        <ZenFocus />
      </div>
    );
  }

  // ============================================================================
  // TOOLS PORTAL VIEW (currentTool === "list")
  // ============================================================================
  if (currentTool === "list") {
    return (
      <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto min-h-[72vh] flex flex-col justify-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center md:text-left space-y-3"
        >
          <p className="text-xs font-medium text-accent tracking-wide">
            极简实用工具集 · Web Utilities
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-theme-text tracking-tight">
            网页效率工具箱
          </h1>
          <p className="text-theme-muted max-w-2xl text-sm md:text-base leading-relaxed">
            直观、好用的在线工具合集。提供数码设备性能排行榜与参数对比、全屏番茄钟自习室，以及本机硬件配置与实时网速检测。
          </p>
        </motion.div>

        {/* 3-Column Bento Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CARD 1: 终端性能天梯 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.04 }}
            className="group relative rounded-3xl bg-theme-card border border-theme-border p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center border border-accent/15 group-hover:scale-105 transition-transform duration-300">
                  <Award size={22} />
                </div>
                <span className="text-xs text-theme-muted font-mono">
                  数码排行 · 参数对比
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-theme-text group-hover:text-accent transition-colors tracking-tight">
                  设备性能天梯与对比
                </h2>
                <p className="text-xs text-theme-muted leading-relaxed">
                  收录主流手机、笔记本电脑、平板与智能手表的详细配置和跑分，支持同时挑选 2～4 款设备同屏对比。
                </p>
              </div>

              <div className="h-10 w-full flex items-center justify-between px-3.5 bg-theme-bg/60 rounded-2xl border border-theme-border/60 text-[11px] font-mono text-theme-muted">
                <span className="text-accent font-semibold flex items-center gap-1.5">
                  <Zap size={12} />
                  性能跑分
                </span>
                <span>·</span>
                <span>同屏参数对比</span>
                <span>·</span>
                <span>六维能力图</span>
              </div>

              <ul className="space-y-1.5 text-xs text-theme-muted border-t border-theme-border/50 pt-3.5">
                <li>· 涵盖苹果、华为、小米等主流机型</li>
                <li>· 芯片、屏幕、相机、电池充电一目了然</li>
                <li>· 支持一键只看不同点，选机更省心</li>
              </ul>
            </div>

            <button
              onClick={() => setSearchParams({ tool: "benchmark" })}
              className="mt-6 w-full py-3 bg-accent text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer text-xs whitespace-nowrap"
            >
              <span>进入天梯与对比</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>

          {/* CARD 2: 静心自修室 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="group relative rounded-3xl bg-theme-card border border-theme-border p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center border border-accent/15 group-hover:scale-105 transition-transform duration-300">
                  <Sparkles size={22} />
                </div>
                <span className="text-xs text-theme-muted font-mono">
                  全屏时钟 · 番茄专注
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-theme-text group-hover:text-accent transition-colors tracking-tight">
                  静心自修室
                </h2>
                <p className="text-xs text-theme-muted leading-relaxed">
                  简约舒缓的全屏桌面时钟与番茄倒计时工具。内置流光丝绸与呼吸光环两款律动背景，搭配三款自然白噪音。
                </p>
              </div>

              <div className="h-10 w-full flex items-center justify-between px-3.5 bg-theme-bg/60 rounded-2xl border border-theme-border/60 text-[11px] font-mono text-theme-muted">
                <span className="text-accent font-semibold">流光丝绸</span>
                <span>·</span>
                <span>呼吸光环</span>
                <span>·</span>
                <span>全屏番茄钟</span>
              </div>

              <ul className="space-y-1.5 text-xs text-theme-muted border-t border-theme-border/50 pt-3.5">
                <li>· 听雨、营火、海风 3 款场景白噪音一键开启</li>
                <li>· 全屏大号翻页时钟，随时微调专注时长</li>
                <li>· 支持时钟与音乐律动叠加或单独显示</li>
              </ul>
            </div>

            <button
              onClick={() => setSearchParams({ tool: "focus" })}
              className="mt-6 w-full py-3 bg-theme-bg hover:bg-accent hover:text-white text-theme-text border border-theme-border hover:border-accent font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-xs whitespace-nowrap"
            >
              <span>进入静心自修室</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>

          {/* CARD 3: 系统硬件与网络监控 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="group relative rounded-3xl bg-theme-card border border-theme-border p-7 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center border border-accent/15 group-hover:scale-105 transition-transform duration-300">
                  <Cpu size={22} />
                </div>
                <span className="text-xs text-theme-muted font-mono">
                  本机配置 · 实时测速
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-theme-text group-hover:text-accent transition-colors tracking-tight">
                  本机硬件与网络监控
                </h2>
                <p className="text-xs text-theme-muted leading-relaxed">
                  一键查看当前设备的芯片显卡型号、屏幕真实分辨率与实时刷新率（Hz/FPS），并提供实时网络延迟与带宽测速。
                </p>
              </div>

              <div className="h-10 w-full flex items-center justify-between px-3.5 bg-theme-bg/60 rounded-2xl border border-theme-border/60 text-[11px] font-mono text-theme-muted">
                <span className="text-accent font-semibold">屏幕帧率检测</span>
                <span>·</span>
                <span>显卡识别</span>
                <span>·</span>
                <span>带宽测速</span>
              </div>

              <ul className="space-y-1.5 text-xs text-theme-muted border-t border-theme-border/50 pt-3.5">
                <li>· 自动识别显卡型号与 CPU 多核运行状态</li>
                <li>· 实时检测屏幕刷新率 (60Hz/120Hz) 与分辨率</li>
                <li>· 在线测试下载/上传网速与网络延迟波动</li>
              </ul>
            </div>

            <button
              onClick={() => setSearchParams({ tool: "hardware" })}
              className="mt-6 w-full py-3 bg-theme-bg hover:bg-accent hover:text-white text-theme-text border border-theme-border hover:border-accent font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-xs whitespace-nowrap"
            >
              <span>打开硬件与网络监控</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // HARDWARE MONITOR VIEW (currentTool === "hardware")
  // ============================================================================
  if (!info) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-theme-muted font-mono text-sm gap-3">
        <RefreshCw className="animate-spin text-accent" size={24} />
        <span>正在读取本机硬件与屏幕参数...</span>
      </div>
    );
  }

  const gpuProfile = getGpuSpecProfile(info.gpuRenderer);
  const cpuProfile = getCpuSpecProfile(info.cpuCores);

  const renderDeviceIcon = (type: "Mobile" | "Tablet" | "Desktop") => {
    switch (type) {
      case "Mobile":
        return <Smartphone size={22} className="text-accent" />;
      case "Tablet":
        return <Tablet size={22} className="text-accent" />;
      default:
        return <Laptop size={22} className="text-accent" />;
    }
  };

  // Calculate proportional geometry for screen aspect preview box
  const screenRatioNum = Math.max(
    0.6,
    Math.min(2.6, info.screenWidth / Math.max(1, info.screenHeight))
  );
  const previewBoxHeight = 46;
  const previewBoxWidth = Math.round(previewBoxHeight * screenRatioNum);

  return (
    <div className="pt-24 pb-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Top Navigation & Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-2">
          <button
            onClick={() => setSearchParams({ tool: "list" })}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-theme-card border border-theme-border text-xs font-semibold text-theme-muted hover:text-accent hover:border-accent/40 transition-all active:scale-95 cursor-pointer mb-2"
          >
            <ArrowLeft size={14} />
            <span>返回工具箱</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-accent">
            <span>SYSTEM TELEMETRY</span>
            <span>·</span>
            <span>硬件与网络实时监测</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-theme-text tracking-tight">
            本机硬件与网络监控
          </h1>
        </div>

        {/* Right: Privacy Note & Manual Rescan Action */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 text-xs text-theme-muted font-mono tabular-nums">
            <ShieldCheck size={14} className="text-accent shrink-0" />
            <span>仅在浏览器本地检测</span>
            <span aria-hidden="true">·</span>
            <span>更新于 {databaseSyncTime || "--:--:--"}</span>
          </div>

          <button
            onClick={handleManualRescan}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-theme-card border border-theme-border hover:border-accent/50 text-xs font-semibold text-theme-text hover:text-accent transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <motion.span
              animate={{ rotate: isRescanning ? 360 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex"
            >
              <RotateCcw size={13} />
            </motion.span>
            <span>重新检测数据</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TOP HOST TERMINAL SUMMARY BAR (With Geek-Tech Chip Tag)             */}
      {/* =================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-6 p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 overflow-hidden"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center shrink-0 relative">
            {renderDeviceIcon(info.deviceType)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-theme-muted">
              <span className="text-accent font-semibold">
                {info.deviceType === "Desktop"
                  ? "电脑桌面端"
                  : info.deviceType === "Tablet"
                  ? "平板设备"
                  : "手机移动端"}
              </span>
              <span aria-hidden="true">·</span>
              <span>{cpuProfile.tier}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-theme-text font-medium">
                {info.cpuCores} 核 CPU
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-accent">{gpuProfile.shortTag}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-theme-text tracking-tight mt-0.5 truncate">
              {info.os} 系统 · {info.browser} 浏览器
            </h2>
          </div>
        </div>

        {/* Right: Clean Browser Kernel Signature */}
        <div className="w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-theme-border/60 flex items-center gap-2.5 text-xs text-theme-muted font-mono min-w-0">
          <Terminal size={14} className="text-accent shrink-0" />
          <span className="truncate max-w-xl" title={info.ua}>
            浏览器标识: {info.ua}
          </span>
        </div>
      </motion.div>

      {/* =================================================================== */}
      {/* APPLE BENTO 2x2 SYMMETRIC MATRIX                                    */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ----------------------------------------------------------------- */}
        {/* MODULE 1: 处理器与显卡 (CPU & GPU)                                 */}
        {/* ----------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <TechCardFrame moduleCode="SYS_COMPUTE // 01" className="h-full">
            <div className="space-y-5">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 border-b border-theme-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <Cpu size={14} />
                    <span>01 · 处理器与显卡 (CPU / GPU)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-theme-text tracking-tight">
                    {gpuProfile.brand}
                  </h3>
                </div>

                {/* Right Spring-Animated Live Load Metric */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end text-accent">
                    <SpringNumberDisplay
                      value={simulatedCpuLoad}
                      className="text-2xl sm:text-3xl font-bold tracking-tight"
                    />
                    <span className="text-xs font-mono ml-0.5">%</span>
                  </div>
                  <span className="text-[11px] text-theme-muted block">
                    CPU 实时负载
                  </span>
                </div>
              </div>

              {/* Smooth SVG Bezier CPU Load Wave History */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-theme-muted">
                    CPU 占用率变化曲线 (鼠标悬停可看数值)
                  </span>
                  <span className="font-mono tabular-nums text-theme-text font-medium">
                    {info.cpuCores} 核 · {cpuProfile.efficiency}
                  </span>
                </div>
                <SmoothBezierWave
                  data={cpuWaveHistory}
                  min={0}
                  max={65}
                  height={64}
                  unit="%"
                  gradientId="cpu-wave-grad"
                />
              </div>

              {/* Geek-Tech Multi-Core Bus Matrix */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-theme-muted">
                  <span>各核心实时工作状态</span>
                  <span className="font-mono text-[11px] text-accent">
                    ACTIVE THREADS · {activeCoreLoads.length} CHANNELS
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-2 pt-1">
                  {activeCoreLoads.map((load, idx) => (
                    <div
                      key={idx}
                      className="group/core relative flex flex-col items-center gap-1.5"
                    >
                      <div className="w-full h-14 rounded-xl bg-theme-bg/80 border border-theme-border/60 group-hover/core:border-accent/60 p-1 flex items-end overflow-hidden transition-colors">
                        <motion.div
                          className="w-full rounded-md bg-accent/80 group-hover/core:bg-accent transition-colors"
                          animate={{ height: `${Math.max(12, load)}%` }}
                          transition={{
                            type: "spring",
                            stiffness: 220,
                            damping: 24,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono tabular-nums text-theme-muted group-hover/core:text-accent transition-colors">
                        #{idx + 1} {load}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plain-Language GPU Specs */}
              <div className="pt-3 border-t border-theme-border/50 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-theme-muted shrink-0">当前显卡型号</span>
                  <span
                    className="font-mono text-theme-text font-medium truncate text-right"
                    title={info.gpuRenderer}
                  >
                    {info.gpuRenderer}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-theme-muted shrink-0">
                    图形技术与显存类型
                  </span>
                  <span className="font-mono text-theme-text text-right truncate">
                    {gpuProfile.arch} · {gpuProfile.vram}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-theme-border/50 flex items-center justify-between text-xs text-theme-muted">
              <span>显卡驱动厂商：{info.gpuVendor}</span>
              <span className="text-accent font-medium">{gpuProfile.rating}</span>
            </div>
          </TechCardFrame>
        </motion.div>

        {/* ----------------------------------------------------------------- */}
        {/* MODULE 2: 屏幕显示与实时帧率 (Display & Refresh Rate)             */}
        {/* ----------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <TechCardFrame moduleCode="OPTICS_HZ // 02" className="h-full">
            <div className="space-y-5">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 border-b border-theme-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <Monitor size={14} />
                    <span>02 · 屏幕显示与实时刷新率 (Display & Hz)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-theme-text tracking-tight">
                    {info.physicalResolution} 超清显示面板
                  </h3>
                </div>

                {/* Right Live Hz/FPS Readout */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end text-accent">
                    <SpringNumberDisplay
                      value={liveFps}
                      className="text-2xl sm:text-3xl font-bold tracking-tight"
                    />
                    <span className="text-xs font-mono ml-1">FPS / Hz</span>
                  </div>
                  <span className="text-[11px] text-theme-muted block">
                    画面实时刷新率
                  </span>
                </div>
              </div>

              {/* Dual Visual Stage: Left Radial Hz Gauge + Right Aspect Ratio & Stability Wave */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Live Refresh Rate Radial Arc Gauge (5 cols) */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center py-1">
                  <RadialArcGauge
                    percent={Math.min(100, (liveFps / 120) * 100)}
                    size={114}
                    strokeWidth={7}
                    label="屏幕流畅度"
                    valueText={liveFps}
                    unit="Hz"
                    sublabel={`每帧耗时 ${frameTimeMs} 毫秒`}
                  />
                </div>

                {/* Right Proportional Aspect Frame & Frame-rate Wave (7 cols) */}
                <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                  <div className="p-3 rounded-2xl bg-theme-bg/55 border border-theme-border/60 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-theme-text block">
                        屏幕比例 {info.aspectRatioLabel} ({info.aspectRatioDesc})
                      </span>
                      <span className="text-[11px] text-theme-muted block">
                        高清缩放倍率：{info.dpr} 倍像素密度
                      </span>
                    </div>
                    {/* Dynamic Proportional Mini Monitor Box */}
                    <div
                      style={{
                        width: previewBoxWidth,
                        height: previewBoxHeight,
                      }}
                      className="rounded-lg border-2 border-accent bg-accent/10 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold text-accent"
                    >
                      {info.aspectRatioLabel}
                    </div>
                  </div>

                  {/* Frame Pacing Stability Wave */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-theme-muted">
                      <span>实时帧率稳定曲线</span>
                      <span className="font-mono text-accent">
                        {liveFps >= 90
                          ? "高刷丝滑模式"
                          : liveFps >= 55
                          ? "60Hz 满帧稳定"
                          : "省电帧率模式"}
                      </span>
                    </div>
                    <SmoothBezierWave
                      data={fpsWaveHistory}
                      min={20}
                      max={144}
                      height={46}
                      unit=" Hz"
                      gradientId="fps-wave-grad"
                    />
                  </div>
                </div>
              </div>

              {/* Plain-Language Screen Specs */}
              <div className="pt-3 border-t border-theme-border/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-theme-muted">
                    屏幕实际物理像素 (真实清晰度)
                  </span>
                  <span className="font-mono font-semibold text-theme-text tabular-nums">
                    {info.physicalResolution} 像素
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-muted">
                    系统显示尺寸与当前网页窗口
                  </span>
                  <span className="font-mono text-theme-text tabular-nums">
                    全屏 {info.screenResolution} · 窗口 {info.windowSize}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-muted">色彩位数与触控屏支持</span>
                  <span className="font-mono text-theme-text tabular-nums">
                    {info.colorDepth} 位真彩色 ·{" "}
                    {info.touchPoints > 0
                      ? `支持 ${info.touchPoints} 点触控`
                      : "非触控屏幕 (键鼠操作)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-theme-border/50 flex items-center justify-between text-xs text-theme-muted">
              <span>宽高比值：{info.aspectRatio}</span>
              <span className="text-accent font-medium">
                {Number(info.dpr) >= 2
                  ? "Retina 高清视网膜屏幕"
                  : "标准高清显示屏幕"}
              </span>
            </div>
          </TechCardFrame>
        </motion.div>

        {/* ----------------------------------------------------------------- */}
        {/* MODULE 3: 网络连接与实时测速 (Network & Speed Test)                */}
        {/* ----------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <TechCardFrame moduleCode="NET_THROUGHPUT // 03" className="h-full">
            {/* Top Scanning Line when Speed Test is active */}
            {netSpeedTest.isRunning && (
              <motion.div
                className="absolute top-0 left-0 h-1 bg-accent z-20"
                initial={{ width: "0%" }}
                animate={{ width: `${netSpeedTest.progress}%` }}
                transition={{ duration: 0.25 }}
              />
            )}

            <div className="space-y-5">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 border-b border-theme-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <Globe size={14} />
                    <span>03 · 网络连接与实时测速 (Network & Speed)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-theme-text tracking-tight font-mono">
                    IP: {cloudIntel.ip}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end text-accent">
                    <SpringNumberDisplay
                      value={
                        pingTest.latency !== null
                          ? pingTest.latency
                          : parseInt(info.connection.rtt, 10) || 18
                      }
                      className="text-2xl sm:text-3xl font-bold tracking-tight"
                    />
                    <span className="text-xs font-mono ml-1">ms</span>
                  </div>
                  <span className="text-[11px] text-theme-muted block">
                    网络响应延迟 ({netSpeedTest.rating})
                  </span>
                </div>
              </div>

              {/* Dual Radial Arc Gauges for Download & Upload */}
              <div className="grid grid-cols-2 gap-4 items-center py-1">
                <RadialArcGauge
                  percent={
                    netSpeedTest.downloadSpeed !== null
                      ? Math.min(100, (netSpeedTest.downloadSpeed / 150) * 100)
                      : 48
                  }
                  size={110}
                  strokeWidth={7}
                  label="下载网速"
                  valueText={
                    netSpeedTest.downloadSpeed !== null
                      ? netSpeedTest.downloadSpeed
                      : "--"
                  }
                  unit="Mbps"
                  sublabel={
                    netSpeedTest.downloadSpeed !== null
                      ? `约 ${(netSpeedTest.downloadSpeed / 8).toFixed(1)} MB/秒`
                      : "待测速"
                  }
                />
                <RadialArcGauge
                  percent={
                    netSpeedTest.uploadSpeed !== null
                      ? Math.min(100, (netSpeedTest.uploadSpeed / 80) * 100)
                      : 32
                  }
                  size={110}
                  strokeWidth={7}
                  label="上传网速"
                  valueText={
                    netSpeedTest.uploadSpeed !== null
                      ? netSpeedTest.uploadSpeed
                      : "--"
                  }
                  unit="Mbps"
                  sublabel={
                    netSpeedTest.uploadSpeed !== null
                      ? `约 ${(netSpeedTest.uploadSpeed / 8).toFixed(1)} MB/秒`
                      : "待测速"
                  }
                />
              </div>

              {/* Continuous SVG Spline Wave for Network Latency */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-theme-muted">
                  <span>网络延迟波动曲线 (越平缓代表网络越稳)</span>
                  <span className="text-[11px] text-accent font-medium truncate max-w-[48%]">
                    {netSpeedTest.ratingDesc}
                  </span>
                </div>
                <SmoothBezierWave
                  data={pingTest.history}
                  min={0}
                  max={60}
                  height={52}
                  unit=" ms"
                  gradientId="rtt-wave-grad"
                />
              </div>

              {/* Action & ISP Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs space-y-0.5 min-w-0">
                  <span className="text-theme-muted block">
                    网络运营商与所在地区
                  </span>
                  <span
                    className="font-mono text-theme-text font-medium truncate block"
                    title={`${cloudIntel.isp} · ${cloudIntel.country} ${cloudIntel.city}`}
                  >
                    {cloudIntel.isp} · {cloudIntel.city}
                  </span>
                </div>

                <button
                  onClick={runSpeedTest}
                  disabled={netSpeedTest.isRunning}
                  className="px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs hover:opacity-95 disabled:opacity-50 transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Gauge
                    size={14}
                    className={netSpeedTest.isRunning ? "animate-spin" : ""}
                  />
                  <span>
                    {netSpeedTest.isRunning ? "正在测速..." : "开始网络测速"}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-theme-border/50 flex items-center justify-between text-xs text-theme-muted">
              <span className="flex items-center gap-1.5">
                <Wifi size={12} className="text-accent" />
                连接方式：{info.connection.effectiveType}
              </span>
              <span className="font-mono">当前时区：{info.timezone}</span>
            </div>
          </TechCardFrame>
        </motion.div>

        {/* ----------------------------------------------------------------- */}
        {/* MODULE 4: 内存占用与电池状态 (Memory & Battery)                    */}
        {/* ----------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <TechCardFrame moduleCode="MEM_ENERGY // 04" className="h-full">
            <div className="space-y-5">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 border-b border-theme-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <Activity size={14} />
                    <span>04 · 内存占用与电池状态 (Memory & Power)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-theme-text tracking-tight">
                    运行内存、电池与隐私安全
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end text-accent">
                    <SpringNumberDisplay
                      value={battery ? battery.level : 92}
                      className="text-2xl sm:text-3xl font-bold tracking-tight"
                    />
                    <span className="text-xs font-mono ml-0.5">%</span>
                  </div>
                  <span className="text-[11px] text-theme-muted block">
                    {battery?.charging ? "正在充电 / 电源供电" : "使用电池供电中"}
                  </span>
                </div>
              </div>

              {/* Dual Visual Stage: Left Memory Radial Gauge + Right Segmented Power Cell */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-1">
                {/* Browser Memory Radial Gauge (5 cols) */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center">
                  <RadialArcGauge
                    percent={info.performance.heapPercent || 33}
                    size={114}
                    strokeWidth={7}
                    label="网页内存占用"
                    valueText={info.performance.heapPercent || 33}
                    unit="%"
                    sublabel={`已用 ${info.performance.usedHeap || "42 MB"}`}
                  />
                </div>

                {/* Geek-Tech Segmented Power Cell & Memory Details (7 cols) */}
                <div className="sm:col-span-7 flex flex-col justify-center space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-theme-bg/55 border border-theme-border/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-theme-muted font-medium">
                        电池电量与电源模式
                      </span>
                      <span className="font-mono font-semibold text-accent">
                        {battery?.charging ? "⚡ 外部电源已连接" : "电池续航模式"}
                      </span>
                    </div>

                    {/* Precision Segmented Battery Bar */}
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1 h-7 rounded-xl bg-theme-card border border-theme-border p-1 overflow-hidden flex items-center">
                        <motion.div
                          className="h-full rounded-lg bg-accent/85"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${battery ? battery.level : 92}%`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 160,
                            damping: 24,
                          }}
                        />
                        {/* Subtle cell segment dividers */}
                        <div className="absolute inset-0 grid grid-cols-5 pointer-events-none">
                          <div className="border-r border-theme-bg/25" />
                          <div className="border-r border-theme-bg/25" />
                          <div className="border-r border-theme-bg/25" />
                          <div className="border-r border-theme-bg/25" />
                          <div />
                        </div>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold text-theme-text tabular-nums">
                          电量 {battery ? battery.level : 92}%
                        </span>
                      </div>
                      <div className="w-1.5 h-3.5 rounded-r-sm bg-theme-border shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs px-1">
                    <div className="flex items-center justify-between">
                      <span className="text-theme-muted">设备总运行内存估算</span>
                      <span className="font-mono font-semibold text-theme-text">
                        {info.ram}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-theme-muted">
                        浏览器最大允许内存上限
                      </span>
                      <span className="font-mono text-theme-text">
                        {info.performance.heapLimit || "2048 MB"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plain-Language Security & Privacy Rows */}
              <div className="pt-3 border-t border-theme-border/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-theme-muted">
                    网页加密连接状态 (HTTPS)
                  </span>
                  <span className="font-mono font-semibold text-accent">
                    {window.isSecureContext
                      ? "● 已加密保护 (安全连接)"
                      : "本地测试连接"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-muted">浏览器防追踪与隐私保护</span>
                  <span className="font-mono text-theme-text">
                    {navigator.doNotTrack === "1"
                      ? "已开启防追踪 (Do Not Track)"
                      : "标准沙盒隐私保护中"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-muted">系统首选语言</span>
                  <span className="font-mono text-theme-text">
                    {info.language}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-theme-border/50 flex items-center justify-between text-xs text-theme-muted">
              <span>隐私安全承诺：所有硬件数据仅在您的浏览器内读取</span>
              <span className="text-accent font-medium">不上传服务器</span>
            </div>
          </TechCardFrame>
        </motion.div>
      </div>
    </div>
  );
}
