import React from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';
import photos from '../data/photos.json';

export default function Photography() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-6xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <Camera className="mx-auto text-zinc-500 mb-6" size={48} />
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">摄影作品</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          用镜头记录下的每一个瞬间。这里收集了我在旅途中、生活里捕捉到的光影碎片。
        </p>
      </motion.div>

      {photos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-3xl border border-zinc-800">
          暂无作品。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <motion.div 
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i % 3 * 0.1 }}
              className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group"
            >
              <img 
                src={photo.url} 
                alt={photo.title || `Photography ${i}`} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
