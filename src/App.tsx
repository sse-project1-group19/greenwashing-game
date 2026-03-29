import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from './store/gameStore';
import { useGameEngine } from './engine/gameEngine';
import { UPGRADES } from './data/upgrades';
import { useState } from 'react';
import type { Upgrade } from './types/index';

const formatMoney = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

function App() {
  const [activeNotification, setActiveNotification] = useState<Upgrade | null>(null);
  const [isUpgradesDropdownOpen, setIsUpgradesDropdownOpen] = useState(false);
  const [clickAnim, setClickAnim] = useState(false);

  var gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  const { processTurn } = useGameEngine();

  const moneyPerTick = gameState.baseMoneyPerTick + calculateMoneyPerTick(gameState.ownedUpgrades);
  const pollutionPerTick = calculatePollutionPerTick(gameState.ownedUpgrades);

  const productionUpgrades = UPGRADES.filter(u => u.category === 'production');
  const perceptionUpgrades = UPGRADES.filter(u => u.category === 'perception');

  const handleClick = () => {
    const newGameState = processTurn(gameState);
    if (newGameState) {
      gameState = newGameState;
    }
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 400);
  };

  const handleBuy = (u: Upgrade) => {
    buyUpgrade(u);
    setActiveNotification(u);
  };

  // Start screen
  if (gameState.gameState === 'not_started') {
    return (
      <div className="min-h-screen flex items-center justify-center start-bg">
        <div className="text-center max-w-xl px-6 animate-fadeIn">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-4">// SYSTEM BOOT v1.0</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className="glow-green">CARBON</span>
              <span className="text-[var(--text-muted)]">_</span>
              <span className="text-[var(--text-primary)]">TERMINAL</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-amber)] mt-2">
              Greenwashing Simulator
            </p>
          </div>
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed text-sm">
            You are the CEO of a global tech corporation. Maximize profit.
            Manage public perception. Hide your environmental crimes.
            How long can you keep the truth buried?
          </p>
          <button
            onClick={startNewGame}
            className="px-10 py-4 border-2 border-[var(--accent-green)] text-[var(--accent-green)] bg-transparent hover:bg-[var(--accent-green)] hover:text-[var(--primary-bg)] transition-all duration-200 uppercase tracking-[0.2em] text-sm font-bold"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Initialize System
          </button>
          <p className="text-[var(--text-muted)] text-xs mt-6 uppercase tracking-wider">
            Press to begin simulation
          </p>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameState.gameState === 'lost') {
    return (
      <div className="min-h-screen flex items-center justify-center game-over-overlay">
        <div className="text-center max-w-xl px-6 animate-fadeIn">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-red)] mb-4">// SYSTEM FAILURE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-red" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            TERMINAL_SHUTDOWN
          </h1>
          <p className="text-[var(--text-secondary)] mb-4 text-sm">
            Public perception collapsed. Your greenwashing was exposed.
          </p>
          <div className="terminal-panel rounded-lg p-4 mb-8 text-left text-xs text-[var(--text-secondary)]">
            <p>{'>'} Final Revenue: {formatMoney(gameState.money)}</p>
            <p>{'>'} Turns Survived: {gameState.turn}</p>
            <p>{'>'} Total Pollution: {gameState.pollution.toFixed(0)} units</p>
            <p>{'>'} Upgrades Acquired: {gameState.ownedUpgrades.length}</p>
            <p className="text-[var(--accent-red)] mt-2">{'>'} STATUS: EXPOSED</p>
          </div>
          <button
            onClick={() => { resetGame(); startNewGame(); }}
            className="px-10 py-4 border-2 border-[var(--accent-green)] text-[var(--accent-green)] bg-transparent hover:bg-[var(--accent-green)] hover:text-[var(--primary-bg)] transition-all duration-200 uppercase tracking-[0.2em] text-sm font-bold"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Reboot System
          </button>
        </div>
      </div>
    );
  }

  // Main game UI
  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-bg)]">
      {/* ═══ TOP BAR ═══ */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--secondary-bg)]">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold uppercase tracking-[0.15em]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="glow-green">Carbon</span>
            <span className="text-[var(--text-muted)]">_</span>
            <span className="text-[var(--text-primary)]">Terminal</span>
            <span className="text-[var(--text-muted)] text-xs ml-2">v1</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Upgrades dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUpgradesDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-5 py-2 border border-[var(--accent-teal)] text-[var(--accent-teal)] rounded text-sm uppercase tracking-wider hover:bg-[var(--accent-teal)] hover:text-[var(--primary-bg)] transition-all"
            >
              <span>{'⚡'}</span> Upgrades <span className="ml-1">{isUpgradesDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {isUpgradesDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsUpgradesDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-40 w-80 max-h-[70vh] overflow-y-auto terminal-panel rounded-lg p-3 animate-slideUp">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2 px-1">Revenue Initiatives</p>
                  {productionUpgrades.map(u => {
                    const isOwned = gameState.ownedUpgrades.some(o => o.id === u.id);
                    const canAfford = gameState.money >= u.cost;
                    return (
                      <button
                        key={u.id}
                        disabled={isOwned || !canAfford}
                        onClick={() => { handleBuy(u); setIsUpgradesDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded mb-1 text-xs transition-all flex justify-between items-center gap-2 ${isOwned
                          ? 'text-[var(--accent-green)] opacity-50 cursor-default bg-[rgba(0,229,160,0.05)]'
                          : canAfford
                            ? 'text-[var(--text-primary)] hover:bg-[rgba(0,229,160,0.1)] cursor-pointer'
                            : 'text-[var(--text-muted)] cursor-not-allowed'
                          }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold truncate">{u.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            {u.moneyPerTick ? `+$${u.moneyPerTick}/s` : ''}{u.pollutionPerTick ? ` · +${u.pollutionPerTick} poll` : ''}
                          </p>
                        </div>
                        <span className={`shrink-0 text-[10px] uppercase tracking-wider ${isOwned ? 'text-[var(--accent-green)]' : canAfford ? 'text-[var(--accent-teal)]' : 'text-[var(--text-muted)]'}`}>
                          {isOwned ? 'Owned' : formatMoney(u.cost)}
                        </span>
                      </button>
                    );
                  })}

                  <div className="my-2 border-t border-[var(--border-color)]" />
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2 px-1">Damage Control (PR)</p>
                  {perceptionUpgrades.map(u => {
                    const isOwned = gameState.ownedUpgrades.some(o => o.id === u.id);
                    const canAfford = gameState.money >= u.cost;
                    return (
                      <button
                        key={u.id}
                        disabled={isOwned || !canAfford}
                        onClick={() => { handleBuy(u); setIsUpgradesDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded mb-1 text-xs transition-all flex justify-between items-center gap-2 ${isOwned
                          ? 'text-[var(--accent-amber)] opacity-50 cursor-default bg-[rgba(240,180,41,0.05)]'
                          : canAfford
                            ? 'text-[var(--text-primary)] hover:bg-[rgba(240,180,41,0.1)] cursor-pointer'
                            : 'text-[var(--text-muted)] cursor-not-allowed'
                          }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold truncate">{u.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            +{u.perceptionImpact}% perception
                          </p>
                        </div>
                        <span className={`shrink-0 text-[10px] uppercase tracking-wider ${isOwned ? 'text-[var(--accent-amber)]' : canAfford ? 'text-[var(--accent-teal)]' : 'text-[var(--text-muted)]'}`}>
                          {isOwned ? 'Owned' : formatMoney(u.cost)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Turn counter */}
          <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
            Turn <span className="text-[var(--text-primary)] font-bold">{gameState.turn}</span>
          </div>
        </div>
      </header>

      {/* ═══ MONEY BAR ═══ */}
      <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-baseline justify-center gap-4">
        <span className="text-4xl font-bold glow-green" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {formatMoney(gameState.money)}
        </span>
        <span className="text-base text-[var(--accent-green)]">+{formatMoney(moneyPerTick)}/s</span>
      </div>

      {/* ═══ PERCEPTION & POLLUTION BAR ═══ */}
      <div className="px-5 py-4 border-b border-[var(--border-color)] flex flex-col gap-4 max-w-3xl mx-auto w-full">
        {/* Perception */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: gameState.perceptionCurrent > 50 ? 'var(--accent-green)' : gameState.perceptionCurrent > 25 ? 'var(--accent-amber)' : 'var(--accent-red)' }} />
              <span className="text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">Perception</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold glow-green" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {gameState.perceptionCurrent.toFixed(0)}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
              / {gameState.perceptionMax}
              </span>
            </div>
          </div>
          <div className="w-full h-4 rounded-full bg-[var(--tertiary-bg)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.max(gameState.perceptionCurrent, 0)}%`,
                background: gameState.perceptionCurrent > 50
                  ? 'linear-gradient(90deg, #00e5a0, #00bcd4)'
                  : gameState.perceptionCurrent > 25
                    ? 'linear-gradient(90deg, #f0b429, #ff8c00)'
                    : 'linear-gradient(90deg, #ff4757, #ff6b81)',
                boxShadow: gameState.perceptionCurrent > 50
                  ? '0 0 12px rgba(0,229,160,0.4)'
                  : gameState.perceptionCurrent > 25
                    ? '0 0 12px rgba(240,180,41,0.4)'
                    : '0 0 12px rgba(255,71,87,0.4)',
              }}
            />
          </div>
        </div>

        {/* Pollution */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-amber)]" />
              <span className="text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">Pollution</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold glow-amber" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {gameState.pollution.toFixed(0)}
              </span>
              <span className="text-xs text-[var(--accent-amber)]">
                {pollutionPerTick > 0 ? `+${pollutionPerTick}/s` : 'clean'}
              </span>
            </div>
          </div>
          <div className="w-full h-4 rounded-full bg-[var(--tertiary-bg)] overflow-hidden">
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

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(var(--accent-green) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Core click area — Building */}
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
              className="drop-shadow-[0_0_25px_rgba(0,229,160,0.3)] group-hover:drop-shadow-[0_0_35px_rgba(0,229,160,0.5)] transition-all duration-200"
            >
              {/* Building body */}
              <rect x="40" y="50" width="100" height="160" rx="4" fill="var(--panel-bg)" stroke="var(--accent-green)" strokeWidth="1.5" opacity="0.9" />
              {/* Roof / antenna */}
              <polygon points="90,8 70,50 110,50" fill="var(--panel-bg)" stroke="var(--accent-green)" strokeWidth="1.5" />
              <line x1="90" y1="0" x2="90" y2="12" stroke="var(--accent-green)" strokeWidth="2" />
              <circle cx="90" cy="4" r="3" fill="var(--accent-green)" className="animate-pulse" />
              {/* Windows row 1 */}
              <rect x="54" y="68" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.6" />
              <rect x="82" y="68" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.8" />
              <rect x="110" y="68" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.5" />
              {/* Windows row 2 */}
              <rect x="54" y="92" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.7" />
              <rect x="82" y="92" width="16" height="12" rx="1" fill="var(--accent-green)" opacity="0.9" />
              <rect x="110" y="92" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.6" />
              {/* Windows row 3 */}
              <rect x="54" y="116" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.5" />
              <rect x="82" y="116" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.7" />
              <rect x="110" y="116" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.8" />
              {/* Windows row 4 */}
              <rect x="54" y="140" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.6" />
              <rect x="82" y="140" width="16" height="12" rx="1" fill="var(--accent-teal)" opacity="0.5" />
              <rect x="110" y="140" width="16" height="12" rx="1" fill="var(--accent-green)" opacity="0.7" />
              {/* Door */}
              <rect x="76" y="172" width="28" height="38" rx="2" fill="var(--tertiary-bg)" stroke="var(--accent-green)" strokeWidth="1" />
              <circle cx="98" cy="192" r="2" fill="var(--accent-green)" />
              {/* Base */}
              <rect x="30" y="208" width="120" height="6" rx="2" fill="var(--accent-green)" opacity="0.3" />
            </svg>
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl uppercase tracking-[0.3em] text-[var(--text-primary)]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Corporate_HQ
            </h2>
            <p className="text-base text-[var(--accent-green)] mt-2 tracking-wider">
              +{formatMoney(moneyPerTick)} / click
            </p>
          </div>
        </div>

        {/* Alert banner */}
        {(gameState.perceptionCurrent < 50 || pollutionPerTick > 100) && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 alert-banner px-6 py-3 flex items-center gap-3">
            <span className="text-[var(--accent-amber)]">△</span>
            <div>
              <p className="text-xs font-bold text-[var(--accent-amber)] uppercase tracking-wider">Active Alerts</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {gameState.perceptionCurrent < 50 ? 'Perception critically low' : 'High pollution output detected'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ BOTTOM NAV ═══ */}
      <footer className="flex border-t border-[var(--border-color)]">
        <button
          className="bottom-nav-item"
          onClick={() => { resetGame(); }}
        >
          <span className="text-base mr-2">↺</span> Reset System
        </button>
      </footer>

      {/* ═══ EDUCATIONAL ALERT ═══ */}
      {activeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,14,20,0.9)] p-4 animate-fadeIn">
          <div className="w-full max-w-lg terminal-panel rounded-lg p-6 border-[var(--accent-red)] animate-slideUp">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[var(--accent-red)] text-xl">△</span>
              <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--accent-red)]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Greenwashing Alert
              </h2>
            </div>
            <p className="text-sm text-[var(--text-primary)] mb-6 leading-relaxed">
              {activeNotification.educationalMessage}
            </p>
            <div className="terminal-panel rounded p-4 mb-6 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Real-World Case</p>
              <p className="text-[var(--text-secondary)] mb-3 leading-relaxed">
                {activeNotification.realWorldEvidence}
              </p>
              <p className="text-[var(--text-muted)] italic">
                Source:{' '}
                <a href={activeNotification.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-teal)] underline hover:text-[var(--accent-green)]">
                  {activeNotification.source}
                </a>
              </p>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="w-full py-3 border border-[var(--border-color)] bg-[var(--tertiary-bg)] text-[var(--text-primary)] uppercase tracking-wider text-xs hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] transition-all"
            >
              Continue Operations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
