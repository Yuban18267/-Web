import React, { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  opacity: number;
}

export default function BackgroundOverlay() {
  const { theme, character, ambientEffect, bgBlur, bgOpacity } = useTheme();
  const [particles, setParticles] = useState<FloatingItem[]>([]);

  // Generate floating elements depending on the selected effect
  useEffect(() => {
    if (ambientEffect === "none") {
      setParticles([]);
      return;
    }

    const items: FloatingItem[] = [];
    const count = ambientEffect === "sakura_leaf" ? 16 : 28;
    
    // Choose theme colors for particles
    let colors = ["rgba(37, 99, 235, 0.3)"]; // Default theme Blue
    if (ambientEffect === "sakura_leaf") {
      colors = ["#fbcfe8", "#fda4af", "#fecdd3", "#fae8ff"]; // Sakura pinks
    } else if (theme === "neon") {
      colors = ["#ec4899", "#d946ef", "#a855f7", "#3b82f6"]; // Cyber neon fuchsia and purple
    } else if (theme === "forest") {
      colors = ["#6ee7b7", "#34d399", "#10b981", "#fbbf24"]; // Forest green and gold
    } else if (theme === "starry") {
      colors = ["#22d3ee", "#06b6d4", "#93c5fd", "#ffffff"]; // Cosmos cyan and starlight
    } else if (character === "miku") {
      colors = ["#22d3ee", "#34d399", "#06b6d4", "#ffffff"]; // Miku signature teal/mint/white
    }

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        x: Math.random() * 100, // horizontal start position (percentage)
        y: Math.random() * 60 + 30, // start near lower portion for beautiful rising
        size: Math.random() * (ambientEffect === "sakura_leaf" ? 14 : 7) + 3,
        delay: Math.random() * -15, // negative delay so particles are already dispersed on load!
        duration: Math.random() * 12 + 16, // floating speed
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2, // cozy brightness
      });
    }
    setParticles(items);
  }, [ambientEffect, theme, character]);

  // Character Artwork Source
  const getCharacterArt = () => {
    switch (character) {
      case "miku":
        // Classic gorgeous teal hair Hatsune Miku vocaloid illustration
        return "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop";
      default:
        return null;
    }
  };

  const activeCharArt = getCharacterArt();

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700"
      aria-hidden="true"
    >
      {/* Background Gradients & Theme Backdrops */}
      <div className="absolute inset-0 transition-all duration-700">
        {theme === "sakura" && (
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/90 via-pink-100/30 to-rose-100/70 dark:from-zinc-950 dark:via-rose-950/20 dark:to-zinc-950" />
        )}
        {theme === "neon" && (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-zinc-950 to-indigo-950/40 dark:from-purple-950 dark:via-zinc-950 dark:to-black" />
        )}
        {theme === "forest" && (
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/30 via-zinc-100 dark:via-zinc-950 to-emerald-900/40" />
        )}
        {theme === "starry" && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-zinc-950 to-blue-950/50" />
        )}
      </div>

      {/* Modern cyber grid overlay for futuristic visual textures */}
      {(theme === "neon" || theme === "starry" || character === "miku") && (
        <div 
          className="absolute inset-0 opacity-[0.03] transition-opacity duration-700 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]"
          style={{ backgroundSize: "32px 32px" }}
        />
      )}

      {/* Drifting Ambient Leaf and Particle Effects */}
      {particles.map((p) => {
        if (ambientEffect === "sakura_leaf") {
          return (
            <div
              key={p.id}
              className="absolute animate-sakura-fall"
              style={{
                left: `${p.x}%`,
                top: `-40px`,
                width: `${p.size}px`,
                height: `${p.size * 0.8}px`,
                backgroundColor: p.color,
                borderRadius: "100% 0% 100% 50% / 100% 0% 100% 50%",
                opacity: p.opacity,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                boxShadow: "0 2px 6px rgba(244, 114, 182, 0.15)",
                willChange: "transform, opacity",
              }}
            />
          );
        } else {
          // Alternative rising drifting path to give gorgeous depth without heavy load
          const floatClass = p.id % 2 === 0 ? "animate-float-a" : "animate-float-b";
          return (
            <div
              key={p.id}
              className={`absolute rounded-full ${floatClass}`}
              style={{
                left: `${p.x}%`,
                bottom: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity,
                filter: "blur(0.8px)",
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                willChange: "transform, opacity",
              }}
            />
          );
        }
      })}
    </div>
  );
}
