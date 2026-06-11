import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Heart, Music, Sparkles, X, ChevronRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const MIKU_QUOTES = [
  "你好呀！我是赤音 (Akane)，很高兴在拾壹屿与你相遇呀！✨",
  "啦啦啦~ 今天也是闪闪发光、充满旋律的一天呢！🎵",
  "（正在轻轻闭眼听着你心底的旋律呢... 🎶）",
  "戳到我啦！哎呀，刚才你有去看摄影作品还是视频纪录呢？",
  "在这片多维的避风岛屿里，希望能给你带来一丝温暖与慰藉。🌊",
  "Akane ~ Akane ~ 你今天听我的歌了吗？❤️",
  "如果累了就去看看治愈的风景随笔吧，要好好照顾自己哦！🌱",
  "告诉一个秘密：在个性化页面微调我，可以调出梦幻的高斯景深质感哦！",
  "呀！你拖拽我了！感觉像在全息舞台上飞起来一样！💫",
  "永远觉得，能通过代码与文字将思绪封存，是一件极为美好的事情。"
];

export default function MikuWidget() {
  const { character } = useTheme();
  const [dialogue, setDialogue] = useState<string>("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [expression, setExpression] = useState<"cool" | "happy" | "singing">("happy");
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto show a greeting on first load if miku is enabled
  useEffect(() => {
    if (character === "miku") {
      const timer = setTimeout(() => {
        triggerDialogue("你好呀！欢迎来到拾壹屿，我是看板娘赤音，今天也请多多指教！✨");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [character]);

  if (character !== "miku") {
    return null;
  }

  const triggerDialogue = (textLines?: string) => {
    const text = textLines || MIKU_QUOTES[Math.floor(Math.random() * MIKU_QUOTES.length)];
    setDialogue(text);
    setBubbleVisible(true);
    
    // Change expression randomly
    const exprs: Array<"cool" | "happy" | "singing"> = ["cool", "happy", "singing"];
    setExpression(exprs[Math.floor(Math.random() * exprs.length)]);

    // Auto hide bubble after 4.5 seconds
    const hideTimer = setTimeout(() => {
      setBubbleVisible(false);
    }, 4500);

    return () => clearTimeout(hideTimer);
  };

  const handleMikuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickCount((prev) => prev + 1);
    triggerDialogue();
  };

  return (
    <div className="fixed right-6 bottom-6 z-[60] pointer-events-none select-none">
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="flex flex-col items-end pointer-events-auto"
            style={{ touchAction: "none" }}
          >
            {/* Interactive Speech Bubble */}
            <AnimatePresence>
              {bubbleVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="mb-3 max-w-[240px] md:max-w-[280px] p-4 bg-theme-card/90 backdrop-blur-md rounded-2xl border border-theme-border shadow-xl text-xs text-theme-text font-medium relative leading-relaxed"
                >
                  <p>{dialogue}</p>
                  {/* Speech bubble small triangle pointer */}
                  <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-theme-card border-r border-b border-theme-border rotate-45 transform" />
                  
                  {/* Decorative tiny indicators */}
                  <div className="flex gap-1 items-center mt-2 justify-end opacity-50 text-[10px]">
                    <Music size={10} className="text-accent animate-spin" style={{ animationDuration: "3s" }} />
                    <span>Akane Terminal</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Miku Desktop Avatar Container */}
            <div className="relative group">
              
              {/* Pulsing Backlight Halo on hover */}
              <div className="absolute inset-0 bg-accent/25 rounded-full blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />

              {/* Action Buttons Overlay */}
              <div className="absolute -left-10 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 bg-theme-card hover:bg-accent-light border border-theme-border text-theme-muted hover:text-accent rounded-xl shadow-md transition-all cursor-pointer"
                  title="收起看板娘"
                >
                  <X size={12} />
                </button>
                <div 
                  className="p-1.5 bg-theme-card border border-theme-border text-accent rounded-xl shadow-md flex items-center justify-center animate-bounce"
                  style={{ animationDuration: "2s" }}
                >
                  <Sparkles size={11} />
                </div>
              </div>

              {/* Core Avatar Sphere - Using Framer Motion for premium drag and drop */}
              <motion.div
                drag
                dragConstraints={{ left: -300, right: 20, top: -500, bottom: 20 }}
                dragElastic={0.1}
                whileDrag={{ scale: 1.05 }}
                onDragStart={() => triggerDialogue("哇！你拖拽我了！感觉像在星空里飞起来一样！✨")}
                onClick={handleMikuClick}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-accent bg-theme-card shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center relative transition-colors duration-500 pointer-events-auto"
              >
                {/* Minimalist vector stylized miku vector / illustration crop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-cyan-500/10" />
                
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=260&auto=format&fit=crop"
                  alt="Akane Mascot"
                  className="w-[140%] h-[140%] object-cover object-top -translate-y-1.5 select-none scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const backup = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=260&auto=format&fit=crop";
                    if (target.src !== backup) {
                      target.src = backup;
                    }
                  }}
                />

                {/* Live micro emotion badge */}
                <span className="absolute bottom-1 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-theme-card flex items-center justify-center text-[7px] text-white">
                  ⚡
                </span>

                {/* Expression overlays depending on state */}
                {expression === "singing" && (
                  <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
                    <span className="bg-accent text-white dark:text-zinc-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-xs animate-pulse">
                      SINGING...
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Sleek Minimized State trigger icon */
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setIsMinimized(false);
              triggerDialogue("欢迎回来！我又回到你的航线上啦。✿");
            }}
            className="flex items-center gap-2 p-3 bg-accent text-white dark:text-zinc-900 rounded-full shadow-lg border border-accent hover:opacity-90 pointer-events-auto transition-all cursor-pointer"
          >
            <ChevronRight size={16} className="rotate-180" />
            <span className="text-xs font-bold pr-2 flex items-center gap-1">
              <Music size={12} className="animate-spin" style={{ animationDuration: "4s" }} />
              唤醒赤音
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
