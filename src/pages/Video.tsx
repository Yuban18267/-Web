import { motion } from 'motion/react';
import { Video as VideoIcon, Play } from 'lucide-react';

export default function Video() {
  const videos = Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/vid${i}/1200/600`);

  return (
    <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <VideoIcon className="mx-auto text-zinc-500 mb-6" size={48} />
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">旅行 Vlog</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          动态的记忆，流淌的时光。通过视频感受旅途中的点滴故事与真实的声音。
        </p>
      </motion.div>

      <div className="space-y-12">
        {videos.map((url, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 relative mb-6 shadow-2xl">
              <img 
                src={url} 
                alt={`Video ${i}`} 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors duration-500">
                <div className="w-20 h-20 bg-zinc-900/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="text-zinc-100 ml-2" size={32} fill="currentColor" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-zinc-200 group-hover:text-white transition-colors mb-2">
              探索未知的风景：第 {i + 1} 集
            </h2>
            <p className="text-zinc-500">2026年4月 • 10:24</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
