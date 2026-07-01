
import { AssetType, ScenarioRound, Portfolio } from './types';

export const INITIAL_FUND_SIZE = 100; // 100 Crores Total
export const MAX_ROUNDS = 3;
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
    content: "FakeX's AGI. Enjoys memes more than benchmarks. Unverified. His name is Groku. He is funnier than Claudius. Appears in Round 3."
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
    title: "Ilon Mush Posts at 3 AM",
    news: "Nobody was ready for this. At 3:17 AM on a Wednesday, Ilon Mush posts on his own platform FakeX: 'FakeX has had AGI for 6 months. We forgot to announce it. We were busy with the rocket. His name is Groku. He is funnier than Claudius. Also: I am now worth $4 quadrillion. First quadrillionaire in human history. You are welcome. More details later. Maybe.' By 3:45 AM, #GrokuAGI is the top trend in 60 countries. Scam Altman tweets: 'We are very happy for Ilon. We remain focused on real work.' Dario Amoeba does not tweet. Claudius tweets a single laughing emoji and then goes offline. Naresh Murthy — The Visionary, freshly minted AI CEO, riding the InfyAI wave — announces a strategic partnership with Groku. The press release uses the phrase 'quadrillionaire ecosystem synergies' without irony. Jetsun Pichoo cancels a family holiday and books a stage in New York. FinLand's markets are now pricing in the existence of two separate AGIs, one of which enjoys memes, and a man whose personal net worth contains a denomination that does not appear in any economics textbook yet.",
    macro: { fearIndex: 71, sentiment: 'ORANGE', valuation: '$80T', computeDemand: 'EXTREME' },
    returns: { 
        [AssetType.INFRA]: 0.06, 
        [AssetType.FMCG]: 0.03, 
        [AssetType.BFSI]: -0.03, 
        [AssetType.IT]: -0.04, 
        [AssetType.GOLD]: 0.06, 
        [AssetType.CASH]: 0 
    },
    explanation: "INFRA (+6%): Two AGIs. Double the data centres. The contractors of FinLand have never been this busy or this confused.\n\nFMCG (+3%): Panic-snacking makes a full comeback. The noodle industry quietly thanks Ilon Mush in a press release.\n\nBFSI (-3%): A man who invented his own unit of net worth is now technically a financial entity. FinLand's bankers stare at their screens. The screens stare back.\n\nIT (-4%): Profit booking after the Round 2 rally. Groku's arrival reopens the 'are we all going to be unemployed' debate that Scam Altman briefly closed.\n\nGold (+6%): Nobody knows what $4 quadrillion means in gold terms. They buy gold anyway. It always works when nothing else makes sense."
  }
];
