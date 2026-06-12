import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Camera,
  Video,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Wrench,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "../lib/utils";
import ImgCDN from "../components/ImgCDN";
import photosData from "../data/photos.json";
import videosData from "../data/videos.json";
import blogsData from "../data/blogs.json";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const fullText = "拾壹屿";

  const allPhotos = photosData.flatMap((t) => t.photos || []);
  const photos = allPhotos.slice(0, 5);
  const videos = videosData.slice(0, 2);
  const blogs = [...blogsData]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

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
    setCurrentImage(
      (prev) => (prev - 1 + (photos.length || 1)) % (photos.length || 1),
    );
  };

  const displayPhotos =
    photos.length > 0
      ? photos
      : [
          { url: "https://picsum.photos/seed/landscape1/1200/600" },
          { url: "https://picsum.photos/seed/landscape2/1200/600" },
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
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-theme-text mb-8 leading-tight min-h-[1.2em]">
              你好，我是
              <span className="text-accent inline-block min-w-[3em]">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              用镜头捕捉光影，用文字记录生活。这里是我的个人空间，分享我的摄影作品、视频记录和日常随笔。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photography Carousel Section */}
      <section className="py-24 bg-theme-card/50 border-y border-theme-border/40 backdrop-blur-xs px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Camera className="text-accent" size={28} />
              <h2 className="text-3xl font-black text-theme-text tracking-tight">
                摄影作品
              </h2>
            </div>
            <Link
              to="/photography"
              className="flex items-center text-sm font-medium text-theme-muted hover:text-accent transition-colors group"
            >
              查看全部{" "}
              <ArrowRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <Link
            to="/photography"
            className="block relative rounded-2xl overflow-hidden bg-theme-bg aspect-[16/9] md:aspect-[21/9] group shadow-2xl border border-theme-border"
          >
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <ImgCDN
                src={displayPhotos[currentImage]?.url || ""}
                alt="Photography"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {displayPhotos.length > 1 && (
              <>
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
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                  {displayPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImage(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentImage ? "bg-white w-8" : "bg-white/30 w-2 hover:bg-white/60"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </Link>
        </motion.div>
      </section>

      {/* Video & Blog Section */}
      <section className="py-24 bg-transparent px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Video Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <Video className="text-accent" size={24} />
                <h2 className="text-2xl font-black text-theme-text tracking-tight animate-pulse">
                  视频记录
                </h2>
              </motion.div>
              <Link
                to="/video"
                className="flex items-center text-sm font-medium text-theme-muted hover:text-accent transition-colors group"
              >
                查看全部{" "}
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
            <div className="space-y-8">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <Link
                    to="/video"
                    key={video.id}
                    className="block group cursor-pointer"
                  >
                    <motion.div variants={fadeInUp}>
                      <div className="aspect-video bg-theme-bg rounded-2xl overflow-hidden relative mb-4 shadow-lg border border-theme-border">
                        <ImgCDN
                          src={video.url}
                          alt={video.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-500">
                          <div className="w-14 h-14 bg-theme-card/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border border-theme-border">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-accent border-b-[8px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-theme-text group-hover:text-accent transition-colors lines-clamp-1">
                        {video.title}
                      </h3>
                      <p className="text-theme-muted text-sm mt-1.5">
                        {new Date(video.createdAt).toLocaleDateString()} •{" "}
                        {video.duration || "00:00"}
                      </p>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center text-theme-muted border border-dashed border-theme-border rounded-2xl bg-theme-card/30">
                  暂无视频
                </div>
              )}
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
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <BookOpen
                  className="text-accent"
                  size={24}
                />
                <h2 className="text-2xl font-black text-theme-text tracking-tight animate-pulse">
                  文字博客
                </h2>
              </motion.div>
              <Link
                to="/blog"
                className="flex items-center text-sm font-medium text-theme-muted hover:text-accent transition-colors group"
              >
                查看全部{" "}
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
            <div className="space-y-6">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Link to="/blog" key={blog.id} className="block">
                    <motion.div
                      variants={fadeInUp}
                      className="p-8 bg-theme-card/90 backdrop-blur-xs rounded-2xl border border-theme-border hover:border-theme-border-hover hover:shadow-xs hover:translate-y-[-2px] transition-all duration-300 cursor-pointer group"
                    >
                      <p className="text-xs text-theme-muted font-bold tracking-wider mb-2 uppercase">
                        {blog.category || "随笔"}
                      </p>
                      <h3 className="font-extrabold text-xl mb-3 text-theme-text group-hover:text-accent transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-theme-muted text-sm line-clamp-2 mb-4 leading-relaxed">
                        {blog.content}
                      </p>
                      <span className="text-xs text-theme-muted opacity-80 font-medium">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center text-theme-muted border border-dashed border-theme-border rounded-2xl bg-theme-card/30">
                  暂无博客
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Web Tools Subsection at the bottom */}
      <section className="py-24 bg-theme-card/30 border-t border-theme-border/40 backdrop-blur-xs px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Wrench className="text-accent" size={26} />
              <h2 className="text-3xl font-black text-theme-text tracking-tight">
                网页专属工具集
              </h2>
            </div>
            <Link
              to="/tools"
              className="flex items-center text-sm font-medium text-theme-muted hover:text-accent transition-colors group"
            >
              进入工具频道{" "}
              <ArrowRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main spotlight tool item */}
            <div className="md:col-span-2 p-8 bg-theme-card border border-theme-border rounded-3xl hover:border-accent/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold bg-accent/15 text-accent px-2.5 py-0.5 rounded-full">
                    Advanced Tool // 精密物理网卡及显卡感知
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-theme-text mb-3 group-hover:text-accent transition-colors">
                  系统硬件与环境监视器
                </h3>
                <p className="text-theme-muted text-sm leading-relaxed mb-6">
                  利用纯前端沙箱机制，实时提取包括物理 GPU 渲染芯片、逻辑 CPU 核心负载波动、色深和 DPR、以及电池电量和即时 Cloudflare CDN 传输延时在内的硬核环境参数。
                </p>
                
                {/* Visual spec representations (Bento mockup preview) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-theme-bg border border-theme-border rounded-xl text-center">
                    <p className="text-[9px] text-theme-muted font-mono uppercase mb-0.5">CPU Hardware</p>
                    <span className="text-xs font-mono font-bold text-theme-text">Multi-Core Info</span>
                  </div>
                  <div className="p-3 bg-theme-bg border border-theme-border rounded-xl text-center">
                    <p className="text-[9px] text-theme-muted font-mono uppercase mb-0.5">Graphics Engine</p>
                    <span className="text-xs font-mono font-bold text-theme-text">GPU Renderer</span>
                  </div>
                  <div className="p-3 bg-theme-bg border border-theme-border rounded-xl text-center">
                    <p className="text-[9px] text-theme-muted font-mono uppercase mb-0.5">Battery Monitor</p>
                    <span className="text-xs font-mono font-bold text-theme-text">Power Status</span>
                  </div>
                  <div className="p-3 bg-theme-bg border border-theme-border rounded-xl text-center">
                    <p className="text-[9px] text-theme-muted font-mono uppercase mb-0.5">Network Core</p>
                    <span className="text-xs font-mono font-bold text-theme-text">Ping Diagnostics</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center border-t border-theme-border/50 pt-4">
                <span className="text-[11px] text-theme-muted font-mono flex items-center gap-1.5">
                  <Terminal size={11} className="text-accent" />
                  前端只读安全调用 • 无后台隐私泄露
                </span>
                <Link
                  to="/tools"
                  className="px-5 py-2 bg-accent text-white dark:text-zinc-900 font-bold rounded-xl text-xs hover:opacity-90 shadow-sm transition-opacity"
                >
                  立即体验
                </Link>
              </div>
            </div>

            {/* Side teaser items */}
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-theme-card/60 border border-theme-border rounded-2.5xl flex flex-col justify-between flex-1 hover:border-theme-border-hover transition-colors">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-theme-muted">
                    Upcoming Gadget #02
                  </span>
                  <h4 className="text-lg font-bold text-theme-text mt-2 mb-1.5">
                    开发者代码格式化沙盒
                  </h4>
                  <p className="text-theme-muted text-xs leading-relaxed">
                    提供极速、无广告的本地代码着色、压缩及格式化处理。
                  </p>
                </div>
                <span className="text-[10px] text-theme-muted font-mono mt-4 block">规划研发中...</span>
              </div>

              <div className="p-6 bg-theme-card/60 border border-theme-border rounded-2.5xl flex flex-col justify-between flex-1 hover:border-theme-border-hover transition-colors">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-theme-muted">
                    Upcoming Gadget #03
                  </span>
                  <h4 className="text-lg font-bold text-theme-text mt-2 mb-1.5">
                    像素级别图片裁剪转换
                  </h4>
                  <p className="text-theme-muted text-xs leading-relaxed">
                    纯本地 WebAssembly 强力无失真压制，保护您的照片数据安全。
                  </p>
                </div>
                <span className="text-[10px] text-theme-muted font-mono mt-4 block">规划研发中...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
