import React from "react";
import { motion } from "motion/react";
import {
  Heart,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Compass,
  History,
  Calendar,
  Clock,
} from "lucide-react";

// Standard professional bezier dynamics for fluid non-linear animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 16,
      mass: 0.7,
    },
  },
};

interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export default function About() {
  // Real-time calculation since standard baseline station launch (2026-03-20 to current)
  const launchDate = new Date("2026-03-20");
  const currentDate = new Date();
  const totalDays = Math.max(
    0,
    Math.floor((currentDate.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const changelog: ChangelogItem[] = [
    {
      version: "v1.1.1",
      date: "2026-06-13",
      title: "全新本站美学专栏上线",
      description:
        "全新关于本站专栏极简上线。重新梳理自研流体核心优化规则，重构高对比自然负空间排版布局，完美适配全面响应式视画对齐。",
      tags: ["关于本站", "非线性动效", "排版重构"],
    },
    {
      version: "v1.1.0",
      date: "2026-06-12",
      title: "拾壹屿空间正式惊喜上线",
      description:
        "「拾壹屿」首个正式发行的里程碑大版本。整站功能首发上线，深度集成了高感度系统硬件监视、静谧个人日记随笔、多维个性化配置中心、沉浸式摄影与流媒体纯前端播放底座。轻量灵巧，干净无垢。",
      tags: ["正式上线", "功能大礼包", "全新版本"],
    },
    {
      version: "Pre-Release",
      date: "2026-04-10",
      title: "首次小范围封闭精细测试",
      description:
        "完成自研弹簧惯性机制的首次压力调试，精修在全宿主平台中对指纹探测和只读API的静默脱敏逻辑，为后续面世打下纯净安全基底。",
      tags: ["小范围公测", "环境调优", "压力测试"],
    },
    {
      version: "Framework Initial",
      date: "2026-03-20",
      title: "项目正式立项与白皮书架构确立",
      description:
        "空间灵感起点，定义核心代码逻辑、零宽边界流体排版。配置最底层双主题自适应转换策略，确立不储存、不上传任何个人数据的浏览器沙箱底座。",
      tags: ["立项仪式", "多色自适应", "白网方案"],
    },
  ];

  return (
    <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mb-16 text-center md:text-left relative"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/4 rounded-full blur-3xl pointer-events-none" />
        <span className="text-[10px] font-mono tracking-[0.25em] text-accent uppercase bg-accent-light/10 text-accent px-4 py-1.5 rounded-full font-black inline-block mb-4">
          DIGITAL ISLAND SPEC
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-theme-text tracking-tight mb-4 select-none">
          关于拾壹屿
        </h1>
        <p className="text-theme-muted max-w-2xl text-base md:text-lg leading-relaxed font-sans">
          一个致力于探索新时代美学设计与个人分享的数字化地点。愿每一张图片，每一句思考都能带来回响。
        </p>

        {/* Dynamic Running counter */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-xs font-mono">
            <Clock size={13} className="text-accent shrink-0 animate-pulse" />
            <span className="text-theme-muted">本站已安稳运转:</span>
            <span className="text-theme-text font-bold">{totalDays} 天</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-xs font-mono">
            <Compass size={13} className="text-accent shrink-0" />
            <span className="text-theme-muted">纯前端零上报隐私隔离</span>
          </div>
        </div>
      </motion.div>

      {/* CORE SECTOR 1: DESIGN INITIAL INTENT & WEBPAGE CHARACTERISTICS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {/* Card 1: Intent 设计初衷 */}
        <motion.div
          variants={cardVariants}
          className="md:col-span-2 p-8 rounded-3.5xl bg-theme-card border border-theme-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/3 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/6 transition-colors" />
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-light/10 text-accent flex items-center justify-center border border-accent/15">
                <Heart size={18} />
              </div>
              <h3 className="text-xl font-black text-theme-text">设计初衷</h3>
            </div>
            <div className="space-y-4 text-theme-muted text-sm md:text-base leading-relaxed font-sans">
              <p>
                在今天，充斥着广告轰炸、暗黑诱导按钮和臃肿数据垃圾的互联网让数字生活愈加令人窒息。我们每天都在应对千篇一律的模板、狂暴吞噬内存的弹窗、以及动辄强制收集硬件指纹和精细位置的大数据追踪。
              </p>
              <p className="font-semibold text-theme-text">
                「拾壹屿」的诞生，即是对这种现状的一次温柔抗争。
              </p>
              <p>
                我们秉承「极简即是无限」的美学边界，去除一切冗余的视觉噪音与伪技术元素。在这里，没有令人眩晕的无脑渐变与低效弹窗，只有经过严格黄金比例缩进的「流体负空间」、手感细腻的「阻尼运动物理动画」、以及令人眼睛舒适的「高对比日夜微色调画布」。
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-theme-border/50 text-xs text-theme-muted font-mono flex items-center gap-2">
            <Sparkles size={13} className="text-accent animate-pulse" />
            <span>让网页美学重新回归直觉、本真与克制</span>
          </div>
        </motion.div>

        {/* Card 2: Aesthetic Details 风格特征 */}
        <motion.div
          variants={cardVariants}
          className="p-8 rounded-3.5xl bg-theme-card border border-theme-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center border border-pink-500/15">
                <Layers size={18} />
              </div>
              <h3 className="text-xl font-black text-theme-text">风格矩阵</h3>
            </div>
            <div className="space-y-5 text-xs text-theme-muted font-sans">
              <div>
                <span className="text-theme-text font-bold block mb-1">■ 瑞士几何排版</span>
                <p className="leading-relaxed">采用 Inter 与全球无损大字距 display 字簇。配合 Space Grotesk 的科技质感，强调清晰的节奏感和信息重负。 </p>
              </div>
              <div>
                <span className="text-theme-text font-bold block mb-1">■ 自然非线性动效</span>
                <p className="leading-relaxed">丢弃粗暴的线性插值，全面接入具备真实质能比与摩擦系数的弹簧共振物理学，令每个过渡具有生命的物理呼吸属性。</p>
              </div>
              <div>
                <span className="text-theme-text font-bold block mb-1">■ 克制微色调底盘</span>
                <p className="leading-relaxed">不施加高纯度迷幻霓虹，选用极安全的高反差碳黑与微冷浅白底色，最大程度降低双向切换视疲劳。</p>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-pink-500 text-right mt-6">
            GRID DESIGN MODEL
          </div>
        </motion.div>
      </motion.div>

      {/* CORE SECTOR 2: SELF-DEVELOPED FLUID ENGINE */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
      >
        {/* Left Intro Card on Self-Developed Engine */}
        <motion.div
          variants={cardVariants}
          className="p-8 rounded-3.5xl bg-slate-950 dark:bg-black text-slate-100 border border-slate-800 lg:col-span-1 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/15 to-transparent pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-mono tracking-widest text-accent bg-accent/20 px-2.5 py-1 rounded-full font-bold uppercase">
                ENGINE CORE SPEC
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-4">
              “拾壹无重力”流体渲染体系
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
              为了实现毫无卡顿、优雅轻盈的视画交互，拾壹屿内置了一整套极轻量的前端无重力渲染核心。
            </p>
            <div className="space-y-3 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between items-center py-2 border-b border-slate-850">
                <span>物理学底层:</span>
                <span className="text-accent font-bold">弹簧共振公式</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-850">
                <span>渲染阻塞:</span>
                <span className="text-emerald-500 font-bold">极微毫秒零阻塞</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-850">
                <span>像素比规整率:</span>
                <span className="text-cyan-400 font-bold">高视网膜对齐</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>防重流失真:</span>
                <span className="text-amber-400 font-bold">自适应防抖节流</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-[10px] text-slate-500 font-mono">
            BUILD SYSTEM: VITE BINDINGS
          </div>
        </motion.div>

        {/* Right Details on Engine Innovations with structured rectangular borders and dynamic ticks */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-2 p-8 rounded-3.5xl bg-theme-card border border-theme-border flex flex-col justify-between group"
        >
          <div className="space-y-6">
            <h4 className="text-xs font-black text-theme-text font-mono uppercase tracking-wider border-b border-theme-border/50 pb-3 flex items-center gap-2">
              <Cpu size={14} className="text-accent" /> 自研引擎四大核心优化准则
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="p-5 rounded-2xl border border-theme-border/50 bg-theme-bg/30 relative overflow-hidden group/opt hover:border-accent/25 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5 relative">
                    <span className="w-5 h-5 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-[10px] font-black shrink-0 border border-accent/10">
                      01
                    </span>
                    <h5 className="font-bold text-[13px] text-theme-text font-sans">
                      非阻塞惯性滚动与被动感知
                    </h5>
                  </div>
                  <p className="text-xs text-theme-muted leading-relaxed pl-7 font-sans">
                    采用完全隔离的被动事件侦听器。在拖拽、视距改变以及页面缩放等高阶重绘场景下，将原生渲染开销降至极限，消除页面微抖动。
                  </p>
                </div>
                <div className="absolute right-3 top-3 w-4 h-[1px] bg-theme-border/40 group-hover/opt:w-8 group-hover/opt:bg-accent/40 transition-all" />
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl border border-theme-border/50 bg-theme-bg/30 relative overflow-hidden group/opt hover:border-accent/25 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5 relative">
                    <span className="w-5 h-5 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center font-mono text-[10px] font-black shrink-0 border border-pink-500/10">
                      02
                    </span>
                    <h5 className="font-bold text-[13px] text-theme-text font-sans">
                      GPU 硬件抗锯齿感知调校
                    </h5>
                  </div>
                  <p className="text-xs text-theme-muted leading-relaxed pl-7 font-sans">
                    直接调用标准硬件 WebGL 的反走样与视界剪切缓冲，在精确捕获渲染硬件芯片的同时，不发生计算线程臃肿，渲染轻盈纯粹。
                  </p>
                </div>
                <div className="absolute right-3 top-3 w-4 h-[1px] bg-theme-border/40 group-hover/opt:w-8 group-hover/opt:bg-accent/40 transition-all" />
              </div>

              {/* Card 3 */}
              <div className="p-5 rounded-2xl border border-theme-border/50 bg-theme-bg/30 relative overflow-hidden group/opt hover:border-accent/25 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5 relative">
                    <span className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-[10px] font-black shrink-0 border border-emerald-500/10">
                      03
                    </span>
                    <h5 className="font-bold text-[13px] text-theme-text font-sans">
                      零云端上报前端隐私保护
                    </h5>
                  </div>
                  <p className="text-xs text-theme-muted leading-relaxed pl-7 font-sans">
                    针对抗防大数据指纹追踪，所有信息流只存在于宿主前端，不需要也绝不进行任何后台物理云汇聚，让工具自立自足、放心舒心。
                  </p>
                </div>
                <div className="absolute right-3 top-3 w-4 h-[1px] bg-theme-border/40 group-hover/opt:w-8 group-hover/opt:bg-accent/40 transition-all" />
              </div>

              {/* Card 4 */}
              <div className="p-5 rounded-2xl border border-theme-border/50 bg-theme-bg/30 relative overflow-hidden group/opt hover:border-accent/25 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5 relative">
                    <span className="w-5 h-5 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-mono text-[10px] font-black shrink-0 border border-purple-500/10">
                      04
                    </span>
                    <h5 className="font-bold text-[13px] text-theme-text font-sans">
                      非线性防重入抖动节流
                    </h5>
                  </div>
                  <p className="text-xs text-theme-muted leading-relaxed pl-7 font-sans">
                    精心调试的防抖和自重排节流层，保证容器或视口突变时，底层图形不发生堆叠。无论在桌面还是移动触屏，惯性回弹丝滑细腻。
                  </p>
                </div>
                <div className="absolute right-3 top-3 w-4 h-[1px] bg-theme-border/40 group-hover/opt:w-8 group-hover/opt:bg-accent/40 transition-all" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-theme-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-mono text-[10px] text-theme-muted">
              纯前端沙箱物理层运行状态
            </span>
            <span className="text-accent font-extrabold flex items-center gap-1.5 font-mono text-[11px] select-none">
              ENGINE INTEGRITY RATING A+ <Zap size={10} className="fill-accent text-accent" />
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* CORE SECTOR 3: CHRONOLOGICAL UNIFIED CHANGELOG TIMELINE (网站更新目录 - All Consolidated) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="p-8 rounded-3.5xl bg-theme-card border border-theme-border relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-theme-border/50">
          <div className="flex items-center gap-3">
            <History className="text-accent shrink-0" size={20} />
            <div>
              <h3 className="text-xl font-black text-theme-text select-none">网站更新目录</h3>
              <p className="text-xs text-theme-muted mt-0.5 font-sans">追寻拾壹屿的开发起点与迭代历程</p>
            </div>
          </div>
        </div>

        {/* Consolidated Timeline wrapper */}
        <div className="relative pl-6 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-theme-border/60">
          {changelog.map((item) => (
            <motion.div
              key={item.version}
              variants={cardVariants}
              className="relative group/time flex flex-col md:flex-row md:items-start gap-3 md:gap-8"
            >
              {/* Timeline bubble bullet with steady core */}
              <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full bg-theme-card border-3 border-accent flex items-center justify-center relative shrink-0 z-10 transition-transform duration-300 group-hover/time:scale-125" />

              {/* Version and Date pillar */}
              <div className="md:w-36 shrink-0 lg:pt-0.5">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/15">
                  {item.version}
                </span>
                <p className="text-xs text-theme-muted font-mono mt-2 flex items-center gap-1 select-none">
                  <Calendar size={11} /> {item.date}
                </p>
              </div>

              {/* Body Content card */}
              <div className="flex-1 p-5 rounded-2.5xl bg-theme-bg/50 border border-theme-border/40 group-hover/time:border-accent/25 group-hover/time:bg-theme-bg/90 transition-all duration-300">
                <h4 className="text-base font-black text-theme-text mb-2 flex items-center gap-2">
                  {item.title}
                </h4>
                <p className="text-xs text-theme-muted leading-relaxed mb-4 font-sans">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-medium font-mono text-theme-muted bg-theme-card border border-theme-border rounded px-2 py-0.5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer trace line */}
        <div className="mt-12 pt-6 border-t border-theme-border/40 text-[10px] text-theme-muted font-mono text-center">
          所有更新印记均为极简美学驱动的迭代回响。
        </div>
      </motion.div>
    </div>
  );
}
