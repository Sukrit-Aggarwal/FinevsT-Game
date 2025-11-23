
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
  INITIAL_PORTFOLIO_CONFIG
} from './constants';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { AssetControl } from './components/AssetControl';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  AlertTriangle, 
  Briefcase, 
  TrendingUp,
  ArrowRight,
  Info,
  BookOpen,
  BarChart2,
  X
} from 'lucide-react';

function App() {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    phase: 'INTRO',
    portfolio: { ...INITIAL_PORTFOLIO_CONFIG },
    costBasis: { ...INITIAL_PORTFOLIO_CONFIG }, // Initial Basis = Initial Value
    nav: INITIAL_FUND_SIZE,
    history: [{ round: 0, nav: INITIAL_FUND_SIZE, benchmark: INITIAL_FUND_SIZE }],
    lastRoundReturn: 0
  });

  const [allocations, setAllocations] = useState<Record<string, number>>({
    [AssetType.IND_EQ]: 0,
    [AssetType.US_EQ]: 0,
    [AssetType.G_SEC]: 0,
    [AssetType.GOLD]: 0
  });

  const [lastRoundReport, setLastRoundReport] = useState<RoundReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  // --- CALCULATIONS & LOGIC ---

  const calculateTransactionEffects = (allocs: Record<string, number>) => {
    let totalFees = 0;
    let totalTax = 0;
    const taxDetails: Record<AssetType, number> = { 
      [AssetType.IND_EQ]: 0, [AssetType.US_EQ]: 0, [AssetType.G_SEC]: 0, [AssetType.GOLD]: 0, [AssetType.CASH]: 0 
    };
    const feeDetails: Record<AssetType, number> = { ...taxDetails };

    (Object.keys(allocs) as AssetType[]).forEach(asset => {
      const delta = allocs[asset];
      if (delta === 0) return;

      // 1. Transaction Fees (1% on Equity Buy/Sell)
      if (asset === AssetType.IND_EQ || asset === AssetType.US_EQ) {
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
           // Tax Rates: 10% IND_EQ, 15% US_EQ, 0% Others
           let taxRate = 0;
           if (asset === AssetType.IND_EQ) taxRate = 0.10;
           if (asset === AssetType.US_EQ) taxRate = 0.15;
           
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
    const otherAllocations = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [, val]) => sum + (val as number), 0);
    
    // Estimated fees/taxes for *other* allocations to safeguard cash
    // This is an approximation for UI limit; strict check happens at execution
    const approxOtherCost = Math.abs(otherAllocations) * 0.02; // Safe buffer
    
    return gameState.portfolio[AssetType.CASH] - otherAllocations - approxOtherCost;
  };

  // --- ACTIONS ---

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      currentRound: 1,
      phase: 'STRATEGY'
    }));
  };

  const handleAllocationChange = (type: AssetType, delta: number) => {
    setAllocations(prev => ({
      ...prev,
      [type]: delta
    }));
  };

  const executeRound = () => {
    if (projectedCash < -0.01) return; 
    
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
        if (asset !== AssetType.CASH) {
          const ret = roundReturns[asset] || 0;
          const startVal = finalPortfolio[asset];
          const gain = startVal * ret;
          
          assetPnL[asset] = gain;
          finalPortfolio[asset] += gain;
          totalPnL += gain;
          // Note: Unrealized gains do NOT increase Cost Basis
        } else {
          assetPnL[asset] = 0;
        }
      });

      // 3. Update NAV and Benchmark
      const newNav = Object.values(finalPortfolio).reduce((sum, val) => sum + (val as number), 0);
      const prevNav = gameState.nav;
      const navChangePct = ((newNav - prevNav) / prevNav) * 100;

      // Benchmark tracks IND_EQ specifically
      const prevBenchmark = gameState.history[gameState.history.length - 1].benchmark;
      const benchmarkReturn = roundReturns[AssetType.IND_EQ] || 0;
      const newBenchmark = prevBenchmark * (1 + benchmarkReturn);

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
        lastRoundReturn: navChangePct
      }));

      setIsProcessing(false);
      setAllocations({
        [AssetType.IND_EQ]: 0,
        [AssetType.US_EQ]: 0,
        [AssetType.G_SEC]: 0,
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

  const renderIntro = () => (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full z-0 opacity-50"></div>
            
            <div className="relative z-10">
              <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase">The Alpha Edge</h1>
              <div className="text-4xl font-black mb-6 tracking-tighter uppercase text-[#DC2626]">India 2028 Simulation</div>
              
              <p className="text-xl font-medium text-gray-800 mb-8 leading-relaxed border-l-4 border-black pl-4">
                <strong>Profile:</strong> IIM Trichy Grad (26/27).<br/>
                <strong>Role:</strong> Hedge Fund Manager, Mumbai.<br/>
                <strong>Mission:</strong> Navigate the "Great Displacement" AI economy.
              </p>
              
              <div className="bg-[#FEF9C3] border-2 border-black p-6 mb-8">
                <h3 className="font-black text-lg mb-2 uppercase">Current Portfolio Position (₹100 Cr)</h3>
                <div className="grid grid-cols-4 gap-2 text-center text-sm font-bold">
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">IND_EQ</div>
                      <div>50%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">US_EQ</div>
                      <div>20%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">G-SEC</div>
                      <div>20%</div>
                   </div>
                   <div className="p-2 bg-white border border-black">
                      <div className="text-gray-500">GOLD</div>
                      <div>10%</div>
                   </div>
                </div>
              </div>

              <div className="bg-gray-100 border-2 border-black p-4 mb-8 text-sm">
                <h4 className="font-bold uppercase mb-1">Trading Rules:</h4>
                <ul className="list-disc pl-4 space-y-1">
                   <li><strong>Liquidity Lock:</strong> Max Sell ₹{SELL_LIMIT_AMOUNT} Cr per asset/month.</li>
                   <li><strong>Transaction Fee:</strong> 1% on Equity Buy/Sell.</li>
                   <li><strong>Taxes:</strong> 10% on Ind Eq Profits, 15% on US Eq Profits (realized on sell).</li>
                </ul>
              </div>

              <Button fullWidth onClick={startGame} className="text-2xl py-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
              <span className="bg-black text-white px-3 py-1 font-bold text-sm uppercase tracking-widest">Month {gameState.currentRound}</span>
              <span className="text-red-600 font-bold uppercase tracking-widest animate-pulse">Strategy Phase</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight">{currentScenario.title}</h2>
          </div>
          <div className="text-right mt-4 md:mt-0 flex flex-col items-end gap-2">
            <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Fund Value (NAV)</div>
                <div className="text-5xl font-black font-mono tracking-tighter text-[#1E3A8A]">₹{gameState.nav.toFixed(2)} Cr</div>
            </div>
            <button 
                onClick={() => setShowGraph(!showGraph)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
            >
                <BarChart2 size={14} /> {showGraph ? 'Hide Performance' : 'Show Performance'}
            </button>
          </div>
        </div>

        {/* LEFT COL: INTEL */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {showGraph && (
              <Card title="Alpha vs Benchmark (Nifty 100)" className="h-[350px] relative animate-in fade-in slide-in-from-top-4">
                <button onClick={() => setShowGraph(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded border border-transparent hover:border-black transition-all">
                    <X size={20}/>
                </button>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={gameState.history} margin={{top: 20, right: 20, left: 10, bottom: 20}}>
                     <XAxis dataKey="round" hide />
                     <YAxis domain={getGraphDomain()} hide />
                     <Tooltip 
                       contentStyle={{border: '2px solid black', borderRadius: '0px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'}}
                       itemStyle={{fontFamily: 'monospace', fontWeight: 'bold'}}
                     />
                     <Legend verticalAlign="top" height={36} iconType="rect" />
                     <Line name="Alpha Fund (You)" type="monotone" dataKey="nav" stroke="#1E3A8A" strokeWidth={3} dot={{r: 4, fill:'#1E3A8A'}} />
                     <Line name="Nifty 100 (Bench)" type="monotone" dataKey="benchmark" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                   </LineChart>
                 </ResponsiveContainer>
              </Card>
          )}

          <Card title="Market Intelligence" accentColor="bg-blue-800" className="flex-grow flex flex-col min-h-[400px]">
            <div className="flex-1 overflow-y-auto pr-4 font-sans text-base leading-relaxed">
              <div className="whitespace-pre-wrap mb-6 font-medium border-l-4 border-[#1E3A8A] pl-4 py-1 text-gray-800">
                {currentScenario.news}
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'GDP Growth', val: currentScenario.macro.gdp },
                  { label: 'Repo Rate', val: currentScenario.macro.repo },
                  { label: 'US CPI', val: currentScenario.macro.cpi },
                  { label: 'VIX (Fear)', val: currentScenario.macro.vix, color: currentScenario.macro.vix > 20 ? 'text-red-600' : 'text-green-600' }
                ].map((m, i) => (
                  <div key={i} className="bg-gray-50 border-2 border-black p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-[10px] uppercase font-black text-gray-500 mb-1">{m.label}</div>
                    <div className={`text-xl font-black ${m.color || 'text-black'}`}>{m.val}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 bg-gray-50 p-4 border border-black">
                 <div className="flex gap-3">
                   <div className="min-w-[60px] font-black text-green-700 uppercase text-sm">Bull Case</div>
                   <div className="text-gray-700 font-medium italic">"{currentScenario.analyst.bull}"</div>
                 </div>
                 <div className="w-full h-px bg-gray-300"></div>
                 <div className="flex gap-3">
                   <div className="min-w-[60px] font-black text-red-700 uppercase text-sm">Bear Case</div>
                   <div className="text-gray-700 font-medium italic">"{currentScenario.analyst.bear}"</div>
                 </div>
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
                {[AssetType.IND_EQ, AssetType.US_EQ, AssetType.G_SEC, AssetType.GOLD].map((type) => (
                  <AssetControl
                    key={type}
                    type={type as AssetType}
                    currentValue={gameState.portfolio[type as AssetType]}
                    delta={allocations[type]}
                    maxMove={SELL_LIMIT_AMOUNT}
                    maxBuyLimit={getAvailableCashForAsset(type as AssetType)}
                    totalCashStart={gameState.portfolio[AssetType.CASH]} 
                    onDeltaChange={handleAllocationChange}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-gray-100">
               {projectedCash < -0.1 && (
                 <div className="text-red-600 text-xs font-bold text-center mb-2 uppercase flex justify-center items-center gap-1 animate-bounce">
                   <AlertTriangle size={12}/> Insufficient Cash reserves
                 </div>
               )}
               <Button 
                fullWidth 
                onClick={executeRound} 
                disabled={projectedCash < -0.01}
                className={`text-lg py-4 ${projectedCash < -0.01 ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"}`}
               >
                 Lock Trades & Execute
               </Button>
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
              <h2 className="text-3xl font-black uppercase tracking-tight">Round {lastRoundReport.roundId} Report</h2>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    {[AssetType.IND_EQ, AssetType.US_EQ, AssetType.G_SEC, AssetType.GOLD, AssetType.CASH].map((type) => {
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
    const totalReturn = ((gameState.nav - INITIAL_FUND_SIZE) / INITIAL_FUND_SIZE) * 100;
    const benchmarkReturn = ((gameState.history[gameState.history.length-1].benchmark - INITIAL_FUND_SIZE) / INITIAL_FUND_SIZE) * 100;
    const alpha = totalReturn - benchmarkReturn;

    return (
      <div className="min-h-screen bg-[#FDFBF7] p-8">
        <div className="max-w-5xl mx-auto">
          <Card title="FY 2029 Performance Review" className="text-center p-10">
            <div className="flex justify-center mb-8">
               <Briefcase size={80} strokeWidth={1} className="text-black" />
            </div>
            
            <h1 className="text-6xl font-black uppercase mb-4">Simulation Complete</h1>
            <p className="text-xl text-gray-600 font-medium mb-12">The fiscal year has closed. Analyzing your Alpha generation...</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-transform">
                <div className="text-sm font-bold text-gray-500 uppercase mb-2">Your Total Return</div>
                <div className={`text-5xl font-mono font-black ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                 <div className="text-sm font-bold text-gray-500 uppercase mb-2">Benchmark (Nifty 100)</div>
                 <div className="text-5xl font-mono font-black text-gray-400">
                  {benchmarkReturn > 0 ? '+' : ''}{benchmarkReturn.toFixed(1)}%
                </div>
              </div>
              <div className="bg-[#1E3A8A] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden">
                 <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
                 <div className="text-sm font-bold text-blue-200 uppercase mb-2">Alpha Generated</div>
                 <div className="text-5xl font-mono font-black relative z-10">
                  {alpha > 0 ? '+' : ''}{alpha.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full border-4 border-black p-4 mb-10 bg-white">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={gameState.history} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                   <XAxis dataKey="round" stroke="#000" tick={{fontWeight: 'bold'}} />
                   <YAxis domain={getGraphDomain()} stroke="#000" tick={{fontWeight: 'bold'}} />
                   <Tooltip contentStyle={{border: '2px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'}}/>
                   <Legend verticalAlign="top" height={36}/>
                   <Line name="Alpha Fund" type="monotone" dataKey="nav" stroke="#1E3A8A" strokeWidth={4} dot={{r:4}} activeDot={{r:8}} />
                   <Line name="Benchmark" type="monotone" dataKey="benchmark" stroke="#9CA3AF" strokeWidth={3} strokeDasharray="5 5" />
                 </LineChart>
               </ResponsiveContainer>
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
      {gameState.phase === 'INTRO' && renderIntro()}
      {(gameState.phase === 'STRATEGY' || gameState.phase === 'EXECUTING' || gameState.phase === 'RESULT') && renderDashboard()}
      {gameState.phase === 'EXECUTING' && renderProcessing()}
      {gameState.phase === 'RESULT' && renderResult()}
      {gameState.phase === 'GAME_OVER' && renderGameOver()}
    </div>
  );
}

export default App;
