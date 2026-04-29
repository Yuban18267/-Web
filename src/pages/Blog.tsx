import React from "react";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "../lib/utils";
import postsData from "../data/blogs.json";

const posts = [...postsData].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

export default function Blog() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <BookOpen className="mx-auto text-zinc-500 mb-6" size={48} />
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          个人随笔
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
          思考的沉淀，内心的独白。用文字记录生活感悟、技术心得与读书笔记。
        </p>
      </motion.div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-slate-100 dark:bg-zinc-900/30 rounded-3xl border border-slate-200 dark:border-zinc-800">
          暂无随笔。
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="block p-8 md:p-10 bg-slate-100 dark:bg-zinc-900/50 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:bg-zinc-900 hover:border-slate-300 dark:border-zinc-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-slate-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-full uppercase tracking-wider">
                    {post.category || "随笔"}
                  </span>
                  <span className="text-sm text-zinc-500 font-medium">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors mb-4">
                  {post.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-6 whitespace-pre-wrap line-clamp-3">
                  {post.content}
                </p>

                {"images" in post &&
                  Array.isArray(post.images) &&
                  post.images.length > 0 && (
                    <div
                      className={`grid gap-3 mb-6 ${
                        post.images.length === 1
                          ? "grid-cols-1 md:w-2/3"
                          : post.images.length === 2
                            ? "grid-cols-2 lg:w-3/4"
                            : "grid-cols-2 md:grid-cols-3"
                      }`}
                    >
                      {post.images.slice(0, 3).map((img, idx) => (
                        <div
                          key={idx}
                          className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-zinc-800"
                        >
                          <img
                            src={getOptimizedImageUrl(img)}
                            alt="Blog illustration"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                      {post.images.length > 3 && (
                        <div className="hidden"></div> /* Or a subtle +N indicator, but omit for now */
                      )}
                    </div>
                  )}

                <div className="text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-blue-600 dark:group-hover:text-white transition-colors flex items-center gap-1">
                  阅读全文{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
