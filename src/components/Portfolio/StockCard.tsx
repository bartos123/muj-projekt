import { X, Plus, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { StockCardProps, CustomTooltipProps } from '../../types/portfolio';

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase">
        ${payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

function StockCard({ symbol, shares, price, change = 0, onUpdateShares, onDelete, buyPrice, historyData }: StockCardProps) {
  const currentVal = (price || 0) * (shares || 0);
  const investedVal = (buyPrice || price || 0) * (shares || 0);
  const cardProfit = currentVal - investedVal;
  const cardProfitPercent = investedVal > 0 ? (cardProfit / investedVal) * 100 : 0;

  const chartData = historyData ? historyData.map((val, i) => ({ val, time: i })) : [];

  return (
    <div className="relative bg-white border-b border-r border-black p-8 flex flex-col h-full group hover:bg-zinc-50 transition-colors overflow-hidden">      
      <button 
        onClick={onDelete} 
        className="absolute top-0 right-0 w-10 h-10 border-l border-b border-black flex items-center justify-center text-black opacity-20 hover:opacity-100 hover:bg-black hover:text-white transition-all z-30"
      >
        <X size={18} strokeWidth={3} />
      </button>

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-5xl font-black uppercase tracking-tighter leading-none mb-1 pr-6">
          {symbol}
        </h3>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}% (24H)
        </span>
      </div>

      {/* GRAPH AREA*/}
      <div className="h-32 w-full my-auto flex items-center justify-center">
        {chartData.length === 0 ? (
          <div className="w-full border-b border-dashed border-black/10 text-[9px] font-mono tracking-widest text-black/20 text-center pb-2">
            NO DATA
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'black', strokeWidth: 0.5 }} />
              <Line 
                type="linear" 
                dataKey="val" 
                stroke="black" 
                strokeWidth={1.5} 
                dot={false} 
                activeDot={{ r: 4, fill: 'black', strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-black/30">
              Position Value
            </label>
            <div className="text-4xl font-black tabular-nums tracking-tighter leading-none">
              ${currentVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-2 border-t border-black divide-x divide-black -mx-8 -mb-8 min-h-[110px]">
          
          {/* HOLDINGS */}
          <div className="flex divide-x divide-black bg-white">
            <div className="flex-1 p-4 flex flex-col justify-between">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-black/30 mb-2">
                Units
              </label>
              <div className="text-4xl font-black tabular-nums leading-none tracking-tighter">
                {shares}
              </div>
            </div>
            
            <div className="w-12 grid grid-rows-2 divide-y divide-black">
              <button 
                onClick={() => onUpdateShares(shares + 1)} 
                className="flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <Plus size={16} strokeWidth={4} />
              </button>
              <button 
                onClick={() => onUpdateShares(Math.max(0, shares - 1))} 
                className="flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <Minus size={16} strokeWidth={4} />
              </button>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className={`p-4 flex flex-col justify-between transition-colors ${cardProfit < 0 ? 'bg-black text-white' : 'bg-white'}`}>
            <div className="flex justify-between items-start">
              <label className={`text-[8px] font-black uppercase tracking-[0.2em] ${cardProfit < 0 ? 'text-white/30' : 'text-black/30'}`}>
                Return
              </label>
              <div className={`text-[10px] font-black tabular-nums ${cardProfit < 0 ? 'text-white/40' : 'text-black/40'}`}>
                {cardProfitPercent.toFixed(2)}%
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-black tabular-nums leading-none tracking-tighter">
                {cardProfit >= 0 ? '+' : ''}{cardProfit.toFixed(2)}
              </div>
            </div>
          </div>

        </div>
      </div>
  );
}

export default StockCard;