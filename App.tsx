
import React, { useState } from 'react';
import { 
  Portfolio, 
  GameState, 
  AssetType, 
  RoundReport
} from './types';
import { 
  INITIAL_FUND_SIZE, 
  MAX_ROUNDS, 
  SELL_LIMIT_AMOUNT,
  SCENARIO_DATA,
  ASSET_LABELS,
  INITIAL_PORTFOLIO_CONFIG,
  EDUCATIONAL_MODULES
} from './constants';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { AssetControl } from './components/AssetControl';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  AlertTriangle, 
  Briefcase, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Info,
  BookOpen,
  BarChart2,
  X,
  Globe,
  Activity,
  Percent,
  Zap,
  Target,
  HelpCircle,
  Coins,
  Scale,
  User,
  Lock,
  Unlock,
  CheckCircle
} from 'lucide-react';

function App() {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>({
    teamName: '',
    currentRound: 0,
    phase: 'INTRO',
    portfolio: { ...INITIAL_PORTFOLIO_CONFIG },
    costBasis: { ...INITIAL_PORTFOLIO_CONFIG }, // Initial Basis = Initial Value
    nav: INITIAL_FUND_SIZE,
    history: [{ round: 0, nav: INITIAL_FUND_SIZE, benchmark: INITIAL_FUND_SIZE }],
    lastRoundReturn: 0,
    monthlyReturns: []
  });

  const [allocations, setAllocations] = useState<Record<string, number>>({
    [AssetType.INFRA]: 0,
    [AssetType.FMCG]: 0,
    [AssetType.BFSI]: 0,
    [AssetType.IT]: 0,
    [AssetType.GOLD]: 0
  });

  const [lastRoundReport, setLastRoundReport] = useState<RoundReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // New State for Locking Mechanics
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // --- CALCULATIONS & LOGIC ---

  const calculateTransactionEffects = (allocs: Record<string, number>) => {
    let totalFees = 0;
    let totalTax = 0;
    const taxDetails: Record<AssetType, number> = { 
      [AssetType.INFRA]: 0, [AssetType.FMCG]: 0, [AssetType.BFSI]: 0, [AssetType.IT]: 0, [AssetType.GOLD]: 0, [AssetType.CASH]: 0 
    };
    const feeDetails: Record<AssetType, number> = { ...taxDetails };

    (Object.keys(allocs) as AssetType[]).forEach(asset => {
      const delta = allocs[asset];
      if (delta === 0) return;

      // 1. Transaction Fees (1% on Equity Sectors Buy/Sell)
      // Gold is exempt in this simplified model, or we can add it. Let's keep Equities only based on prompt.
      if ([AssetType.INFRA, AssetType.FMCG, AssetType.BFSI, AssetType.IT].includes(asset)) {
        const fee = Math.abs(delta) * 0.01;
        totalFees += fee;
        feeDetails[asset] = fee;
      }

      // 2. Taxes (Selling only)
      if (delta < 0) {
        const sellAmount = Math.abs(delta);
        const currentVal = gameState.portfolio[asset];
        // Calculate Portion of Cost Basis sold
        const ratio = sellAmount / currentVal;
        const costOfSold = gameState.costBasis[asset] * ratio;
        const gain = sellAmount - costOfSold;

        if (gain > 0) {
           // Tax Rates: 10% for Domestic Equities (INFRA, FMCG, BFSI, IT)
           let taxRate = 0;
           if ([AssetType.INFRA, AssetType.FMCG, AssetType.BFSI, AssetType.IT].includes(asset)) {
               taxRate = 0.10;
           }
           
           const tax = gain * taxRate;
           totalTax += tax;
           taxDetails[asset] = tax;
        }
      }
    });

    return { totalFees, totalTax, feeDetails, taxDetails };
  };

  const currentEffects = calculateTransactionEffects(allocations);
  
  const pendingAssetDelta = (Object.values(allocations) as number[]).reduce((acc, val) => acc + val, 0);
  const projectedCash = gameState.portfolio[AssetType.CASH] - pendingAssetDelta - currentEffects.totalFees - currentEffects.totalTax;
  
  const currentScenario = SCENARIO_DATA.find(r => r.id === gameState.currentRound) || SCENARIO_DATA[0];
  
  const getAvailableCashForAsset = (type: AssetType) => {
    // Determine how much cash is committed to OTHER assets, including fees and taxes
    let cashUsedByOthers = 0;

    (Object.keys(allocations) as AssetType[]).forEach(asset => {
        if (asset === type) return;
        const delta = allocations[asset];
        if (delta === 0) return;
        
        cashUsedByOthers += delta; // + means cash outflow (buy), - means cash inflow (sell)
        
        // Fee
        if ([AssetType.INFRA, AssetType.FMCG, AssetType.BFSI, AssetType.IT].includes(asset)) {
            cashUsedByOthers += Math.abs(delta) * 0.01;
        }
        
        // Tax (Sell)
        if (delta < 0) {
             const currentVal = gameState.portfolio[asset];
             if (currentVal > 0) {
                const ratio = Math.abs(delta) / currentVal;
                const costOfSold = gameState.costBasis[asset] * ratio;
                const gain = Math.abs(delta) - costOfSold;
                if (gain > 0 && [AssetType.INFRA, AssetType.FMCG, AssetType.BFSI, AssetType.IT].includes(asset)) {
                    cashUsedByOthers += gain * 0.10;
                }
             }
        }
    });

    // Net available cash from Portfolio - Commitments to others
    const netCashAvailable = gameState.portfolio[AssetType.CASH] - cashUsedByOthers;
    
    // Now determine how much of THIS asset we can buy with that cash
    if ([AssetType.INFRA, AssetType.FMCG, AssetType.BFSI, AssetType.IT].includes(type)) {
        // Cost = Delta + 0.01*Delta = 1.01 * Delta
        // MaxDelta = Cash / 1.01
        return Math.max(0, netCashAvailable / 1.01);
    } else {
        // Cost = Delta
        return Math.max(0, netCashAvailable);
    }
  };

  // --- ACTIONS ---

  const startGame = () => {
    if (!gameState.teamName.trim()) return;
    setGameState(prev => ({
      ...prev,
      currentRound: 1,
      phase: 'STRATEGY'
    }));
  };

  const handleAllocationChange = (type: AssetType, delta: number) => {
    if (isLocked) return;
    setAllocations(prev => ({
      ...prev,
      [type]: delta
    }));
  };

  const executeRound = () => {
    if (projectedCash < -0.01) return; 
    
    // Close confirmations and reset lock for processing
    setShowConfirm(false);
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, phase: 'EXECUTING' }));

    setTimeout(() => {
      // 1. Process Trades & Costs
      const effects = calculateTransactionEffects(allocations);
      const preMarketPortfolio = { ...gameState.portfolio } as Record<AssetType, number>;
      const newCostBasis = { ...gameState.costBasis } as Record<AssetType, number>;
      
      let cash = preMarketPortfolio[AssetType.CASH];

      // Deduct Flows
      (Object.keys(allocations) as AssetType[]).forEach(asset => {
        const delta = allocations[asset] as number;
        
        // Update Cost Basis
        if (delta > 0) {
          // Buy: Add to basis
          newCostBasis[asset] += delta;
        } else if (delta < 0) {
           // Sell: Reduce basis proportionally
           const ratio = Math.abs(delta) / preMarketPortfolio[asset];
           newCostBasis[asset] -= (newCostBasis[asset] * ratio);
        }

        preMarketPortfolio[asset] += delta;
        cash -= delta;
      });

      // Deduct Fees & Tax from Cash
      cash -= (effects.totalFees + effects.totalTax);
      preMarketPortfolio[AssetType.CASH] = cash;

      // 2. Apply Market Returns
      const roundReturns = currentScenario.returns;
      const finalPortfolio = { ...preMarketPortfolio } as Record<AssetType, number>;
      const assetPnL: Record<string, number> = {};
      let totalPnL = 0;

      (Object.keys(finalPortfolio) as AssetType[]).forEach(asset => {
        if (asset === AssetType.CASH) {
          assetPnL[asset] = 0;
        } else {
          // Check for undefined return and default to 0
          const ret = roundReturns[asset] || 0;
          const startVal = finalPortfolio[asset];
          const gain = startVal * ret;
          
          assetPnL[asset] = gain;
          finalPortfolio[asset] += gain;
          totalPnL += gain;
        }
      });

      // 3. Update NAV and Benchmark
      const newNav = Object.values(finalPortfolio).reduce((sum, val) => sum + (val as number), 0);
      const prevNav = gameState.nav;
      const navChangePct = ((newNav - prevNav) / prevNav) * 100;

      // Benchmark tracks NIFTY equivalent (Let's average BFSI and INFRA as 'Index' proxy or just flat 1% if not specified)
      // The old dataset had IND_EQ. Here we don't have a single index. 
      // Let's assume a simplified Benchmark Return of +0.8% per month (~10% annual) for comparison if not specified.
      // OR better, let's track an equal weighted basket of the 4 equity sectors as benchmark.
      const avgEquityReturn = (
          (roundReturns[AssetType.INFRA] || 0) + 
          (roundReturns[AssetType.FMCG] || 0) + 
          (roundReturns[AssetType.BFSI] || 0) + 
          (roundReturns[AssetType.IT] || 0)
      ) / 4;
      
      const prevBenchmark = gameState.history[gameState.history.length - 1].benchmark;
      const newBenchmark = prevBenchmark * (1 + avgEquityReturn);

      // 4. Generate Report
      const report: RoundReport = {
        roundId: gameState.currentRound,
        newsHeadline: currentScenario.news,
        marketReturns: roundReturns as Record<AssetType, number>,
        portfolioStart: { ...gameState.portfolio },
        allocations: { ...allocations },
        transactionFees: effects.feeDetails,
        taxes: effects.taxDetails,
        portfolioEnd: finalPortfolio,
        assetPnL,
        totalPnL,
        explanation: currentScenario.explanation
      };
      setLastRoundReport(report);

      setGameState(prev => ({
        ...prev,
        phase: 'RESULT',
        portfolio: finalPortfolio,
        costBasis: newCostBasis,
        nav: newNav,
        history: [...prev.history, { round: prev.currentRound, nav: newNav, benchmark: newBenchmark }],
        lastRoundReturn: navChangePct,
        monthlyReturns: [...prev.monthlyReturns, navChangePct]
      }));

      // Reset for next round
      setIsProcessing(false);
      setIsLocked(false); 
      setAllocations({
        [AssetType.INFRA]: 0,
        [AssetType.FMCG]: 0,
        [AssetType.BFSI]: 0,
        [AssetType.IT]: 0,
        [AssetType.GOLD]: 0
      });

    }, 2000);
  };

  const nextRound = () => {
    if (gameState.currentRound >= MAX_ROUNDS) {
      setGameState(prev => ({ ...prev, phase: 'GAME_OVER' }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        phase: 'STRATEGY'
      }));
    }
  };

  // --- RENDER HELPERS ---

  const getGraphDomain = () => {
    const allValues = gameState.history.flatMap(h => [h.nav, h.benchmark]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;
    const buffer = range === 0 ? 10 : range * 0.1;
    return [Math.max(0, min - buffer), max + buffer];
  };

  const renderHelpModal = () => {
    if (!showHelp) return null;
    return (
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#FDFBF7] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-3xl w-full relative max-h-[85vh] overflow-y-auto">
          <div className="bg-yellow-400 p-4 border-b-4 border-black flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <BookOpen size={24}/> Finance Knowledge Base
            </h2>
            <button onClick={() => setShowHelp(false)} className="hover:bg-white p-1 rounded border-2 border-transparent hover:border-black transition-all">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-8 grid gap-6">
            {EDUCATIONAL_MODULES.map((module, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="text-4xl bg-white border-2 border-black w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  {module.icon === 'macro' ? <Globe size={32}/> : 
                   module.icon === 'bonds' ? <Scale size={32}/> : 
                   module.icon === 'equities' ? <BarChart2 size={32}/> : 
                   module.icon === 'gold' ? <Coins size={32}/> : 
                   module.icon === 'target' ? <Target size={32}/> :
                   <Info size={32}/>}
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase mb-1">{module.title}</h3>
                  <p className="text-gray-700 font-medium leading-relaxed text-sm whitespace-pre-wrap">
                    {module.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-100 border-t-4 border-black text-center">
            <Button onClick={() => setShowHelp(false)} variant="secondary" className="text-sm">Close Guide</Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderConfirmationModal = () => {
    if (!showConfirm) return null;
    
    // Calculate total net change to assets (not including fees/tax)
    const netChange = (Object.values(allocations) as number[]).reduce((a,b)=>a+b,0);
    const hasTrades = netChange !== 0 || Object.values(allocations).some(v => v !== 0);

    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
         <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center mb-6">
               <AlertTriangle size={48} className="text-yellow-500 mb-2" />
               <h3 className="text-2xl font-black uppercase">Confirm Execution</h3>
               <p className="text-gray-600 font-medium mt-2">
                 Are you sure you want to submit these trades for Round {gameState.currentRound}?
               </p>
            </div>
            
            <div className="bg-gray-100 p-4 border-2 border-black mb-6 font-mono text-sm">
               <div className="flex justify-between mb-1">
                 <span>Trades Count:</span>
                 <span className="font-bold">{Object.values(allocations).filter(v => v !== 0).length}</span>
               </div>
               <div className="flex justify-between mb-1">
                 <span>Est. Transaction Fees:</span>
                 <span className="text-red-600">₹{currentEffects.totalFees.toFixed(2)} Cr</span>
               </div>
               <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                 <span>Est. Cash Remaining:</span>
                 <span className="font-bold">₹{projectedCash.toFixed(2)} Cr</span>
               </div>
            </div>
            
            <div className="flex gap-4">
               <Button variant="secondary" fullWidth onClick={() => setShowConfirm(false)}>Cancel</Button>
               <Button variant="success" fullWidth onClick={executeRound}>Confirm & Execute</Button>
            </div>
         </div>
      </div>
    );
  };

  const renderIntro = () => (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-6 right-6 z-20">
         <button 
           onClick={() => setShowHelp(true)}
           className="flex items-center gap-2 bg-yellow-400 border-2 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
         >
           <Info size={18}/> Guide
         </button>
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full z-0 opacity-50"></div>
            
            <div className="relative z-10">
              <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase">The Fin-Land Chronicles</h1>
              <div className="text-4xl font-black mb-6 tracking-tighter uppercase text-[#DC2626]">Alpha Edge Simulation</div>
              
              <p className="text-xl font-medium text-gray-800 mb-6 leading-relaxed border-l-4 border-black pl-4">
                <strong>Profile:</strong> Royal Portfolio Manager of FinLand.<br/>
                <strong>Mission:</strong> Navigate King Ajit's chaotic decrees, corruption scandals, and "Royal" schemes to maximize the Kingdom's wealth.<br/>
                <strong>Duration:</strong> 15 Rounds of absolute madness.
              </p>

              {/* IMAGE SLOT BELOW TEXT */}
              <div className="mb-8 w-full">
                <img 
                  src="pics/round1.png?text=Kingdom+of+FinLand+Illustration" 
                  alt="King Ajit and the Kingdom of FinLand" 
                  className="w-full h-auto max-h-80 object-cover border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'; // Hide if fails, or show fallback
                  }}
                />
              </div>
              
              <div className="bg-[#FEF9C3] border-2 border-black p-6 mb-8">
                <h3 className="font-black text-lg mb-2 uppercase">Initial Portfolio (₹100 Cr)</h3>
                <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold">
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">INFRA</div>
                      <div>20%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">FMCG</div>
                      <div>20%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">BFSI</div>
                      <div>20%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">IT</div>
                      <div>20%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">GOLD</div>
                      <div>10%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">CASH</div>
                      <div>10%</div>
                   </div>
                </div>
              </div>

              <div className="bg-gray-100 border-2 border-black p-4 mb-8 text-sm">
                <h4 className="font-bold uppercase mb-1">Trading Rules:</h4>
                <ul className="list-disc pl-4 space-y-1">
                   <li><strong>Objective:</strong> Maximize ABSOLUTE RETURNS (Final NAV).</li>
                   <li><strong>Liquidity Lock:</strong> Max Sell ₹{SELL_LIMIT_AMOUNT} Cr per asset/round.</li>
                   <li><strong>Fees:</strong> 1% Transaction Fee on all Equity Sectors.</li>
                   <li><strong>Taxes:</strong> 10% on Profits from Equity Sectors (Realized on Sell).</li>
                </ul>
              </div>

              <div className="mb-6">
                 <label className="block font-bold uppercase text-sm mb-2">Enter Team Name</label>
                 <input 
                    type="text"
                    value={gameState.teamName}
                    onChange={(e) => setGameState(prev => ({...prev, teamName: e.target.value}))}
                    placeholder="ROYAL TRADERS"
                    className="w-full border-2 border-black p-3 font-mono text-lg font-bold placeholder-gray-300 focus:outline-none focus:bg-yellow-50 focus:border-blue-600 transition-colors"
                 />
              </div>

              <Button 
                fullWidth 
                onClick={startGame} 
                disabled={!gameState.teamName.trim()}
                className="text-2xl py-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Initialize Terminal
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full p-6 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest bg-white border-t-2 border-gray-200">
        <div>Copyright: FinvesT, IIMT @2025</div>
        <div>Made by: Sukrit Aggarwal</div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto p-6 w-full">
        {/* HEADER */}
        <div className="col-span-12 flex flex-col md:flex-row justify-between items-end border-b-4 border-black pb-6 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex bg-black text-white px-3 py-1 font-bold text-sm uppercase tracking-widest">
                 <span>Month {gameState.currentRound}</span>
                 {gameState.teamName && <span className="ml-3 pl-3 border-l border-gray-500 text-yellow-400">{gameState.teamName}</span>}
              </div>
              <span className="text-red-600 font-bold uppercase tracking-widest animate-pulse">Strategy Phase</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight">{currentScenario.title}</h2>
          </div>
          <div className="text-right mt-4 md:mt-0 flex flex-col items-end gap-2">
            <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Fund Value (NAV)</div>
                <div className="text-5xl font-black font-mono tracking-tighter text-[#1E3A8A]">₹{gameState.nav.toFixed(2)} Cr</div>
            </div>
            <div className="flex gap-2">
              <button 
                  onClick={() => setShowHelp(true)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-yellow-400 border-2 border-black px-3 py-1 hover:bg-yellow-500 transition-colors"
              >
                  <HelpCircle size={14} /> Guide
              </button>
              <button 
                  onClick={() => setShowGraph(!showGraph)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
              >
                  <BarChart2 size={14} /> {showGraph ? 'Hide Performance' : 'Show Performance'}
              </button>
            </div>
          </div>
        </div>

        {/* LEFT COL: INTEL */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {showGraph && (
              <Card title="Alpha vs Benchmark (Sector Basket)" className="relative animate-in fade-in slide-in-from-top-4">
                <button onClick={() => setShowGraph(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded border border-transparent hover:border-black transition-all">
                    <X size={20}/>
                </button>
                 <div className="w-full h-[280px] mt-2">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={gameState.history} margin={{top: 20, right: 20, left: 10, bottom: 20}}>
                       <XAxis dataKey="round" hide />
                       <YAxis domain={getGraphDomain()} hide />
                       <Tooltip 
                         contentStyle={{border: '2px solid black', borderRadius: '0px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'}}
                         itemStyle={{fontFamily: 'monospace', fontWeight: 'bold'}}
                       />
                       <Legend verticalAlign="top" height={36} iconType="rect" />
                       <Line name={`${gameState.teamName || 'Alpha'} (You)`} type="monotone" dataKey="nav" stroke="#1E3A8A" strokeWidth={3} dot={{r: 4, fill:'#1E3A8A'}} />
                       <Line name="Market Avg (Bench)" type="monotone" dataKey="benchmark" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
              </Card>
          )}

          <Card title="Market Intelligence" accentColor="bg-blue-800" className="flex-grow flex flex-col min-h-[400px]">
            <div className="flex-1 overflow-y-auto pr-4">
              
              {/* Macro Dashboard Stylized */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'GDP', val: currentScenario.macro.gdp, icon: <Globe size={14}/>, color: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-900' },
                  { label: 'Repo', val: currentScenario.macro.repo, icon: <Percent size={14}/>, color: 'bg-yellow-100', text: 'text-yellow-900', border: 'border-yellow-900' },
                  { label: 'CPI', val: currentScenario.macro.cpi, icon: <Activity size={14}/>, color: 'bg-red-100', text: 'text-red-900', border: 'border-red-900' },
                  { label: 'VIX', val: currentScenario.macro.vix, icon: <Zap size={14}/>, color: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-900' }
                ].map((m, i) => (
                  <div key={i} className={`${m.color} border-2 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-24`}>
                    <div className={`flex justify-between items-start ${m.text}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                        {m.icon}
                    </div>
                    <div className={`text-lg font-black leading-none ${m.text}`}>{m.val}</div>
                  </div>
                ))}
              </div>

              {/* News Report with larger font */}
              <div className="whitespace-pre-wrap font-medium text-lg leading-relaxed text-gray-800 text-justify">
                {currentScenario.news}
              </div>

            </div>
          </Card>
        </div>

        {/* RIGHT COL: ACTION */}
        <div className="col-span-12 lg:col-span-5 flex flex-col h-full">
          <Card title="Portfolio Strategy" accentColor="bg-yellow-500" className="h-full flex flex-col relative">
            <div className="absolute top-6 right-6 flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
               <Info size={12} /> Keep sliders at 0 to HOLD
            </div>

            <div className="flex-grow">
              <div className="bg-black text-white p-4 mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(100,100,100,1)] flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Est. Cash After Trades</span>
                    <span className={`font-mono font-bold text-2xl ${projectedCash < 0 ? 'text-red-400' : 'text-white'}`}>
                    ₹{projectedCash.toFixed(2)} Cr
                    </span>
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-500 font-mono border-t border-gray-800 pt-2">
                    <span>Fees: ₹{currentEffects.totalFees.toFixed(2)} Cr</span>
                    <span>Est. Tax: ₹{currentEffects.totalTax.toFixed(2)} Cr</span>
                 </div>
              </div>

              <div className="space-y-6 pr-2">
                {[AssetType.INFRA, AssetType.FMCG, AssetType.BFSI, AssetType.IT, AssetType.GOLD].map((type) => (
                  <AssetControl
                    key={type}
                    type={type as AssetType}
                    currentValue={gameState.portfolio[type as AssetType]}
                    delta={allocations[type]}
                    maxMove={SELL_LIMIT_AMOUNT}
                    maxBuyLimit={getAvailableCashForAsset(type as AssetType)}
                    totalCashStart={gameState.portfolio[AssetType.CASH]} 
                    onDeltaChange={handleAllocationChange}
                    disabled={isLocked} // Pass locked state
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-gray-100">
               {projectedCash < -0.01 && (
                 <div className="text-red-600 text-xs font-bold text-center mb-2 uppercase flex justify-center items-center gap-1 animate-bounce">
                   <AlertTriangle size={12}/> Insufficient Cash reserves
                 </div>
               )}
               
               <div className="flex gap-3">
                  <Button 
                    fullWidth 
                    variant={isLocked ? "secondary" : "primary"}
                    onClick={() => setIsLocked(!isLocked)} 
                    className="flex-1 py-4 flex items-center justify-center gap-2"
                  >
                    {isLocked ? <><Unlock size={18}/> Unlock Positions</> : <><Lock size={18}/> Lock Positions</>}
                  </Button>
                  
                  <Button 
                    fullWidth 
                    variant="success"
                    onClick={() => setShowConfirm(true)} 
                    disabled={!isLocked || projectedCash < -0.01}
                    className="flex-1 py-4 flex items-center justify-center gap-2"
                  >
                    Submit Trades <CheckCircle size={18}/>
                  </Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="w-full p-4 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest bg-white border-t-2 border-gray-200">
        <div>Copyright: FinvesT, IIMT @2025</div>
        <div>Made by: Sukrit Aggarwal</div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
      <div className="relative w-32 h-32 mb-8">
         <div className="absolute inset-0 border-8 border-gray-800 rounded-full"></div>
         <div className="absolute inset-0 border-8 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-4xl font-black uppercase tracking-widest animate-pulse">Executing Orders</h2>
      <div className="font-mono mt-4 text-gray-400 flex flex-col items-center gap-2">
        <span>CALCULATING TAX OBLIGATIONS...</span>
        <span>REBALANCING PORTFOLIO...</span>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!lastRoundReport) return null;
    const isGain = lastRoundReport.totalPnL >= 0;

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#FDFBF7] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-5xl w-full relative my-8">
          <div className={`w-full p-6 border-b-4 border-black flex justify-between items-center ${isGain ? 'bg-green-100' : 'bg-red-100'}`}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-3xl font-black uppercase tracking-tight">Round {lastRoundReport.roundId} Report</h2>
                 {gameState.teamName && <span className="text-sm font-bold bg-black text-white px-2 py-1">{gameState.teamName}</span>}
              </div>
              <p className="font-bold text-gray-600 text-sm uppercase tracking-widest">Monthly Statement</p>
            </div>
            <div className="text-right">
               <div className="text-xs font-bold uppercase text-gray-500">Month P&L</div>
               <div className={`text-4xl font-black font-mono ${isGain ? 'text-green-700' : 'text-red-700'}`}>
                 {isGain ? '+' : ''}{gameState.lastRoundReturn.toFixed(2)}%
               </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[70vh]">
            {/* Market Analysis (The Why) */}
            <div>
              <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
                <BookOpen size={20}/> Market Analysis (The Why)
              </h3>
              <div className="bg-blue-50 border-2 border-black p-4 mb-4">
                 <p className="font-medium text-gray-800 leading-relaxed italic">
                    {lastRoundReport.explanation}
                 </p>
              </div>
            </div>

            <div>
              <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
                <Briefcase size={20}/> Market Movements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {(Object.keys(lastRoundReport.marketReturns) as AssetType[]).filter(k => k !== AssetType.CASH).map(asset => (
                   <div key={asset} className="border border-black p-2 flex justify-between items-center bg-gray-50">
                      <span className="text-xs font-bold uppercase">{ASSET_LABELS[asset].split(' ')[0]}</span>
                      <span className={`font-mono font-bold ${(lastRoundReport.marketReturns[asset] || 0) > 0 ? 'text-green-600' : (lastRoundReport.marketReturns[asset] || 0) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {(lastRoundReport.marketReturns[asset]! * 100).toFixed(1)}%
                      </span>
                   </div>
                 ))}
              </div>
            </div>

            <div>
              <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
                <TrendingUp size={20}/> Financial Performance
              </h3>
              <div className="overflow-x-auto pb-2">
                <table className="w-full text-sm border-collapse border-2 border-black min-w-[700px]">
                  <thead>
                    <tr className="bg-black text-white uppercase text-xs tracking-wider">
                      <th className="p-3 text-left">Asset Class</th>
                      <th className="p-3 text-right">Start</th>
                      <th className="p-3 text-right">Net Flow</th>
                      <th className="p-3 text-right">Fees/Tax</th>
                      <th className="p-3 text-right">Market P&L</th>
                      <th className="p-3 text-right">Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[AssetType.INFRA, AssetType.FMCG, AssetType.BFSI, AssetType.IT, AssetType.GOLD, AssetType.CASH].map((type) => {
                      const start = lastRoundReport.portfolioStart[type];
                      const action = lastRoundReport.allocations[type] || 0;
                      const pnl = lastRoundReport.assetPnL[type] || 0;
                      const end = lastRoundReport.portfolioEnd[type];
                      const fee = lastRoundReport.transactionFees[type] || 0;
                      const tax = lastRoundReport.taxes[type] || 0;
                      const totalCost = fee + tax;
                      
                      const isCash = type === AssetType.CASH;
                      
                      // For Cash row, flow is inverse of asset flows plus costs
                      const displayFlow = isCash 
                        ? -((Object.values(lastRoundReport.allocations) as number[]).reduce((a,b)=>a+b,0)) - ((Object.values(lastRoundReport.transactionFees) as number[]).reduce((a,b)=>a+b,0)) - ((Object.values(lastRoundReport.taxes) as number[]).reduce((a,b)=>a+b,0))
                        : action;

                      return (
                        <tr key={type} className="border-b border-black hover:bg-gray-50 font-mono">
                          <td className="p-3 font-bold text-gray-800 border-r border-gray-200">{ASSET_LABELS[type]}</td>
                          <td className="p-3 text-right text-gray-500">₹{start.toFixed(2)}</td>
                          <td className={`p-3 text-right font-bold ${displayFlow > 0 ? 'text-blue-600' : displayFlow < 0 ? 'text-orange-600' : 'text-gray-300'}`}>
                             {Math.abs(displayFlow) > 0.001 ? (displayFlow > 0 ? '+' : '') + displayFlow.toFixed(2) : '-'}
                          </td>
                          <td className="p-3 text-right text-red-600">
                            {totalCost > 0 ? `-₹${totalCost.toFixed(2)}` : '-'}
                          </td>
                          <td className={`p-3 text-right font-bold ${pnl > 0 ? 'text-green-600' : pnl < 0 ? 'text-red-600' : 'text-gray-300'}`}>
                             {Math.abs(pnl) > 0.001 ? (pnl > 0 ? '+' : '') + pnl.toFixed(2) : '-'}
                          </td>
                          <td className="p-3 text-right font-black border-l border-gray-200">₹{end.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-100 font-black border-t-2 border-black">
                      <td className="p-3 text-left uppercase">Totals</td>
                      <td className="p-3 text-right">₹{(Object.values(lastRoundReport.portfolioStart) as number[]).reduce((a,b)=>a+b,0).toFixed(2)}</td>
                      <td className="p-3 text-right text-gray-400">--</td>
                      <td className="p-3 text-right text-red-600">-₹{((Object.values(lastRoundReport.transactionFees) as number[]).reduce((a,b)=>a+b,0) + (Object.values(lastRoundReport.taxes) as number[]).reduce((a,b)=>a+b,0)).toFixed(2)}</td>
                      <td className={`p-3 text-right ${lastRoundReport.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                         {lastRoundReport.totalPnL > 0 ? '+' : ''}{lastRoundReport.totalPnL.toFixed(2)}
                      </td>
                      <td className="p-3 text-right">₹{gameState.nav.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t-4 border-black flex gap-4">
            <Button fullWidth onClick={nextRound} className="text-xl py-4 flex items-center justify-center gap-2">
               {gameState.currentRound >= MAX_ROUNDS ? "View Final Evaluation" : "Advance to Next Month"} <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderGameOver = () => {
    // Basic Returns
    const totalReturn = ((gameState.nav - INITIAL_FUND_SIZE) / INITIAL_FUND_SIZE) * 100;
    const benchmarkReturn = ((gameState.history[gameState.history.length-1].benchmark - INITIAL_FUND_SIZE) / INITIAL_FUND_SIZE) * 100;
    const finalNAV = gameState.nav;

    return (
      <div className="min-h-screen bg-[#FDFBF7] p-8">
        <div className="max-w-6xl mx-auto">
          <Card title="FY 2029 Performance Evaluation" className="text-center p-10">
            <div className="flex justify-center mb-6">
               <Target size={60} strokeWidth={1.5} className="text-black" />
            </div>
            
            <h1 className="text-5xl font-black uppercase mb-2">Simulation Complete</h1>
            <p className="text-lg text-gray-500 font-medium mb-10 flex items-center justify-center gap-2">
               Performance Report Card: <span className="text-black font-bold uppercase">{gameState.teamName}</span>
            </p>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                 <div className="text-xs font-bold text-gray-400 uppercase mb-2">Benchmark Return (Market Avg)</div>
                 <div className="text-4xl font-mono font-black text-gray-800">
                  {benchmarkReturn > 0 ? '+' : ''}{benchmarkReturn.toFixed(1)}%
                </div>
              </div>
              
               <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">Your Total Return</div>
                <div className={`text-4xl font-mono font-black ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                </div>
              </div>

              {/* FINAL NAV HERO CARD */}
              <div className="bg-[#1E3A8A] border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden group">
                 <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform"></div>
                 <div className="text-xs font-bold text-blue-200 uppercase mb-2 flex items-center gap-1">
                    <Activity size={12}/> Final Portfolio Value
                 </div>
                 <div className="text-5xl font-mono font-black relative z-10">
                  ₹{finalNAV.toFixed(2)} Cr
                </div>
              </div>
            </div>

            {/* Monthly Track Record Table */}
            <div className="mb-10">
                <h3 className="text-left font-black uppercase text-lg mb-4 flex items-center gap-2">
                    <BarChart2 size={20}/> Monthly Track Record
                </h3>
                <div className="overflow-x-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-black text-white">
                                {gameState.monthlyReturns.map((_, i) => (
                                    <th key={i} className="p-3 text-center border-r border-gray-700 min-w-[60px]">
                                        M{i+1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                {gameState.monthlyReturns.map((ret, i) => (
                                    <td key={i} className={`p-4 text-center font-mono font-bold border-r border-gray-200 ${ret > 0 ? 'text-green-600' : ret < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                        {ret > 0 ? '+' : ''}{ret.toFixed(1)}%
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Button onClick={() => window.location.reload()} className="text-xl px-12 py-4">
              Initialize New Simulation
            </Button>
          </Card>
          
          <div className="w-full mt-12 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div>Copyright: FinvesT, IIMT @2025</div>
            <div>Made by: Sukrit Aggarwal</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans selection:bg-yellow-200">
      {renderHelpModal()}
      {renderConfirmationModal()}
      {gameState.phase === 'INTRO' && renderIntro()}
      {(gameState.phase === 'STRATEGY' || gameState.phase === 'EXECUTING' || gameState.phase === 'RESULT') && renderDashboard()}
      {gameState.phase === 'EXECUTING' && renderProcessing()}
      {gameState.phase === 'RESULT' && renderResult()}
      {gameState.phase === 'GAME_OVER' && renderGameOver()}
    </div>
  );
}

export default App;
