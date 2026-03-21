import type { GameState } from '../types/index';

export const createInitialGameState = (): GameState => ({
  money: 0,
  ownedUpgrades: [],
  baseMoneyPerTick: 1,
  pollution: 0,
  turn: 0,
  perception: 100,
  gameState: 'not_started',
});