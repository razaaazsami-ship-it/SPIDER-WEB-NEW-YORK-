import { PlayerStats, Mission, Achievement, HeroSuit } from '../types';
import { 
  INITIAL_PLAYER_STATS, 
  INITIAL_MISSIONS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_SUITS 
} from '../data/gameData';

const STORAGE_KEYS = {
  STATS: 'spider_app_stats_v1',
  MISSIONS: 'spider_app_missions_v1',
  ACHIEVEMENTS: 'spider_app_achievements_v1',
  SUITS: 'spider_app_suits_v1',
};

export const loadGameData = () => {
  try {
    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    const savedMissions = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const savedSuits = localStorage.getItem(STORAGE_KEYS.SUITS);

    return {
      stats: savedStats ? JSON.parse(savedStats) : INITIAL_PLAYER_STATS,
      missions: savedMissions ? JSON.parse(savedMissions) : INITIAL_MISSIONS,
      achievements: savedAchievements ? JSON.parse(savedAchievements) : INITIAL_ACHIEVEMENTS,
      suits: savedSuits ? JSON.parse(savedSuits) : INITIAL_SUITS,
    };
  } catch {
    return {
      stats: INITIAL_PLAYER_STATS,
      missions: INITIAL_MISSIONS,
      achievements: INITIAL_ACHIEVEMENTS,
      suits: INITIAL_SUITS,
    };
  }
};

export const saveGameData = (
  stats: PlayerStats,
  missions: Mission[],
  achievements: Achievement[],
  suits: HeroSuit[]
) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    localStorage.setItem(STORAGE_KEYS.SUITS, JSON.stringify(suits));
  } catch {
    // LocalStorage quota or access restrictions
  }
};
