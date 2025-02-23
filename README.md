# Financial Analysis System

## Overview

This project is a web application that allows users to perform stock analysis by searching for stocks using natural language queries. The application utilizes OpenAI's embedding model for semantic search and Pinecone for efficient vector storage and retrieval. Users can filter results based on various criteria such as market capitalization, volume, sector, industry, and country.

## Features

- **Natural Language Search**: Users can enter queries in natural language to find relevant stocks.
- **Semantic Search**: The application uses OpenAI's embeddings to perform semantic searches, providing more relevant results.
- **Filtering Options**: Users can filter search results based on market cap, volume, sector, industry, and country.
- **Dynamic Results Display**: The application displays search results in a user-friendly table format, showing key stock information.

## Installation

To set up the project, ensure you have Node.js and npm installed on your machine. Then, follow these steps:

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the required packages:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:

   ```
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX=your_pinecone_index
   GROQ_API_KEY=your_groq_api_key
   ```

4. Ensure you have the `nyse_stocks.json` file in the root directory, containing the list of stock symbols.

## Usage

1. Start the development server:

   ```
   npm run dev
   ```

2. Open your web browser and navigate to `http://localhost:3000`.

3. Enter a natural language query in the search bar to find stocks.

4. Use the filtering options to refine your search results.

5. View the analysis results displayed in a table format.

## File Descriptions

- **app/api/search-stocks/route.js**: The server-side code handling stock search requests and returning formatted results.
- **app/page.js**: The main React component for the front-end, managing user interactions and displaying search results.
- **lib/embeddingService.js**: Contains functions for generating embeddings and interacting with Pinecone for stock storage and retrieval.
- **lib/stockService.js**: Provides functions for fetching stock details from Yahoo Finance.
- **scripts/indexMultipleStocks.js**: A script for indexing multiple stocks into Pinecone.
- **scripts/storePineconeStock.js**: A script for storing individual stock details and embeddings in Pinecone.
- **scripts/searchPineconeStocks.js**: A script for searching stocks in Pinecone based on a query.

## Dependencies

- **Next.js**: For building the web application and handling server-side rendering.
- **OpenAI**: For generating embeddings for stock queries.
- **Pinecone**: For vector storage and retrieval of stock embeddings.
- **Yahoo Finance API**: For fetching stock details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.
