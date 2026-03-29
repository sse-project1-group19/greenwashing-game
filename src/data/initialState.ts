import type { GameState } from '../types/index';

export const createInitialGameState = (): GameState => ({
  money: 0,
  ownedUpgrades: [],
  baseMoneyPerTick: 1,
  pollution: 0,
  turn: 0,
  perceptionCurrent: 100,
  perceptionMax: 100,
  gameState: 'not_started',
});