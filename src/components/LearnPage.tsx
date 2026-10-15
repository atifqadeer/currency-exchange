import React from 'react';
import { Shield, Zap, Lock, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';

export const LearnPage: React.FC = () => {
  const { setActiveTab } = useExchange();

  const vipTiers = [
    { tier: 'VIP 0 (Standard)', volume: '< $50,000', maker: '0.10%', taker: '0.15%', withdrawal: '$25,000 / day' },
    { tier: 'VIP 1', volume: '≥ $50,000', maker: '0.08%', taker: '0.12%', withdrawal: '$100,000 / day' },
    { tier: 'VIP 2 (Institutional)', volume: '≥ $250,000', maker: '0.06%', taker: '0.10%', withdrawal: '$250,000 / day' },
    { tier: 'VIP 3', volume: '≥ $1,000,000', maker: '0.04%', taker: '0.08%', withdrawal: '$500,000 / day' },
    { tier: 'VIP 4', volume: '≥ $5,000,000', maker: '0.02%', taker: '0.06%', withdrawal: '$1,000,000 / day' },
    { tier: 'VIP 5 (Market Maker)', volume: '≥ $20,000,000', maker: '0.00% / Rebate', taker: '0.04%', withdrawal: 'Custom Uncapped' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 text-slate-100">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Transparency, Fee Schedules & Knowledge Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Everything you need to know about our fee tiering, order matching mechanics, and security architecture.
        </p>
      </div>

      {/* 1. VIP Fee Schedule */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
              01
            </span>
            <h2 className="text-lg font-bold text-white">Spot Trading Fee Schedule (VIP Tiers)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Calculated on 30-Day Trailing Volume</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0E1528] text-[11px] uppercase text-slate-400">
                <th className="py-3.5 px-4 font-semibold text-slate-300">Tier Level</th>
                <th className="py-3.5 px-4">30-Day Volume (USD)</th>
                <th className="py-3.5 px-4 text-emerald-400">Maker Fee</th>
                <th className="py-3.5 px-4 text-blue-400">Taker Fee</th>
                <th className="py-3.5 px-4 text-right">24h Withdrawal Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-[11px]">
              {vipTiers.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">{t.tier}</td>
                  <td className="py-3 px-4 text-slate-300">{t.volume}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{t.maker}</td>
                  <td className="py-3 px-4 text-blue-400 font-bold">{t.taker}</td>
                  <td className="py-3 px-4 text-right text-slate-200">{t.withdrawal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          * <span className="font-semibold text-slate-300">Maker orders</span> provide liquidity to the orderbook (limit orders not immediately matched). <span className="font-semibold text-slate-300">Taker orders</span> take existing liquidity off the book (market orders or crossing limit orders). Zero hidden fees or payment for order flow.
        </p>
      </section>

      {/* 2. Order Types Explained */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-600 text-xs font-bold text-slate-950">
            02
          </span>
          <h2 className="text-lg font-bold text-white">Understanding Order Execution Mechanics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3">
            <h3 className="font-bold text-white text-base">Market Orders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes immediately at the best available bid or ask price on the top of the orderbook. Designed for traders who prioritize execution speed over exact price certainty.
            </p>
            <div className="pt-2 text-[11px] font-mono text-cyan-400 border-t border-slate-800">
              Immediate Execution · Taker Fee
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3">
            <h3 className="font-bold text-white text-base">Limit Orders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specifies the maximum price you are willing to pay (Buy) or minimum price you will accept (Sell). Remains in the orderbook until filled by incoming market volume or cancelled.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400 border-t border-slate-800">
              Guaranteed Price · Maker Fee
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3">
            <h3 className="font-bold text-white text-base">Stop-Limit Orders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A conditional order that posts a limit order onto the book once a specified trigger price (Stop) is touched by the market. Essential for breakout entries and stop-loss risk containment.
            </p>
            <div className="pt-2 text-[11px] font-mono text-amber-400 border-t border-slate-800">
              Trigger Activated · Risk Control
            </div>
          </div>
        </div>
      </section>

      {/* 3. Security Architecture */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
            03
          </span>
          <h2 className="text-lg font-bold text-white">Ledger Architecture & Cryptographic Custody</h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111827] p-6 space-y-4 text-xs text-slate-300 leading-relaxed font-mono">
          <p>
            Traditional cryptocurrency exchanges often suffered from balance inconsistencies caused by floating-point math rounding and loose in-memory caching. AetherX is engineered with strict invariants:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-4 space-y-1">
              <span className="font-bold text-white font-sans text-sm block">Double-Entry Accounting</span>
              <p className="text-slate-400 text-[11px]">
                Total internal user balances identically match client ledger accounts with 0.00% unaccounted float.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-4 space-y-1">
              <span className="font-bold text-white font-sans text-sm block">Multi-Sig MPC Vaults</span>
              <p className="text-slate-400 text-[11px]">
                Over 95% of digital assets remain in geographically distributed offline cold vaults requiring quorum signing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Trade CTA banner */}
      <div className="rounded-2xl border border-blue-500/30 bg-[#151D2F] p-8 text-center space-y-3">
        <h3 className="text-xl font-bold text-white">Ready to Put Strategy into Practice?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Test market orders, manage limit positions, and monitor execution latencies directly in the trading sandbox.
        </p>
        <button
          onClick={() => setActiveTab('trade')}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors"
        >
          <span>Launch Trading Terminal</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
