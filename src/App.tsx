import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';
import { useEffect } from 'react';
import Home from './pages/Home';
import Photography from './pages/Photography';
import Video from './pages/Video';
import Blog from './pages/Blog';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
        {/* Navbar */}
        <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="font-bold text-xl tracking-tight text-zinc-100">拾壹屿</Link>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-zinc-400 items-center">
              <Link to="/photography" className="hover:text-zinc-100 transition-colors">摄影</Link>
              <Link to="/video" className="hover:text-zinc-100 transition-colors">视频</Link>
              <Link to="/blog" className="hover:text-zinc-100 transition-colors">博客</Link>
              <a href="#contact" className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-full hover:bg-white transition-colors shadow-sm">联系我</a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/video" element={<Video />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer id="contact" className="py-16 px-6 bg-zinc-950 border-t border-zinc-800 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-zinc-100">拾壹屿</h2>
            <p className="text-zinc-500 italic mb-10 text-lg">永远相信美好的事情即将发生！</p>
            <div className="flex justify-center gap-6 mb-10">
              <SocialLink icon={<Twitter size={22} />} href="#" />
              <SocialLink icon={<Github size={22} />} href="#" />
              <SocialLink icon={<Mail size={22} />} href="#" />
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

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href}
      className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 hover:scale-110 transition-all duration-300"
    >
      {icon}
    </a>
  );
}

