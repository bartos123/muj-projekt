import { useState, useEffect, useRef, useMemo } from 'react';
import { usePortfolio } from './hooks/usePortfolio.ts';
import { useNews } from './hooks/useNews.ts';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import { FinnhubSearchResult, PolygonBar, SearchSuggestion, ViewID } from './types/portfolio.ts';
import { MainNavigation } from './components/UI/Navigation.tsx';
import { Poster } from './components/UI/Poster/variations/Poster.tsx';
import { PortfolioView } from './components/Portfolio/PortfolioView.tsx';
import { NewsFeed } from './components/News/NewsFeed.tsx';

function App() {
  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

  const { 
    watchlist, prices, stats, history, setHistory, 
    handleStock, updateShares, removeFromWatchlist, saveAndSet 
  } = usePortfolio(API_KEY);
  
  const { 
    fetchNews, news, isOffline, isError 
  } = useNews(API_KEY, watchlist);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null); 
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewID>('POSTER');


  const onAddStock = async (symbol: string) => {
    const success = await handleStock(symbol.toUpperCase(), { add: true });
    if (success) {
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const fetchHistory = async (symbol: string) => {
    const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      const res = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`
      );
      const data = await res.json();
      
      if (data.results) {
        const prices = data.results.map((day: PolygonBar) => day.c);
        setHistory(prev => ({ ...prev, [symbol]: prices }));
      }
    } catch (err) { 
      console.error("Polygon historie selhala."); 
    }
  };

  const searchSymbols = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`);
      const data = await res.json();
      const results = (data.result as FinnhubSearchResult[]) || [];
      const cleanResults = results
        .filter((s: FinnhubSearchResult) => !s.symbol.includes('.')) 
        .slice(0, 7); 
        
      setSuggestions(cleanResults);
    } catch (err) { 
      setSuggestions([]); 
    }
  };

  const refreshAllPrices = () => {
    watchlist.forEach(item => {
      handleStock(item.symbol);
      fetchHistory(item.symbol);
    });
  };

  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
  
    if (day < 1 || day > 5) return false; 
    if (hours < 15 || (hours === 15 && minutes < 30)) return false; 
    if (hours > 22 || (hours === 22 && minutes > 0)) return false; 
    return true;
  };

  const watchlistSymbolsKey = watchlist.map(i => i.symbol).join(',');

  useEffect(() => {
    refreshAllPrices();
    fetchNews();
    const refreshTimer = setInterval(refreshAllPrices, 60000); 
    return () => {
      clearInterval(refreshTimer);
    };
  }, [watchlistSymbolsKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const celkovyZisk = stats.total - stats.invested;
  const ziskProcento = stats.invested > 0 ? (celkovyZisk / stats.invested) * 100 : 0;

  const chart = watchlist.map((item) => {
    const currentPrice = prices[item.symbol]?.p || 0;
    const shares = Number(item.shares || 0);
    const investedInThis = (item.buyPrice || 0) * shares;
    const valueOfThis = currentPrice * shares;
    const itemGain = valueOfThis - investedInThis;

    return {
      symbol: item.symbol,
      percentage: stats.total > 0 ? (valueOfThis / stats.total) * 100 : 0,
      gain: itemGain,
      yield: investedInThis > 0 ? (itemGain / investedInThis) * 100 : 0,
      price: currentPrice,
      delta: prices[item.symbol]?.d || 0
    };
  });

  const matrixData = useMemo(() => {
    const threshold = 5; 
    const mainAssets = chart.filter(a => a.percentage >= threshold);
    const others = chart.filter(a => a.percentage < threshold);
    
    if (others.length === 0) return mainAssets;
    
    const othersTotal = others.reduce((sum, a) => sum + a.percentage, 0);
    
    return [
      ...mainAssets,
      { 
        symbol: '+', 
        percentage: othersTotal
      }
    ];
  }, [chart]);

  return (
    <div className="h-screen w-full bg-white text-black font-sans flex flex-col overflow-hidden">
      
      <MainNavigation 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />

      <main className="flex-1 relative px-5 md:px-8 pb-6 overflow-hidden">
        {activeView === 'POSTER' && (
          <Poster isMarketOpen={isMarketOpen()} watchlistCount={watchlist.length} />
        )}

        {activeView === 'DASHBOARD' && (
          <section className="h-full overflow-y-auto">
            <Dashboard 
              stats={stats} celkovyZisk={celkovyZisk} ziskProcento={ziskProcento} 
              watchlist={watchlist} matrixData={matrixData} hovered={hovered} 
              setHovered={setHovered} chart={chart} prices={prices}
            />
          </section>
        )}

        {activeView === 'PORTFOLIO' && (
          <PortfolioView 
            watchlist={watchlist} prices={prices} updateShares={updateShares}
            removeFromWatchlist={removeFromWatchlist} history={history}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchSymbols={searchSymbols} suggestions={suggestions}
            onAddStock={onAddStock} searchInputRef={searchInputRef}
            searchContainerRef={searchContainerRef} saveAndSet={saveAndSet}
          />
        )}

        {activeView === 'INTEL' && (
          <NewsFeed 
            news={news} 
            watchlist={watchlist} 
            isOffline={isOffline} 
            isError={isError} 
          />
        )}
      </main>

    </div>
  );
}

export default App;