export type PageName = "Your Stocks" | "Browse Stocks" | "Stock Info" | "Buy Stock" | "Sell Stock" | "News" | "News Article" | "Account";
export type BuySellOptions = "buy" | "sell";
export interface StockProps {
  symbol: string;
  latestPrice: number;
  change: number;
  boughFor?: number;
  amount?: number;
}
export interface NewsProps {
  Source: string;
  URL: string;
  URLToImage: string;
  Title: string;
  Description: string;
  Author: string;
  PublishedAt: string;
}
