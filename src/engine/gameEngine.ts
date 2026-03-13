import { useEffect } from "react";
import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from "../store/gameStore";

/**
 * Game Engine Hook
 * Handles the main game loop, including ticking and applying upgrade effects.
 */
export function useGameEngine() {
  const gamestate = useGameStore((state) => state.gameState);
  const tick = useGameStore((state) => state.tick);
  const addMoney = useGameStore((state) => state.addMoney);
  const addPollution = useGameStore((state) => state.addPollution);
  const addPerception = useGameStore((state) => state.addPerception);

  // Main game loop - runs every second
  useEffect(() => {
    // Only run the loop if the game is in 'playing' state
    if (gamestate.gameState !== 'playing') return;

    const interval = setInterval(() => {
      const moneyPerTick = calculateMoneyPerTick(gamestate.ownedUpgrades);
      const pollutionPerTick = calculatePollutionPerTick(gamestate.ownedUpgrades);

      // Update money and pollution based on upgrades
      tick();
      addMoney(moneyPerTick);
      addPollution(pollutionPerTick);
    }, 1000);

    return () => clearInterval(interval);
  }, [gamestate, tick, addMoney, addPollution]);
}