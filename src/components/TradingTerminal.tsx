import React, { useState, useEffect } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { TradingChart } from './TradingChart';
import { OrderBook } from './OrderBook';
import { OrderSide, OrderType } from '../types/exchange';
import {
  Search,
  ChevronDown,
  Star,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';

export const TradingTerminal: React.FC = () => {
  const {
    tradingPairs,
    selectedPairId,
    setSelectedPairId,
    currentPair,
    orderBook,
    recentTrades,
    candles,
    timeframe,
    setTimeframe,
    balances,
    placeOrder,
    cancelOrder,
    cancelAllOrders,
    orders,
    tradeExecutions,
    watchlist,
    toggleWatchlist,
    setActiveTab,
  } = useExchange();

  // Order Placement Form State
  const [orderSide, setOrderSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [priceInput, setPriceInput] = useState<string>(currentPair.lastPrice.toString());
  const [stopPriceInput, setStopPriceInput] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [pairSelectorOpen, setPairSelectorOpen] = useState(false);
  const [pairSearchQuery, setPairSearchQuery] = useState('');
  const [bottomTab, setBottomTab] = useState<'open' | 'history' | 'executions' | 'balances'>('open');

  // Sync price when pair changes
  useEffect(() => {
    setPriceInput(currentPair.lastPrice.toString());
  }, [currentPair.id, currentPair.lastPrice]);

  const baseAsset = currentPair.baseAsset;
  const quoteAsset = currentPair.quoteAsset;
  const baseBal = balances[baseAsset] || { free: 0, inOrder: 0 };
  const quoteBal = balances[quoteAsset] || { free: 0, inOrder: 0 };

  const parsedPrice = parseFloat(priceInput) || currentPair.lastPrice;
  const parsedAmount = parseFloat(amountInput) || 0;
  const totalUsd = parsedPrice * parsedAmount;
  const feeRate = orderType === 'MARKET' ? currentPair.takerFeeRate : currentPair.makerFeeRate;
  const estimatedFee = totalUsd * feeRate;

  // Percentage shortcut helper
  const handlePercentageClick = (pct: number) => {
    if (orderSide === 'BUY') {
      const availableQuote = quoteBal.free;
      const targetSpend = (availableQuote * pct) / 100;
      const calcAmount = targetSpend / (parsedPrice * (1 + feeRate));
      setAmountInput(calcAmount > 0 ? calcAmount.toFixed(currentPair.quantityPrecision) : '0');
    } else {
      const availableBase = baseBal.free;
      const calcAmount = (availableBase * pct) / 100;
      setAmountInput(calcAmount > 0 ? calcAmount.toFixed(currentPair.quantityPrecision) : '0');
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) return;

    placeOrder({
      side: orderSide,
      type: orderType,
      price: orderType === 'MARKET' ? currentPair.lastPrice : parsedPrice,
      amount: parsedAmount,
      stopPrice: orderType === 'STOP_LIMIT' ? parseFloat(stopPriceInput) || undefined : undefined,
    });

    setAmountInput('');
  };

  // Filter pairs for dropdown selector
  const filteredPairs = tradingPairs.filter((p) =>
    p.id.toLowerCase().includes(pairSearchQuery.toLowerCase())
  );

  const openOrdersCount = orders.filter((o) => o.status === 'OPEN').length;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#0B1020] text-slate-100">
      {/* Top Header Strip: Selected Pair, 24h Ticker Stats */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-[#0E1528] px-4 py-2 text-xs">
        {/* Pair Dropdown Selector */}
        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setPairSelectorOpen(!pairSelectorOpen)}
            className="flex items-center gap-2 rounded-lg bg-[#151D2F] px-3 py-1.5 font-bold text-white hover:bg-slate-800 transition-colors border border-slate-750"
          >
            <span className="text-base tracking-tight">{currentPair.id}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <button
            onClick={() => toggleWatchlist(currentPair.id)}
            className={`p-1.5 rounded transition-colors ${
              watchlist.includes(currentPair.id) ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Watchlist"
          >
            <Star className="h-4 w-4 fill-current" />
          </button>

          {/* Pair Selector Dropdown Modal */}
          {pairSelectorOpen && (
            <div className="absolute top-11 left-0 z-50 w-72 rounded-xl border border-slate-800 bg-[#151D2F] p-3 shadow-2xl">
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search pairs (BTC, ETH...)"
                  value={pairSearchQuery}
                  onChange={(e) => setPairSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-[#0B1020] pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredPairs.map((pair) => (
                  <div
                    key={pair.id}
                    onClick={() => {
                      setSelectedPairId(pair.id);
                      setPairSelectorOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs cursor-pointer transition-colors ${
                      pair.id === currentPair.id
                        ? 'bg-blue-600/20 text-blue-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{pair.id}</span>
                    <div className="text-right font-mono">
                      <span className="block text-slate-100">{pair.lastPrice.toFixed(pair.pricePrecision)}</span>
                      <span
                        className={`text-[10px] ${
                          pair.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pair.priceChangePercent >= 0 ? '+' : ''}
                        {pair.priceChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 24h Stats Ribbon */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Last Price</span>
            <span
              className={`text-sm font-bold tabular-nums ${
                currentPair.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ${currentPair.lastPrice.toFixed(currentPair.pricePrecision)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">24h Change</span>
            <span
              className={`font-semibold tabular-nums ${
                currentPair.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {currentPair.priceChangePercent >= 0 ? '+' : ''}
              {currentPair.priceChangePercent.toFixed(2)}%
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-500 block text-[10px] uppercase">24h High</span>
            <span className="text-slate-200 tabular-nums">
              ${currentPair.highPrice.toFixed(currentPair.pricePrecision)}
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-500 block text-[10px] uppercase">24h Low</span>
            <span className="text-slate-200 tabular-nums">
              ${currentPair.lowPrice.toFixed(currentPair.pricePrecision)}
            </span>
          </div>
          <div className="hidden md:block">
            <span className="text-slate-500 block text-[10px] uppercase">24h Volume ({quoteAsset})</span>
            <span className="text-slate-200 tabular-nums">
              ${currentPair.volumeQuote.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart (Center), Order Book (Right), Order Form (Side/Right-most) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 border-b border-slate-800">
        {/* Center: Chart (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col min-h-[420px] border-b lg:border-b-0 lg:border-r border-slate-800">
          <TradingChart
            candles={candles}
            symbol={currentPair.id}
            pricePrecision={currentPair.pricePrecision}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onPriceClick={(p) => setPriceInput(p.toString())}
          />
        </div>

        {/* Right: Order Book (2.5 cols on lg) */}
        <div className="lg:col-span-2.5 flex flex-col min-h-[380px] border-b lg:border-b-0 lg:border-r border-slate-800">
          <OrderBook
            orderBook={orderBook}
            recentTrades={recentTrades}
            baseAsset={currentPair.baseAsset}
            quoteAsset={currentPair.quoteAsset}
            pricePrecision={currentPair.pricePrecision}
            lastPrice={currentPair.lastPrice}
            onSelectPrice={(p) => setPriceInput(p.toString())}
          />
        </div>

        {/* Far Right: Order Placement Form (2.5 cols on lg) */}
        <div className="lg:col-span-2.5 flex flex-col bg-[#0E1528] p-3 text-xs">
          {/* Buy / Sell Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#0B1020] p-1 mb-3">
            <button
              onClick={() => setOrderSide('BUY')}
              className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                orderSide === 'BUY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Buy {baseAsset}
            </button>
            <button
              onClick={() => setOrderSide('SELL')}
              className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                orderSide === 'SELL'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sell {baseAsset}
            </button>
          </div>

          {/* Order Type Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-800 pb-2 mb-3 text-[11px]">
            {(['LIMIT', 'MARKET', 'STOP_LIMIT'] as OrderType[]).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`px-2 py-1 rounded transition-colors ${
                  orderType === type
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'STOP_LIMIT' ? 'Stop-Limit' : type === 'LIMIT' ? 'Limit' : 'Market'}
              </button>
            ))}
          </div>

          {/* Available balance indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
            <span>Avail:</span>
            <span className="text-slate-200 tabular-nums">
              {orderSide === 'BUY'
                ? `${quoteBal.free.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${quoteAsset}`
                : `${baseBal.free.toFixed(4)} ${baseAsset}`}
            </span>
          </div>

          <form onSubmit={handleOrderSubmit} className="space-y-3">
            {/* Stop Price input if Stop-Limit */}
            {orderType === 'STOP_LIMIT' && (
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                  Stop Price ({quoteAsset})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="Trigger Price"
                    value={stopPriceInput}
                    onChange={(e) => setStopPriceInput(e.target.value)}
                    className="w-full rounded-md border border-slate-800 bg-[#0B1020] px-3 py-1.5 font-mono text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Price input (Disabled if Market) */}
            {orderType !== 'MARKET' ? (
              <div>
                <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-400 mb-1">
                  <span>Price ({quoteAsset})</span>
                  <button
                    type="button"
                    onClick={() => setPriceInput(currentPair.lastPrice.toString())}
                    className="text-cyan-400 hover:underline"
                  >
                    Market
                  </button>
                </div>
                <input
                  type="number"
                  step="any"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-[#0B1020] px-3 py-1.5 font-mono text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                  Price ({quoteAsset})
                </label>
                <div className="w-full rounded-md border border-slate-800 bg-[#0B1020]/60 px-3 py-1.5 font-mono text-xs text-slate-400">
                  Best Market Offer (Instant)
                </div>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Amount ({baseAsset})
              </label>
              <input
                type="number"
                step="any"
                placeholder={`Min ${currentPair.minOrderQuantity}`}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-[#0B1020] px-3 py-1.5 font-mono text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Percentage Quick Shortcuts */}
            <div className="grid grid-cols-4 gap-1">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageClick(pct)}
                  className="rounded border border-slate-800 bg-[#151D2F] py-1 text-[10px] font-mono font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>

            {/* Order Summary & Transparent Fee Schedule */}
            <div className="space-y-1.5 rounded-lg border border-slate-800 bg-[#0B1020] p-2.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Order Value:</span>
                <span className="text-slate-200 tabular-nums">${totalUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Est. Fee ({feeRate * 100}%):</span>
                <span className="text-slate-300 tabular-nums">
                  ${estimatedFee.toFixed(4)} {quoteAsset}
                </span>
              </div>
              <div className="border-t border-slate-800/80 pt-1 flex justify-between font-semibold">
                <span className="text-slate-300">Total Outlay:</span>
                <span className="text-white tabular-nums">
                  ${(orderSide === 'BUY' ? totalUsd + estimatedFee : totalUsd - estimatedFee).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className={`w-full py-2.5 text-xs font-bold rounded-lg shadow-lg transition-transform active:scale-98 ${
                orderSide === 'BUY'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
              }`}
            >
              {orderSide === 'BUY' ? `Buy ${baseAsset}` : `Sell ${baseAsset}`}
            </button>
          </form>

          {/* Quick deposit prompt if low balance */}
          {(orderSide === 'BUY' ? quoteBal.free < 100 : baseBal.free <= 0) && (
            <div className="mt-3 rounded border border-amber-500/20 bg-amber-950/20 p-2 text-[10px] text-amber-300 flex items-center justify-between">
              <span>Low {orderSide === 'BUY' ? quoteAsset : baseAsset} balance.</span>
              <button
                onClick={() => setActiveTab('wallet')}
                className="underline font-semibold hover:text-white"
              >
                Top Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Open Orders, Order History, Trade Executions, Balances */}
      <div className="flex flex-col bg-[#0B1020]">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0E1528] px-4 py-2 text-xs">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setBottomTab('open')}
              className={`flex items-center gap-1.5 font-medium transition-colors ${
                bottomTab === 'open' ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Open Orders</span>
              {openOrdersCount > 0 && (
                <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[10px] font-mono text-blue-400">
                  {openOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setBottomTab('history')}
              className={`font-medium transition-colors ${
                bottomTab === 'history' ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5' : 'text-slate-400 hover:text-white'
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setBottomTab('executions')}
              className={`font-medium transition-colors ${
                bottomTab === 'executions' ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trade Executions
            </button>
            <button
              onClick={() => setBottomTab('balances')}
              className={`font-medium transition-colors ${
                bottomTab === 'balances' ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5' : 'text-slate-400 hover:text-white'
              }`}
            >
              Account Balances
            </button>
          </div>

          {bottomTab === 'open' && openOrdersCount > 0 && (
            <button
              onClick={cancelAllOrders}
              className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Cancel All Open
            </button>
          )}
        </div>

        {/* Tab Content Tables */}
        <div className="min-h-[180px] max-h-[260px] overflow-y-auto p-3 text-xs font-mono">
          {bottomTab === 'open' && (
            <div>
              {orders.filter((o) => o.status === 'OPEN').length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-slate-500">
                  <Clock className="h-6 w-6 stroke-1 mb-1 text-slate-600" />
                  <span>No open orders. Place a limit order to view it in the book.</span>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500">
                      <th className="py-2">Time</th>
                      <th>Pair</th>
                      <th>Type</th>
                      <th>Side</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Total</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-[11px]">
                    {orders
                      .filter((o) => o.status === 'OPEN')
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/50">
                          <td className="py-1.5 text-slate-400">
                            {new Date(o.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="font-semibold text-slate-200">{o.pairId}</td>
                          <td className="text-slate-400">{o.type}</td>
                          <td className={o.side === 'BUY' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {o.side}
                          </td>
                          <td className="text-right tabular-nums">{o.price.toFixed(2)}</td>
                          <td className="text-right tabular-nums">{o.amount.toFixed(4)}</td>
                          <td className="text-right tabular-nums">${o.totalUsd.toFixed(2)}</td>
                          <td className="text-center">
                            <button
                              onClick={() => cancelOrder(o.id)}
                              className="rounded px-2 py-0.5 text-[10px] text-rose-400 hover:bg-rose-950/40 border border-rose-800/40"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {bottomTab === 'history' && (
            <div>
              {orders.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-slate-500">
                  No previous orders recorded this session.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500">
                      <th className="py-2">Order ID</th>
                      <th>Time</th>
                      <th>Pair</th>
                      <th>Side</th>
                      <th>Type</th>
                      <th className="text-right">Executed Price</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Fee</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-[11px]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/50">
                        <td className="py-1.5 text-slate-500">{o.id}</td>
                        <td className="text-slate-400">{new Date(o.createdAt).toLocaleTimeString()}</td>
                        <td className="text-slate-200">{o.pairId}</td>
                        <td className={o.side === 'BUY' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                          {o.side}
                        </td>
                        <td className="text-slate-400">{o.type}</td>
                        <td className="text-right tabular-nums">${o.price.toFixed(2)}</td>
                        <td className="text-right tabular-nums">{o.amount.toFixed(4)}</td>
                        <td className="text-right tabular-nums text-slate-400">${o.feePaid.toFixed(4)}</td>
                        <td className="text-center">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${
                              o.status === 'FILLED'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : o.status === 'CANCELLED'
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-blue-950/60 text-blue-400'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {bottomTab === 'executions' && (
            <div>
              {tradeExecutions.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-slate-500">
                  No trade executions yet. Place a Market or Limit order to simulate engine matching.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500">
                      <th className="py-2">Execution Ref</th>
                      <th>Timestamp</th>
                      <th>Pair</th>
                      <th>Side</th>
                      <th>Role</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Total</th>
                      <th className="text-right">Fee Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-[11px]">
                    {tradeExecutions.map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-900/50">
                        <td className="py-1.5 text-blue-400">{ex.id}</td>
                        <td className="text-slate-400">{ex.timestamp}</td>
                        <td className="text-slate-200">{ex.pairId}</td>
                        <td className={ex.side === 'BUY' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                          {ex.side}
                        </td>
                        <td className="text-slate-400 text-[10px]">{ex.role}</td>
                        <td className="text-right tabular-nums">${ex.price.toFixed(2)}</td>
                        <td className="text-right tabular-nums">{ex.amount.toFixed(4)}</td>
                        <td className="text-right tabular-nums">${ex.total.toFixed(2)}</td>
                        <td className="text-right tabular-nums text-slate-400">${ex.fee.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {bottomTab === 'balances' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
              {Object.keys(balances).map((sym) => {
                const b = balances[sym];
                if (b.free === 0 && b.inOrder === 0) return null;
                return (
                  <div key={sym} className="rounded-lg border border-slate-800 bg-[#151D2F] p-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span>{sym}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Total: {(b.free + b.inOrder).toFixed(sym === 'USDT' || sym === 'USDC' ? 2 : 4)}
                      </span>
                    </div>
                    <div className="space-y-0.5 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Free:</span>
                        <span className="text-slate-200 tabular-nums">
                          {b.free.toFixed(sym === 'USDT' || sym === 'USDC' ? 2 : 4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Order:</span>
                        <span className="text-amber-400 tabular-nums">
                          {b.inOrder.toFixed(sym === 'USDT' || sym === 'USDC' ? 2 : 4)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
