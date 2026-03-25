import { Link } from 'react-router-dom';
import { UPGRADES } from '../data/upgrades';
import { useGameEngine } from '../engine/gameEngine';
import { calculateMoneyPerTick, calculatePollutionPerTick, useGameStore } from '../store/gameStore';

const formatMoney = (value: number): string => `$${value.toFixed(2)}`;

function GamePage() {
  const { processTurn } = useGameEngine();

  const gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  const ownedMoneyPerTick = calculateMoneyPerTick(gameState.ownedUpgrades);
  const ownedPollutionPerTick = calculatePollutionPerTick(gameState.ownedUpgrades);
  const totalMoneyPerTick = gameState.baseMoneyPerTick + ownedMoneyPerTick;

  const ownedIds = new Set(gameState.ownedUpgrades.map((upgrade) => upgrade.id));
  const availableUpgrades = UPGRADES.filter((upgrade) => !ownedIds.has(upgrade.id));

  const handleBuyUpgrade = (upgradeId: number) => {
    const selectedUpgrade = UPGRADES.find((upgrade) => upgrade.id === upgradeId);
    if (!selectedUpgrade) return;
    buyUpgrade(selectedUpgrade);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 p-4" style={{ maxWidth: '1400px' }}>
        <header className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-dark">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-400">Carbon Clicker</p>
          <h1 className="mb-2 text-3xl font-bold text-gradient-amber">Corporate Control Center</h1>
          <p className="text-sm text-slate-300">
            {formatMoney(gameState.money)} | {formatMoney(totalMoneyPerTick)}/tick | Pollution +{ownedPollutionPerTick}/tick
          </p>
          <Link className="inline-block text-sm font-semibold text-amber-400 underline" style={{ marginTop: '8px' }} to="/debug">
            Open Debug View
          </Link>
        </header>

        <section
          className="grid grid-cols-3 border border-slate-700 bg-slate-800"
          style={{ minHeight: '72vh', gridTemplateColumns: '1fr 1.1fr 1fr' }}
        >
          <aside className="p-6" style={{ borderRight: '1px solid rgb(51 65 85)' }}>
            <h2 className="mb-4 text-xl font-semibold">Turn Controls</h2>
            <div className="flex items-center justify-center" style={{ minHeight: '340px' }}>
              <button
                type="button"
                onClick={processTurn}
                className="bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-300 hover:scale-[1.02]"
                style={{ width: '250px', height: '250px', borderRadius: '9999px', fontWeight: 800, fontSize: '1.25rem' }}
              >
                ADVANCE TURN
              </button>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={startNewGame}
                className="rounded-xl bg-emerald-500 px-4 py-3 font-bold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                Start New Game
              </button>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-xl bg-slate-700 px-4 py-3 font-bold text-white transition-colors hover:bg-slate-600"
              >
                Reset
              </button>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm" style={{ marginTop: '16px' }}>
              <p className="flex justify-between"><span className="text-slate-400">Money</span><span className="font-bold text-emerald-400">{formatMoney(gameState.money)}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Turn</span><span>{gameState.turn}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">State</span><span>{gameState.gameState}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Perception</span><span>{gameState.perception}%</span></p>
            </div>
          </aside>

          <main className="p-6" style={{ borderRight: '1px solid rgb(51 65 85)' }}>
            <h2 className="mb-4 text-xl font-semibold">Owned Upgrades</h2>
            <div className="mb-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-900 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Total Money / tick</p>
                <p className="text-xl font-bold text-emerald-400">{formatMoney(totalMoneyPerTick)}</p>
                <p className="text-xs text-slate-500">Base: {formatMoney(gameState.baseMoneyPerTick)} + Upgrades: {formatMoney(ownedMoneyPerTick)}</p>
              </div>
              <div className="rounded-lg bg-slate-900 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Upgrade Pollution / tick</p>
                <p className="text-xl font-bold text-rose-400">{ownedPollutionPerTick}</p>
                <p className="text-xs text-slate-500">Total pollution: {gameState.pollution}</p>
              </div>
            </div>
            {gameState.ownedUpgrades.length === 0 ? (
              <p className="rounded-lg bg-slate-900 p-4 text-sm text-slate-400">No upgrades purchased yet.</p>
            ) : (
              <div className="grid gap-3">
                {gameState.ownedUpgrades.map((upgrade) => (
                  <article key={upgrade.id} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h3 className="font-bold text-white">{upgrade.name}</h3>
                      <span className="rounded bg-slate-800 px-2 py-2 text-xs text-slate-300">{upgrade.category ?? 'misc'}</span>
                    </div>
                    <p className="mb-3 text-sm text-slate-400">{upgrade.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <p className="rounded bg-slate-800 px-2 py-1">Money/tick: <span className="font-semibold text-emerald-400">{upgrade.moneyPerTick ?? 0}</span></p>
                      <p className="rounded bg-slate-800 px-2 py-1">Pollution/tick: <span className="font-semibold text-rose-400">{upgrade.pollutionPerTick ?? 0}</span></p>
                      <p className="rounded bg-slate-800 px-2 py-1">Perception: <span className="font-semibold text-amber-400">+{upgrade.perceptionImpact ?? 0}%</span></p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          <aside className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Upgrade Store</h2>
            <p className="mb-4 text-sm text-slate-400">Buy upgrades to increase income, perception, and side effects.</p>
            {availableUpgrades.length === 0 ? (
              <p className="rounded-lg bg-slate-900 p-4 text-sm text-slate-400">All upgrades purchased.</p>
            ) : (
              <div className="grid gap-3">
                {availableUpgrades.map((upgrade) => {
                  const canAfford = gameState.money >= upgrade.cost;
                  return (
                    <article key={upgrade.id} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                      <div className="mb-1 flex items-start justify-between gap-3">
                        <h3 className="font-bold text-white">{upgrade.name}</h3>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{upgrade.category ?? 'misc'}</span>
                      </div>
                      <p className="mb-2 text-sm text-slate-400">{upgrade.description}</p>
                      <div className="mb-3 space-y-1 text-xs text-slate-300">
                        <p>Cost: <span className="font-semibold text-white">{formatMoney(upgrade.cost)}</span></p>
                        <p>Money/tick: <span className="font-semibold text-emerald-400">{upgrade.moneyPerTick ?? 0}</span></p>
                        <p>Pollution/tick: <span className="font-semibold text-rose-400">{upgrade.pollutionPerTick ?? 0}</span></p>
                        <p>Perception impact: <span className="font-semibold text-amber-400">+{upgrade.perceptionImpact ?? 0}%</span></p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        className={`w-full rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                          canAfford
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            : 'cursor-not-allowed bg-slate-700 text-slate-400'
                        }`}
                      >
                        {canAfford ? 'Buy Upgrade' : 'Not Enough Money'}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

export default GamePage;

