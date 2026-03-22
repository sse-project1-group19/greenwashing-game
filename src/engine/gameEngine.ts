import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from '../store/gameStore';

/**
 * Game Engine Hook
 * Returns a processTurn function to be called when the Next Turn button is clicked.
 */

export function useGameEngine() {
  const gameState = useGameStore((state) => state.gameState);
  const processStoredTick = useGameStore((state) => state.processTick);
  const registerStoredClick = useGameStore((state) => state.registerClick);

  const processTick = () => {
    if (gameState.gameState !== 'playing') {
      return;
    }

    const passiveMoney = gameState.baseMoneyPerTick + calculateMoneyPerTick(gameState.ownedUpgrades);
    const pollutionDelta = calculatePollutionPerTick(gameState.ownedUpgrades);

    processStoredTick({ passiveMoney, pollutionDelta });
  };

  const clickButton = () => {
    registerStoredClick();
  };

  return { processTick, clickButton };
}