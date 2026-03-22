import { useEffect, useMemo, useState, type ReactNode } from 'react';
// import { useState, useEffect } from 'react';
// import { useGameStore } from './store/gameStore';
// import { useGameEngine } from './engines/gameEngine';

// function App() {
//   const gameState = useGameStore((state) => state.gameState);
//   const startNewGame = useGameStore((state) => state.startNewGame);
//   const [screen, setScreen] = useState<'start' | 'game' | 'end'>('start');

//   // Load saved game on mount
//   useEffect(() => {
//     const saved = localStorage.getItem('offsetTruth_save_1');
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         useGameStore.setState({ gameState: parsed });
//         setScreen('game');
//       } catch (e) {
//         console.error('Failed to load save:', e);
//         setScreen('start');
//       }
//     }
//   }, []);

//   // Start game engine when game screen is active
//   const GameScreenWrapper = () => {
//     useGameEngine();
//     return <GameScreen />;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-dark flex flex-col">
//       {screen === 'start' && <StartScreen onStart={() => {
//         startNewGame();
//         setScreen('game');
//       }} />}

//       {screen === 'game' && gameState.gameStatus === 'playing' && <GameScreenWrapper />}

//       {screen === 'game' && gameState.gameStatus !== 'playing' && (
//         <EndScreen status={gameState.gameStatus} onRestart={() => {
//           startNewGame();
//           setScreen('game');
//         }} />
//       )}
//     </div>
//   );
// }

// function StartScreen({ onStart }: { onStart: () => void }) {
//   return (
//     <div className="flex-1 flex flex-col items-center justify-center p-4">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-5xl font-bold mb-4 text-gradient-amber">
//           Offset the Truth
//         </h1>
//         <p className="text-xl text-slate-400 mb-8">
//           Become the CEO of the world's most profitable corporation. Hide your environmental crimes. Manage public perception. Win at any cost.
//         </p>
//         <button
//           onClick={onStart}
//           className="px-8 py-3 bg-rose-500 hover:bg-rose-600 rounded-lg font-bold text-lg transition-colors"
//         >
//           Start Game
//         </button>
//       </div>
//     </div>
//   );
// }

// function GameScreen() {
//   const gameState = useGameStore((state) => state.gameState);
//   const formatMoney = (n: number) => `$${(n / 1000).toFixed(1)}K`;

//   return (
//     <div className="flex-1 flex flex-col p-4 gap-4">
//       {/* Stats Bar */}
//       <div className="grid grid-cols-3 gap-4 bg-slate-800 p-4 rounded-lg">
//         <div className="text-center">
//           <div className="text-2xl font-bold text-emerald-400">{formatMoney(gameState.money)}</div>
//           <div className="text-sm text-slate-400">Money</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-amber-400">{gameState.publicPerception}%</div>
//           <div className="text-sm text-slate-400">Public Perception</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-rose-400">{gameState.legalRisk}%</div>
//           <div className="text-sm text-slate-400">Legal Risk</div>
//         </div>
//       </div>

//       {/* Upgrades Grid - Placeholder */}
//       <div className="flex-1 bg-slate-800 p-4 rounded-lg">
//         <h2 className="text-xl font-bold mb-4">Upgrades (Coming Soon)</h2>
//         <p className="text-slate-400">Build upgrade cards here</p>
//       </div>

//       {/* Game Log - Placeholder */}
//       <div className="bg-slate-800 p-4 rounded-lg h-32">
//         <h2 className="text-xl font-bold mb-2">Log</h2>
//         <p className="text-slate-400">Turn {gameState.turn}</p>
//       </div>
//     </div>
//   );
// }

// function EndScreen({ status, onRestart }: { status: string; onRestart: () => void }) {
//   return (
//     <div className="flex-1 flex flex-col items-center justify-center p-4">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-4xl font-bold mb-4">
//           {status === 'won' ? '🎉 You Won!' : '💀 Game Over'}
//         </h1>
//         <p className="text-xl text-slate-400 mb-8">
//           {status === 'won'
//             ? 'You successfully built a global empire while hiding your environmental crimes!'
//             : 'Your company collapsed under the weight of scandal and public backlash.'}
//         </p>
//         <button
//           onClick={onRestart}
//           className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold text-lg transition-colors"
//         >
//           Play Again
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;

import { useGameStore, calculateMoneyPerTick, calculatePollutionPerTick } from './store/gameStore';
import { useGameEngine } from './engine/gameEngine';

type View = 'clicker' | 'stats';

const TICK_RATE_MS = 250; // we can decide later how much to set it

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
  const { processTick, clickButton } = useGameEngine();

  const gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);

  const [activeView, setActiveView] = useState<View>('clicker');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (gameState.gameState !== 'playing') {
      return;
    }

    const intervalId = window.setInterval(() => {
      processTick();
    }, TICK_RATE_MS);

    return () => window.clearInterval(intervalId);
  }, [gameState.gameState, processTick]);

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

  const moneyPerTick = gameState.baseMoneyPerTick + calculateMoneyPerTick(gameState.ownedUpgrades);
  const pollutionPerTick = calculatePollutionPerTick(gameState.ownedUpgrades);

  const statsItems = useMemo(
    () => [
      { label: 'Total money', value: formatMoney(gameState.money), accent: 'profit' as const },
      {
        label: 'Total pollution',
        value: String(gameState.pollution),
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
    [elapsedSeconds, gameState.money, gameState.ownedUpgrades.length, gameState.pollution, gameState.totalClicks],
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
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-6 pb-28">
        <header className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-dark">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-400">Carbon Clicker</p>
          <h1 className="mb-3 text-4xl font-bold text-gradient-amber">Greenwashing Game</h1>
        </header>

        {activeView === 'clicker' ? (
          <ClickerView
            gameState={gameState}
            moneyPerTick={moneyPerTick}
            pollutionPerTick={pollutionPerTick}
            onStartNewGame={handleStartNewGame}
            onClickButton={clickButton}
            onReset={handleResetGame}
          />
        ) : (
          <StatsView statsItems={statsItems} />
        )}
      </div>

      <BottomNavigation activeView={activeView} onChangeView={setActiveView} />
    </div>
  );
}

type ClickerViewProps = {
  gameState: ReturnType<typeof useGameStore.getState>['gameState'];
  moneyPerTick: number;
  pollutionPerTick: number;
  onStartNewGame: () => void;
  onClickButton: () => void;
  onReset: () => void;
};

function ClickerView({
  gameState,
  moneyPerTick,
  pollutionPerTick,
  onStartNewGame,
  onClickButton,
  onReset,
}: ClickerViewProps) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Game status" value={gameState.gameState} />
        <StatCard label="Game tick" value={String(gameState.tick)} />
        <StatCard label="Perception" value={`${gameState.perception}%`} />
        <StatCard label="Money" value={formatMoney(gameState.money)} accent="profit" />
        <StatCard label="Passive money / tick" value={formatMoney(moneyPerTick)} accent="profit" />
        <StatCard
          label="Pollution / tick"
          value={String(pollutionPerTick)}
          accent={pollutionPerTick > 0 ? 'danger' : 'neutral'}
        />
        <StatCard label="Clicks this tick" value={String(gameState.currentTickClicks)} />
        <StatCard label="Total clicks" value={String(gameState.totalClicks)} />
        <StatCard label="Tick rate" value={`${(1000 / TICK_RATE_MS).toFixed(1)}/sec`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Controls">
          <div className="flex flex-wrap gap-4">
            <ActionButton onClick={onStartNewGame}>Start new game</ActionButton>
            <ActionButton onClick={onClickButton}>Click</ActionButton>
            <ActionButton onClick={onReset} variant="secondary">
              Reset
            </ActionButton>
          </div>
        </Panel>

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
                  <span className="text-emerald-400">+${upgrade.moneyPerTick ?? 0}/tick</span>
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
    </>
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
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-dark">
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
      ? 'border-2 border-emerald-300 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-300/40'
      : 'border-2 border-amber-200 bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-200/40';

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
