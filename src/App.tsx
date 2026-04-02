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

const getUpgradeEffects = (upgrade: Upgrade): string => {
  const effects: string[] = [];

  if (upgrade.moneyPerSecond) effects.push(`+${formatMoney(upgrade.moneyPerSecond)}/s`);
  if (upgrade.moneyPerClick) effects.push(`+${formatMoney(upgrade.moneyPerClick)}/click`);
  if (upgrade.pollutionPerSecond) effects.push(`+${upgrade.pollutionPerSecond.toFixed(2)} poll/s`);
  if (upgrade.perceptionImpact) effects.push(`+${upgrade.perceptionImpact}% perception`);

  return effects.join(' · ') || 'No direct effect';
};

function App() {
  const { clickButton } = useGameEngine();

  var gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  const [activeNotification, setActiveNotification] = useState<Upgrade | null>(null);
  const [clickAnim, setClickAnim] = useState(false);
  const [activeView, setActiveView] = useState<View>('clicker');

  const moneyPerSecond =
    gameState.baseMoneyPerSecond + calculateMoneyPerSecond(gameState.ownedUpgrades);
  const pollutionPerSecond = calculatePollutionPerSecond(gameState.ownedUpgrades);
  const moneyPerClick = 1 + calculateMoneyPerClick(gameState.ownedUpgrades);
  const elapsedSeconds = Math.floor((gameState.tick * TICK_RATE_MS) / 1000);

  const productionUpgrades = UPGRADES.filter((u) => u.category === 'production');
  const perceptionUpgrades = UPGRADES.filter((u) => u.category === 'perception');
  const ownedUpgradeIds = useMemo(
    () => new Set(gameState.ownedUpgrades.map((upgrade) => upgrade.id)),
    [gameState.ownedUpgrades],
  );
  const ownedUpgradeCards = useMemo(
    () => UPGRADES.filter((upgrade) => ownedUpgradeIds.has(upgrade.id)),
    [ownedUpgradeIds],
  );
  const ownedProductionUpgrades = useMemo(
    () => ownedUpgradeCards.filter((upgrade) => upgrade.category === 'production'),
    [ownedUpgradeCards],
  );
  const ownedPerceptionUpgrades = useMemo(
    () => ownedUpgradeCards.filter((upgrade) => upgrade.category === 'perception'),
    [ownedUpgradeCards],
  );
  const availableProductionUpgrades = useMemo(
    () => productionUpgrades.filter((upgrade) => !ownedUpgradeIds.has(upgrade.id)),
    [ownedUpgradeIds, productionUpgrades],
  );
  const availablePerceptionUpgrades = useMemo(
    () => perceptionUpgrades.filter((upgrade) => !ownedUpgradeIds.has(upgrade.id)),
    [ownedUpgradeIds, perceptionUpgrades],
  );

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
  };

  const handleResetGame = () => {
    resetGame();
    setActiveView('clicker');
    setActiveNotification(null);
  };

  const handleClick = () => {
    clickButton();
    setClickAnim(true);
    window.setTimeout(() => setClickAnim(false), 400);
  };

  const handleBuy = (upgrade: Upgrade) => {
    const wasPurchased = buyUpgrade(upgrade);
    if (wasPurchased && upgrade.category === 'perception') {
      setActiveNotification(upgrade);
    }
  };

  if (gameState.gameState === 'not_started') {
    return (
      <div className="start-bg flex min-h-screen items-center justify-center">
        <div className="animate-fadeIn max-w-xl px-6 text-center">
          <div className="mb-8">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              {'// SYSTEM BOOT v1.0'}
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
            className="select-none border-2 border-[var(--accent-green)] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent-green)] transition-all duration-200 hover:bg-[var(--accent-green)] hover:text-[var(--primary-bg)]"
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
            {'// SYSTEM FAILURE'}
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
            className="select-none border-2 border-[var(--accent-green)] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent-green)] transition-all duration-200 hover:bg-[var(--accent-green)] hover:text-[var(--primary-bg)]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Reboot System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--primary-bg)]">
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
          <div className="text-sm uppercase tracking-wider text-[var(--text-muted)]">
            Tick <span className="font-bold text-[var(--text-primary)]">{gameState.tick}</span>
          </div>
        </div>
      </header>

      {activeView === 'clicker' ? (
        <section className="flex-1 min-h-0 overflow-hidden px-4 py-4 pb-28">
          <div className="mx-auto grid h-full min-h-0 w-full max-w-[1400px] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <article className="terminal-panel flex min-h-0 flex-col overflow-hidden rounded-lg">
              <div className="flex items-baseline justify-center gap-4 border-b border-[var(--border-color)] px-5 py-4">
                <span className="glow-green text-4xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {formatMoney(gameState.money)}
                </span>
                <span className="text-base text-[var(--accent-green)]">+{formatMoney(moneyPerSecond)}/s</span>
              </div>

              <div className="flex flex-col gap-4 border-b border-[var(--border-color)] px-5 py-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          background:
                            gameState.perceptionCurrent > 50
                              ? 'var(--accent-green)'
                              : gameState.perceptionCurrent > 25
                                ? 'var(--accent-amber)'
                                : 'var(--accent-red)',
                        }}
                      />
                      <span className="text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                        Perception
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${gameState.perceptionCurrent > 50
                          ? 'glow-green'
                          : gameState.perceptionCurrent > 25
                            ? 'glow-amber'
                            : 'glow-red'
                        }`}
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      {gameState.perceptionCurrent.toFixed(1)}/{gameState.perceptionMax.toFixed(1)}
                    </span>
                  </div>

                  <div className="h-4 w-full overflow-hidden rounded-full bg-[var(--tertiary-bg)]">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.max(gameState.perceptionMax, 0)}%`,
                        background:
                          gameState.perceptionCurrent > 50
                            ? 'linear-gradient(90deg, #00e5a0, #00bcd4)'
                            : gameState.perceptionCurrent > 25
                              ? 'linear-gradient(90deg, #f0b429, #ff8c00)'
                              : 'linear-gradient(90deg, #ff4757, #ff6b81)',
                        boxShadow:
                          gameState.perceptionCurrent > 50
                            ? '0 0 12px rgba(0,229,160,0.4)'
                            : gameState.perceptionCurrent > 25
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

              <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'radial-gradient(var(--accent-green) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                <div
                  className="relative z-10 flex select-none flex-col items-center"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <div
                    className={`hq-core group select-none ${clickAnim ? 'animate-clickPulse' : ''}`}
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
                      className="select-none text-2xl uppercase tracking-[0.3em] text-[var(--text-primary)]"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      Corporate_HQ
                    </h2>
                    <p className="mt-2 select-none text-base tracking-wider text-[var(--accent-green)]">
                      +{formatMoney(moneyPerClick)} / click
                    </p>
                    <button
                      type="button"
                      onClick={handleResetGame}
                      className="mt-4 select-none rounded border border-[var(--accent-red)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-red)] transition-all hover:bg-[rgba(255,71,87,0.12)]"
                    >
                      Reset Game
                    </button>
                  </div>
                </div>

                {(gameState.perceptionCurrent < 50 || pollutionPerSecond > 100) && (
                  <div className="alert-banner z-20 mt-4 flex w-full max-w-md items-center gap-3 px-6 py-3">
                    <span className="text-[var(--accent-amber)]">△</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                        Active Alerts
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {gameState.perceptionCurrent < 50 ? 'Perception critically low' : 'High pollution output detected'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="terminal-panel flex min-h-0 flex-col overflow-hidden rounded-lg p-4">
              <div className="mb-3 border-b border-[var(--border-color)] pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">Owned Upgrades</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Purchased and currently active</p>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                <section>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-green)]">
                    Revenue Initiatives
                  </p>
                  <div className="space-y-2">
                    {ownedProductionUpgrades.length === 0 ? (
                      <p className="rounded border border-[rgba(0,229,160,0.28)] bg-[var(--tertiary-bg)] px-3 py-3 text-xs text-[var(--text-secondary)]">
                        No revenue initiatives owned yet.
                      </p>
                    ) : (
                      ownedProductionUpgrades.map((upgrade) => (
                        <div
                          key={upgrade.id}
                          className="rounded border border-[rgba(0,229,160,0.28)] bg-[var(--tertiary-bg)] px-3 py-3"
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-[var(--text-primary)]">{upgrade.name}</p>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--accent-green)]">Revenue</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">{upgrade.description}</p>
                          <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--accent-green)]">
                            {getUpgradeEffects(upgrade)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-amber)]">
                    Damage Control (PR)
                  </p>
                  <div className="space-y-2">
                    {ownedPerceptionUpgrades.length === 0 ? (
                      <p className="rounded border border-[rgba(240,180,41,0.28)] bg-[var(--tertiary-bg)] px-3 py-3 text-xs text-[var(--text-secondary)]">
                        No damage control upgrades owned yet.
                      </p>
                    ) : (
                      ownedPerceptionUpgrades.map((upgrade) => (
                        <div
                          key={upgrade.id}
                          className="rounded border border-[rgba(240,180,41,0.3)] bg-[var(--tertiary-bg)] px-3 py-3"
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-[var(--text-primary)]">{upgrade.name}</p>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--accent-amber)]">PR</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">{upgrade.description}</p>
                          <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--accent-amber)]">
                            {getUpgradeEffects(upgrade)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </article>

            <article className="terminal-panel flex min-h-0 flex-col overflow-hidden rounded-lg p-4">
              <div className="mb-3 border-b border-[var(--border-color)] pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">Upgrade Market</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Buy upgrades to scale profit and influence</p>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">Revenue Initiatives</p>
                  <div className="space-y-2">
                    {availableProductionUpgrades.length === 0 ? (
                      <p className="rounded border border-[var(--border-color)] bg-[var(--tertiary-bg)] px-3 py-3 text-xs text-[var(--text-muted)]">
                        All production upgrades purchased.
                      </p>
                    ) : (
                      availableProductionUpgrades.map((upgrade) => {
                        const canAfford = gameState.money >= upgrade.cost;

                        return (
                          <button
                            key={upgrade.id}
                            type="button"
                            disabled={!canAfford}
                            onClick={() => handleBuy(upgrade)}
                            className={`w-full select-none rounded border px-3 py-3 text-left transition-all ${canAfford
                                ? 'cursor-pointer border-[rgba(0,229,160,0.35)] bg-[rgba(0,229,160,0.08)] hover:bg-[rgba(0,229,160,0.15)]'
                                : 'cursor-not-allowed border-[var(--border-color)] bg-[var(--tertiary-bg)] opacity-60'
                              }`}
                          >
                            <div className="mb-1 flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-[var(--text-primary)]">{upgrade.name}</p>
                              <span className="text-[10px] uppercase tracking-wider text-[var(--accent-teal)]">
                                {formatMoney(upgrade.cost)}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">{upgrade.description}</p>
                            <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--accent-green)]">
                              {getUpgradeEffects(upgrade)}
                            </p>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">Damage Control (PR)</p>
                  <div className="space-y-2">
                    {availablePerceptionUpgrades.length === 0 ? (
                      <p className="rounded border border-[var(--border-color)] bg-[var(--tertiary-bg)] px-3 py-3 text-xs text-[var(--text-muted)]">
                        All perception upgrades purchased.
                      </p>
                    ) : (
                      availablePerceptionUpgrades.map((upgrade) => {
                        const canAfford = gameState.money >= upgrade.cost;

                        return (
                          <button
                            key={upgrade.id}
                            type="button"
                            disabled={!canAfford}
                            onClick={() => handleBuy(upgrade)}
                            className={`w-full select-none rounded border px-3 py-3 text-left transition-all ${canAfford
                                ? 'cursor-pointer border-[rgba(240,180,41,0.35)] bg-[rgba(240,180,41,0.08)] hover:bg-[rgba(240,180,41,0.15)]'
                                : 'cursor-not-allowed border-[var(--border-color)] bg-[var(--tertiary-bg)] opacity-60'
                              }`}
                          >
                            <div className="mb-1 flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-[var(--text-primary)]">{upgrade.name}</p>
                              <span className="text-[10px] uppercase tracking-wider text-[var(--accent-teal)]">
                                {formatMoney(upgrade.cost)}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">{upgrade.description}</p>
                            <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--accent-amber)]">
                              {getUpgradeEffects(upgrade)}
                            </p>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      ) : (
        <section className="flex-1 min-h-0 px-4 py-6 pb-24">
          <StatsView statsItems={statsItems} />
          <div className="mx-auto mt-6 w-full max-w-3xl">
            <button
              type="button"
              onClick={handleResetGame}
              className="w-full select-none rounded border border-[var(--accent-red)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-red)] transition-all hover:bg-[rgba(255,71,87,0.12)]"
            >
              <span className="mr-2 text-base">↺</span> Reset Game
            </button>
          </div>
        </section>
      )}

      {activeView === 'clicker' && (
        <footer className="flex border-t border-[var(--border-color)] pt-2">
          <button className="bottom-nav-item !pt-5 !pb-3 select-none" onClick={handleResetGame}>
            <span className="mr-2 text-base">↺</span> Reset System
          </button>
        </footer>
      )}

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
              className="w-full select-none border border-[var(--border-color)] bg-[var(--tertiary-bg)] py-3 text-xs uppercase tracking-wider text-[var(--text-primary)] transition-all hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]"
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
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-dark sm:p-8">
      <div className="mb-8 border-b border-slate-700 pb-5">
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
              className={`text-2xl font-bold ${item.accent === 'profit'
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
      <div className="mx-auto flex max-w-6xl items-center justify-start gap-3 px-4 py-2">
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
        'inline-flex min-w-[92px] select-none flex-col items-center justify-center rounded-xl border px-3 py-2 transition-all duration-150',
        isActive
          ? 'border-emerald-300 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/20'
          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700',
      ].join(' ')}
    >
      <span className="text-xl">{children}</span>
      <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</span>
    </button>
  );
}

export default App;
