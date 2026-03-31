import { create } from 'zustand';
import { createInitialGameState } from '../data/initialState';
import type { GameState, Upgrade } from '../types/index';

export const calculateMoneyPerSecond = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, upgrade) => sum + (upgrade.moneyPerSecond ?? 0), 0);

export const calculateMoneyPerClick = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, upgrade) => sum + (upgrade.moneyPerClick ?? 0), 0);

export const calculatePollutionPerSecond = (upgrades: Upgrade[]): number =>
  upgrades.reduce((sum, upgrade) => sum + (upgrade.pollutionPerSecond ?? 0), 0);

interface ProcessTickPayload {
  passiveMoneyDelta: number;
  pollutionDelta: number;
}

interface GameStore {
  gameState: GameState;
  startNewGame: () => void;
  resetGame: () => void;
  registerClick: () => void;
  processTick: (payload: ProcessTickPayload) => void;
  addPerception: (amount: number) => void;
  buyUpgrade: (upgrade: Upgrade) => boolean;
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

  processTick: ({ passiveMoneyDelta, pollutionDelta }) => {
    set((state) => {
      if (state.gameState.gameState !== 'playing') {
        return state;
      }

      const clickValue = 1 + calculateMoneyPerClick(state.gameState.ownedUpgrades);
      const clickMoney = state.gameState.currentTickClicks * clickValue;

      return {
        gameState: {
          ...state.gameState,
          tick: state.gameState.tick + 1,
          money: state.gameState.money + passiveMoneyDelta + clickMoney,
          pollution: state.gameState.pollution + pollutionDelta,
          currentTickClicks: 0,
        },
      };
    });
  },

  addPerception: (amount: number) => {
    set((state) => {
      const newPerception = state.gameState.perceptionCurrent + amount;
      return {
        gameState: {
          ...state.gameState,
          perception: newPerception,
          gameState:
            newPerception <= 0 && state.gameState.gameState === 'playing'
              ? 'lost'
              : state.gameState.gameState,
        },
      };
    });
  },

  buyUpgrade: (upgrade: Upgrade) => {
    let wasPurchased = false;

    set((state) => {
      const isAlreadyOwned = state.gameState.ownedUpgrades.some((owned) => owned.id === upgrade.id);
      if (isAlreadyOwned || state.gameState.money < upgrade.cost) {
        return state;
      }

      const newPerception = state.gameState.perception + (upgrade.perceptionImpact ?? 0);
      wasPurchased = true;

      return {
        gameState: {
          ...state.gameState,
          money: state.gameState.money - upgrade.cost,
          perceptionMax: newPerception,
          perceptionCurrent: newPerception, // Assume buying an upgrade immediately boosts perception to the new max
          gameState: newPerception <= 0 && state.gameState.gameState === 'playing' ? 'lost' : state.gameState.gameState,
          ownedUpgrades: [...state.gameState.ownedUpgrades, upgrade],
        },
      };
    });

    return wasPurchased;
  },
}));