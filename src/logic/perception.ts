import { GameState } from "../types/index";

export const updatePerceptionOnTick = (state: GameState) => {
    var perceptionMax = state.perceptionMax;
    var turn = state.turn;
    var degradationFactor = map(turn, 0, 10000, 0.001, 0.15); // Example degradation factor
    var pollutionImpact = map(state.pollution, 0, 100000, 0, 0.1); // Example pollution impact on perception
    degradationFactor += pollutionImpact; // Increase degradation based on pollution
    var perceptionDegradation = Math.max(0, perceptionMax * degradationFactor);
    console.log(`Turn: ${turn}, Perception Max: ${perceptionMax}, Pollution Impact: ${pollutionImpact}`);
    return 0 - perceptionDegradation;
}

const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}