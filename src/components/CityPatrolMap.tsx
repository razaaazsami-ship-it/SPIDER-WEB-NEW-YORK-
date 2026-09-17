import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  ShieldAlert, 
  Wind, 
  Radio, 
  Eye, 
  Navigation, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { District, Mission } from '../types';
import { soundFx } from '../utils/audio';

interface CityPatrolMapProps {
  missions: Mission[];
  onSelectMission: (mission: Mission) => void;
}

interface PatrolDistrictInfo {
  name: District;
  status: 'آمن' | 'مضطرب' | 'خطر مرتفع';
  crimeRate: string;
  windSpeed: string;
  x: number; // map coordinates percent
  y: number;
}

export const CityPatrolMap: React.FC<CityPatrolMapProps> = ({
  missions,
  onSelectMission,
}) => {
  const [activeDistrict, setActiveDistrict] = useState<District>('مانهاتن');

  const districtData: PatrolDistrictInfo[] = [
    { name: 'مانهاتن', status: 'خطر مرتفع', crimeRate: '78%', windSpeed: '28 كم/س', x: 48, y: 35 },
    { name: 'تايمز سكوير', status: 'مضطرب', crimeRate: '64%', windSpeed: '18 كم/س', x: 55, y: 25 },
    { name: 'بروكلين', status: 'مضطرب', crimeRate: '52%', windSpeed: '34 كم/س', x: 68, y: 65 },
    { name: 'كوينز', status: 'آمن', crimeRate: '18%', windSpeed: '14 كم/س', x: 78, y: 38 },
    { name: 'السطوح العالية', status: 'خطر مرتفع', crimeRate: '88%', windSpeed: '45 كم/س', x: 38, y: 55 },
  ];

  const currentInfo = districtData.find((d) => d.name === activeDistrict) || districtData[0];
  const districtMissions = missions.filter((m) => m.district === activeDistrict);

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="mb-8 text-center sm:text-right border-b border-red-900/30 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-1.5">
          <Navigation className="w-3.5 h-3.5 animate-spin" />
          <span>رادار المراقبة الجوية للأبراج والشوارع</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
          خريطة دوريات مدينة نيويورك الليلية
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          تفقد نشاط الأحياء الحية، وتتبع إشارات الاستغاثة وسرعة الرياح المناسبة للتأرجح بين الأبراج.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Interactive Stylized NYC Vector Radar Map */}
        <div className="lg:col-span-2 relative h-96 sm:h-112 rounded-3xl bg-slate-950 border-2 border-red-900/40 overflow-hidden shadow-[0_0_35px_rgba(225,29,72,0.15)] flex items-center justify-center select-none">
          
          {/* Radar Scanner Sweep Line */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-96 h-96 rounded-full border border-red-500/30 relative">
              <div className="absolute inset-0 rounded-full border border-blue-500/20 scale-75" />
              <div className="absolute inset-0 rounded-full border border-slate-700/40 scale-50" />
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-1/2 -translate-y-1/2 animate-spin duration-3000" />
            </div>
          </div>

          {/* NYC Stylized Map River & Boroughs SVG */}
          <svg viewBox="0 0 500 400" className="w-full h-full stroke-slate-800 fill-slate-900/90">
            {/* Hudson & East Rivers */}
            <path
              d="M 120 0 Q 150 150 180 250 T 220 400"
              fill="none"
              stroke="#0f172a"
              strokeWidth="24"
            />
            <path
              d="M 280 0 Q 290 140 330 260 T 360 400"
              fill="none"
              stroke="#0f172a"
              strokeWidth="18"
            />

            {/* Manhattan Island Silhouette */}
            <polygon
              points="160,20 270,10 260,280 180,300"
              className="fill-slate-900 hover:fill-slate-850 transition-colors cursor-pointer"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Queens / Brooklyn Landmass */}
            <polygon
              points="300,30 480,40 480,380 320,380 280,260"
              className="fill-slate-900/60"
              stroke="#1e293b"
              strokeWidth="1.5"
            />

            {/* Web lines connecting sectors */}
            <line x1="220" y1="120" x2="360" y2="100" stroke="#e11d48" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="220" y1="120" x2="320" y2="280" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          </svg>

          {/* Interactive District Radar Pins */}
          {districtData.map((district) => {
            const isSelected = activeDistrict === district.name;
            const hasAvailableMission = missions.some(
              (m) => m.district === district.name && m.status === 'available'
            );

            return (
              <div
                key={district.name}
                style={{ left: `${district.x}%`, top: `${district.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() => {
                    soundFx.playSpiderSense();
                    setActiveDistrict(district.name);
                  }}
                  className="relative group cursor-pointer p-2 focus:outline-none"
                >
                  {/* Ping wave */}
                  {hasAvailableMission && (
                    <span className="absolute inset-0 rounded-full bg-red-600/40 animate-ping" />
                  )}

                  {/* Pin Dot */}
                  <div
                    className={`relative w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.8)] scale-110 border-2 border-yellow-300'
                        : 'bg-slate-900/90 text-red-400 border border-red-500/40 hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* District Label Tag */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 text-[10px] font-bold text-slate-200">
                    {district.name}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* District Detail Information Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-red-900/40 space-y-6">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400">القطاع المحدد:</span>
              <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
                حي {currentInfo.name}
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-black border ${
                currentInfo.status === 'خطر مرتفع'
                  ? 'bg-red-950 text-red-400 border-red-500/50'
                  : currentInfo.status === 'مضطرب'
                  ? 'bg-amber-950 text-amber-400 border-amber-500/50'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
              }`}
            >
              {currentInfo.status}
            </span>
          </div>

          {/* Environmental Sensor Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>مستوى البلاغات</span>
              </div>
              <span className="text-lg font-black text-red-400 font-mono">{currentInfo.crimeRate}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Wind className="w-4 h-4 text-blue-400" />
                <span>سرعة الرياح</span>
              </div>
              <span className="text-lg font-black text-blue-400 font-mono">{currentInfo.windSpeed}</span>
            </div>
          </div>

          {/* District Specific Missions */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>البلاغات والمهام الجارية في هذا القطاع ({districtMissions.length}):</span>
            </h4>

            {districtMissions.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-center text-xs text-slate-400">
                القطاع آمن في الوقت الحالي، لا توجد بلاغات طارئة.
              </div>
            ) : (
              <div className="space-y-2.5">
                {districtMissions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      soundFx.playClick();
                      onSelectMission(m);
                    }}
                    className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-red-500/50 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                        {m.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-yellow-400">+{m.pointsReward} SP</span>
                        <span>•</span>
                        <span className="text-blue-400">+{m.xpReward} XP</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold shadow-sm">
                      تدخل
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
