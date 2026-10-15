import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  ChevronDown,
  Layers,
  Database,
  CheckCircle2,
  Activity,
  FileCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { assets, setActiveTab, setSelectedPairId } = useExchange();

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredAssets = assets.slice(0, 4);

  const handleTradeAsset = (symbol: string) => {
    setSelectedPairId(`${symbol}-USDT`);
    setActiveTab('trade');
  };

  const faqs = [
    {
      q: 'How does AetherX handle order matching and balance settlement?',
      a: 'AetherX utilizes a deterministic matching engine operating with sub-millisecond execution times. Balances are managed using a strict double-entry ledger architecture, ensuring every credit, debit, and trading fee has a verifiable, immutable record with zero floating-point discrepancies.',
    },
    {
      q: 'Is this environment connected to real blockchain networks?',
      a: 'This interactive application is configured in Demo Sandbox Mode. Market prices are driven by a real-time stochastic simulation, and all balances are virtual test funds ($50,000 USDT initial grant). Real-money trading requires jurisdiction-specific regulatory licensing (such as MiCA, FinCEN, or FCA) and verified custody integration.',
    },
    {
      q: 'What order types are supported on the exchange?',
      a: 'The spot trading terminal supports Market Orders (executed immediately against the top of the orderbook), Limit Orders (posted to the orderbook and filled when the market meets your price), and Stop-Limit Orders for automated breakout or stop-loss protection.',
    },
    {
      q: 'What are the tier-based fee schedules?',
      a: 'AetherX implements transparent Maker and Taker fee tiers starting at 0.10% maker and 0.15% taker for basic accounts, reducing down to 0.02% maker and 0.04% taker for institutional volume tiers, with zero hidden spreads.',
    },
  ];

  return (
    <div className="flex flex-col bg-[#0B1020] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0E1528] via-[#0B1020] to-[#0B1020] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span>Next-Generation Digital Asset Infrastructure</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Your Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Digital Assets</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Institutional spot trading terminal, real-time depth orderbook, multi-asset ledger wallet, and audited double-entry accounting built for serious traders.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('trade')}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Start Trading</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTab('markets')}
                  className="px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition-colors"
                >
                  Explore Markets
                </button>
              </div>

              {/* Trust signals */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs font-mono text-slate-400">
                <div>
                  <span className="text-white font-bold block text-sm">12μs</span>
                  <span>Engine Latency</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm">100%</span>
                  <span>Full Ledger Backing</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm">0.10%</span>
                  <span>Base Maker Fee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Market Performance Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold uppercase tracking-wider text-slate-300">Live Spotlight Markets</span>
                <span className="font-mono text-cyan-400">Simulated Feed</span>
              </div>

              <div className="space-y-2.5">
                {featuredAssets.map((asset) => {
                  const isUp = asset.change24h >= 0;
                  return (
                    <div
                      key={asset.symbol}
                      onClick={() => handleTradeAsset(asset.symbol)}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#151D2F] p-3.5 hover:border-slate-700 hover:bg-slate-800/60 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white text-xs shrink-0"
                          style={{ backgroundColor: asset.iconColor || '#3B82F6' }}
                        >
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {asset.name}
                            </span>
                            <span className="font-mono text-xs text-slate-400">{asset.symbol}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Vol: ${(asset.volume24h / 1e6).toFixed(1)}M
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-sm font-bold text-white tabular-nums">
                          ${asset.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div
                          className={`text-xs font-semibold tabular-nums ${
                            isUp ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {asset.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveTab('markets')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>View all 8+ spot assets</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Preview Section */}
      <section className="py-16 border-b border-slate-800 bg-[#0B1020]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Institutional-Grade Spot Terminal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed with the responsiveness and depth required by quantitative algorithmic traders and retail professionals alike.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('trade')}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-2xl cursor-pointer hover:border-blue-500/50 transition-colors group relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">BTC/USDT</span>
                <span className="text-emerald-400 font-semibold">$68,420.50 (+2.84%)</span>
                <span className="text-slate-500 hidden sm:inline">Timeframe: 15m</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Interactive Terminal</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Visual mock terminal chart strip */}
            <div className="h-64 rounded-xl bg-[#0B1020] border border-slate-800/80 p-4 flex flex-col justify-between relative">
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>Indicators: MA(7), MA(25), Volume Profile</span>
                <span>Depth: Bids 14.82 BTC · Asks 12.45 BTC</span>
              </div>

              {/* Decorative SVG candlestick wave */}
              <svg className="w-full h-40" viewBox="0 0 800 160" preserveAspectRatio="none">
                <path
                  d="M0,130 C120,110 200,140 320,80 C440,30 520,70 650,40 C720,20 800,45 800,45"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                />
                <path
                  d="M0,130 C120,110 200,140 320,80 C440,30 520,70 650,40 C720,20 800,45 800,45 L800,160 L0,160 Z"
                  fill="url(#blueGrad)"
                  opacity="0.15"
                />
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#0B1020" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                <span className="text-slate-500">Order Form: Limit / Market / Stop-Limit</span>
                <span className="text-emerald-400 font-semibold">Ready for Execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Architecture */}
      <section className="py-16 border-b border-slate-800 bg-[#0E1528]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Institutional Integrity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Zero compromises on cryptographic custody, ledger accounting, and financial transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Microsecond Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic matching engine designed for high throughput without order queue contention or race condition slippage.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600/20 text-cyan-400">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Double-Entry Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every trade, deposit, withdrawal, and fee produces balanced debits and credits with immutable transaction references.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Sig MPC Ready</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Designed for cold-storage multi-party computation wallet security, segregated client funds, and address allowlisting.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#151D2F] p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Transparent Fee Tiering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No hidden spreads or PFOF kickbacks. Transparent Maker (0.10%) and Taker (0.15%) schedules based on 30-day trading volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Guided Onboarding */}
      <section className="py-16 border-b border-slate-800 bg-[#0B1020]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Get Started in Minutes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Experience spot trading with zero friction using our fully loaded sandbox demo accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 font-mono text-lg font-bold text-blue-400">
                01
              </div>
              <h3 className="text-base font-bold text-white">Select Persona or Register</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Switch between Elena (VIP Trader) or David (Compliance Officer) in one click to test the full lifecycle.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 font-mono text-lg font-bold text-cyan-400">
                02
              </div>
              <h3 className="text-base font-bold text-white">Explore Funded Wallet</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Your sandbox account comes preloaded with $50,000 USDT, 1.5 BTC, and 10 ETH with interactive deposit/withdrawal simulation.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 font-mono text-lg font-bold text-emerald-400">
                03
              </div>
              <h3 className="text-base font-bold text-white">Execute Spot Trades</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Place market orders for instant fills or test limit orders that match as market ticks meet your price target.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setActiveTab('trade')}
              className="px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-colors"
            >
              Start Demo Trading Now
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-[#0E1528]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400">
              Clear answers regarding technology, custody standards, and sandbox verification.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-[#151D2F] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
