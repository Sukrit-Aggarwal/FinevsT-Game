
import { AssetType, ScenarioRound, Portfolio } from './types';

export const INITIAL_FUND_SIZE = 100; // 100 Crores Total
export const MAX_ROUNDS = 15;
export const SELL_LIMIT_AMOUNT = 25; // 25 Crores fixed selling limit per round

// Starting allocation: Balanced Sectoral Split + Gold + Cash
export const INITIAL_PORTFOLIO_CONFIG: Portfolio = {
  [AssetType.INFRA]: 20,
  [AssetType.FMCG]: 20,
  [AssetType.BFSI]: 20,
  [AssetType.IT]: 20,
  [AssetType.GOLD]: 10,
  [AssetType.CASH]: 10
};

export const ASSET_LABELS: Record<AssetType, string> = {
  [AssetType.INFRA]: 'Infrastructure (INFRA)',
  [AssetType.FMCG]: 'Consumer Goods (FMCG)',
  [AssetType.BFSI]: 'Banking & Finance (BFSI)',
  [AssetType.IT]: 'Tech & Services (IT)',
  [AssetType.GOLD]: 'Gold (XAU)',
  [AssetType.CASH]: 'Cash (INR)'
};

export const EDUCATIONAL_MODULES = [
  {
    title: "1. Macro Basics: Inflation & Rates",
    icon: "macro",
    content: "The economy is a cycle. When 'Inflation' (prices) rises, Central Banks (RBI) raise 'Interest Rates'. \n\n• High Rates = Expensive loans -> Hurts Capex Sectors (Infra) -> Inflation Cools.\n• Low Rates = Cheap money -> Boosts Banking & Infra -> Risk of Inflation.\n\nWatch the CPI (Inflation) and Repo (Rates) data closely."
  },
  {
    title: "2. Sector Sensitivity: Interest Rates",
    icon: "bonds",
    content: "The Sovereign Bond Seesaw. Different sectors react differently to Interest Rates:\n\n• BFSI (Banks): Generally benefit from higher rates (can charge more for loans), IF bad loans don't spike.\n• INFRA: Hates high rates. They borrow huge amounts to build; high rates destroy their margins.\n• FMCG: Defensive. People buy toothpaste even in a recession, but high inflation hurts their raw material costs."
  },
  {
    title: "3. Currency & Exports (IT)",
    icon: "equities",
    content: "The IT Sector in FinLand exports services to the world and earns in Dollars.\n\n• Weak Rupee = Good for IT (Their Dollar earnings convert to MORE Rupees).\n• Strong Rupee = Bad for IT.\n\nAlso, IT is 'Defensive'. When the domestic economy (FinLand) is in chaos, investors hide in IT."
  },
  {
    title: "4. Gold: The Crisis Hedge",
    icon: "gold",
    content: "Gold pays no interest and produces nothing. It is a 'Store of Value', though its price fluctuates based on market demand and supply.\n\nInvestors buy Gold when they are scared of:\n1. Currency Collapse (Printing too much money).\n2. Governance Fraud (Scams).\n3. Civil Unrest."
  },
  {
    title: "5. The Objective: Absolute Return",
    icon: "target",
    content: "Your goal is simple: MAXIMIZE ABSOLUTE RETURNS.\n\nNavigate the chaos of King Ajit's decrees. Rotate capital from dying sectors to booming ones. The fund manager with the highest Final NAV (Net Asset Value) wins.\n\nCash Flow is King."
  }
];

export const SCENARIO_DATA: ScenarioRound[] = [
  {
    id: 1,
    title: "The Royal 'Hangover' Decree",
    news: "The Kingdom of FinLand woke up to a bizarre proclamation. King Ajit, nursing a legendary hangover from last night's 'Royal Soma' party, declared that his current palace 'lacks feng shui' and creates 'bad vibes.' In a decree signed on a napkin, he has ordered the immediate construction of 'Ajit-Atlantis'—a floating city on the FinLand Lake, complete with gold-plated water slides. \n\nIshan (the Infra Kingpin) was seen sprinting out of the palace, high-fiving the Royal Treasurer, clutching a massive contract scroll. However, whispers in the tea stalls suggest the Royal Treasury is actually empty. To distract the public from the inevitable taxes, Ajit has simultaneously announced 'Free Biryani Fridays' for the next year. While the public cheers, Sameep (the Banking Mafia) was spotted sitting in a dark corner of the Cricket Club, sipping green tea with a terrifyingly calm smile, refusing to comment on how this madness will be funded. Is this a construction boom or a fiscal disaster waiting to happen?",
    macro: { gdp: '6.0% (Base)', repo: '6.0%', cpi: '4.0%', vix: 14 },
    returns: { 
        [AssetType.INFRA]: 0.12, 
        [AssetType.FMCG]: 0.08, 
        [AssetType.BFSI]: 0.02, 
        [AssetType.IT]: 0.01, 
        [AssetType.GOLD]: -0.02, 
        [AssetType.CASH]: 0 
    },
    explanation: "Capex Boom + Consumption Spree. Despite the funding doubts, the market priced in the immediate order book expansion for Infra (Ishan's win). The 'Free Biryani' acted as a massive fiscal stimulus, boosting FMCG consumption. Banks saw mild growth on hopes of financing, but Gold dipped as risk-appetite returned."
  },
  {
    id: 2,
    title: "The Loan Shark's 'Helping' Hand",
    news: "Reality has hit Ishan hard. Building a floating city costs money, and the King has none. Enter Sameep. In a closed-door meeting that reportedly lasted 14 hours, Sameep's bank consortium agreed to bankroll 'Ajit-Atlantis.' The catch? The interest rate is 'Floating' (pun intended), linked directly to Sameep's mood, and Ishan has pledged his entire family's mineral reserves as collateral. \n\nThe markets are flooded with new credit. Money is cheap and flowing like water. However, there is a disturbance in the underbelly. Sahil, the Hitman, has been seen purchasing massive amounts of encrypted servers and cloud storage. He claims it's for 'HR Management' of his assassins, but analysts suspect the underworld is digitizing its operations to evade the new surveillance systems Sameep is installing in his banks. A weird divergence is forming.",
    macro: { gdp: '6.5% (Rising)', repo: '6.0%', cpi: '4.2%', vix: 16 },
    returns: { 
        [AssetType.INFRA]: 0.03, 
        [AssetType.FMCG]: 0.01, 
        [AssetType.BFSI]: 0.10, 
        [AssetType.IT]: 0.05, 
        [AssetType.GOLD]: -0.01, 
        [AssetType.CASH]: 0 
    },
    explanation: "Credit Expansion. Sameep's aggressive lending expanded the loan book, causing a massive rally in BFSI. IT saw a bump not from corporate spend, but from the 'Shadow Economy' (Sahil) digitizing. Infra growth slowed as smart money realized Ishan is now heavily leveraged."
  },
  {
    id: 3,
    title: "BD's Bollywood Blockbuster",
    news: "Chief Justice BD has entered the chat, and he is feeling dramatic. During a casual morning walk near FinLand Lake, a drop of muddy water ruined his white sneakers. Enraged, he opened a Suo-Moto court case right there on the sidewalk. Quoting the movie *Deewar*, he thundered at Ishan's lawyers: 'Mere paas bangla hai, gaadi hai, bank balance hai... kya tumhare paas Environmental Clearance hai?' \n\nThe answer was no. BD has issued an immediate 'Stay Order' on the Atlantis project. Bulldozers have stopped. Ishan is reportedly crying in the King's lap. Sameep is furious—his massive loan to Ishan is now at risk of becoming a Non-Performing Asset (NPA). The King has locked himself in his room, listening to sad breakup songs. The euphoria is dead.",
    macro: { gdp: '5.8% (Stalling)', repo: '6.0%', cpi: '4.0%', vix: 28 },
    returns: { 
        [AssetType.INFRA]: -0.15, 
        [AssetType.FMCG]: -0.02, 
        [AssetType.BFSI]: -0.12, 
        [AssetType.IT]: 0.02, 
        [AssetType.GOLD]: 0.06, 
        [AssetType.CASH]: 0 
    },
    explanation: "Regulatory Shock. BD's order killed the project, crashing INFRA instantly. This created a systemic risk for Banks (BFSI) holding Ishan's toxic debt. Capital fled to safety (GOLD) and defensive exports (IT), avoiding the domestic mess."
  },
  {
    id: 4,
    title: "Sahil Cleans the 'Mess'",
    news: "A key witness, 'Honest Makarand', who was testifying about Ishan's illegal sand mining, has mysteriously 'gone on a permanent vacation' to the bottom of the lake. Sahil's agency issued a press release stating, 'We facilitate work-life balance, mostly the end of life part.' \n\nPanic has gripped FinLand. The rule of law has evaporated. Foreign Institutional Investors (FIIs) are selling everything that isn't nailed down. The FinLand Rupee is crashing against the Dollar. King Ajit tried to calm the nation by performing a magic trick on live TV, but he accidentally set the stage curtain on fire. Riots have broken out in the industrial belt. In times of total anarchy, paper money feels worthless.",
    macro: { gdp: '5.2% (Falling)', repo: '6.25% (Hike fear)', cpi: '5.5%', vix: 40 },
    returns: { 
        [AssetType.INFRA]: -0.05, 
        [AssetType.FMCG]: -0.06, 
        [AssetType.BFSI]: -0.08, 
        [AssetType.IT]: 0.08, 
        [AssetType.GOLD]: 0.12, 
        [AssetType.CASH]: 0 
    },
    explanation: "Geopolitical/Internal Instability. Domestic sectors (FMCG, BFSI, INFRA) bled due to riots and governance failure. However, currency depreciation acted as a massive boost for IT (exporters earn in dollars, spend in crashed rupees). Gold skyrocketed as the ultimate fear trade."
  },
  {
    id: 5,
    title: "The Royal 'Siesta' (Lockdown)",
    news: "To stop the riots (and because he is tired of the noise), King Ajit has declared a nationwide Martial Law, rebranding it as 'The Great Royal Siesta.' No one is allowed to leave their house. The streets are empty. The factories are silent. \n\nHowever, humans get bored. With the population stuck indoors, internet traffic in FinLand has spiked 500%. Everyone is ordering virtual goods, streaming 'FinLand Idol', and trading crypto. Ishan, showing his survival instincts, has pivoted his stalled construction crews to laying fiber-optic cables overnight. Sameep is lobbying for digital payments to be made mandatory. The physical world has stopped, but the digital world is on fire.",
    macro: { gdp: '5.0% (Low)', repo: '6.0%', cpi: '3.0%', vix: 22 },
    returns: { 
        [AssetType.INFRA]: 0.04, 
        [AssetType.FMCG]: 0.02, 
        [AssetType.BFSI]: 0.01, 
        [AssetType.IT]: 0.15, 
        [AssetType.GOLD]: -0.02, 
        [AssetType.CASH]: 0 
    },
    explanation: "Sector Rotation. The lockdown benefitted digital consumption disproportionately (IT Boom). Ishan's pivot to Telecom/Data Infra saved the INFRA index from further collapse. FMCG stayed flat (essential goods only). Gold cooled off as the riots stopped."
  },
  {
    id: 6,
    title: "Sameep's Inflation Trap",
    news: "The 'Royal Siesta' broke the supply chains. The price of onions, milk, and chai has tripled. Inflation is hitting 8%, and the common man is screaming. \n\nSameep (Banking Mafia) sees an opportunity. He invites the Central Bank Governor for a 'friendly dinner' (surrounded by Sahil's guards) and convinces him that the only way to save the economy is to Hike Interest Rates massively. Sameep claims this will 'tame inflation,' but privately he knows this will allow him to charge 15% on loans while paying depositors only 4%. It's a margin expansion masterclass. Borrowing costs are about to destroy anyone with debt.",
    macro: { gdp: '5.5%', repo: '7.5% (Spike)', cpi: '8.0% (High)', vix: 18 },
    returns: { 
        [AssetType.INFRA]: -0.08, 
        [AssetType.FMCG]: -0.04, 
        [AssetType.BFSI]: 0.08, 
        [AssetType.IT]: 0.01, 
        [AssetType.GOLD]: 0.03, 
        [AssetType.CASH]: 0 
    },
    explanation: "Rate Sensitive Shock. High interest rates crushed capital-intensive sectors like INFRA (high debt cost) and FMCG (lower consumer spending power). However, Banks (BFSI) profited massively as they passed high rates to borrowers immediately but lagged in paying savers (NIM Expansion)."
  },
  {
    id: 7,
    title: "King Ajit's 'Money Gun'",
    news: "King Ajit is sad that people are angry about onion prices and high loan rates. He calls his advisors and asks, 'Why don't we just print more money?' Before the economists can object, Ajit fires up the Royal Printing Press. \n\nHe announces the 'Ajit-Dhan Yojna': Airdropping cash packets from helicopters over the slums. Chief Justice BD tries to intervene, quoting *Hera Pheri*: 'Paisa hi Paisa hoga!' but gets distracted by a fresh plate of jalebis. The liquidity injection floods the market. People have cash, but there are no goods to buy. The currency is losing value by the minute.",
    macro: { gdp: '6.2% (Artificial Boost)', repo: '7.5%', cpi: '9.5% (Hyper)', vix: 25 },
    returns: { 
        [AssetType.INFRA]: 0.02, 
        [AssetType.FMCG]: 0.14, 
        [AssetType.BFSI]: 0.05, 
        [AssetType.IT]: -0.02, 
        [AssetType.GOLD]: 0.08, 
        [AssetType.CASH]: 0 
    },
    explanation: "Liquidity Injection/Inflation Trade. Free money went straight to consumption, causing an FMCG Boom. However, reckless money printing devalued the currency, causing a massive rally in GOLD (inflation hedge). IT dipped slightly as foreign investors feared currency manipulation."
  },
  {
    id: 8,
    title: "Ishan Strikes 'Liquid Gold'",
    news: "While digging illegal underground tunnels to hide Sahil's weapons stockpile, Ishan's crew accidentally struck something glowing. It wasn't water. It was a massive, high-grade Lithium reserve. \n\nKing Ajit immediately declares FinLand the 'Battery Capital of the Universe.' Global EV giants (Tesla, BYD) are landing their private jets in FinLand. The Royal Rupee strengthens violently as foreign dollars flood in to buy the Lithium. Ishan's stock goes parabolic. The export potential is so huge that it threatens to make other export sectors uncompetitive.",
    macro: { gdp: '7.5% (Boom)', repo: '7.0%', cpi: '6.0%', vix: 15 },
    returns: { 
        [AssetType.INFRA]: 0.20, 
        [AssetType.FMCG]: 0.03, 
        [AssetType.BFSI]: 0.06, 
        [AssetType.IT]: -0.05, 
        [AssetType.GOLD]: -0.04, 
        [AssetType.CASH]: 0 
    },
    explanation: "Commodity Super-cycle / Dutch Disease. Discovery of assets boosted INFRA/Mining massively. However, the massive inflow of dollars strengthened the Rupee, creating 'Dutch Disease' which hurt IT exporters (who lose competitiveness). Gold fell as risk-on sentiment returned."
  },
  {
    id: 9,
    title: "The Judicial 'Clean Up'",
    news: "Chief Justice BD has had enough of the Lithium party. He has watched *Gangs of Wasseypur* last night and woke up choosing violence. He quotes: 'Keh ke lenge.' \n\nHe orders a forensic audit of the 'Lithium Discovery.' The findings are shocking: The 'Lithium' was actually just painted rocks. Ishan faked the discovery to pump his stock. Sameep helped him rig the valuation. Sahil silenced the geologists. It is a massive fraud. Sameep is arrested (briefly). Banking licenses are cancelled. Foreign investors feel cheated and flee. The market enters a free fall.",
    macro: { gdp: '6.0%', repo: '7.0%', cpi: '5.0%', vix: 50 },
    returns: { 
        [AssetType.INFRA]: -0.10, 
        [AssetType.FMCG]: -0.05, 
        [AssetType.BFSI]: -0.20, 
        [AssetType.IT]: 0.05, 
        [AssetType.GOLD]: 0.10, 
        [AssetType.CASH]: 0 
    },
    explanation: "Governance Crisis / Fraud. BFSI crashed hardest due to the audit/fraud revelation. Contagion hit everyone. Smart money hid in IT (Dollar safety) and GOLD. This is a classic 'Flight to Safety' amid a scam."
  },
  {
    id: 10,
    title: "The Grand Compromise",
    news: "King Ajit realizes he might be dethroned if the stock market goes to zero. He calls a secret meeting in the Royal Jacuzzi. \n\nHe bribes BD with a lifetime subscription to Netflix (Premium Plan). He releases Sameep from jail. He gives Ishan a 'Innovation Medal' for his creative geology. Stability is forced back into the system. The King announces 'Vision 2030'—a vague plan to do 'good things.' The market, tired of the drama and seeing rock-bottom valuations, breathes a sigh of relief. Bargain hunters emerge from the rubble.",
    macro: { gdp: '6.8% (Recovering)', repo: '6.5%', cpi: '4.5%', vix: 12 },
    returns: { 
        [AssetType.INFRA]: 0.05, 
        [AssetType.FMCG]: 0.04, 
        [AssetType.BFSI]: 0.06, 
        [AssetType.IT]: 0.02, 
        [AssetType.GOLD]: -0.03, 
        [AssetType.CASH]: 0 
    },
    explanation: "Mean Reversion / Relief Rally. As political risk vanished, the battered sectors (BFSI, INFRA) saw a sharp relief rally. Gold created a top as fear dissipated. The simulation ends on a 'Goldilocks' recovery note."
  },
  {
    id: 11,
    title: "The 'Golden Pen' Rumor Mill",
    news: "The market woke up to a scandalous revelation about the Round 9 'Clean Up.' It turns out, justice wasn't blind; it was just expensive. While Sameep was being handcuffed and dragged to jail back then, Ishan had secretly met Chief Justice BD in a back alley and gifted him a legendary 'Golden Pen' encrusted with rare diamonds. This bribe is what kept Ishan's name out of the police files while Sameep took the fall.\n\nSameep, now out on bail, found out about this betrayal last night. Enraged and drunk at a wild penthouse party, he screamed that he would 'erase' Ishan. By morning, this drunken rant morphed into a viral WhatsApp forward claiming Sameep has liquidated assets to hire Sahil (The Hitman) to target Ishan's executives. Rumors of mass resignations are flying. The market is paralyzed—investors are unsure if this is a real gang war or just a hangover-induced exaggeration.",
    macro: { gdp: '6.0% (Choppy)', repo: '6.5%', cpi: '4.8%', vix: 22 },
    returns: { 
        [AssetType.INFRA]: -0.03, 
        [AssetType.FMCG]: 0.00, 
        [AssetType.BFSI]: -0.02, 
        [AssetType.IT]: 0.00, 
        [AssetType.GOLD]: 0.02, 
        [AssetType.CASH]: 0 
    },
    explanation: "Rumor-Driven Volatility. The backstory of corruption shook investor confidence in governance. However, smart money realized the 'Hitman' talk was likely noise from the party. Infra and BFSI dipped slightly on 'Headline Risk,' while Gold saw a tiny bump from retail investors panicking over the fake news."
  },
  {
    id: 12,
    title: "Operation 'Dark Grid'",
    news: "Morning brings clarity... and darkness. First, the good news: The 'Hitman' rumors were a hoax. Sameep issued a press release (while nursing a headache) clarifying he loves Ishan like a brother. Sahil posted a selfie from a beach in Bali. The market breathed a sigh of relief. \n\nThen, the bad news: Sameep didn't hire hitmen; he hired hackers. Suddenly, the entire FinLand PowerGrid (owned by Ishan) goes dark. It's a massive cyber-attack. Factories stop. ATMs go blank. King Ajit is furious because his cartoon stream died. The physical war was fake, but the infrastructure collapse is real. In corporate boardrooms, the realization hits: 'We need better firewalls.'",
    macro: { gdp: '5.5% (Grid Shock)', repo: '6.5%', cpi: '5.2%', vix: 35 },
    returns: { 
        [AssetType.INFRA]: -0.10, 
        [AssetType.FMCG]: -0.05, 
        [AssetType.BFSI]: -0.08, 
        [AssetType.IT]: -0.03, 
        [AssetType.GOLD]: 0.05, 
        [AssetType.CASH]: 0 
    },
    explanation: "Infrastructure Failure. The grid collapse devastated the real economy. Factories couldn't produce (FMCG/Infra down), and Banks couldn't transact (BFSI down). IT also dipped slightly due to the power outage, despite the long-term bullish case for cybersecurity building up. Gold shone as the safe haven."
  },
  {
    id: 13,
    title: "King Ajit's 'FinLand-Palooza'",
    news: "Power is restored! To apologize for the inconvenience, King Ajit announces 'FinLand-Palooza,' a mandatory 3-day music and shopping festival funded by the Royal Treasury. He invites global pop stars, sets up millions of food stalls, and declares a 'Tax-Free Shopping Week.' The streets are flooded with tourists and merchandise.\n\nWhile the public parties, the corporate sector is strangely quiet. CEOs are not seen at the concert; they are huddled in emergency board meetings late into the night. They are terrified of another blackout and are aggressively signing contracts to 'modernize' their back-end systems. The checkbooks are open, and they aren't buying samosas—they are buying insurance against the darkness.",
    macro: { gdp: '6.2% (Recovering)', repo: '6.5%', cpi: '5.8%', vix: 18 },
    returns: { 
        [AssetType.INFRA]: 0.01, 
        [AssetType.FMCG]: 0.12, 
        [AssetType.BFSI]: 0.03, 
        [AssetType.IT]: 0.20, 
        [AssetType.GOLD]: -0.04, 
        [AssetType.CASH]: 0 
    },
    explanation: "The Hidden Tech Boom. The festival boosted FMCG/Consumption visibly. But the real winner was IT, which surged on the silent but massive 'Cybersecurity Super-cycle' triggered by the previous round's attack. While the retail crowd bought burgers, the corporate crowd bought Firewalls."
  },
  {
    id: 14,
    title: "The Oligarchs' Truce",
    news: "Ishan and Sameep have finally met for tea (green tea, to calm the nerves). They realized that hiring hackers and hitmen is costing them more money than they are making. In a historic moment, they hug it out. They announce a 'Joint Venture' to modernize FinLand's economy. The war is over. \n\nHowever, peace is bad for some businesses. Sahil (The Hitman) is furious as his contracts are cancelled. Chief Justice BD is visibly upset during a press conference, quoting *Sholay*: 'Sannata kyun hai bhai?' (Why is there so much silence?). He complains that without corporate feuds, his court—and his bribes—will dry up. He hints that 'Peace is boring for the GDP,' but the markets disagree. Stability is back.",
    macro: { gdp: '7.0% (Stable)', repo: '6.25%', cpi: '4.5%', vix: 12 },
    returns: { 
        [AssetType.INFRA]: 0.15, 
        [AssetType.FMCG]: 0.05, 
        [AssetType.BFSI]: 0.18, 
        [AssetType.IT]: 0.02, 
        [AssetType.GOLD]: -0.06, 
        [AssetType.CASH]: 0 
    },
    explanation: "The Peace Dividend. The end of the Oligarch War triggered a massive re-rating in their respective sectors (INFRA and BFSI). Risk premiums vanished. Gold crashed as fear evaporated. BD's unhappiness signals a drop in corruption costs, which is bullish for equity."
  },
  {
    id: 15,
    title: "The 'Wisdom' of King Ajit",
    news: "In the season finale, King Ajit visits the construction site of 'Ajit-Atlantis.' He sees the half-built pillars, the escalating bills, and the sheer headache of managing a floating city. He turns to his advisors and says, 'You know what? I prefer solid ground. This project is giving me seasickness.' \n\nHe halts the project 'indefinitely.' Instead, he announces a 'Fiscal Prudence' package to pay off the kingdom's debts. The dream of the floating palace is dead, but the nightmare of bankruptcy is also over. FinLand ends the year with boring, solid, predictable governance. The wild ride is over.",
    macro: { gdp: '7.5% (Solid)', repo: '6.0%', cpi: '4.0%', vix: 10 },
    returns: { 
        [AssetType.INFRA]: -0.05, 
        [AssetType.FMCG]: 0.03, 
        [AssetType.BFSI]: 0.05, 
        [AssetType.IT]: 0.04, 
        [AssetType.GOLD]: -0.01, 
        [AssetType.CASH]: 0 
    },
    explanation: "Fiscal Consolidation. Cancelling the mega-project hurt INFRA (lost contracts) in the short term, but saved the economy from long-term debt ruin. BFSI and broad markets rallied on the improved sovereign rating. A sensible end to a crazy decade."
  }
];
