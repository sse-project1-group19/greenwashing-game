import { create } from 'zustand';
import { createInitialGameState } from '../data/initialState';
import type { GameState, Upgrade } from '../types/index';

// ---------------------------------------------------------------------------
// Pure helper functions – exported for use by gameEngine
// ---------------------------------------------------------------------------

export const calculateMoneyPerTick = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, u) => sum + (u.moneyPerTick ?? 0), 0);

export const calculateMoneyPerClick = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, u) => sum + (u.moneyPerClick ?? 0), 0);

export const calculatePollutionPerTick = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, u) => sum + (u.pollutionPerTick ?? 0), 0);


// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface GameStore {
  gameState: GameState;

  // Lifecycle
  startNewGame: () => void;
  resetGame: () => void;

  // Per-tick mutations (called by gameEngine)
  tick: () => void;
  addMoney: (amount: number) => void;
  addPollution: (amount: number) => void;
  addPerception: (amount: number) => void;

  // Player actions
  buyUpgrade: (upgrade: Upgrade) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameStore>((set) => ({
  gameState: createInitialGameState(),

  startNewGame: () => {
    set({ gameState: { ...createInitialGameState(), gameState: 'playing' } });
  },

  resetGame: () => {
    set({ gameState: createInitialGameState() });
  },

  tick: () => {
    set((state) => ({
      gameState: { ...state.gameState, turn: state.gameState.turn + 1 },
    }));
  },

  addMoney: (amount: number) => {
    set((state) => ({
      gameState: { ...state.gameState, money: state.gameState.money + amount },
    }));
  },

  addPollution: (amount: number) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        pollution: state.gameState.pollution + amount,
      },
    }));
  },

  addPerception: (amount: number) => {
    set((state) => {
      const newPerception = state.gameState.perception + amount;
      return {
        gameState: {
          ...state.gameState,
          perception: newPerception,
          gameState: newPerception <= 0 && state.gameState.gameState === 'playing' ? 'lost' : state.gameState.gameState,
        },
      };
    });
  },

  buyUpgrade: (upgrade: Upgrade) => {
    set((state) => {
      if (state.gameState.money < upgrade.cost) return state;
      const newPerception = state.gameState.perception + (upgrade.perceptionImpact ?? 0);
      return {
        gameState: {
          ...state.gameState,
          money: state.gameState.money - upgrade.cost,
          perception: newPerception,
          gameState: newPerception <= 0 && state.gameState.gameState === 'playing' ? 'lost' : state.gameState.gameState,
          ownedUpgrades: [...state.gameState.ownedUpgrades, upgrade],
        },
      };
    });
  },
}));