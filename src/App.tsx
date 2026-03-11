import { useState } from 'react';
import { Upgrade } from './types';


  // Example Upgrades
  const upgrades: Upgrade[] = [
    {
      id: 1,
      name: 'Dodgy Carbon Credits',
      description: 'Buy carbon credits from dubious sources to offset your emissions.',
      cost: 20,
      isGreenwashing: true,
      negationPerTick: 5,
      realWorldLink: {
        company: 'Company A',
        incident: 'Environmental Violation'
      }
    },
    {
      id: 2,
      name: 'Green PR Campaign',
      description: 'Launch a PR campaign to improve your company’s green image.',
      cost: 50,
      isGreenwashing: true,
      negationPerTick: 10,
      realWorldLink: {
        company: 'Company B',
        incident: 'Greenwashing Scandal'
      }
    }
  ];

function App() {
  const [money, setMoney] = useState(0);
  const [ownedUpgrades, setOwnedUpgrades] = useState<Upgrade[]>([]);

  // Handle purchasing an upgrade
  const purchaseUpgrade = (upgrade: Upgrade) => {
    if (money >= upgrade.cost) {
      setMoney(money - upgrade.cost);
      setOwnedUpgrades([...ownedUpgrades, upgrade]);
    } else {
      alert('Not enough money to purchase this upgrade!');
    }
  };

  // Check if affordable
  const canAfford = (upgrade: Upgrade) => money >= upgrade.cost; 
  
  // Check if owned
  const isOwned = (id: number) => ownedUpgrades.includes(upgrades.find(u => u.id === id)!);

  

 return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Offset the Truth</h1>
          <p className="text-slate-400">A greenwashing clicker game</p>
        </div>

        {/* Money Display */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 text-center">
          <p className="text-slate-400 text-sm mb-2">Your Money</p>
          <p className="text-5xl font-bold text-emerald-400">${money}</p>
       </div>
       

       <button
          onClick={() => setMoney(money + 1)}
          className="w-32 h-32 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center shadow-lg hover:shadow-emerald-500/50"
        >
          <span className="text-5xl">💰</span>
        </button>
  
        {/* Upgrades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upgrades.map((upgrade) => (
            <div
              key={upgrade.id}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              {/* Upgrade Name */}
              <h3 className="text-lg font-bold text-white mb-2">{upgrade.name}</h3>

              {/* Description */}
              <p className="text-sm text-slate-400 mb-4">{upgrade.description}</p>

              {/* Cost */}
              <p className="text-amber-400 font-bold mb-4">Cost: ${upgrade.cost}</p>

              {/* Real-world Link (if exists) */}
              {upgrade.realWorldLink && (
                <p className="text-xs text-slate-500 mb-4">
                  📚 {upgrade.realWorldLink.company} - {upgrade.realWorldLink.incident}
                </p>
              )}

              {/* Purchase Button */}
              <button
                onClick={() => purchaseUpgrade(upgrade)}
                disabled={!canAfford(upgrade) || isOwned(upgrade.id)}
                className={`w-full py-2 px-4 rounded font-bold transition-colors ${
                  isOwned(upgrade.id)
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : canAfford(upgrade)
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isOwned(upgrade.id) ? '✓ Owned' : `Buy for $${upgrade.cost}`}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;