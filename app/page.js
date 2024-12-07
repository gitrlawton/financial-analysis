"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder data for demonstration
const placeholderStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    industry: "Consumer Electronics",
    marketCap: "2.5T",
    volume: "100M",
    country: "USA",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    industry: "Internet Content & Information",
    marketCap: "1.5T",
    volume: "50M",
    country: "USA",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Cyclical",
    industry: "Internet Retail",
    marketCap: "1.0T",
    volume: "80M",
    country: "USA",
  },
];

export default function StockAnalysisSystem() {
  const [query, setQuery] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const [volume, setVolume] = useState("");
  const [sector, setSector] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query, "with filters:", {
      marketCap,
      volume,
      sector,
      industry,
      country,
    });
  };

  return (
    <div className="container mx-auto p-4 bg-emerald-50 min-h-screen">
      <Card className="mb-8 border-emerald-200 shadow-lg">
        <CardHeader className="bg-emerald-700">
          <CardTitle className="text-white">Stock Analysis System</CardTitle>
        </CardHeader>
        <CardContent className="bg-white pt-6">
          <div className="flex flex-col space-y-4">
            <label
              htmlFor="query-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Query
            </label>
            <Input
              id="query-input"
              placeholder="Enter your natural language query (e.g., 'Companies that build data centers')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-none"
            />
            <div className="flex flex-wrap gap-4">
              <Select value={marketCap} onValueChange={setMarketCap}>
                <SelectTrigger className="w-[180px] border-emerald-300 focus:ring-emerald-500 rounded-none">
                  <SelectValue placeholder="Market Cap" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small Cap (&lt;$2B)</SelectItem>
                  <SelectItem value="mid">Mid Cap ($2B-$10B)</SelectItem>
                  <SelectItem value="large">Large Cap (&gt;$10B)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={volume} onValueChange={setVolume}>
                <SelectTrigger className="w-[180px] border-emerald-300 focus:ring-emerald-500 rounded-none">
                  <SelectValue placeholder="Volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (&lt;1M)</SelectItem>
                  <SelectItem value="medium">Medium (1M-10M)</SelectItem>
                  <SelectItem value="high">High (&gt;10M)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="w-[180px] border-emerald-300 focus:ring-emerald-500 rounded-none">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-[180px] border-emerald-300 focus:ring-emerald-500 rounded-none">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="biotech">Biotech</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-[180px] border-emerald-300 focus:ring-emerald-500 rounded-none">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSearch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none"
              >
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-emerald-700">
          <CardTitle className="text-white">Results</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-100">
                <TableHead className="text-emerald-900">Symbol</TableHead>
                <TableHead className="text-emerald-900">Name</TableHead>
                <TableHead className="text-emerald-900">Sector</TableHead>
                <TableHead className="text-emerald-900">Industry</TableHead>
                <TableHead className="text-emerald-900">Market Cap</TableHead>
                <TableHead className="text-emerald-900">Volume</TableHead>
                <TableHead className="text-emerald-900">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderStocks.map((stock) => (
                <TableRow key={stock.symbol} className="hover:bg-emerald-50">
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>{stock.sector}</TableCell>
                  <TableCell>{stock.industry}</TableCell>
                  <TableCell>{stock.marketCap}</TableCell>
                  <TableCell>{stock.volume}</TableCell>
                  <TableCell>{stock.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
