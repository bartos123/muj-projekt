import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import StockCard from './StockCard.jsx';
import { usePortfolio } from './hooks/usePortfolio.js';
import { useNews } from './hooks/useNews.js';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];
function App() {
  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

  const { 
      watchlist, prices, stats, history, setHistory, 
      handleStock, updateShares, removeFromWatchlist, saveAndSet 
    } = usePortfolio(API_KEY);
  const { 
      fetchNews, news
    } = useNews(API_KEY, watchlist);

  // STAVY
  const [eggs, setEggs] = useState(Number(localStorage.getItem('eggs')) || 0)
  const [showEggs, setShowEggs] = useState(false)
  const [eggClicks, setEggClicks] = useState(0);
  const [time, setTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null); 


   const handleEggTrigger = () => {
    setEggClicks(prev => {
      if (prev + 1 >= 5) {
        setShowEggs(true);
        return 0; 
      }
      return prev + 1;
    });
    setTimeout(() => setEggClicks(0), 2000);
  };
  const onAddStock = async (symbol) => {
   const success = await handleStock(symbol.toUpperCase(), {add: true});
   if (success) {
      setSearchQuery('');
      setSuggestions([]);
   }
}




const fetchHistory = async (symbol) => {
  //if (history[symbol]) return;

  const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
  const to = new Date().toISOString().split('T')[0];
  // Změna ze 7 na 30 dní
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  try {
    const res = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`
    );
    const data = await res.json();
    
    if (data.results) {
      // Teď budeme mít v poli cca 20-22 svíček (protože víkendy)
      const prices = data.results.map(day => day.c);
      setHistory(prev => ({ ...prev, [symbol]: prices }));
    }
  } catch (err) { 
    console.error("Polygon historie selhala."); 
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
      const cleanResults = data.result
        .filter(s => !s.symbol.includes('.')) 
        .slice(0, 7); 
        
      setSuggestions(cleanResults);
    } catch (err) { setSuggestions([]); }
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
  
  if (day < 1 || day > 5) return false; // víkend
  if (hours < 15 || (hours === 15 && minutes < 30)) return false; 
  if (hours > 22 || (hours === 22 && minutes > 0)) return false; 
  return true;
  };

  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    const refreshTimer = setInterval(refreshAllPrices, 60000); 
    
    refreshAllPrices();
    fetchNews();
    return () => {
      clearInterval(clockTimer);
      clearInterval(refreshTimer);
    };
  }, [watchlist.length, fetchNews]);

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
        setSuggestions([]);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

    

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


















  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 font-sans">
      <header className="max-w-[1400px] mx-auto mb-10 flex flex-col items-center sm:flex-row justify-between gap-4">
        <div>
          <h1 
            onClick={handleEggTrigger}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight italic uppercase cursor-default select-none active:scale-95 transition-transform"
          >
            Asset Management System
          </h1>
        </div>

        <div className="flex items-center self-start lg:self-center font-mono text-lg sm:text-xl text-white bg-slate-800/50 px-6 py-3 rounded-lg border border-slate-700 space-x-4">
          <div flex flex-col>{time.toLocaleTimeString("cs-CZ")}</div>
          <div className="w-px h-6 bg-white/50"></div> 
          <div flex items-center>{isMarketOpen() ? 'Trh otevřen' : 'Trh zavřen'}</div>
        </div>
      </header>

      {/*INPUT BOX*/}
      <section ref={searchContainerRef} className="max-w-[1400px] mx-auto mb-12 relative">
        <div className="flex flex-col md:flex-row gap-0 group">
          <div className="relative flex-1">
            {/* IKONA LUPY */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Search size={20} />
            </div>
            
            <input 
              type="text" 
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); searchSymbols(e.target.value);}}
              onKeyDown={(e) => e.key === 'Enter' && onAddStock(searchQuery)}
              placeholder="Hledej symbol (TSLA, BTC, NVDA...)"
              className="bg-slate-800/80 border-2 border-slate-700 md:border-r-0 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none px-14 h-16 w-full text-white text-lg focus:border-indigo-500 focus:bg-slate-800 outline-none transition-all placeholder:text-slate-600 shadow-inner"
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-[100] bg-slate-900/95 border-2 border-t-0 border-slate-700 rounded-b-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                {suggestions.map(s => (
                  <button 
                    key={s.symbol} 
                    onClick={() => onAddStock(s.symbol)} 
                    // PŘIDÁNO: cursor-pointer
                    className="w-full pl-14 pr-6 py-4 hover:bg-indigo-600/20 flex justify-between items-center border-b border-slate-800 last:border-0 transition-all group text-left cursor-pointer"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-black text-white text-lg leading-tight">
                        {s.symbol.split(':')[0]}
                      </span>
                      {/* ODEBRÁNO opacity-0: Popis chceme vidět pořád, aby seznam nebyl prázdný */}
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">
                        {s.description}
                      </span>
                    </div>
                    
                    {/* TADY: Toto se ukáže JEN při hoveru na tento konkrétní button */}
                    <span className="text-indigo-400 font-black text-xs opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap ml-4 translate-x-2 group-hover:translate-x-0">
                      + ADD
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => onAddStock(searchQuery)}
            className="bg-indigo-600 h-16 px-10 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none font-black text-white hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 uppercase italic tracking-widest border-2 border-indigo-600"
          >
            PŘIDAT
          </button>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        {/* DASHBOARD - CELKOVÉ PENÍZE */}
        <div className="relative rounded-3xl shadow-2xl p-5 border border-white/10 min-h-[160px] flex flex-col justify-between">

          <div className={`absolute inset-0 rounded-3xl transition-opacity duration-700 ${celkovyZisk > 0 ? 'opacity-100' : 'opacity-0'} bg-gradient-to-br from-emerald-600 to-teal-900 shadow-emerald-500/20`} />
          <div className={`absolute inset-0 rounded-3xl transition-opacity duration-700 ${celkovyZisk < 0 ? 'opacity-100' : 'opacity-0'} bg-gradient-to-br from-rose-700 to-slate-900 shadow-rose-500/20`} />
          <div className={`absolute inset-0 rounded-3xl transition-opacity duration-700 ${celkovyZisk === 0 ? 'opacity-100' : 'opacity-0'} bg-slate-800/50 shadow-gray-500/20`} />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="text-[10px] font-bold mb-2 uppercase tracking-widest text-indigo-100 opacity-80 text-center">
                Aktuální hodnota portfolia
              </div>
              <div className="text-3xl font-black text-white text-center">
                ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-center font-bold text-xs mt-1 ${celkovyZisk > 0 ? 'text-emerald-300' : celkovyZisk < 0 ? 'text-red-200' : 'text-gray-300'}`}>
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

              {/* LEGENDA */}
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
        </div>



        {/* VEJCOMĚR */}
        {showEggs && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.3)] p-8 rounded-[2rem] max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-300">

              <button 
                onClick={() => setShowEggs(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="text-6xl mb-4">🥚</div>
              <h2 className="text-2xl font-black text-white uppercase italic mb-2">Secret Egg Counter</h2>
              <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest font-bold">Množství vajec v systému</p>
              
              <div className="text-5xl font-black text-indigo-400 mb-8">{eggs} <span className="text-xl text-slate-600">ks</span></div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {const n = eggs + 1; setEggs(n); localStorage.setItem('eggs', n)}}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-500 transition-all active:scale-95"
                >
                  PŘIDAT VEJCE
                </button>
                <button 
                  onClick={() => {const n = Math.max(0, eggs - 1); setEggs(n); localStorage.setItem('eggs', n)}}
                  className="px-6 bg-slate-700 text-white py-4 rounded-xl font-black hover:bg-slate-600 transition-all"
                >
                  -
                </button>
              </div>
              
              <p className="mt-6 text-[10px] text-slate-600 uppercase font-bold italic tracking-tighter">
                Tento čítač je přísně tajný.
              </p>
            </div>
          </div>
        )}
              
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
                historyData={history[item.symbol]} 
              />
            )
          })
        )}




        {watchlist.length > 0 && (
        <div className="col-span-full mt-12 mb-10 flex justify-center">
        <button 
          onClick={() => {if(confirm('Smazat vše?')) saveAndSet([])}} 
          className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all"
        >
          <span className="text-slate-600 group-hover:text-red-400 text-xs font-black uppercase tracking-[0.2em] transition-colors italic">
            — Provést kompletní destrukci portfolia —
          </span>
        </button>
        </div>
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