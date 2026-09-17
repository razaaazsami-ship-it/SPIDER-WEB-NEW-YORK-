import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/audio';

interface SpiderHeroVisualProps {
  onInteract?: () => void;
  suitTheme?: {
    primaryColor: string;
    accentColor: string;
  };
}

export const SpiderHeroVisual: React.FC<SpiderHeroVisualProps> = ({
  onInteract,
  suitTheme = { primaryColor: '#e11d48', accentColor: '#2563eb' },
}) => {
  const [isCharging, setIsCharging] = useState(false);
  const [thwipText, setThwipText] = useState(false);

  const handleClick = () => {
    soundFx.playThwip();
    setIsCharging(true);
    setThwipText(true);
    if (onInteract) onInteract();

    setTimeout(() => {
      setIsCharging(false);
    }, 400);

    setTimeout(() => {
      setThwipText(false);
    }, 800);
  };

  return (
    <div className="relative flex items-center justify-center select-none cursor-pointer group" onClick={handleClick}>
      {/* Comic Pop "THWIP!" Bubble when clicked */}
      {thwipText && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 10, rotate: -15 }}
          animate={{ scale: [0, 1.25, 1], opacity: 1, y: -45, rotate: -8 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-12 z-40 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-2xl md:text-3xl px-5 py-2 rounded-xl shadow-[0_0_25px_rgba(225,29,72,0.8)] border-2 border-yellow-300 transform"
          style={{ fontFamily: "'Changa', sans-serif" }}
        >
          THWIP! 🕸️
        </motion.div>
      )}

      {/* Hero Ambient Glow Aura */}
      <div 
        className="absolute -inset-4 rounded-full blur-2xl opacity-40 transition-all duration-700 group-hover:opacity-75"
        style={{
          background: `radial-gradient(circle, ${suitTheme.primaryColor} 0%, ${suitTheme.accentColor} 60%, transparent 75%)`,
        }}
      />

      {/* Spider Hero Dynamic Silhouette Container */}
      <motion.div
        animate={{
          y: isCharging ? [-4, -14, -2] : [0, -8, 0],
          rotate: isCharging ? [0, 2, -2, 0] : [0, 0.5, 0],
        }}
        transition={{
          duration: isCharging ? 0.35 : 4.5,
          repeat: isCharging ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-72 h-80 sm:w-88 sm:h-96 md:w-96 md:h-104 flex items-center justify-center drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
      >
        <svg
          viewBox="0 0 400 420"
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="suitRed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={suitTheme.primaryColor} />
              <stop offset="50%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>

            <linearGradient id="suitBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={suitTheme.accentColor} />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="eyeGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <linearGradient id="metalGargoyle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Glowing Lens Filter */}
            <filter id="eyeFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pattern for Suit Web Grid */}
            <pattern id="webGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
              <path d="M 0 0 L 20 20 M 0 20 L 20 0" stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* NYC Rooftop Perch / Steel Beam */}
          <g id="perch">
            <path
              d="M 60 360 L 340 360 L 320 415 L 80 415 Z"
              fill="url(#metalGargoyle)"
              stroke="#475569"
              strokeWidth="3"
            />
            {/* Rivets and warning stripes */}
            <line x1="80" y1="365" x2="320" y2="365" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,8" />
            <path d="M 120 375 L 140 405 M 180 375 L 200 405 M 240 375 L 260 405" stroke="#eab308" strokeWidth="4" />
          </g>

          {/* Web Lines Anchored to Skyline */}
          <path
            d="M 320 230 Q 360 140 400 60"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 80 230 Q 40 130 0 40"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Hero Body - Perched Crouching Stance */}
          <g id="hero-character">
            {/* Torso & Ribs */}
            <path
              d="M 150 180 C 150 150, 180 130, 200 130 C 220 130, 250 150, 250 180 C 255 220, 235 270, 200 280 C 165 270, 145 220, 150 180 Z"
              fill="url(#suitRed)"
              stroke="#0f172a"
              strokeWidth="4"
            />

            {/* Suit Lateral Sides (Midnight Blue Flanks) */}
            <path
              d="M 150 185 Q 165 220 170 260 L 155 268 C 145 235 145 205 150 185 Z"
              fill="url(#suitBlue)"
            />
            <path
              d="M 250 185 Q 235 220 230 260 L 245 268 C 255 235 255 205 250 185 Z"
              fill="url(#suitBlue)"
            />

            {/* Webbing Overlay on Chest */}
            <path
              d="M 150 180 C 150 150, 180 130, 200 130 C 220 130, 250 150, 250 180 C 255 220, 235 270, 200 280 C 165 270, 145 220, 150 180 Z"
              fill="url(#webGrid)"
              opacity="0.6"
            />

            {/* Original Geometric Spider Guardian Emblem */}
            <g id="spider-emblem" transform="translate(182, 180)">
              {/* Emblem Core Diamond */}
              <polygon points="18,5 26,18 18,32 10,18" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
              {/* Head */}
              <polygon points="18,1 23,6 13,6" fill="#0f172a" />
              {/* Upper Left Legs */}
              <path d="M 12 12 L 0 5 L -8 14" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 12 16 L -2 18 L -6 28" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              {/* Upper Right Legs */}
              <path d="M 24 12 L 36 5 L 44 14" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 24 16 L 38 18 L 42 28" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              {/* Lower Left Legs */}
              <path d="M 14 24 L 2 34 L 6 48" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 15 28 L 8 44 L 12 54" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              {/* Lower Right Legs */}
              <path d="M 22 24 L 34 34 L 30 48" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 21 28 L 28 44 L 24 54" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Muscular Legs in Crouched Ready-to-Leap Stance */}
            {/* Left Leg */}
            <path
              d="M 160 250 C 130 240, 80 280, 95 320 C 105 345, 130 360, 145 360 C 160 360, 155 330, 175 300 Z"
              fill="url(#suitBlue)"
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Left Boot */}
            <path
              d="M 120 330 L 150 330 L 160 365 L 110 365 Z"
              fill="url(#suitRed)"
              stroke="#0f172a"
              strokeWidth="3"
            />

            {/* Right Leg */}
            <path
              d="M 240 250 C 270 240, 320 280, 305 320 C 295 345, 270 360, 255 360 C 240 360, 245 330, 225 300 Z"
              fill="url(#suitBlue)"
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Right Boot */}
            <path
              d="M 280 330 L 250 330 L 240 365 L 290 365 Z"
              fill="url(#suitRed)"
              stroke="#0f172a"
              strokeWidth="3"
            />

            {/* Left Arm & Web-Shooter Gauntlet */}
            <path
              d="M 155 170 C 120 185, 90 220, 80 250 C 75 265, 90 275, 105 265 C 115 250, 135 220, 150 205 Z"
              fill="url(#suitRed)"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Left Hand Web Shooter Trigger */}
            <circle cx="85" cy="255" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="85" cy="255" r="3" fill="#e0f2fe" />

            {/* Right Arm & Extended Web-Shooting Hand */}
            <path
              d="M 245 170 C 280 185, 310 220, 320 250 C 325 265, 310 275, 295 265 C 285 250, 265 220, 250 205 Z"
              fill="url(#suitRed)"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Right Hand Web Shooter Trigger with Energy Glow */}
            <circle cx="315" cy="255" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="315" cy="255" r="3" fill="#e0f2fe" />

            {/* Hero Mask / Head */}
            <path
              d="M 165 110 C 165 70, 180 50, 200 50 C 220 50, 235 70, 235 110 C 235 138, 220 152, 200 152 C 180 152, 165 138, 165 110 Z"
              fill="url(#suitRed)"
              stroke="#0f172a"
              strokeWidth="4"
            />

            {/* Web Pattern on Mask */}
            <path
              d="M 200 50 L 200 152 M 165 95 Q 200 105 235 95 M 170 120 Q 200 132 230 120 M 172 75 Q 200 85 228 75"
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="1.5"
            />

            {/* Distinctive Expressive Hero Eyes / Angled Comic Lenses */}
            {/* Left Eye */}
            <g id="left-eye">
              {/* Outer Bold Black Frame */}
              <polygon
                points="174,86 195,102 191,114 171,98"
                fill="#0a0a0f"
                stroke="#000000"
                strokeWidth="2"
              />
              {/* Glowing Inner White-Cyan Lens */}
              <polygon
                points="176,88 193,101 190,111 173,97"
                fill="url(#eyeGlow)"
                filter="url(#eyeFilter)"
              />
            </g>

            {/* Right Eye */}
            <g id="right-eye">
              {/* Outer Bold Black Frame */}
              <polygon
                points="226,86 205,102 209,114 229,98"
                fill="#0a0a0f"
                stroke="#000000"
                strokeWidth="2"
              />
              {/* Glowing Inner White-Cyan Lens */}
              <polygon
                points="224,88 207,101 210,111 227,97"
                fill="url(#eyeGlow)"
                filter="url(#eyeFilter)"
              />
            </g>
          </g>
        </svg>

        {/* Hover Hint Bubble */}
        <div className="absolute -bottom-2 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/40 text-xs text-red-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-lg">
          <span>انقر لإطلاق خيط العنكبوت!</span>
          <span className="text-sm">🕸️</span>
        </div>
      </motion.div>
    </div>
  );
};
