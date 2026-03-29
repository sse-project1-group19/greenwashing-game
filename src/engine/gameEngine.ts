import { useEffect } from "react";
import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from "../store/gameStore";
import { updatePerceptionOnTick } from "../logic/perception";
import { GameState } from "@/types/index";

/**
 * Game Engine Hook
 * Automatically ticks the game every 1 second while in 'playing' state.
 */
export function useGameEngine(gamestate: GameState) {
  const tick = useGameStore((state) => state.tick);
  const addMoney = useGameStore((state) => state.addMoney);
  const addPollution = useGameStore((state) => state.addPollution);
  const addPerception = useGameStore((state) => state.addPerception);

  const processTurn = () => {
    if (gamestate.gameState !== 'playing') return;
    console.log(`Processing turn ${gamestate.turn + 1}...`);

    const moneyPerTick = gamestate.baseMoneyPerTick + calculateMoneyPerTick(gamestate.ownedUpgrades);
    const pollutionPerTick = calculatePollutionPerTick(gamestate.ownedUpgrades);
    const perceptionDegradationPerTick = updatePerceptionOnTick(gamestate);

    tick();
    addMoney(moneyPerTick);
    addPollution(pollutionPerTick);
    addPerception(perceptionDegradationPerTick);
    return gamestate;
  };

  useEffect(() => {
    if (gamestate.gameState !== 'playing') return;

    const interval = setInterval(processTurn, 1000);

    return () => clearInterval(interval);
  }, [gamestate.gameState, gamestate.ownedUpgrades, gamestate.baseMoneyPerTick, tick, addMoney, addPollution, addPerception]);

  return { processTurn };
}