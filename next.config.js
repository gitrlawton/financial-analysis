/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_INDEX: process.env.PINECONE_INDEX,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
};

export default nextConfig;
