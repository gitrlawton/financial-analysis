import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

// Check for API keys
console.log("Embedding Service - Environment Variables:");
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "PRESENT" : "MISSING"
);
console.log(
  "PINECONE_API_KEY:",
  process.env.PINECONE_API_KEY ? "PRESENT" : "MISSING"
);

console.log(
  "PINECONE_INDEX:",
  process.env.PINECONE_INDEX ? "PRESENT" : "MISSING"
);

// Server-side API client initialization
function createOpenAIClient() {
  if (typeof window === "undefined") {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return null;
}

function createPineconeClient() {
  if (typeof window === "undefined") {
    return new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return null;
}

// Initialize clients only on the server
const openai = createOpenAIClient();
let pineconeClient = null;
let pineconeIndex = null;

console.log("OpenAI Client:", openai ? "INITIALIZED" : "NOT INITIALIZED");

// Pinecone client initialization
export async function initializePineconeClient(
  indexName = process.env.PINECONE_INDEX || "nyse-financial-analysis",
  dimension = 1536
) {
  // Validate environment variables
  if (!process.env.PINECONE_API_KEY) {
    console.error("ERROR: PINECONE_API_KEY not found");
    throw new Error("Missing Pinecone API Key");
  }

  try {
    // Initialize Pinecone client
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Select the index directly
    pineconeIndex = pineconeClient.index(indexName);
    console.log(`Selected Pinecone index: ${indexName}`);

    return pineconeClient;
  } catch (error) {
    console.error("ERROR initializing Pinecone client:", error);
    throw error;
  }
}

export async function generateEmbedding(text) {
  if (!openai) {
    throw new Error(
      "OpenAI client not initialized. Ensure you are running on the server."
    );
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export async function storeStockEmbedding(stock) {
  // Ensure client is initialized
  if (!pineconeClient || !pineconeIndex) {
    await initializePineconeClient();
  }

  if (!pineconeClient || !pineconeIndex) {
    console.error(
      "ERROR: Pinecone client or index not initialized. Skipping stock storage."
    );
    return null;
  }

  try {
    // Validate input stock object
    if (!stock || !stock.symbol) {
      throw new Error("Invalid stock object: Missing symbol");
    }

    // Ensure index exists before storing
    const indexName = process.env.PINECONE_INDEX || "nyse-financial-analysis";
    const indexCreated = await ensurePineconeIndex(indexName);

    if (!indexCreated) {
      console.error(`ERROR: Failed to ensure index ${indexName} exists`);
      return null;
    }

    // Fallback embedding generation if not provided
    const embedding =
      stock.embedding || (await generateEmbedding(stock.description || ""));

    if (!embedding || embedding.length === 0) {
      throw new Error(
        `Failed to generate embedding for stock: ${stock.symbol}`
      );
    }

    // Prepare vector for storage
    const vector = {
      id: stock.symbol,
      values: embedding,
      metadata: {
        symbol: stock.symbol,
        name: stock.name || "Unknown",
        sector: stock.sector || "Unclassified",
        industry: stock.industry || "Unclassified",
        description: stock.description || "No description available",
        marketCap: stock.marketCap || 0,
        volume: stock.volume || 0,
        country: stock.country || "Unknown",
      },
    };

    console.log("Vector to be upserted:", JSON.stringify(vector, null, 2));

    // Upsert vector with detailed error handling
    try {
      const upsertResponse = await pineconeIndex.upsert([vector]);
      console.log("Upsert response:", upsertResponse);

      // Updated success check - Pinecone upsert returns undefined on success
      if (upsertResponse === undefined) {
        console.log(`Successfully upserted stock: ${stock.symbol}`);
        return true;
      } else {
        console.error("Unexpected upsert response:", upsertResponse);
        throw new Error(`Failed to upsert stock: ${stock.symbol}`);
      }
    } catch (upsertError) {
      console.error("ERROR during Pinecone upsert:", upsertError);

      // Additional detailed logging
      if (upsertError.response) {
        console.error(
          "Upsert Error Response:",
          JSON.stringify(upsertError.response, null, 2)
        );
      }

      throw upsertError;
    }
  } catch (error) {
    console.error("ERROR storing stock embedding:", error);
    console.error(
      "Detailed error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
    throw error;
  }
}

export async function searchStocksByEmbedding(query, topK = 5, filters = {}) {
  // Ensure client is initialized
  if (!pineconeClient || !pineconeIndex) {
    await initializePineconeClient();
  }

  if (!pineconeClient || !pineconeIndex) {
    console.error(
      "ERROR: Pinecone client or index not initialized. Skipping stock search."
    );
    return [];
  }

  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    if (!queryEmbedding) {
      console.warn("Failed to generate query embedding");
      return [];
    }

    // Prepare filter object for Pinecone
    const pineconeFilter = {};

    // Market Cap Filtering
    if (filters.marketCap) {
      switch (filters.marketCap) {
        case "small":
          pineconeFilter.marketCap = { $lt: 2_000_000_000 };
          break;
        case "mid":
          pineconeFilter.marketCap = {
            $gte: 2_000_000_000,
            $lte: 10_000_000_000,
          };
          break;
        case "large":
          pineconeFilter.marketCap = { $gt: 10_000_000_000 };
          break;
      }
    }

    // Volume Filtering
    if (filters.volume) {
      switch (filters.volume) {
        case "low":
          pineconeFilter.volume = { $lt: 1_000_000 };
          break;
        case "medium":
          pineconeFilter.volume = { $gte: 1_000_000, $lte: 10_000_000 };
          break;
        case "high":
          pineconeFilter.volume = { $gt: 10_000_000 };
          break;
      }
    }

    // Sector Filtering
    if (filters.sector) {
      pineconeFilter.sector = {
        $eq: filters.sector.charAt(0).toUpperCase() + filters.sector.slice(1),
      };
    }

    // Industry Filtering
    if (filters.industry) {
      pineconeFilter.industry = {
        $eq:
          filters.industry.charAt(0).toUpperCase() + filters.industry.slice(1),
      };
    }

    // Country Filtering
    if (filters.country) {
      pineconeFilter.country = { $eq: filters.country.toUpperCase() };
    }

    // Perform vector search with optional filtering
    const searchResponse = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: topK,
      filter:
        Object.keys(pineconeFilter).length > 0 ? pineconeFilter : undefined,
      includeMetadata: true,
    });

    // Process and filter results
    const processedResults = searchResponse.matches
      .filter((match) => match.score >= 0.39)
      .map((match) => ({
        ...match.metadata, // Spread all metadata properties
        score: match.score, // Include the similarity score
      }))
      .slice(0, topK); // Limit to requested number of results

    return processedResults;
  } catch (error) {
    console.error("ERROR searching stocks:", error);
    return [];
  }
}

/**                      Helper functions for filtering                        */

function matchMarketCap(stockMarketCap, filterValue) {
  if (!stockMarketCap) return false;
  const cap = parseFloat(stockMarketCap.replace(/[^0-9.]/g, ""));
  switch (filterValue) {
    case "small":
      return cap < 2000000000; // < $2B
    case "mid":
      return cap >= 2000000000 && cap <= 10000000000; // $2B-$10B
    case "large":
      return cap > 10000000000; // > $10B
    default:
      return true;
  }
}

function matchVolume(stockVolume, filterValue) {
  if (!stockVolume) return false;
  const vol = parseFloat(stockVolume.replace(/[^0-9.]/g, ""));
  switch (filterValue) {
    case "low":
      return vol < 1000000; // < 1M
    case "medium":
      return vol >= 1000000 && vol <= 10000000; // 1M-10M
    case "high":
      return vol > 10000000; // > 10M
    default:
      return true;
  }
}
