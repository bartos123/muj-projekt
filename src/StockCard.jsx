import React, { useState, useEffect } from 'react'

// Přijímáme 'symbol' a 'apiKey' jako "props" (vstupní parametry)
function StockCard({ symbol, apiKey, onDelete }) {
      const [price, setPrice] = useState(0)
  const [change, setChange] = useState(0)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        )
        const data = await response.json()
        setPrice(data.c)
        setChange(data.dp)
      } catch (error) {
        console.error('Chyba karty:', error)
      }
    }
    fetchPrice()
  }, [symbol, apiKey])

return (
  /* Hlavní kontejner - jen jeden! */
  <div className="relative bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-emerald-500 transition-all group">
    
    {/* Smazací tlačítko - je "absolute", takže plave v rohu toho hlavního divu */}
    <button 
      onClick={onDelete}
      className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
    >
      ✕
    </button>

    {/* Obsah karty - už bez obalového divu navíc */}
    <div className="flex justify-between items-start mb-4">
      <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded">
        LIVE MARKET
      </span>
      <span className={`font-bold text-sm px-3 py-1 rounded-lg ${change >= 0 ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'}`}>
        {typeof change === 'number' ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%` : '0.00%'}
      </span>          
    </div>

    <h3 className="text-slate-400 text-sm font-medium uppercase mb-1">{symbol}</h3>
    <div className="text-4xl font-bold text-white mb-4">
      ${typeof price === 'number' ? price.toFixed(2) : '...'}
    </div>
    <p className="text-[10px] text-slate-500 mt-2 italic">Live data via Finnhub</p>
  </div>
)
}

export default StockCard