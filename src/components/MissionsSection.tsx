import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Flame, 
  Zap, 
  Radio, 
  Skull, 
  Eye, 
  Filter, 
  CheckCircle, 
  Sparkles,
  MapPin,
  Clock,
  Play
} from 'lucide-react';
import { Mission, District, MissionDifficulty } from '../types';
import { soundFx } from '../utils/audio';

interface MissionsSectionProps {
  missions: Mission[];
  onSelectMission: (mission: Mission) => void;
}

export const MissionsSection: React.FC<MissionsSectionProps> = ({
  missions,
  onSelectMission,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const districts: { id: string; label: string }[] = [
    { id: 'all', label: 'كافة الأحياء' },
    { id: 'مانهاتن', label: 'مانهاتن' },
    { id: 'تايمز سكوير', label: 'تايمز سكوير' },
    { id: 'بروكلين', label: 'بروكلين' },
    { id: 'كوينز', label: 'كوينز' },
    { id: 'السطوح العالية', label: 'السطوح العالية' },
  ];

  const difficulties: { id: string; label: string }[] = [
    { id: 'all', label: 'كل المستويات' },
    { id: 'سهل', label: 'سهل' },
    { id: 'متوسط', label: 'متوسط' },
    { id: 'صعب', label: 'صعب' },
    { id: 'أسطوري', label: 'أسطوري' },
  ];

  const filteredMissions = missions.filter((m) => {
    if (selectedDistrict !== 'all' && m.district !== selectedDistrict) return false;
    if (selectedDifficulty !== 'all' && m.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getDifficultyBadge = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case 'سهل':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
      case 'متوسط':
        return 'bg-blue-950/60 text-blue-400 border-blue-500/40';
      case 'صعب':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/40';
      case 'أسطوري':
        return 'bg-red-950/60 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]';
    }
  };

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-red-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'Radio':
        return <Radio className="w-6 h-6 text-blue-400" />;
      case 'Skull':
        return <Skull className="w-6 h-6 text-rose-500" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-purple-400" />;
      default:
        return <ShieldAlert className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-right flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-red-900/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-red-400 uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>لوحة عمليات شرطة ودوريات نيويورك</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
            سجل المهام والمغامرات الميدانية
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            اختر قطاع العمليات وانطلق لحماية المدنيين وجمع نقاط العنكبوت لترقية مهاراتك وبدلتك.
          </p>
        </div>

        {/* Quick status counter */}
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>{missions.filter(m => m.status === 'completed').length} مكتملة</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>{missions.filter(m => m.status === 'available').length} في الانتظار</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4 mb-8">
        {/* District Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 ml-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" /> الأحياء:
          </span>
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedDistrict(d.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDistrict === d.id
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 ml-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> الصعوبة:
          </span>
          {difficulties.map((dif) => (
            <button
              key={dif.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedDifficulty(dif.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDifficulty === dif.id
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {dif.label}
            </button>
          ))}
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => {
          const isCompleted = mission.status === 'completed';

          return (
            <motion.div
              key={mission.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-3xl p-6 bg-slate-900/80 backdrop-blur-xl border transition-all flex flex-col justify-between overflow-hidden group ${
                isCompleted
                  ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'border-red-900/40 hover:border-red-500/60 shadow-[0_0_25px_rgba(225,29,72,0.15)] hover:shadow-[0_0_35px_rgba(225,29,72,0.3)]'
              }`}
            >
              {/* Corner Web Decoration SVG */}
              <div className="absolute -top-6 -right-6 w-24 h-24 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-500 fill-none">
                  <path d="M 100 0 L 0 100 M 100 25 L 25 100 M 100 50 L 50 100" strokeWidth="1" />
                  <path d="M 100 0 Q 50 50 0 100" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Card Top: District & Difficulty Badges */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {mission.district}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-black ${getDifficultyBadge(mission.difficulty)}`}>
                      {mission.difficulty}
                    </span>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>تم الإنجاز</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>نشط الآن</span>
                    </div>
                  )}
                </div>

                {/* Mission Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-red-900/50 flex items-center justify-center shrink-0 group-hover:border-red-500 transition-colors shadow-inner">
                    {getMissionIcon(mission.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-red-300 transition-colors" style={{ fontFamily: "'Changa', sans-serif" }}>
                      {mission.title}
                    </h3>
                    <span className="text-xs text-slate-400">مستوى الخطورة: {mission.dangerLevel}/5</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {mission.description}
                </p>
              </div>

              {/* Card Bottom: Rewards & Action */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-blue-400 font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>+{mission.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{mission.pointsReward} SP</span>
                  </div>
                </div>

                {/* Action Trigger Button */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onSelectMission(mission);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCompleted
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isCompleted ? 'إعادة خوض المهمة' : 'بدء التدخل الآن'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
