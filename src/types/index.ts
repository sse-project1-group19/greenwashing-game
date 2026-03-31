export interface Upgrade {
  id: number;
  name: string;
  description: string;
  cost: number;
  isGreenwashing?: boolean;
  moneyPerSecond?: number;
  moneyPerClick?: number;
  pollutionPerSecond?: number;
  perceptionImpact?: number;
  category?: 'production' | 'perception';
  educationalMessage?: string;
  realWorldEvidence?: string;
  source?: string;
  sourceUrl?: string;
  negationPerTick?: number;
  realWorldLink?: {
    company: string;
    incident: string;
  };
}

export type GameStatus = 'not_started' | 'playing' | 'won' | 'lost';

export interface GameState {
  money: number;
  ownedUpgrades: Upgrade[];
  baseMoneyPerSecond: number;
  pollution: number;
  tick: number;
  perceptionMax: number;
  perceptionCurrent: number;
  gameState: GameStatus;
  currentTickClicks: number;
  totalClicks: number;
}