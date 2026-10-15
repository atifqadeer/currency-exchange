import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Copy,
  Check,
  AlertTriangle,
  QrCode,
  ShieldAlert,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const {
    assets,
    balances,
    totalPortfolioUsd,
    totalPortfolioBtc,
    ledger,
    simulateDeposit,
    simulateWithdrawal,
    setSelectedPairId,
    setActiveTab,
    currentUser,
  } = useExchange();

  const [activeTab, setActiveTabLocal] = useState<'balances' | 'ledger'>('balances');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('BTC');
  const [copied, setCopied] = useState(false);

  // Deposit Modal State
  const [depositNetworkId, setDepositNetworkId] = useState<string>('');
  const [depositAmountInput, setDepositAmountInput] = useState<string>('0.5');

  // Withdrawal Modal State
  const [withdrawNetworkId, setWithdrawNetworkId] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');

  const currentAsset = assets.find((a) => a.symbol === selectedAssetSymbol) || assets[0];
  const activeNetwork = currentAsset.networks.find((n) => n.id === depositNetworkId) || currentAsset.networks[0];
  const withdrawNetwork = currentAsset.networks.find((n) => n.id === withdrawNetworkId) || currentAsset.networks[0];

  const assetBal = balances[selectedAssetSymbol] || { free: 0, inOrder: 0 };

  const parsedWithdrawAmount = parseFloat(withdrawAmount) || 0;
  const networkFee = withdrawNetwork.fee;
  const netWithdraw = Math.max(0, parsedWithdrawAmount - networkFee);

  // Address generator for deposit
  const simulatedDepositAddress = selectedAssetSymbol === 'BTC'
    ? 'bc1q9a2x6y7v9z8w5u3t1s4r2q0p8o6n4m2l0k8j6h'
    : selectedAssetSymbol === 'SOL'
    ? '7Np41oeYqPAbSnBC955Z416kP4p42q1984kM'
    : '0x3f72a4901b22e1850384a861d9047b198c21a4fa81';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteDeposit = () => {
    const amt = parseFloat(depositAmountInput) || 0;
    if (amt <= 0) return;
    simulateDeposit(selectedAssetSymbol, activeNetwork.name, amt);
    setDepositModalOpen(false);
  };

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedWithdrawAmount <= 0 || !withdrawAddress) return;

    simulateWithdrawal({
      asset: selectedAssetSymbol,
      networkId: withdrawNetwork.name,
      destinationAddress: withdrawAddress,
      amount: parsedWithdrawAmount,
      fee: networkFee,
    });

    setWithdrawModalOpen(false);
    setWithdrawAmount('');
    setWithdrawAddress('');
  };

  // CSV Export utility
  const exportLedgerToCsv = () => {
    const headers = ['Reference ID', 'Timestamp', 'Type', 'Asset', 'Amount', 'Fee', 'Status', 'Tx Hash', 'Notes'];
    const rows = ledger.map((e) => [
      e.referenceId,
      e.timestamp,
      e.type,
      e.asset,
      e.amount,
      e.fee,
      e.status,
      e.counterpartyOrTxHash || '',
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aetherx_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner: Portfolio Overview */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Net Worth */}
          <div className="md:col-span-6 space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
              Total Estimated Portfolio Balance
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                ${totalPortfolioUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-semibold font-mono text-cyan-400 tabular-nums">
                ≈ {totalPortfolioBtc.toFixed(4)} BTC
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span>Account: {currentUser.name}</span>
              <span>·</span>
              <span className="text-emerald-400">KYC Status: {currentUser.kycStatus}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-3">
            <button
              onClick={() => {
                setSelectedAssetSymbol('BTC');
                setDepositModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-colors"
            >
              <ArrowDownLeft className="h-4 w-4" />
              <span>Deposit Asset</span>
            </button>
            <button
              onClick={() => {
                setSelectedAssetSymbol('USDT');
                setWithdrawModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Withdraw Asset</span>
            </button>
            <button
              onClick={() => setActiveTab('convert')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <span>Instant Convert</span>
            </button>
          </div>
        </div>

        {/* Asset Distribution Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Asset Allocation Distribution</span>
            <span>100% Backed Reserves</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800 flex overflow-hidden">
            {assets.map((asset) => {
              const bal = balances[asset.symbol] || { free: 0, inOrder: 0 };
              const val = (bal.free + bal.inOrder) * (asset.priceUsd || 1);
              const pct = totalPortfolioUsd > 0 ? (val / totalPortfolioUsd) * 100 : 0;
              if (pct < 0.5) return null;
              return (
                <div
                  key={asset.symbol}
                  style={{ width: `${pct}%`, backgroundColor: asset.iconColor || '#3B82F6' }}
                  title={`${asset.symbol}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs: Balances vs Double-Entry Ledger */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTabLocal('balances')}
            className={`font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'balances'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Asset Balances
          </button>
          <button
            onClick={() => setActiveTabLocal('ledger')}
            className={`font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'ledger'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Ledger & Transaction History
          </button>
        </div>

        {activeTab === 'ledger' && (
          <button
            onClick={exportLedgerToCsv}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#151D2F] px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-mono"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Tab 1: Balances Table */}
      {activeTab === 'balances' && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0E1528] text-[11px] uppercase text-slate-400">
                  <th className="py-3 px-4 font-semibold text-slate-300">Asset</th>
                  <th className="py-3 px-4 text-right">Available Free</th>
                  <th className="py-3 px-4 text-right">In Orders</th>
                  <th className="py-3 px-4 text-right">Total Balance</th>
                  <th className="py-3 px-4 text-right">Est. USD Value</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {assets.map((asset) => {
                  const bal = balances[asset.symbol] || { free: 0, inOrder: 0 };
                  const total = bal.free + bal.inOrder;
                  const usdVal = total * (asset.priceUsd || 1);
                  const isStable = asset.symbol === 'USDT' || asset.symbol === 'USDC';

                  return (
                    <tr key={asset.symbol} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white text-xs shrink-0"
                            style={{ backgroundColor: asset.iconColor || '#3B82F6' }}
                          >
                            {asset.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-sans font-bold text-white block text-sm">
                              {asset.name}
                            </span>
                            <span className="text-[11px] text-slate-400">{asset.symbol}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-medium text-slate-200 tabular-nums">
                        {bal.free.toFixed(isStable ? 2 : 4)}
                      </td>

                      <td className="py-3.5 px-4 text-right text-amber-400 tabular-nums">
                        {bal.inOrder.toFixed(isStable ? 2 : 4)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-white tabular-nums">
                        {total.toFixed(isStable ? 2 : 4)}
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">
                        ${usdVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAssetSymbol(asset.symbol);
                              setDepositModalOpen(true);
                            }}
                            className="rounded-lg bg-blue-600/20 px-2.5 py-1 text-xs text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            Deposit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAssetSymbol(asset.symbol);
                              setWithdrawModalOpen(true);
                            }}
                            className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            Withdraw
                          </button>
                          {asset.symbol !== 'USDT' && (
                            <button
                              onClick={() => {
                                setSelectedPairId(`${asset.symbol}-USDT`);
                                setActiveTab('trade');
                              }}
                              className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              Trade
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Ledger Table */}
      {activeTab === 'ledger' && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
          <div className="p-4 border-b border-slate-800 bg-[#0E1528] flex items-center justify-between text-xs text-slate-400">
            <span>Authoritative Double-Entry Ledger Transactions</span>
            <span className="font-mono text-cyan-400">SOC-2 & GAAP Compliant Format</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0E1528] text-[10px] uppercase text-slate-500">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right">Debit / Credit</th>
                  <th className="py-3 px-4 text-right">Fee</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-[11px]">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-blue-400 font-semibold">{entry.referenceId}</td>
                    <td className="py-3 px-4 text-slate-400">{entry.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">{entry.type}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{entry.asset}</td>
                    <td
                      className={`py-3 px-4 text-right tabular-nums font-bold ${
                        entry.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {entry.amount >= 0 ? '+' : ''}
                      {entry.amount.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                      ${entry.fee.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] ${
                          entry.status === 'COMPLETED'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : entry.status === 'FLAGGED'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-xs">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Deposit {currentAsset.name}</span>
                <span className="text-xs font-mono text-slate-400 font-normal">({currentAsset.symbol})</span>
              </h3>
              <button
                onClick={() => setDepositModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Asset Selector */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Select Asset</label>
              <select
                value={selectedAssetSymbol}
                onChange={(e) => {
                  setSelectedAssetSymbol(e.target.value);
                  setDepositNetworkId('');
                }}
                className="w-full rounded-lg border border-slate-700 bg-[#151D2F] px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.name} ({a.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Select Transfer Network</label>
              <select
                value={activeNetwork.id}
                onChange={(e) => setDepositNetworkId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#151D2F] px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {currentAsset.networks.map((net) => (
                  <option key={net.id} value={net.id}>
                    {net.name} (Required Confirmations: {net.confirmations})
                  </option>
                ))}
              </select>
            </div>

            {/* Address & Visual QR Code */}
            <div className="rounded-xl border border-slate-800 bg-[#0B1020] p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white p-2 shrink-0">
                {/* Clean SVG QR Code Representation */}
                <svg className="h-full w-full" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3H9V9H3V3ZM5 5V7H7V5H5ZM3 15H9V21H3V15ZM5 17V19H7V17H5ZM15 3H21V9H15V3ZM17 5V7H19V5H17ZM11 5H13V7H11V5ZM11 11H13V13H11V11ZM11 17H13V19H11V17ZM15 15H17V17H15V15ZM19 19H21V21H19V19ZM15 19H17V21H15V19ZM19 15H21V17H19V15ZM7 11H9V13H7V11ZM3 11H5V13H3V11ZM17 11H21V13H17V11Z"
                    fill="#0B1020"
                  />
                </svg>
              </div>

              <div className="flex-1 w-full space-y-2">
                <span className="text-[11px] text-slate-400 block">Your Single-Use Deposit Address</span>
                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#151D2F] p-2 text-xs font-mono text-slate-200">
                  <span className="truncate">{simulatedDepositAddress}</span>
                  <button
                    onClick={() => handleCopy(simulatedDepositAddress)}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy address"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Network Warning */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Send only {currentAsset.symbol} via {activeNetwork.name}. Sending any other cryptocurrency or using an unsupported network will result in permanent loss.
              </span>
            </div>

            {/* Sandbox Simulation Trigger */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5 space-y-2">
              <span className="text-xs font-bold text-blue-300 block">
                Simulate Inbound Sandbox Transfer
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={depositAmountInput}
                  onChange={(e) => setDepositAmountInput(e.target.value)}
                  className="w-32 rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-1.5 font-mono text-xs text-white focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-300">{currentAsset.symbol}</span>
                <button
                  onClick={handleExecuteDeposit}
                  className="ml-auto rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow transition-colors"
                >
                  Credit Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Withdrawal Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Withdraw {currentAsset.name}</span>
                <span className="text-xs font-mono text-slate-400 font-normal">({currentAsset.symbol})</span>
              </h3>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
              {/* Asset Selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Asset</label>
                <select
                  value={selectedAssetSymbol}
                  onChange={(e) => setSelectedAssetSymbol(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#151D2F] px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {assets.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.name} ({a.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Network Selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Network</label>
                <select
                  value={withdrawNetwork.id}
                  onChange={(e) => setWithdrawNetworkId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#151D2F] px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {currentAsset.networks.map((net) => (
                    <option key={net.id} value={net.id}>
                      {net.name} · Fee: {net.fee} {net.feeAsset}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Address */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Destination Address</label>
                <input
                  type="text"
                  placeholder={`Paste recipient ${currentAsset.symbol} address...`}
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 font-mono text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Withdrawal Amount */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Withdrawal Amount</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span>Avail: {assetBal.free.toFixed(4)} {currentAsset.symbol}</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(assetBal.free.toString())}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  placeholder={`Min ${withdrawNetwork.withdrawalMin}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Summary box */}
              <div className="rounded-xl border border-slate-800 bg-[#0B1020] p-3 text-xs font-mono space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Network Processing Fee:</span>
                  <span className="text-slate-200">
                    {networkFee} {withdrawNetwork.feeAsset}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-1 font-bold">
                  <span>You Will Receive:</span>
                  <span className="text-emerald-400">
                    {netWithdraw > 0 ? netWithdraw.toFixed(4) : '0.00'} {currentAsset.symbol}
                  </span>
                </div>
              </div>

              {/* 2FA Prompt */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  2FA Authenticator Code (6 Digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 849201"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 font-mono text-center tracking-widest text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-slate-700 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={parsedWithdrawAmount <= networkFee || assetBal.free < parsedWithdrawAmount}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors disabled:bg-slate-800 disabled:text-slate-500"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
