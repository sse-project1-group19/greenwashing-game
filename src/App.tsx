import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useGameEngine } from './engine/gameEngine';
import { UPGRADES } from './data/upgrades';
import { calculateMoneyPerTick, calculatePollutionPerTick, useGameStore } from './store/gameStore';
import type { Upgrade } from './types';

const formatMoney = (value: number): string => `$${value.toFixed(2)}`;

function App() {
  const { processTurn } = useGameEngine();
  const [isUpgradesModalOpen, setIsUpgradesModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<Upgrade | null>(null);

  const gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  const handleBuy = (upgrade: Upgrade) => {
    buyUpgrade(upgrade);
    setActiveNotification(upgrade);
  };

  const renderUpgradeCard = (upgrade: Upgrade) => {
    const isOwned = gameState.ownedUpgrades.some((owned) => owned.id === upgrade.id);
    const canAfford = gameState.money >= upgrade.cost;

    return (
      <div key={upgrade.id} className="flex flex-col justify-between rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-lg">
        <div>
          <h3 className="mb-1 text-lg font-bold">{upgrade.name}</h3>
          <p className="mb-3 text-sm text-slate-400">{upgrade.description}</p>
        </div>
        <div>
          <div className="mb-4 space-y-1 text-sm font-medium">
            <p className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Price</span>
              <span className={canAfford && !isOwned ? 'text-white' : 'text-slate-500'}>${upgrade.cost}</span>
            </p>
            {upgrade.moneyPerTick ? (
              <p className="flex justify-between border-b border-slate-800 pb-1 pt-1">
                <span className="text-slate-400">Money</span>
                <span className="text-emerald-400">+${upgrade.moneyPerTick}/tick</span>
              </p>
            ) : null}
            {upgrade.perceptionImpact ? (
              <p className="flex justify-between pt-1">
                <span className="text-slate-400">Perception</span>
                <span className="text-amber-400">+{upgrade.perceptionImpact}% instantly</span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={isOwned || !canAfford}
            onClick={() => handleBuy(upgrade)}
            className={`w-full rounded px-4 py-3 text-sm font-bold transition-all ${
              isOwned
                ? 'cursor-default bg-emerald-900/30 text-emerald-500 ring-1 ring-inset ring-emerald-500/20'
                : canAfford
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 hover:scale-[1.02] hover:bg-emerald-400 hover:shadow-lg'
                  : 'cursor-not-allowed bg-slate-800 text-slate-500'
            }`}
          >
            {isOwned ? 'Acquired' : 'Launch Initiative'}
          </button>
        </div>
      </div>
    );
  };

  const moneyPerTick = gameState.baseMoneyPerTick + calculateMoneyPerTick(gameState.ownedUpgrades);
  const pollutionPerTick = calculatePollutionPerTick(gameState.ownedUpgrades);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6">
        <header className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-dark">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-400">Carbon Clicker</p>
          <h1 className="mb-3 text-4xl font-bold text-gradient-amber">Game State Debug</h1>
          <p className="max-w-3xl text-slate-300">
            Debug view for the new game state model. Upgrades drive money and pollution per tick via the game engine.
          </p>
          <Link className="mt-4 inline-block text-sm font-semibold text-amber-400 underline" to="/">
            Go to Game Page
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Game status" value={gameState.gameState} />
          <StatCard label="Turn" value={String(gameState.turn)} />
          <StatCard label="Money" value={formatMoney(gameState.money)} accent="profit" />
          <StatCard label="Money / tick" value={formatMoney(moneyPerTick)} accent="profit" />
          <StatCard
            label="Pollution"
            value={String(pollutionPerTick)}
            accent={pollutionPerTick > 0 ? 'danger' : 'profit'}
          />
          <StatCard label="Perception" value={`${gameState.perception}%`} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Controls</h2>
            <div className="flex flex-wrap gap-4">
              <ActionButton onClick={startNewGame}>Start new game</ActionButton>
              <ActionButton onClick={processTurn}>Earn Money (Click!)</ActionButton>
              <ActionButton onClick={() => setIsUpgradesModalOpen(true)}>Upgrades Store</ActionButton>
              <ActionButton onClick={resetGame} variant="secondary">Reset</ActionButton>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Owned upgrades</h2>
            {gameState.ownedUpgrades.length === 0 ? (
              <p className="text-sm text-slate-400">No upgrades purchased yet.</p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-300">
                {gameState.ownedUpgrades.map((upgrade) => (
                  <li key={upgrade.id} className="flex justify-between rounded-lg bg-slate-900 px-3 py-2">
                    <span>{upgrade.name}</span>
                    <span className="text-emerald-400">+${upgrade.moneyPerTick ?? 0}/tick</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h2 className="mb-4 text-xl font-semibold">Current state snapshot</h2>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-200">
            {JSON.stringify(gameState, null, 2)}
          </pre>
        </section>
      </div>

      {isUpgradesModalOpen && (
        <div className="fixed inset-0 z-40 flex animate-fadeIn items-center justify-center bg-slate-950/80 p-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gradient-amber">Corporate Initiatives (Upgrades)</h2>
              <button
                onClick={() => setIsUpgradesModalOpen(false)}
                className="transition-colors hover:text-white text-slate-400"
              >
                X Close
              </button>
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex-1">
                <h3 className="mb-4 border-b border-emerald-900/50 pb-2 text-xl font-semibold text-emerald-400">
                  Revenue Initiatives (Production)
                </h3>
                <div className="grid gap-4 xl:grid-cols-2">
                  {UPGRADES.filter((upgrade) => upgrade.category === 'production').map(renderUpgradeCard)}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="mb-4 border-b border-amber-900/50 pb-2 text-xl font-semibold text-amber-400">
                  Damage Control (PR)
                </h3>
                <div className="grid gap-4 xl:grid-cols-2">
                  {UPGRADES.filter((upgrade) => upgrade.category === 'perception').map(renderUpgradeCard)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeNotification && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-lg rounded-xl border border-rose-500/30 bg-slate-800 p-6 shadow-[0_0_50px_-10px_rgba(244,63,94,0.3)]">
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-rose-400">
              <span className="text-3xl">!</span> Greenwashing Alert
            </h2>
            <p className="mb-6 text-lg leading-relaxed tracking-wide text-white">
              {activeNotification.educationalMessage}
            </p>
            <div className="mb-8 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm shadow-inner">
              <p className="mb-3 text-slate-300">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Real-World Case</span>
                {activeNotification.realWorldEvidence}
              </p>
              <p className="text-xs italic text-slate-500">
                Source:{' '}
                <a
                  href={activeNotification.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  {activeNotification.source}
                </a>
              </p>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="w-full rounded-xl bg-slate-700 py-3 font-bold text-white transition-colors hover:bg-slate-600 focus:ring-4 focus:ring-slate-500/50"
            >
              Continue Playing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  accent?: 'profit' | 'danger';
};

function StatCard({ label, value, accent }: StatCardProps) {
  const valueClassName =
    accent === 'profit' ? 'text-emerald-400' : accent === 'danger' ? 'text-rose-400' : 'text-white';

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <p className="mb-2 text-sm text-slate-400">{label}</p>
      <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}

type ActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

function ActionButton({ children, onClick, variant = 'primary' }: ActionButtonProps) {
  const className =
    variant === 'primary'
      ? 'border-2 border-emerald-300 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40'
      : 'border-2 border-amber-200 bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 hover:scale-[1.02] hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-200/40';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-[52px] items-center justify-center rounded-xl px-6 py-3 text-base font-extrabold tracking-wide transition-all duration-150 ${className}`}
    >
      {children}
    </button>
  );
}

export default App;

