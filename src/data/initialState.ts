import type { GameState } from '../types/index';

export const createInitialGameState = (): GameState => ({
  money: 500,
  ownedUpgrades: [],
  baseMoneyPerSecond: 1,
  pollution: 0,
  tick: 0,
  perceptionMax: 100,
  perceptionCurrent: 100,
  gameState: 'not_started',
  currentTickClicks: 0,
  totalClicks: 0,
});
