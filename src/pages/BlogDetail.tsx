import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import posts from '../data/blogs.json';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-4">文章未找到</h2>
        <Link to="/blog" className="text-blue-600 hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> 返回博客列表
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 max-w-3xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-8 font-medium">
          <ArrowLeft size={16} /> 返回博客列表
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold rounded-full uppercase tracking-wider">
            {post.category || '随笔'}
          </span>
          <span className="text-sm text-slate-500 font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-zinc-100 mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="prose prose-lg dark:prose-invert prose-slate max-w-none mb-12">
          <p className="text-slate-700 dark:text-zinc-300 leading-loose whitespace-pre-wrap text-lg">
            {post.content}
          </p>
        </div>

        {'images' in post && Array.isArray(post.images) && post.images.length > 0 && (
          <div className="space-y-6 mb-12">
            {post.images.map((img, idx) => (
              <figure key={idx} className="overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <img 
                  src={img} 
                  alt={`${post.title} illustration ${idx + 1}`} 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </figure>
            ))}
          </div>
        )}

        <hr className="border-slate-200 dark:border-zinc-800 my-10" />
        
        <div className="flex items-center justify-between text-slate-500 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <BookOpen size={20} />
            <span className="font-medium">感谢阅读</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
