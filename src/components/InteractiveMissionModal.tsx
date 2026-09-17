import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Clock, 
  Target, 
  Sparkles, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Mission } from '../types';
import { soundFx } from '../utils/audio';

interface InteractiveMissionModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (missionId: string, earnedXP: number, earnedPoints: number) => void;
}

interface TargetItem {
  id: number;
  x: number; // percentage
  y: number; // percentage
  hit: boolean;
  type: 'thug' | 'drone' | 'civilian' | 'bomb';
}

export const InteractiveMissionModal: React.FC<InteractiveMissionModalProps> = ({
  mission,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [gameState, setGameState] = useState<'briefing' | 'playing' | 'victory' | 'failed'>('briefing');
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [capturedCount, setCapturedCount] = useState<number>(0);
  const [comboPoints, setComboPoints] = useState<number>(0);

  // Generate targets when starting game
  const startGame = () => {
    if (!mission) return;
    soundFx.playSwing();
    setGameState('playing');
    setTimeLeft(16);
    setCapturedCount(0);
    setComboPoints(0);

    const generated: TargetItem[] = [];
    const count = Math.max(4, mission.targetCount);

    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 60,
        hit: false,
        type: i % 3 === 0 ? 'drone' : i % 2 === 0 ? 'thug' : 'bomb',
      });
    }

    setTargets(generated);
  };

  // Timer Countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      if (capturedCount >= (mission?.targetCount || 3)) {
        triggerVictory();
      } else {
        soundFx.playSpiderSense();
        setGameState('failed');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, capturedCount, mission]);

  // Handle Target Shot
  const handleTargetClick = (targetId: number) => {
    soundFx.playThwip();
    soundFx.playImpact();

    setTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, hit: true } : t))
    );

    setCapturedCount((prev) => {
      const updated = prev + 1;
      setComboPoints((c) => c + 25);

      if (mission && updated >= mission.targetCount) {
        setTimeout(() => {
          triggerVictory();
        }, 300);
      }
      return updated;
    });
  };

  const triggerVictory = () => {
    setGameState('victory');
    soundFx.playSuccess();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#2563eb', '#fbbf24', '#ffffff'],
      });
    } catch {
      // Ignore if confetti fails in iFrame
    }

    if (mission) {
      onComplete(mission.id, mission.xpReward, mission.pointsReward + comboPoints);
    }
  };

  if (!isOpen || !mission) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-red-600/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.4)] flex flex-col text-slate-100"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-slate-900 to-blue-950/80 border-b border-red-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
                  {mission.title}
                </h3>
                <span className="text-xs text-red-300">حي {mission.district} • مستوى الخطر: {mission.dangerLevel}/5</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content by State */}
          <div className="p-6">
            {/* STATE 1: BRIEFING */}
            {gameState === 'briefing' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <p className="text-base text-slate-200 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
                  <Target className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-300 mb-1">الهدف العملياتي:</h4>
                    <p className="text-xs text-slate-300">{mission.taskPrompt}</p>
                  </div>
                </div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-blue-900/30 text-center">
                    <span className="text-xs text-slate-400 font-bold block mb-1">مكافأة الخبرة</span>
                    <span className="text-2xl font-black text-blue-400 font-mono">+{mission.xpReward} XP</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-yellow-900/30 text-center">
                    <span className="text-xs text-slate-400 font-bold block mb-1">مكافأة نقاط العنكبوت</span>
                    <span className="text-2xl font-black text-yellow-400 font-mono">+{mission.pointsReward} SP</span>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={startGame}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all flex items-center justify-center gap-2 border border-red-400/40"
                  style={{ fontFamily: "'Changa', sans-serif" }}
                >
                  <Target className="w-5 h-5 text-yellow-300" />
                  <span>انقض على الهدف الآن (بدء التدخل)</span>
                </button>
              </div>
            )}

            {/* STATE 2: INTERACTIVE MINI-GAME */}
            {gameState === 'playing' && (
              <div className="space-y-4">
                {/* HUD: Timer & Targets */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-yellow-400 font-mono font-black text-xl">
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">الأهداف المحيدة:</span>
                    <span className="text-lg font-black text-red-400 font-mono">
                      {capturedCount} / {mission.targetCount}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-yellow-400"
                    animate={{ width: `${(capturedCount / mission.targetCount) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Interactive Action Canvas Field */}
                <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-slate-950 border border-red-900/40 overflow-hidden select-none cursor-crosshair">
                  {/* Rooftop Night Scene SVG */}
                  <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <svg viewBox="0 0 400 300" className="w-full h-full fill-slate-900 stroke-slate-800">
                      <rect x="20" y="80" width="80" height="220" />
                      <rect x="120" y="40" width="100" height="260" />
                      <rect x="240" y="100" width="70" height="200" />
                      <rect x="330" y="60" width="60" height="240" />
                      {/* Web string across roof */}
                      <line x1="20" y1="90" x2="380" y2="90" stroke="#e11d48" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                  </div>

                  {/* Target Nodes to Click / Shoot */}
                  {targets.map((t) => {
                    if (t.hit) {
                      return (
                        <div
                          key={t.id}
                          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ left: `${t.x}%`, top: `${t.y}%` }}
                        >
                          {/* Web Trapped Visual */}
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <span className="text-2xl animate-bounce">🕸️</span>
                            <span className="absolute text-[10px] font-black text-green-400 -bottom-3 bg-slate-900/90 px-1 rounded">
                              تم التحييد!
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <motion.button
                        key={t.id}
                        onClick={() => handleTargetClick(t.id)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full group cursor-pointer focus:outline-none"
                        style={{ left: `${t.x}%`, top: `${t.y}%` }}
                      >
                        {/* Aim Reticle Pulse */}
                        <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping" />
                        <div className="relative w-11 h-11 rounded-full bg-slate-900 border-2 border-red-500 shadow-[0_0_15px_rgba(225,29,72,0.8)] flex items-center justify-center text-white">
                          <Target className="w-6 h-6 text-red-400 group-hover:text-yellow-400 transition-colors" />
                        </div>
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-yellow-400 whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded">
                          أطلق الشبكة!
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-slate-400">
                  ⚡ انقر بسرعة على الأهداف المضيئة لإطلاق حبال العنكبوت وتحييد الخطر!
                </p>
              </div>
            )}

            {/* STATE 3: VICTORY */}
            {gameState === 'victory' && (
              <div className="text-center py-6 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ fontFamily: "'Changa', sans-serif" }}>
                    تمت المهمة بنجاح تام! 🕸️
                  </h3>
                  <p className="text-sm text-slate-300">
                    أحسنت صنعًا! تم تأمين منطقة {mission.district} وشوارع نيويورك باتت أكثر أمانًا بفضلك.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="p-3 rounded-xl bg-slate-950 border border-blue-900/40">
                    <span className="text-xs text-slate-400 block mb-1">الخبرة المكتسبة</span>
                    <span className="text-xl font-black text-blue-400">+{mission.xpReward} XP</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-yellow-900/40">
                    <span className="text-xs text-slate-400 block mb-1">النقاط + مكافأة السرعة</span>
                    <span className="text-xl font-black text-yellow-400">+{mission.pointsReward + comboPoints} SP</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                  className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors"
                >
                  العودة لقائمة المهام
                </button>
              </div>
            )}

            {/* STATE 4: FAILED */}
            {gameState === 'failed' && (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Changa', sans-serif" }}>
                    نفد الوقت قبل إتمام المهمة!
                  </h3>
                  <p className="text-xs text-slate-400">
                    استجمع تركيزك وحاستك العنكبوتية وحاول مرة أخرى لحماية الحي.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors shadow-lg"
                  >
                    إعادة المحاولة
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
