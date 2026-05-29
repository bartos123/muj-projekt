import { useState, useMemo } from 'react';
import { StockItem, NewsItem } from '../../types/portfolio';

interface NewsFeedProps {
  news: NewsItem[];
  watchlist?: StockItem[];
  isOffline: boolean;
  isError: boolean;
}

export const NewsFeed = ({ news, watchlist = [], isOffline, isError }: NewsFeedProps) => {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredNews = useMemo(() => {
    if (!filter) return news;

    return news.filter(n => {
      if (n.relatedSymbol === filter) return true;
      
      const regex = new RegExp(`\\b${filter}\\b`, 'i');
      return regex.test(n.headline);
    });
  }, [news, filter]);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-stretch border-t-2 border-x-2 border-black bg-white sticky top-0 z-20">
        <div className="flex overflow-x-auto no-scrollbar flex-1 md:border-b-0">
          <button 
            onClick={() => setFilter(null)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] border-r-2 border-b-2 border-black transition-colors shrink-0 ${!filter ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}
          >
            GENERAL
          </button>
          
          {watchlist.map(item => (
            <button
              key={item.symbol}
              onClick={() => setFilter(filter === item.symbol ? null : item.symbol)}
              className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] border-r-2 border-b-2 border-black transition-colors shrink-0 ${filter === item.symbol ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}
            >
              ${item.symbol}
            </button>
          ))}
          <div className="flex-1 border-b-2 border-black bg-white"></div>
        </div>

        <div className="flex items-center justify-center border-b-2 md:border-l-2 border-black px-6 py-4 md:py-0 font-mono text-[10px] font-black tracking-widest shrink-0 select-none bg-zinc-100 md:bg-white">
          {isOffline && (
            <span className="bg-black text-white px-3 py-1 animate-pulse">
              [ OFFLINE - SAVED DATA ]
            </span>
          )}
          {!isOffline && isError && (
            <span className="text-black opacity-50 px-3 py-1 border border-black/30">
              [ API LIMIT REACHED - STALE DATA ]
            </span>
          )}
          {!isOffline && !isError && (
            <span className="text-black/20">
              [ ONLINE - REAL TIME DATA]
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar border-x-2 border-black">
        {filteredNews.length === 0 ? (
          <div className="p-20 text-center italic opacity-20 uppercase font-black tracking-widest text-2xl">
            — No_specific_intel_found —
          </div>
        ) : (
          <div className="divide-y-2 divide-black border-b-2 border-black">
            {filteredNews.map((n) => (
              <a 
                key={n.id} 
                href={n.url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white hover:bg-black group transition-all duration-200"
              >
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-4">
                    {n.relatedSymbol && (
                      <span className="bg-black text-white px-2 py-0.5 text-[9px] font-black group-hover:bg-white group-hover:text-black transition-colors uppercase">
                        ${n.relatedSymbol}
                      </span>
                    )}
                    
                    <span className="font-mono text-[9px] font-bold text-black/40 group-hover:text-white/40 uppercase tracking-[0.2em]">
                      {n.source}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-black/20 group-hover:text-white/20 uppercase tabular-nums">
                      {new Date(n.datetime * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h4 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter group-hover:text-white leading-[0.85] max-w-5xl">
                    {n.headline}
                  </h4>
                </div>
                
                <div className="flex items-center mt-6 md:mt-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 group-hover:text-white transition-opacity whitespace-nowrap">
                    READ_FULL_STORY [+]
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
        <div className="p-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-10">
            End of Intelligence Stream // {filteredNews.length} Reports
          </p>
        </div>
      </div>
    </div>
  );
};