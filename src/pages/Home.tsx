import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Video, BookOpen, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import photosData from '../data/photos.json';
import videosData from '../data/videos.json';
import blogsData from '../data/blogs.json';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const fullText = '拾壹屿';

  const photos = photosData.slice(0, 5);
  const videos = videosData.slice(0, 2);
  const blogs = blogsData.slice(0, 3);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImage((prev) => (prev + 1) % (photos.length || 1));
  };
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImage((prev) => (prev - 1 + (photos.length || 1)) % (photos.length || 1));
  };

  const displayPhotos = photos.length > 0 ? photos : [
    { url: "https://picsum.photos/seed/landscape1/1200/600" },
    { url: "https://picsum.photos/seed/landscape2/1200/600" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
        <div className="max-w-5xl mx-auto text-center w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8 leading-tight min-h-[1.2em]">
              你好，我是<span className="text-blue-600 dark:text-blue-500 inline-block min-w-[3em]">{displayText}<span className="animate-pulse">|</span></span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              用镜头捕捉光影，用文字记录生活。这里是我的个人空间，分享我的摄影作品、视频记录和日常随笔。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photography Carousel Section */}
      <section className="py-24 bg-slate-100 dark:bg-zinc-900/30 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Camera className="text-zinc-700 dark:text-zinc-300" size={28} />
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">摄影作品</h2>
            </div>
            <Link to="/photography" className="flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 transition-colors group">
              查看全部 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <Link to="/photography" className="block relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 aspect-[16/9] md:aspect-[21/9] group shadow-2xl border border-slate-200 dark:border-zinc-800">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={displayPhotos[currentImage]?.url}
              alt="Photography"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            
            {displayPhotos.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={prevImage} className="w-12 h-12 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg"><ChevronLeft size={28} /></button>
                  <button onClick={nextImage} className="w-12 h-12 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg"><ChevronRight size={28} /></button>
                </div>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                  {displayPhotos.map((_, idx) => (
                    <button key={idx} onClick={(e) => { e.preventDefault(); setCurrentImage(idx); }} className={`h-2 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-white w-8' : 'bg-white/30 w-2 hover:bg-white/60'}`} />
                  ))}
                </div>
              </>
            )}
          </Link>
        </motion.div>
      </section>

      {/* Video & Blog Section */}
      <section className="py-24 bg-white dark:bg-zinc-950 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* Video Section */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <div className="flex items-center justify-between mb-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <Video className="text-zinc-700 dark:text-zinc-300" size={24} />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">视频记录</h2>
              </motion.div>
              <Link to="/video" className="flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 transition-colors group">
                查看全部 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-8">
              {videos.length > 0 ? videos.map((video) => (
                <Link to="/video" key={video.id} className="block group cursor-pointer">
                  <motion.div variants={fadeInUp}>
                    <div className="aspect-video bg-slate-100 dark:bg-zinc-900 rounded-2xl overflow-hidden relative mb-4 shadow-lg border border-slate-200 dark:border-zinc-800">
                      <img src={video.url} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-500">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-zinc-100 border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{video.title}</h3>
                    <p className="text-zinc-500 text-sm mt-2">{new Date(video.createdAt).toLocaleDateString()} • {video.duration || '00:00'}</p>
                  </motion.div>
                </Link>
              )) : (
                <div className="py-10 text-center text-zinc-600 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">暂无视频</div>
              )}
            </div>
          </motion.div>

          {/* Blog Section */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <div className="flex items-center justify-between mb-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <BookOpen className="text-zinc-700 dark:text-zinc-300" size={24} />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">文字博客</h2>
              </motion.div>
              <Link to="/blog" className="flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 transition-colors group">
                查看全部 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-6">
              {blogs.length > 0 ? blogs.map((blog) => (
                <Link to="/blog" key={blog.id} className="block">
                  <motion.div variants={fadeInUp} className="p-8 bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:bg-zinc-900 hover:border-slate-300 dark:border-zinc-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold tracking-wide mb-3 uppercase">{blog.category || '随笔'}</p>
                    <h3 className="font-bold text-2xl mb-3 text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{blog.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-6 leading-relaxed">{blog.content}</p>
                    <span className="text-sm text-zinc-500 font-medium">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </motion.div>
                </Link>
              )) : (
                <div className="py-10 text-center text-zinc-600 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">暂无博客</div>
              )}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}
