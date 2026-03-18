import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from "../store/gameStore";

/**
 * Game Engine Hook
 * Returns a processTurn function to be called when the Next Turn button is clicked.
 */
export function useGameEngine() {
  const gamestate = useGameStore((state) => state.gameState);
  const tick = useGameStore((state) => state.tick);
  const addMoney = useGameStore((state) => state.addMoney);
  const addPollution = useGameStore((state) => state.addPollution);

  const processTurn = () => {
    if (gamestate.gameState !== 'playing') return;

    const moneyPerTick = gamestate.baseMoneyPerTick + calculateMoneyPerTick(gamestate.ownedUpgrades);
    const pollutionPerTick = calculatePollutionPerTick(gamestate.ownedUpgrades);

    tick();
    addMoney(moneyPerTick);
    addPollution(pollutionPerTick);
  };

  return { processTurn };
}