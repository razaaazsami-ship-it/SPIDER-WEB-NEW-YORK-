import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  X, 
  ArrowLeft, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';

import { CityBackground } from './components/CityBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MissionsSection } from './components/MissionsSection';
import { InteractiveMissionModal } from './components/InteractiveMissionModal';
import { CityPatrolMap } from './components/CityPatrolMap';
import { SuitsLaboratory } from './components/SuitsLaboratory';
import { ProfileSection } from './components/ProfileSection';
import { QuickWebSlingOverlay } from './components/QuickWebSlingOverlay';
import { Footer } from './components/Footer';

import { PlayerStats, Mission, Achievement, HeroSuit } from './types';
import { loadGameData, saveGameData } from './utils/storage';
import { soundFx } from './utils/audio';

export default function App() {
  // Load saved progress or initial state
  const [dataLoaded, setDataLoaded] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => loadGameData().stats);
  const [missions, setMissions] = useState<Mission[]>(() => loadGameData().missions);
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadGameData().achievements);
  const [suits, setSuits] = useState<HeroSuit[]>(() => loadGameData().suits);

  // UI state
  const [currentTab, setCurrentTab] = useState<'home' | 'missions' | 'patrol' | 'suits' | 'profile'>('home');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  // Level Up Modal State
  const [newLevelUnlocked, setNewLevelUnlocked] = useState<number | null>(null);

  // Save to localStorage whenever critical state changes
  useEffect(() => {
    saveGameData(playerStats, missions, achievements, suits);
  }, [playerStats, missions, achievements, suits]);

  // Handle Web Fired in Free Mode or on Hero
  const handleWebFired = () => {
    setPlayerStats((prev) => {
      const nextWebs = prev.websShot + 1;
      // Check achievement for 10 webs
      if (nextWebs >= 10) {
        checkAndUnlockAchievement('first_web');
      }
      if (nextWebs >= 100) {
        checkAndUnlockAchievement('master_swinger');
      }
      return {
        ...prev,
        websShot: nextWebs,
      };
    });
  };

  // Check and unlock achievements helper
  const checkAndUnlockAchievement = (achId: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === achId && !ach.unlocked) {
          soundFx.playSuccess();
          return { ...ach, unlocked: true, progress: ach.maxProgress };
        }
        return ach;
      })
    );
  };

  // Launch interactive mission
  const handleSelectMission = (mission: Mission) => {
    setSelectedMission(mission);
    setIsMissionModalOpen(true);
  };

  // Complete interactive mission handler
  const handleCompleteMission = (missionId: string, earnedXP: number, earnedPoints: number) => {
    // 1. Update Mission Status
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: 'completed' } : m))
    );

    // 2. Update Stats with XP and Spider Points
    setPlayerStats((prev) => {
      let nextXP = prev.currentXP + earnedXP;
      let nextLevel = prev.level;
      let nextMaxXP = prev.maxXP;

      // Check Level Up
      if (nextXP >= nextMaxXP) {
        nextLevel += 1;
        nextXP = nextXP - nextMaxXP;
        nextMaxXP = Math.round(nextMaxXP * 1.4);

        // Trigger celebratory Level Up!
        setTimeout(() => {
          soundFx.playLevelUp();
          setNewLevelUnlocked(nextLevel);
          try {
            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#e11d48', '#38bdf8', '#fbbf24', '#f8fafc'],
            });
          } catch {
            // Ignore
          }
        }, 500);
      }

      const nextCompleted = prev.missionsCompleted + 1;
      const nextCrimes = prev.crimesPrevented + 1;
      const nextPoints = prev.points + earnedPoints;

      // Check achievements
      if (nextCompleted >= 5) {
        checkAndUnlockAchievement('city_protector');
      }
      if (nextLevel >= 5 && nextPoints >= 1500) {
        checkAndUnlockAchievement('legendary_vigilante');
      }

      return {
        ...prev,
        currentXP: nextXP,
        level: nextLevel,
        maxXP: nextMaxXP,
        points: nextPoints,
        missionsCompleted: nextCompleted,
        crimesPrevented: nextCrimes,
      };
    });
  };

  // Equip suit
  const handleEquipSuit = (suitId: string) => {
    setPlayerStats((prev) => ({
      ...prev,
      selectedSuitId: suitId,
    }));
  };

  // Unlock suit with SP points
  const handleUnlockSuit = (suitId: string, cost: number) => {
    if (playerStats.points < cost) return;

    setPlayerStats((prev) => ({
      ...prev,
      points: prev.points - cost,
      selectedSuitId: suitId,
    }));

    setSuits((prev) =>
      prev.map((s) => (s.id === suitId ? { ...s, unlocked: true } : s))
    );

    checkAndUnlockAchievement('suit_collector');
  };

  // Claim achievement reward
  const handleClaimAchievement = (achId: string, reward: number) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === achId ? { ...a, unlocked: true } : a))
    );
    setPlayerStats((prev) => ({
      ...prev,
      points: prev.points + reward,
    }));
  };

  // Update hero profile name / alias
  const handleUpdateName = (name: string, heroAlias: string) => {
    setPlayerStats((prev) => ({
      ...prev,
      name,
      heroAlias,
    }));
  };

  const currentSuit = suits.find((s) => s.id === playerStats.selectedSuitId) || suits[0];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-red-600 selection:text-white">
      
      {/* Dynamic Animated NYC Night Canvas with spider web particles */}
      <CityBackground />

      {/* Free-clicking Web Shooter Layer */}
      <QuickWebSlingOverlay onWebFired={handleWebFired} />

      {/* Interactive Mission Challenge Modal */}
      <InteractiveMissionModal
        isOpen={isMissionModalOpen}
        mission={selectedMission}
        onClose={() => setIsMissionModalOpen(false)}
        onComplete={handleCompleteMission}
      />

      {/* Level-Up Celebration Modal Dialog */}
      <AnimatePresence>
        {newLevelUnlocked !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-md w-full p-8 rounded-3xl bg-slate-900 border-2 border-yellow-400 text-center shadow-[0_0_60px_rgba(234,179,8,0.5)] overflow-hidden"
            >
              {/* Sunburst glowing background */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/15 via-red-500/10 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.6)] animate-bounce">
                  <Trophy className="w-10 h-10" />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-300 text-xs font-black">
                  ارتقاء في الرتبة البطولية!
                </span>

                <h3 className="text-3xl font-black text-white" style={{ fontFamily: "'Changa', sans-serif" }}>
                  المستوى {newLevelUnlocked} تم فتحه! ⚡
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  تطورت مهاراتك وسرعة استجابتك لخيوط العنكبوت، وتمت إضافة حوافز جديدة في معمل الأسلحة والبدل!
                </p>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-yellow-500/40 text-yellow-400 font-bold text-sm">
                  مكافأة الارتقاء: +200 SP هدية إضافية!
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setPlayerStats((p) => ({ ...p, points: p.points + 200 }));
                    setNewLevelUnlocked(null);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-black text-base shadow-lg hover:brightness-110 transition-all"
                  style={{ fontFamily: "'Changa', sans-serif" }}
                >
                  استلام المكافأة ومتابعة الحراسة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        playerStats={playerStats}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        ambientPlaying={ambientPlaying}
        setAmbientPlaying={setAmbientPlaying}
      />

      {/* Main View Router */}
      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection
                playerStats={playerStats}
                currentSuit={currentSuit}
                onStartAdventure={() => {
                  soundFx.playSwing();
                  setCurrentTab('missions');
                }}
                onShootWeb={handleWebFired}
                onOpenPatrol={() => setCurrentTab('patrol')}
              />
            </motion.div>
          )}

          {currentTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MissionsSection
                missions={missions}
                onSelectMission={handleSelectMission}
              />
            </motion.div>
          )}

          {currentTab === 'patrol' && (
            <motion.div
              key="patrol"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CityPatrolMap
                missions={missions}
                onSelectMission={handleSelectMission}
              />
            </motion.div>
          )}

          {currentTab === 'suits' && (
            <motion.div
              key="suits"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <SuitsLaboratory
                suits={suits}
                playerStats={playerStats}
                onEquipSuit={handleEquipSuit}
                onUnlockSuit={handleUnlockSuit}
              />
            </motion.div>
          )}

          {currentTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileSection
                playerStats={playerStats}
                achievements={achievements}
                currentSuit={currentSuit}
                onUpdateName={handleUpdateName}
                onClaimAchievement={handleClaimAchievement}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />
    </div>
  );
}
