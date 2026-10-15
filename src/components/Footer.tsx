import React from 'react';
import { Shield, Lock, FileText, ExternalLink, HelpCircle, AlertTriangle } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useExchange();

  return (
    <footer className="border-t border-slate-800/80 bg-[#0B1020] text-slate-400 text-xs">
      {/* Risk Disclosure Warning Banner */}
      <div className="border-b border-slate-800/50 bg-[#0E1528] px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300">Regulatory & Risk Notice:</span> Digital asset trading involves substantial risk of financial loss and is not suitable for all investors. The valuation of cryptocurrencies is volatile and prices fluctuate rapidly. This platform is currently operating in an interactive <span className="text-cyan-400 font-mono">SANDBOX / DEMO ENVIRONMENT</span> with simulated market feeds and virtual assets. Real-money fiat on-ramps, custody, and live trading are subject to licensing validation, jurisdictional compliance (VASP / MiCA / FinCEN), and bank approvals.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 text-slate-950 font-bold">
                <span className="text-sm">AX</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">AetherX Global</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Institutional-grade digital asset infrastructure built on deterministic matching engine architecture, multi-sig MPC custody frameworks, and verifiable double-entry bookkeeping.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                MPC Custody Ready
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                Double-Entry Ledger
              </span>
            </div>
          </div>

          {/* Navigation Column: Exchange */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Exchange</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <button onClick={() => setActiveTab('markets')} className="hover:text-white transition-colors">
                  Spot Markets
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('trade')} className="hover:text-white transition-colors">
                  Trading Terminal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('convert')} className="hover:text-white transition-colors">
                  Instant Convert
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('wallet')} className="hover:text-white transition-colors">
                  Multi-Asset Wallet
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column: Transparency & Fees */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Transparency</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <button onClick={() => setActiveTab('learn')} className="hover:text-white transition-colors">
                  Fee Schedule (VIP 0-5)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learn')} className="hover:text-white transition-colors">
                  Order Type Guide
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learn')} className="hover:text-white transition-colors">
                  Proof of Reserves (Merkle)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-white transition-colors">
                  API Documentation
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column: Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Compliance</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-white transition-colors">
                  KYC Verification Tiers
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Anti-Money Laundering (AML)</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Privacy & Cookie Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 AetherX Digital Asset Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>System Status: <span className="text-emerald-400">Operational</span></span>
            <span>·</span>
            <span>Matching Latency: <span className="text-slate-300">12μs</span></span>
            <span>·</span>
            <span>Build: <span className="text-slate-300">v2.4-Institutional</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
