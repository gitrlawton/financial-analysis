import 'dotenv/config';
import { searchSimilarStocks } from '../lib/embeddingService.js';

async function main() {
  try {
    // Allow search query to be passed as a command-line argument
    const searchQuery = process.argv[2] || 'Technology companies in consumer electronics';
    
    console.log(`Searching for stocks similar to: "${searchQuery}"`);

    // Perform semantic search
    const similarStocks = await searchSimilarStocks(searchQuery);

    if (similarStocks.length === 0) {
      console.log('No similar stocks found.');
      return;
    }

    console.log('Similar Stocks:');
    similarStocks.forEach((stock, index) => {
      console.log(`\n${index + 1}. ${stock.metadata.name} (${stock.metadata.symbol})`);
      console.log(`   Sector: ${stock.metadata.sector}`);
      console.log(`   Industry: ${stock.metadata.industry}`);
      console.log(`   Market Cap: $${(stock.metadata.marketCap / 1e9).toFixed(2)} billion`);
      console.log(`   Similarity Score: ${stock.score.toFixed(4)}`);
      console.log(`   Description: ${stock.metadata.description}`);
    });
  } catch (error) {
    console.error('Error searching stocks:', error);
    process.exit(1);
  }
}

// Invoke the main function
main();
