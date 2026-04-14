import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video as VideoIcon, Play } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function Video() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
      setLoading(false);
    };
    fetchVideos();
  }, []);

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

      {loading ? (
        <div className="text-center py-20 text-zinc-500">加载中...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-3xl border border-zinc-800">
          暂无视频，请在管理后台上传。
        </div>
      ) : (
        <div className="space-y-12">
          {videos.map((video, i) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => window.open(video.videoUrl, '_blank')}
            >
              <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 relative mb-6 shadow-2xl">
                <img 
                  src={video.url} 
                  alt={video.title} 
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
                {video.title}
              </h2>
              <p className="text-zinc-500">{new Date(video.createdAt).toLocaleDateString()} • {video.duration}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
