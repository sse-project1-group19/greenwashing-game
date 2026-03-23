interface Upgrade {
  id: number,
  name: string,
  description: string,
  cost: number,
  isGreenwashing?: boolean,
  moneyPerTick?: number,
  moneyPerClick?: number,
  pollutionPerTick?: number,
  perceptionImpact?: number,
  category?: 'production' | 'perception',
  educationalMessage?: string,
  realWorldEvidence?: string,
  source?: string,
  sourceUrl?: string,
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
  turn: number,
  perception: number,
  gameState: 'not_started' | 'playing' | 'won' | 'lost'
}

export type { Upgrade, GameState };
