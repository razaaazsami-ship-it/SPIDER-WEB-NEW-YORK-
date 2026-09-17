import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Award, 
  Sparkles, 
  Shield, 
  Zap, 
  Edit3, 
  Check, 
  Clock, 
  Compass, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { PlayerStats, Achievement, HeroSuit } from '../types';
import { soundFx } from '../utils/audio';

interface ProfileSectionProps {
  playerStats: PlayerStats;
  achievements: Achievement[];
  currentSuit: HeroSuit;
  onUpdateName: (name: string, heroAlias: string) => void;
  onClaimAchievement: (id: string, reward: number) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  playerStats,
  achievements,
  currentSuit,
  onUpdateName,
  onClaimAchievement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playerStats.name);
  const [editAlias, setEditAlias] = useState(playerStats.heroAlias);

  const handleSave = () => {
    soundFx.playClick();
    if (editName.trim()) {
      onUpdateName(editName.trim(), editAlias.trim() || 'العنكبوت الحارس');
    }
    setIsEditing(false);
  };

  const xpPercent = Math.min(100, Math.round((playerStats.currentXP / playerStats.maxXP) * 100));

  // Determine Vigilante Rank Title based on Level
  const getRankTitle = (lvl: number) => {
    if (lvl >= 5) return 'أسطورة نيويورك الخالدة';
    if (lvl >= 4) return 'حارس ناطحات السحاب المتقدم';
    if (lvl >= 3) return 'مدافع الشوارع المعتمد';
    if (lvl >= 2) return 'بطل الحي اليقظ';
    return 'بطل مبتدئ قيد التدريب';
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="mb-10 text-center sm:text-right border-b border-red-900/30 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest mb-1.5">
          <User className="w-3.5 h-3.5" />
          <span>ملف هوية الحارس السري والسجلات الميدانية</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
          الملف الشخصي والإنجازات
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          تابع تطور مهاراتك، إحصائيات التدخلات، والأوسمة والجوائز التي حصدتها في سماء المدينة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Player Identity Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-red-900/40 relative overflow-hidden shadow-[0_0_30px_rgba(225,29,72,0.15)]">
            {/* Top decorative gradient bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-2.5" 
              style={{
                background: `linear-gradient(90deg, ${currentSuit.primaryColor}, ${currentSuit.accentColor})`,
              }}
            />

            {/* Avatar & Edit Info */}
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center p-1 relative border-2 shadow-xl shrink-0"
                style={{
                  backgroundColor: '#0a0e17',
                  borderColor: currentSuit.primaryColor,
                  boxShadow: `0 0 20px ${currentSuit.primaryColor}55`,
                }}
              >
                {/* Stylized mask icon */}
                <svg viewBox="0 0 40 40" className="w-12 h-12">
                  <path
                    d="M 12 12 C 12 6, 28 6, 28 12 C 30 22, 24 32, 20 34 C 16 32, 10 22, 12 12 Z"
                    fill={currentSuit.primaryColor}
                  />
                  {/* Eyes */}
                  <polygon points="14,14 19,18 18,21 14,17" fill="#ffffff" />
                  <polygon points="26,14 21,18 22,21 26,17" fill="#ffffff" />
                </svg>

                <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[10px] font-black">
                  L{playerStats.level}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="اسم البطل"
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      value={editAlias}
                      onChange={(e) => setEditAlias(e.target.value)}
                      placeholder="اللقب الخارق"
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-700 text-red-300"
                    />
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> حفظ
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white truncate" style={{ fontFamily: "'Changa', sans-serif" }}>
                        {playerStats.name}
                      </h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                        title="تعديل الاسم واللقب"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-red-400 block truncate">
                      «{playerStats.heroAlias}»
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      الرتبة: {getRankTitle(playerStats.level)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Level & XP Progression Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">مستوى التقدم</span>
                <span className="text-blue-400 font-mono font-black">{playerStats.currentXP} / {playerStats.maxXP} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 block text-center">
                يتبقى {Math.max(0, playerStats.maxXP - playerStats.currentXP)} XP لبلوغ المستوى {playerStats.level + 1}
              </span>
            </div>

            {/* Career Record Grid */}
            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">نقاط العنكبوت (SP)</span>
                <span className="text-xl font-black text-yellow-400 font-mono" style={{ fontFamily: "'Changa', sans-serif" }}>
                  {playerStats.points.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">جرائم تم إحباطها</span>
                <span className="text-xl font-black text-red-400 font-mono" style={{ fontFamily: "'Changa', sans-serif" }}>
                  {playerStats.crimesPrevented}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">مهام مكتملة</span>
                <span className="text-xl font-black text-blue-400 font-mono" style={{ fontFamily: "'Changa', sans-serif" }}>
                  {playerStats.missionsCompleted}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">شباك أطلقت</span>
                <span className="text-xl font-black text-slate-200 font-mono" style={{ fontFamily: "'Changa', sans-serif" }}>
                  {playerStats.websShot}
                </span>
              </div>
            </div>

            {/* Equipped Suit Preview Box */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">البدلة المجهزة</span>
                <span className="text-sm font-black text-white">{currentSuit.name}</span>
              </div>
              <div 
                className="w-7 h-7 rounded-lg border flex items-center justify-center shadow-md"
                style={{ backgroundColor: currentSuit.primaryColor, borderColor: currentSuit.accentColor }}
              >
                <span className="text-xs">🕷️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Badges (2 columns span) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white flex items-center gap-2" style={{ fontFamily: "'Changa', sans-serif" }}>
              <Award className="w-5 h-5 text-yellow-400" />
              <span>أوسمة الشرف والإنجازات ({achievements.filter(a => a.unlocked).length} / {achievements.length})</span>
            </h3>
            <span className="text-xs text-yellow-400 font-bold">
              تمنحك كل جائزة نقاط SP إضافية
            </span>
          </div>

          {/* Achievements List */}
          <div className="space-y-4">
            {achievements.map((ach) => {
              const isFinished = ach.progress >= ach.maxProgress;
              const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    ach.unlocked
                      ? 'border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]'
                      : 'border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Badge Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        ach.unlocked
                          ? 'bg-yellow-950/60 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      {ach.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
                          {ach.title}
                        </h4>
                        {ach.unlocked && (
                          <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-black">
                            تم الفتح
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                        {ach.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3 pt-2 w-full max-w-xs">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {ach.progress}/{ach.maxProgress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reward & Claim Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 gap-2">
                    <div className="flex items-center gap-1 text-yellow-400 font-mono font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>+{ach.rewardPoints} SP</span>
                    </div>

                    {ach.unlocked ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم تحصيلها</span>
                      </div>
                    ) : isFinished ? (
                      <button
                        onClick={() => {
                          soundFx.playSuccess();
                          onClaimAchievement(ach.id, ach.rewardPoints);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-black text-xs shadow-md animate-pulse"
                      >
                        استلام الجائزة!
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">قيد الإنجاز</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hero Combat Attributes Radar / Skills */}
          <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-red-900/30 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2" style={{ fontFamily: "'Changa', sans-serif" }}>
              <Shield className="w-4 h-4 text-red-400" />
              <span>القدرات القتالية والخصائص الميدانية للبطل</span>
            </h4>

            <div className="space-y-3">
              {[
                { label: 'سرعة رد الفعل والتفادي (Reflexes)', value: 88, color: 'from-red-500 to-rose-400' },
                { label: 'قوة شد خيوط الشباك (Web Tensile Strength)', value: 92, color: 'from-blue-500 to-cyan-400' },
                { label: 'التخفي والاندماج مع ظلال المدينة (Stealth)', value: 74, color: 'from-purple-500 to-indigo-400' },
                { label: 'مدى حاسة العنكبوت الاستباقية (Spider-Sense)', value: 85, color: 'from-yellow-500 to-amber-400' },
              ].map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{skill.label}</span>
                    <span className="font-mono font-bold">{skill.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
