import { Upgrade } from "@/types";

// TODO: Add Real Data
export const UPGRADES: Upgrade[] = [
  {
    id: 1,
    name: "Solar Panels",
    description: "Generate clean energy",
    cost: 100,
    moneyPerTick: 5,
    pollutionPerTick: -2
  },
  {
    id: 2,
    name: "Wind Turbines",
    description: "Harness wind power",
    cost: 200,
    moneyPerTick: 10,
    pollutionPerTick: -5
  },
  {
    id: 3,
    name: "Recycling Program",
    description: "Reduce waste and promote recycling",
    cost: 150,
    moneyPerTick: 7,
    pollutionPerTick: -3
  }
];