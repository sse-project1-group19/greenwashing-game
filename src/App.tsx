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

export { };
