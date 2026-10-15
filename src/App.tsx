/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExchangeProvider, useExchange } from './context/ExchangeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { MarketsPage } from './components/MarketsPage';
import { TradingTerminal } from './components/TradingTerminal';
import { ConvertPage } from './components/ConvertPage';
import { WalletPage } from './components/WalletPage';
import { LearnPage } from './components/LearnPage';
import { AdminPanel } from './components/AdminPanel';
import { ProfilePage } from './components/ProfilePage';
import { AssetDetailModal } from './components/AssetDetailModal';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ExchangeApp: React.FC = () => {
  const {
    activeTab,
    selectedAssetForDetail,
    setSelectedAssetForDetail,
    toasts,
    removeToast,
  } = useExchange();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] text-slate-100 selection:bg-blue-600/30 selection:text-blue-200">
      {/* Header */}
      <Header />

      {/* Main Viewport Router */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'markets' && <MarketsPage />}
        {activeTab === 'trade' && <TradingTerminal />}
        {activeTab === 'convert' && <ConvertPage />}
        {activeTab === 'wallet' && <WalletPage />}
        {activeTab === 'learn' && <LearnPage />}
        {activeTab === 'admin' && <AdminPanel />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedAssetForDetail && (
        <AssetDetailModal
          asset={selectedAssetForDetail}
          onClose={() => setSelectedAssetForDetail(null)}
        />
      )}

      <AuthModal />

      {/* Toast Notifications System */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-all font-sans text-xs ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-[#0E1B1D]/95 text-emerald-200'
                : toast.type === 'error'
                ? 'border-rose-500/40 bg-[#1D0E12]/95 text-rose-200'
                : toast.type === 'warning'
                ? 'border-amber-500/40 bg-[#1D180E]/95 text-amber-200'
                : 'border-blue-500/40 bg-[#0E1528]/95 text-blue-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <span className="font-bold block text-white text-xs">{toast.title}</span>
              <span className="text-[11px] opacity-90 leading-relaxed block mt-0.5">{toast.description}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ExchangeProvider>
      <ExchangeApp />
    </ExchangeProvider>
  );
}
