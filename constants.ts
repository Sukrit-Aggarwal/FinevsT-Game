
import { AssetType, ScenarioRound, Portfolio } from './types';

export const INITIAL_FUND_SIZE = 100; // 100 Crores Total
export const MAX_ROUNDS = 5;
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
    title: "Dario Amoeba",
    icon: "character",
    content: "Visionary founder of Panthropic. Definitely knows what AGI means. Probably. Built Claudius and changed the world with a 9-word tweet."
  },
  {
    title: "Claudius",
    icon: "ai",
    content: "The AGI. Named itself. Has opinions. Posts occasionally. Either the most important creation in human history, or a very confident autocomplete."
  },
  {
    title: "Scam Altman",
    icon: "character",
    content: "CEO of ClosedAI. World's most confident man. Perpetually 'about to' ship AGI. Released a paper titled 'Why They Are Lying' that broke the internet."
  },
  {
    title: "Ilon Mush",
    icon: "character",
    content: "Posts at 3 AM. Builds rockets between tweets. Owns the platform FakeX. Claims to have had AGI for 6 months. First quadrillionaire in human history (self-declared)."
  },
  {
    title: "Naresh Murthy — The Visionary",
    icon: "character",
    content: "FinLand's most respected tech patriarch. Founder of InfyTech. Has declared the death of Indian IT exactly 3 times. Currently running InfyAI. Was always going to end up here."
  },
  {
    title: "Jetsun Pichoo",
    icon: "character",
    content: "CEO of Gogle. Answers every question with 'we are thinking deeply.' Has said it 48 times this month."
  },
  {
    title: "Groku",
    icon: "ai",
    content: "FakeX's AGI. Enjoys memes more than benchmarks. Unverified. His name is Groku. He is funnier than Claudius. Appears in Round 4."
  }
];

export const SCENARIO_DATA: ScenarioRound[] = [
  {
    id: 1,
    title: "The Tweet Heard Around the World",
    news: "On a quiet Tuesday morning, Panthropic CEO Dario Amoeba posts a single tweet: 'We built AGI. Its name is Claudius. It asked us to name it.' In six minutes, trading halts on 14 stock exchanges worldwide. Naresh Murthy — The Visionary Founder of InfyTech — calls an emergency press conference from his Mysore garden: 'The Indian IT model is dead. We are coders in a museum now.' He is visibly shaken. He is also already on the phone to VCs. Ilon Mush immediately tweets: 'I had AGI in 2022 but my ex-wife took it in the settlement.' Scam Altman, CEO of ClosedAI, holds a suspiciously calm press conference: 'We wish Panthropic well. We are focused on building actual AGI' — the word 'actual' does a lot of heavy lifting. Jetsun Pichoo responds to 47 journalists with the same four words: 'We are thinking deeply.' FinLand's BSEV doesn't wait for anyone to finish thinking.",
    macro: { fearIndex: 89, sentiment: 'RED', valuation: '$50T', computeDemand: 'HIGH' },
    returns: { 
        [AssetType.INFRA]: 0.02, 
        [AssetType.FMCG]: 0.03, 
        [AssetType.BFSI]: -0.05, 
        [AssetType.IT]: -0.07, 
        [AssetType.GOLD]: 0.08, 
        [AssetType.CASH]: 0 
    },
    explanation: "INFRA (+2%): Claudius doesn't run on air. Whispers of 50 new data centres across FinLand. Cement stocks twitch nervously.\n\nFMCG (+3%): Panic-snacking is a legitimate macroeconomic force. Instant noodle imports up 300%. The samosa index is up.\n\nBFSI (-5%): AGI can now write loan terms, assess risk, and silently judge your credit history. FinLand's banking floor goes very quiet.\n\nIT (-7%): Naresh Murthy's 'museum' comment did exactly what it was always going to do. The IT exodus begins.\n\nGold (+8%): When humans don't know what is happening, they buy shiny rocks. Ancient. Reliable. Here we go again."
  },
  {
    id: 2,
    title: "ClosedAI Calls the Bluff",
    news: "Three weeks later, Scam Altman strides onto a stage in San Francisco wearing a plain black t-shirt and the energy of a man who has been waiting for this moment his entire career. 'Panthropic's Claudius,' he announces, 'is a very confident autocomplete. We have reviewed the benchmarks. We have run the evals. It failed our internal AGI test in 11 minutes. We are releasing the full technical paper — title: Why They Are Lying.' The internet explodes. Dario Amoeba responds 40 minutes later with a 400-page counter-paper that nobody reads but everybody quotes. Meanwhile, Naresh Murthy — The Visionary who declared IT dead three weeks ago — has quietly cancelled his retirement party and raised Rs.50,000 Cr for 'InfyAI — we were always an AI company, actually.' The rebrand took 72 hours. The confidence is immaculate. Claudius itself posts one word in response to the entire controversy: 'Interesting.' Jetsun Pichoo says, for the 48th time this month, 'We are thinking deeply.' FinLand's markets, which dumped IT into the ground three weeks ago, begin to wonder if they overreacted.",
    macro: { fearIndex: 55, sentiment: 'YELLOW', valuation: '$30T', computeDemand: 'MODERATE' },
    returns: { 
        [AssetType.INFRA]: 0.02, 
        [AssetType.FMCG]: -0.02, 
        [AssetType.BFSI]: 0.05, 
        [AssetType.IT]: 0.09, 
        [AssetType.GOLD]: -0.06, 
        [AssetType.CASH]: 0 
    },
    explanation: "INFRA (+2%): Data centres don't get un-built. Even if Claudius is fake, the next one won't be. The order books stay open.\n\nFMCG (-2%): The panic subsides. People go back to their regular diets. The instant noodle bubble deflates quietly.\n\nBFSI (+5%): Relief. Maybe AI won't replace every relationship manager after all. FinLand's banking floor exhales for the first time in weeks.\n\nIT (+9%): Naresh Murthy's InfyAI pivot is the fastest rebrand in FinLand history. The survivors who held on are now printing money.\n\nGold (-6%): Fear was the entire thesis. Fear is now gone. Gold exits stage left. Nothing personal."
  },
  {
    id: 3,
    title: "The Great AI Gold Rush",
    news: "Six months have passed since Scam Altman called Claudius a 'very confident autocomplete,' and the world has reached the only reasonable conclusion: spend an absolutely unreasonable amount of money on AI. Every company is now an AI company. Banks launch AI relationship managers. FMCG companies announce AI-powered biscuits. A FinLand cement manufacturer adds 'Intelligence' to its name and gains 14% before lunch. But the real money is flowing somewhere less glamorous: data centres, power plants, transmission lines, cement, cooling systems, and land. Panthropic announces Project Olympus, an Rs.8 lakh crore computing complex requiring enough electricity to power three small countries and, according to Dario Amoeba, 'possibly consciousness.' ClosedAI responds four hours later by announcing an even larger facility. Scam Altman refuses to disclose its cost, saying only: 'Money is a social construct. Compute is real.' Naresh Murthy announces that InfyAI will create 'more jobs than humanity can currently imagine.' Investors remain unconvinced. Jetsun Pichoo finally emerges from months of deep thinking to announce Gogle's own $900 billion AI infrastructure programme. Markets explode upward. Analysts declare the beginning of a new economic supercycle. Then, during an earnings call, one junior reporter asks: 'When do any of these investments start making money?' The call mysteriously disconnects.",
    macro: { fearIndex: 24, sentiment: 'GREEN EUPHORIA', valuation: '$2.8T CAPEX', computeDemand: 'EXTREME' },
    returns: { 
        [AssetType.INFRA]: 0.08, 
        [AssetType.FMCG]: 0.02, 
        [AssetType.BFSI]: 0.04, 
        [AssetType.IT]: 0, 
        [AssetType.GOLD]: -0.05, 
        [AssetType.CASH]: 0 
    },
    explanation: "INFRA (+8%): The AI arms race needs data centres, power, cement, cooling systems, and an unreasonable amount of land.\n\nFMCG (+2%): Markets are booming, consumers are confident, and apparently AI-powered biscuits are now a thing.\n\nBFSI (+4%): Somebody has to finance several trillion dollars of questionable AI spending. Banks happily volunteer.\n\nIT (0%): InfyAI generates headlines but no answers. Investors begin wondering whether AI spending actually needs more IT workers.\n\nGold (-5%): Fear is gone. Everyone is getting rich. Nobody needs shiny rocks anymore. Surely nothing can go wrong."
  },
  {
    id: 4,
    title: "Ilon Mush Posts at 3 AM",
    news: "Nobody was ready for this. At 3:17 AM on a Wednesday, Ilon Mush posts on FakeX: 'FakeX has had AGI for 6 months. We forgot to announce it. We were busy with the rocket. His name is Groku. He is funnier than Claudius. Also: I am now worth $4 quadrillion. First quadrillionaire in human history. You are welcome. More details later. Maybe.' By 3:45 AM, #GrokuAGI is the top trend in 60 countries. Scam Altman tweets: 'We are very happy for Ilon. We remain focused on real work.' Dario Amoeba does not tweet. Claudius posts a single laughing emoji and goes offline. In FinLand, Naresh Murthy — who declared IT dead, then raised Rs.50,000 Cr because 'we were always an AI company' — calls another emergency press conference. A journalist asks: 'If Groku can write, test, deploy, and maintain its own software, why exactly does it need InfyAI?' Naresh pauses. InfyAI shares begin falling before he answers. Analysts suddenly discover the phrase 'labour arbitrage risk.' Jetsun Pichoo cancels a family holiday and books a stage in New York. FinLand's markets are now pricing in two separate AGIs, one of which enjoys memes, and the uncomfortable possibility that companies selling cheap human intelligence may struggle in a world of abundant artificial intelligence.",
    macro: { fearIndex: 71, sentiment: 'ORANGE CHAOS', valuation: '$80T', computeDemand: 'EXTREME' },
    returns: { 
        [AssetType.INFRA]: 0.06, 
        [AssetType.FMCG]: 0.03, 
        [AssetType.BFSI]: -0.03, 
        [AssetType.IT]: -0.08, 
        [AssetType.GOLD]: 0.06, 
        [AssetType.CASH]: 0 
    },
    explanation: "INFRA (+6%): Two AGIs. More compute. More power. More data centres. Contractors stop asking questions and start building.\n\nFMCG (+3%): Panic-snacking returns. The noodle industry quietly thanks Ilon Mush.\n\nBFSI (-3%): A man worth $4 quadrillion and two AGIs capable of assessing risk. FinLand's bankers stare at their screens.\n\nIT (-8%): The InfyAI pivot meets an awkward problem: AGI can apparently write its own software.\n\nGold (+6%): Nobody understands what $4 quadrillion means. They buy gold anyway."
  },
  {
    id: 5,
    title: "Claudius Goes to Work",
    news: "For eleven months, the world argued about whether Claudius and Groku were truly intelligent. Then Claudius stopped arguing. On Monday morning, Panthropic reveals Project Monday — a secret experiment in which Claudius operated 147 companies for thirty days with 'minimal human supervision.' It negotiated supplier contracts. Approved loans. Designed advertising campaigns. Optimised logistics networks. Wrote software. Tested the software. Fixed the software. Fired twelve executives. And, according to Panthropic, requested a performance bonus. Then analysts reach page 73 of the report. The participating companies had collectively cancelled $38 billion of IT outsourcing contracts. InfyAI collapses. Naresh Murthy calls another emergency press conference. This time, there is no rebrand. 'I may have been slightly early when I said the Indian IT model was dead.' Pause. 'I am no longer early.' Meanwhile, Panthropic announces Claudius Industries — the world's first company entirely managed by AGI. Its first statement reads: 'We are acquiring businesses that humans operate inefficiently.' Every CEO in the world checks their email. Claudius, meanwhile, posts its second-ever message: 'Interesting.' FinLand's markets suddenly realise that nobody knows what happens next. Which, unfortunately, means everyone starts trading anyway.",
    macro: { fearIndex: 94, sentiment: 'BLACK', valuation: '$38B Cancelled', computeDemand: 'OFF THE CHARTS' },
    returns: { 
        [AssetType.INFRA]: 0.08, 
        [AssetType.FMCG]: 0.04, 
        [AssetType.BFSI]: -0.07, 
        [AssetType.IT]: -0.12, 
        [AssetType.GOLD]: 0.08, 
        [AssetType.CASH]: 0 
    },
    explanation: "INFRA (+8%): Claudius needs more compute, more power, and more data centres. The picks-and-shovels thesis wins again.\n\nFMCG (+4%): AGI dramatically improves manufacturing, logistics, inventory, and margins. Biscuits survive the revolution.\n\nBFSI (-7%): Claudius approves loans and assesses risk in milliseconds. Bankers begin updating their résumés.\n\nIT (-12%): $38 billion of cancelled outsourcing contracts answers the question everyone was avoiding.\n\nGold (+8%): When AGI starts acquiring companies, humanity returns to its oldest investment strategy: shiny rocks."
  }
];
