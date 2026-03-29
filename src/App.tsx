import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useGameStore, calculateMoneyPerSecond, calculatePollutionPerSecond } from './store/gameStore';
import { useGameEngine } from './engine/gameEngine';
import { UPGRADES } from './data/upgrades';
import type { Upgrade } from './types/index';

type View = 'clicker' | 'stats';

const TICK_RATE_MS = 50;

const formatMoney = (value: number): string => `$${value.toFixed(2)}`;

const formatTimeInGame = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
};

function App() {
  const { clickButton } = useGameEngine();

  const gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  const [isUpgradesModalOpen, setIsUpgradesModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<Upgrade | null>(null);
  const [activeView, setActiveView] = useState<View>('clicker');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const handleBuy = (upgrade: Upgrade) => {
    const wasPurchased = buyUpgrade(upgrade);
    if (wasPurchased) {
      setActiveNotification(upgrade);
    }
  };

  const renderUpgradeCard = (upgrade: Upgrade) => {
    const isOwned = gameState.ownedUpgrades.some((owned) => owned.id === upgrade.id);
    const canAfford = gameState.money >= upgrade.cost;

    return (
      <div
        key={upgrade.id}
        className="flex flex-col justify-between rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-lg"
      >
        <div>
          <h3 className="mb-1 text-lg font-bold">{upgrade.name}</h3>
          <p className="mb-3 text-sm text-slate-400">{upgrade.description}</p>
        </div>

        <div>
          <div className="mb-4 space-y-1 text-sm font-medium">
            <p className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Price</span>
              <span className={canAfford && !isOwned ? 'text-white' : 'text-slate-500'}>
                ${upgrade.cost}
              </span>
            </p>

            {upgrade.moneyPerSecond ? (
              <p className="flex justify-between border-b border-slate-800 pb-1 pt-1">
                <span className="text-slate-400">Money</span>
                <span className="text-emerald-400">+${upgrade.moneyPerSecond}/sec</span>
              </p>
            ) : null}

            {upgrade.moneyPerClick ? (
              <p className="flex justify-between border-b border-slate-800 pb-1 pt-1">
                <span className="text-slate-400">Click value</span>
                <span className="text-emerald-400">+${upgrade.moneyPerClick}/click</span>
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

  useEffect(() => {
    if (gameState.gameState !== 'playing') {
      setElapsedSeconds(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [gameState.gameState]);

  const moneyPerSecond =
    gameState.baseMoneyPerSecond + calculateMoneyPerSecond(gameState.ownedUpgrades);
  const pollutionPerSecond = calculatePollutionPerSecond(gameState.ownedUpgrades);

const statsItems = useMemo(
  () => [
    { label: 'Total money', value: formatMoney(gameState.money), accent: 'profit' as const },
    { label: 'Money per second', value: formatMoney(moneyPerSecond), accent: 'profit' as const },
    {
      label: 'Total pollution',
      value: gameState.pollution.toFixed(2),
      accent: gameState.pollution > 0 ? ('danger' as const) : ('neutral' as const),
    },
    { label: 'Time in game', value: formatTimeInGame(elapsedSeconds), accent: 'neutral' as const },
    {
      label: 'Upgrades purchased',
      value: String(gameState.ownedUpgrades.length),
      accent: 'neutral' as const,
    },
    {
      label: 'Times Clicker is clicked',
      value: String(gameState.totalClicks),
      accent: 'neutral' as const,
    },
  ],
  [
    elapsedSeconds,
    gameState.money,
    gameState.ownedUpgrades.length,
    gameState.pollution,
    gameState.totalClicks,
    moneyPerSecond,
  ],
);

  const handleStartNewGame = () => {
    startNewGame();
    setElapsedSeconds(0);
    setActiveView('clicker');
  };

  const handleResetGame = () => {
    resetGame();
    setElapsedSeconds(0);
    setActiveView('clicker');
    setIsUpgradesModalOpen(false);
    setActiveNotification(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6 pb-28">
        <header className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-dark">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-400">Carbon Clicker</p>
          <h1 className="mb-3 text-4xl font-bold text-gradient-amber">Game State Debug</h1>
          <p className="max-w-3xl text-slate-300">
            Debug view for the new game state model. Upgrades drive money and pollution per second via the game engine.
          </p>
        </header>

        {activeView === 'clicker' ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard label="Game status" value={gameState.gameState} />
              <StatCard label="Game tick" value={String(gameState.tick)} />
              <StatCard label="Money" value={formatMoney(gameState.money)} accent="profit" />
              <StatCard label="Passive money / sec" value={formatMoney(moneyPerSecond)} accent="profit" />
              <StatCard
                label="Pollution / sec"
                value={pollutionPerSecond.toFixed(2)}
                accent={pollutionPerSecond > 0 ? 'danger' : 'neutral'}
              />
              <StatCard label="Perception" value={`${gameState.perception}%`} />
              <StatCard label="Clicks this tick" value={String(gameState.currentTickClicks)} />
              <StatCard label="Total clicks" value={String(gameState.totalClicks)} />
              <StatCard label="Tick rate" value={`${(1000 / TICK_RATE_MS).toFixed(1)}/sec`} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h2 className="mb-4 text-xl font-semibold">Controls</h2>
                <div className="flex flex-wrap gap-4">
                  <ActionButton onClick={handleStartNewGame}>Start new game</ActionButton>
                  <ActionButton onClick={clickButton}>Click</ActionButton>
                  <ActionButton onClick={() => setIsUpgradesModalOpen(true)}>Upgrades Store</ActionButton>
                  <ActionButton onClick={handleResetGame} variant="secondary">
                    Reset
                  </ActionButton>
                </div>
              </div>

              <Panel title="Owned upgrades">
                {gameState.ownedUpgrades.length === 0 ? (
                  <p className="text-sm text-slate-400">No upgrades purchased yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm text-slate-300">
                    {gameState.ownedUpgrades.map((upgrade) => (
                      <li
                        key={upgrade.id}
                        className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2"
                      >
                        <span>{upgrade.name}</span>
                        <span className="text-emerald-400">
                          +${upgrade.moneyPerSecond ?? 0}/sec
                          {(upgrade.moneyPerClick ?? 0) > 0 ? `, +$${upgrade.moneyPerClick}/click` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </section>

            <Panel title="Current state snapshot">
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200">
                {JSON.stringify(gameState, null, 2)}
              </pre>
            </Panel>

            {isUpgradesModalOpen && (
              <div className="fixed inset-0 z-40 flex animate-fadeIn items-center justify-center bg-slate-950/80 p-4">
                <div className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gradient-amber">Corporate Initiatives (Upgrades)</h2>
                    <button
                      onClick={() => setIsUpgradesModalOpen(false)}
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-1">
                      <h3 className="mb-4 border-b border-emerald-900/50 pb-2 text-xl font-semibold text-emerald-400">
                        Revenue Initiatives (Production)
                      </h3>
                      <div className="grid gap-4 xl:grid-cols-2">
                        {UPGRADES.filter((u) => u.category === 'production').map(renderUpgradeCard)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-4 border-b border-amber-900/50 pb-2 text-xl font-semibold text-amber-400">
                        Damage Control (PR)
                      </h3>
                      <div className="grid gap-4 xl:grid-cols-2">
                        {UPGRADES.filter((u) => u.category === 'perception').map(renderUpgradeCard)}
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
                    <span className="text-3xl">⚠️</span> Greenwashing Alert!
                  </h2>

                  <p className="mb-6 text-lg leading-relaxed tracking-wide text-white">
                    {activeNotification.educationalMessage}
                  </p>

                  <div className="mb-8 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm shadow-inner">
                    <p className="mb-3 text-slate-300">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Real-World Case
                      </span>
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
          </>
        ) : (
          <StatsView statsItems={statsItems} />
        )}
      </div>

      <BottomNavigation activeView={activeView} onChangeView={setActiveView} />
    </div>
  );
}

type StatsViewProps = {
  statsItems: Array<{
    label: string;
    value: string;
    accent: 'profit' | 'danger' | 'neutral';
  }>;
};

function StatsView({ statsItems }: StatsViewProps) {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-dark">
      <div className="mb-6 border-b border-slate-700 pb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Statistics</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Tracked totals</h2>
      </div>

      <div className="space-y-4">
        {statsItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-base font-medium text-slate-300">{item.label}</span>
            <span
              className={`text-2xl font-bold ${
                item.accent === 'profit'
                  ? 'text-emerald-400'
                  : item.accent === 'danger'
                    ? 'text-rose-400'
                    : 'text-white'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

type BottomNavigationProps = {
  activeView: View;
  onChangeView: (view: View) => void;
};

function BottomNavigation({ activeView, onChangeView }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-700 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-start gap-3 px-6 py-4">
        <NavButton
          label="Clicker"
          isActive={activeView === 'clicker'}
          onClick={() => onChangeView('clicker')}
        >
          🖱️
        </NavButton>
        <NavButton
          label="Stats"
          isActive={activeView === 'stats'}
          onClick={() => onChangeView('stats')}
        >
          📊
        </NavButton>
      </div>
    </nav>
  );
}

type NavButtonProps = {
  children: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function NavButton({ children, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex min-w-[110px] flex-col items-center justify-center rounded-2xl border px-5 py-3 transition-all duration-150',
        isActive
          ? 'border-emerald-300 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/20'
          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700',
      ].join(' ')}
    >
      <span className="text-2xl">{children}</span>
      <span className="mt-1 text-sm font-semibold uppercase tracking-[0.18em]">{label}</span>
    </button>
  );
}

type PanelProps = {
  title: string;
  children: ReactNode;
};

function Panel({ title, children }: PanelProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-dark">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  accent?: 'profit' | 'danger' | 'neutral';
};

function StatCard({ label, value, accent = 'neutral' }: StatCardProps) {
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
      ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-300 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-300/40'
      : 'bg-amber-400 text-slate-950 border-2 border-amber-200 shadow-lg shadow-amber-500/30 hover:bg-amber-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-200/40';

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