import React from "react"
import { ChartNoAxesColumnIncreasing, ChartNoAxesColumnDecreasing, X, CirclePlus, CircleMinus } from 'lucide-react';

function StockCard({ symbol, shares, price, change, onUpdateShares, onDelete }) {

const totalValue = (Number(price || 0) * Number(shares || 0)).toFixed(2);

  return (
    <div className="relative bg-slate-800/80 border border-slate-700 p-6 rounded-2xl hover:border-slate-500 transition-all group shadow-xl">
      {/* Smazání */}
      <button onClick={onDelete} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
        <X size={25}/>
      </button>

      <div className="flex items-start justify-between ">
        <h3 className="text-2xl font-black text-white tracking-tighter">{symbol}</h3>
        <div className={`text-xs font-bold px-2 py-1 rounded ${change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {change >= 0 ? <ChartNoAxesColumnIncreasing size={16} /> : <ChartNoAxesColumnDecreasing size={16} />} {Math.abs(change || 0).toFixed(2)}%
        </div>
      </div>

      <div className="space-y-4">
        {/* HLAVNÍ HODNOTA */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Market Value</p>
          <p className="text-3xl font-bold text-white">${totalValue}</p>
          <p className="text-[10px] text-slate-600 mt-1">Cena za kus: ${price ? price.toFixed(2) : '...'}</p>
        </div>

        {/* INPUT PRO KUSY */}
        <div className="pt-4 border-t border-slate-700/50">
          <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-2 text-center">Holding Shares</label>
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdateShares(Math.max(0, shares - 1))} className="bg-slate-700 w-10 h-8 rounded-lg hover:bg-slate-600 text-white flex justify-center items-center"><CircleMinus size={20} /></button>
            <input 
              onFocus = {(e) => e.target.select()}
              value={shares} 
              onChange={(e) => onUpdateShares(e.target.value)}
              className="bg-transparent text-center w-full text-white font-bold text-lg outline-none focus:text-indigo-400"
            />
            <button onClick={() => onUpdateShares(shares + 1)} className="bg-slate-700 w-10 h-8 rounded-lg hover:bg-slate-600 text-white flex justify-center items-center"><CirclePlus size={20} /></button>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default StockCard