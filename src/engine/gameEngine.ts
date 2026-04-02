import { updatePerceptionOnTick } from "../logic/perception";
import { useCallback, useEffect } from 'react';
import {
  useGameStore,
  calculateMoneyPerSecond,
  calculatePollutionPerSecond,
} from '../store/gameStore';

const TICK_RATE_MS = 50;

export function useGameEngine() {
  const gameStatus = useGameStore((state) => state.gameState.gameState);
  const processStoredTick = useGameStore((state) => state.processTick);
  const registerStoredClick = useGameStore((state) => state.registerClick);
  const addPerception = useGameStore((state) => state.addPerception);

  const clickButton = useCallback(() => {
    const { gameState } = useGameStore.getState();

    if (gameState.gameState !== 'playing') {
      return;
    }

    registerStoredClick();
  }, [registerStoredClick]);

  useEffect(() => {
    if (gameStatus !== 'playing') {
      return;
    }

    const intervalId = window.setInterval(() => {
      const { gameState } = useGameStore.getState();

      if (gameState.gameState !== 'playing') {
        return;
      }

      const tickDurationSeconds = TICK_RATE_MS / 1000;

      const passiveMoneyPerSecond =
        gameState.baseMoneyPerSecond + calculateMoneyPerSecond(gameState.ownedUpgrades);

      const pollutionPerSecond = calculatePollutionPerSecond(gameState.ownedUpgrades);


      processStoredTick({
        passiveMoneyDelta: passiveMoneyPerSecond * tickDurationSeconds,
        pollutionDelta: pollutionPerSecond * tickDurationSeconds,
      });
    }, TICK_RATE_MS);

    const perceptionIntervalId = window.setInterval(() => {
      const { gameState } = useGameStore.getState();

      if (gameState.gameState !== 'playing') {
        return;
      }

      const perceptionChange = updatePerceptionOnTick(gameState);
      console.log(`Perception Change: ${perceptionChange}, perceptionCurrent: ${gameState.perceptionCurrent}, perceptionMax: ${gameState.perceptionMax}`);
      addPerception(perceptionChange);
    }, 1000); // Update perception every second

    return () => {
      window.clearInterval(intervalId);
      window.clearInterval(perceptionIntervalId);
    };
  }, [gameStatus, processStoredTick, addPerception]);

  return { clickButton };
}