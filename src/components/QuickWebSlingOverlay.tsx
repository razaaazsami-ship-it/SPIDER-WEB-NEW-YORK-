import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';

interface WebShot {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface QuickWebSlingOverlayProps {
  onWebFired?: () => void;
}

export const QuickWebSlingOverlay: React.FC<QuickWebSlingOverlayProps> = ({ onWebFired }) => {
  const [webShots, setWebShots] = useState<WebShot[]>([]);
  const [activeShooterMode, setActiveShooterMode] = useState<boolean>(false);

  useEffect(() => {
    if (!activeShooterMode) return;

    const handleClick = (e: MouseEvent) => {
      // Don't fire if clicking interactive UI buttons or inputs
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('nav')) {
        return;
      }

      soundFx.playThwip();
      if (onWebFired) onWebFired();

      const newShot: WebShot = {
        id: Date.now() + Math.random(),
        startX: window.innerWidth / 2 + (Math.random() > 0.5 ? 200 : -200),
        startY: window.innerHeight + 50,
        endX: e.clientX,
        endY: e.clientY,
      };

      setWebShots((prev) => [...prev, newShot]);

      setTimeout(() => {
        setWebShots((prev) => prev.filter((s) => s.id !== newShot.id));
      }, 700);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [activeShooterMode, onWebFired]);

  return (
    <>
      {/* Interactive Web Threads Layer */}
      <svg className="fixed inset-0 pointer-events-none z-40 w-full h-full">
        {webShots.map((shot) => (
          <g key={shot.id}>
            {/* Core Elastic White Web String */}
            <motion.line
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 0.9, 0] }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              x1={shot.startX}
              y1={shot.startY}
              x2={shot.endX}
              y2={shot.endY}
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Web Glow Shadow */}
            <motion.line
              initial={{ pathLength: 0, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              x1={shot.startX}
              y1={shot.startY}
              x2={shot.endX}
              y2={shot.endY}
              stroke="#38bdf8"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Web Impact Splatter at target */}
            <motion.circle
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.4, 1], opacity: [1, 1, 0] }}
              transition={{ duration: 0.6 }}
              cx={shot.endX}
              cy={shot.endY}
              r="14"
              fill="rgba(255,255,255,0.85)"
              stroke="#e11d48"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>

      {/* Floating Action Button to Toggle Free Web-Shooting Mode */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveShooterMode(!activeShooterMode);
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-2xl backdrop-blur-xl border ${
            activeShooterMode
              ? 'bg-red-600 text-white border-yellow-300 shadow-[0_0_25px_rgba(225,29,72,0.8)] scale-105 animate-pulse'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-red-500/40'
          }`}
        >
          <span className="text-base">🕸️</span>
          <span>{activeShooterMode ? 'وضع إطلاق الشباك نشط (انقر في أي مكان!)' : 'تفعيل وضع قاذف الشباك'}</span>
        </button>
      </div>
    </>
  );
};
