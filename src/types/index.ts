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
  pollution: number,
  turn: number,
  perception: number,
  gameState: 'playing' | 'won' | 'lost'
}

export type { Upgrade, GameState };