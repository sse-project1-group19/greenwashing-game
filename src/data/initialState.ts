import type { GameState } from '../types/game';

export const createInitialGameState = (): GameState => ({
  gameStatus: 'not_started',
  tick: 0,
  companyName: 'Random Name',
  money: 0,
  pollution: 0,
  publicPerception: 100,
  baseRevenuePerTick: 12,
  baseOperatingCostPerTick: 4,
  revenueMultiplier: 1,
  costMultiplier: 1,
  lastTickProfit: {
    revenue: 0,
    operatingCost: 0,
    netProfit: 0,
  },
});