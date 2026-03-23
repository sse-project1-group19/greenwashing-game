import { useEffect } from "react";
import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick, calculatePerceptionPerTick } from "../store/gameStore";

/**
 * Game Engine Hook
 * Automatically ticks the game every 1 second while in 'playing' state.
 */
export function useGameEngine() {
  const gamestate = useGameStore((state) => state.gameState);
  const tick = useGameStore((state) => state.tick);
  const addMoney = useGameStore((state) => state.addMoney);
  const addPollution = useGameStore((state) => state.addPollution);
  const addPerception = useGameStore((state) => state.addPerception);

  const processTurn = () => {
    if (gamestate.gameState !== 'playing') return;

    const moneyPerTick = gamestate.baseMoneyPerTick + calculateMoneyPerTick(gamestate.ownedUpgrades);
    const pollutionPerTick = calculatePollutionPerTick(gamestate.ownedUpgrades);
    const perceptionPerTick = calculatePerceptionPerTick(gamestate.ownedUpgrades);

    tick();
    addMoney(moneyPerTick);
    addPollution(pollutionPerTick);
    addPerception(perceptionPerTick);
  };

  useEffect(() => {
    if (gamestate.gameState !== 'playing') return;

    const interval = setInterval(processTurn, 1000);

    return () => clearInterval(interval);
  }, [gamestate.gameState, gamestate.ownedUpgrades, gamestate.baseMoneyPerTick, tick, addMoney, addPollution, addPerception]);

  return { processTurn };
}