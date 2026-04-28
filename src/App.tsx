import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Github, Twitter, Mail, Menu, X, Camera, Video as VideoIcon, BookOpen, Gamepad2, Home as HomeIcon, Sun, Moon, Monitor } from 'lucide-react';
import { QQIcon, BilibiliIcon, TiktokIcon } from './components/Icons';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Photography from './pages/Photography';
import Video from './pages/Video';
import Blog from './pages/Blog';
import Game from './pages/Game';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { useTheme } from './hooks/useTheme';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-zinc-100"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { theme } = useTheme(); // Initialize theme hook at the app level

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/photography" element={<PageTransition><Photography /></PageTransition>} />
        <Route path="/video" element={<PageTransition><Video /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/game" element={<PageTransition><Game /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-zinc-900/50 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-zinc-100"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="text-xl font-bold tracking-tighter text-blue-600 dark:text-zinc-100 hover:text-blue-700 dark:hover:text-zinc-300 transition-colors">
                拾壹屿
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-zinc-400">
              <Link to="/photography" className="hover:text-blue-600 dark:hover:text-zinc-100 transition-colors">摄影</Link>
              <Link to="/video" className="hover:text-blue-600 dark:hover:text-zinc-100 transition-colors">视频</Link>
              <Link to="/blog" className="hover:text-blue-600 dark:hover:text-zinc-100 transition-colors">博客</Link>
              <Link to="/game" className="hover:text-blue-600 dark:hover:text-zinc-100 transition-colors">游戏</Link>
              <ThemeToggle />
              <Link to="/contact" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold rounded-full dark:hover:bg-white transition-colors shadow-sm">
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
                className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-zinc-900 z-[70] p-8 shadow-2xl border-r border-slate-200 dark:border-zinc-800 flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-2xl font-bold tracking-tighter text-slate-800 dark:text-zinc-100">拾壹屿</span>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
                <motion.div 
                  className="space-y-2 flex-grow"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {navLinks.map((link) => (
                    <motion.div key={link.to} variants={staggerItem}>
                      <Link 
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-zinc-100 transition-all group"
                      >
                        <span className="text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-zinc-100 transition-colors">{link.icon}</span>
                        <span className="font-bold text-lg">{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div variants={staggerItem}>
                     <Link 
                        to="/contact"
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-4 flex items-center justify-center w-full gap-4 p-4 rounded-xl bg-blue-600 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-blue-700 dark:hover:bg-white font-bold text-lg transition-all shadow-md"
                      >
                        联系我
                      </Link>
                  </motion.div>
                </motion.div>
                <div className="mt-8">
                  <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <p className="text-sm text-slate-500 mb-4 font-medium">关注我</p>
                    <div className="flex gap-4">
                      <Twitter className="text-slate-400 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-zinc-100 cursor-pointer transition-colors" size={20} />
                      <Github className="text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer transition-colors" size={20} />
                      <Mail className="text-slate-400 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-zinc-100 cursor-pointer transition-colors" size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="pt-20">
          <AppRoutes />
        </main>

        {/* Footer */}
        <footer className="py-16 px-6 bg-slate-100 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 text-center transition-colors duration-300">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-zinc-100">拾壹屿</h2>
            <p className="text-slate-500 dark:text-zinc-500 italic mb-10 text-lg">永远相信美好的事情即将发生！</p>
            <div className="flex justify-center gap-6 mb-10">
              <SocialLink icon={<Mail size={22} />} to="/contact" />
              <SocialLink icon={<Github size={22} />} to="/contact" />
              <SocialLink icon={<BilibiliIcon size={22} />} to="/contact" />
              <SocialLink icon={<TiktokIcon size={22} />} to="/contact" />
              <SocialLink icon={<QQIcon size={22} />} to="/contact" />
            </div>
            <p className="text-slate-500 dark:text-zinc-600 text-sm font-medium">
              © {new Date().getFullYear()} 拾壹屿. All rights reserved.
            </p>
            <Link to="/admin" className="text-slate-400  dark:text-zinc-800 hover:text-slate-600 dark:hover:text-zinc-700 text-[10px] mt-4 inline-block transition-colors">Admin</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function SocialLink({ icon, to }: { icon: React.ReactNode, to: string }) {
  return (
    <Link 
      to={to}
      className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-zinc-100 hover:scale-110 transition-all duration-300 shadow-sm"
    >
      {icon}
    </Link>
  );
}

