import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Video, BookOpen, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const images = [
    "https://picsum.photos/seed/landscape1/1200/600",
    "https://picsum.photos/seed/landscape2/1200/600",
    "https://picsum.photos/seed/landscape3/1200/600",
    "https://picsum.photos/seed/landscape4/1200/600"
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

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
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-100 mb-6 leading-tight">
              你好，我是<span className="text-zinc-400">拾壹屿</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              用镜头捕捉光影，用文字记录生活。这里是我的个人空间，分享我的摄影作品、视频记录和日常随笔。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photography Carousel Section */}
      <section className="py-24 bg-zinc-900/30 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Camera className="text-zinc-300" size={28} />
              <h2 className="text-3xl font-bold text-zinc-100">摄影作品</h2>
            </div>
            <Link to="/photography" className="flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors group">
              查看全部 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Carousel wrapped in Link */}
          <Link to="/photography" className="block relative rounded-2xl overflow-hidden bg-zinc-900 aspect-[16/9] md:aspect-[21/9] group shadow-2xl border border-zinc-800">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={images[currentImage]}
              alt={`Photography ${currentImage + 1}`}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            
            {/* Carousel Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={prevImage}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                onClick={nextImage}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg"
              >
                <ChevronRight size={28} />
              </button>
            </div>
            
            {/* Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); setCurrentImage(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-white w-8' : 'bg-white/30 w-2 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Video & Blog Section */}
      <section className="py-24 bg-zinc-950 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* Video Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <Video className="text-zinc-300" size={24} />
                <h2 className="text-2xl font-bold text-zinc-100">视频记录</h2>
              </motion.div>
              <Link to="/video" className="flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors group">
                查看全部 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-8">
              {[1, 2].map((item) => (
                <Link to="/video" key={item} className="block group cursor-pointer">
                  <motion.div variants={fadeInUp}>
                    <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative mb-4 shadow-lg border border-zinc-800">
                      <img src={`https://picsum.photos/seed/video${item}/600/400`} alt="Video thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-500">
                        <div className="w-14 h-14 bg-zinc-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-zinc-100 border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-zinc-200 group-hover:text-white transition-colors">旅行 Vlog：山川与湖海的故事</h3>
                    <p className="text-zinc-500 text-sm mt-2">2026年4月 • 5:24</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Blog Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <BookOpen className="text-zinc-300" size={24} />
                <h2 className="text-2xl font-bold text-zinc-100">文字博客</h2>
              </motion.div>
              <Link to="/blog" className="flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors group">
                查看全部 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <Link to="/blog" key={item} className="block">
                  <motion.div variants={fadeInUp} className="p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <p className="text-sm text-zinc-400 font-semibold tracking-wide mb-3 uppercase">随笔</p>
                    <h3 className="font-bold text-2xl mb-3 text-zinc-200 group-hover:text-white transition-colors">在喧嚣中寻找内心的平静</h3>
                    <p className="text-zinc-400 line-clamp-2 mb-6 leading-relaxed">
                      摄影不仅仅是按下快门的那一瞬间，更是观察世界的一种方式。当我们放慢脚步，去注意那些平时被忽略的细节时...
                    </p>
                    <span className="text-sm text-zinc-500 font-medium">2026年4月9日</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}
