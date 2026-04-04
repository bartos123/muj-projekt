import React, { useState, useEffect, useRef } from 'react'
import StockCard from './StockCard.jsx'


const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];
function App() {
  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

  // STAVY
  const [eggs, setEggs] = useState(Number(localStorage.getItem('eggs')) || 0)
  const [time, setTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([]);
  const [prices, setPrices] = useState(() => {
    const saved = localStorage.getItem('last_prices');
    return saved ? JSON.parse(saved) : {};
    }); // Tady ukládáme { 'AAPL': {p: 150, d: 2}, ... }
  useEffect(() => {
  localStorage.setItem('last_prices', JSON.stringify(prices));
  }, [prices]);
  const searchInputRef = useRef(null);
  const [news, setNews] = useState([])
  const searchContainerRef = useRef(null); // Ref pro celé vyhledávání

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist')
    const parsed = saved ? JSON.parse(saved) : []
    return parsed.filter (item => item.symbol !== null && typeof item.symbol === 'string')
  })
 
  const fetchNews = async () => {
    // Pokud je watchlist prázdný, stáhni aspoň obecný Business
    if (watchlist.length === 0) {
      const res = await fetch(`https://finnhub.io/api/v1/news?category=business&token=${API_KEY}`);
      const data = await res.json();
      setNews(data.slice(0, 6));
      return;
    }

    const symbols = watchlist.slice(0, 3).map(i => i.symbol);
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      const requests = symbols.map(s => 
        fetch(`https://finnhub.io/api/v1/company-news?symbol=${s}&from=${from}&to=${to}&token=${API_KEY}`)
          .then(res => res.json())
      );
      const results = await Promise.all(requests);
      const combined = results.flat()
        .sort((a, b) => b.datetime - a.datetime)
        .slice(0, 6);
      setNews(combined);
    } catch (err) { console.error("Mixování zpráv selhalo."); }
  };

  const handleStock = async (symbol, {add = false} = {}) => {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      const data = await res.json();

      if (data.c === 0) {
        alert('Neplatný symbol, zkus to znovu.')
        return null;
      }
      setPrices(prev => ({ ...prev, [symbol]: { p: data.c, d: data.dp } }));
      
      if (add) {
        symbol = symbol.toUpperCase();
        if (!watchlist.some(item => item.symbol === symbol)) {
          const newList = [{ symbol, shares: 1, buyPrice: data.c }, ...watchlist];
          saveAndSet(newList);
        } else {
          alert('Již v seznamu.')
        }
        setSearchQuery('');
      }
      return data;
    } catch (error) {
      if (add) alert('Chyba načítání dat');
      return null;
    }
  };
  const searchSymbols = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`);
      const data = await res.json();
      
      // VOLNĚJŠÍ FILTR: 
      // 1. Vyhodíme jen ty s tečkou (cizí burzy)
      // 2. Necháme Stocks, ADRs, ETFs i Crypto
      const cleanResults = data.result
        .filter(s => !s.symbol.includes('.')) 
        .slice(0, 7); 
        
      setSuggestions(cleanResults);
    } catch (err) { setSuggestions([]); }
  };

  // 2. FUNKCE PRO REFRESH VŠEHO
  const refreshAllPrices = () => {
    watchlist.forEach(item => {
      handleStock(item.symbol);
    });
  };
  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
  
  if (day < 1 || day > 5) return false; // víkend
  if (hours < 15 || (hours === 15 && minutes < 30)) return false; // před otevřením
  if (hours > 22 || (hours === 22 && minutes > 0)) return false; // po zavření
  return true;
  };

  // 3. INTERVALY (Hodiny a automatický refresh každou minutu)
  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    const refreshTimer = setInterval(refreshAllPrices, 60000); // Každých 60s
    
    // Načíst hned při startu
    refreshAllPrices();
    fetchNews();
    return () => {
      clearInterval(clockTimer);
      clearInterval(refreshTimer);
    };
  }, [watchlist.length]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]); // Zavře seznam, když klikneš mimo
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  // 4. POMOCNÉ FUNKCE
  const saveAndSet = (newList) => {
    setWatchlist(newList);
    localStorage.setItem('watchlist', JSON.stringify(newList));
  }

  const stats = watchlist.reduce((acc, item) => {
    const currentPrice = prices[item.symbol];
    const buyPrice = item.buyPrice || currentPrice?.p || 0;
    
    const currentValue = (currentPrice?.p ||0) * Number(item.shares || 0);
    const investedValue = buyPrice * Number(item.shares || 0);
    return {
      total: acc.total + currentValue,
      invested: acc.invested + investedValue
    }
   }, { total: 0, invested: 0 });
    

  const celkovyZisk = stats.total - stats.invested;
  const ziskProcento = stats.invested > 0 ? (celkovyZisk / stats.invested) * 100 : 0;

  const chart = watchlist.map((item, index) => {
    const ItemValue = (prices[item.symbol]?.p || 0) * Number(item.shares || 0);
    const percentage = stats.total > 0 ? (ItemValue / stats.total) * 100 : 0;
    return {
      symbol: item.symbol,
      percentage, color: COLORS[index % COLORS.length]
    };
  });

const updateShares = (symbol, newAmount) => {
  const currentPrice = prices[symbol]?.p || 0;
  
  const newList = watchlist.map(item => {
    if (item.symbol === symbol) {
      const oldAmount = Number(item.shares);
      const newAmountNum = Number(newAmount);

      // Pokud dokupujeme (zvyšujeme počet kusů)
      if (newAmountNum > oldAmount && currentPrice > 0) {
        const addedShares = newAmountNum - oldAmount;
        
        // Vzorec pro vážený průměr:
        // ((staré kusy * stará cena) + (nové kusy * aktuální cena)) / celkový počet kusů
        const newBuyPrice = (
          (oldAmount * (item.buyPrice || currentPrice)) + 
          (addedShares * currentPrice)
        ) / newAmountNum;

        return { ...item, shares: newAmountNum, buyPrice: newBuyPrice };
      }

      // Pokud prodáváme nebo snižujeme počet, nákupní cena za kus zůstává stejná
      return { ...item, shares: newAmountNum };
    }
    return item;
  });

  saveAndSet(newList);
};

  const removeFromWatchlist = (symbolToRemove) => {
    const newList = watchlist.filter(s => s.symbol !== symbolToRemove);
    saveAndSet(newList);
  };















  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 font-sans">
      <header className="max-w-[1400px] mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight italic uppercase">Asset Management System</h1>
        </div>

        <div className="font-mono text-white hidden sm:flex bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 items-center space-x-3">
          <div>{time.toLocaleTimeString("cs-CZ")}</div>
          <div className="w-px h-6 bg-white/50"></div> 
          <div>{isMarketOpen() ? 'Trh otevřen' : 'Trh zavřen'}</div>
        </div>
      </header>

      {/*INPUT BOX*/}
      <section 
        ref={searchContainerRef} 
        className="max-w-[1400px] mx-auto mb-10 relative"
      > 
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              ref={searchInputRef}
              value={searchQuery}
              onFocus={() => searchQuery.length >= 2 && searchSymbols(searchQuery)} // Znovu ukáže výsledky při kliku do inputu
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchSymbols(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleStock(searchQuery.toUpperCase(), {add: true});
                  setSuggestions([]);
                }
              }}
              placeholder="Hledej symbol (TSLA, BTC, NVDA...)"
              className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-5 w-full text-white text-xl focus:border-indigo-500 outline-none transition-all shadow-inner"
            />

            {/* NAŠEPTÁVAČ - Teď už neuteče při pohybu myši */}
            {suggestions.length > 0 && (
              <div className="absolute top-[110%] left-0 right-0 z-[100] bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
                {suggestions.map(s => (
                  <button 
                    key={s.symbol}
                    onClick={() => {
                      handleStock(s.symbol, {add: true});
                      setSuggestions([]);
                      setSearchQuery('');
                    }}
                    className="w-full px-6 py-5 hover:bg-indigo-600/30 flex justify-between items-center transition-all border-b border-slate-800 last:border-0 text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="font-black text-white text-2xl group-hover:text-indigo-400 transition-colors">
                        {s.symbol.includes(':') ? s.symbol.split(':')[1] : s.symbol}
                      </span>
                      <span className="text-xs text-slate-500 font-bold truncate max-w-[400px] uppercase tracking-wider">{s.description}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-800 px-3 py-1 rounded-lg uppercase">
                        {s.type || 'Asset'}
                      </span>
                      <span className="text-indigo-500 text-xs font-black opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        + PŘIDAT
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              handleStock(searchQuery.toUpperCase(), {add: true});
              setSuggestions([]);
            }} 
            className="bg-indigo-600 px-12 rounded-xl font-black text-white text-lg hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 uppercase italic"
          >
            Přidat
          </button>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        {/* DASHBOARD - CELKOVÉ PENÍZE */}
        <div className="bg-gradient-to-br from-indigo-800 to-red-400 rounded-3xl shadow-2xl p-5 border border-white/10 min-h-[160px] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold mb-2 uppercase tracking-widest text-indigo-100 opacity-80 text-center">Aktuální hodnota portfolia</div>
            <div className="text-3xl font-black text-white text-center">
              ${stats.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <div className={`text-center font-bold text-xs mt-1 ${celkovyZisk >= 0 ? 'text-emerald-300' : 'text-red-200'}`}>
              {celkovyZisk !== 0 && `${celkovyZisk > 0 ? '▲' : '▼'} ${Math.abs(celkovyZisk).toFixed(2)} (${ziskProcento.toFixed(2)}%)`}           
            </div>
 
          </div>
          <div className="mt-4">
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-black/20 shadow-inner">
              {chart.map((data) => (
                <div 
                  key={data.symbol}
                  style={{ 
                    width: `${data.percentage}%`, 
                    backgroundColor: data.color 
                  }}
                  className="h-full transition-all duration-1000 ease-out border-r border-black/10 last:border-0"
                  title={`${data.symbol}: ${data.percentage.toFixed(1)}%`}
                />
              ))}
            </div>
            
            {/* LEGENDA - malinké značky pod grafem */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {chart.map((data) => (
                <div key={data.symbol} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.color }} />
                  <span className="text-[8px] font-bold text-white/70 uppercase">{data.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* VEJCOMĚR */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="text-indigo-400 text-[10px] font-bold mb-4 uppercase tracking-widest">Množství vajec 🥚</div>
            <div className="text-4xl font-black text-white mb-4">{eggs} <span className="text-lg text-slate-500 font-normal">ks</span></div>
          </div>
          <button onClick={() => {const n = eggs+1; setEggs(n); localStorage.setItem('eggs', n)}} className="w-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-3 rounded-xl hover:bg-indigo-500/20 transition-all font-bold">
            + Sníst vejce
          </button>
        </div>
              
        {/* KARTY AKCIÍ */}
        {watchlist.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-[2rem]">
            <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">prázdné portfolium</h3>

          </div>
        ) : (
          watchlist.map(item => {
            return (
              <StockCard 
                key={item.symbol} 
                symbol={item.symbol}
                buyPrice={item.buyPrice}
                shares={item.shares}
                price={prices[item.symbol]?.p}
                change={prices[item.symbol]?.d}
                onUpdateShares={(val) => updateShares(item.symbol, val)}
                onDelete={() => removeFromWatchlist(item.symbol)}
              />
            )
          })
        )}
        {watchlist.length > 0 && (
          <button onClick={() => {if(confirm('Smazat vše?')) saveAndSet([])}} className="col-span-full mt-10 text-slate-600 hover:text-red-500 text-xs transition-colors italic text-center uppercase tracking-widest pb-10">
            — Provést kompletní destrukci portfolia —
          </button>
        )}
        <section className="col-span-full mt-12 pt-8 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest italic">Zprávy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map(n => (
                <a key={n.id} href={n.url} target="_blank" rel="noreferrer" className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl hover:bg-slate-700/50 transition-all group">
                <p className="text-[10px] text-indigo-400 font-bold mb-2 uppercase">{n.source}</p>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-2">{n.headline}</h4>
                </a>
            ))}
            </div>
        </section>
      </main>
    </div>
  )
}

export default App