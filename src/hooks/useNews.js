import { useState, useCallback } from 'react';

export function useNews(apiKey, watchlist) {
  const [news, setNews] = useState([]);
    
  const fetchNews = useCallback (async () => {
    if (!watchlist || watchlist.length === 0) {
        try {
            const res = await fetch(`https://finnhub.io/api/v1/news?category=business&token=${apiKey}`);
            const data = await res.json();
            setNews(Array.isArray(data) ? data.slice(0, 6) : []);
            } catch (err) {
                console.error("Obecné zprávy selhaly.");
            }
            return;
      }

    const symbols = watchlist.slice(0, 3).map(i => i.symbol);
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      const requests = symbols.map(s => 
        fetch(`https://finnhub.io/api/v1/company-news?symbol=${s}&from=${from}&to=${to}&token=${apiKey}`)
          .then(res => res.json())
      );
      const results = await Promise.all(requests);
      const combined = results.flat()
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
        .sort((a, b) => b.datetime - a.datetime)
        .slice(0, 6);
      setNews(combined);
    } catch (err) { console.error("Mixování zpráv selhalo."); }
  }, [apiKey, watchlist]);
  return { fetchNews, news };

}
