import React, { useState, useEffect } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { ArrowDownUp, RefreshCw, CheckCircle, ShieldCheck, Info } from 'lucide-react';

export const ConvertPage: React.FC = () => {
  const { assets, balances, executeConvert, setActiveTab } = useExchange();

  const [fromAsset, setFromAsset] = useState<string>('USDT');
  const [toAsset, setToAsset] = useState<string>('BTC');
  const [fromAmount, setFromAmount] = useState<string>('1000');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<{
    fromAmount: number;
    fromAsset: string;
    toAmount: number;
    toAsset: string;
    rate: number;
  } | null>(null);

  const fromBal = balances[fromAsset] || { free: 0, inOrder: 0 };
  const toBal = balances[toAsset] || { free: 0, inOrder: 0 };

  const fromObj = assets.find((a) => a.symbol === fromAsset);
  const toObj = assets.find((a) => a.symbol === toAsset);

  const fromPrice = fromObj ? fromObj.priceUsd : 1;
  const toPrice = toObj ? toObj.priceUsd : 1;

  // Rate: 1 fromAsset = X toAsset
  const exchangeRate = fromPrice / toPrice;

  const parsedFromAmount = parseFloat(fromAmount) || 0;
  const estimatedToAmount = parsedFromAmount * exchangeRate;

  // 15s quote countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const handleSetMax = () => {
    setFromAmount(fromBal.free.toString());
  };

  const handleConfirmConvert = () => {
    if (parsedFromAmount <= 0) return;
    const res = executeConvert({
      fromAsset,
      toAsset,
      fromAmount: parsedFromAmount,
    });

    if (res.success) {
      setReceipt({
        fromAmount: parsedFromAmount,
        fromAsset,
        toAmount: res.toAmount,
        toAsset,
        rate: exchangeRate,
      });
      setConfirmModalOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Instant Convert & Swap</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero slippage, zero hidden spreads, and instant settlement to your wallet.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-[#151D2F] px-2.5 py-1 text-[11px] font-mono text-cyan-400">
            <RefreshCw className="h-3 w-3 animate-spin text-cyan-400" />
            <span>{secondsRemaining}s</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* FROM Input Box */}
          <div className="rounded-xl border border-slate-800 bg-[#0B1020] p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>You Pay</span>
              <div className="flex items-center gap-1 font-mono">
                <span>Avail: {fromBal.free.toFixed(4)} {fromAsset}</span>
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="ml-1 text-blue-400 hover:text-blue-300 font-bold"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-full bg-transparent font-mono text-2xl font-bold text-white focus:outline-none placeholder-slate-600"
              />
              <select
                value={fromAsset}
                onChange={(e) => setFromAsset(e.target.value)}
                className="rounded-lg border border-slate-700 bg-[#151D2F] px-3 py-2 text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
              >
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} ({a.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-mono">
              ≈ ${(parsedFromAmount * fromPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>

          {/* Swap Direction Flip Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapAssets}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-[#151D2F] text-slate-300 hover:border-blue-500 hover:text-white transition-all shadow-md"
              title="Switch conversion direction"
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>
          </div>

          {/* TO Input Box */}
          <div className="rounded-xl border border-slate-800 bg-[#0B1020] p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>You Receive (Estimated)</span>
              <span className="font-mono">Avail: {toBal.free.toFixed(4)} {toAsset}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full font-mono text-2xl font-bold text-emerald-400">
                {estimatedToAmount > 0
                  ? estimatedToAmount.toFixed(toAsset === 'USDT' || toAsset === 'USDC' ? 2 : 6)
                  : '0.00'}
              </div>
              <select
                value={toAsset}
                onChange={(e) => setToAsset(e.target.value)}
                className="rounded-lg border border-slate-700 bg-[#151D2F] px-3 py-2 text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
              >
                {assets
                  .filter((a) => a.symbol !== fromAsset)
                  .map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} ({a.name})
                    </option>
                  ))}
              </select>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-mono">
              ≈ ${(estimatedToAmount * toPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>

          {/* Rate & Fee Breakdown */}
          <div className="space-y-2 rounded-xl border border-slate-800/80 bg-[#151D2F] p-4 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Conversion Rate:</span>
              <span className="text-white font-medium">
                1 {fromAsset} = {exchangeRate < 0.0001 ? exchangeRate.toExponential(4) : exchangeRate.toFixed(6)} {toAsset}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Transaction Fee:</span>
              <span className="text-emerald-400 font-medium">Zero Fee (0.00%)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Execution Speed:</span>
              <span className="text-cyan-400">Instant Settlement</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={() => setConfirmModalOpen(true)}
            disabled={parsedFromAmount <= 0 || fromBal.free < parsedFromAmount}
            className={`w-full py-3 text-sm font-bold rounded-xl shadow-lg transition-transform active:scale-98 ${
              parsedFromAmount <= 0 || fromBal.free < parsedFromAmount
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
          >
            {fromBal.free < parsedFromAmount ? `Insufficient ${fromAsset} Balance` : 'Preview Conversion'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#151D2F] p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Confirm Currency Swap</h3>
            <div className="space-y-2 rounded-xl border border-slate-800 bg-[#0B1020] p-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>From:</span>
                <span className="text-white font-bold">{parsedFromAmount} {fromAsset}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>To:</span>
                <span className="text-emerald-400 font-bold">
                  {estimatedToAmount.toFixed(6)} {toAsset}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Locked Rate:</span>
                <span className="text-cyan-400">
                  1 {fromAsset} ≈ {exchangeRate.toFixed(6)} {toAsset}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fee:</span>
                <span className="text-emerald-400">$0.00</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-slate-700 bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConvert}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors"
              >
                Confirm & Convert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/30 bg-[#151D2F] p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Conversion Successful!</h3>
            <p className="text-xs text-slate-300 font-mono">
              You swapped <span className="text-white font-bold">{receipt.fromAmount} {receipt.fromAsset}</span> for{' '}
              <span className="text-emerald-400 font-bold">{receipt.toAmount} {receipt.toAsset}</span>.
            </p>
            <div className="rounded-xl border border-slate-800 bg-[#0B1020] p-3 text-xs text-slate-400 font-mono text-left space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400">Settled in Wallet</span>
              </div>
              <div className="flex justify-between">
                <span>Ledger Ref:</span>
                <span className="text-slate-200">TX-CONV-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-slate-700 bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setReceipt(null);
                  setActiveTab('wallet');
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
              >
                View in Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
