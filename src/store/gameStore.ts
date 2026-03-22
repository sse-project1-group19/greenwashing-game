import { create } from 'zustand';
import { createInitialGameState } from '../data/initialState';
import type { GameState, Upgrade } from '../types/index';

// ---------------------------------------------------------------------------
// Pure helper functions – exported for use by gameEngine
// ---------------------------------------------------------------------------

export const calculateMoneyPerTick = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, upgrade) => sum + (upgrade.moneyPerTick ?? 0), 0);

export const calculatePollutionPerTick = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, upgrade) => sum + (upgrade.pollutionPerTick ?? 0), 0);

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface ProcessTickPayload {
  passiveMoney: number;
  pollutionDelta: number;
}

interface GameStore {
  gameState: GameState;
  startNewGame: () => void;
  resetGame: () => void;
  registerClick: () => void;
  processTick: (payload: ProcessTickPayload) => void;
  addPerception: (amount: number) => void;
  buyUpgrade: (upgrade: Upgrade) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: createInitialGameState(),

  startNewGame: () => {
    set({ gameState: { ...createInitialGameState(), gameState: 'playing' } });
  },

  resetGame: () => {
    set({ gameState: createInitialGameState() });
  },

  registerClick: () => {
    set((state) => {
      if (state.gameState.gameState !== 'playing') {
        return state;
      }

      return {
        gameState: {
          ...state.gameState,
          currentTickClicks: state.gameState.currentTickClicks + 1,
          totalClicks: state.gameState.totalClicks + 1,
        },
      };
    });
  },

  processTick: ({ passiveMoney, pollutionDelta }) => {
    set((state) => {
      if (state.gameState.gameState !== 'playing') {
        return state;
      }

      const clickMoney = state.gameState.currentTickClicks;

      return {
        gameState: {
          ...state.gameState,
          tick: state.gameState.tick + 1,
          money: state.gameState.money + passiveMoney + clickMoney,
          pollution: state.gameState.pollution + pollutionDelta,
          currentTickClicks: 0,
        },
      };
    });
  },

  addPerception: (amount: number) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        perception: state.gameState.perception + amount,
      },
    }));
  },

  buyUpgrade: (upgrade: Upgrade) => {
    set((state) => {
      if (state.gameState.money < upgrade.cost) {
        return state;
      }

      return {
        gameState: {
          ...state.gameState,
          money: state.gameState.money - upgrade.cost,
          ownedUpgrades: [...state.gameState.ownedUpgrades, upgrade],
        },
      };
    });
  },
}));