import { useMemo, useState, type ReactNode } from 'react';
import {
  useGameStore,
  calculateMoneyPerSecond,
  calculatePollutionPerSecond,
  calculateMoneyPerClick,
} from './store/gameStore';
import { useGameEngine } from './engine/gameEngine';
import { UPGRADES } from './data/upgrades';
import type { Upgrade } from './types/index';

type View = 'clicker' | 'stats';

const TICK_RATE_MS = 50;

const formatMoney = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

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

  const [activeNotification, setActiveNotification] = useState<Upgrade | null>(null);
  const [isUpgradesDropdownOpen, setIsUpgradesDropdownOpen] = useState(false);
  const [clickAnim, setClickAnim] = useState(false);
  const [activeView, setActiveView] = useState<View>('clicker');

  const moneyPerSecond =
    gameState.baseMoneyPerSecond + calculateMoneyPerSecond(gameState.ownedUpgrades);
  const pollutionPerSecond = calculatePollutionPerSecond(gameState.ownedUpgrades);
  const moneyPerClick = 1 + calculateMoneyPerClick(gameState.ownedUpgrades);
  const elapsedSeconds = Math.floor((gameState.tick * TICK_RATE_MS) / 1000);

  const productionUpgrades = UPGRADES.filter((u) => u.category === 'production');
  const perceptionUpgrades = UPGRADES.filter((u) => u.category === 'perception');

  const statsItems = useMemo(
    () => [
      { label: 'Total money', value: formatMoney(gameState.money), accent: 'profit' as const },
      { label: 'Money per second', value: formatMoney(moneyPerSecond), accent: 'profit' as const },
      { label: 'Money per click', value: formatMoney(moneyPerClick), accent: 'profit' as const },
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
      moneyPerClick,
    ],
  );

  const handleStartNewGame = () => {
    startNewGame();
    setActiveView('clicker');
    setActiveNotification(null);
    setIsUpgradesDropdownOpen(false);
  };

  const handleResetGame = () => {
    resetGame();
    setActiveView('clicker');
    setActiveNotification(null);
    setIsUpgradesDropdownOpen(false);
  };

  const handleClick = () => {
    clickButton();
    setClickAnim(true);
    window.setTimeout(() => setClickAnim(false), 400);
  };

  const handleBuy = (upgrade: Upgrade) => {
    const wasPurchased = buyUpgrade(upgrade);
    if (wasPurchased) {
      setActiveNotification(upgrade);
    }
  };

  if (gameState.gameState === 'not_started') {
    return (
      <div className="start-bg flex min-h-screen items-center justify-center">
        <div className="animate-fadeIn max-w-xl px-6 text-center">
          <div className="mb-8">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              // SYSTEM BOOT v1.0
            </p>
            <h1 className="mb-2 text-4xl font-bold md:text-5xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className="glow-green">CARBON</span>
              <span className="text-[var(--text-muted)]">_</span>
              <span className="text-[var(--text-primary)]">TERMINAL</span>
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--accent-amber)]">
              Greenwashing Simulator
            </p>
          </div>

          <p className="mb-10 text-sm leading-relaxed text-[var(--text-secondary)]">
            You are the CEO of a global tech corporation. Maximize profit. Manage public perception.
            Hide your environmental crimes. How long can you keep the truth buried?
          </p>

          <button
            onClick={handleStartNewGame}
            className="border-2 border-[var(--accent-green)] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent-green)] transition-all duration-200 hover:bg-[var(--accent-green)] hover:text-[var(--primary-bg)]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Initialize System
          </button>

          <p className="mt-6 text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Press to begin simulation
          </p>
        </div>
      </div>
    );
  }

  if (gameState.gameState === 'lost') {
    return (
      <div className="game-over-overlay flex min-h-screen items-center justify-center">
        <div className="animate-fadeIn max-w-xl px-6 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent-red)]">
            // SYSTEM FAILURE
          </p>
          <h1
            className="glow-red mb-4 text-4xl font-bold md:text-5xl"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            TERMINAL_SHUTDOWN
          </h1>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Public perception collapsed. Your greenwashing was exposed.
          </p>

          <div className="terminal-panel mb-8 rounded-lg p-4 text-left text-xs text-[var(--text-secondary)]">
            <p>{'>'} Final Revenue: {formatMoney(gameState.money)}</p>
            <p>{'>'} Ticks Survived: {gameState.tick}</p>
            <p>{'>'} Time in Game: {formatTimeInGame(elapsedSeconds)}</p>
            <p>{'>'} Total Pollution: {gameState.pollution.toFixed(0)} units</p>
            <p>{'>'} Upgrades Acquired: {gameState.ownedUpgrades.length}</p>
            <p className="mt-2 text-[var(--accent-red)]">{'>'} STATUS: EXPOSED</p>
          </div>

          <button
            onClick={() => {
              resetGame();
              handleStartNewGame();
            }}
            className="border-2 border-[var(--accent-green)] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent-green)] transition-all duration-200 hover:bg-[var(--accent-green)] hover:text-[var(--primary-bg)]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Reboot System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--primary-bg)]">
      <header className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--secondary-bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold uppercase tracking-[0.15em]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="glow-green">Carbon</span>
            <span className="text-[var(--text-muted)]">_</span>
            <span className="text-[var(--text-primary)]">Terminal</span>
            <span className="ml-2 text-xs text-[var(--text-muted)]">v1</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {activeView === 'clicker' && (
            <div className="relative">
              <button
                onClick={() => setIsUpgradesDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded border border-[var(--accent-teal)] px-5 py-2 text-sm uppercase tracking-wider text-[var(--accent-teal)] transition-all hover:bg-[var(--accent-teal)] hover:text-[var(--primary-bg)]"
              >
                <span>{'⚡'}</span> Upgrades <span className="ml-1">{isUpgradesDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {isUpgradesDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsUpgradesDropdownOpen(false)} />
                  <div className="terminal-panel animate-slideUp absolute right-0 top-full z-40 mt-2 max-h-[70vh] w-80 overflow-y-auto rounded-lg p-3">
                    <p className="mb-2 px-1 text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                      Revenue Initiatives
                    </p>

                    {productionUpgrades.map((u) => {
                      const isOwned = gameState.ownedUpgrades.some((o) => o.id === u.id);
                      const canAfford = gameState.money >= u.cost;

                      return (
                        <button
                          key={u.id}
                          disabled={isOwned || !canAfford}
                          onClick={() => {
                            handleBuy(u);
                            setIsUpgradesDropdownOpen(false);
                          }}
                          className={`mb-1 flex w-full items-center justify-between gap-2 rounded px-3 py-2.5 text-left text-xs transition-all ${
                            isOwned
                              ? 'cursor-default bg-[rgba(0,229,160,0.05)] text-[var(--accent-green)] opacity-50'
                              : canAfford
                                ? 'cursor-pointer text-[var(--text-primary)] hover:bg-[rgba(0,229,160,0.1)]'
                                : 'cursor-not-allowed text-[var(--text-muted)]'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="truncate font-bold">{u.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              {u.moneyPerSecond ? `+$${u.moneyPerSecond}/s` : ''}
                              {u.pollutionPerSecond ? ` · +${u.pollutionPerSecond} poll` : ''}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-[10px] uppercase tracking-wider ${
                              isOwned
                                ? 'text-[var(--accent-green)]'
                                : canAfford
                                  ? 'text-[var(--accent-teal)]'
                                  : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {isOwned ? 'Owned' : formatMoney(u.cost)}
                          </span>
                        </button>
                      );
                    })}

                    <div className="my-2 border-t border-[var(--border-color)]" />

                    <p className="mb-2 px-1 text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                      Damage Control (PR)
                    </p>

                    {perceptionUpgrades.map((u) => {
                      const isOwned = gameState.ownedUpgrades.some((o) => o.id === u.id);
                      const canAfford = gameState.money >= u.cost;

                      return (
                        <button
                          key={u.id}
                          disabled={isOwned || !canAfford}
                          onClick={() => {
                            handleBuy(u);
                            setIsUpgradesDropdownOpen(false);
                          }}
                          className={`mb-1 flex w-full items-center justify-between gap-2 rounded px-3 py-2.5 text-left text-xs transition-all ${
                            isOwned
                              ? 'cursor-default bg-[rgba(240,180,41,0.05)] text-[var(--accent-amber)] opacity-50'
                              : canAfford
                                ? 'cursor-pointer text-[var(--text-primary)] hover:bg-[rgba(240,180,41,0.1)]'
                                : 'cursor-not-allowed text-[var(--text-muted)]'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="truncate font-bold">{u.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              +{u.perceptionImpact}% perception
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-[10px] uppercase tracking-wider ${
                              isOwned
                                ? 'text-[var(--accent-amber)]'
                                : canAfford
                                  ? 'text-[var(--accent-teal)]'
                                  : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {isOwned ? 'Owned' : formatMoney(u.cost)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-sm uppercase tracking-wider text-[var(--text-muted)]">
            Tick <span className="font-bold text-[var(--text-primary)]">{gameState.tick}</span>
          </div>
        </div>
      </header>

      {activeView === 'clicker' ? (
        <>
          <div className="flex items-baseline justify-center gap-4 border-b border-[var(--border-color)] px-5 py-4">
            <span className="glow-green text-4xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {formatMoney(gameState.money)}
            </span>
            <span className="text-base text-[var(--accent-green)]">+{formatMoney(moneyPerSecond)}/s</span>
          </div>

          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 border-b border-[var(--border-color)] px-5 py-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background:
                        gameState.perception > 50
                          ? 'var(--accent-green)'
                          : gameState.perception > 25
                            ? 'var(--accent-amber)'
                            : 'var(--accent-red)',
                    }}
                  />
                  <span className="text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                    Perception
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    gameState.perception > 50
                      ? 'glow-green'
                      : gameState.perception > 25
                        ? 'glow-amber'
                        : 'glow-red'
                  }`}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {gameState.perception.toFixed(1)}%
                </span>
              </div>

              <div className="h-4 w-full overflow-hidden rounded-full bg-[var(--tertiary-bg)]">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(gameState.perception, 0)}%`,
                    background:
                      gameState.perception > 50
                        ? 'linear-gradient(90deg, #00e5a0, #00bcd4)'
                        : gameState.perception > 25
                          ? 'linear-gradient(90deg, #f0b429, #ff8c00)'
                          : 'linear-gradient(90deg, #ff4757, #ff6b81)',
                    boxShadow:
                      gameState.perception > 50
                        ? '0 0 12px rgba(0,229,160,0.4)'
                        : gameState.perception > 25
                          ? '0 0 12px rgba(240,180,41,0.4)'
                          : '0 0 12px rgba(255,71,87,0.4)',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-amber)]" />
                  <span className="text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                    Pollution
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="glow-amber text-lg font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {gameState.pollution.toFixed(0)}
                  </span>
                  <span className="text-xs text-[var(--accent-amber)]">
                    {pollutionPerSecond > 0 ? `+${pollutionPerSecond.toFixed(2)}/s` : 'clean'}
                  </span>
                </div>
              </div>

              <div className="h-4 w-full overflow-hidden rounded-full bg-[var(--tertiary-bg)]">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min((gameState.pollution / 10000) * 100, 100)}%`,
                    background: 'linear-gradient(90deg, #f0b429, #ff4757)',
                    boxShadow: '0 0 12px rgba(240,180,41,0.4)',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(var(--accent-green) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`hq-core group ${clickAnim ? 'animate-clickPulse' : ''}`}
                onClick={handleClick}
              >
                <svg
                  width="180"
                  height="220"
                  viewBox="0 0 180 220"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_0_25px_rgba(0,229,160,0.3)] transition-all duration-200 group-hover:drop-shadow-[0_0_35px_rgba(0,229,160,0.5)]"
                >
                  <rect x="40" y="50" width="100" height="160" rx="4" fill="var(--panel-bg)" stroke="var(--accent-green)" strokeWidth="1.5" opacity="0.9" />
                  <polygon points="90,8 70,50 110,50" fill="var(--panel-bg)" stroke="var(--accent-green)" strokeWidth="1.5" />
                  <line x1="90" y1="0" x2="90" y2="12" stroke="var(--accent-green)" strokeWidth="2" />
                  <circle cx="90" cy="4" r="3" fill="var(--accent-green)" className="animate-pulse" />
                  <rect x="54" y="68" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.6" />
                  <rect x="82" y="68" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.8" />
                  <rect x="110" y="68" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.5" />
                  <rect x="54" y="92" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.7" />
                  <rect x="82" y="92" width="16" height="12" rx="1" fill="var(--accent-green)" opacity="0.9" />
                  <rect x="110" y="92" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.6" />
                  <rect x="54" y="116" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.5" />
                  <rect x="82" y="116" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.7" />
                  <rect x="110" y="116" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.8" />
                  <rect x="54" y="140" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.6" />
                  <rect x="82" y="140" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.5" />
                  <rect x="110" y="140" width="16" height="12" rx="1" fill="var(--accent-green)" opacity="0.7" />
                  <rect x="76" y="172" width="28" height="38" rx="2" fill="var(--tertiary-bg)" stroke="var(--accent-green)" strokeWidth="1" />
                  <circle cx="98" cy="192" r="2" fill="var(--accent-green)" />
                  <rect x="30" y="208" width="120" height="6" rx="2" fill="var(--accent-green)" opacity="0.3" />
                </svg>
              </div>

              <div className="mt-6 text-center">
                <h2
                  className="text-2xl uppercase tracking-[0.3em] text-[var(--text-primary)]"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  Corporate_HQ
                </h2>
                <p className="mt-2 text-base tracking-wider text-[var(--accent-green)]">
                  +{formatMoney(moneyPerClick)} / click
                </p>
              </div>
            </div>

            {(gameState.perception < 50 || pollutionPerSecond > 100) && (
              <div className="alert-banner absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 px-6 py-3">
                <span className="text-[var(--accent-amber)]">△</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                    Active Alerts
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {gameState.perception < 50 ? 'Perception critically low' : 'High pollution output detected'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <StatsView statsItems={statsItems} />
      )}

      <footer className="flex border-t border-[var(--border-color)]">
        <button className="bottom-nav-item" onClick={handleResetGame}>
          <span className="mr-2 text-base">↺</span> Reset System
        </button>
      </footer>

      <BottomNavigation activeView={activeView} onChangeView={setActiveView} />

      {activeNotification && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-[rgba(10,14,20,0.9)] p-4">
          <div className="terminal-panel animate-slideUp w-full max-w-lg rounded-lg border-[var(--accent-red)] p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="text-xl text-[var(--accent-red)]">△</span>
              <h2
                className="text-lg font-bold uppercase tracking-wider text-[var(--accent-red)]"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                Greenwashing Alert
              </h2>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-[var(--text-primary)]">
              {activeNotification.educationalMessage}
            </p>

            <div className="terminal-panel mb-6 rounded p-4 text-xs">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Real-World Case
              </p>
              <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">
                {activeNotification.realWorldEvidence}
              </p>
              <p className="italic text-[var(--text-muted)]">
                Source:{' '}
                <a
                  href={activeNotification.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-teal)] underline hover:text-[var(--accent-green)]"
                >
                  {activeNotification.source}
                </a>
              </p>
            </div>

            <button
              onClick={() => setActiveNotification(null)}
              className="w-full border border-[var(--border-color)] bg-[var(--tertiary-bg)] py-3 text-xs uppercase tracking-wider text-[var(--text-primary)] transition-all hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]"
            >
              Continue Operations
            </button>
          </div>
        </div>
      )}
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

export default App;
