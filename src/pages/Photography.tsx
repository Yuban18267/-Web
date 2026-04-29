import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import { getOptimizedImageUrl } from '../lib/utils';
import photosData from '../data/photos.json';

// Type definition based on new structure
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

const themes = photosData as PhotoTheme[];

export default function Photography() {
  return (
    <div className="pt-24 pb-32 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 text-center px-6 max-w-4xl mx-auto"
      >
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
          <Camera size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-100 mb-6 tracking-tighter">
          光影画廊
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-serif">
          以主题为名，用镜头语言讲述不同维度的故事。<br className="hidden md:block"/>横向滑动，即可浏览完整的画卷。
        </p>
      </motion.div>

      {themes.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 px-6">
          暂无作品。请在 data/photos.json 中添加数据。
        </div>
      ) : (
        <div className="space-y-32 md:space-y-48">
          {themes.map((theme, idx) => (
            <ThemeGallery key={theme.id} theme={theme} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeGallery({ theme, index }: { theme: PhotoTheme, index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -window.innerWidth * 0.5, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: window.innerWidth * 0.5, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="pl-6 md:pl-12 lg:pl-24 pr-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* 标题区 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl"
        >
          <span className="text-sm font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase mb-4 block">
            Chapter {(index + 1).toString().padStart(2, '0')} // {new Date(theme.createdAt).getFullYear()}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
            {theme.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-serif leading-relaxed text-lg">
            {theme.description}
          </p>
        </motion.div>
        
        {/* 控制按钮区 (桌面端显著，移动端可直接滑) */}
        <div className="hidden md:flex items-center gap-3 pr-12 pb-2">
          <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* 横向滚动长廊 */}
      <div className="relative group">
        <div 
          ref={containerRef}
          className="flex gap-6 md:gap-12 overflow-x-auto snap-x snap-mandatory pt-4 pb-12 pl-6 md:pl-12 lg:pl-24 pr-6 md:pr-24 custom-scrollbar"
        >
          {theme.photos.map((photo, jdx) => (
            <motion.div 
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: jdx * 0.1, duration: 0.6, ease: "easeOut" }}
              className="snap-center shrink-0 flex flex-col w-[85vw] md:w-[60vw] lg:w-[45vw]"
            >
              <div className="overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 relative aspect-[4/3] md:aspect-[3/2] shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 group/img">
                <img 
                  src={getOptimizedImageUrl(photo.url)}
                  alt={photo.title || theme.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-500" />
              </div>
              
              <div className="mt-6 flex items-start justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="pr-4">
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    {photo.title || 'Untitled'}
                  </h3>
                  {photo.description && (
                    <p className="text-zinc-600 dark:text-zinc-400 font-serif md:text-lg leading-relaxed">
                      {photo.description}
                    </p>
                  )}
                </div>
                <span className="text-zinc-300 dark:text-zinc-700 font-mono text-sm block pt-1">
                  {(jdx + 1).toString().padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          ))}
          
          {/* 长廊结尾彩蛋/占位 */}
          <div className="snap-center shrink-0 w-[20vw] flex items-center justify-center">
            <div className="text-zinc-300 dark:text-zinc-700 flex flex-col items-center">
              <span className="w-12 h-px bg-zinc-300 dark:bg-zinc-700 mb-4 block" />
              <span className="font-mono text-xs uppercase tracking-widest">End of Chapter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
