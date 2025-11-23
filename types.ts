export enum AssetType {
  IND_EQ = 'IND_EQ',
  US_EQ = 'US_EQ',
  G_SEC = 'G_SEC',
  GOLD = 'GOLD',
  CASH = 'CASH'
}

export interface ScenarioRound {
  id: number;
  title: string;
  news: string;
  macro: {
    gdp: string;
    repo: string;
    cpi: string;
    vix: number;
  };
  analyst: {
    bull: string;
    bear: string;
  };
  returns: {
    [key in AssetType]?: number; // Percentage as decimal (e.g. 0.05 for 5%)
  };
  explanation?: string;
}

export type Portfolio = Record<AssetType, number>;

export interface GameState {
  currentRound: number; // 0 is intro, 1-12 is game
  phase: 'INTRO' | 'STRATEGY' | 'EXECUTING' | 'RESULT' | 'GAME_OVER';
  portfolio: Portfolio;
  nav: number;
  history: Array<{ round: number; nav: number; benchmark: number }>;
  lastRoundReturn: number;
}

// Bauhaus Color Palette Helpers
export const COLORS = {
  bg: '#FDFBF7',
  black: '#000000',
  blue: '#1E3A8A',
  red: '#DC2626',
  yellow: '#EAB308',
  green: '#16A34A',
  gray: '#9CA3AF'
};