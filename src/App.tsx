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

const formatMoney = (value: number): string => `$${value.toFixed(2)}`;

function App() {
  const { processTurn } = useGameEngine();

  const gameState = useGameStore((state) => state.gameState);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);

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
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Game status" value={gameState.gameState} />
          <StatCard label="Turn" value={String(gameState.turn)} />
          <StatCard label="Money" value={formatMoney(gameState.money)} accent="profit" />
          <StatCard label="Money / tick" value={formatMoney(moneyPerTick)} accent="profit" />
          <StatCard
            label="Pollution / tick"
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
              <ActionButton onClick={processTurn}>Next Turn</ActionButton>
              <ActionButton onClick={resetGame} variant="secondary">Reset</ActionButton>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Owned upgrades</h2>
            {gameState.ownedUpgrades.length === 0 ? (
              <p className="text-sm text-slate-400">No upgrades purchased yet.</p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-300">
                {gameState.ownedUpgrades.map((u) => (
                  <li key={u.id} className="flex justify-between rounded-lg bg-slate-900 px-3 py-2">
                    <span>{u.name}</span>
                    <span className="text-emerald-400">+${u.moneyPerTick ?? 0}/tick</span>
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
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  accent?: 'profit' | 'danger';
};

function StatCard({ label, value, accent }: StatCardProps) {
  const valueClassName = accent === 'profit'
    ? 'text-emerald-400'
    : accent === 'danger'
      ? 'text-rose-400'
      : 'text-white';

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <p className="mb-2 text-sm text-slate-400">{label}</p>
      <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
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