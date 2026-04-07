import React from "react"
import { ChartNoAxesColumnIncreasing, ChartNoAxesColumnDecreasing, X, CirclePlus, CircleMinus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
function StockCard({ symbol, shares, price, change, onUpdateShares, onDelete, buyPrice, historyData }) {

const currentVal = Number(price || 0) * Number(shares || 0);
const investedVal = Number(buyPrice || price || 0) * Number(shares || 0);
const cardProfit = currentVal - investedVal;
const cardProfitPercent = investedVal > 0 ? (cardProfit / investedVal) * 100 : 0;
const chartData = historyData ? historyData.map((val, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (historyData.length - 1 - i));
  
  return {
    val,
    fullDate: d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' }),
    xAxisLabel: i === 0 ? 'Před měsícem' : i === historyData.length - 1 ? 'Dnes' : ''
  };
}) : [];
  return (
    <div className="relative bg-slate-800/80 border border-slate-700 p-6 rounded-2xl hover:border-slate-500 transition-all group shadow-xl">
      {/* Smazání */}
      <button onClick={onDelete} className="absolute top-4 right-4 text-slate-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-red-500 transition-all">
        <X size={25}/>
      </button>

      <div className="flex items-start justify-between ">
        <h3 className="text-2xl font-black text-white tracking-tighter">{symbol}</h3>
        <div className={`text-xs font-bold px-2 py-1 rounded ${change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {change >= 0 ? <ChartNoAxesColumnIncreasing size={16} /> : <ChartNoAxesColumnDecreasing size={16} />} {Math.abs(change || 0).toFixed(2)}%
        </div>
      </div>
      
{/* SPARKLINE GRAF */}
<div className="h-24 w-full mb-6 relative group/chart" style ={{minWidth: 0}}>
{historyData && historyData.length > 0 ? (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={chartData}>
      <YAxis hide domain={['auto', 'auto']} />
      
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#1e293b', 
          border: '1px solid #334155', 
          borderRadius: '12px',
          fontSize: '12px'
        }}
        labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
        formatter={(value) => [`$${value.toFixed(2)}`, 'Cena']}
      />

      <XAxis 
        dataKey="fullDate" 
        hide={false}
        tickLine={false}
        axisLine={false}
        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
        padding={{ left: 40, right: 20 }} 
        interval={0}
        tickFormatter={(value, index) => {
          if (index === 0) return 'Před měsícem';
          if (index === chartData.length - 1) return 'Dnes';
          return '';
        }}
      />

      <Line 
        type="monotone" 
        dataKey="val" 
        stroke={change >= 0 ? "#10b981" : "#ef4444"} 
        strokeWidth={3} 
        dot={false} 
        activeDot={{ r: 6, strokeWidth: 0 }}
      />
    </LineChart>
  </ResponsiveContainer> ) : (
    <div className="h-24 w-full mb-6 flex items-center justify-center">
      <p className="text-sm text-slate-500">Žádná data z minulosti</p>
    </div>)}
</div>
      <div className="space-y-4">
        {/* HLAVNÍ HODNOTA */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Market Value</p>
          <p className="text-3xl font-bold text-white">${currentVal.toFixed(2)}</p>
          <p className={`text-[10px] font-bold ${cardProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {cardProfit !==0 && `${cardProfit >= 0 ? 'Profit' : 'Loss'}: ${Math.abs(cardProfit).toFixed(2)} (${Math.abs(cardProfitPercent).toFixed(2)}%)`}
          </p>
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