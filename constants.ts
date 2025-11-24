
import { AssetType, ScenarioRound, Portfolio } from './types';

export const INITIAL_FUND_SIZE = 100; // 100 Crores Total
export const MAX_ROUNDS = 12;
export const SELL_LIMIT_AMOUNT = 25; // 25 Crores fixed selling limit per round
export const MONTHLY_RISK_FREE_RATE = 0.5; // 0.5% Monthly Risk Free Rate (~6% Annual)
export const SHARPE_ANNUALIZATION_FACTOR = 3.464; // Square root of 12

// Starting allocation: Ind: 40, US: 20, Debt: 20, Gold: 10, Cash: 10
export const INITIAL_PORTFOLIO_CONFIG: Portfolio = {
  [AssetType.IND_EQ]: 40,
  [AssetType.US_EQ]: 20,
  [AssetType.G_SEC]: 20,
  [AssetType.GOLD]: 10,
  [AssetType.CASH]: 10
};

export const ASSET_LABELS: Record<AssetType, string> = {
  [AssetType.IND_EQ]: 'Nifty 100 (IND)',
  [AssetType.US_EQ]: 'Nasdaq 100 (US)',
  [AssetType.G_SEC]: 'Govt Bonds (G-SEC)',
  [AssetType.GOLD]: 'Gold (XAU)',
  [AssetType.CASH]: 'Cash (INR)'
};

export const EDUCATIONAL_MODULES = [
  {
    title: "1. Macro Basics: Inflation & Rates",
    icon: "macro",
    content: "The economy is a cycle. When 'Inflation' (prices) rises, Central Banks (Fed/RBI) raise 'Interest Rates'. \n\n• High Rates = Expensive loans -> Companies grow slower -> Stocks Down -> Inflation Cools.\n• Low Rates = Cheap money -> Companies expand -> Stocks Up -> Risk of Inflation.\n\nWatch the CPI (Inflation) and Repo (Rates) data closely."
  },
  {
    title: "2. The Bond Seesaw (Critical)",
    icon: "bonds",
    content: "Bonds are loans to the government. They have an INVERSE relationship with Interest Rates.\n\n• If Rates/Yields Go UP -> Bond Prices Go DOWN.\n• If Rates/Yields Go DOWN -> Bond Prices Go UP.\n\nIf you expect a Recession (Rates cut), Buy Bonds. If you expect Inflation (Rates hike), Sell Bonds."
  },
  {
    title: "3. Equities: Growth vs. Valuation",
    icon: "equities",
    content: "Stocks represent future earnings.\n\n• US Tech (Nasdaq): High Risk/High Reward. Very sensitive to rates. High rates hurt tech valuations deeply.\n• India (Nifty): Driven by manufacturing and domestic consumption. Needs foreign capital (FII) flows to rally. If the US dollar gets too strong, money leaves India."
  },
  {
    title: "4. Gold: The Panic Button",
    icon: "gold",
    content: "Gold pays no interest and produces nothing. It is a 'Store of Value'.\n\nInvestors buy Gold when they are scared of:\n1. Currency Collapse (Printing too much money/UBI).\n2. Crisis (War, Fraud, Bank Runs).\n3. Stagflation (High Inflation + Low Growth)."
  },
  {
    title: "5. The Objective: Sharpe Ratio",
    icon: "sharpe",
    content: "You are not judged on 'Total Return' alone. You are judged on 'Smoothness'.\n\nFormula: (Return - Risk Free Rate) / Volatility\n\nA fund that makes 20% with wild 10% swings is worse than a fund that makes 15% with steady 1% growth. To win, manage your risk (Standard Deviation). Don't just gamble."
  }
];

export const SCENARIO_DATA: ScenarioRound[] = [
  {
    id: 1,
    title: "The \"Zero Marginal Cost\" Mirage",
    news: "Intel Report: The global markets have entered a phase of euphoric dislocation dubbed the \"Zero Marginal Cost\" era. Silicon Valley giant 'Omni-Compute' stunned Wall Street this quarter, reporting a 40% surge in Net Income despite completely flat top-line revenues. The driver? A ruthless \"hyper-automation\" program that saw 15% of its mid-level workforce—primarily in coding, QA, and middle management—replaced by proprietary autonomous agents. The CEO, in a leaked internal memo, described this not as a layoff, but as \"shedding the biological friction to scale.\"\n\nThis narrative has ignited a firestorm of speculation. Analysts are aggressively upgrading price targets for the entire tech sector, extrapolating Omni-Compute's margin expansion to every software company in the S&P 500. The thesis is seductive: if the marginal cost of intelligence goes to zero, profit margins expand to infinity. In India, the reverberations are immediate but paradoxical. The IT services giants, historically the largest employers of engineering talent, have announced a shocking \"strategic hiring freeze.\" Campus recruitment has dropped to near zero. However, their stock prices are resilient, even rising, as they announce record deal wins from Fortune 500 firms rushing to outsource their own AI implementation layers. The market is pricing in a massive efficiency boom for Indian IT, ignoring the labor market implications.\n\nMeanwhile, the bond market is behaving strangely. Typically, such a tech boom would spike yields due to growth expectations. Instead, yields are flat. The narrative taking hold is that this tech wave is inherently deflationary—a massive counterweight to consumer demand. Capital is flooding into equities, convinced that we have unlocked a cheat code for perpetual profit growth without inflation.",
    macro: { gdp: '7.2% (Steady)', repo: '6.5%', cpi: '2.1% (Ideal)', vix: 12 },
    returns: { [AssetType.US_EQ]: 0.04, [AssetType.IND_EQ]: 0.02, [AssetType.G_SEC]: 0.00, [AssetType.GOLD]: -0.01, [AssetType.CASH]: 0 },
    explanation: "Profit expansion driven purely by cost-cutting (margin growth) is incredibly bullish for equities in the short term, as P/E multiples expand on higher 'E'. Bonds remained flat because the market is internalizing the \"Deflationary Tech\" narrative—believing that AI will lower the cost of goods and services, offsetting any inflationary pressures from strong growth. Gold dipped as fear evaporated."
  },
  {
    id: 2,
    title: "The Physical Constraint",
    news: "Intel Report: The \"Zero Marginal Cost\" software dream has just slammed into a hard physical reality. A severe, historic drought in Taiwan has triggered emergency water rationing protocols, forcing the world's most advanced semiconductor foundries to slash output by 30%. Critical \"Neuromorphic Chips\"—the hardware backbone required to run the autonomous agents celebrated in Round 1—are facing 12-month delivery delays.\n\nThe reaction is panic. Spot prices for high-end GPUs have tripled overnight in the gray market. Hyperscalers (Amazon, Google, Microsoft) are in a bidding war for existing inventory, draining their capex budgets. The narrative has shifted violently from \"Software is Eating the World\" to \"Hardware is Starving the Software.\"\n\nHowever, this crisis has birthed a new winner: The \"China+1\" beneficiaries. Global manufacturing firms, terrified by the concentration risk in Taiwan, are aggressively fast-tracking their diversification plans. Indian electronics manufacturers, particularly those under the Production Linked Incentive (PLI) scheme, are seeing a tsunami of order inflows. It's a capex boom for India's industrial belt. Adding to the tailwind for India, oil prices have unexpectedly dipped to $60/barrel as global growth forecasts are trimmed due to the chip shortage. This acts as a massive fiscal stimulus for India, drastically reducing the import bill and improving the Current Account Deficit.",
    macro: { gdp: '7.4% (Rising on Capex)', repo: '6.5%', cpi: '2.3% (Ticking up)', vix: 15 },
    returns: { [AssetType.US_EQ]: -0.01, [AssetType.IND_EQ]: 0.04, [AssetType.G_SEC]: -0.005, [AssetType.GOLD]: 0.00, [AssetType.CASH]: 0 },
    explanation: "A classic divergence. US Tech stalled because their growth model (unlimited AI scaling) hit a bottleneck, raising their input costs (chips). Indian Manufacturing exploded because the supply chain crisis forced global capital to diversify into India. Low oil prices further boosted Indian equity sentiment by improving the macro balance sheet."
  },
  {
    id: 3,
    title: "The White Collar Recession",
    news: "Intel Report: The other shoe has finally dropped, and it made a sound no one expected. The US Labor Department released a shocking payroll report today: a net contraction of 200,000 jobs. But the composition of the data is unprecedented. The losses weren't in manufacturing or retail; they were entirely in \"Professional and Business Services.\" Marketing, legal, coding, and mid-level finance roles are evaporating.\n\nThe Treasury Secretary, in a somber press briefing, admitted, \"AI displacement is happening faster than our models predicted.\" This is the first recorded drop in white-collar payrolls during a period of nominal GDP growth. Consumer confidence indices have cratered, specifically in the high-income demographics that drive discretionary spending. Luxury brands and high-end real estate are seeing immediate demand destruction.\n\nHowever, Wall Street is disconnected from Main Street. Corporate algorithms, detecting the headcount reduction, are trading on \"efficiency metrics.\" They see lower wage bills and higher projected free cash flow. This has created a grotesque disconnect: \"The Economy\" (Labor) is entering a recession, but \"The Market\" (Capital) is holding up. Smart money, however, is getting nervous. Hedge funds are quietly rotating out of consumer discretionary stocks and moving into defensive assets, sensing that if the high-earners stop spending, the earnings per share (EPS) figures will eventually collapse.",
    macro: { gdp: '7.0% (Slowing)', repo: '6.5%', cpi: '1.8% (Dropping rapidly)', vix: 18 },
    returns: { [AssetType.US_EQ]: 0.02, [AssetType.IND_EQ]: -0.01, [AssetType.G_SEC]: 0.01, [AssetType.GOLD]: 0.02, [AssetType.CASH]: 0 },
    explanation: "The \"Bad News is Good News\" paradox. Algorithms bought the margin expansion story (US-EQ Up), ignoring the long-term demand destruction. However, the smart money started hedging with Gold and Bonds (pushing yields down/prices up) because they anticipate a consumption bust. India dipped because a slowing US consumer hurts Indian IT and export sectors."
  },
  {
    id: 4,
    title: "The \"Ghost User\" Scandal",
    news: "Intel Report: Panic has gripped the markets following the release of a bombshell report by a prominent short-seller, \"Project Aletheia.\" The report alleges that up to 50% of the \"Daily Active Users\" (DAU) reported by major AI platforms are not humans, but other AI bots interacting with each other to inflate engagement metrics. The report coins the term \"Circular Traffic\"—bots querying bots to generate ad revenue and subscription renewals.\n\nThe implications are catastrophic. If true, the valuation models of the entire tech sector—which are based on user growth and \"time spent on platform\"—are built on sand. Advertisers are pulling spend immediately, demanding audits. Tech stocks are shuddering violently.\n\nSimultaneously, the economic reality of the white-collar recession (Round 3) is biting. Laid-off workers are slashing spending, and for the first time in a decade, deflation risks are flashing red. Prices for services are falling because no one has the money to buy them. The Federal Reserve has signaled an emergency meeting, but the market fears they are behind the curve. The \"Ghost User\" scandal combined with deflation is a toxic cocktail: it means revenue is fake, and real demand is dying.",
    macro: { gdp: '6.2% (Falling)', repo: '6.5%', cpi: '1.2% (Deflation Risk)', vix: 28 },
    returns: { [AssetType.US_EQ]: -0.06, [AssetType.IND_EQ]: -0.03, [AssetType.G_SEC]: 0.02, [AssetType.GOLD]: 0.03, [AssetType.CASH]: 0 },
    explanation: "Fraud + Deflation = Toxicity. Equities crashed primarily on the fraud rumor; if the \"E\" in P/E is fake, prices must collapse. Bonds rallied (yields fell) because deflation is great for fixed income (real yields rise) and investors fled risky stocks for safe government debt. Gold rose as a hedge against systemic chaos."
  },
  {
    id: 5,
    title: "The Liquidity Trap",
    news: "Intel Report: The \"Ghost User\" scandal has metastasized into a full-blown credit event. The SEC has opened a formal investigation into \"Bot-Farming,\" triggering automatic covenants in debt agreements. Credit spreads for tech companies have blown out to 2008 levels. Banks, fearing regulatory backlash and unknown liabilities, have completely stopped lending to AI startups.\n\nThe contagion has hit the shadow banking system. A major US Neo-Bank, heavily exposed to tech venture debt, has frozen customer withdrawals. This is the \"Lehman Moment\" for the AI era. Panic is spreading across asset classes. In a desperate bid to raise cash to cover margin calls, Foreign Institutional Investors (FIIs) are treating Emerging Markets like an ATM. They have sold $2 billion worth of Indian equities in three days. The Indian Rupee (INR) has hit a record low.\n\nThe Reserve Bank of India (RBI) is in a bind. Hiking rates to defend the Rupee would crush an already slowing economy. Instead, they are intervening in the forex market, burning through reserves to manage the volatility. It is a classic liquidity crisis: solvency is irrelevant; cash is king.",
    macro: { gdp: '5.5% (Cratering)', repo: '6.5%', cpi: '0.5% (Near Deflation)', vix: 45 },
    returns: { [AssetType.US_EQ]: -0.08, [AssetType.IND_EQ]: -0.06, [AssetType.G_SEC]: 0.01, [AssetType.GOLD]: 0.04, [AssetType.CASH]: 0 },
    explanation: "Liquidity Crisis. High-beta assets (Tech) get slaughtered as leverage is unwound. Emerging Markets (India) are sold indiscriminately not because they are bad, but because they are liquid. Gold shines as the ultimate safe haven when the banking system itself looks shaky."
  },
  {
    id: 6,
    title: "The \"AI Winter\" Recession",
    news: "Intel Report: A Global Recession has been officially declared. US unemployment has spiked to 8% as the ripple effects of AI displacement tear through the service sector, compounded by the credit freeze. GDP is contracting. The \"Circular Revenue\" fraud is now fully priced in; the bad actors have filed for Chapter 11 bankruptcy, and the fraudulent equity value has been wiped out.\n\nHowever, a strange calm has descended. The surviving firms—those with real revenues, human customers, and fortress balance sheets—are the only ones left standing. The market is dead silent. Volumes are at multi-year lows. Pessimism is at a maximum; no one wants to touch stocks.\n\nBut beneath the surface, the macro conditions are pivoting. With CPI at -0.5% (Deflation), the Federal Reserve has no choice. The inflation dragon is dead; the deflation monster is here. The market is sniffing out a massive policy pivot. It's the darkest hour before the dawn.",
    macro: { gdp: '4.5% (Contraction)', repo: '6.25% (First Cut hinted)', cpi: '-0.5% (Deflation)', vix: 35 },
    returns: { [AssetType.US_EQ]: -0.03, [AssetType.IND_EQ]: -0.02, [AssetType.G_SEC]: 0.03, [AssetType.GOLD]: 0.01, [AssetType.CASH]: 0 },
    explanation: "Bottoming. The crash slowed down because the sellers are exhausted. Bonds rallied hard (prices up, yields down) because deflation + recession guarantees that interest rate cuts are imminent. Smart money accumulates bonds before the rate cut actually happens."
  },
  {
    id: 7,
    title: "The \"Freedom Dividend\" (UBI)",
    news: "Intel Report: History is made today. Facing social unrest and a deflationary spiral, the US and EU have jointly announced the implementation of a \"Freedom Dividend\"—a Universal Basic Income (UBI) funded by a new \"Robot Tax\" on automated labor and significant deficit spending. The Federal Reserve has announced it will monetize this debt, effectively printing money to put directly into citizens' pockets. Interest rates are slashed to near zero.\n\nIndia, facing similar youth unemployment pressures, announces a \"Direct Cash Transfer\" scheme for urban youth, funded by a windfall tax on energy and tech conglomerates.\n\nThe reaction in the markets is explosive. It is a \"Liquidity Supernova.\" The fear of deflation vanishes instantly, replaced by the joy of free money. Capital floods back into risk assets. The narrative shifts from \"Recession\" to \"Reflation.\"",
    macro: { gdp: '4.8% (Base)', repo: '5.5% (⬇️ MASSIVE CUT)', cpi: '0.0% (Stabilized)', vix: 25 },
    returns: { [AssetType.US_EQ]: 0.08, [AssetType.IND_EQ]: 0.06, [AssetType.G_SEC]: 0.04, [AssetType.GOLD]: 0.05, [AssetType.CASH]: 0 },
    explanation: "The \"Everything Rally.\" Rate cuts boosted Bonds (yields down). UBI (Money printing) boosted Stocks (liquidity) and Gold (fear of currency debasement). The market loves stimulus more than it hates bad economics."
  },
  {
    id: 8,
    title: "The Sugar High",
    news: "Intel Report: The stimulus has hit the veins of the economy. Consumer spending is exploding. UBI checks are hitting accounts, and retail sales have jumped 15% month-on-month. The \"White Collar Recession\" is technically over, not because jobs returned, but because income was replaced by the state.\n\nHowever, there is a massive supply-demand mismatch. Companies that survived the crash had liquidated their inventories and stopped production. Now, they face a wall of money with zero goods to sell. Prices for everything—from housing to groceries to digital services—start spiking violently.\n\nThe Bond Vigilantes—traders who police government fiscal discipline—are waking up. They see the massive deficits required to fund UBI and are starting to dump long-dated Treasuries. They question the solvency of the sovereign itself.",
    macro: { gdp: '6.0% (V-Shape Recovery)', repo: '5.5% (Holding low)', cpi: '3.5% (🚀 Spiking)', vix: 20 },
    returns: { [AssetType.US_EQ]: 0.05, [AssetType.IND_EQ]: 0.04, [AssetType.G_SEC]: -0.03, [AssetType.GOLD]: 0.02, [AssetType.CASH]: 0 },
    explanation: "Inflation Scare. Equities rallied on the demand story (Earnings are going up). But Bonds crashed because inflation erodes the value of fixed income, and the deficit scare caused investors to demand higher yields to hold government debt."
  },
  {
    id: 9,
    title: "The \"Bond Vigilante\" Revolt",
    news: "Intel Report: The \"Sugar High\" has turned into a stomach ache. Sovereign Debt Crisis fears have seized the narrative. The US 10-Year Treasury yield has spiked to 5% despite the Fed's short-term rates being low. The market is rejecting the \"UBI Debt.\" Lenders are essentially saying, \"If you print money to pay bills, we will devalue your bonds.\"\n\nThe US Dollar crashes against hard commodities. India faces a brutal bout of \"imported inflation.\" Oil and Gold are soaring in Rupee terms. The RBI is caught in a nightmare scenario: The economy is recovering, but inflation is running hot due to global factors. They have to decide: Hike rates to stop inflation (and kill the recovery) or let inflation run and destroy the currency?\n\nThe term \"Stagflation\" (Stagnant growth + Inflation) is back on every Bloomberg terminal.",
    macro: { gdp: '6.5% (Steady)', repo: '5.5%', cpi: '5.5% (Hot)', vix: 28 },
    returns: { [AssetType.US_EQ]: -0.04, [AssetType.IND_EQ]: -0.02, [AssetType.G_SEC]: -0.04, [AssetType.GOLD]: 0.06, [AssetType.CASH]: 0 },
    explanation: "Stagflation. Stocks hate high inflation combined with high yields because the \"discount rate\" used to value future cash flows goes up, lowering stock prices. Bonds crashed further as yields spiked. Gold went parabolic as the only asset retaining real value when both stocks and bonds are falling."
  },
  {
    id: 10,
    title: "The Productivity Payoff",
    news: "Intel Report: The chaos of the last year is finally yielding the promised fruit. Companies report that the messy AI integration of Round 1 and 2 has finally matured. Unit economics have fundamentally shifted; the cost of production has lowered enough to offset the inflationary pressures of the UBI era.\n\nSimultaneously, new industries are emerging from the ashes. \"Prompt Engineering,\" \"Robot Maintenance,\" and \"Personalized AI Curation\" are hiring aggressively. The labor market is tightening, reducing the reliance on UBI. Sensing the stabilization, the Government announces a \"Fiscal Consolidation\" plan to slowly reduce the deficit, calming the bond market.\n\nThe Fed and RBI seize this moment to hike rates slightly—not to crush growth, but to signal that the emergency is over. It is a \"confidence hike.\"",
    macro: { gdp: '6.8% (Robust)', repo: '5.75% (⬆️ Small Hike)', cpi: '4.0% (Peaking)', vix: 22 },
    returns: { [AssetType.US_EQ]: 0.03, [AssetType.IND_EQ]: 0.03, [AssetType.G_SEC]: 0.02, [AssetType.GOLD]: -0.02, [AssetType.CASH]: 0 },
    explanation: "Stabilization. Fiscal discipline calmed the bond market (Prices recovered). The rate hike was seen as a \"vote of confidence\" in the economy, boosting stocks. Gold saw profit-booking as the \"end of the world\" trade unwound."
  },
  {
    id: 11,
    title: "The India Alpha",
    news: "Intel Report: The world is witnessing a \"Great Decoupling.\" While the US and EU struggle with the hangover of their debt-funded UBI experiments, India is surging. With global supply chains fully re-routed to South Asia (a process that started in Round 2), India's GDP growth hits 8%.\n\nThe Rupee strengthens significantly as Foreign Institutional Investors (FIIs) return, but this time they aren't chasing liquidity—they are chasing \"Real Growth\" versus the West's \"Stimulus Growth.\" US markets are moving sideways, digesting the high valuations and the new interest rate reality. Indian Midcaps, however, are flying. The RBI signals a neutral stance, comfortable with the growth-inflation mix.",
    macro: { gdp: '7.5% (Boom)', repo: '6.0% (Normalization)', cpi: '3.0% (Cooling)', vix: 16 },
    returns: { [AssetType.US_EQ]: 0.00, [AssetType.IND_EQ]: 0.06, [AssetType.G_SEC]: 0.01, [AssetType.GOLD]: -0.01, [AssetType.CASH]: 0 },
    explanation: "Regional Divergence. The US market paused to digest its gains and adjust to the new normal. India outperformed massively based on fundamentals (GDP growth + FDI inflows). Bonds stabilized as inflation cooled, providing a stable backdrop."
  },
  {
    id: 12,
    title: "The New Golden Age",
    news: "Intel Report: We have reached the \"2029 Outlook.\" The \"Great Displacement\" is officially over. The global economy has successfully transitioned to an AI-Hybrid model. The frantic volatility of the previous years has smoothed into a steady hum of high productivity.\n\nInflation has returned to the 2% target, but it is \"Good Deflation\" (cheaper goods via technology) balanced by \"Good Inflation\" (wage growth in new sectors). Unemployment is frictional at 4%. The asset bubbles have been deflated, the fraud flushed out, and the debt monetized. The S&P 500 and Nifty 50 are trading at fair valuations based on real, high-quality earnings. The \"Zero Marginal Cost\" dream of Round 1 is finally here, but it took a decade of pain to build the infrastructure to support it.",
    macro: { gdp: '7.8% (Sustainable High Growth)', repo: '6.0% (Neutral)', cpi: '2.5% (Perfect)', vix: 12 },
    returns: { [AssetType.US_EQ]: 0.03, [AssetType.IND_EQ]: 0.04, [AssetType.G_SEC]: 0.00, [AssetType.GOLD]: -0.01, [AssetType.CASH]: 0 },
    explanation: "Normalization. A steady 'Goldilocks' end to the year. No massive swings, just steady compounding."
  }
];
