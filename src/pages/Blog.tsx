import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export default function Blog() {
  const posts = Array.from({ length: 8 });

  return (
    <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <BookOpen className="mx-auto text-zinc-500 mb-6" size={48} />
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">个人随笔</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          思考的沉淀，内心的独白。用文字记录生活感悟、技术心得与读书笔记。
        </p>
      </motion.div>

      <div className="space-y-8">
        {posts.map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-10 bg-zinc-900/50 rounded-3xl border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full uppercase tracking-wider">
                随笔
              </span>
              <span className="text-sm text-zinc-500 font-medium">2026年4月9日</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-200 group-hover:text-white transition-colors mb-4">
              在喧嚣中寻找内心的平静 - 篇章 {i + 1}
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg mb-6">
              摄影不仅仅是按下快门的那一瞬间，更是观察世界的一种方式。当我们放慢脚步，去注意那些平时被忽略的细节时，我们会发现生活中隐藏着许多不经意的美好。在这个快节奏的时代，保持内心的平静显得尤为珍贵...
            </p>
            <div className="text-zinc-300 font-medium group-hover:text-white transition-colors">
              阅读全文 →
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
