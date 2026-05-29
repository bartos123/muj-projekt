export type ViewID = 'POSTER' | 'DASHBOARD' | 'PORTFOLIO' | 'INTEL';



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
export interface ChartItem {
  symbol: string;
  percentage: number;
  gain: number;
  yield: number;
  price: number;
  delta: number;
}
export interface MatrixItem {
    symbol: string;
    percentage: number; 
    gain?: number;
    yield?: number;
    price?: number;
    delta?: number;
}
  export interface DashboardData {
    stats: { total: number; invested: number };
    celkovyZisk: number;
    ziskProcento: number;
    watchlist: StockItem[];
    matrixData: MatrixItem[];
    hovered: string | null;
    setHovered: (symbol: string | null) => void;
    chart: ChartItem[];
    prices: Record<string, StockPrice>;
  }
export interface NewsItem {
  id: string | number;
  headline: string;
  url: string;
  datetime: number;
  category?: string;
  source?: string;
  relatedSymbol?: string; 
}

export interface StockCardProps {
    symbol: string;
    shares: number;
    price?: number;
    change?: number;
    onUpdateShares: (val: string | number) => void;
    onDelete: () => void;
    buyPrice?: number;
    historyData?: number[];
}
export interface PolygonBar {
    t: number; 
    o: number;
    h: number; 
    l: number; 
    c: number; 
    v: number;
    vw?: number; 
    n?: number; 
}
export interface FinnhubSearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}
export interface NavProps {
  activeView: ViewID;
  onViewChange: (view: ViewID) => void;
}
export interface PortfolioViewProps {
  watchlist: StockItem[];
  prices: Record<string, StockPrice>;
  history: Record<string, number[]>;
  onAddStock: (symbol: string) => Promise<void> | void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  suggestions: SearchSuggestion[];
  searchSymbols: (query: string) => Promise<void> | void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  updateShares: (symbol: string, shares: number) => void;
  removeFromWatchlist: (symbol: string) => void;
  saveAndSet: (watchlist: StockItem[]) => void;
}
export interface SearchSuggestion {
  symbol: string;
  description: string;
}


export interface TooltipPayloadItem {
  value: number;
  [key: string]: any; 
}
export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}