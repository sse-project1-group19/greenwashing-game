import type { GameState, TickProfitBreakdown } from '../types/index';

const roundToTwoDecimals = (value: number): number => Math.round(value * 100) / 100;

export const calculateTickProfit = (gameState: GameState): TickProfitBreakdown => {
  const revenue = roundToTwoDecimals(gameState.baseRevenuePerTick * gameState.revenueMultiplier);
  const operatingCost = roundToTwoDecimals(
    gameState.baseOperatingCostPerTick * gameState.costMultiplier,
  );
  const netProfit = roundToTwoDecimals(revenue - operatingCost);

  return {
    revenue,
    operatingCost,
    netProfit,
  };
};

export const applyTickProfit = (gameState: GameState): GameState => {
  const lastTickProfit = calculateTickProfit(gameState);

  return {
    ...gameState,
    tick: gameState.tick + 1,
    money: roundToTwoDecimals(gameState.money + lastTickProfit.netProfit),
    lastTickProfit,
  };
};