import StockCard from "../StockCard";

export interface PortfolioStats {
  total: number;  
  invested: number;  
}
export interface StockItem {
  symbol: string;
  shares: number;
  buyPrice: number;
}
export interface StockPrice {
  p: number; 
  d: number;
}

export interface NewsItem {
    id: string | number;
    headline: string;
    summary: string;
    url: string;
    image: string;
    datetime: number;
    category?: string;
    source?: string;
}

export interface StockCardProps {
    symbol: string;
    shares: number;
    price: number;
    change: number;
    onUpdateShares: (val: string | number) => void;
    onDelete: () => void;
    buyPrice?: number;
    historyData?: number[];
}