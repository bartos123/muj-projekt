import { useState, useEffect, useMemo } from 'react';

export function usePortfolio(apiKey) {
    const [watchlist, setWatchlist] = useState(() => {
      const saved = localStorage.getItem('watchlist')
      const parsed = saved ? JSON.parse(saved) : []
      return parsed.filter (item => item.symbol !== null && typeof item.symbol === 'string')
      })

    const [prices, setPrices] = useState(() => {
      const saved = localStorage.getItem('last_prices');
      return saved ? JSON.parse(saved) : {};
      });

    const [history, setHistory] = useState({});
    
    useEffect(() => {
      localStorage.setItem('last_prices', JSON.stringify(prices));
    }, [prices]);

    const saveAndSet = (newList) => {
        setWatchlist(newList);
        localStorage.setItem('watchlist', JSON.stringify(newList));
    };

    const handleStock = async (symbol, {add = false} = {}) => {
        try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
          const data = await res.json();

          if (data.c === 0) {
            alert('Neplatný symbol, zkus to znovu.')
            return null;
          }
          setPrices(prev => ({ ...prev, [symbol]: { p: data.c, d: data.dp } }));
          
          if (add) {
            symbol = symbol.toUpperCase();
            if (!watchlist.some(item => item.symbol === symbol)) {
              const newList = [{ symbol, shares: 1, buyPrice: data.c }, ...watchlist];
              saveAndSet(newList);
            } else {
              alert('Již v seznamu.')
            }
          }
          return data;
        } catch (error) {
          if (add) alert('Chyba načítání dat');
          return null;
        }
    };


    const stats = useMemo(() => {
        return watchlist.reduce((acc, item) => {
        const currentPrice = prices[item.symbol];
        const buyPrice = item.buyPrice || currentPrice?.p || 0;
        const currentValue = (currentPrice?.p || 0) * Number(item.shares || 0);
        const investedValue = buyPrice * Number(item.shares || 0);
        return { total: acc.total + currentValue, invested: acc.invested + investedValue };
        }, { total: 0, invested: 0 });
    }, [watchlist, prices]);
    
    const removeFromWatchlist = (symbolToRemove) => {
        const newList = watchlist.filter(s => s.symbol !== symbolToRemove);
        saveAndSet(newList);
    };

    const updateShares = (symbol, newAmount) => {
        const currentPrice = prices[symbol]?.p || 0;
  
        const newList = watchlist.map(item => {
        if (item.symbol === symbol) {
          const oldAmount = Number(item.shares);
          const newAmountNum = Number(newAmount);

          if (newAmountNum > oldAmount && currentPrice > 0) {
            const addedShares = newAmountNum - oldAmount;
            
            const newBuyPrice = (
              (oldAmount * (item.buyPrice || currentPrice)) + 
              (addedShares * currentPrice)
            ) / newAmountNum;

            return { ...item, shares: newAmountNum, buyPrice: newBuyPrice };
          }

          return { ...item, shares: newAmountNum };
        }
        return item;
      });

      saveAndSet(newList);
    };

    return {
        watchlist, prices, stats, history, setHistory,
        handleStock, updateShares, removeFromWatchlist, saveAndSet
    };
}
