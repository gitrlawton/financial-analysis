import "dotenv/config";
import { fetchStockDetails } from "../lib/stockService.js";
import {
  generateEmbedding,
  storeStockEmbedding,
  searchSimilarStocks,
} from "../lib/embeddingService.js";

export async function storeStockInPinecone(symbol = "AAPL") {
  try {
    console.log("Starting stock storage process for:", symbol);

    // Step 1: Fetch Stock Details
    console.log("1. Fetching Stock Details...");
    const stockDetails = await fetchStockDetails(symbol);

    if (!stockDetails) {
      throw new Error(`Failed to fetch details for stock: ${symbol}`);
    }
    console.log("Stock Details:", JSON.stringify(stockDetails, null, 2));

    // Step 2: Use original longBusinessSummary from Yahoo Finance
    console.log("2. Using Original Business Summary...");
    const stockDescription = stockDetails.longBusinessSummary || stockDetails.description;
    console.log("Stock Description:", stockDescription);

    // Step 3: Generate Embedding
    console.log("3. Generating Stock Embedding...");
    const embedding = await generateEmbedding(stockDescription);

    if (!embedding) {
      throw new Error("Failed to generate embedding");
    }
    console.log("Embedding generated. Length:", embedding.length);

    // Step 4: Store in Pinecone
    console.log("4. Storing Stock in Pinecone...");
    const storeResult = await storeStockEmbedding({
      ...stockDetails,
      description: stockDescription,
      embedding: embedding,
    });

    if (!storeResult) {
      console.error("Detailed Error Information:", {
        symbol,
        stockDetails,
        embeddingLength: embedding.length,
      });
      throw new Error("Failed to store stock in Pinecone");
    }
    console.log("Stock stored successfully in Pinecone");

    // Step 5: Verify by Searching
    console.log("5. Searching for Similar Stocks...");
    const searchResults = await searchSimilarStocks(stockDetails.name);
    console.log("Search Results:", JSON.stringify(searchResults, null, 2));

    return {
      stockDetails,
      embedding,
      storeResult,
      searchResults,
    };
  } catch (error) {
    console.error("Comprehensive Error Details:", {
      errorMessage: error.message,
      errorStack: error.stack,
      symbol: symbol,
    });
    throw error;
  }
}

(async () => {
  try {
    // Get the stock symbol from command line arguments
    const symbol = process.argv[2] || "AAPL";
    const result = await storeStockInPinecone(symbol);
    console.log("Complete Process Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Script execution failed:", error);
  }
})();
