import { useState, useEffect, useRef, useMemo } from 'react';
import { X} from 'lucide-react';
import StockCard from './StockCard.jsx';
import { usePortfolio } from './hooks/usePortfolio.ts';
import { useNews } from './hooks/useNews.ts';
import Matrix from './components/Matrix.tsx';




const COLORS = ['#FF0000', '#0000FF', '#FFFF00', '#00FFFF', '#32CD32', '#ef4444', '#FFB000'];
function App() {
  const API_KEY = (import.meta as any).env.VITE_FINNHUB_API_KEY;

  const { 
      watchlist, prices, stats, history, setHistory, 
      handleStock, updateShares, removeFromWatchlist, saveAndSet 
    } = usePortfolio(API_KEY);
  const { 
      fetchNews, news
    } = useNews(API_KEY, watchlist);

  const [eggs, setEggs] = useState(Number(localStorage.getItem('eggs')) || 0)
  const [showEggs, setShowEggs] = useState(false)
  const [, setEggClicks] = useState(0);
  const [time, setTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null); 
  const [hovered, setHovered] = useState<string | null>(null);

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
  const onAddStock = async (symbol: string) => {
   const success = await handleStock(symbol.toUpperCase(), {add: true});
   if (success) {
      setSearchQuery('');
      setSuggestions([]);
   }
}




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
      const prices = data.results.map((day: any) => day.c);
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
      const cleanResults = data.result
        .filter((s: any) => !s.symbol.includes('.')) 
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

  const chart = watchlist.map((item, index) => {
    const ItemValue = (prices[item.symbol]?.p || 0) * Number(item.shares || 0);
    const percentage = stats.total > 0 ? (ItemValue / stats.total) * 100 : 0;
    return {
      symbol: item.symbol,
      percentage, color: COLORS[index % COLORS.length]
    };
  });
const matrixData = useMemo(() => {
    const threshold = 5; // % pod který budeme seskupovat
    const mainAssets = chart.filter(a => a.percentage >= threshold);
    const others = chart.filter(a => a.percentage < threshold);
    
    if (others.length === 0) return mainAssets;
    
    const othersTotal = others.reduce((sum, a) => sum + a.percentage, 0);
    
    // Vrátíme hlavní akcie + speciální objekt pro "ostatní"
    return [
      ...mainAssets,
      { 
        symbol: '+', 
        percentage: othersTotal
      }
    ];
  }, [chart]);


















  return (
    <div className="min-h-screen text-slate-200 p-6 md:p-12 font-sans">
      <header className="max-w-[1400px] mx-auto mb-10 flex flex-col items-center sm:flex-row justify-between gap-4">
        <div>
          <h1 
            onClick={handleEggTrigger}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight italic uppercase cursor-default select-none active:scale-95 transition-transform"
          >
            Asset Management System
          </h1>
        </div>

        <div className="flex items-center self-start lg:self-center font-mono text-lg sm:text-xl text-black  px-6 py-3  border border-slate-700 space-x-4">
          <div className="flex flex-col">{time.toLocaleTimeString("cs-CZ")}</div>
          <div className="w-px h-6 bg-black"></div> 
          <div className="flex items-center">{isMarketOpen() ? 'Trh otevřen' : 'Trh zavřen'}</div>
        </div>
      </header>

      {/*INPUT BOX*/}
      <section ref={searchContainerRef} className="max-w-[1400px] mx-auto mb-12 relative">
        <div className="flex flex-col md:flex-row gap-0 group">
          <div className="relative flex-1">
            
            <input 
              type="text" 
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); searchSymbols(e.target.value);}}
              onKeyDown={(e) => e.key === 'Enter' && onAddStock(searchQuery)}
              placeholder="Hledej symbol (TSLA, BTC, NVDA...)"
              className="bg-white border-2 border-black px-6 h-16 w-full text-black text-xl font-bold focus:border-black focus:bg-gray-50 outline-none placeholder:text-gray-300"
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-[100] bg-white border-2 border-t-0 border-black overflow-hidden">
                {suggestions.map(s => (
                  <button 
                    key={s.symbol} 
                    onClick={() => onAddStock(s.symbol)} 
                    className="w-full pl-6 pr-6 py-4 flex justify-between items-center border-b border-black bg-white hover:bg-black text-black hover:text-white last:border-0 group/item text-left cursor-pointer"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-black text-xl tracking-tighter">
                        {s.symbol.split(':')[0]}
                      </span>
                      <span className="text-[9px] text-black/50 font-bold uppercase tracking-[0.15em] opacity-60 group-hover/item:text-white/50">
                        {s.description}
                      </span>
                    </div>
                    
                    <span className="font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100">
                      + ADD
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => onAddStock(searchQuery)}
            className="bg-black text-xl tracking-[0.3em] text-white h-16 px-10 font-black uppercase hover:bg-white hover:text-black border-2 border-black"
          >
            PŘIDAT
          </button>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
      {/* NOVÁ SEKCE DASHBOARDU */}
      <div className="col-span-full grid grid-cols-1 lg:grid-cols-4 border-4 border-black mb-12 bg-white">
        
        {/* LEVÝ PANEL: ČÍSLA (1/4 šířky) */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-2">
            Portfolio Capital
          </div>
          <div className="text-6xl font-black text-black tracking-tighter leading-none mb-4">
            ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-2 py-1 text-[10px] font-black text-white uppercase ${celkovyZisk >= 0 ? 'bg-black' : 'bg-red-600'}`}>
              {celkovyZisk >= 0 ? 'Profit' : 'Loss'}
            </div>
            <div className="text-sm font-black text-black uppercase tracking-widest">
              {celkovyZisk !== 0 && `${celkovyZisk > 0 ? '▲' : '▼'} ${ziskProcento.toFixed(2)}%`}
            </div>
          </div>
        </div>
            
        {/* PRAVÝ PANEL: MATRIX (3/4 šířky) */}
        <div className="lg:col-span-3">
          {watchlist.length > 0 ? (
            <Matrix assets={matrixData} onHoverChange={setHovered} />
          ) : (
            <div className="h-full flex items-center justify-center p-20 text-black/20 font-black uppercase tracking-widest">
              No Data for Matrix
            </div>
          )}
        </div>

      <div className="mt-4 pt-2 border-t-2 border-black flex justify-between items-end font-mono text-[10px] uppercase tracking-[0.2em] text-black">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="opacity-30">Active Asset</span>
            <span className="font-black">{hovered ? (hovered === '+' ? 'Diversified Others' : hovered) : '---'}</span>
          </div>
          
          {hovered === '+' && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2">
              <span className="opacity-30">Basket Includes</span>
              <span className="font-bold">
                {chart.filter(a => a.percentage < 5).map(a => a.symbol).join(' // ')}
              </span>
            </div>
          )}

          {hovered && hovered !== '+' && (
            <div className="flex flex-col animate-in fade-in">
              <span className="opacity-30">Weight</span>
              <span className="font-bold">{chart.find(a => a.symbol === hovered)?.percentage.toFixed(2)}%</span>
            </div>
          )}
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
                  onClick={() => {const n = eggs + 1; setEggs(n); localStorage.setItem('eggs', n.toString())}}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-500 transition-all active:scale-95"
                >
                  PŘIDAT VEJCE
                </button>
                <button 
                  onClick={() => {const n = Math.max(0, eggs - 1); setEggs(n); localStorage.setItem('eggs', n.toString())}}
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
                onUpdateShares={(val: string | number) => updateShares(item.symbol, val)}
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