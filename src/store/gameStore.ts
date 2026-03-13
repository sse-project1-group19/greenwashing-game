import { create } from "zustand";
import { GameState, Upgrade } from "../types";

interface GameStore {
  gameState: GameState,

  // Game
  startGame: () => void;
  resetGame: () => void;
  tick: () => void;

  // Upgrades
  purchaseUpgrade: (upgradeId: number, cost: number, upgrade: Upgrade) => boolean;

  // Stats
  addMoney: (amount: number) => void;
  addPollution: (amount: number) => void;
  addPerception: (amount: number) => void;

  // Save/Load
  saveGame: () => void;
  loadGame: () => void;
}

const DEFAULT_GAME_STATE: GameState = {
  money: 0,
  ownedUpgrades: [],
  pollution: 0,
  turn: 0,
  perception: 0,
  gameState: 'playing'
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: DEFAULT_GAME_STATE,

  startGame: () => set({ gameState: { ...DEFAULT_GAME_STATE } }),

  resetGame: () => set({ gameState: { ...DEFAULT_GAME_STATE } }),

  tick: () => set((state: { gameState: GameState }) => {
    const { gameState } = state;
    // game over check
    if (gameState.gameState !== 'playing') return state;

    const newState = { ...state.gameState };
    newState.turn += 1;
    // Loss condition
    if (newState.pollution >= 100) {
      newState.gameState = 'lost';
    }

    return { gameState: newState };
  }),

  purchaseUpgrade: (upgradeId: number, cost: number, upgrade: Upgrade): boolean => {
    const state = get().gameState;

    // Validate purchase
    if (state.money < cost) {
      console.warn(`Cannot afford upgrade. Need $${cost}, have $${state.money}`);
      return false;
    }

    if (state.ownedUpgrades.includes(upgrade)) {
      console.warn(`Upgrade ${upgrade.name} already owned`);
      return false;
    }

    // Apply purchase
    set((state) => ({
      gameState: {
        ...state.gameState,
        money: state.gameState.money - cost,
        ownedUpgrades: [...state.gameState.ownedUpgrades, upgrade],
      }
    }));

    return true;
  },

  addMoney: (amount: number) => set((state) => ({
    gameState: {
      ...state.gameState,
      money: state.gameState.money + amount,
    }
  })),

  addPollution: (amount: number) => set((state) => ({
    gameState: {
      ...state.gameState,
      pollution: state.gameState.pollution + amount,
    }
  })),

  addPerception: (amount: number) => set((state) => ({
    gameState: {
      ...state.gameState,
      perception: state.gameState.perception + amount,
    }
  })),

  // TODO: Implement save/load functionality using localStorage or similar
  saveGame: () => {
    const state = get().gameState;
    localStorage.setItem('gameState', JSON.stringify(state));
  },

  loadGame: () => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      set({ gameState: JSON.parse(saved) });
    }
  }
}),
);


// Helper function to calculate money per tick from upgrades
export const calculateMoneyPerTick = (ownedUpgrades: Upgrade[]): number => {
  const baseIncome = 10;
  const upgradeIncome = ownedUpgrades.reduce((total, upgrade) => {
    return total + (upgrade.moneyPerTick || 0);
  }, 0);
  return baseIncome + upgradeIncome;
};

// Helper function to calculate pollution per tick from upgrades
export const calculatePollutionPerTick = (ownedUpgrades: Upgrade[]): number => {
  const basePollution = 2;
  const upgradePollution = ownedUpgrades.reduce((total, upgrade) => {
    return total + (upgrade.pollutionPerTick || 0);
  }, 0);
  return basePollution + upgradePollution;
};
  
