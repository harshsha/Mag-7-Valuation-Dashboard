
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  marketCap: string;
  peRatio: number;
  pbRatio: number;
  psRatio: number;
  forwardPe: number;
  dividendYield: number;
  revenueGrowth: number;
  ebitdaMargin: number;
  description: string;
  dcfValue: number;
  upsidePercent: number;
}

export interface ValuationAnalysis {
  stocks: StockData[];
  cheapestByPE: string;
  cheapestByPS: string;
  cheapestByPB: string;
  bestDcfUpside: string;
  overallValuePick: string;
  aiSummary: string;
  sources: Array<{ title: string; uri: string }>;
}

export enum ValuationMetric {
  PE = 'peRatio',
  PS = 'psRatio',
  PB = 'pbRatio',
  FORWARD_PE = 'forwardPe',
  DCF = 'dcfValue',
  UPSIDE = 'upsidePercent',
  EBITDA_MARGIN = 'ebitdaMargin'
}
