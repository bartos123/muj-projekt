import React, { useState, useEffect } from 'react'
import StockCard from './StockCard.jsx'

function App() {
  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

  // STAVY
  const [eggs, setEggs] = useState(Number(localStorage.getItem('eggs')) || 0)
  const [time, setTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [prices, setPrices] = useState({}); // Tady ukládáme { 'AAPL': {p: 150, d: 2}, ... }
  
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist')
    return saved ? JSON.parse(saved) : []
  })

  // 1. FUNKCE PRO STAŽENÍ JEDNÉ CENY (Ta nejdůležitější věc)
  const fetchSinglePrice = async (symbol) => {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      const data = await res.json();
      if (data.c) {
        // Tady je ten trik: "prev => ({...prev, ...})" zajistí, že staré ceny nezmizí!
        setPrices(prev => ({
          ...prev,
          [symbol]: { p: data.c, d: data.dp }
        }));
      }
    } catch (err) {
      console.error(`Chyba pro ${symbol}:`, err);
    }
  };

  // 2. FUNKCE PRO REFRESH VŠEHO
  const refreshAllPrices = () => {
    console.log("Aktualizuji všechny ceny...");
    watchlist.forEach(item => {
      fetchSinglePrice(item.symbol);
    });
  };

  // 3. INTERVALY (Hodiny a automatický refresh každou minutu)
  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    const refreshTimer = setInterval(refreshAllPrices, 60000); // Každých 60s
    
    // Načíst hned při startu
    refreshAllPrices();

    return () => {
      clearInterval(clockTimer);
      clearInterval(refreshTimer);
    };
  }, [watchlist.length]); // Spustí se znovu jen když přidáš/smažeš akcii

  // 4. POMOCNÉ FUNKCE
  const saveAndSet = (newList) => {
    setWatchlist(newList);
    localStorage.setItem('watchlist', JSON.stringify(newList));
  }

  const celkovePortfolio = watchlist.reduce((sum, item) => {
    const data = prices[item.symbol];
    const price = data ? data.p : 0;
    return sum + (price * item.shares);
  }, 0);

  const addToWatchlist = async () => {
    const cleanQuery = searchQuery.toUpperCase().trim();
    if (!cleanQuery) return;
    if (watchlist.find(s => s.symbol === cleanQuery)) {
      alert("Tuhle už máš.");
      return;
    }
    
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${cleanQuery}&token=${API_KEY}`);
      const data = await res.json();

      if (data.c === 0 || data.d === null) {
        alert("Symbol neexistuje.");
        setSearchQuery('');
        return;
      }

      const newList = [{ symbol: cleanQuery, shares: 1 }, ...watchlist];
      // Nejdřív uložíme cenu, pak teprve přidáme do seznamu
      setPrices(prev => ({ ...prev, [cleanQuery]: { p: data.c, d: data.dp } }));
      saveAndSet(newList);
      setSearchQuery('');
    } catch (err) {
      alert("Chyba spojení s burzou.");
    }
  };

  const updateShares = (symbol, newAmount) => {
    const newList = watchlist.map(item => 
      item.symbol === symbol ? { ...item, shares: Number(newAmount) } : item
    );
    saveAndSet(newList);
  }

  const removeFromWatchlist = (symbolToRemove) => {
    const newList = watchlist.filter(s => s.symbol !== symbolToRemove);
    saveAndSet(newList);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 font-sans">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Fintech <span className="text-indigo-500">Terminal</span></h1>
        </div>
        <div className="font-mono text-indigo-400 hidden sm:block bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
          {time.toLocaleTimeString("cs-CZ")}
        </div>
      </header>

      <section className="max-w-6xl mx-auto mb-8 flex gap-2">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
          placeholder="Hledej symbol (TSLA, NVDA...)"
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 w-full text-white focus:border-indigo-500 outline-none transition-all"
        />
        <button onClick={addToWatchlist} className="bg-indigo-600 px-8 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          Přidat
        </button>
      </section>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* DASHBOARD - CELKOVÉ PENÍZE */}
        <div className="bg-gradient-to-br from-indigo-800 to-red-400 rounded-3xl shadow-2xl shadow-indigo-500/20 flex flex-col justify-center text-center p-8 border border-white/10 min-h-[160px]">
          <div className="text-[10px] font-bold mb-2 uppercase tracking-widest text-indigo-100 opacity-80">Aktuální hodnota portfolia</div>
          <div className="text-4xl font-black text-white">
            ${celkovePortfolio.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </div>

        {/* VEJCOMĚR */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="text-indigo-400 text-[10px] font-bold mb-4 uppercase tracking-widest">Protein Intake 🥚</div>
            <div className="text-4xl font-black text-white mb-4">{eggs} <span className="text-lg text-slate-500 font-normal">ks</span></div>
          </div>
          <button onClick={() => {const n = eggs+1; setEggs(n); localStorage.setItem('eggs', n)}} className="w-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-3 rounded-xl hover:bg-indigo-500/20 transition-all font-bold">
            + Sníst vejce
          </button>
        </div>

        {/* KARTY AKCIÍ */}
        {watchlist.map(item => (
          <StockCard 
            key={item.symbol} 
            symbol={item.symbol}
            shares={item.shares}
            price={prices[item.symbol]?.p}
            change={prices[item.symbol]?.d}
            onUpdateShares={(val) => updateShares(item.symbol, val)}
            onDelete={() => removeFromWatchlist(item.symbol)}
          />
        ))}

        {watchlist.length > 0 && (
          <button onClick={() => {if(confirm('Smazat vše?')) saveAndSet([])}} className="col-span-full mt-10 text-slate-600 hover:text-red-500 text-xs transition-colors italic text-center uppercase tracking-widest pb-10">
            — Provést kompletní destrukci portfolia —
          </button>
        )}
      </main>
    </div>
  )
}

export default App