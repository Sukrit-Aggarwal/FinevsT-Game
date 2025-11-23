import { AssetType, ScenarioRound } from './types';

export const INITIAL_CASH = 100; // 100 Crores
export const MAX_ROUNDS = 12;
export const SELL_LIMIT_AMOUNT = 25; // 25 Crores fixed selling limit per round

export const ASSET_LABELS: Record<AssetType, string> = {
  [AssetType.IND_EQ]: 'Nifty 100 (IND)',
  [AssetType.US_EQ]: 'Nasdaq 100 (US)',
  [AssetType.G_SEC]: 'Govt Bonds (G-SEC)',
  [AssetType.GOLD]: 'Gold (XAU)',
  [AssetType.CASH]: 'Cash (INR)'
};

export const SCENARIO_DATA: ScenarioRound[] = [
  // PHASE 1: INTEGRATION BOOM
  {
    id: 1,
    title: "The New Gold Standard",
    news: "Silicon Valley giant 'Omni-Compute' reveals its 'Agent-Zero' operating system, promising to replace 40% of white-collar tasks with autonomous agents. Global markets are rallying on the productivity productivity promises. In parallel, India's PLI (Production Linked Incentive) scheme for semiconductor fabrication hits a milestone with the first 'Made in India' commercial GPU shipping from Gujarat. Foreign funds are aggressively increasing weightage in Emerging Markets, calling India the 'Factory of the Digital Age'.",
    macro: { gdp: '7.4% 🟢', repo: '6.25% 🟡', cpi: '2.3% 🟢', vix: 12 },
    analyst: {
      bull: "This is the iPhone moment for AI. If you aren't long on Tech and India Manufacturing, you hate money.",
      bear: "The productivity gains are theoretical, but the CAPEX spending is very real. Margins will shrink before they expand."
    },
    returns: { [AssetType.US_EQ]: 0.05, [AssetType.IND_EQ]: 0.035, [AssetType.G_SEC]: -0.005, [AssetType.GOLD]: -0.01, [AssetType.CASH]: 0 },
    explanation: "Pure growth narrative. Capital rotated out of defensive assets (Gold/Bonds) into high-beta Equities. India rallied on the manufacturing export theme."
  },
  {
    id: 2,
    title: "The Energy Thirst",
    news: "The hidden cost of AI is becoming apparent: Energy. Global data center power consumption has doubled in 12 months. Energy stocks are surging, but this is creating a headache for non-energy sectors. The Indian Power Ministry announces emergency coal auctions to meet rising industrial demand. Meanwhile, US 10-Year Treasury yields are inching up as bond traders price in higher energy-driven inflation. The Dollar Index (DXY) is strengthening.",
    macro: { gdp: '7.6% 🟢', repo: '6.25% 🟡', cpi: '2.8% 🟡', vix: 14 },
    analyst: {
      bull: "Energy demand is a proxy for growth. The economy is overheating in a good way. Buy Commodities and Infra.",
      bear: "Higher energy costs act like a tax on growth. Watch the Bond Yields; if they cross 4.5%, Tech valuations will crumble."
    },
    returns: { [AssetType.US_EQ]: 0.02, [AssetType.IND_EQ]: 0.04, [AssetType.G_SEC]: -0.01, [AssetType.GOLD]: 0.01, [AssetType.CASH]: 0 },
    explanation: "Mixed signals. India outperformed because 'Old Economy' (Power/Infra) stocks rallied. US Tech slowed down due to rising yields (discount rates). Gold ticked up as smart money hedged against energy inflation."
  },
  {
    id: 3,
    title: "The Peak",
    news: "Euphoria dominates. Retail participation in derivatives trading has hit an all-time high. Omni-Compute CEO claims their AI has 'solved' nuclear fusion simulations, sending the stock parabolic. However, insider filing disclosures show significant stock dumping by C-suite executives across the 'Magnificent 7' tech firms. In India, credit growth is outpacing deposit growth, leading the RBI to issue a subtle warning about 'irrational exuberance' in unsecured lending.",
    macro: { gdp: '7.8% 🟢', repo: '6.25% 🟡', cpi: '3.1% 🟡', vix: 11 },
    analyst: {
      bull: "Momentum ignores logic. The trend is your friend until it bends. Stay long.",
      bear: "Insiders are selling while retail is buying. This is the classic top. I'm moving 20% to Cash."
    },
    returns: { [AssetType.US_EQ]: 0.06, [AssetType.IND_EQ]: 0.03, [AssetType.G_SEC]: -0.005, [AssetType.GOLD]: -0.02, [AssetType.CASH]: 0 },
    explanation: "The 'Blow-off Top.' Intense FOMO drove US Tech higher despite warning signs. Gold fell as risk appetite was maximum (no one wants safety)."
  },
  // PHASE 2: THE STRESS
  {
    id: 4,
    title: "The Rate Shock",
    news: "The 'Transitory' inflation narrative is dead. US CPI shocked markets at 4.5%, driven by energy and wages. The Federal Reserve signals 'No Rate Cuts in 2028,' and potentially a hike next month. This sent a shiver through Silicon Valley, where startups rely on cheap debt. In India, the Rupee weakened to ₹88/USD as foreign capital flew back to US Treasury Bills (Safe Yields).",
    macro: { gdp: '7.2% 🟡', repo: '6.25% 🟡', cpi: '4.5% 🔴', vix: 19 },
    analyst: {
      bull: "Strong economy = Inflation. It's a byproduct of growth. Buy the dip.",
      bear: "Math lesson: When Risk-Free Rate goes up, P/E multiples MUST come down. Tech is overvalued by 30%."
    },
    returns: { [AssetType.US_EQ]: -0.03, [AssetType.IND_EQ]: -0.01, [AssetType.G_SEC]: -0.015, [AssetType.GOLD]: 0.02, [AssetType.CASH]: 0 },
    explanation: "The 'Valuation Reset.' High inflation kills high-PE tech stocks. Bonds fell (Yields rose) because rates are expected to rise. Gold rose as a hedge against inflation."
  },
  {
    id: 5,
    title: "The Model Collapse",
    news: "A leaked internal memo from a top AI lab suggests 'Model Collapse'—where AI trains on AI-generated data, leading to garbage outputs—is degrading performance. Omni-Compute delays its flagship product launch indefinitely. Simultaneously, the RBI unexpectedly hikes the Repo Rate by 25 bps to defend the Rupee, tightening liquidity in Mumbai. Small-cap stocks are seeing margin calls.",
    macro: { gdp: '6.8% 🟡', repo: '6.50% ⬆️', cpi: '4.6% 🔴', vix: 24 },
    analyst: {
      bull: "Delays are normal in tech. The structural story hasn't changed. India is still the fastest-growing major economy.",
      bear: "The AI promise was 'Revenue Now.' The reality is 'Revenue Never.' If the tech doesn't work, the bubble bursts."
    },
    returns: { [AssetType.US_EQ]: -0.05, [AssetType.IND_EQ]: -0.025, [AssetType.G_SEC]: -0.01, [AssetType.GOLD]: 0.03, [AssetType.CASH]: 0 },
    explanation: "Specific Sector Risk. The 'AI narrative' took a hit. India fell due to the Rate Hike (higher cost of capital). Gold continued to shine as uncertainty grew."
  },
  {
    id: 6,
    title: "The Credit Freeze",
    news: "Global liquidity is evaporating. High interest rates have caused a 'mark-to-market' crisis for regional banks holding long-term bonds. Rumors circulate that a major Crypto-AI hedge fund has failed a margin call. In India, FIIs (Foreign Investors) have turned net sellers for 15 straight days, repatriating dollars to cover losses in the West. Bond markets are volatile.",
    macro: { gdp: '6.4% 🟡', repo: '6.75% ⬆️', cpi: '4.2% 🔴', vix: 29 },
    analyst: {
      bull: "This flushing out of weak hands is healthy. Accumulate blue chips.",
      bear: "Liquidity is the oxygen of the market, and the Fed just pinched the tube. Cash is the only asset that doesn't drop."
    },
    returns: { [AssetType.US_EQ]: -0.04, [AssetType.IND_EQ]: -0.04, [AssetType.G_SEC]: -0.02, [AssetType.GOLD]: 0.04, [AssetType.CASH]: 0 },
    explanation: "Liquidity Crisis. When money is tight, everything falls together (correlation approaches 1), except Gold. Bonds fell because rates kept rising."
  },
  // PHASE 3: THE BUBBLE POP
  {
    id: 7,
    title: "The Black Box Scandal",
    news: "BREAKING: Omni-Compute is under DOJ investigation. Whistleblowers allege 60% of their 'AI Traffic' was bot-farms faking user engagement to secure loans. The stock is halted. Panic spreads to the entire semiconductor supply chain. Nasdaq futures are limit-down. In India, tech services companies lose 15% market cap in opening trade.",
    macro: { gdp: '5.9% 🔴', repo: '6.75% 🔴', cpi: 'N/A', vix: 55 },
    analyst: {
      bull: "Only one company is bad! Don't sell the whole index!",
      bear: "Counterparty risk. We don't know who lent money to them. Sell first, ask questions later."
    },
    returns: { [AssetType.US_EQ]: -0.15, [AssetType.IND_EQ]: -0.08, [AssetType.G_SEC]: 0.015, [AssetType.GOLD]: 0.05, [AssetType.CASH]: 0 },
    explanation: "The Crash Trigger. Fraud exposure destroyed trust. Flight to safety began: Investors bought Gold and Govt Bonds (Flight to Quality), dumping Equities."
  },
  {
    id: 8,
    title: "The Margin Call Contagion",
    news: "The contagion has reached the real economy. A major US bank freezes withdrawals due to exposure to the AI crash. Global trade financing has stalled. Emerging Markets are being treated as ATMs—investors are selling Indian stocks at any price to raise cash for US margin calls. The Rupee is in freefall. Oil prices crash as recession fears spike.",
    macro: { gdp: '5.2% 🔴', repo: '6.75% 🔴', cpi: 'Cooling', vix: 42 },
    analyst: {
      bull: "We are 30% down from highs. Valuations are attractive.",
      bear: "The deleveraging isn't over. We haven't seen the bottom until the Fed pivots. Stay in Bonds."
    },
    returns: { [AssetType.US_EQ]: -0.08, [AssetType.IND_EQ]: -0.10, [AssetType.G_SEC]: 0.03, [AssetType.GOLD]: 0.02, [AssetType.CASH]: 0 },
    explanation: "Forced Selling. India fell harder than US this round due to FII outflows. Bonds rallied hard (Yields fell) as markets anticipated a recession (which brings rate cuts)."
  },
  {
    id: 9,
    title: "The Capitulation",
    news: "Despair. Global GDP forecast cut to 0%. Unemployment in the US tech sector hits double digits. However, the 'Bad News is Good News' dynamic is emerging: The economic collapse is so severe that Central Banks must intervene. The US Fed announces an emergency meeting for tomorrow. Smart money is quietly buying high-quality bonds.",
    macro: { gdp: '4.5% 🔴', repo: '6.75% 🔴', cpi: '1.5%', vix: 35 },
    analyst: {
      bull: "The Fed put is back in play. If they cut rates, Bonds will moon.",
      bear: "Earnings will be negative for 2 years. It's a dead cat bounce."
    },
    returns: { [AssetType.US_EQ]: -0.03, [AssetType.IND_EQ]: -0.03, [AssetType.G_SEC]: 0.04, [AssetType.GOLD]: 0.01, [AssetType.CASH]: 0 },
    explanation: "Bottoming Process. Equities fell less (selling exhaustion). Bonds soared because the market knew rate cuts were imminent."
  },
  // PHASE 4: THE RECOVERY
  {
    id: 10,
    title: "The Bazooka Stimulus",
    news: "POLICY PIVOT: The US Fed cuts rates by 75bps. The RBI follows with a 50bps cut and a ₹2 Lakh Crore liquidity injection. The Govt announces a 'Digital Reconstruction' package to bail out viable tech firms. Bond yields crash globally (Prices fly). The narrative shifts from 'Recession' to 'Reflation'.",
    macro: { gdp: '4.8% 🟡', repo: '6.25% ⬇️', cpi: '1.8%', vix: 24 },
    analyst: {
      bull: "Don't fight the Fed. Liquidity is flooding the system. Buy Beta (Equities).",
      bear: "This is artificial support. The fundamentals are still weak."
    },
    returns: { [AssetType.US_EQ]: 0.04, [AssetType.IND_EQ]: 0.05, [AssetType.G_SEC]: 0.05, [AssetType.GOLD]: -0.01, [AssetType.CASH]: 0 },
    explanation: "The Policy Rally. Rate cuts instantly boosted Bond prices (Math: Yields down = Prices up). Equities rallied on cheap money. Gold fell slightly as fear subsided."
  },
  {
    id: 11,
    title: "The Fundamental Turn",
    news: "Green shoots. Manufacturing PMI in India expands for the first time in 4 months. The surviving tech companies report 'clean' earnings—lower revenue but higher quality margins. Investors are rotating out of Safety (Bonds/Gold) and back into Risk (Stocks). The 'India Growth Story' is being revisited by global asset allocators.",
    macro: { gdp: '5.5% 🟢', repo: '6.00% ⬇️', cpi: '2.0%', vix: 18 },
    analyst: {
      bull: "The weak companies are bankrupt. The survivors will take all the market share. Small caps are a steal.",
      bear: "Markets have rallied too fast. I'm taking profits on my Bonds."
    },
    returns: { [AssetType.US_EQ]: 0.03, [AssetType.IND_EQ]: 0.06, [AssetType.G_SEC]: 0.01, [AssetType.GOLD]: -0.02, [AssetType.CASH]: 0 },
    explanation: "Rotation. Money moved from defensive assets back into growth assets. India outperformed due to high domestic demand elasticity."
  },
  {
    id: 12,
    title: "The New Cycle",
    news: "2029 Outlook: The IMF upgrades global growth. The 'AI Bust' is officially over, replaced by 'AI Utility'—boring but profitable integration. The Sensex reclaims its pre-crisis levels. Volatility has collapsed. The lesson of 2028 is clear: Liquidity dictates price, but Cash Flow dictates survival.",
    macro: { gdp: '6.5% 🟢', repo: '5.75% ⬇️', cpi: '2.2%', vix: 14 },
    analyst: {
      bull: "We are at the start of a new 5-year bull run. Fully invested.",
      bear: "Fair value reached. Expect modest returns from here."
    },
    returns: { [AssetType.US_EQ]: 0.03, [AssetType.IND_EQ]: 0.04, [AssetType.G_SEC]: 0.00, [AssetType.GOLD]: -0.01, [AssetType.CASH]: 0 },
    explanation: "Normalization. A steady 'Goldilocks' end to the year. No massive swings, just steady compounding."
  }
];
