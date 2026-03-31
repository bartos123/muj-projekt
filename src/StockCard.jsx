import React from "react"

function StockCard({ symbol, shares, price, change, onUpdateShares, onDelete }) {
  const totalValue = price ? (price * shares).toFixed(2) : '0.00'

  return (
    <div className="relative bg-slate-800/80 border border-slate-700 p-6 rounded-2xl hover:border-slate-500 transition-all group shadow-xl">
      <button onClick={onDelete} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-white tracking-tighter">{symbol}</h3>
        <div className={`text-xs font-bold px-2 py-1 rounded ${change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change || 0).toFixed(2)}%
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Aktuální hodnota pozice</p>
          <p className="text-3xl font-bold text-white">${totalValue}</p>
          <p className="text-[10px] text-slate-600 mt-1">Cena za kus: ${price ? price.toFixed(2) : '...'}</p>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-2 text-center">Počet kusů (Shares)</label>
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdateShares(Math.max(0, shares - 1))} className="bg-slate-700 w-10 h-10 rounded-lg hover:bg-slate-600 text-white font-bold">-</button>
            <input 
              type="number" 
              value={shares} 
              onChange={(e) => onUpdateShares(e.target.value)}
              className="bg-transparent text-center w-full text-white font-bold text-lg outline-none focus:text-indigo-400"
            />
            <button onClick={() => onUpdateShares(shares + 1)} className="bg-slate-700 w-10 h-10 rounded-lg hover:bg-slate-600 text-white font-bold">+</button>
          </div>
        </div>
      </div>   
    </div>
  )
}

export default StockCard