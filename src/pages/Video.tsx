import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video as VideoIcon,
  Youtube,
  MessageSquare,
  Send,
  ExternalLink,
  Play,
} from "lucide-react";
import { getOptimizedImageUrl } from "../lib/utils";
import videos from "../data/videos.json";

const getBilibiliId = (url: string) => {
  if (!url) return null;
  const match = url.match(/video\/(BV[a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

// 简单的本地化评价系统
function VideoCommentSystem({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<
    { id: string; name: string; text: string; date: string }[]
  >(() => {
    try {
      const stored = localStorage.getItem(`comment_video_${videoId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      name: name.trim() || "匿名朋友",
      text: text.trim(),
      date: new Date().toLocaleDateString(),
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comment_video_${videoId}`, JSON.stringify(updated));
    setText("");
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col h-[500px]">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100">
        <MessageSquare size={20} className="text-blue-500" />
        留个脚印
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
        {comments.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
            还没有人评论，来做第一个吧！
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-slate-100 dark:border-zinc-700/50 shadow-sm text-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {c.name}
                  </span>
                  <span className="text-xs text-zinc-400">{c.date}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                  {c.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <form
        onSubmit={submitComment}
        className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3"
      >
        <input
          type="text"
          placeholder="你的名字（朋友）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-shadow dark:text-zinc-100"
        />
        <div className="relative">
          <textarea
            placeholder="写下你的感受..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 pb-12 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none transition-shadow dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center group"
          >
            <Send
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Video() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 rotate-3">
          <VideoIcon size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
          视频记录
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
          动态的记忆，流淌的时光。左侧是我的光影碎片，右侧有路通往更多的故事。来留个言吧。
        </p>
      </motion.div>

      {videos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-slate-100 dark:bg-zinc-900/30 rounded-3xl border border-slate-200 dark:border-zinc-800">
          暂无视频。
        </div>
      ) : (
        <div className="space-y-24">
          {videos.map((video, i) => {
            const bvid = getBilibiliId(video.videoUrl || "");

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              >
                {/* 左侧：视频与标题区 */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                  {/* 视频容器 */}
                  <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/50 shadow-2xl relative group">
                    {bvid ? (
                      <iframe
                        src={`//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`}
                        scrolling="no"
                        border="0"
                        frameBorder="no"
                        framespacing="0"
                        allowFullScreen={true}
                        className="w-full h-full absolute inset-0 rounded-3xl"
                      ></iframe>
                    ) : (
                      // 降级为图片链接模式
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full h-full relative cursor-pointer"
                      >
                        <img
                          src={getOptimizedImageUrl(video.url)}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play
                              className="text-white ml-2"
                              size={32}
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* 标题文案内容 */}
                  <div className="px-2">
                    <div className="flex items-end justify-between mb-4">
                      <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {video.title}
                      </h2>
                      <span className="text-sm font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* 如果有描述则显示，没有显示一段站位提示文案 */}
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif">
                      {(video as any).description ||
                        "暂无描述。可以在 data/videos.json 中为该视频新增 description 字段以展示文案，例如分享一下拍摄时的心情与故事体会。"}
                    </p>
                  </div>
                </div>

                {/* 右侧：跳转指引与评价系统 */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                  {/* 跳转引导区 */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-900 rounded-3xl p-6 border border-blue-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-bold text-blue-900 dark:text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ExternalLink size={16} /> 其他平台
                    </h3>
                    <div className="flex flex-col gap-3">
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950 hover:shadow-md transition-all duration-300 group border border-transparent hover:border-pink-200 dark:hover:border-zinc-700"
                      >
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={18} fill="currentColor" />
                        </div>
                        <div className="flex-1">
                          <span className="block font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                            在 Bilibili 观看
                          </span>
                          <span className="block text-xs text-zinc-500 mt-0.5">
                            支持弹幕与高清画质
                          </span>
                        </div>
                      </a>

                      {/* 这里可以放 YouTube 或抖音等扩展链接 */}
                      <a
                        href="#youtube"
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950/50 opacity-60 hover:opacity-100 transition-opacity duration-300 group cursor-not-allowed border border-transparent dark:border-zinc-800"
                        title="暂未配置链接"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                          <Youtube size={18} fill="currentColor" />
                        </div>
                        <div className="flex-1">
                          <span className="block font-bold text-zinc-800 dark:text-zinc-400 text-sm">
                            YouTube 备份
                          </span>
                          <span className="block text-xs text-zinc-400 mt-0.5">
                            即将上线
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* 评论区 */}
                  <VideoCommentSystem videoId={video.id} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
