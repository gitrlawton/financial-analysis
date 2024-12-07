import { NextResponse } from "next/server";
import { searchStocksByEmbedding } from "@/lib/embeddingService";

export async function POST(request) {
  try {
    const { query, filters } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Perform semantic search with optional filtering
    const searchResults = await searchStocksByEmbedding(query, 25, filters);

    // Transform results to match frontend expectations
    const formattedResults = searchResults.map((result) => ({
      symbol: result.symbol,
      name: result.name,
      sector: result.sector,
      industry: result.industry,
      marketCap: `$${(result.marketCap / 1e9).toFixed(2)}B`,
      volume: result.volume.toLocaleString(),
      country: result.country,
      similarityScore: result.score.toFixed(4),
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Error in stock search:", error);
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 }
    );
  }
}
