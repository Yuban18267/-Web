import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../lib/utils';
import photos from '../data/photos.json';

export default function Photography() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
          <Camera size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
          摄影作品
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
          用镜头记录下的每一个瞬间。这里收集了我在旅途中、生活里捕捉到的光影碎片。
        </p>
      </motion.div>

      {photos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-slate-100 dark:bg-zinc-900/30 rounded-3xl border border-slate-200 dark:border-zinc-800">
          暂无作品。
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
          {/* 图片轮播容器：添加 group 以便鼠标悬浮时显示箭头 */}
          <div className="relative w-full group rounded-3xl overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-950/50 flex flex-col items-center justify-center border border-slate-200/50 dark:border-zinc-800/50">
            
            {/* 核心大图展示区 - 根据图片内容调整比例，通常摄影作品用 3:2 或 16:9 比较多，这里用自适应加最小高度保证体验 */}
            <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden flex items-center justify-center bg-black/5 dark:bg-black/20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={photos[currentIndex].id}
                  src={getOptimizedImageUrl(photos[currentIndex].url)}
                  alt={photos[currentIndex].title || `摄影作品`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* 左侧箭头：鼠标悬浮时透明度从 0 变为 100，带缓慢过渡 */}
              <button 
                onClick={prevPhoto}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md flex items-center justify-center text-zinc-800 dark:text-zinc-200 opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110 hover:bg-white/50 dark:hover:bg-black/50"
              >
                <ChevronLeft size={32} />
              </button>

              {/* 右侧箭头：鼠标悬浮时透明度从 0 变为 100，带缓慢过渡 */}
              <button 
                onClick={nextPhoto}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md flex items-center justify-center text-zinc-800 dark:text-zinc-200 opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110 hover:bg-white/50 dark:hover:bg-black/50"
              >
                <ChevronRight size={32} />
              </button>
              
              {/* 底部指示器条 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white shadow' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 图片下方的标题与简介区域，与上方容器协调对齐 */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={photos[currentIndex].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-10 px-4 md:px-12 w-full text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                {photos[currentIndex].title || '未命名作品'}
              </h2>
              <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 mx-auto mb-6 rounded-full" />
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-serif leading-relaxed max-w-2xl mx-auto">
                {(photos[currentIndex] as any).description || '暂无作品简介。你可以在 data/photos.json 中为该照片增加 description 字段以展示背后的故事或拍摄参数等信息。'}
              </p>
              <p className="mt-8 text-sm font-mono text-zinc-400 tracking-widest uppercase">
                {new Date(photos[currentIndex].createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
