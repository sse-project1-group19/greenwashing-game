export interface Upgrade {
  id: number,
  name: string,
  description: string,
  cost: number,
  isGreenwashing?: boolean,
  moneyPerTick?: number,
  negationPerTick?: number,
  realWorldLink?: {
    company: string,
    incident: string
  }

}
export type GameStatus = 'not_started' | 'playing' | 'lost';

export interface TickProfitBreakdown {
  revenue: number;
  operatingCost: number;
  netProfit: number;
}

export interface GameState {
  gameStatus: GameStatus;
  tick: number;
  companyName: string;
  money: number;
  pollution: number;
  publicPerception: number;
  baseRevenuePerTick: number;
  baseOperatingCostPerTick: number;
  revenueMultiplier: number;
  costMultiplier: number;
  lastTickProfit: TickProfitBreakdown;
}

export interface GameStore {
  gameState: GameState;
  startNewGame: () => void;
  resetGame: () => void;
  setCompanyName: (companyName: string) => void;
  advanceTick: () => void;
}