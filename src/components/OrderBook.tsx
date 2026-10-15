import React, { useState } from 'react';
import { OrderBook as OrderBookType, RecentTrade } from '../types/exchange';

interface OrderBookProps {
  orderBook: OrderBookType;
  recentTrades: RecentTrade[];
  baseAsset: string;
  quoteAsset: string;
  pricePrecision: number;
  lastPrice: number;
  onSelectPrice: (price: number) => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  orderBook,
  recentTrades,
  baseAsset,
  quoteAsset,
  pricePrecision,
  lastPrice,
  onSelectPrice,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'trades'>('book');

  return (
    <div className="flex h-full flex-col border-l border-slate-800 bg-[#0E1528] text-slate-200">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('book')}
            className={`font-semibold transition-colors ${
              activeTab === 'book' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Order Book
          </button>
          <span className="text-slate-600">·</span>
          <button
            onClick={() => setActiveTab('trades')}
            className={`font-semibold transition-colors ${
              activeTab === 'trades' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recent Trades
          </button>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Decimals: {pricePrecision}
        </div>
      </div>

      {activeTab === 'book' ? (
        <div className="flex flex-1 flex-col justify-between overflow-hidden p-2 text-xs font-mono">
          {/* Column Titles */}
          <div className="grid grid-cols-3 text-[10px] text-slate-500 pb-1 border-b border-slate-800/60">
            <span className="text-left">Price ({quoteAsset})</span>
            <span className="text-right">Size ({baseAsset})</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sells - Red) */}
          <div className="flex flex-col-reverse justify-end overflow-hidden space-y-reverse space-y-0.5 py-1">
            {orderBook.asks.slice(0, 7).map((ask, idx) => (
              <div
                key={`ask-${idx}`}
                onClick={() => onSelectPrice(ask.price)}
                className="group relative grid grid-cols-3 cursor-pointer py-0.5 px-1 hover:bg-slate-800/60 rounded transition-colors text-[11px]"
              >
                {/* Visual Depth Bar */}
                <div
                  className="absolute right-0 top-0 bottom-0 bg-rose-500/15 pointer-events-none transition-all"
                  style={{ width: `${ask.depthPercent}%` }}
                />
                <span className="relative z-10 text-rose-400 tabular-nums font-medium text-left">
                  {ask.price.toFixed(pricePrecision)}
                </span>
                <span className="relative z-10 text-slate-300 tabular-nums text-right">
                  {ask.amount.toFixed(4)}
                </span>
                <span className="relative z-10 text-slate-500 tabular-nums text-right">
                  {ask.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Spread / Mid Price Indicator */}
          <div className="my-1.5 flex items-center justify-between border-y border-slate-800/80 bg-[#151D2F] px-2 py-1.5 rounded">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tabular-nums">
                {lastPrice.toFixed(pricePrecision)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase">{quoteAsset}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Spread: <span className="text-cyan-400 tabular-nums">{orderBook.spread.toFixed(pricePrecision)}</span>{' '}
              ({orderBook.spreadPercent.toFixed(3)}%)
            </div>
          </div>

          {/* Bids (Buys - Green) */}
          <div className="flex flex-col justify-start overflow-hidden space-y-0.5 py-1">
            {orderBook.bids.slice(0, 7).map((bid, idx) => (
              <div
                key={`bid-${idx}`}
                onClick={() => onSelectPrice(bid.price)}
                className="group relative grid grid-cols-3 cursor-pointer py-0.5 px-1 hover:bg-slate-800/60 rounded transition-colors text-[11px]"
              >
                {/* Visual Depth Bar */}
                <div
                  className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 pointer-events-none transition-all"
                  style={{ width: `${bid.depthPercent}%` }}
                />
                <span className="relative z-10 text-emerald-400 tabular-nums font-medium text-left">
                  {bid.price.toFixed(pricePrecision)}
                </span>
                <span className="relative z-10 text-slate-300 tabular-nums text-right">
                  {bid.amount.toFixed(4)}
                </span>
                <span className="relative z-10 text-slate-500 tabular-nums text-right">
                  {bid.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Recent Trades Stream */
        <div className="flex-1 overflow-y-auto p-2 text-xs font-mono">
          <div className="grid grid-cols-3 text-[10px] text-slate-500 pb-1 border-b border-slate-800/60">
            <span className="text-left">Price ({quoteAsset})</span>
            <span className="text-right">Size ({baseAsset})</span>
            <span className="text-right">Time</span>
          </div>
          <div className="space-y-1 py-1">
            {recentTrades.map((t) => (
              <div key={t.id} className="grid grid-cols-3 py-0.5 px-1 text-[11px]">
                <span
                  className={`text-left tabular-nums font-medium ${
                    t.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.price.toFixed(pricePrecision)}
                </span>
                <span className="text-right text-slate-300 tabular-nums">
                  {t.amount.toFixed(4)}
                </span>
                <span className="text-right text-slate-500 tabular-nums text-[10px]">
                  {t.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
