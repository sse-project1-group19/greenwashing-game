import { useGameStore } from './store/gameStore';

const formatMoney = (value: number): string => `$${value.toFixed(2)}`;

const boughtUpgradesPlaceholder = [
  { id: 1, name: 'Carbon Capture Campaign', timesBought: 2 },
  { id: 2, name: 'Sustainability Slogan Booster', timesBought: 4 },
  { id: 3, name: 'Eco-Friendly Logo Refresh', timesBought: 1 },
];

const availableUpgradesPlaceholder = [
  {
    id: 1,
    name: 'Greenwashing Social Ads',
    price: 125,
    revenuePerTick: 7,
    operatingCostPerTick: 2,
    environmentalDamagePerTick: 1,
  },
  {
    id: 2,
    name: 'Factory Throughput Optimizer',
    price: 320,
    revenuePerTick: 16,
    operatingCostPerTick: 7,
    environmentalDamagePerTick: 4,
  },
  {
    id: 3,
    name: 'Transparency Report Team',
    price: 540,
    revenuePerTick: 21,
    operatingCostPerTick: 10,
    environmentalDamagePerTick: undefined,
  },
];

function App() {
  const gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const advanceTick = useGameStore((state) => state.advanceTick);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-dark">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-400">Carbon Clicker</p>
          <h1 className="text-4xl font-bold text-gradient-amber">Three-column game view</h1>
        </header>

        <section className="grid gap-6 grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-400">Total money</p>
            <p className="mb-6 mt-2 text-5xl font-black text-emerald-400">{formatMoney(gameState.money)}</p>

            <div className="space-y-3">
              <ActionButton onClick={advanceTick}>Advance one tick</ActionButton>
              <ActionButton onClick={startNewGame} variant="secondary">Start game</ActionButton>
              <ActionButton onClick={resetGame} variant="secondary">Reset game</ActionButton>
            </div>

            <div className="mt-6 rounded-lg bg-slate-900 p-4 text-sm text-slate-300">
              <p>Game status: {gameState.gameStatus}</p>
              <p>Current tick: {gameState.tick}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Bought upgrades</h2>
            <div className="space-y-3">
              {boughtUpgradesPlaceholder.map((upgrade) => (
                <div key={upgrade.id} className="rounded-lg border border-slate-600 bg-slate-900 p-4">
                  <p className="text-lg font-semibold text-white">{upgrade.name}</p>
                  <p className="mt-1 text-sm text-slate-300">Bought: {upgrade.timesBought}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Available upgrades</h2>
            <div className="space-y-3">
              {availableUpgradesPlaceholder.map((upgrade) => (
                <div key={upgrade.id} className="rounded-lg border border-slate-600 bg-slate-900 p-4">
                  <p className="mb-2 text-lg font-semibold text-white">{upgrade.name}</p>
                  <dl className="space-y-1 text-sm text-slate-300">
                    <BreakdownRow label="Price" value={formatMoney(upgrade.price)} />
                    <BreakdownRow label="Revenue / tick" value={formatMoney(upgrade.revenuePerTick)} />
                    <BreakdownRow
                      label="Operating cost / tick"
                      value={formatMoney(upgrade.operatingCostPerTick)}
                    />
                    <BreakdownRow
                      label="Environmental damage"
                      value={
                        upgrade.environmentalDamagePerTick === undefined
                          ? 'None'
                          : String(upgrade.environmentalDamagePerTick)
                      }
                    />
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

type ActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

function ActionButton({ children, onClick, variant = 'primary' }: ActionButtonProps) {
  const className =
    variant === 'primary'
      ? 'w-full bg-emerald-500 text-slate-950 border-2 border-emerald-300 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-300/40'
      : 'w-full bg-amber-400 text-slate-950 border-2 border-amber-200 shadow-lg shadow-amber-500/30 hover:bg-amber-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-200/40';

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

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-slate-800 px-3 py-2">
      <dt>{label}</dt>
      <dd className="font-semibold text-white">{value}</dd>
    </div>
  );
}

export default App;
