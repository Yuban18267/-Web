import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video as VideoIcon,
  Youtube,
  MessageSquare,
  Send,
  ExternalLink,
  Play,
  Film,
  Gamepad,
  Layers,
  Sparkles,
} from "lucide-react";
import { getOptimizedImageUrl } from "../lib/utils";
import ImgCDN from "../components/ImgCDN";
import { BilibiliIcon, TiktokIcon } from "../components/Icons";
import Skeleton from "../components/Skeleton";
import videosData from "../data/videos.json";
import gamesData from "../data/games.json";

// Extract Bilibili BV ID dynamically
const getBilibiliId = (url: string) => {
  if (!url) return null;
  const match = url.match(/video\/(BV[a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

// Comment sub-system matching individual videoId
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`comment_video_${videoId}`);
      setComments(stored ? JSON.parse(stored) : []);
    } catch {
      setComments([]);
    }
  }, [videoId]);

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
    <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-6 border border-slate-200/60 dark:border-zinc-800 shadow-md flex flex-col h-[520px] transition-all">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-zinc-800 dark:text-zinc-100">
        <MessageSquare size={18} className="text-blue-500" />
        留个脚印
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 custom-scrollbar">
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm py-10">
            <Sparkles size={24} className="mb-2 text-blue-400/50" />
            <span>还没有留言，来做第一个吧！</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800/80 shadow-sm text-sm"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    {c.name}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {c.date}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed break-words font-medium">
                  {c.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <form
        onSubmit={submitComment}
        className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3"
      >
        <input
          type="text"
          placeholder="你的昵称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-shadow dark:text-zinc-100"
        />
        <div className="relative">
          <textarea
            placeholder="写下你的观后感..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 pb-12 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none transition-shadow dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="absolute bottom-2.5 right-2.5 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center group shadow-sm"
          >
            <Send
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </form>
    </div>
  );
}

// Interactive Construction/Coming Soon panel styled inside a futuristic container
function UnderConstruction({
  platform,
}: {
  platform: string;
  key?: React.Key;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="py-16 px-6 text-center max-w-2xl mx-auto"
    >
      <div className="relative mb-8 inline-block">
        {/* Irregular floating blue and white premium background rings */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-teal-400/20 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] blur-xl animate-pulse" />

        <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[30%_70%_70%_30%_/_30%_52%_48%_70%] shadow-xl border border-blue-100 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 relative z-10 rotate-6 hover:rotate-12 transition-transform duration-500">
          {platform === "youtube" ? <Youtube size={44} /> : <Film size={44} />}
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100/50 dark:border-blue-900/30">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        正在搭建中
      </span>

      <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
        {platform === "youtube" ? "YouTube 独立专区" : "抖音短平快视频专区"}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
        本页面正在紧锣密鼓地布置当中。将来，我会把在这个平台的精彩瞬间同步至此处。敬请期待！
      </p>
    </motion.div>
  );
}

interface VideoProps {
  defaultCategory?: "all" | "travel" | "game";
}

export default function Video({ defaultCategory = "all" }: VideoProps) {
  const [activeTab, setActiveTab] = useState<"bilibili" | "youtube" | "tiktok">(
    "bilibili",
  );
  const [activeCategory, setActiveCategory] = useState<
    "all" | "travel" | "game"
  >(defaultCategory);
  const [isLoading, setIsLoading] = useState(true);

  // Parse and unify Travel Videos and Gaming Moments
  const travelList = videosData.map((v) => ({
    id: `travel-${v.id}`,
    title: v.title,
    url: v.url,
    videoUrl: v.videoUrl,
    duration: v.duration || "05:00",
    description:
      (v as any).description ||
      "一路前行，记录下镜头里那些斑斓而温热的旅途印记。这些碎片汇聚在一起，拼凑成我对这个世界最初与最深的情感表达。",
    createdAt: v.createdAt,
    category: "travel" as const,
  }));

  const gameList = gamesData.map((g) => ({
    id: `game-${g.id}`,
    title: g.title,
    url: g.url,
    // Provide fully high-quality playable backing Bilibili clip (Black Myth Wukong gameplay / direct trail)
    videoUrl:
      (g as any).videoUrl || "https://www.bilibili.com/video/BV1pS421T7re",
    duration: (g as any).duration || "03:45",
    description:
      g.content ||
      "虚拟世界的冒险，真实的情感共鸣。记录我玩过的那些令人难忘的游戏瞬间。穿过虚拟世界的光亮，留下真切的情感刻痕。",
    createdAt: g.createdAt,
    category: "game" as const,
  }));

  const combinedVideos = [...travelList, ...gameList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Filter based on selected sub-category inside Bilibili tab
  const filteredVideos = combinedVideos.filter((v) => {
    if (activeCategory === "all") return true;
    return v.category === activeCategory;
  });

  const [selectedVideo, setSelectedVideo] = useState(
    filteredVideos.length > 0 ? filteredVideos[0] : combinedVideos[0],
  );

  // Sync selected video if tab or category switches
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);

    if (filteredVideos.length > 0) {
      // Keep selected is within active subset or reset to first
      const isStillAvailable = filteredVideos.some(
        (v) => v.id === selectedVideo?.id,
      );
      if (!isStillAvailable) {
        setSelectedVideo(filteredVideos[0]);
      }
    }

    return () => clearTimeout(timer);
  }, [activeCategory, activeTab]);

  const bvid = selectedVideo
    ? getBilibiliId(selectedVideo.videoUrl || "")
    : null;

  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-5 rotate-3 shadow-md border border-blue-100/50 dark:border-blue-900/30">
          <VideoIcon size={30} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-950 dark:text-zinc-50 mb-4 tracking-tight">
          极目观澜
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-lg leading-relaxed font-normal">
          所有的旅行记录、游戏生涯时刻均已合并在此。左侧轻点即可开始播放，右侧支持留言。
        </p>
      </motion.div>

      {/* Main Platforms Selection Tabs */}
      <div className="flex justify-center p-1.5 bg-slate-100/80 dark:bg-zinc-900/60 rounded-2xl max-w-md mx-auto mb-10 border border-slate-200/50 dark:border-zinc-800/80">
        <button
          onClick={() => setActiveTab("bilibili")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "bilibili"
              ? "bg-white dark:bg-zinc-800 shadow-md text-blue-600 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <BilibiliIcon size={16} />
          Bilibili 专区
        </button>
        <button
          onClick={() => setActiveTab("youtube")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "youtube"
              ? "bg-white dark:bg-zinc-800 shadow-md text-red-500 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Youtube size={16} />
          YouTube 备份
        </button>
        <button
          onClick={() => setActiveTab("tiktok")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "tiktok"
              ? "bg-white dark:bg-zinc-800 shadow-md text-teal-500 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <TiktokIcon size={16} />
          抖音短视频
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab !== "bilibili" ? (
          <UnderConstruction platform={activeTab} key={activeTab} />
        ) : (
          <motion.div
            key="bilibili-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Categorization Filters: All, Travel, Games */}
            <div className="flex justify-center flex-wrap gap-3">
              <button
                onClick={() => setActiveCategory("all")}
                className={`py-2 px-5 rounded-full text-xs font-bold tracking-wide transition-all border flex items-center gap-1.5 ${
                  activeCategory === "all"
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                <Layers size={13} />
                全部视频 ({combinedVideos.length})
              </button>
              <button
                onClick={() => setActiveCategory("travel")}
                className={`py-2 px-5 rounded-full text-xs font-bold tracking-wide transition-all border flex items-center gap-1.5 ${
                  activeCategory === "travel"
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                <Film size={13} />
                旅行光影 ({travelList.length})
              </button>
              <button
                onClick={() => setActiveCategory("game")}
                className={`py-2 px-5 rounded-full text-xs font-bold tracking-wide transition-all border flex items-center gap-1.5 ${
                  activeCategory === "game"
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                <Gamepad size={13} />
                游戏时刻 ({gameList.length})
              </button>
            </div>

            {/* Empty view check */}
            {isLoading ? (
              <Skeleton type="video-theater" />
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-24 text-zinc-400 bg-white dark:bg-zinc-900/30 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm max-w-4xl mx-auto">
                <Sparkles size={32} className="mx-auto mb-4 text-blue-400/40" />
                <span>该分类下暂无视频。</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LARGE FOCUS THEATER AREA: Left-side Column */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                  {/* Theater Player Container */}
                  <div className="aspect-video rounded-[24px] overflow-hidden bg-slate-900 border border-slate-200/40 dark:border-zinc-800 shadow-xl relative group">
                    {selectedVideo && bvid ? (
                      <iframe
                        src={`//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`}
                        scrolling="no"
                        border="0"
                        frameBorder="no"
                        framespacing="0"
                        allowFullScreen={true}
                        className="w-full h-full absolute inset-0 rounded-[24px]"
                      ></iframe>
                    ) : selectedVideo ? (
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full h-full relative cursor-pointer"
                      >
                        <ImgCDN
                          src={selectedVideo.url}
                          alt={selectedVideo.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play
                              className="text-white ml-1"
                              size={24}
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </a>
                    ) : null}
                  </div>

                  {/* Video Meta Information */}
                  {selectedVideo && (
                    <div className="bg-white dark:bg-zinc-900/20 rounded-3xl p-6 border border-slate-100 dark:border-zinc-900 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 tracking-wide uppercase">
                              {selectedVideo.category === "travel"
                                ? "🏕️ 旅行视频"
                                : "🎮 游戏时刻"}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">
                              时长: {selectedVideo.duration}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
                            {selectedVideo.title}
                          </h2>
                        </div>
                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/80 px-3.5 py-1.5 rounded-full border border-slate-100 dark:border-zinc-700 h-fit">
                          {new Date(selectedVideo.createdAt).toLocaleDateString(
                            "zh-CN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                        {selectedVideo.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* THEATER INTERACTIONS SIDEBAR: Right-side Column */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                  {/* External Streaming Link */}
                  {selectedVideo && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-zinc-900/30 dark:to-zinc-900/10 rounded-3xl p-6 border border-blue-100/40 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <ExternalLink size={14} />
                        直达原站
                      </h3>
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:shadow-md hover:border-pink-200/80 dark:hover:border-zinc-700 transition-all group border border-slate-100 dark:border-zinc-800"
                      >
                        <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-950/20 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
                          <BilibiliIcon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-bold text-zinc-800 dark:text-zinc-200 text-sm truncate">
                            在 Bilibili 主站观看
                          </span>
                          <span className="block text-xs text-zinc-400 truncate mt-0.5">
                            支持弹幕、一键三连与高画质
                          </span>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Comment System for active video */}
                  {selectedVideo && (
                    <VideoCommentSystem videoId={selectedVideo.id} />
                  )}
                </div>
              </div>
            )}

            {/* SELECTION FEED FEEDING THE PLAYER: Row layout under active theater */}
            {filteredVideos.length > 1 && (
              <div className="pt-10 border-t border-slate-100 dark:border-zinc-900">
                <h3 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 mb-6 flex items-center gap-2">
                  <Film size={22} className="text-blue-500" />
                  其他视频选项
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos
                    .filter((v) => v.id !== selectedVideo?.id)
                    .map((video) => (
                      <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="group bg-white dark:bg-zinc-900/40 rounded-2xl p-4 border border-slate-200/60 dark:border-zinc-800/80 hover:border-blue-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-video bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-hidden mb-3 relative">
                            <ImgCDN
                              src={video.url}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play
                                  size={14}
                                  className="text-white ml-0.5"
                                  fill="currentColor"
                                />
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                              {video.duration}
                            </span>
                          </div>

                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mb-2">
                            {video.category === "travel"
                              ? "🏕️ 旅行记录"
                              : "🎮 游戏时刻"}
                          </span>

                          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 mt-1.5 leading-relaxed font-normal">
                            {video.description}
                          </p>
                        </div>

                        <span className="text-[10px] font-mono text-zinc-400 block mt-4 text-right">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
