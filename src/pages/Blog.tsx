import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

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

      {loading ? (
        <div className="text-center py-20 text-zinc-500">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-3xl border border-zinc-800">
          暂无随笔，请在管理后台发布。
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 bg-zinc-900/50 rounded-3xl border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full uppercase tracking-wider">
                  {post.category || '随笔'}
                </span>
                <span className="text-sm text-zinc-500 font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-200 group-hover:text-white transition-colors mb-4">
                {post.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="text-zinc-300 font-medium group-hover:text-white transition-colors">
                阅读全文 →
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
