import { PortfolioViewProps, SearchSuggestion, StockItem } from '../../types/portfolio';
import StockCard from './StockCard';

export const PortfolioView = ({
  watchlist, prices, updateShares, removeFromWatchlist, history,
  searchQuery, setSearchQuery, searchSymbols, suggestions, onAddStock,
  searchInputRef, searchContainerRef, saveAndSet
}: PortfolioViewProps) => {

  const targetCount = Math.max(8, Math.ceil(watchlist.length / 4) * 4);
  const emptySlots = targetCount - watchlist.length;
  
  return (
    <section className="h-full flex flex-col animate-in slide-in-from-right-8 fade-in duration-700 overflow-hidden">
      <section ref={searchContainerRef} className="w-full relative z-[110]">
        <div className="flex flex-col md:flex-row gap-0 group border-x-2 border-t-2 border-black bg-white">
          <div className="relative flex-1">
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); searchSymbols(e.target.value); }}
              onKeyDown={(e) => e.key === 'Enter' && onAddStock(searchQuery)}
              placeholder="Search symbol (TSLA, BTC, NVDA...)"
              className="bg-white px-6 md:px-12 h-24 w-full text-black text-2xl font-black uppercase outline-none placeholder:text-black/10 tabular-nums"
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full left-[-2px] right-[-2px] z-[100] bg-white border-2 border-black overflow-hidden shadow-2xl">
                {suggestions.map((s: SearchSuggestion) => (
                  <button
                    key={s.symbol}
                    onClick={() => onAddStock(s.symbol)}
                    className="w-full px-6 md:px-12 py-6 flex justify-between items-center border-b border-black bg-white hover:bg-black text-black hover:text-white last:border-0 group/item text-left cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-black text-xl tracking-tighter uppercase">
                        {s.symbol.split(':')[0]}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-60">
                        {s.description}
                      </span>
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest opacity-0 group-hover/item:opacity-100 border border-current px-2">
                      SELECT
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onAddStock(searchQuery)}
            className="bg-black text-white h-24 md:w-64 px-10 font-black text-xl uppercase tracking-[0.3em] hover:bg-white hover:text-black border-l-2 border-black transition-all shrink-0"
          >
            ADD
          </button>
        </div>
      </section>

      <div className="flex-1 flex flex-col bg-white border-2 border-black overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto -mr-[1px] -mb-[1px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 h-full auto-rows-[minmax(350px,50%)]">
            {watchlist.map((item: StockItem) => (
              <div key={item.symbol} className="bg-white h-full">
                <StockCard
                  symbol={item.symbol}
                  buyPrice={item.buyPrice}
                  shares={item.shares}
                  price={prices[item.symbol]?.p}
                  change={prices[item.symbol]?.d}
                  onUpdateShares={(val) => updateShares(item.symbol, Number(val))}
                  onDelete={() => removeFromWatchlist(item.symbol)}
                  historyData={history[item.symbol]}
                />
              </div>
            ))}
            {[...Array(emptySlots)].map((_, i) => (
              <div key={`empty-${i}`} className="bg-white border-b border-r border-black flex items-center justify-center h-full">
                <div className="text-black/5 font-black text-8xl select-none">+</div>
              </div>
            ))}

          </div>
        </div>
      </div>
      {watchlist.length > 0 && (
        <div className="pt-4 pb-2 flex justify-center shrink-0">
          <button
            onClick={() => { if (confirm('PURGE DATABASE?')) saveAndSet([]) }}
            className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20 hover:text-red-600 transition-colors"
          >
            — CLEAR ENTIRE PORTFOLIO —
          </button>
        </div>
      )}
      
    </section>
  );
};