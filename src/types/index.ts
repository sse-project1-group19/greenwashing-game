export interface Upgrade {
  id: number,
  name: string,
  description: string,
  cost: number,
  isGreenwashing?: boolean,
  moneyPerTick?: number,
  pollutionPerTick?: number,
  negationPerTick?: number,
  realWorldLink?: {
    company: string,
    incident: string
  }

}
export type GameStatus = 'not_started' | 'playing' | 'lost';

interface GameState {
  money: number,
  ownedUpgrades: Upgrade[],
  baseMoneyPerTick: number,
  pollution: number,
  tick: number;
  perception: number;
  gameState: GameStatus;
  currentTickClicks: number;
  totalClicks: number;
}

export type { Upgrade, GameState };
