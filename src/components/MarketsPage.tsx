import React, { useState, useMemo } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { Asset } from '../types/exchange';
import { Search, Star, ArrowUpDown, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export const MarketsPage: React.FC = () => {
  const {
    assets,
    setSelectedPairId,
    setActiveTab,
    setSelectedAssetForDetail,
    watchlist,
    toggleWatchlist,
  } = useExchange();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<'price' | 'change' | 'volume' | 'cap'>('volume');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Compute market summary metrics
  const totalMarketCap = useMemo(() => {
    return assets.reduce((sum, a) => sum + a.marketCap, 0);
  }, [assets]);

  const totalVolume = useMemo(() => {
    return assets.reduce((sum, a) => sum + a.volume24h, 0);
  }, [assets]);

  const btcDominance = useMemo(() => {
    const btc = assets.find((a) => a.symbol === 'BTC');
    if (!btc || totalMarketCap === 0) return 58.4;
    return (btc.marketCap / totalMarketCap) * 100;
  }, [assets, totalMarketCap]);

  const topGainer = useMemo(() => {
    return [...assets].sort((a, b) => b.change24h - a.change24h)[0];
  }, [assets]);

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let result = assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Watchlist') return watchlist.includes(`${asset.symbol}-USDT`);
      if (selectedCategory === 'Top Gainers') return asset.change24h > 0;
      if (selectedCategory === 'Top Losers') return asset.change24h < 0;
      return asset.category === selectedCategory;
    });

    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'price') {
        valA = a.priceUsd;
        valB = b.priceUsd;
      } else if (sortField === 'change') {
        valA = a.change24h;
        valB = b.change24h;
      } else if (sortField === 'volume') {
        valA = a.volume24h;
        valB = b.volume24h;
      } else if (sortField === 'cap') {
        valA = a.marketCap;
        valB = b.marketCap;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [assets, searchQuery, selectedCategory, watchlist, sortField, sortAsc]);

  const handleSort = (field: 'price' | 'change' | 'volume' | 'cap') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleTradeClick = (symbol: string) => {
    setSelectedPairId(`${symbol}-USDT`);
    setActiveTab('trade');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cryptocurrency Markets</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time quote exploration, 24-hour volume metrics, and instant spot pair execution.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search coin or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-[#151D2F] pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Market Overview Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Market Cap</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-white tabular-nums">
              ${(totalMarketCap / 1e12).toFixed(2)}T
            </span>
            <span className="text-xs text-emerald-400 font-semibold">+1.8%</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">24h Global Volume</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-white tabular-nums">
              ${(totalVolume / 1e9).toFixed(1)}B
            </span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">BTC Dominance</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-cyan-400 tabular-nums">
              {btcDominance.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500">of Total</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Top 24h Gainer</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-white">{topGainer?.symbol || 'SUI'}</span>
            <span className="text-xs text-emerald-400 font-bold tabular-nums">
              +{topGainer?.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs (Segmented controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'Watchlist', 'Layer 1', 'Infrastructure', 'Stablecoin', 'Top Gainers', 'Top Losers'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Markets Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0E1528] text-[11px] uppercase text-slate-400">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4 font-semibold text-slate-300">Asset</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Price</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('change')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>24h Change</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h High / Low</th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white hidden md:table-cell"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>24h Volume</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cap')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white hidden lg:table-cell"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Market Cap</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No cryptocurrency assets match the filter query.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const pairId = `${asset.symbol}-USDT`;
                  const isFavorited = watchlist.includes(pairId);
                  const isUp = asset.change24h >= 0;

                  return (
                    <tr
                      key={asset.symbol}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAssetForDetail(asset)}
                    >
                      {/* Star Watchlist */}
                      <td className="py-3 px-4" onClick={(e) => { e.stopPropagation(); toggleWatchlist(pairId); }}>
                        <button
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            isFavorited ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </td>

                      {/* Asset Name & Icon */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white text-xs shrink-0"
                            style={{ backgroundColor: asset.iconColor || '#3B82F6' }}
                          >
                            {asset.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-sans font-bold text-white block text-sm group-hover:text-blue-400 transition-colors">
                              {asset.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {asset.symbol} · {asset.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold text-white tabular-nums">
                          ${asset.priceUsd < 10
                            ? asset.priceUsd.toFixed(4)
                            : asset.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* 24h Change */}
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block font-semibold tabular-nums text-xs ${
                            isUp ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {asset.change24h.toFixed(2)}%
                        </span>
                      </td>

                      {/* 24h High / Low */}
                      <td className="py-3 px-4 text-right hidden sm:table-cell text-[11px] text-slate-300">
                        <div>${asset.high24h.toLocaleString()}</div>
                        <div className="text-slate-500">${asset.low24h.toLocaleString()}</div>
                      </td>

                      {/* 24h Volume */}
                      <td className="py-3 px-4 text-right hidden md:table-cell tabular-nums text-slate-300">
                        ${(asset.volume24h / 1e6).toFixed(1)}M
                      </td>

                      {/* Market Cap */}
                      <td className="py-3 px-4 text-right hidden lg:table-cell tabular-nums text-slate-300">
                        ${(asset.marketCap / 1e9).toFixed(2)}B
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleTradeClick(asset.symbol)}
                            className="rounded-lg bg-blue-600/20 px-3 py-1 font-sans text-xs font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            Trade
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
