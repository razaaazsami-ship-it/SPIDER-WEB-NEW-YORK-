import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  Lock, 
  Zap, 
  ShieldCheck, 
  Atom, 
  Layers 
} from 'lucide-react';
import { HeroSuit, PlayerStats } from '../types';
import { soundFx } from '../utils/audio';

interface SuitsLaboratoryProps {
  suits: HeroSuit[];
  playerStats: PlayerStats;
  onEquipSuit: (suitId: string) => void;
  onUnlockSuit: (suitId: string, cost: number) => void;
}

export const SuitsLaboratory: React.FC<SuitsLaboratoryProps> = ({
  suits,
  playerStats,
  onEquipSuit,
  onUnlockSuit,
}) => {
  const handleAction = (suit: HeroSuit) => {
    if (suit.unlocked) {
      soundFx.playClick();
      onEquipSuit(suit.id);
    } else {
      if (playerStats.points >= suit.costPoints) {
        soundFx.playLevelUp();
        onUnlockSuit(suit.id, suit.costPoints);
      } else {
        soundFx.playSpiderSense();
      }
    }
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Title */}
      <div className="mb-10 text-center sm:text-right border-b border-red-900/30 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-yellow-400 uppercase tracking-widest mb-1.5">
            <Atom className="w-3.5 h-3.5 animate-spin" />
            <span>المختبر التكنولوجي لتطوير العتاد والأنسجة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
            معمل البدل والقدرات العنكبوتية
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            استثمر نقاط العنكبوت (SP) في حياكة بدل متقدمة تمنحك مزايا تكتيكية في الميدان.
          </p>
        </div>

        {/* SP Balance Counter */}
        <div className="px-5 py-3 rounded-2xl bg-slate-900/90 border border-yellow-500/40 flex items-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-bold block">رصيدك الحالي</span>
            <span className="text-2xl font-black text-yellow-400 font-mono" style={{ fontFamily: "'Changa', sans-serif" }}>
              {playerStats.points.toLocaleString()} SP
            </span>
          </div>
        </div>
      </div>

      {/* Suits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {suits.map((suit) => {
          const isEquipped = playerStats.selectedSuitId === suit.id;
          const canAfford = playerStats.points >= suit.costPoints;

          return (
            <motion.div
              key={suit.id}
              whileHover={{ y: -6 }}
              className={`rounded-3xl p-6 bg-slate-900/80 backdrop-blur-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isEquipped
                  ? 'border-red-500 shadow-[0_0_30px_rgba(225,29,72,0.35)] ring-1 ring-red-500'
                  : suit.unlocked
                  ? 'border-slate-700/60 hover:border-slate-500'
                  : 'border-slate-800/80 opacity-90'
              }`}
            >
              {/* Equipped Badge Ribbon */}
              {isEquipped && (
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>مفعلة حاليًا</span>
                </div>
              )}

              <div>
                {/* Suit Visual Preview Avatar */}
                <div 
                  className="w-full h-44 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden border border-slate-800"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${suit.primaryColor}22 0%, #090d16 80%)`,
                  }}
                >
                  {/* Subtle Web Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none">
                      <circle cx="50" cy="50" r="20" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="40" strokeWidth="0.5" />
                      <line x1="0" y1="0" x2="100" y2="100" strokeWidth="0.5" />
                      <line x1="100" y1="0" x2="0" y2="100" strokeWidth="0.5" />
                    </svg>
                  </div>

                  {/* Stylized Suit Core Chest Emblem */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: suit.primaryColor,
                        borderColor: suit.accentColor,
                        boxShadow: `0 0 25px ${suit.accentColor}66`,
                      }}
                    >
                      {/* Stylized Geometric Spider Icon */}
                      <svg viewBox="0 0 32 32" className="w-11 h-11 fill-slate-950">
                        <polygon points="16,7 20,13 16,22 12,13" />
                        <circle cx="16" cy="5" r="1.5" />
                        <path d="M 12 10 L 4 7 M 12 13 L 3 14 M 20 10 L 28 7 M 20 13 L 29 14" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 13 18 L 5 25 M 19 18 L 27 25" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    <span className="text-[11px] font-bold text-slate-300 mt-2">{suit.theme}</span>
                  </div>
                </div>

                {/* Suit Information */}
                <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: "'Changa', sans-serif" }}>
                  {suit.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {suit.description}
                </p>

                {/* Suit Special Combat Bonus */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-red-900/30 mb-4 flex items-center gap-2 text-xs font-bold text-red-300">
                  <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>{suit.bonus}</span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {suit.unlocked ? (
                  <button
                    onClick={() => handleAction(suit)}
                    disabled={isEquipped}
                    className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                      isEquipped
                        ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isEquipped ? 'البدلة قيد الاستخدام' : 'ارتداء البدلة'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(suit)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                        : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>فتح البدلة ({suit.costPoints} SP)</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
