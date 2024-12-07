import "dotenv/config";
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { fetchStockDetails } from '../lib/stockService.js';
import { generateEmbedding } from '../lib/embeddingService.js';
import { storeStockInPinecone } from './storePineconeStock.js';

async function indexTopStocks() {
  try {
    // Get the directory of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Read NYSE stocks JSON
    const stocksFilePath = path.resolve(__dirname, '../nyse_stocks.json');
    const stocksData = await readFile(stocksFilePath, 'utf8');
    const stocks = JSON.parse(stocksData);

    // Take all stocks
    const topStocks = stocks;

    console.log(`Indexing ${topStocks.length} stocks...`);

    // Process each stock
    for (const symbol of topStocks) {
      try {
        console.log(`Processing stock: ${symbol}`);
        
        // Fetch stock details
        const stockDetails = await fetchStockDetails(symbol);
        
        if (!stockDetails) {
          console.warn(`Could not fetch details for ${symbol}`);
          continue;
        }

        // Generate embedding for the stock description
        const description = stockDetails.description || `${stockDetails.name} stock details`;
        const embedding = await generateEmbedding(description);

        // Upsert to Pinecone
        await storeStockInPinecone(symbol);

        console.log(`Successfully indexed ${symbol}`);
      } catch (stockError) {
        console.error(`Error processing ${symbol}:`, stockError);
      }
    }

    console.log('Stock indexing completed.');
  } catch (error) {
    console.error('Error in indexTopStocks:', error);
  }
}

// Run the indexing
indexTopStocks();
