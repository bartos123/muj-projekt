import { useState, useCallback, useEffect } from 'react';
import { StockItem, NewsItem } from '../types/portfolio'; 

export function useNews(apiKey: string, watchlist: StockItem[]) {
  const [news, setNews] = useState<NewsItem[]>(() => {
    const cached = localStorage.getItem('newsCache');
    return cached ? JSON.parse(cached) : [];
  });
  
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const watchlistKey = watchlist.map(i => i.symbol).join(',');

  const fetchNews = useCallback(async () => {
    if (!apiKey) return;
    setIsError(false);

    const targetCount = 15;
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const fetchGlobalNews = async () => {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/news?category=business&token=${apiKey}`);
        if (!res.ok) throw new Error(`Global news HTTP error! status: ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error("Global news failed:", err);
        setIsError(true);
        return []; 
      }
    };

    const fetchSingleStockNews = async (symbol: string) => {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`);
        if (!res.ok) throw new Error(`Stock ${symbol} HTTP error! status: ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data.map((n: any) => ({ ...n, relatedSymbol: symbol })) : [];
      } catch (err) {
        console.error(`Stock ${symbol} news failed:`, err);
        return []; 
      }
    };

    try {
      const globalNewsReq = fetchGlobalNews();
      const stockReqs = watchlist.map(item => fetchSingleStockNews(item.symbol));

      const [globalNews, ...stockResults] = await Promise.all([globalNewsReq, ...stockReqs]);

      const stockArticles = stockResults.flat() as NewsItem[];
      const uniqueStockNews = stockArticles
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
        .sort((a, b) => b.datetime - a.datetime);

      const formattedGlobal = (Array.isArray(globalNews) ? globalNews : []).map(n => ({
        ...n,
        relatedSymbol: 'MARKET'
      })) as NewsItem[];

      let finalFeed = [...uniqueStockNews];
      if (finalFeed.length < targetCount) {
        const remainingSlots = targetCount - finalFeed.length;
        const backfill = formattedGlobal
          .filter(gn => !finalFeed.some(sn => sn.id === gn.id))
          .slice(0, remainingSlots);
        
        finalFeed = [...finalFeed, ...backfill];
      }

      const sortedFeed = finalFeed.sort((a, b) => b.datetime - a.datetime);

      setNews(sortedFeed);
      localStorage.setItem('newsCache', JSON.stringify(sortedFeed));

    } catch (err) {
      console.error("INTEL_AGGREGATION_CRITICAL_FAILURE", err);
      setIsError(true);
    }
  }, [apiKey, watchlistKey]);

  return { fetchNews, news, isOffline, isError };
}