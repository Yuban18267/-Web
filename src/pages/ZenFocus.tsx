import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Mic,
  Upload,
  Clock,
  Flame,
  CloudRain,
  Waves,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Layers,
  Eye,
  Sparkles,
  Music,
} from "lucide-react";

// Two curated Apple-inspired fluid visualizers
type VisualStyle = "silk" | "halo";

// Three curated scenario-based white noise presets
type PresetId = "none" | "rain" | "campfire" | "ocean";

// Layer composition modes (especially for fullscreen)
type DisplayLayer = "both" | "clockOnly" | "visualOnly";

// Primary clock focus mode (can switch between Pomodoro dominant or Real-time Clock dominant, while showing both)
type ClockPrimaryView = "pomodoro" | "realtime";

interface PresetConfig {
  id: PresetId;
  title: string;
  subtitle: string;
  sceneTag: string;
  icon: React.ReactNode;
  volumes: {
    rain: number;
    ocean: number;
    fire: number;
    wind: number;
  };
}

const WHITE_NOISE_PRESETS: PresetConfig[] = [
  {
    id: "rain",
    title: "深度专注 · 听雨",
    subtitle: "细腻屋檐春雨与微弱低频白噪，屏蔽外界人声干扰",
    sceneTag: "沉浸编码 / 深度写作",
    icon: <CloudRain size={18} />,
    volumes: { rain: 0.65, ocean: 0.0, fire: 0.0, wind: 0.18 },
  },
  {
    id: "campfire",
    title: "静心阅读 · 营火",
    subtitle: "温暖木柴轻响与柔和粉红噪基底，营造安定室内氛围",
    sceneTag: "长文阅读 / 整理思绪",
    icon: <Flame size={18} />,
    volumes: { rain: 0.12, ocean: 0.0, fire: 0.72, wind: 0.0 },
  },
  {
    id: "ocean",
    title: "舒缓小憩 · 海风",
    subtitle: "慢呼吸潮汐律动与远岸微风，帮助大脑放空与恢复",
    sceneTag: "闭目调息 / 灵感放空",
    icon: <Waves size={18} />,
    volumes: { rain: 0.0, ocean: 0.68, fire: 0.0, wind: 0.32 },
  },
];

interface AudioEngineRef {
  audioCtx: AudioContext | null;
  analyser: AnalyserNode | null;
  microphoneSource: MediaStreamAudioSourceNode | null;
  fileSource: MediaElementAudioSourceNode | null;
  noiseNodes: {
    [key: string]: {
      gain: GainNode;
      filter?: BiquadFilterNode;
      source?: AudioBufferSourceNode;
      lfo?: OscillatorNode;
    };
  };
}

/**
 * Apple-style spring animated digit component.
 * Uses physical spring parameters (stiffness 300, damping 28) for smooth vertical roll.
 */
const SpringDigit: React.FC<{
  char: string;
  sizeClass?: string;
}> = ({ char, sizeClass = "text-6xl md:text-8xl" }) => {
  const isSeparator = char === ":";

  if (isSeparator) {
    return (
      <span
        className={`inline-flex items-center justify-center px-0.5 md:px-1.5 font-light opacity-50 select-none ${sizeClass}`}
      >
        :
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center justify-center w-[0.62em] h-[1.15em] overflow-hidden align-middle select-none tabular-nums ${sizeClass}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "75%", opacity: 0, filter: "blur(4px)", scale: 0.92 }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ y: "-75%", opacity: 0, filter: "blur(4px)", scale: 0.92 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
            mass: 0.85,
          }}
          className="absolute inset-0 flex items-center justify-center font-semibold tracking-tight tabular-nums leading-none"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default function ZenFocus() {
  // ---- DISPLAY & FULLSCREEN STATES ----
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayLayer, setDisplayLayer] = useState<DisplayLayer>("both");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("silk");
  const [primaryView, setPrimaryView] = useState<ClockPrimaryView>("pomodoro");
  const [controlsVisible, setControlsVisible] = useState(true);
  const idleTimerRef = useRef<number | null>(null);

  // ---- REAL-TIME SYSTEM CLOCK ----
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const currentHours = String(now.getHours()).padStart(2, "0");
  const currentMinutes = String(now.getMinutes()).padStart(2, "0");
  const currentSeconds = String(now.getSeconds()).padStart(2, "0");
  const currentDateLabel = now.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  // ---- POMODORO TIMER STATES ----
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const pomoMins = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const pomoSecs = String(remainingSeconds % 60).padStart(2, "0");
  const progressRatio =
    totalSeconds > 0
      ? Math.max(0, Math.min(1, 1 - remainingSeconds / totalSeconds))
      : 0;

  // ---- AUDIO & PRESET STATES ----
  const [activePreset, setActivePreset] = useState<PresetId>("none");
  const [masterVolume, setMasterVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isFilePlaying, setIsFilePlaying] = useState<boolean>(false);

  // ---- AUDIO ENGINE & CANVAS REFS ----
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const freqDataRef = useRef<Uint8Array | null>(null);
  const smoothedBinsRef = useRef<Float32Array>(new Float32Array(32));
  const smoothedBassRef = useRef<number>(0.12);
  const smoothedMidRef = useRef<number>(0.1);
  const phaseRef = useRef<number>(0);

  const engine = useRef<AudioEngineRef>({
    audioCtx: null,
    analyser: null,
    microphoneSource: null,
    fileSource: null,
    noiseNodes: {},
  });

  // ---- SOFT CHIME ON TIMER COMPLETE ----
  const playSoftChime = useCallback(() => {
    try {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const startTime = ctx.currentTime + idx * 0.16;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.09, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.45);
      });
    } catch {
      // Ignore audio context restriction errors
    }
  }, []);

  // ---- POMODORO COUNTDOWN LOOP ----
  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          playSoftChime();
          if (timerMode === "focus") {
            setCompletedSessions((s) => s + 1);
            setTimerMode("break");
            setTotalSeconds(5 * 60);
            return 5 * 60;
          } else {
            setTimerMode("focus");
            setTotalSeconds(25 * 60);
            return 25 * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, timerMode, playSoftChime]);

  // ---- TIMER CONTROLS (ACCESSIBLE ANYTIME) ----
  const adjustTimerMinutes = (deltaMinutes: number) => {
    setRemainingSeconds((prev) => {
      const next = Math.max(60, Math.min(180 * 60, prev + deltaMinutes * 60));
      setTotalSeconds((currTotal) => Math.max(currTotal, next));
      return next;
    });
  };

  const applyTimerPreset = (mode: "focus" | "break", minutes: number) => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setTotalSeconds(minutes * 60);
    setRemainingSeconds(minutes * 60);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  // ---- WEB AUDIO INITIALIZATION ----
  const initializeAudioEngine = useCallback(() => {
    if (engine.current.audioCtx) {
      if (engine.current.audioCtx.state === "suspended") {
        engine.current.audioCtx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128; // Low FFT size for ultra-light CPU usage and smooth macro bands
      analyser.smoothingTimeConstant = 0.88;
      analyser.connect(ctx.destination);

      engine.current.audioCtx = ctx;
      engine.current.analyser = analyser;

      // Create procedural noise generators for the 3 scenario presets
      const createNoiseBuffer = (type: "white" | "pink" | "brown") => {
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let lastOut = 0.0;
        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === "white") {
            output[i] = white * 0.5;
          } else if (type === "pink") {
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.969 * b2 + white * 0.153852;
            b3 = 0.8665 * b3 + white * 0.3104856;
            b4 = 0.55 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.016898;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
            b6 = white * 0.115926;
          } else {
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 2.8;
          }
        }
        return buffer;
      };

      const setupChannel = (
        key: string,
        noiseType: "white" | "pink" | "brown",
        filterFreq: number,
        filterType: BiquadFilterType,
        lfoRate?: number,
        lfoDepth?: number
      ) => {
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.connect(analyser);

        const source = ctx.createBufferSource();
        source.buffer = createNoiseBuffer(noiseType);
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.Q.setValueAtTime(0.9, ctx.currentTime);
        filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        source.start(0);

        let lfo: OscillatorNode | undefined;
        if (lfoRate && lfoDepth) {
          lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.type = "sine";
          lfo.frequency.setValueAtTime(lfoRate, ctx.currentTime);
          lfoGain.gain.setValueAtTime(lfoDepth, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          lfo.start();
        }

        engine.current.noiseNodes[key] = {
          gain: gainNode,
          filter,
          source,
          lfo,
        };
      };

      setupChannel("rain", "pink", 1050, "bandpass");
      setupChannel("ocean", "brown", 260, "lowpass", 0.07, 110);
      setupChannel("fire", "pink", 1250, "lowpass", 0.18, 220);
      setupChannel("wind", "pink", 520, "bandpass", 0.05, 180);
    } catch (e) {
      console.warn("Web Audio initialization skipped:", e);
    }
  }, []);

  // ---- APPLY 3 WHITE NOISE PRESETS WITH SMOOTH CROSSFADE ----
  const applyPresetVolumes = useCallback(
    (presetId: PresetId, vol: number, muted: boolean) => {
      const ctx = engine.current.audioCtx;
      if (!ctx) return;

      const preset = WHITE_NOISE_PRESETS.find((p) => p.id === presetId);
      const targets = preset
        ? preset.volumes
        : { rain: 0, ocean: 0, fire: 0, wind: 0 };

      (["rain", "ocean", "fire", "wind"] as const).forEach((ch) => {
        const node = engine.current.noiseNodes[ch];
        if (node) {
          const targetGain = muted ? 0 : targets[ch] * vol;
          // 0.35s time constant gives a warm, Apple-like fade transition
          node.gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.35);
        }
      });
    },
    []
  );

  const handleSelectPreset = (presetId: PresetId) => {
    initializeAudioEngine();
    const nextPreset = activePreset === presetId ? "none" : presetId;
    setActivePreset(nextPreset);
    applyPresetVolumes(nextPreset, masterVolume, isMuted);
  };

  const handleVolumeSlider = (val: number) => {
    setMasterVolume(val);
    initializeAudioEngine();
    applyPresetVolumes(activePreset, val, isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    applyPresetVolumes(activePreset, masterVolume, nextMute);
    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  // ---- MICROPHONE / SYSTEM AUDIO INPUT ----
  const toggleMicrophone = async () => {
    initializeAudioEngine();
    const ctx = engine.current.audioCtx;
    const analyser = engine.current.analyser;
    if (!ctx || !analyser) return;

    setMicError(null);

    if (isMicOn) {
      if (engine.current.microphoneSource) {
        try {
          engine.current.microphoneSource.disconnect();
        } catch {}
        engine.current.microphoneSource = null;
      }
      setIsMicOn(false);
      try {
        analyser.connect(ctx.destination);
      } catch {}
    } else {
      try {
        // Disconnect analyser from destination while mic is active to avoid feedback loop
        try {
          analyser.disconnect(ctx.destination);
        } catch {}
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const micSource = ctx.createMediaStreamSource(stream);
        micSource.connect(analyser);
        engine.current.microphoneSource = micSource;
        setIsMicOn(true);
      } catch {
        try {
          analyser.connect(ctx.destination);
        } catch {}
        setMicError("未获取到麦克风权限，请检查浏览器授权或使用本地音频导入");
      }
    }
  };

  // ---- LOCAL AUDIO FILE IMPORT ----
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    initializeAudioEngine();
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (isMicOn) {
      toggleMicrophone();
    }

    const ctx = engine.current.audioCtx;
    const analyser = engine.current.analyser;
    if (!ctx || !analyser) return;

    try {
      if (!audioRef.current) {
        const audioEl = new Audio();
        audioEl.crossOrigin = "anonymous";
        audioEl.loop = true;
        audioRef.current = audioEl;

        const fileSrc = ctx.createMediaElementSource(audioEl);
        fileSrc.connect(analyser);
        engine.current.fileSource = fileSrc;
      }

      const fileURL = URL.createObjectURL(file);
      audioRef.current.src = fileURL;
      audioRef.current.volume = isMuted ? 0 : masterVolume;
      audioRef.current
        .play()
        .then(() => setIsFilePlaying(true))
        .catch(() => setIsFilePlaying(false));
    } catch (err) {
      console.warn("Audio file load error:", err);
    }
  };

  const toggleFilePlayback = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsFilePlaying(true));
    } else {
      audioRef.current.pause();
      setIsFilePlaying(false);
    }
  };

  // ---- FULLSCREEN MANAGEMENT ----
  const toggleFullscreen = async () => {
    const el = stageContainerRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fallback for iframe environments that restrict native requestFullscreen
      setIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Auto-hide bottom dock after 3.5s of mouse inactivity in fullscreen mode
  const handleStagePointerMove = useCallback(() => {
    setControlsVisible(true);
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    if (isFullscreen) {
      idleTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 3600);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) {
      setControlsVisible(true);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    } else {
      handleStagePointerMove();
    }
  }, [isFullscreen, handleStagePointerMove]);

  // ---- LOW-OVERHEAD APPLE-INSPIRED FLUID CANVAS ENGINE ----
  useEffect(() => {
    // When user chooses "clockOnly", completely suspend Canvas loop for zero GPU load
    if (displayLayer === "clockOnly") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isMounted = true;

    const render = (timestamp: number) => {
      if (!isMounted || !canvasRef.current) return;
      animationFrameRef.current = requestAnimationFrame(render);

      const analyser = engine.current.analyser;
      const hasActiveAudio =
        analyser &&
        (activePreset !== "none" ||
          isMicOn ||
          (uploadedFileName && isFilePlaying));

      const bins = smoothedBinsRef.current;
      const t = timestamp * 0.00045; // Deliberately slow, serene time base

      if (analyser && hasActiveAudio) {
        const binCount = analyser.frequencyBinCount;
        if (!freqDataRef.current || freqDataRef.current.length !== binCount) {
          freqDataRef.current = new Uint8Array(binCount);
        }
        analyser.getByteFrequencyData(freqDataRef.current);

        let bassSum = 0;
        let midSum = 0;
        for (let i = 0; i < 32; i++) {
          const raw = (freqDataRef.current[i] || 0) / 255;
          // Heavy inertial damping (0.93) for Apple-grade viscous smoothness
          bins[i] = bins[i] * 0.93 + raw * 0.07;
          if (i < 10) bassSum += bins[i];
          else midSum += bins[i];
        }
        const targetBass = bassSum / 10;
        const targetMid = midSum / 22;
        smoothedBassRef.current =
          smoothedBassRef.current * 0.94 + targetBass * 0.06;
        smoothedMidRef.current =
          smoothedMidRef.current * 0.94 + targetMid * 0.06;
      } else {
        // Gentle autonomous breathing rhythm when no audio is playing
        const idleBreath = 0.14 + Math.sin(t * 1.4) * 0.045;
        smoothedBassRef.current =
          smoothedBassRef.current * 0.95 + idleBreath * 0.05;
        smoothedMidRef.current =
          smoothedMidRef.current * 0.95 +
          (0.1 + Math.cos(t * 1.1) * 0.035) * 0.05;
        for (let i = 0; i < 32; i++) {
          const wave =
            0.12 +
            Math.sin(i * 0.22 - t * 1.8) * 0.05 +
            Math.cos(i * 0.11 + t * 1.2) * 0.04;
          bins[i] = bins[i] * 0.94 + wave * 0.06;
        }
      }

      // Cap DPR at 1.5 for ultra-low power consumption while maintaining crisp curves
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      const targetW = Math.max(1, Math.round(rect.width * dpr));
      const targetH = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const brandColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--brand-color")
          .trim() || "#2563eb";

      const bass = smoothedBassRef.current;
      const mid = smoothedMidRef.current;
      phaseRef.current += 0.0022 + bass * 0.0035;
      const phase = phaseRef.current;

      if (visualStyle === "silk") {
        // ============================================================
        // EFFECT 1: FLUID SILK WAVES (Apple Music / Sonoma Silk Ribbon)
        // 3 layered smooth bezier ribbons with soft vertical gradients
        // ============================================================
        const ribbonConfigs = [
          {
            alphaHex: "38",
            strokeHex: "75",
            yRatio: 0.62,
            speed: 0.9,
            ampScale: 1.0,
            offset: 0,
          },
          {
            alphaHex: "24",
            strokeHex: "50",
            yRatio: 0.66,
            speed: 0.65,
            ampScale: 0.78,
            offset: 1.9,
          },
          {
            alphaHex: "16",
            strokeHex: "35",
            yRatio: 0.7,
            speed: 0.45,
            ampScale: 0.58,
            offset: 3.8,
          },
        ];

        const segments = 12;
        const stepX = width / segments;

        for (let r = 0; r < ribbonConfigs.length; r++) {
          const cfg = ribbonConfigs[r];
          const baseY = height * cfg.yRatio;
          const maxAmp = height * (0.065 + bass * 0.18) * cfg.ampScale;

          const grad = ctx.createLinearGradient(0, baseY - maxAmp * 1.4, 0, height);
          grad.addColorStop(0, `${brandColor}${cfg.alphaHex}`);
          grad.addColorStop(0.65, `${brandColor}0c`);
          grad.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.moveTo(0, height);

          let prevX = 0;
          let prevY = baseY;

          for (let i = 0; i <= segments; i++) {
            const x = i * stepX;
            const binIdx = (i * 2 + r * 3) % 24;
            const audioLift = bins[binIdx] * maxAmp;
            const organicWave =
              Math.sin(i * 0.45 - phase * cfg.speed * 4 + cfg.offset) *
                (height * 0.028) +
              Math.cos(i * 0.25 + phase * cfg.speed * 2.5) * (height * 0.018);

            const y = baseY - audioLift + organicWave;

            if (i === 0) {
              ctx.lineTo(x, y);
            } else {
              const cx = (prevX + x) * 0.5;
              const cy = (prevY + y) * 0.5;
              ctx.quadraticCurveTo(prevX, prevY, cx, cy);
            }
            prevX = x;
            prevY = y;
          }

          ctx.lineTo(width, prevY);
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          // Delicate upper silk edge highlight
          ctx.beginPath();
          for (let i = 0; i <= segments; i++) {
            const x = i * stepX;
            const binIdx = (i * 2 + r * 3) % 24;
            const audioLift = bins[binIdx] * maxAmp;
            const organicWave =
              Math.sin(i * 0.45 - phase * cfg.speed * 4 + cfg.offset) *
                (height * 0.028) +
              Math.cos(i * 0.25 + phase * cfg.speed * 2.5) * (height * 0.018);
            const y = baseY - audioLift + organicWave;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              const cx = (prevX + x) * 0.5;
              const cy = (prevY + y) * 0.5;
              ctx.quadraticCurveTo(prevX, prevY, cx, cy);
            }
            prevX = x;
            prevY = y;
          }
          ctx.strokeStyle = `${brandColor}${cfg.strokeHex}`;
          ctx.lineWidth = (1.6 - r * 0.35) * dpr;
          ctx.stroke();
        }
      } else {
        // ============================================================
        // EFFECT 2: BREATHING HALO RING (Siri / HomePod Ambient Halo)
        // Concentric smooth closed spline rings with radial aura glow
        // ============================================================
        const cx = width * 0.5;
        const cy = height * 0.5;
        const minDim = Math.min(width, height);
        const baseRadius = minDim * (0.21 + bass * 0.065);

        // Soft ambient radial aura
        const aura = ctx.createRadialGradient(
          cx,
          cy,
          baseRadius * 0.2,
          cx,
          cy,
          baseRadius * 1.85
        );
        aura.addColorStop(0, `${brandColor}28`);
        aura.addColorStop(0.55, `${brandColor}0e`);
        aura.addColorStop(1, "transparent");

        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.85, 0, Math.PI * 2);
        ctx.fill();

        // Two harmonic closed spline rings
        const rings = [
          { scale: 1.0, alpha: "95", width: 2.2, dir: 1, harmonic: 3 },
          { scale: 1.16, alpha: "42", width: 1.3, dir: -0.7, harmonic: 5 },
        ];

        const nodes = 48;
        for (let r = 0; r < rings.length; r++) {
          const ring = rings[r];
          ctx.beginPath();

          for (let i = 0; i <= nodes; i++) {
            const norm = (i % nodes) / nodes;
            const angle = norm * Math.PI * 2 + phase * ring.dir;
            // Mirror index so the closed loop is 100% seamless
            const mirrorIdx =
              i % nodes < nodes / 2 ? i % nodes : nodes - (i % nodes);
            const binVal = bins[mirrorIdx % 20];

            const waveDeform =
              Math.sin(norm * Math.PI * 2 * ring.harmonic + phase * 2) *
              (minDim * 0.012 * (1 + mid * 2));
            const audioExpand = binVal * (minDim * 0.095);
            const rad = baseRadius * ring.scale + audioExpand + waveDeform;

            const x = cx + Math.cos(angle) * rad;
            const y = cy + Math.sin(angle) * rad;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.closePath();
          ctx.strokeStyle = `${brandColor}${ring.alpha}`;
          ctx.lineWidth = ring.width * dpr;
          ctx.stroke();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    displayLayer,
    visualStyle,
    activePreset,
    isMicOn,
    uploadedFileName,
    isFilePlaying,
  ]);

  // Cleanup Web Audio on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (engine.current.audioCtx) {
        try {
          engine.current.audioCtx.close();
        } catch {}
      }
    };
  }, []);

  const activePresetObj = WHITE_NOISE_PRESETS.find((p) => p.id === activePreset);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      {/* Top Minimal Header (Hidden when fullscreen) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pt-2">
        <div>
          <p className="text-xs font-medium text-theme-muted tracking-wide mb-1">
            自律学习空间 · Focus & StandBy
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-theme-text tracking-tight">
            静心自修室
          </h1>
        </div>

        {/* Active sound status summary & quick master volume */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-theme-card border border-theme-border">
            <button
              onClick={toggleMute}
              className="text-theme-muted hover:text-theme-text transition-colors cursor-pointer"
              title={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={masterVolume}
              onChange={(e) => handleVolumeSlider(parseFloat(e.target.value))}
              className="w-20 sm:w-24 h-1 rounded-full bg-theme-border appearance-none cursor-pointer accent-accent"
              aria-label="主音量"
            />
            <span className="text-xs font-mono tabular-nums text-theme-muted w-8 text-right">
              {isMuted ? "0%" : `${Math.round(masterVolume * 100)}%`}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent text-white text-xs font-semibold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Maximize2 size={14} />
            <span>全屏沉浸时钟</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN APPLE STANDBY STAGE (SUPPORTS NATIVE & VIEWPORT FULLSCREEN)      */}
      {/* ===================================================================== */}
      <div
        ref={stageContainerRef}
        onMouseMove={handleStagePointerMove}
        onTouchStart={handleStagePointerMove}
        className={`relative overflow-hidden transition-all duration-500 flex flex-col justify-between select-none ${
          isFullscreen
            ? "fixed inset-0 z-50 w-screen h-screen rounded-none bg-zinc-950 text-zinc-100 p-6 sm:p-10"
            : "w-full min-h-[540px] sm:min-h-[600px] rounded-3xl bg-theme-card border border-theme-border shadow-sm p-6 sm:p-10"
        }`}
      >
        {/* LAYER 1: FLUID AUDIO RHYTHM CANVAS */}
        <AnimatePresence>
          {displayLayer !== "clockOnly" && (
            <motion.canvas
              key="rhythm-canvas"
              ref={canvasRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full absolute inset-0 block pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* TOP BAR INSIDE STAGE: Mode Switchers, Layer Toggle & Fullscreen Exit */}
        <motion.div
          animate={{
            opacity: controlsVisible ? 1 : 0,
            y: controlsVisible ? 0 : -10,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex flex-wrap items-center justify-between gap-3"
        >
          {/* Left: Primary Clock Focus Switcher (Pomodoro vs System Clock) */}
          <div
            className={`inline-flex items-center p-1 rounded-2xl backdrop-blur-xl border ${
              isFullscreen
                ? "bg-white/10 border-white/15"
                : "bg-theme-bg/80 border-theme-border"
            }`}
          >
            {(
              [
                { id: "pomodoro", label: "番茄专注钟" },
                { id: "realtime", label: "全屏实时钟" },
              ] as const
            ).map((tab) => {
              const active = primaryView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPrimaryView(tab.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? isFullscreen
                        ? "text-zinc-950"
                        : "text-white"
                      : isFullscreen
                      ? "text-zinc-300 hover:text-white"
                      : "text-theme-muted hover:text-theme-text"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="primary-clock-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className={`absolute inset-0 rounded-xl ${
                        isFullscreen ? "bg-white" : "bg-accent"
                      }`}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Center/Right: Layer Composition Mode & Rhythm Style Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Layer Toggle: Overlay Both / Clock Only / Rhythm Only */}
            <div
              className={`inline-flex items-center p-1 rounded-2xl backdrop-blur-xl border ${
                isFullscreen
                  ? "bg-white/10 border-white/15"
                  : "bg-theme-bg/80 border-theme-border"
              }`}
              title="切换全屏时钟与音乐律动的叠加方式"
            >
              {(
                [
                  { id: "both", label: "时钟+律动叠加", icon: <Layers size={12} /> },
                  { id: "clockOnly", label: "仅时钟", icon: <Clock size={12} /> },
                  { id: "visualOnly", label: "仅律动", icon: <Eye size={12} /> },
                ] as const
              ).map((item) => {
                const active = displayLayer === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDisplayLayer(item.id)}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? isFullscreen
                          ? "text-zinc-950 font-semibold"
                          : "text-theme-text font-semibold"
                        : isFullscreen
                        ? "text-zinc-400 hover:text-white"
                        : "text-theme-muted hover:text-theme-text"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="display-layer-pill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        className={`absolute inset-0 rounded-xl shadow-xs ${
                          isFullscreen
                            ? "bg-white"
                            : "bg-theme-card border border-theme-border"
                        }`}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Visual Style Toggle (Silk Waves vs Breathing Halo) */}
            {displayLayer !== "clockOnly" && (
              <div
                className={`inline-flex items-center p-1 rounded-2xl backdrop-blur-xl border ${
                  isFullscreen
                    ? "bg-white/10 border-white/15"
                    : "bg-theme-bg/80 border-theme-border"
                }`}
              >
                {(
                  [
                    { id: "silk", label: "流光丝绸" },
                    { id: "halo", label: "呼吸光环" },
                  ] as const
                ).map((style) => {
                  const active = visualStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setVisualStyle(style.id)}
                      className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? "text-accent font-semibold"
                          : isFullscreen
                          ? "text-zinc-400 hover:text-white"
                          : "text-theme-muted hover:text-theme-text"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="visual-style-pill"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                          className={`absolute inset-0 rounded-xl ${
                            isFullscreen
                              ? "bg-white/15"
                              : "bg-accent/12"
                          }`}
                        />
                      )}
                      <span className="relative z-10">{style.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className={`p-2.5 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer ${
                isFullscreen
                  ? "bg-white/10 border-white/15 text-white hover:bg-white/20"
                  : "bg-theme-bg/80 border-theme-border text-theme-muted hover:text-theme-text"
              }`}
              title={isFullscreen ? "退出全屏 (ESC)" : "全屏显示"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </motion.div>

        {/* =================================================================== */}
        {/* LAYER 2: CENTER STANDBY CLOCK & POMODORO INTERACTIVE STAGE          */}
        {/* =================================================================== */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
          <AnimatePresence mode="wait">
            {displayLayer === "visualOnly" ? (
              /* Pure Rhythm View: Minimalist floating time whisper at top-center */
              <motion.div
                key="visual-only-whisper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center pointer-events-auto"
              >
                <div
                  onClick={() => setDisplayLayer("both")}
                  className={`px-5 py-2.5 rounded-full backdrop-blur-xl border text-xs font-mono tabular-nums flex items-center gap-3 cursor-pointer transition-transform hover:scale-105 ${
                    isFullscreen
                      ? "bg-white/10 border-white/15 text-zinc-200"
                      : "bg-theme-bg/75 border-theme-border text-theme-text"
                  }`}
                  title="点击恢复时钟显示"
                >
                  <span>
                    实时 {currentHours}:{currentMinutes}:{currentSeconds}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-accent font-semibold">
                    {timerMode === "focus" ? "专注" : "休息"} {pomoMins}:{pomoSecs}
                  </span>
                </div>
              </motion.div>
            ) : primaryView === "pomodoro" ? (
              /* POMODORO PRIMARY VIEW (With companion live system clock above) */
              <motion.div
                key="pomodoro-primary"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                }}
                className="flex flex-col items-center text-center w-full max-w-2xl"
              >
                {/* Live Real-Time Clock Companion Row */}
                <button
                  onClick={() => setPrimaryView("realtime")}
                  className={`group mb-4 inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono tabular-nums transition-opacity cursor-pointer ${
                    isFullscreen
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-theme-muted hover:text-theme-text"
                  }`}
                  title="点击切换主视图为实时时钟"
                >
                  <span>{currentDateLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold">
                    {currentHours}:{currentMinutes}:{currentSeconds}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>已完成 {completedSessions} 轮专注</span>
                </button>

                {/* Pomodoro Mode Presets (25m / 45m / 5m / 15m) */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
                  {[
                    { mode: "focus" as const, mins: 25, label: "25m 标准专注" },
                    { mode: "focus" as const, mins: 45, label: "45m 深度沉浸" },
                    { mode: "break" as const, mins: 5, label: "5m 呼吸小憩" },
                    { mode: "break" as const, mins: 15, label: "15m 漫步放空" },
                  ].map((preset) => {
                    const isSelected =
                      timerMode === preset.mode &&
                      totalSeconds === preset.mins * 60;
                    return (
                      <button
                        key={preset.label}
                        onClick={() =>
                          applyTimerPreset(preset.mode, preset.mins)
                        }
                        className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-accent text-white shadow-xs"
                            : isFullscreen
                            ? "bg-white/8 text-zinc-300 hover:bg-white/15"
                            : "bg-theme-bg/70 text-theme-muted hover:text-theme-text border border-theme-border/60"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Giant Spring-Animated Pomodoro Countdown */}
                <div className="flex items-center justify-center gap-3 sm:gap-6 my-2">
                  {/* -5m Quick Adjust Button */}
                  <button
                    onClick={() => adjustTimerMinutes(-5)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                      isFullscreen
                        ? "bg-white/8 border-white/15 text-zinc-300 hover:bg-white/15 hover:text-white"
                        : "bg-theme-bg/80 border-theme-border text-theme-muted hover:text-theme-text hover:border-accent/40"
                    }`}
                    title="减少 5 分钟"
                    aria-label="减少 5 分钟"
                  >
                    <Minus size={18} />
                  </button>

                  {/* Animated Digits Display */}
                  <div
                    className={`font-mono tracking-tight flex items-center justify-center ${
                      isFullscreen
                        ? "text-white"
                        : "text-theme-text"
                    }`}
                  >
                    {pomoMins.split("").map((d, i) => (
                      <SpringDigit
                        key={`pomo-m-${i}`}
                        char={d}
                        sizeClass={
                          isFullscreen
                            ? "text-7xl sm:text-8xl md:text-9xl"
                            : "text-6xl sm:text-7xl md:text-8xl"
                        }
                      />
                    ))}
                    <SpringDigit
                      char=":"
                      sizeClass={
                        isFullscreen
                          ? "text-6xl sm:text-7xl md:text-8xl"
                          : "text-5xl sm:text-6xl md:text-7xl"
                      }
                    />
                    {pomoSecs.split("").map((d, i) => (
                      <SpringDigit
                        key={`pomo-s-${i}`}
                        char={d}
                        sizeClass={
                          isFullscreen
                            ? "text-7xl sm:text-8xl md:text-9xl"
                            : "text-6xl sm:text-7xl md:text-8xl"
                        }
                      />
                    ))}
                  </div>

                  {/* +5m Quick Adjust Button */}
                  <button
                    onClick={() => adjustTimerMinutes(5)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                      isFullscreen
                        ? "bg-white/8 border-white/15 text-zinc-300 hover:bg-white/15 hover:text-white"
                        : "bg-theme-bg/80 border-theme-border text-theme-muted hover:text-theme-text hover:border-accent/40"
                    }`}
                    title="增加 5 分钟"
                    aria-label="增加 5 分钟"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Subtle Hairline Progress Track */}
                <div
                  className={`w-56 sm:w-72 h-1 rounded-full overflow-hidden my-4 ${
                    isFullscreen ? "bg-white/15" : "bg-theme-border"
                  }`}
                >
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    animate={{ width: `${progressRatio * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>

                {/* Primary Timer Action Buttons */}
                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={() => {
                      initializeAudioEngine();
                      setIsTimerRunning((r) => !r);
                    }}
                    className={`px-7 py-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm ${
                      isTimerRunning
                        ? isFullscreen
                          ? "bg-white text-zinc-950"
                          : "bg-theme-text text-theme-bg"
                        : "bg-accent text-white"
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause size={15} />
                        <span>暂停倒计时</span>
                      </>
                    ) : (
                      <>
                        <Play size={15} />
                        <span>
                          {timerMode === "focus" ? "开始专注" : "开始休息"}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetTimer}
                    className={`p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                      isFullscreen
                        ? "bg-white/10 border-white/15 text-zinc-300 hover:text-white"
                        : "bg-theme-bg/80 border-theme-border text-theme-muted hover:text-theme-text"
                    }`}
                    title="重置当前番茄钟"
                    aria-label="重置当前番茄钟"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* REAL-TIME CLOCK PRIMARY VIEW (With interactive Pomodoro capsule below) */
              <motion.div
                key="realtime-primary"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                }}
                className="flex flex-col items-center text-center w-full max-w-3xl"
              >
                <span
                  className={`text-xs sm:text-sm font-medium tracking-wide mb-3 ${
                    isFullscreen ? "text-zinc-400" : "text-theme-muted"
                  }`}
                >
                  {currentDateLabel} · 实时桌面时钟
                </span>

                {/* Giant Spring-Animated Real-Time Clock (HH:MM:SS) */}
                <div
                  className={`font-mono tracking-tight flex items-center justify-center my-2 ${
                    isFullscreen ? "text-white" : "text-theme-text"
                  }`}
                >
                  {currentHours.split("").map((d, i) => (
                    <SpringDigit
                      key={`rt-h-${i}`}
                      char={d}
                      sizeClass={
                        isFullscreen
                          ? "text-6xl sm:text-8xl md:text-9xl"
                          : "text-5xl sm:text-7xl md:text-8xl"
                      }
                    />
                  ))}
                  <SpringDigit
                    char=":"
                    sizeClass={
                      isFullscreen
                        ? "text-5xl sm:text-7xl md:text-8xl"
                        : "text-4xl sm:text-6xl md:text-7xl"
                    }
                  />
                  {currentMinutes.split("").map((d, i) => (
                    <SpringDigit
                      key={`rt-m-${i}`}
                      char={d}
                      sizeClass={
                        isFullscreen
                          ? "text-6xl sm:text-8xl md:text-9xl"
                          : "text-5xl sm:text-7xl md:text-8xl"
                      }
                    />
                  ))}
                  <SpringDigit
                    char=":"
                    sizeClass={
                      isFullscreen
                        ? "text-5xl sm:text-7xl md:text-8xl"
                        : "text-4xl sm:text-6xl md:text-7xl"
                    }
                  />
                  {currentSeconds.split("").map((d, i) => (
                    <SpringDigit
                      key={`rt-s-${i}`}
                      char={d}
                      sizeClass={
                        isFullscreen
                          ? "text-6xl sm:text-8xl md:text-9xl"
                          : "text-5xl sm:text-7xl md:text-8xl"
                      }
                    />
                  ))}
                </div>

                {/* Companion Interactive Pomodoro Bar (Always adjustable without leaving clock view) */}
                <div
                  className={`mt-6 px-4 py-2.5 rounded-2xl backdrop-blur-xl border flex flex-wrap items-center justify-center gap-3 ${
                    isFullscreen
                      ? "bg-white/10 border-white/15 text-zinc-200"
                      : "bg-theme-bg/85 border-theme-border text-theme-text"
                  }`}
                >
                  <button
                    onClick={() => setPrimaryView("pomodoro")}
                    className="text-xs font-medium text-accent hover:underline cursor-pointer"
                  >
                    {timerMode === "focus" ? "番茄倒计时" : "休息倒计时"}
                  </button>

                  <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums">
                    <button
                      onClick={() => adjustTimerMinutes(-5)}
                      className="p-1 rounded-lg hover:bg-accent/15 text-theme-muted hover:text-accent transition-colors cursor-pointer"
                      title="减少 5 分钟"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-1">
                      {pomoMins}:{pomoSecs}
                    </span>
                    <button
                      onClick={() => adjustTimerMinutes(5)}
                      className="p-1 rounded-lg hover:bg-accent/15 text-theme-muted hover:text-accent transition-colors cursor-pointer"
                      title="增加 5 分钟"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      initializeAudioEngine();
                      setIsTimerRunning((r) => !r);
                    }}
                    className="px-3 py-1 rounded-xl bg-accent text-white text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isTimerRunning ? "暂停" : "启动"}</span>
                  </button>

                  <button
                    onClick={resetTimer}
                    className="p-1.5 rounded-xl text-theme-muted hover:text-theme-text transition-colors cursor-pointer"
                    title="重置倒计时"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =================================================================== */}
        {/* BOTTOM DOCK INSIDE STAGE: 3 White Noise Presets & External Audio    */}
        {/* =================================================================== */}
        <motion.div
          animate={{
            opacity: controlsVisible ? 1 : 0,
            y: controlsVisible ? 0 : 12,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex flex-col gap-3"
        >
          {/* 3 Scenario White Noise Presets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {WHITE_NOISE_PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`group text-left p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? isFullscreen
                        ? "bg-white text-zinc-950 border-white shadow-lg"
                        : "bg-accent text-white border-accent shadow-md"
                      : isFullscreen
                      ? "bg-white/8 border-white/12 text-zinc-200 hover:bg-white/14"
                      : "bg-theme-bg/75 border-theme-border text-theme-text hover:border-accent/40"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-xl transition-colors ${
                          isSelected
                            ? isFullscreen
                              ? "bg-zinc-950/10 text-zinc-950"
                              : "bg-white/20 text-white"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {preset.icon}
                      </span>
                      <span className="text-sm font-bold tracking-tight truncate">
                        {preset.title}
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed line-clamp-1 ${
                        isSelected
                          ? isFullscreen
                            ? "text-zinc-700"
                            : "text-white/85"
                          : isFullscreen
                          ? "text-zinc-400"
                          : "text-theme-muted"
                      }`}
                    >
                      {preset.subtitle}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-medium whitespace-nowrap shrink-0 mt-0.5 ${
                      isSelected
                        ? isFullscreen
                          ? "text-zinc-900 font-semibold"
                          : "text-white font-semibold"
                        : isFullscreen
                        ? "text-zinc-400"
                        : "text-theme-muted"
                    }`}
                  >
                    {isSelected ? "播放中" : preset.sceneTag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Compact Audio Source Bar: Local Audio Import & Mic Pickup */}
          <div
            className={`px-4 py-2.5 rounded-2xl backdrop-blur-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
              isFullscreen
                ? "bg-white/6 border-white/10 text-zinc-300"
                : "bg-theme-bg/60 border-theme-border/80 text-theme-muted"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles size={14} className="text-accent shrink-0" />
              <span className="truncate">
                {activePresetObj
                  ? `当前场景：${activePresetObj.title}（点击同卡片可关闭）`
                  : uploadedFileName
                  ? `本地伴读：${uploadedFileName}`
                  : isMicOn
                  ? "正在拾取环境或系统声音驱动律动"
                  : "选择上方任一白噪音场景，或导入本地音乐伴学"}
              </span>
              {micError && (
                <span className="text-red-400 font-medium">{micError}</span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Local Audio File Play/Pause if uploaded */}
              {uploadedFileName && (
                <button
                  onClick={toggleFilePlayback}
                  className="px-3 py-1.5 rounded-xl bg-accent/15 text-accent font-semibold flex items-center gap-1.5 hover:bg-accent/25 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Music size={12} />
                  <span>{isFilePlaying ? "暂停伴读" : "继续伴读"}</span>
                </button>
              )}

              {/* Upload Local Audio */}
              <label
                className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                  isFullscreen
                    ? "bg-white/8 border-white/15 text-zinc-200 hover:bg-white/15"
                    : "bg-theme-card border-theme-border text-theme-text hover:border-accent/40"
                }`}
              >
                <Upload size={12} />
                <span>{uploadedFileName ? "更换音频" : "本地音乐"}</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Microphone / System Audio Rhythm Pickup */}
              <button
                onClick={toggleMicrophone}
                className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  isMicOn
                    ? "bg-accent text-white border-accent"
                    : isFullscreen
                    ? "bg-white/8 border-white/15 text-zinc-200 hover:bg-white/15"
                    : "bg-theme-card border-theme-border text-theme-text hover:border-accent/40"
                }`}
              >
                <Mic size={12} />
                <span>{isMicOn ? "停止拾音" : "外部拾音律动"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
