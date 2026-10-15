import React from 'react';
import { Asset } from '../types/exchange';
import { useExchange } from '../context/ExchangeContext';
import { X, ExternalLink, ShieldAlert, ArrowRight, Activity, Cpu } from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const { setSelectedPairId, setActiveTab } = useExchange();

  const handleStartTrade = () => {
    setSelectedPairId(`${asset.symbol}-USDT`);
    setActiveTab('trade');
    onClose();
  };

  const handleConvert = () => {
    setActiveTab('convert');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white shadow-lg text-lg"
            style={{ backgroundColor: asset.iconColor || '#3B82F6' }}
          >
            {asset.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{asset.name}</h2>
              <span className="font-mono text-xs text-slate-400">({asset.symbol})</span>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                {asset.category}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                ${asset.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`text-sm font-semibold font-mono tabular-nums ${
                  asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {asset.change24h >= 0 ? '+' : ''}
                {asset.change24h.toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 rounded-xl border border-slate-800/80 bg-[#151D2F] p-4 text-xs text-slate-300 leading-relaxed">
          {asset.description}
        </div>

        {/* Market Stats Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-3">
            <span className="text-[10px] uppercase text-slate-500 block">24h High</span>
            <span className="text-sm font-semibold text-slate-200 tabular-nums">
              ${asset.high24h.toLocaleString()}
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-3">
            <span className="text-[10px] uppercase text-slate-500 block">24h Low</span>
            <span className="text-sm font-semibold text-slate-200 tabular-nums">
              ${asset.low24h.toLocaleString()}
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-3">
            <span className="text-[10px] uppercase text-slate-500 block">24h Volume</span>
            <span className="text-sm font-semibold text-slate-200 tabular-nums">
              ${(asset.volume24h / 1e9).toFixed(2)}B
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-3">
            <span className="text-[10px] uppercase text-slate-500 block">Market Cap</span>
            <span className="text-sm font-semibold text-slate-200 tabular-nums">
              ${(asset.marketCap / 1e9).toFixed(2)}B
            </span>
          </div>
        </div>

        {/* Technical & Blockchain Specs */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-[#151D2F] p-4 space-y-3 text-xs">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            Technical Specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">Consensus Mechanism:</span>
              <span className="text-slate-200">{asset.consensus}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Circulating Supply:</span>
              <span className="text-slate-200">{asset.circulatingSupply}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Base Precision:</span>
              <span className="text-slate-200">{asset.decimals} Decimals</span>
            </div>
            <div>
              <span className="text-slate-500 block">Block Explorer:</span>
              <a
                href={asset.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Inspect On-Chain</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Supported Networks & Confirmation times */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-[#151D2F] p-4 text-xs">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-2">
            Supported Deposit & Withdrawal Networks
          </h4>
          <div className="space-y-2">
            {asset.networks.map((net) => (
              <div
                key={net.id}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-[#0B1020] px-3 py-2 text-[11px] font-mono"
              >
                <div>
                  <span className="font-semibold text-white block">{net.name}</span>
                  <span className="text-slate-500 text-[10px]">
                    Min Withdrawal: {net.withdrawalMin} {asset.symbol} · Block Confirmations: {net.confirmations}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Network Fee</span>
                  <span className="text-slate-200 font-semibold">
                    {net.fee} {net.feeAsset}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk disclosure */}
        <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-[11px] text-amber-300 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          <p>
            Always verify that the destination address and network match. Sending assets to an incompatible network or without an applicable memo may result in unrecoverable asset loss.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={handleConvert}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-slate-700 bg-slate-800 transition-colors"
          >
            Instant Convert
          </button>
          <button
            onClick={handleStartTrade}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
          >
            <span>Trade {asset.symbol}/USDT</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
