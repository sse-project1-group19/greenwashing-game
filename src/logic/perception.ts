import { GameState } from "../types/index";

export const updatePerceptionOnTick = (state: GameState) => {
    var perceptionMax = state.perceptionMax;
    var turn = state.turn;
    var degradationFactor = map(turn, 0, 1000, 0.001, 0.25); // Example degradation factor
    var perceptionDegradation = Math.max(0, perceptionMax * degradationFactor);
    console.log(`Turn: ${turn}, Current perception: ${state.perceptionCurrent}, Perception Degradation: ${perceptionDegradation.toFixed(2)}, money: ${state.money}, pollution: ${state.pollution}`);
    return 0 - perceptionDegradation;
}

const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}