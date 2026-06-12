import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, ArrowRight, ArrowLeft, Cpu, Sparkles, Layers, Sliders, Smartphone, Laptop, Tablet as TabletIcon } from "lucide-react";
import ImgCDN from "../components/ImgCDN";
import CdnSpeedGovernor from "../components/CdnSpeedGovernor";
import Skeleton from "../components/Skeleton";
import photosData from "../data/photos.json";

// Type definitions
interface Photo {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

interface PhotoTheme {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  photos: Photo[];
}

interface ImageMeta {
  width: number;
  height: number;
  isLandscape: boolean;
  aspectRatio: number;
}

// Custom hook to detect device type responsive configurations
function useDeviceType() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      // Debounced updates to keep the optics calculations ultra-lightweight
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return useMemo(() => {
    if (windowWidth < 768) {
      return {
        name: "Mobile Device",
        label: "移动端流式微型幅面",
        icon: Smartphone,
        spacingClass: "gap-6",
        paddingLeftClass: "pl-6",
        paddingRightClass: "pr-[15vw]",
        layoutHint: "支持双指缩放及边缘弹性滑动",
        landscapeW: "w-[80vw]",
        portraitW: "w-[54vw]",
        cropW: "w-[80vw]"
      };
    }
    if (windowWidth < 1024) {
      return {
        name: "Tablet Device",
        label: "平板视网膜中控幅面",
        icon: TabletIcon,
        spacingClass: "gap-8",
        paddingLeftClass: "pl-12",
        paddingRightClass: "pr-[20vw]",
        layoutHint: "触屏手势更友好，自适应纵横排版优化",
        landscapeW: "w-[55vw] max-w-[520px]",
        portraitW: "w-[36vw] max-w-[340px]",
        cropW: "w-[55vw] max-w-[520px]"
      };
    }
    return {
      name: "PC Desktop",
      label: "PC全画幅超宽端宽幕",
      icon: Laptop,
      spacingClass: "gap-12 xl:gap-16",
      paddingLeftClass: "pl-12 md:pl-24 lg:pl-32",
      paddingRightClass: "pr-[25vw]",
      layoutHint: "鼠标指针悬停触发光学物理学参数 HUD",
      landscapeW: "w-[42vw] xl:w-[38vw] max-w-[680px]",
      portraitW: "w-[26vw] xl:w-[24vw] max-w-[420px]",
      cropW: "w-[42vw] xl:w-[38vw] max-w-[680px]"
    };
  }, [windowWidth]);
}

const themes = photosData as PhotoTheme[];

export default function Photography() {
  const [isLoading, setIsLoading] = useState(true);
  const [engineActive, setEngineActive] = useState(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [imageMetadata, setImageMetadata] = useState<Record<string, ImageMeta>>({});
  
  // Dynamic Responsive Device Parameter
  const device = useDeviceType();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const sortedThemes = useMemo(() => {
    return [...themes].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [sortOrder]);

  // Pre-probe All Image Dimensions in the Background
  useEffect(() => {
    themes.forEach((theme) => {
      theme.photos.forEach((photo) => {
        const img = new Image();
        img.src = photo.url;
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const isLandscape = width >= height;
          setImageMetadata((prev) => ({
            ...prev,
            [photo.id]: {
              width,
              height,
              isLandscape,
              aspectRatio: width / height,
            },
          }));
        };
      });
    });
  }, []);

  // Global Engine Telemetry Counts
  const totalPhotos = useMemo(() => themes.reduce((acc, t) => acc + t.photos.length, 0), []);
  const detectedCount = Object.keys(imageMetadata).length;
  const landscapeCount = useMemo(() => 
    (Object.values(imageMetadata) as ImageMeta[]).filter((m) => m.isLandscape).length, 
    [imageMetadata]
  );
  const portraitCount = useMemo(() => 
    (Object.values(imageMetadata) as ImageMeta[]).filter((m) => !m.isLandscape).length, 
    [imageMetadata]
  );

  return (
    <div className="pt-24 pb-32 min-h-screen">
      {/* Title & Introduction Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center px-6 max-w-4xl mx-auto flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-2xl flex items-center justify-center mb-6 -rotate-3 border border-zinc-200/40 dark:border-zinc-800/40">
          <Camera size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-100 mb-6 tracking-tighter">
          光影画廊
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-serif mb-8 leading-relaxed">
          以主题为名，用镜头语言讲述不同维度的故事。
          <br className="hidden md:block" />
          横向滑动，即可浏览完整的作品画廊。
        </p>

        {/* Network speed governor widget */}
        <div className="mb-8">
          <CdnSpeedGovernor />
        </div>

        {/* 拾壹功能光学引擎 (Shiyi Optics Engine) Controls Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-3xl p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-left"
        >
          {/* Subtle gradient glowing accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-transparent pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-cyan-400/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
              <Cpu size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest leading-none">
                  Optics Engine v2.5 // Terminal Adaptive
                </span>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-wider">
                  拾壹自适应光学引擎
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-md">
                实时计算照片物理幅面比例。开启后，将完美自适应保留作品原始完整虚化和构图比例（拒绝强行裁切），并根据当前终端自适应重组渲染排版流。
              </p>
              
              {/* Telemetry and metadata info summary & Detected device info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-1">
                  <Layers size={11} className="text-blue-500" />
                  <span>幅面感知: <strong className="text-zinc-700 dark:text-zinc-300">{detectedCount} / {totalPhotos}</strong> 张</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span>分层排序: <strong className="text-zinc-700 dark:text-zinc-300">{landscapeCount}横 / {portraitCount}竖</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                  {React.createElement(device.icon, { size: 12 })}
                  <span>{device.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive tactile mode switcher */}
          <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
            <div className="flex bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/80 p-1 rounded-2xl w-full md:w-auto">
              <button
                onClick={() => setEngineActive(true)}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  engineActive
                    ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-neutral-50 shadow-sm scale-100"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 scale-95"
                }`}
              >
                <Sparkles size={12} className={engineActive ? "text-blue-500" : ""} />
                智能自适应
              </button>
              <button
                onClick={() => setEngineActive(false)}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  !engineActive
                    ? "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-neutral-50 shadow-sm scale-100"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 scale-95"
                }`}
              >
                原版裁剪
              </button>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 pr-2">
              状态: {engineActive ? `⚡ ${device.name} 独占重组中` : "🔒 等比裁剪模式"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Timeline Sorting Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-10 flex justify-end"
      >
        <button
          onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
          className="flex items-center gap-3 py-2 px-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-300 group select-none cursor-pointer"
        >
          {/* Elegant simple minimalist lines */}
          <div className="relative flex flex-col justify-between w-4 h-3 overflow-hidden">
            <span className={`w-3.5 h-0.5 bg-zinc-650 dark:bg-zinc-400 rounded transition-all duration-300 ${sortOrder === "desc" ? "translate-x-0" : "translate-x-1.5"}`} />
            <span className="w-4 h-0.5 bg-zinc-450 dark:bg-zinc-500 rounded" />
            <span className={`w-3 h-0.5 bg-zinc-700 dark:bg-zinc-350 rounded transition-all duration-300 ${sortOrder === "desc" ? "translate-x-1" : "translate-x-0"}`} />
          </div>
          <div className="flex flex-col items-start leading-none text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-505 pb-0.5">
              TIMELINE SORT // 时间系统
            </span>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {sortOrder === "desc" ? "最近发布最先 (倒序)" : "最早发布最先 (顺序)"}
            </span>
          </div>
        </button>
      </motion.div>

      {/* Gallery Section */}
      {isLoading ? (
        <Skeleton type="photo-theme" />
      ) : sortedThemes.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 px-6">
          暂无作品。请在 data/photos.json 中添加数据。
        </div>
      ) : (
        <div className="space-y-24 md:space-y-36 lg:space-y-48">
          {sortedThemes.map((theme, idx) => (
            <ThemeGallery 
              key={theme.id} 
              theme={theme} 
              index={idx} 
              engineActive={engineActive}
              imageMetadata={imageMetadata}
              device={device}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeGallery({
  theme,
  index,
  engineActive,
  imageMetadata,
  device,
}: {
  theme: PhotoTheme;
  index: number;
  engineActive: boolean;
  imageMetadata: Record<string, ImageMeta>;
  device: any;
  key?: string | React.Key;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -window.innerWidth * 0.5,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: window.innerWidth * 0.5,
        behavior: "smooth",
      });
    }
  };

  // Compute Sorted Array based on Optical Filter
  // If Optics Engine is engaged: Landscape (isLandscape === true) first, then Portrait (isLandscape === false)
  const processedPhotos = useMemo(() => {
    if (!engineActive) return theme.photos;

    return [...theme.photos].sort((a, b) => {
      const meta = imageMetadata[a.id];
      const metaB = imageMetadata[b.id];

      // Default loading state as landscape
      const isLandA = meta ? meta.isLandscape : true;
      const isLandB = metaB ? metaB.isLandscape : true;

      if (isLandA && !isLandB) return -1;
      if (!isLandA && isLandB) return 1;
      return 0; // preserve original relative order
    });
  }, [theme.photos, imageMetadata, engineActive]);

  return (
    <div className="relative">
      <div 
        className={`${device.paddingLeftClass} pr-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6`}
      >
        {/* Caption/Title block */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl px-1"
        >
          <span className="text-sm font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase mb-4 block">
            Chapter {(index + 1).toString().padStart(2, "0")} //{" "}
            {new Date(theme.createdAt).getFullYear()}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
            {theme.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-serif leading-relaxed text-lg">
            {theme.description}
          </p>
        </motion.div>

        {/* Carousel arrows */}
        <div className="hidden md:flex items-center gap-3 pr-12 pb-2">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-zinc-650 dark:text-zinc-350 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="w-12 h-12 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-zinc-650 dark:text-zinc-350 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Dynamic Scroll Track */}
      <div className="relative group/track">
        <div
          ref={containerRef}
          className={`flex overflow-x-auto snap-x snap-mandatory pt-4 pb-12 custom-scrollbar ${device.spacingClass} ${device.paddingLeftClass} ${device.paddingRightClass} ${
            engineActive 
              ? "items-stretch" 
              : "items-start"
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {processedPhotos.map((photo, jdx) => {
              const meta = imageMetadata[photo.id];
              const isLandscape = meta ? meta.isLandscape : true;

              // Size configuration:
              // Under Shiyi Optics Engine, vertical pictures choose narrow, horizontal choose wide.
              // All are driven by current device context layout configuration.
              const cardWidthClass = engineActive
                ? isLandscape
                  ? device.landscapeW
                  : device.portraitW
                : device.cropW;

              const aspectClass = engineActive
                ? isLandscape
                  ? "aspect-[3/2]"
                  : "aspect-[2/3]"
                : "aspect-[4/3] md:aspect-[3/2]";

              return (
                <motion.div
                  key={photo.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: "easeInOut",
                    layout: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  className={`snap-center shrink-0 flex flex-col justify-between ${cardWidthClass}`}
                >
                  {/* Photo Canvas Container */}
                  <div className={`overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 relative shadow-xl border border-zinc-200/40 dark:border-zinc-800/40 group/photo w-full ${aspectClass}`}>
                    <ImgCDN
                      src={photo.url}
                      alt={photo.title || theme.title}
                      className="w-full h-full object-cover group-hover/photo:scale-[1.03] transition-transform duration-700 ease-out select-none"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Dark gradient shadow inside */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Telemetry info HUD badge on hover */}
                    {engineActive && (
                      <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-[10px] text-zinc-300 font-mono py-1 px-2.5 rounded-full opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 pointer-events-none tracking-wider flex items-center gap-1.5 shadow border border-white/10">
                        <span className={`w-1.5 h-1.5 rounded-full ${isLandscape ? "bg-cyan-400" : "bg-sky-400 "}`} />
                        {meta ? `${Math.round(meta.aspectRatio * 100) / 100}:1` : "COORDINATING"} // {isLandscape ? "風光景深" : "立軸人像"}
                      </div>
                    )}
                  </div>

                  {/* Caption & Metadata Footer Section */}
                  <div className="mt-4 flex items-start justify-between">
                    {photo.title && !/^图片\s*\d+$/.test(photo.title) ? (
                      <div className="pr-4 max-w-[80%] text-left">
                        <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {photo.title}
                        </h3>
                        {photo.description && (
                          <p className="text-zinc-500 dark:text-zinc-400 font-serif text-xs md:text-sm mt-1 leading-relaxed line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {theme.title}
                        </span>
                        <span className="text-[10px] md:text-xs font-mono text-zinc-400 dark:text-zinc-600">
                          作品片段 // {isLandscape ? "横幅宽景画卷" : "立轴透视肖像"}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col items-end gap-1 shrink-0 ml-auto pt-0.5 font-mono">
                      <span className="text-zinc-400 dark:text-zinc-650 text-xs tracking-wider font-bold">
                        No. {(jdx + 1).toString().padStart(2, "0")}
                      </span>
                      {engineActive && meta && (
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded leading-none text-right shadow-sm border border-zinc-200/10 dark:border-zinc-800/10">
                          {isLandscape ? "3:2 WIDE" : "2:3 TALL"}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* End cap placeholder */}
          <div className="snap-center shrink-0 w-[20vw] flex items-center justify-center select-none pt-12 self-center">
            <div className="text-zinc-300 dark:text-zinc-700 flex flex-col items-center">
              <span className="w-12 h-px bg-zinc-300 dark:bg-zinc-700 mb-4 block" />
              <span className="font-mono text-xs uppercase tracking-widest leading-none">
                End of Section
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
