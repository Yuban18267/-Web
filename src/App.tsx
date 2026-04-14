import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Github, Twitter, Mail, Menu, X, Camera, Video as VideoIcon, BookOpen, Gamepad2, Home as HomeIcon, MessageCircle, MessageSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Photography from './pages/Photography';
import Video from './pages/Video';
import Blog from './pages/Blog';
import Game from './pages/Game';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "主页", icon: <HomeIcon size={20} /> },
    { to: "/photography", label: "摄影作品", icon: <Camera size={20} /> },
    { to: "/video", label: "旅行视频", icon: <VideoIcon size={20} /> },
    { to: "/blog", label: "个人随笔", icon: <BookOpen size={20} /> },
    { to: "/game", label: "游戏生涯", icon: <Gamepad2 size={20} /> },
  ];

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-100 selection:text-zinc-900">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="text-xl font-bold tracking-tighter hover:text-zinc-400 transition-colors">
                拾壹屿
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link to="/photography" className="hover:text-zinc-100 transition-colors">摄影</Link>
              <Link to="/video" className="hover:text-zinc-100 transition-colors">视频</Link>
              <Link to="/blog" className="hover:text-zinc-100 transition-colors">博客</Link>
              <Link to="/game" className="hover:text-zinc-100 transition-colors">游戏</Link>
              <Link to="/contact" className="px-5 py-2 bg-zinc-100 text-zinc-900 font-bold rounded-full hover:bg-white transition-colors shadow-sm">
                联系我
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-80 bg-zinc-900 z-[70] p-8 shadow-2xl border-r border-zinc-800"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-2xl font-bold tracking-tighter">拾壹屿</span>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all group"
                    >
                      <span className="text-zinc-500 group-hover:text-zinc-100 transition-colors">{link.icon}</span>
                      <span className="font-bold text-lg">{link.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <p className="text-sm text-zinc-500 mb-4">关注我</p>
                    <div className="flex gap-4">
                      <Twitter className="text-zinc-400 hover:text-zinc-100 cursor-pointer" size={20} />
                      <Github className="text-zinc-400 hover:text-zinc-100 cursor-pointer" size={20} />
                      <Mail className="text-zinc-400 hover:text-zinc-100 cursor-pointer" size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/video" element={<Video />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/game" element={<Game />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-16 px-6 bg-zinc-950 border-t border-zinc-800 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-zinc-100">拾壹屿</h2>
            <p className="text-zinc-500 italic mb-10 text-lg">永远相信美好的事情即将发生！</p>
            <div className="flex justify-center gap-6 mb-10">
              <SocialLink icon={<Twitter size={22} />} to="/contact" />
              <SocialLink icon={<Github size={22} />} to="/contact" />
              <SocialLink icon={<Mail size={22} />} to="/contact" />
              <SocialLink icon={<MessageCircle size={22} />} to="/contact" />
              <SocialLink icon={<MessageSquare size={22} />} to="/contact" />
            </div>
            <p className="text-zinc-600 text-sm font-medium">
              © {new Date().getFullYear()} 拾壹屿. All rights reserved.
            </p>
            <Link to="/admin" className="text-zinc-800 hover:text-zinc-700 text-[10px] mt-4 inline-block">Admin</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function SocialLink({ icon, to }: { icon: React.ReactNode, to: string }) {
  return (
    <Link 
      to={to}
      className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 hover:scale-110 transition-all duration-300"
    >
      {icon}
    </Link>
  );
}

