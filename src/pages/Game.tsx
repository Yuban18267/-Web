import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2 } from 'lucide-react';
import games from '../data/games.json';

export default function Game() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-6xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <Gamepad2 className="mx-auto text-zinc-500 mb-6" size={48} />
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">游戏生涯</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          虚拟世界的冒险，真实的情感共鸣。记录我玩过的那些令人难忘的游戏瞬间。
        </p>
      </motion.div>

      {games.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800">
          暂无记录。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, i) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 group hover:border-zinc-700 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={game.url} 
                  alt={game.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-white transition-colors">
                  {game.title}
                </h2>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {game.content}
                </p>
                <p className="text-xs text-zinc-600 mt-6 font-medium">
                  发布于 {new Date(game.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
