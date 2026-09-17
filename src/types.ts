export type District = 'مانهاتن' | 'بروكلين' | 'كوينز' | 'تايمز سكوير' | 'السطوح العالية';

export type MissionDifficulty = 'سهل' | 'متوسط' | 'صعب' | 'أسطوري';

export type MissionType = 'combat' | 'rescue' | 'chase' | 'patrol' | 'puzzle';

export interface Mission {
  id: string;
  title: string;
  district: District;
  difficulty: MissionDifficulty;
  xpReward: number;
  pointsReward: number;
  description: string;
  status: 'available' | 'in_progress' | 'completed';
  type: MissionType;
  iconName: string;
  targetCount: number;
  taskPrompt: string;
  dangerLevel: number; // 1 to 5
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardPoints: number;
}

export interface HeroSuit {
  id: string;
  name: string;
  theme: string;
  description: string;
  unlocked: boolean;
  costPoints: number;
  primaryColor: string;
  accentColor: string;
  bonus: string;
}

export interface PlayerStats {
  name: string;
  heroAlias: string;
  level: number;
  currentXP: number;
  maxXP: number;
  points: number; // Spider Points (SP)
  crimesPrevented: number;
  missionsCompleted: number;
  websShot: number;
  patrolHours: number;
  selectedSuitId: string;
}
