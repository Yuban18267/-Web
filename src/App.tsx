import { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, Mail, ChevronRight, ChevronLeft, Camera, Video, BookOpen } from 'lucide-react';

export default function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    // 💡 提示：由于刚才图片上传失败，我在这里留下了占位图。
    // 当你把代码下载到本地后，你可以把图片放到 public 文件夹下，
    // 然后把这里的链接改成 "/你的图片名字.jpg" 就可以了！
    "https://picsum.photos/seed/landscape1/1200/600",
    "https://picsum.photos/seed/landscape2/1200/600",
    "https://picsum.photos/seed/landscape3/1200/600",
    "https://picsum.photos/seed/landscape4/1200/600"
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  // Reusable animation variants for scroll reveal
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight">拾壹屿</span>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 items-center">
            <a href="#photography" className="hover:text-blue-600 transition-colors">摄影</a>
            <a href="#video" className="hover:text-blue-600 transition-colors">视频</a>
            <a href="#blog" className="hover:text-blue-600 transition-colors">博客</a>
            <a href="#contact" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">联系我</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
        <div className="max-w-5xl mx-auto text-center w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              你好，我是<span className="text-blue-600">拾壹屿</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              用镜头捕捉光影，用文字记录生活。这里是我的个人空间，分享我的摄影作品、视频记录和日常随笔。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photography Carousel Section */}
      <section id="photography" className="py-24 bg-white px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <Camera className="text-blue-600" size={28} />
            <h2 className="text-3xl font-bold">摄影作品</h2>
          </div>
          
          {/* Carousel */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[16/9] md:aspect-[21/9] group shadow-sm border border-gray-100">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={images[currentImage]}
              alt={`Photography ${currentImage + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Carousel Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={prevImage}
                className="w-12 h-12 rounded-full bg-white/80 backdrop-blur text-gray-900 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                onClick={nextImage}
                className="w-12 h-12 rounded-full bg-white/80 backdrop-blur text-gray-900 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                <ChevronRight size={28} />
              </button>
            </div>
            
            {/* Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Video & Blog Section */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* Video Section */}
          <motion.div 
            id="video"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Video className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">视频记录</h2>
            </motion.div>
            <div className="space-y-8">
              {[1, 2].map((item) => (
                <motion.div key={item} variants={fadeInUp} className="group cursor-pointer">
                  <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative mb-4 shadow-sm">
                    <img src={`https://picsum.photos/seed/video${item}/600/400`} alt="Video thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors duration-500">
                      <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-blue-600 border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">旅行 Vlog：山川与湖海的故事</h3>
                  <p className="text-gray-500 text-sm mt-2">2026年4月 • 5:24</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Blog Section */}
          <motion.div 
            id="blog"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <BookOpen className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">文字博客</h2>
            </motion.div>
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <motion.div key={item} variants={fadeInUp} className="p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <p className="text-sm text-blue-600 font-semibold tracking-wide mb-3 uppercase">随笔</p>
                  <h3 className="font-bold text-2xl mb-3 group-hover:text-blue-600 transition-colors">在喧嚣中寻找内心的平静</h3>
                  <p className="text-gray-600 line-clamp-2 mb-6 leading-relaxed">
                    摄影不仅仅是按下快门的那一瞬间，更是观察世界的一种方式。当我们放慢脚步，去注意那些平时被忽略的细节时...
                  </p>
                  <span className="text-sm text-gray-400 font-medium">2026年4月9日</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 px-6 bg-white border-t border-gray-200 text-center"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">拾壹屿</h2>
          <p className="text-gray-500 italic mb-10 text-lg">永远相信美好的事情即将发生！</p>
          <div className="flex justify-center gap-6 mb-10">
            <SocialLink icon={<Twitter size={22} />} href="#" />
            <SocialLink icon={<Github size={22} />} href="#" />
            <SocialLink icon={<Mail size={22} />} href="#" />
          </div>
          <p className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} 拾壹屿. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href}
      className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:scale-110 transition-all duration-300"
    >
      {icon}
    </a>
  );
}

