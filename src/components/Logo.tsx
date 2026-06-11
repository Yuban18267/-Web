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
        {/* Modern high-end blue-to-cyan premium gradient */}
        <linearGradient id="blueGradient" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#1E40AF" /> {/* royal blue */}
          <stop offset="60%" stopColor="#2563EB" /> {/* brand blue */}
          <stop offset="100%" stopColor="#06B6D4" /> {/* bright cyan */}
        </linearGradient>

        {/* Soft elegant shadow for floating white card/badge effect */}
        <filter id="smoothShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3.5"
            floodColor="#000000"
            floodOpacity="0.08"
          />
        </filter>
      </defs>

      {/* Modern minimalist soft white circular base */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="#FFFFFF"
        filter="url(#smoothShadow)"
      />

      {/* Styled dynamic parallel elements representing "11" (拾壹) */}
      {/* Placed asymmetrically and slanted to look architectural, sleek, and elegant with zero resemblance to a face */}
      <rect
        x="36"
        y="25"
        width="9"
        height="40"
        rx="4.5"
        fill="url(#blueGradient)"
        transform="rotate(-15 40.5 45)"
        className="opacity-100"
      />
      <rect
        x="54"
        y="32"
        width="9"
        height="32"
        rx="4.5"
        fill="url(#blueGradient)"
        transform="rotate(-15 58.5 48)"
        className="opacity-90"
      />
    </svg>
  );
}
