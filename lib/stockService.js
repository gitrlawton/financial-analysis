import "dotenv/config";
import yahooFinance from "yahoo-finance2";
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export async function fetchStockDetails(symbol) {
  const queryOptions = {
    modules: [
      "summaryDetail",
      "financialData",
      "price",
      "defaultKeyStatistics",
      "assetProfile",
      "summaryProfile",
    ],
  };

  try {
    const result = await yahooFinance.quoteSummary(symbol, queryOptions);
    return {
      symbol,
      name: result.price?.shortName || symbol,
      description: result.summaryProfile?.longBusinessSummary,
      marketCap: result.summaryDetail?.marketCap,
      volume: result.summaryDetail?.volume,
      sector: result.assetProfile?.sector || "Unknown",
      industry: result.assetProfile?.industry || "Unknown",
      country: result.assetProfile?.country || "Unknown",
    };
  } catch (error) {
    console.error(`Error fetching stock details for ${symbol}:`, error);
    return null;
  }
}

export async function searchStocksByIndustry(industry) {
  // Placeholder for future implementation of industry-based stock search
  console.warn("Industry search not yet implemented");
  return [];
}

export async function listNYSEStocks() {
  try {
    // Get the directory of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Construct the path to the JSON file
    const stocksFilePath = path.resolve(__dirname, '../nyse_stocks.json');

    // Read the JSON file
    const stocksData = await readFile(stocksFilePath, 'utf8');
    
    // Parse the JSON and return the list of stocks
    return JSON.parse(stocksData);
  } catch (error) {
    console.error('Error reading NYSE stocks:', error);
    return [];
  }
}
