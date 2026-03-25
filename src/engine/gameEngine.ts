import { useCallback, useEffect } from "react";
import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from "../store/gameStore";

/**
 * Game Engine Hook
 * Automatically ticks the game every 1 second while in 'playing' state.
 */
export function useGameEngine() {
  const gamestate = useGameStore((state) => state.gameState);
  const tick = useGameStore((state) => state.tick);
  const addMoney = useGameStore((state) => state.addMoney);
  const addPollution = useGameStore((state) => state.addPollution);

  const processTurn = useCallback(() => {
    if (gamestate.gameState !== 'playing') return;

    const moneyPerTick = gamestate.baseMoneyPerTick + calculateMoneyPerTick(gamestate.ownedUpgrades);
    const pollutionPerTick = calculatePollutionPerTick(gamestate.ownedUpgrades);

    tick();
    addMoney(moneyPerTick);
    addPollution(pollutionPerTick);
  }, [gamestate, tick, addMoney, addPollution]);

  useEffect(() => {
    if (gamestate.gameState !== 'playing') return;

    const interval = setInterval(processTurn, 1000);

    return () => clearInterval(interval);
  }, [gamestate.gameState, processTurn]);

  return { processTurn };
}