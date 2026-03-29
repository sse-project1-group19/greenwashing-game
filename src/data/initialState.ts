import type { GameState } from '../types/index';

export const createInitialGameState = (): GameState => ({
  money: 0,
  ownedUpgrades: [],
  baseMoneyPerSecond: 1,
  pollution: 0,
  tick: 0,
  perception: 100,
  gameState: 'not_started',
  currentTickClicks: 0,
  totalClicks: 0,
});
