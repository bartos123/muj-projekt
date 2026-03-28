import React, { useState, useEffect } from 'react'
import StockCard from './StockCard.jsx' // Importujeme naši novou součástku

function App() {
  const API_KEY = 'd73qc69r01qjjol3v9f0d73qc69r01qjjol3v9fg'
  const [eggs, setEggs] = useState(Number(localStorage.getItem('eggs')) || 0)
  const [time, setTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    return savedWatchlist ? JSON.parse(savedWatchlist) : []
  })

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
 
const addToWatchlist = async () => {
  const cleanQuery = searchQuery.toUpperCase().trim();
  
  if (!cleanQuery) return;
  if (watchlist.includes(cleanQuery)) {
    alert("Tuhle už v portfoliu máš, kámo.");
    return;
  }

  try {
    // Nejdřív ověříme, jestli akcie existuje
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${cleanQuery}&token=${API_KEY}`);
    const data = await res.json();

    // Finnhub u neexistujících akcií vrací 'c' (current price) jako 0
    if (data.c === 0 || data.d === null) {
      alert(`Symbol "${cleanQuery}" neexistuje. Zkus něco jinýho.`);
      setSearchQuery('');
      return;
    }

    // Pokud je vše ok, přidáme ji
    const newWatchlist = [cleanQuery, ...watchlist];
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    setSearchQuery('');
  } catch (err) {
    alert("Chyba spojení s burzou.");
  }
};
const removeFromWatchlist = (symbolToRemove) => {
  const newWatchlist = watchlist.filter(s => s !== symbolToRemove);
  setWatchlist(newWatchlist);
  localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
};

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <h1 className="text-3xl font-bold text-white">Muj Projekt</h1>
        <div className="font-mono text-indigo-400 hidden sm:block">
          {time.toLocaleTimeString("cs-CZ")}
        </div>
      </header>

      <section className="max-w-6xl mx-auto mb-8 flex gap-2">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Přidat akcii do watchlistu..."
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 w-full text-white focus:border-indigo-500 outline-none"
        />
        <button onClick={addToWatchlist} className="bg-indigo-600 px-8 rounded-xl font-bold hover:bg-indigo-500 transition-all">
          Přidat
        </button>
      </section>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* VEJCOMĚR */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <div className="text-indigo-400 text-xs font-bold mb-4">STATISTIKA 🥚</div>
          <div className="text-4xl font-bold mb-4">{eggs} ks</div>
          <button onClick={() => {setEggs(eggs+1); localStorage.setItem('eggs', eggs+1)}} className="w-full bg-slate-700 py-2 rounded-lg mb-2">Sníst vejce</button>
          <button onClick={() => {setEggs(0); localStorage.setItem('eggs', 0)}} className="w-full text-slate-500 text-sm">Reset</button>
        </div>
          {/* DESTRUKCE */}
        <div className="flex items-center justify-center h-full bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <button onClick={() => {setWatchlist([]); localStorage.removeItem('watchlist');}} className="w-full bg-slate-700 py-2 rounded-lg mb-4">
            Destrukce
          </button>
          </div>
        {/* WATCHLIST*/}
        {watchlist.map(s => (
          <StockCard 
            key={s} 
            symbol={s} 
            apiKey={API_KEY} 
            onDelete={() => removeFromWatchlist(s)} // Posíláme funkci "smeták"
          />
        ))}
        {watchlist.length === 0 && (
          <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500 italic">Terminál je prázdný. Přidej první akcii...</p>
          </div>
      )}
      </main>
    </div>
  )
}

export default App