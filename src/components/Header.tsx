import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  Shield,
  User,
  ArrowRightLeft,
  TrendingUp,
  Wallet,
  BookOpen,
  Settings,
  ChevronDown,
  RefreshCw,
  LogOut,
  Key,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchUserRole,
    totalPortfolioUsd,
    isLiveFeedActive,
    setIsLiveFeedActive,
    resetDemoEnvironment,
    setAuthModalOpen,
  } = useExchange();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B1020]/95 backdrop-blur-md">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (Action / Profile) */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-slate-950 font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-lg tracking-tighter">AX</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                AetherX
              </span>
              <span className="text-[10px] uppercase font-medium tracking-widest text-cyan-400/90 -mt-1">
                Digital Assets
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('markets')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'markets' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'trade' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Trade
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'convert' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Convert
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'wallet' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'learn' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Learn & Fees
          </button>
          {currentUser.role === 'COMPLIANCE' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-cyan-400 font-semibold'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Compliance Admin
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Cluster (Demo Status, Persona Switcher, Profile/Auth) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Feed Toggle & Demo Sandbox Label */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded border border-slate-800 bg-[#111827] text-xs">
            <span className="text-slate-400">Demo Sandbox</span>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setIsLiveFeedActive(!isLiveFeedActive)}
              title={isLiveFeedActive ? 'Market simulator running' : 'Market simulator paused'}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  isLiveFeedActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
                }`}
              />
              <span className="font-mono text-[11px]">{isLiveFeedActive ? 'Live Ticks' : 'Paused'}</span>
            </button>
          </div>

          {/* Quick Portfolio pill on desktop */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#151D2F] hover:bg-slate-800/80 transition-colors text-left"
          >
            <Wallet className="h-3.5 w-3.5 text-blue-400" />
            <div className="text-xs">
              <span className="text-slate-400 text-[10px] block leading-none">Portfolio</span>
              <span className="font-mono font-medium text-slate-100 tabular-nums leading-tight">
                ${totalPortfolioUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </button>

          {/* Persona & Account dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-[#151D2F] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 overflow-hidden ring-1 ring-slate-700">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="h-3.5 w-3.5 text-blue-400" />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-semibold text-slate-200 leading-tight">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] font-mono text-cyan-400 leading-none">
                  {currentUser.role} · Tier {currentUser.kycTier}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-[#151D2F] p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-slate-800/80">
                  <p className="text-xs font-medium text-slate-200">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate font-mono">{currentUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                      KYC: {currentUser.kycStatus}
                    </span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/50 px-1.5 py-0.5 rounded">
                      Role: {currentUser.role}
                    </span>
                  </div>
                </div>

                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Persona (Demo)
                  </div>
                  <button
                    onClick={() => {
                      switchUserRole('VIP');
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left rounded-lg transition-colors ${
                      currentUser.role === 'VIP' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>Elena Rostova (VIP Trader)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Tier 2</span>
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('COMPLIANCE');
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left rounded-lg transition-colors ${
                      currentUser.role === 'COMPLIANCE' ? 'bg-amber-600/20 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>David Vance (Compliance)</span>
                    <span className="text-[10px] text-amber-400 font-mono">Admin</span>
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('TRADER');
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left rounded-lg transition-colors ${
                      currentUser.role === 'TRADER' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>Demo Trader (Basic)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Tier 1</span>
                  </button>
                </div>

                <div className="border-t border-slate-800/80 pt-1.5">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                    Security & API Keys
                  </button>
                  <button
                    onClick={() => {
                      setResetConfirmOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-950/40 rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset Demo State ($50k)
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                  >
                    <Key className="h-3.5 w-3.5" />
                    Auth Modal / Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Trade CTA */}
          <button
            onClick={() => setActiveTab('trade')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-colors whitespace-nowrap shrink-0"
          >
            Trade Now
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 bg-[#0E1528] px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('markets')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'markets' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <span>Markets</span>
        </button>
        <button
          onClick={() => setActiveTab('trade')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'trade' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <span>Trade</span>
        </button>
        <button
          onClick={() => setActiveTab('convert')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'convert' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <span>Convert</span>
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'wallet' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <span>Wallet</span>
        </button>
        {currentUser.role === 'COMPLIANCE' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'admin' ? 'text-cyan-400' : 'text-amber-400'}`}
          >
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Demo Reset confirmation modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#151D2F] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Reset Demo Environment?</h3>
            <p className="mt-2 text-sm text-slate-300">
              This will restore virtual balances back to initial test values ($50,000 USDT, 1.5 BTC, 10 ETH), wipe any simulated open orders, and clear custom transaction history.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg border border-slate-700 bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoEnvironment();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
