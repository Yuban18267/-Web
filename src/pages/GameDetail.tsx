import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { getOptimizedImageUrl } from "../lib/utils";
import games from "../data/games.json";

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const game = games.find((g) => g.id === id);

  if (!game) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-4">
          游戏记录未找到
        </h2>
        <Link
          to="/game"
          className="text-blue-600 hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> 返回游戏列表
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/game"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={16} /> 返回游戏列表
        </Link>

        <div className="mb-10 aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-xl">
          <img
            src={getOptimizedImageUrl(game.url)}
            alt={game.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-zinc-100 mb-6 tracking-tight">
            {game.title}
          </h1>

          <div className="flex items-center gap-2 text-slate-500 font-medium mb-10">
            <Gamepad2 size={18} />
            <span>分享于 {new Date(game.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
            <p className="text-slate-700 dark:text-zinc-300 leading-loose whitespace-pre-wrap text-xl font-medium">
              {game.content}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
