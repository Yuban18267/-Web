import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "../lib/utils";
import ImgCDN from "../components/ImgCDN";
import Skeleton from "../components/Skeleton";
import postsData from "../data/blogs.json";

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const sortedPosts = useMemo(() => {
    return [...postsData].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [sortOrder]);

  return (
    <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <BookOpen className="mx-auto text-zinc-500 mb-6" size={48} />
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          个人随笔
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg w-full">
          思考的沉淀，内心的独白。用文字记录生活感悟、技术心得与读书笔记。
        </p>
      </motion.div>

      {/* Timeline Sorting Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-10 flex justify-end"
      >
        <button
          onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
          className="flex items-center gap-3 py-2 px-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-300 group select-none cursor-pointer"
        >
          {/* Elegant simple minimalist lines */}
          <div className="relative flex flex-col justify-between w-4 h-3 overflow-hidden">
            <span className={`w-3.5 h-0.5 bg-zinc-650 dark:bg-zinc-400 rounded transition-all duration-300 ${sortOrder === "desc" ? "translate-x-0" : "translate-x-1.5"}`} />
            <span className="w-4 h-0.5 bg-zinc-450 dark:bg-zinc-500 rounded" />
            <span className={`w-3 h-0.5 bg-zinc-700 dark:bg-zinc-350 rounded transition-all duration-300 ${sortOrder === "desc" ? "translate-x-1" : "translate-x-0"}`} />
          </div>
          <div className="flex flex-col items-start leading-none text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-550 pb-0.5">
              CHRONICLE SORT // 篇章排序
            </span>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {sortOrder === "desc" ? "新发布的在前" : "旧发布的在前"}
            </span>
          </div>
        </button>
      </motion.div>

      {isLoading ? (
        <Skeleton type="blog-list" />
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-slate-100 dark:bg-zinc-900/30 rounded-3xl border border-slate-200 dark:border-zinc-800">
          暂无随笔。
        </div>
      ) : (
        <div className="space-y-8">
          {sortedPosts.map((post, i) => (
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
                          <ImgCDN
                            src={img}
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
