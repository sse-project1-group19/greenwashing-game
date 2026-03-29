import { useEffect } from "react";
import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from "../store/gameStore";
import { updatePerceptionOnTick } from "../logic/perception";
import { GameState } from "@/types/index";

/**
 * Game Engine Hook
 * Automatically ticks the game every 1 second while in 'playing' state.
 */
export function useGameEngine() {
  var gamestate = useGameStore((state) => state.gameState);
  const tick = useGameStore((state) => state.tick);
  const addMoney = useGameStore((state) => state.addMoney);
  const addPollution = useGameStore((state) => state.addPollution);
  const addPerception = useGameStore((state) => state.addPerception);

  const processTurn = (state: GameState) => {
    if (state.gameState !== 'playing') return;
    console.log(`Processing turn ${state.turn + 1}...`);

    const moneyPerTick = state.baseMoneyPerTick + calculateMoneyPerTick(state.ownedUpgrades);
    addMoney(moneyPerTick);
    const pollutionPerTick = calculatePollutionPerTick(state.ownedUpgrades);
    addPollution(pollutionPerTick);
    const perceptionDegradationPerTick = updatePerceptionOnTick(state);
    addPerception(perceptionDegradationPerTick);

    tick();
    return state;
  };

  useEffect(() => {
    if (gamestate.gameState !== 'playing') return;

    const interval = setInterval(processTurn, 1000, gamestate);

    return () => clearInterval(interval);
  }, [gamestate.gameState, gamestate.ownedUpgrades, gamestate.baseMoneyPerTick, tick, addMoney, addPollution, addPerception, processTurn, gamestate]);

  return { processTurn };
}