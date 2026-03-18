interface Upgrade {
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

interface GameState {
  money: number,
  ownedUpgrades: Upgrade[],
  baseMoneyPerTick: number,
  pollution: number,
  turn: number,
  perception: number,
  gameState: 'not_started' | 'playing' | 'won' | 'lost'
}

export type { Upgrade, GameState };