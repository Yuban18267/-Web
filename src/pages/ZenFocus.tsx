import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Music,
  Mic,
  Upload,
  Clock,
  Sparkles,
  Flame,
  Wind,
  CloudRain,
  Waves,
  Sliders,
  HelpCircle,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";

// Procedural Ambient Synth Modes
type SynthMode = "none" | "meditation" | "alpha_binaural" | "cosmic_drone";

// Audio Visualizer Themes
type VisualTheme = "bars" | "radial" | "nebula" | "bridge";

interface AudioEngineRef {
  audioCtx: AudioContext | null;
  analyser: AnalyserNode | null;
  sourceNode: AudioNode | null;
  microphoneSource: MediaStreamAudioSourceNode | null;
  fileSource: MediaElementAudioSourceNode | null;
  noiseNodes: {
    [key: string]: {
      gain: GainNode;
      filter?: BiquadFilterNode;
      source?: AudioBufferSourceNode;
      lfo?: OscillatorNode;
      interval?: number;
    };
  };
  synthNodes: {
    droneOscs?: OscillatorNode[];
    droneGains?: GainNode[];
    lfo?: OscillatorNode;
    chordInterval?: number;
  };
}

const AnimatedDigit = ({ char }: { char: string; key?: string | number }) => {
  return (
    <div className="relative w-[0.55em] h-[1.12em] md:h-[1.25em] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={char}
          initial={{ y: "85%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-85%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 25 }}
          className="absolute font-black text-5xl md:text-6xl font-mono text-theme-text tabular-nums leading-none select-none"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default function ZenFocus() {
  // ---- UI & STATE LIST ----
  const [activeTab, setActiveTab] = useState<"visualizer" | "study">("visualizer");
  const [visualTheme, setVisualTheme] = useState<VisualTheme>("radial");
  const [visitedThemes, setVisitedThemes] = useState<string[]>(["radial"]);
  const [activeSynth, setActiveSynth] = useState<SynthMode>("none");
  const [isMicOn, setIsMicOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  
  // Custom stats trackers for Badges
  const [hasUsedMic, setHasUsedMic] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  // Smooth visual inertia buffers to eliminate audio node jitters
  const smoothedDataRef = useRef<Float32Array | null>(null);
  const smoothedEnergyRef = useRef<number>(0);

  const handleVisualThemeChange = (theme: VisualTheme) => {
    setVisualTheme(theme);
    if (!visitedThemes.includes(theme)) {
      setVisitedThemes((prev) => [...prev, theme]);
    }
  };

  // Pomodoro States
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<"focus" | "break" | "longBreak">("focus");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [focusGoal] = useState(4); // target loops

  // Sound channels volume: 0, 0.3 (Gentle), 0.7 (Medium), 1.0 (Intense)
  const [soundVolumes, setSoundVolumes] = useState<{ [key: string]: number }>({
    rain: 0.0,
    ocean: 0.0,
    fire: 0.0,
    wind: 0.0,
    birds: 0.0,
  });

  const soundVolumesRef = useRef(soundVolumes);
  soundVolumesRef.current = soundVolumes;

  // Enriched Zen & Focus Quotes
  const quotes = [
    "静心生慧，万物归一。在这片刻里，只有你的呼吸和当下的聚焦。",
    "万物皆有裂痕，那是光照进来的地方。别急，一步一步来。",
    "流水不争先，争的是滔滔不绝。保持自己的节奏，稳步向前。",
    "专注于当下这一行代码，这一个词，这一缕自然的声音。",
    "心远地自偏。身处喧嚣，心亦可为一方净土。听，光影在律动。",
    "看穿事物底部的寂静，在日常喧嚣中保有自我的一份清明与闲适。",
    "当下这一刻，便是生命的全部。将心安放在此处，感受宁静的力量。",
    "心如止水，何惧狂风大浪；步履不停，终达芳华彼岸。",
    "不期而遇的灵感，往往诞生于最纯粹、最安静的执着里。",
    "山不解释自己的高度，并不影响它耸入云端；海不解释自己的广阔，并不影响它容纳百川。",
    "慢慢来，最快。保持呼吸的轻盈，让纷扰的杂念如落叶般静静沉定。",
    "修行的秘诀在当下：专注做事，全然生活，心无杂念，自得静气。",
    "生活虽有万千烦忧，于此间自修室中，还你双耳片刻星空与雨林的温柔。",
    "给自己一盏茶的时间，安顿焦躁的灵魂，等风来，看云舒。",
    "最深刻的创造力，源自于内心沉淀后的极度极简与绝对安详。"
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  // ---- MULTI-ELEMENT AUDIO REFS ----
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const engine = useRef<AudioEngineRef>({
    audioCtx: null,
    analyser: null,
    sourceNode: null,
    microphoneSource: null,
    fileSource: null,
    noiseNodes: {},
    synthNodes: {},
  });

  // ---- TIMER ENGINE ----
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds((prev) => prev - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes > 0) {
            setTimerMinutes((prev) => prev - 1);
            setTimerSeconds(59);
          } else {
            handleTimerComplete();
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  // Quote slow random rotation
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => {
        let next = Math.floor(Math.random() * quotes.length);
        while (next === prev && quotes.length > 1) {
          next = Math.floor(Math.random() * quotes.length);
        }
        return next;
      });
    }, 16000); // Changed to 16 seconds slow interval
    return () => clearInterval(quoteInterval);
  }, []);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    playTimerChime();
    if (timerMode === "focus") {
      setCompletedSessions((prev) => prev + 1);
      setTotalFocusMinutes((prev) => prev + 25);
      setTimerMode("break");
      setTimerMinutes(5);
      setTimerSeconds(0);
    } else {
      setTimerMode("focus");
      setTimerMinutes(25);
      setTimerSeconds(0);
    }
  };

  const playTimerChime = () => {
    try {
      const buzzerCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = buzzerCtx.createOscillator();
      const gain = buzzerCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, buzzerCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, buzzerCtx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, buzzerCtx.currentTime + 0.3); // G5
      osc.frequency.setValueAtTime(1046.50, buzzerCtx.currentTime + 0.45); // C6
      
      gain.gain.setValueAtTime(0.12, buzzerCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, buzzerCtx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(buzzerCtx.destination);
      osc.start();
      osc.stop(buzzerCtx.currentTime + 1.5);
    } catch (e) {
      console.warn("Failed play chime:", e);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    initializeContext();
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === "focus") {
      setTimerMinutes(25);
    } else if (timerMode === "break") {
      setTimerMinutes(5);
    } else {
      setTimerMinutes(15);
    }
    setTimerSeconds(0);
  };

  const selectTimerPreset = (type: "focus" | "break" | "long", minutes: number) => {
    setIsTimerRunning(false);
    setTimerMode(type === "focus" ? "focus" : type === "break" ? "break" : "longBreak");
    setTimerMinutes(minutes);
    setTimerSeconds(0);
  };

  // ---- LAZY INITIALIZATION OF WEB AUDIO CONTEXT ----
  const initializeContext = () => {
    if (engine.current.audioCtx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;

      // Connect analyser once so output flows cleanly
      analyser.connect(ctx.destination);

      engine.current.audioCtx = ctx;
      engine.current.analyser = analyser;
      
      // Initialize sound loop buffers
      initAmbientEngine(ctx, analyser);
    } catch (e) {
      console.error("Web Audio initialization failure:", e);
    }
  };

  // ---- AUDIO GENERATIVE NOISE SOURCES ----
  const createNoiseBuffer = (ctx: AudioContext, color: "white" | "pink" | "brown") => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (color === "white") {
        output[i] = white;
      } else if (color === "pink") {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      } else if (color === "brown") {
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }
    return noiseBuffer;
  };

  const initAmbientEngine = (ctx: AudioContext, analyser: AnalyserNode) => {
    const channels = ["rain", "ocean", "fire", "wind", "birds"];
    
    channels.forEach((chan) => {
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      // Essential fix: Route through the spectrum analyser first to allow visualizer mapping!
      gainNode.connect(analyser);

      engine.current.noiseNodes[chan] = {
        gain: gainNode,
      };
    });

    startProceduralNoise("rain", "white", 1100, "bandpass");
    startProceduralNoise("ocean", "brown", 280, "lowpass");
    startProceduralNoise("fire", "pink", 1400, "lowpass");
    startProceduralNoise("wind", "pink", 600, "bandpass");
    
    startBirdsSynthesizer();
  };

  const startProceduralNoise = (
    channel: string, 
    noiseType: "white" | "pink" | "brown", 
    filterFreq: number, 
    filterType: BiquadFilterType
  ) => {
    const ctx = engine.current.audioCtx;
    const nodeSet = engine.current.noiseNodes[channel];
    if (!ctx || !nodeSet) return;

    try {
      const buffer = createNoiseBuffer(ctx, noiseType);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const biquad = ctx.createBiquadFilter();
      biquad.type = filterType;
      biquad.Q.setValueAtTime(1.2, ctx.currentTime);
      biquad.frequency.setValueAtTime(filterFreq, ctx.currentTime);

      source.connect(biquad);
      biquad.connect(nodeSet.gain);
      source.start(0);

      nodeSet.source = source;
      nodeSet.filter = biquad;

      if (channel === "ocean") {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
        lfoGain.gain.setValueAtTime(120, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(biquad.frequency);
        lfo.start();
        nodeSet.lfo = lfo;
      } else if (channel === "wind") {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(320, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(biquad.frequency);
        lfo.start();
        nodeSet.lfo = lfo;
      }
    } catch (e) {
      console.warn("Failed starting procedural generator for " + channel, e);
    }
  };

  const startBirdsChirp = (ctx: AudioContext, currentVol: number) => {
    try {
      const now = ctx.currentTime;
      const count = 2 + Math.floor(Math.random() * 3);
      let oscTime = now;
      const nodeSet = engine.current.noiseNodes["birds"];

      for (let i = 0; i < count; i++) {
        const osc = ctx.createOscillator();
        const pGain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(2800 + Math.random() * 500, oscTime);
        osc.frequency.exponentialRampToValueAtTime(1400 + Math.random() * 200, oscTime + 0.12);
        
        pGain.gain.setValueAtTime(0, oscTime);
        // Clean high-fidelity bird sound base amplitude, volume is adjusted by the channel gain node!
        pGain.gain.linearRampToValueAtTime(0.25, oscTime + 0.02);
        pGain.gain.exponentialRampToValueAtTime(0.0001, oscTime + 0.14);

        osc.connect(pGain);
        if (nodeSet && nodeSet.gain) {
          pGain.connect(nodeSet.gain);
        } else if (engine.current.analyser) {
          pGain.connect(engine.current.analyser);
        } else {
          pGain.connect(ctx.destination);
        }
        
        osc.start(oscTime);
        osc.stop(oscTime + 0.15);
        oscTime += 0.18;
      }
    } catch (e) {}
  };

  const startBirdsSynthesizer = () => {
    const ctx = engine.current.audioCtx;
    const nodeSet = engine.current.noiseNodes["birds"];
    if (!ctx || !nodeSet) return;

    const chirper = () => {
      const currentVol = soundVolumesRef.current?.birds || 0;
      if (currentVol > 0.02 && !isMuted && engine.current.audioCtx) {
        startBirdsChirp(engine.current.audioCtx, currentVol);
      }
      const activeNodeSet = engine.current.noiseNodes["birds"];
      if (activeNodeSet) {
        activeNodeSet.interval = window.setTimeout(chirper, 6000 + Math.random() * 9000);
      }
    };

    nodeSet.interval = window.setTimeout(chirper, 4000);
  };

  // Update Volumes
  const handleVolumeChange = (channel: string, value: number) => {
    initializeContext();
    setSoundVolumes((prev) => {
      const updated = { ...prev, [channel]: value };
      const nodeSet = engine.current.noiseNodes[channel];
      const ctx = engine.current.audioCtx;
      if (nodeSet && ctx) {
        const actualGain = value * masterVolume * (isMuted ? 0 : 1);
        nodeSet.gain.gain.setTargetAtTime(actualGain, ctx.currentTime, 0.15);
      }
      return updated;
    });
  };

  // ---- PROCEDURAL SYNTH EMULATOR ----
  const selectSynth = (mode: SynthMode) => {
    initializeContext();
    const ctx = engine.current.audioCtx;
    const analyser = engine.current.analyser;
    if (!ctx || !analyser) return;

    stopAmbientSynth();
    setActiveSynth(mode);
    setIsMicOn(false); 

    if (mode === "none") return;

    if (engine.current.microphoneSource) {
      try {
        engine.current.microphoneSource.disconnect();
      } catch (e) {}
      engine.current.microphoneSource = null;
    }

    try {
      const oscs: OscillatorNode[] = [];
      const gains: GainNode[] = [];

      if (mode === "meditation") {
        const notes = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63]; 
        
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const pGain = ctx.createGain();
          
          osc.type = idx % 2 === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          pGain.gain.setValueAtTime(0, ctx.currentTime);
          
          osc.connect(pGain);
          pGain.connect(analyser); 
          
          osc.start();
          oscs.push(osc);
          gains.push(pGain);
        });

        let swellIndex = 0;
        const swellInterval = window.setInterval(() => {
          const t = ctx.currentTime;
          gains.forEach((g, idx) => {
            const active = (idx + swellIndex) % 3 === 0;
            const targetVol = active ? 0.08 * masterVolume * (isMuted ? 0 : 1) : 0.015;
            g.gain.setTargetAtTime(targetVol, t, 1.8);
          });
          swellIndex++;
        }, 5000);

        engine.current.synthNodes = {
          droneOscs: oscs,
          droneGains: gains,
          chordInterval: swellInterval,
        };

        gains[0].gain.setValueAtTime(0.06, ctx.currentTime);
        gains[2].gain.setValueAtTime(0.05, ctx.currentTime);
        gains[5].gain.setValueAtTime(0.04, ctx.currentTime);

      } else if (mode === "alpha_binaural") {
        const merger = ctx.createChannelMerger(2);
        
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        
        const gainL = ctx.createGain();
        const gainR = ctx.createGain();

        oscL.type = "sine";
        oscL.frequency.setValueAtTime(95, ctx.currentTime);
        
        oscR.type = "sine";
        oscR.frequency.setValueAtTime(105, ctx.currentTime);

        gainL.gain.setValueAtTime(0.05 * masterVolume * (isMuted ? 0 : 1), ctx.currentTime);
        gainR.gain.setValueAtTime(0.05 * masterVolume * (isMuted ? 0 : 1), ctx.currentTime);

        oscL.connect(gainL);
        oscR.connect(gainR);

        gainL.connect(merger, 0, 0); 
        gainR.connect(merger, 0, 1); 

        const masterSynthGain = ctx.createGain();
        masterSynthGain.gain.setValueAtTime(1.0, ctx.currentTime);
        
        merger.connect(masterSynthGain);
        masterSynthGain.connect(analyser);

        oscL.start();
        oscR.start();

        engine.current.synthNodes = {
          droneOscs: [oscL, oscR],
          droneGains: [gainL, gainR, masterSynthGain],
        };

      } else if (mode === "cosmic_drone") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const pGain = ctx.createGain();
        const lowpass = ctx.createBiquadFilter();

        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(55, ctx.currentTime); 
        
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(110.2, ctx.currentTime); 
        
        lowpass.type = "lowpass";
        lowpass.frequency.setValueAtTime(120, ctx.currentTime);
        lowpass.Q.setValueAtTime(6.0, ctx.currentTime);

        pGain.gain.setValueAtTime(0.06 * masterVolume * (isMuted ? 0 : 1), ctx.currentTime);

        osc1.connect(lowpass);
        osc2.connect(lowpass);
        lowpass.connect(pGain);
        pGain.connect(analyser);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime); 
        lfoGain.gain.setValueAtTime(70, ctx.currentTime); 

        lfo.connect(lfoGain);
        lfoGain.connect(lowpass.frequency);

        osc1.start();
        osc2.start();
        lfo.start();

        engine.current.synthNodes = {
          droneOscs: [osc1, osc2, lfo],
          droneGains: [pGain],
        };
      }
    } catch (e) {
      console.error("Synthesizer playback error:", e);
    }
  };

  const stopAmbientSynth = () => {
    const sNode = engine.current.synthNodes;
    if (sNode.droneOscs) {
      sNode.droneOscs.forEach((o) => {
        try {
          o.stop();
        } catch (e) {}
      });
    }
    if (sNode.chordInterval) {
      clearInterval(sNode.chordInterval);
    }
    engine.current.synthNodes = {};
  };

  // ---- AUDIO SOURCES: MIC / LOCAL FILES ----
  const toggleMicrophone = async () => {
    initializeContext();
    const ctx = engine.current.audioCtx;
    const analyser = engine.current.analyser;
    if (!ctx || !analyser) return;

    if (isMicOn) {
      if (engine.current.microphoneSource) {
        try {
          engine.current.microphoneSource.disconnect();
        } catch (e) {}
        engine.current.microphoneSource = null;
      }
      setIsMicOn(false);
      
      // Reconnect analyser to output normally
      try {
        analyser.connect(ctx.destination);
      } catch (e) {}
    } else {
      try {
        stopAmbientSynth();
        setActiveSynth("none");
        
        // Critical Fix: Disconnect Analyser from destination to prevent fatal audio feedback loops!
        try {
          analyser.disconnect(ctx.destination);
        } catch (e) {}
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const micSource = ctx.createMediaStreamSource(stream);
        
        micSource.connect(analyser);
        engine.current.microphoneSource = micSource;
        setIsMicOn(true);
        setHasUsedMic(true); // Unlock "寂静极客" badge!
      } catch (err) {
        // Re-enable output on failure
        try {
          analyser.connect(ctx.destination);
        } catch (e) {}
        alert("麦克风权限请求失败。请确保您已授予麦克风权限，或尝试通过下方上传本地音频文件。");
        console.warn("User microphone denied:", err);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    initializeContext();
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setHasUploadedFile(true); // Unlock custom audio badge!
    stopAmbientSynth();
    setActiveSynth("none");
    if (isMicOn) toggleMicrophone(); 

    const ctx = engine.current.audioCtx;
    const analyser = engine.current.analyser;
    if (!ctx || !analyser) return;

    try {
      if (!audioRef.current) {
        const audioEl = new Audio();
        audioEl.crossOrigin = "anonymous";
        audioRef.current = audioEl;

        const fileSrc = ctx.createMediaElementSource(audioEl);
        fileSrc.connect(analyser);
        engine.current.fileSource = fileSrc;
      }

      const fileURL = URL.createObjectURL(file);
      audioRef.current.src = fileURL;
      audioRef.current.play()
        .then(() => {})
        .catch((error) => {
          console.warn("Local play click required:", error);
        });
    } catch (err) {
      console.error("Local file injection err:", err);
    }
  };

  const triggerFilePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  // ---- REALTIME CANVAS GRAPHICS RENDER LOOP (HUAWEI/APPLE STYLE FLUIDITY) ----
  const startCanvasLoop = () => {
    const canvas = canvasRef.current;
    const analyser = engine.current.analyser;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angleOffset = 0;

    const render = () => {
      if (!canvasRef.current) return;
      animationFrameRef.current = requestAnimationFrame(render);
      
      const bufferLength = analyser ? analyser.frequencyBinCount : 128;
      const dataArray = new Uint8Array(bufferLength);
      
      let energy = 0;
      const hasAudio = analyser && (activeSynth !== "none" || isMicOn || uploadedFileName || Object.values(soundVolumes).some((v) => (v as number) > 0));

      if (analyser && hasAudio) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < 40; i++) {
          sum += dataArray[i];
        }
        energy = sum / 40 / 255;
      } else {
        // Idle Animation state: create simulated beautiful slow-moving rhythm
        const time = Date.now() * 0.001;
        energy = 0.15 + Math.sin(time) * 0.05; 
        for (let i = 0; i < bufferLength; i++) {
          const s = Math.sin(i * 0.15 - time * 1.5) * 0.5 + 0.5;
          const c = Math.cos(i * 0.06 + time) * 0.5 + 0.5;
          dataArray[i] = Math.max(15, s * 60 + c * 35);
        }
      }

      // 1. One-pass lag inertial low-pass filtering. 
      // This smoothing completely eliminates the raw hardware jump-step jitter, providing a silky butter-smooth Apple/Huawei style curve.
      if (!smoothedDataRef.current || smoothedDataRef.current.length !== bufferLength) {
        smoothedDataRef.current = new Float32Array(bufferLength);
      }
      const sData = smoothedDataRef.current;
      for (let i = 0; i < bufferLength; i++) {
        // 0.86 dampening coefficient provides an extra smooth elastic wave transition
        sData[i] = sData[i] * 0.86 + dataArray[i] * 0.14;
      }
      const sEnergy = smoothedEnergyRef.current * 0.86 + energy * 0.14;
      smoothedEnergyRef.current = sEnergy;

      // Dynamic cached size resolution with DPR clamping for high battery efficiency & 60-120fps smoothness
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      const brandColorHex = getComputedStyle(document.documentElement).getPropertyValue("--brand-color").trim() || "#2563eb";

      if (visualTheme === "bars") {
        // --- 1. AURORA SILK WAVES (极光丝绸) ---
        // Replacing raw block bars with 4 layers of organic flowing bezier silk ribbons that undulate gracefully with frequency shifts.
        const time = Date.now() * 0.0012;
        const waveCount = 4;
        
        for (let w = 0; w < waveCount; w++) {
          const shift = w * Math.PI * 0.45;
          const speed = 0.8 + w * 0.35;
          const ampBase = height * 0.09 + (sEnergy * height * 0.22);
          
          let gradient = ctx.createLinearGradient(0, 0, width, height);
          if (w === 0) {
            gradient.addColorStop(0, `${brandColorHex}12`);
            gradient.addColorStop(0.5, `${brandColorHex}4f`);
            gradient.addColorStop(1, `${brandColorHex}03`);
          } else if (w === 1) {
            gradient.addColorStop(0, `#06b6d408`); // elegant cyan
            gradient.addColorStop(0.5, `#06b6d542`);
            gradient.addColorStop(1, `#06b6d403`);
          } else if (w === 2) {
            gradient.addColorStop(0, `#8b5cf608`); // velvet purple
            gradient.addColorStop(0.5, `#8b5cf63f`);
            gradient.addColorStop(1, `#8b5cf602`);
          } else {
            gradient.addColorStop(0, `${brandColorHex}06`);
            gradient.addColorStop(0.5, `#10b98130`); // emerald forest
            gradient.addColorStop(1, `${brandColorHex}02`);
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(0, height);

          const step = width / 18;
          ctx.lineTo(0, height * 0.5);

          for (let i = 0; i <= 18; i++) {
            const x = i * step;
            const dataIdx = Math.floor((i / 18) * (bufferLength / 3)) % bufferLength;
            const audioAmp = (sData[dataIdx] / 255.0) * ampBase * 1.5;
            
            // Seamless procedural drift
            const naturalSway = Math.sin(i * 0.28 - time * speed + shift) * 16;
            const y = (height * 0.5) + naturalSway - audioAmp - (w * 18);
            
            if (i === 0) {
              ctx.lineTo(x, y);
            } else {
              const prevX = (i - 1) * step;
              const prevDataIdx = Math.floor(((i - 1) / 18) * (bufferLength / 3)) % bufferLength;
              const prevAudioAmp = (sData[prevDataIdx] / 255.0) * ampBase * 1.5;
              const prevNaturalSway = Math.sin((i - 1) * 0.28 - time * speed + shift) * 16;
              const prevY = (height * 0.5) + prevNaturalSway - prevAudioAmp - (w * 18);
              
              const cx = (prevX + x) / 2;
              const cy = (prevY + y) / 2;
              ctx.quadraticCurveTo(prevX, prevY, cx, cy);
            }
          }

          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();
        }

      } else if (visualTheme === "radial") {
        // --- 2. ZEN SMOOTH RADIAL RING (禅意自呼吸浮环) ---
        // Silky, low-pass damped circle that acts like a micro-breathing deep ocean ring.
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.22 + (sEnergy * 42);

        // Slow-evolving outer space vacuum bloom glow
        const glowRad = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.4, centerX, centerY, baseRadius * 1.6);
        glowRad.addColorStop(0, `${brandColorHex}2b`);
        glowRad.addColorStop(0.5, `${brandColorHex}07`);
        glowRad.addColorStop(1, "transparent");
        ctx.fillStyle = glowRad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 1.7, 0, Math.PI * 2);
        ctx.fill();

        const pointCount = 94;
        angleOffset += 0.0035 + (sEnergy * 0.008);

        ctx.strokeStyle = `${brandColorHex}d5`;
        ctx.lineWidth = 3.3;
        ctx.shadowBlur = 16;
        ctx.shadowColor = brandColorHex;

        ctx.beginPath();
        for (let i = 0; i < pointCount; i++) {
          const angle = (i / pointCount) * Math.PI * 2 + angleOffset;
          const idx = i % 32;
          const pulse = (sData[idx] / 255) * 58; // Using smooth lag sData
          const radius = baseRadius + pulse;

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.shadowBlur = 0; 
        ctx.fillStyle = `#ffffffcc`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 7 + (sEnergy * 10), 0, Math.PI * 2);
        ctx.fill();

      } else if (visualTheme === "nebula") {
        // --- 3. SONAR GRAVITY RIPPLES (声纳重力波纹) ---
        // Replacing cluttered starry nodes with three precise expanding sonar echo wave-loops that map sub-bass.
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.44;

        const time = Date.now() * 0.001;
        const rippleCount = 3;
        angleOffset += 0.0015;

        for (let r = 0; r < rippleCount; r++) {
          const rawPhase = (time * 0.35 + (r / rippleCount)) % 1.0;
          const currentRadius = maxRadius * rawPhase;
          const alpha = (1.0 - rawPhase) * 0.65;

          ctx.strokeStyle = `${brandColorHex}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1.8;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();

          const points = 72;
          for (let p = 0; p <= points; p++) {
            const angle = (p / points) * Math.PI * 2 + angleOffset;
            const amplitudeIdx = Math.floor((p + r * 8) % 24);
            const amplitude = (sData[amplitudeIdx] / 255) * 22 * (1.0 - rawPhase * 0.5);

            const radius = currentRadius + amplitude;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            if (p === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Elegant sonar dust particles floating calmly outwards
        for (let i = 0; i < 20; i++) {
          const randAngle = (i * 13.8) % (Math.PI * 2);
          const randRadius = (maxRadius * 0.12) + (i * 17.5 + (time * 15)) % (maxRadius * 0.84);
          const pulseOpacity = 0.15 + (sEnergy * 0.55) * Math.sin(time * 2 + i);
          
          const x = centerX + Math.cos(randAngle) * randRadius;
          const y = centerY + Math.sin(randAngle) * randRadius;

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.02, Math.min(0.85, pulseOpacity))})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.5 + (sEnergy * 2), 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (visualTheme === "bridge") {
        // --- 4. RESONANT SYMPHONY STARFIELD (共鸣群星宇宙) ---
        // Transforming traditional split bridge lines to a breathtaking, breathing galaxy with elements pulsating on dynamic sub-bass rhythms.
        const centerX = width / 2;
        const centerY = height / 2;
        const time = Date.now() * 0.0012;

        const starCount = 55;
        for (let i = 0; i < starCount; i++) {
          const baseAngle = (i * 44.57) % (Math.PI * 2);
          const baseDist = ((i * 19.33) % 250) + 30;
          
          const lowFreqSum = sData[1] + sData[2] + sData[3] + sData[4];
          const bassExpansion = (lowFreqSum / 4 / 255) * 55;
          const actualDist = baseDist + bassExpansion * (baseDist / 250);

          const x = centerX + Math.cos(baseAngle) * actualDist;
          const y = centerY + Math.sin(baseAngle) * actualDist;

          const hiFreqIdx = Math.floor(25 + (i % 12));
          const hiFreqVal = sData[hiFreqIdx] ? (sData[hiFreqIdx] / 255) : 0;
          const sparkle = Math.sin(time * 3 + i) * 0.35 + 0.65 + hiFreqVal * 1.5;

          let size = 1.0;
          if (i % 6 === 0) size = 2.0;
          if (i % 11 === 0) size = 2.8;

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.08, Math.min(1.0, sparkle * 0.68))})`;
          ctx.beginPath();
          ctx.arc(x, y, size + (sEnergy * 1.5), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = `rgba(255, 255, 255, 0.09)`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        ctx.strokeStyle = `${brandColorHex}b3`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const bridgePoints = 48;
        const segment = width / bridgePoints;
        for (let i = 0; i <= bridgePoints; i++) {
          const x = i * segment;
          const idx = i < bridgePoints / 2 ? i : bridgePoints - i;
          const dataIdx = Math.floor((idx / (bridgePoints / 2)) * 32);
          const amp = (sData[dataIdx] / 255) * 45;
          const y = centerY + Math.sin(x * 0.015 + time * 2) * 12 + (i % 2 === 0 ? amp : -amp);
          
          if (i === 0) ctx.moveTo(x, y);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    render();
  };

  // ---- INTEGRATED EFFECT FOR CANVAS RESETS ----
  useEffect(() => {
    // Start canvas loop immediately on component mount, ensuring there's always visual breath
    startCanvasLoop();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, visualTheme]);

  // Cleanups on absolute unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopAmbientSynth();
      
      if (engine.current.noiseNodes.birds?.interval) {
        clearTimeout(engine.current.noiseNodes.birds.interval);
      }
      
      if (engine.current.audioCtx) {
        try {
          engine.current.audioCtx.close();
        } catch (e) {}
      }
    };
  }, []);

  // ---- MUTE MASTER CONTROLS ----
  const toggleMasterMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);

    const ctx = engine.current.audioCtx;
    if (!ctx) return;

    Object.keys(soundVolumes).forEach((key) => {
      const nodeSet = engine.current.noiseNodes[key];
      if (nodeSet) {
        const flowVol = nextMute ? 0 : soundVolumes[key] * masterVolume;
        nodeSet.gain.gain.setTargetAtTime(flowVol, ctx.currentTime, 0.15);
      }
    });

    const synthNodeSet = engine.current.synthNodes;
    if (synthNodeSet.droneGains) {
      synthNodeSet.droneGains.forEach((g, idx) => {
        const originalVol = activeSynth === "alpha_binaural" ? 0.05 : 0.08;
        const flowVol = nextMute ? 0 : originalVol * masterVolume;
        if (activeSynth === "alpha_binaural" && idx === 2) {
          g.gain.setTargetAtTime(nextMute ? 0 : 1.0, ctx.currentTime, 0.1);
        } else {
          g.gain.setTargetAtTime(flowVol, ctx.currentTime, 0.15);
        }
      });
    }

    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  // Sound labels mapping
  const soundLabels: { [key: string]: { label: string; icon: React.ReactNode; color: string } } = {
    rain: { label: "林间春雨", icon: <CloudRain size={16} />, color: "text-blue-500" },
    ocean: { label: "海潮潮汐", icon: <Waves size={16} />, color: "text-cyan-500" },
    fire: { label: "营火火花", icon: <Flame size={16} />, color: "text-orange-500" },
    wind: { label: "松野寒风", icon: <Wind size={16} />, color: "text-teal-500" },
    birds: { label: "空谷鸟啼", icon: <Sparkles size={16} />, color: "text-emerald-500" },
  };

  // Badge interactive calculations
  const unlockedBadges = {
    firstSession: completedSessions >= 1,
    deepStreaksClass: completedSessions >= 4,
    timerMilestone: totalFocusMinutes >= 15,
    waterAndFireSyms: soundVolumes.rain > 0.1 && soundVolumes.fire > 0.1,
    naturalOrchestration: Object.values(soundVolumes).filter((v) => (v as number) > 0.1).length >= 3,
    micUsedSonar: hasUsedMic,
    customVocalWave: hasUploadedFile,
    spaceExplorerShip: activeSynth === "cosmic_drone",
    masterZenCompleter: completedSessions >= 9,
    studyTimeHero: totalFocusMinutes >= 60,
    rhythmExplorer: visitedThemes.length === 4,
    extremeVibeConnoisseur: masterVolume >= 0.95 && Object.values(soundVolumes).some((v) => (v as number) > 0.1),
  };

  const ambientPresets = [
    {
      name: "⛺️ 暗夜营火密雨",
      volumes: { rain: 0.3, ocean: 0.0, fire: 0.7, wind: 0.0, birds: 0.0 },
    },
    {
      name: "🌊🌬️ 深渊之汐怒吼",
      volumes: { rain: 0.0, ocean: 0.7, fire: 0.0, wind: 0.3, birds: 0.0 },
    },
    {
      name: "🐦🌧️ 庭前春雨落落",
      volumes: { rain: 0.7, ocean: 0.0, fire: 0.0, wind: 0.0, birds: 0.7 },
    },
    {
      name: "🌲🍃 晨曦森林微风",
      volumes: { rain: 0.0, ocean: 0.0, fire: 0.0, wind: 0.5, birds: 0.5 },
    },
    {
      name: "🏔️🌊 冰川孤岛绝唱",
      volumes: { rain: 0.25, ocean: 0.5, fire: 0.0, wind: 0.25, birds: 0.0 },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 1. Header Hero with Ambient Intro */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col items-center text-center relative overflow-hidden p-8 rounded-3xl bg-theme-bg/40 border border-theme-border/60 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="w-16 h-16 bg-accent-light/10 text-accent rounded-3xl flex items-center justify-center mb-5 -rotate-3 border border-accent/15 shadow-sm transition-transform duration-300 hover:rotate-3 hover:scale-105">
          <Activity size={28} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter mb-4">
          禅意随身自修室 <span className="text-accent">•</span> 律动音轨
        </h1>
        
        <p className="text-sm text-theme-muted max-w-2xl leading-relaxed">
          专为主攻深度专注与视觉音乐交互的极客工作空间。通过先进的 Web Audio 算法，一键加载基于浏览器微架构的<b>无损自然白噪音</b>，或通过外设、音频文件呈现唯美的极光频谱涟漪。
        </p>

        {/* Dynamic slowly-rotating randomized Zen Quote Bar */}
        <div className="mt-5 px-6 py-2.5 rounded-full bg-theme-card border border-theme-border flex items-center gap-3">
          <BookOpen size={13} className="text-accent shrink-0 animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-mono font-medium text-theme-muted"
            >
              {quotes[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 2. Top-level Master global controls */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap pb-2 border-b border-theme-border/20">
        <span className="text-xs font-bold text-theme-muted flex items-center gap-2">
          <Sliders size={14} className="text-accent" /> 控制台主设备
        </span>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMasterMute}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              isMuted
                ? "bg-red-500/10 border-red-500/30 text-red-500"
                : "bg-theme-card border-theme-border text-theme-text hover:border-accent/40"
            }`}
            title="静音主输出"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <div className="flex items-center gap-2 bg-theme-card border border-theme-border px-3 py-2 rounded-xl h-10">
            <Sliders size={12} className="text-theme-muted" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setMasterVolume(vol);
                initializeContext();
                const ctx = engine.current.audioCtx;
                if (ctx) {
                  Object.keys(soundVolumes).forEach((key) => {
                    const nodeSet = engine.current.noiseNodes[key];
                    if (nodeSet) {
                      const flowVol = isMuted ? 0 : soundVolumes[key] * vol;
                      nodeSet.gain.gain.setTargetAtTime(flowVol, ctx.currentTime, 0.1);
                    }
                  });
                  const sNodes = engine.current.synthNodes;
                  if (sNodes.droneGains) {
                    sNodes.droneGains.forEach((g) => {
                      const originalVol = activeSynth === "alpha_binaural" ? 0.05 : 0.08;
                      g.gain.setTargetAtTime(originalVol * vol, ctx.currentTime, 0.1);
                    });
                  }
                }
              }}
              className="w-16 md:w-24 h-1 rounded-lg bg-theme-border appearance-none cursor-pointer accent-accent"
              title="全局主音量"
            />
            <span className="text-[10px] font-mono font-bold text-theme-muted w-7 text-right">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspaces (Centralized & Zoomed Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* CENTER COLUMN: Central Deck - Zoomed and Framed on Stage (8 columns) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visualizer & Pomodoro deck widget */}
          <div className="p-6 rounded-3xl bg-theme-card border border-theme-border shadow-md flex flex-col min-h-[540px] relative overflow-hidden">
            {/* Ambient Background Radial Glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent/4 rounded-full blur-3xl pointer-events-none" />
            
            {/* Deck switcher header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-theme-border/60 pb-4 mb-5">
              <div className="flex gap-2 p-1 bg-theme-bg/85 border border-theme-border rounded-xl">
                <button
                  onClick={() => setActiveTab("visualizer")}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    activeTab === "visualizer"
                      ? "bg-accent text-white shadow-sm"
                      : "text-theme-muted hover:text-theme-text hover:bg-theme-bg/40"
                  }`}
                >
                  <Activity size={13} /> 极光音谱律动器
                </button>
                <button
                  onClick={() => setActiveTab("study")}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    activeTab === "study"
                      ? "bg-accent text-white shadow-sm"
                      : "text-theme-muted hover:text-theme-text hover:bg-theme-bg/40"
                  }`}
                >
                  <Clock size={13} /> 专注番茄钟
                </button>
              </div>

              {/* Theme Selector (Only renders when visualizer tab is active) */}
              {activeTab === "visualizer" && (
                <div className="flex gap-1 p-0.5 bg-theme-bg border border-theme-border rounded-xl self-end sm:self-auto">
                  {(["radial", "bars", "nebula", "bridge"] as VisualTheme[]).map((thm) => (
                    <button
                      key={thm}
                      onClick={() => handleVisualThemeChange(thm)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        visualTheme === thm
                          ? "bg-accent/15 text-accent"
                          : "text-theme-muted hover:text-theme-text"
                      }`}
                    >
                      {thm === "radial" && "禅意浮环"}
                      {thm === "bars" && "极光丝绸"}
                      {thm === "nebula" && "声纳波纹"}
                      {thm === "bridge" && "共鸣星群"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* INTERACTIVE STAGES */}
            <div className="flex-1 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === "visualizer" ? (
                  <motion.div
                    key="visualizer_stage"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    {/* Visualizer output box */}
                    <div className="relative flex-1 min-h-[300px] bg-theme-bg/40 border border-theme-border/50 rounded-2.5xl flex items-center justify-center overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full absolute inset-0 block pointer-events-none"
                      />
                      
                      {/* Active Status Tag */}
                      <div className="absolute top-3 left-3 bg-theme-card/90 border border-theme-border backdrop-blur-md px-2.5 py-1 rounded-lg z-10 text-[10px] font-mono font-bold flex items-center gap-1.5 text-theme-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        {isMicOn 
                          ? "麦克风捕捉" 
                          : activeSynth !== "none" 
                          ? `空灵模组: ${activeSynth}` 
                          : uploadedFileName 
                          ? `本地伴读: ${uploadedFileName.slice(0, 16)}...`
                          : "环境声频监听开启"}
                      </div>

                      {/* Display instruction text when idle / silent */}
                      {activeSynth === "none" && !isMicOn && !uploadedFileName && (
                        <div className="relative z-10 flex flex-col items-center p-6 text-center max-w-sm">
                          <p className="text-xs font-bold text-accent tracking-wide flex items-center gap-1.5">
                            <Sparkles size={13} className="animate-spin" />
                            极光屏已启航
                          </p>
                          <p className="text-[10px] text-theme-muted mt-2 leading-relaxed">
                            下方开启<b>空灵合成器</b>、开启<b>外设麦克风</b>或拖放<b>MP3伴读音轨</b>。当前已自动呈现唯美的阻尼高频舒缓波幅。
                          </p>
                        </div>
                      )}

                      {/* Floating local file control */}
                      {uploadedFileName && (
                        <div className="absolute bottom-3 left-3 right-3 bg-theme-card/90 border border-theme-border backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center justify-between gap-4 z-20">
                          <span className="text-[10px] font-mono font-bold text-theme-text truncate max-w-[65%]">
                            🎵 {uploadedFileName}
                          </span>
                          <button
                            onClick={triggerFilePlayPause}
                            className="p-1 px-3 rounded-lg bg-accent/15 border border-accent/20 hover:bg-accent/20 text-accent text-[10px] font-bold transition-all"
                          >
                            运行 / 挂起
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Synthesizer & triggers toolbar inside visualizer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 relative z-10">
                      {/* Built-in Synth */}
                      <div className="p-3 rounded-xl bg-theme-bg/60 border border-theme-border/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-extrabold text-accent uppercase tracking-wider block mb-1">
                            合成器：空灵模组
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          {(["meditation", "alpha_binaural", "cosmic_drone"] as SynthMode[]).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => selectSynth(mode)}
                              className={`w-full py-1 text-[10px] font-medium rounded-lg text-left px-2 flex items-center justify-between border transition-all ${
                                activeSynth === mode
                                  ? "bg-accent text-white border-accent shadow-sm"
                                  : "bg-theme-card text-theme-muted border-theme-border hover:border-accent/20 hover:text-theme-text"
                              }`}
                            >
                              <span>
                                {mode === "meditation" && "🧘  冥想深层"}
                                {mode === "alpha_binaural" && "⚡️ 灵感波频"}
                                {mode === "cosmic_drone" && "🪐 宇宙空谷"}
                              </span>
                              {activeSynth === mode && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                            </button>
                          ))}
                          {activeSynth !== "none" && (
                            <button
                              onClick={() => selectSynth("none")}
                              className="w-full py-0.5 text-[9px] font-extrabold text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-center mt-1 border border-red-500/10"
                            >
                              静音此模组
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mic Trigger */}
                      <div className="p-3 rounded-xl bg-theme-bg/60 border border-theme-border/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-extrabold text-pink-500 uppercase tracking-wider block mb-1">
                            外设/系统声音：设备直接读取
                          </span>
                          <p className="text-[9px] text-theme-muted leading-tight">
                            优先设备直读！点击下方的按键后在弹出的浏览器窗口中<b>勾选「共享系统音频」</b>，即可接收网易云、B站、YouTube 以及任何其它 App 正在后台播放的音乐波澜。
                          </p>
                        </div>
                        <button
                          onClick={toggleMicrophone}
                          className={`w-full py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 border transition-all mt-2 ${
                            isMicOn
                              ? "bg-pink-500/10 border-pink-500/30 text-pink-500 hover:bg-pink-500/15"
                              : "bg-theme-card border-theme-border text-theme-muted hover:border-pink-500/30 hover:text-theme-text"
                          }`}
                        >
                          <Mic size={11} className={isMicOn ? "animate-pulse" : ""} />
                          {isMicOn ? "停用拾音" : "捕获麦克风"}
                        </button>
                      </div>

                      {/* Local File Import */}
                      <div className="p-3 rounded-xl bg-theme-bg/60 border border-theme-border/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-extrabold text-emerald-500 uppercase tracking-wider block mb-1">
                            音源：本地伴读导入
                          </span>
                          <p className="text-[9px] text-theme-muted leading-tight">
                            点击并载入您设备本身的白噪及轻音乐，通过浏览器多线程解码直接实时律动。
                          </p>
                        </div>
                        <label className="w-full py-2 rounded-lg bg-theme-card border border-theme-border hover:border-emerald-500/30 text-theme-muted hover:text-theme-text font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-2">
                          <Upload size={11} />
                          {uploadedFileName ? "更换伴读包" : "导入自习伴音"}
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="study_stage"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    {/* Clock Stage Container */}
                    <div className="flex-1 flex flex-col items-center justify-center py-6">
                      {/* Preset quick buttons */}
                      <div className="flex gap-1.5 mb-6 p-1 bg-theme-bg/80 border border-theme-border rounded-xl">
                        <button
                          onClick={() => selectTimerPreset("focus", 25)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            timerMode === "focus"
                              ? "bg-accent/15 text-accent border border-accent/25"
                              : "text-theme-muted hover:text-theme-text"
                          }`}
                        >
                          🧘‍♀️ 25M 深度专注
                        </button>
                        <button
                          onClick={() => selectTimerPreset("break", 5)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            timerMode === "break"
                              ? "bg-pink-500/15 text-pink-500 border border-pink-500/25"
                              : "text-theme-muted hover:text-theme-text"
                          }`}
                        >
                          ☕️ 5M 调息放松
                        </button>
                        <button
                          onClick={() => selectTimerPreset("long", 15)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            timerMode === "longBreak"
                              ? "bg-purple-500/15 text-purple-500 border border-purple-500/25"
                              : "text-theme-muted hover:text-theme-text"
                          }`}
                        >
                          🌴 15M 惬意小憩
                        </button>
                      </div>

                      {/* Precise Clock face */}
                      <div className="relative w-56 h-56 rounded-full border border-theme-border/50 flex items-center justify-center bg-theme-bg/10">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            className="stroke-theme-border/20 fill-transparent"
                            strokeWidth="4"
                          />
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            className="stroke-accent fill-transparent transition-all duration-300"
                            strokeWidth="4"
                            strokeDasharray={2 * Math.PI * 100}
                            strokeDashoffset={
                              2 * Math.PI * 100 * (1 - (timerMinutes * 60 + timerSeconds) / (timerMode === "focus" ? 1500 : timerMode === "break" ? 300 : 900))
                            }
                          />
                        </svg>

                        <div className="text-center relative z-10 select-none">
                          <span className="text-[9px] font-mono font-black uppercase text-accent tracking-widest block mb-1">
                            {timerMode === "focus" ? "FOCUS MODE" : "REST MODE"}
                          </span>
                          <h2 className="text-5xl md:text-6xl font-extrabold font-mono text-theme-text tracking-tight flex items-center justify-center select-none">
                            {String(timerMinutes).padStart(2, "0").split("").map((c, i) => (
                              <AnimatedDigit key={`min-${i}-${c}`} char={c} />
                            ))}
                            <span className="animate-pulse mx-1 block text-theme-text select-none">:</span>
                            {String(timerSeconds).padStart(2, "0").split("").map((c, i) => (
                              <AnimatedDigit key={`sec-${i}-${c}`} char={c} />
                            ))}
                          </h2>
                          <span className="text-[9px] text-theme-muted block mt-2 font-mono">
                            极客段落: {completedSessions}/{focusGoal} 轮轴次
                          </span>
                        </div>
                      </div>

                      {/* Interaction panel buttons */}
                      <div className="flex gap-4 mt-6">
                        {isTimerRunning ? (
                          <button
                            onClick={pauseTimer}
                            className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 flex items-center gap-1.5"
                          >
                            <Pause size={13} /> 暂停专注
                          </button>
                        ) : (
                          <button
                            onClick={startTimer}
                            className="px-6 py-2.5 rounded-xl bg-accent text-white font-black text-xs shadow-md shadow-accent/20 transition-all hover:bg-accent/90 flex items-center gap-1.5"
                          >
                            <Play size={13} /> 开启自修
                          </button>
                        )}
                        <button
                          onClick={resetTimer}
                          className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border hover:border-accent/30 text-theme-muted hover:text-theme-text flex items-center justify-center transition-all"
                          title="重置时钟"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Stats footer panel inside clock */}
                    <div className="grid grid-cols-2 gap-4 border-t border-theme-border/60 pt-4 mt-4 text-center">
                      <div className="p-2.5 bg-theme-bg/50 rounded-xl border border-theme-border/30">
                        <span className="text-[9px] text-theme-muted font-bold block mb-0.5">自修累计时长</span>
                        <span className="text-xs font-black text-theme-text font-mono">{totalFocusMinutes} Mins</span>
                      </div>
                      <div className="p-2.5 bg-theme-bg/50 rounded-xl border border-theme-border/30">
                        <span className="text-[9px] text-theme-muted font-bold block mb-0.5">专注效率</span>
                        <span className="text-xs font-black text-accent font-mono">98.5%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Gamified study badges card - Expanded & beautifully aligned to left bottom */}
          <div className="p-6 rounded-3xl bg-theme-card border border-theme-border relative overflow-hidden shadow-sm">
            <div className="border-b border-theme-border/60 pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5">
                <Award size={14} className="text-accent animate-pulse" />
                自学会客舱勋章 ({Object.values(unlockedBadges).filter(Boolean).length}/12)
              </h3>
              <span className="text-[9px] font-mono text-accent bg-accent/15 px-2 py-0.5 rounded-full font-bold">
                深度游戏化修行体系
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/* Badge 1 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.firstSession 
                  ? "bg-accent/5 border-accent/25 shadow-sm hover:border-accent/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.firstSession ? "bg-accent text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    壹
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">初探清幽门扉</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  完成首场番茄专注。
                </span>
              </div>

              {/* Badge 2 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.deepStreaksClass 
                  ? "bg-emerald-500/5 border-emerald-500/25 shadow-sm hover:border-emerald-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.deepStreaksClass ? "bg-emerald-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    肆
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">修行自持大满贯</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  累积专注达 4 轮。
                </span>
              </div>

              {/* Badge 3 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.timerMilestone 
                  ? "bg-yellow-500/5 border-yellow-500/25 shadow-sm hover:border-yellow-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.timerMilestone ? "bg-yellow-500 text-neutral-900" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    时
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">时间沙漏记录者</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  专注超过 15 分钟。
                </span>
              </div>

              {/* Badge 4 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.waterAndFireSyms 
                  ? "bg-orange-500/5 border-orange-500/25 shadow-sm hover:border-orange-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.waterAndFireSyms ? "bg-orange-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    瑟
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">水火共鸣律动机</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  同时开火花与春雨。
                </span>
              </div>

              {/* Badge 5 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.naturalOrchestration 
                  ? "bg-teal-500/5 border-teal-500/25 shadow-sm hover:border-teal-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.naturalOrchestration ? "bg-teal-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    合
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">自然合鸣大师</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  混音激活 3 档及以上。
                </span>
              </div>

              {/* Badge 6 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.micUsedSonar 
                  ? "bg-pink-500/5 border-pink-500/25 shadow-sm hover:border-pink-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.micUsedSonar ? "bg-pink-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    声
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">极客音色雷达</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  捕获外设音频拾音一次。
                </span>
              </div>

              {/* Badge 7 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.customVocalWave 
                  ? "bg-purple-500/5 border-purple-500/25 shadow-sm hover:border-purple-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.customVocalWave ? "bg-purple-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    律
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">天籁共鸣曲谱</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  上传本地 MP3 音源自习。
                </span>
              </div>

              {/* Badge 8 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.spaceExplorerShip 
                  ? "bg-blue-500/5 border-blue-500/25 shadow-sm hover:border-blue-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.spaceExplorerShip ? "bg-blue-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    轨
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">星游银河旅人</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  启动「宇宙空谷」低音。
                </span>
              </div>

              {/* Badge 9 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.masterZenCompleter 
                  ? "bg-rose-500/5 border-rose-500/25 shadow-sm hover:border-rose-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.masterZenCompleter ? "bg-rose-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    玖
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">九级天人大师</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  自习累积满 9 轮钟。
                </span>
              </div>

              {/* Badge 10 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.studyTimeHero 
                  ? "bg-indigo-500/5 border-indigo-500/25 shadow-sm hover:border-indigo-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.studyTimeHero ? "bg-indigo-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    航
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">时间领航者</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  累计专注达 60 分钟。
                </span>
              </div>

              {/* Badge 11 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.rhythmExplorer 
                  ? "bg-amber-500/5 border-amber-500/25 shadow-sm hover:border-amber-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.rhythmExplorer ? "bg-amber-500 text-neutral-900" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    谱
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">多维律美探索家</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  体验完四种视觉律动。
                </span>
              </div>

              {/* Badge 12 */}
              <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1 transition duration-300 hover:scale-[1.02] ${
                unlockedBadges.extremeVibeConnoisseur 
                  ? "bg-fuchsia-500/5 border-fuchsia-500/25 shadow-sm hover:border-fuchsia-500/40" 
                  : "bg-theme-bg/40 border-theme-border/30 opacity-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${unlockedBadges.extremeVibeConnoisseur ? "bg-fuchsia-500 text-white" : "bg-theme-bg border border-theme-border text-theme-muted"}`}>
                    气
                  </div>
                  <span className="text-[10px] font-extrabold text-theme-text truncate">重低音大鉴赏</span>
                </div>
                <span className="text-[8px] text-theme-muted leading-tight mt-1">
                  主音量极值并发享受。
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sound Mixer Station & Achievements - Sleek Form Factors (4 columns) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Natural Sound Mixer (Optimized compact tactile notches edition) */}
          <div className="p-5 rounded-3xl bg-theme-card border border-theme-border flex flex-col justify-between relative overflow-hidden">
            <div className="border-b border-theme-border/60 pb-3 mb-4">
              <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5">
                <Sliders size={14} className="text-accent" />
                自然声噪融合工坊
              </h3>
            </div>

            {/* Tactile sliders list (Extremely space-saving) */}
            <div className="flex flex-col gap-2.5">
              {Object.keys(soundVolumes).map((key) => {
                const spec = soundLabels[key];
                return (
                  <div
                    key={key}
                    className="p-2 rounded-2xl bg-theme-bg/30 border border-theme-border/40 hover:bg-theme-bg/50 transition-colors flex items-center justify-between gap-3"
                  >
                    {/* Compact Label */}
                    <div className="flex items-center gap-1.5 shrink-0 max-w-[100px]">
                      <div className={`w-6 h-6 rounded-lg bg-accent/5 flex items-center justify-center border border-theme-border ${spec.color}`}>
                        {spec.icon}
                      </div>
                      <span className="text-[11px] font-bold text-theme-text truncate leading-none">
                        {spec.label.slice(2, 4)} {/* Simple 2 characters */}
                      </span>
                    </div>

                    {/* Notched scale selector (0 -> 25 -> 50 -> 75 -> 100 notches) */}
                    <div className="flex items-center gap-1 flex-1 relative px-2">
                      <div className="absolute left-[8px] right-[8px] h-[2px] bg-theme-border/80 rounded-full pointer-events-none" />
                      {[0, 0.25, 0.5, 0.75, 1.0].map((level, idx) => {
                        const isCurrent = Math.abs(soundVolumes[key] - level) < 0.05;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleVolumeChange(key, level)}
                            className="relative z-10 flex flex-col items-center flex-1 py-1 group"
                          >
                            <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                              isCurrent 
                                ? "bg-accent border-accent shadow-sm shadow-accent/50 scale-125 font-extrabold" 
                                : "bg-theme-card border-theme-border hover:border-accent/30 scale-100"
                            }`}>
                              {isCurrent && <div className="w-1 h-1 rounded-full bg-white" />}
                            </div>
                            <span className={`text-[8px] font-mono mt-1.5 transition-colors leading-none select-none ${isCurrent ? "text-accent font-black scale-105" : "text-theme-muted group-hover:text-theme-text"}`}>
                              {Math.round(level * 100)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets for noise combination */}
            <div className="mt-4 border-t border-theme-border/55 pt-3">
              <span className="text-[9px] font-mono font-extrabold text-theme-muted tracking-wide block mb-1.5">
                环境自然音色预设
              </span>
              <div className="flex flex-col gap-1.5">
                {ambientPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      initializeContext();
                      Object.keys(preset.volumes).forEach((k) => 
                        handleVolumeChange(k, (preset.volumes as any)[k])
                      );
                    }}
                    className="w-full py-1.5 px-2 bg-theme-bg/60 hover:bg-theme-border/40 border border-theme-border/50 rounded-xl text-[10px] font-bold text-theme-text transition flex items-center justify-between"
                  >
                    <span>{preset.name}</span>
                    <span className="text-[8px] font-mono font-bold text-accent opacity-75">一键宏 &rarr;</span>
                  </button>
                ))}
                
                <button
                  onClick={() => {
                    initializeContext();
                    Object.keys(soundVolumes).forEach((k) => handleVolumeChange(k, 0));
                  }}
                  className="w-full py-1 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg text-[9px] font-black text-red-500 transition"
                >
                  🔇 全部清空
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Practice Guide & Tips on Bottom Right */}
          <div className="p-6 rounded-3xl bg-theme-card border border-theme-border shadow-sm relative overflow-hidden">
            <div className="border-b border-theme-border/60 pb-3 mb-4">
              <h3 className="text-xs font-black text-theme-text flex items-center gap-1.5">
                <Sparkles size={14} className="text-accent animate-pulse" />
                📖 极时光 • 自修修行与功能指南
              </h3>
            </div>

            <div className="flex flex-col gap-3 text-[11px] text-theme-muted">
              {/* Study advice */}
              <div className="p-3 rounded-xl bg-theme-bg/40 border border-theme-border/30 leading-relaxed">
                <span className="text-accent font-extrabold block mb-1">💡 高效番茄工作法建议：</span>
                自习一轮默认 25 分钟。期间建议静音手机通知，在<b>「极光丝绸」</b>或<b>「声纳波纹」</b>的呼吸律动伴随下，将视线聚焦于屏幕自然放空 30 秒，极速沉浸入深度专注心流桥梁。
              </div>

              {/* Usage Tips */}
              <div className="p-3 rounded-xl bg-theme-bg/40 border border-theme-border/30 leading-relaxed">
                <span className="text-pink-500 font-extrabold block mb-1">🔔 声能律动直读秘诀：</span>
                无需外置音响！点击左侧的<b>「捕获麦克风」</b>按钮后，在弹出的窗口中选择「系统音频/标签页」，勾选共享音频，即可瞬间无延迟捕捉网易云、QQ音乐等任何外界播放源。
              </div>

              <div className="p-3 rounded-xl bg-theme-bg/40 border border-theme-border/30 leading-relaxed">
                <span className="text-emerald-500 font-extrabold block mb-1">🎵 私人伴读唱片定制：</span>
                支持直接将任何 MP3 或 WAV 格式的白噪音、轻音乐拖拽或载入自修。所有过程由浏览器客户端 100% 本地多线程加速高保真执行，既私密、又安全。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
