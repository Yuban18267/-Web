import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none hover:scale-105 active:scale-95 transition-transform duration-300 ${className}`}
      id="svg-website-logo"
    >
      <defs>
        {/* Irregular Ocean-like Deep Blue to Light Blue Gradient */}
        <linearGradient id="blueGradient" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#1D4ED8" /> {/* deep blue */}
          <stop offset="60%" stopColor="#2563EB" /> {/* vibrant blue */}
          <stop offset="100%" stopColor="#60A5FA" /> {/* soft sky blue */}
        </linearGradient>

        {/* Soft Shadow for realistic depth */}
        <filter id="smoothShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="1"
            dy="3"
            stdDeviation="3"
            floodColor="#1E3A8A"
            floodOpacity="0.15"
          />
        </filter>
      </defs>

      {/* Irregular organic fluid shape representing '屿' (Island/Pebble) */}
      <path
        d="M 28 20 
           C 48 10, 78 15, 85 35 
           C 92 55, 88 78, 68 88 
           C 48 98, 20 85, 14 62 
           C 8 39, 12 25, 28 20 Z"
        fill="url(#blueGradient)"
        filter="url(#smoothShadow)"
      />

      {/* Layered white organic curve representing abstract dynamic sea waves and the number '11' */}
      <path
        d="M 32 45 
           C 36 32, 44 26, 48 34 
           C 51 40, 48 64, 48 70"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-95"
      />

      <path
        d="M 52 41 
           C 56 28, 64 22, 68 30 
           C 71 36, 68 60, 68 66"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-95"
      />

      {/* Delicate floating white splash dot symbolizing optimism and freshness */}
      <circle
        cx="76"
        cy="24"
        r="3.5"
        fill="#FFFFFF"
        className="animate-pulse"
      />
      <circle cx="21" cy="74" r="2.5" fill="#FFFFFF" className="opacity-80" />
    </svg>
  );
}
