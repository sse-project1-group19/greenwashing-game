import { create } from 'zustand';
import { createInitialGameState } from '../data/initialState';
import { applyTickProfit } from '../logic/profit';
import type { GameStore } from '../types/index';

export const useGameStore = create<GameStore>((set) => ({
  gameState: createInitialGameState(),

  startNewGame: () => {
    const initialState = createInitialGameState();

    set({
      gameState: {
        ...initialState,
        gameStatus: 'playing',
      },
    });
  },

  resetGame: () => {
    set({
      gameState: createInitialGameState(),
    });
  },

  setCompanyName: (companyName: string) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        companyName,
      },
    }));
  },

  advanceTick: () => {
    set((state) => {
      if (state.gameState.gameStatus !== 'playing') {
        return state;
      }

      return {
        gameState: applyTickProfit(state.gameState),
      };
    });
  },
}));