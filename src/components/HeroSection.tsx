import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  ChevronDown, 
  Compass, 
  Radio
} from 'lucide-react';
import { SpiderHeroVisual } from './SpiderHeroVisual';
import { PlayerStats, HeroSuit } from '../types';
import { soundFx } from '../utils/audio';

interface HeroSectionProps {
  playerStats: PlayerStats;
  currentSuit: HeroSuit;
  onStartAdventure: () => void;
  onShootWeb: () => void;
  onOpenPatrol: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  playerStats,
  currentSuit,
  onStartAdventure,
  onShootWeb,
  onOpenPatrol,
}) => {
  const [interactiveWebCount, setInteractiveWebCount] = useState(0);
  const [spiderSenseAlert, setSpiderSenseAlert] = useState(false);

  const handleHeroInteract = () => {
    onShootWeb();
    setInteractiveWebCount((prev) => prev + 1);
  };

  const triggerSpiderSense = () => {
    soundFx.playSpiderSense();
    setSpiderSenseAlert(true);
    setTimeout(() => {
      setSpiderSenseAlert(false);
    }, 2500);
  };

  const xpPercent = Math.min(100, Math.round((playerStats.currentXP / playerStats.maxXP) * 100));

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between pt-6 pb-12 overflow-hidden">
      
      {/* Spider-Sense Tingle Alert Banner */}
      {spiderSenseAlert && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600/90 text-white font-black px-6 py-2 rounded-full border-2 border-yellow-300 shadow-[0_0_30px_rgba(239,68,68,0.9)] flex items-center gap-3"
          style={{ fontFamily: "'Changa', sans-serif" }}
        >
          <Radio className="w-5 h-5 text-yellow-300 animate-ping" />
          <span>حاسة العنكبوت تنبهك: رصد نشاط مشبوه في أرجاء مانهاتن!</span>
        </motion.div>
      )}

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center text-center">
        
        {/* District Alert Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-xs sm:text-sm font-bold backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(225,29,72,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-yellow-400">نيويورك ليلًا:</span>
          <span>قطاع مانهاتن تحت المراقبة المشددة</span>
        </motion.div>

        {/* Big Impactful Superhero Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative max-w-4xl mx-auto mb-4"
        >
          {/* Subtle Backing Web Lines SVG */}
          <div className="absolute -inset-x-8 -inset-y-6 pointer-events-none opacity-20 -z-10 flex items-center justify-center">
            <svg viewBox="0 0 600 200" className="w-full h-full stroke-red-500" fill="none">
              <circle cx="300" cy="100" r="40" strokeWidth="1" />
              <circle cx="300" cy="100" r="80" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="100" y1="20" x2="500" y2="180" strokeWidth="1.5" />
              <line x1="500" y1="20" x2="100" y2="180" strokeWidth="1.5" />
              <line x1="300" y1="0" x2="300" y2="200" strokeWidth="1.5" />
            </svg>
          </div>

          <h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight sm:leading-none select-none"
            style={{ fontFamily: "'Changa', sans-serif" }}
          >
            <span className="block text-slate-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              حامي المدينة في ظلام الليل
            </span>
            <span className="block mt-2 bg-gradient-to-r from-red-500 via-rose-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(225,29,72,0.6)]">
              شبكة الأبطال: مغامرة العنكبوت
            </span>
          </h1>
        </motion.div>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-medium mb-8 leading-relaxed"
        >
          تأرجح بين أفق ناطحات السحاب المظلمة، استجب لنداءات الاستغاثة، أحبط المخططات الإجرامية، وطور مهاراتك وبدلتك لتصبح الرمز الذي تحتاجه شوارع نيويورك.
        </motion.p>

        {/* Central Character & Interactive Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="my-2 relative flex flex-col items-center"
        >
          <SpiderHeroVisual
            onInteract={handleHeroInteract}
            suitTheme={{
              primaryColor: currentSuit.primaryColor,
              accentColor: currentSuit.accentColor,
            }}
          />

          {/* Active Suit Badge */}
          <div className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-slate-300">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: currentSuit.primaryColor }}
            />
            <span>البدلة النشطة:</span>
            <span className="text-white font-bold">{currentSuit.name}</span>
          </div>
        </motion.div>

        {/* Primary Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          {/* Main "Start Adventure" Button */}
          <button
            onClick={() => {
              soundFx.playSwing();
              onStartAdventure();
            }}
            className="group relative px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-lg sm:text-xl shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:shadow-[0_0_45px_rgba(225,29,72,0.9)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 overflow-hidden border border-red-400/40"
            style={{ fontFamily: "'Changa', sans-serif" }}
          >
            {/* Animated Web Line Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300 group-hover:scale-125 transition-transform" />
            <span>ابدأ المغامرة</span>
            <span className="text-xl">⚡</span>
          </button>

          {/* Secondary Action: Patrol Map */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenPatrol();
            }}
            className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 hover:text-white font-bold text-base sm:text-lg border border-slate-700/80 hover:border-blue-500/50 shadow-lg hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all flex items-center gap-2.5 backdrop-blur-md"
          >
            <Compass className="w-5 h-5 text-blue-400" />
            <span>خريطة الدوريات الحية</span>
          </button>

          {/* Test Spider Sense Tingle */}
          <button
            onClick={triggerSpiderSense}
            title="اختبر حاسة العنكبوت"
            className="px-4 py-4 rounded-2xl bg-red-950/40 hover:bg-red-950/80 text-red-400 border border-red-900/60 hover:border-red-500/80 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold hidden sm:inline">حاسة العنكبوت</span>
          </button>
        </motion.div>

        {/* Quick Player Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl w-full mx-auto mt-12"
        >
          {/* Level & XP */}
          <div className="p-4 rounded-2xl bg-slate-900/75 border border-red-900/30 backdrop-blur-md text-right flex flex-col justify-between shadow-lg hover:border-red-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">المستوى الحالي</span>
              <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center text-xs font-black text-red-400">
                L{playerStats.level}
              </div>
            </div>
            <div className="font-black text-2xl text-white mb-2" style={{ fontFamily: "'Changa', sans-serif" }}>
              {playerStats.heroAlias}
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>التقدم</span>
                <span>{playerStats.currentXP} / {playerStats.maxXP} XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Spider Points (SP) */}
          <div className="p-4 rounded-2xl bg-slate-900/75 border border-yellow-900/30 backdrop-blur-md text-right flex flex-col justify-between shadow-lg hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">نقاط العنكبوت (SP)</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="font-black text-3xl text-yellow-400 my-1" style={{ fontFamily: "'Changa', sans-serif" }}>
              {playerStats.points.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              جاهزة للاستخدام في معمل البدل
            </div>
          </div>

          {/* Missions Done */}
          <div className="p-4 rounded-2xl bg-slate-900/75 border border-blue-900/30 backdrop-blur-md text-right flex flex-col justify-between shadow-lg hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">المهام المكتملة</span>
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div className="font-black text-3xl text-blue-400 my-1" style={{ fontFamily: "'Changa', sans-serif" }}>
              {playerStats.missionsCompleted}
            </div>
            <div className="text-[11px] text-slate-400">
              {playerStats.crimesPrevented} جريمة تم إحباطها
            </div>
          </div>

          {/* Web Shoots */}
          <div className="p-4 rounded-2xl bg-slate-900/75 border border-slate-700/40 backdrop-blur-md text-right flex flex-col justify-between shadow-lg hover:border-slate-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">شباك أطلقت</span>
              <span className="text-lg">🕸️</span>
            </div>
            <div className="font-black text-3xl text-slate-100 my-1" style={{ fontFamily: "'Changa', sans-serif" }}>
              {playerStats.websShot + interactiveWebCount}
            </div>
            <div className="text-[11px] text-slate-400">
              انقر على البطل لإطلاق المزيد!
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div 
          onClick={onStartAdventure}
          className="mt-12 flex flex-col items-center gap-2 cursor-pointer text-slate-400 hover:text-red-400 transition-colors group"
        >
          <span className="text-xs font-bold tracking-wider">استكشف المهام الميدانية</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-red-500 group-hover:scale-125 transition-transform" />
        </div>
      </div>
    </div>
  );
};
