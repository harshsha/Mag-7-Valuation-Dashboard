
import { GoogleGenAI, Type } from "@google/genai";
import { ValuationAnalysis, StockData } from "../types";

export const fetchMag7Data = async (): Promise<ValuationAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Provide current valuation metrics and a brief qualitative summary for the "Magnificent Seven" stocks: 
    Apple (AAPL), Microsoft (MSFT), Alphabet (GOOGL), Amazon (AMZN), Nvidia (NVDA), Meta (META), and Netflix (NFLX).
    
    IMPORTANT: Please verify the real-time stock price for Alphabet (GOOGL/GOOG) using current market data to ensure accuracy.
    
    Required metrics for each: 
    - Current Price (USD)
    - Market Cap (in human readable string like '3.2T')
    - P/E Ratio (Trailing)
    - P/B Ratio
    - P/S Ratio
    - Forward P/E
    - Dividend Yield (%)
    - Revenue Growth (%)
    - EBITDA Margin (%)
    - Estimated DCF Intrinsic Value (USD) - based on average analyst 10-year discounted cash flow models.
    - Potential Upside (%) - calculated as (DCF Value - Current Price) / Current Price * 100.
    - A 1-sentence description of their current market position.

    Additionally, identify which stock is currently the 'cheapest' based on P/E, P/S, and P/B individually.
    Identify the stock with the 'best DCF upside'.
    Synthesize an 'overall value pick' considering growth, DCF gap, and valuation.
    Provide a concise AI summary of the current Mag 7 landscape.
    
    Return the response in a structured JSON format matching the schema provided.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stocks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                name: { type: Type.STRING },
                price: { type: Type.NUMBER },
                marketCap: { type: Type.STRING },
                peRatio: { type: Type.NUMBER },
                pbRatio: { type: Type.NUMBER },
                psRatio: { type: Type.NUMBER },
                forwardPe: { type: Type.NUMBER },
                dividendYield: { type: Type.NUMBER },
                revenueGrowth: { type: Type.NUMBER },
                ebitdaMargin: { type: Type.NUMBER },
                dcfValue: { type: Type.NUMBER },
                upsidePercent: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["symbol", "name", "price", "marketCap", "peRatio", "pbRatio", "psRatio", "forwardPe", "dividendYield", "revenueGrowth", "ebitdaMargin", "dcfValue", "upsidePercent", "description"]
            }
          },
          cheapestByPE: { type: Type.STRING },
          cheapestByPS: { type: Type.STRING },
          cheapestByPB: { type: Type.STRING },
          bestDcfUpside: { type: Type.STRING },
          overallValuePick: { type: Type.STRING },
          aiSummary: { type: Type.STRING }
        },
        required: ["stocks", "cheapestByPE", "cheapestByPS", "cheapestByPB", "bestDcfUpside", "overallValuePick", "aiSummary"]
      }
    }
  });

  const rawText = response.text || "{}";
  const data = JSON.parse(rawText.trim());
  
  // Extract sources from grounding metadata
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Financial Data Source',
    uri: chunk.web?.uri || '#'
  })) || [];

  return {
    ...data,
    sources
  };
};
