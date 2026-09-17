import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Radio, 
  Shield, 
  Award, 
  MapPin, 
  Menu, 
  X, 
  User, 
  Sparkles,
  Zap
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { PlayerStats } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'missions' | 'patrol' | 'suits' | 'profile';
  setCurrentTab: (tab: 'home' | 'missions' | 'patrol' | 'suits' | 'profile') => void;
  playerStats: PlayerStats;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  ambientPlaying: boolean;
  setAmbientPlaying: (active: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  playerStats,
  isMuted,
  setIsMuted,
  ambientPlaying,
  setAmbientPlaying,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: 'home' | 'missions' | 'patrol' | 'suits' | 'profile') => {
    soundFx.playClick();
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
    if (!nextMuted) {
      soundFx.playClick();
    }
  };

  const toggleAmbient = () => {
    const active = soundFx.toggleAmbient();
    setAmbientPlaying(active);
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Shield },
    { id: 'missions', label: 'المهام والمغامرات', icon: Zap },
    { id: 'patrol', label: 'خريطة الدوريات', icon: MapPin },
    { id: 'suits', label: 'معمل البدل', icon: Sparkles },
    { id: 'profile', label: 'الملف الشخصي', icon: User },
  ] as const;

  const xpPercent = Math.min(100, Math.round((playerStats.currentXP / playerStats.maxXP) * 100));

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/85 border-b border-red-900/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => handleTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-blue-700 p-0.5 shadow-[0_0_15px_rgba(225,29,72,0.5)] group-hover:shadow-[0_0_25px_rgba(225,29,72,0.8)] transition-all transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              {/* Spider geometric vector mini icon */}
              <svg viewBox="0 0 32 32" className="w-6 h-6 fill-red-500 group-hover:fill-red-400 transition-colors">
                <polygon points="16,6 20,14 16,24 12,14" />
                <circle cx="16" cy="4" r="2" />
                <path d="M 12 10 L 4 7 L 2 12 M 12 14 L 3 15 L 2 20 M 20 10 L 28 7 L 30 12 M 20 14 L 29 15 L 30 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 13 20 L 5 26 L 7 30 M 19 20 L 27 26 L 25 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl tracking-wide bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent" style={{ fontFamily: "'Changa', sans-serif" }}>
              حامي نيويورك
            </span>
            <span className="text-[11px] font-bold text-red-400/90 tracking-wider">
              SPIDER VIGILANTE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 select-none ${
                  isActive
                    ? 'text-white shadow-[0_0_20px_rgba(225,29,72,0.35)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/30 via-red-600/20 to-blue-600/30 border border-red-500/50"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats & Audio Controls */}
        <div className="flex items-center gap-2.5">
          {/* Points Pill */}
          <div 
            onClick={() => handleTabChange('suits')}
            title="نقاط العنكبوت (SP) - تستخدم لترقية البدل"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-yellow-500/30 hover:border-yellow-400/60 transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span className="font-extrabold text-xs text-yellow-400" style={{ fontFamily: "'Changa', sans-serif" }}>
              {playerStats.points.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">SP</span>
          </div>

          {/* Level Pill */}
          <div 
            onClick={() => handleTabChange('profile')}
            title={`المستوى ${playerStats.level} (${xpPercent}% نحو المستوى التالي)`}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-red-500/30 hover:border-red-500/60 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-[10px] font-black text-red-300">
              {playerStats.level}
            </div>
            <div className="flex flex-col w-14">
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-0.5">
                <span>XP</span>
                <span>{xpPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ambient Music Toggle */}
          <button
            onClick={toggleAmbient}
            title={ambientPlaying ? 'إيقاف نغمة الليل المحيطية' : 'تشغيل نغمة الليل المحيطية في نيويورك'}
            className={`p-2 rounded-xl border transition-all ${
              ambientPlaying 
                ? 'bg-blue-950/60 border-blue-500 text-blue-400 shadow-[0_0_12px_rgba(56,189,248,0.4)]' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className={`w-4 h-4 ${ambientPlaying ? 'animate-pulse' : ''}`} />
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
            className={`p-2 rounded-xl border transition-all ${
              !isMuted 
                ? 'bg-red-950/60 border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(225,29,72,0.3)]' 
                : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-red-900/30 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Level & XP display */}
              <div className="p-3 rounded-xl bg-slate-900 border border-red-900/30 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-sm">
                    {playerStats.level}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{playerStats.heroAlias}</div>
                    <div className="text-xs text-slate-400">التقدم: {xpPercent}% ({playerStats.currentXP}/{playerStats.maxXP} XP)</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-yellow-400">{playerStats.points} SP</span>
                </div>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      isActive
                        ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
