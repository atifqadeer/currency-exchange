import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Sliders,
  Activity,
  UserCheck,
  Lock,
  PauseCircle,
  PlayCircle,
  RefreshCw,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    kycSubmissions,
    approveKYC,
    rejectKYC,
    ledger,
    approveWithdrawal,
    rejectWithdrawal,
    tradingPairs,
    togglePairHalt,
    updatePairFees,
    auditLogs,
    orders,
    tradeExecutions,
  } = useExchange();

  const [adminTab, setAdminTab] = useState<'kyc' | 'withdrawals' | 'pairs' | 'audit' | 'health'>('kyc');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeKycModalId, setActiveKycModalId] = useState<string | null>(null);

  // Fee update state
  const [selectedPairId, setSelectedPairId] = useState<string>(tradingPairs[0]?.id || 'BTC-USDT');
  const [makerFeeInput, setMakerFeeInput] = useState<string>('0.10');
  const [takerFeeInput, setTakerFeeInput] = useState<string>('0.15');

  const flaggedWithdrawals = ledger.filter((l) => l.type === 'WITHDRAWAL' && l.status === 'FLAGGED');
  const pendingKycCases = kycSubmissions.filter((k) => k.status === 'PENDING' || k.status === 'ADDITIONAL_INFO');

  const handleUpdateFees = (e: React.FormEvent) => {
    e.preventDefault();
    const maker = parseFloat(makerFeeInput) / 100;
    const taker = parseFloat(takerFeeInput) / 100;
    updatePairFees(selectedPairId, maker, taker);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner: Admin Portal Authentication header */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#111827] via-[#151D2F] to-[#111827] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Compliance & Governance Console</h1>
                <span className="text-[10px] font-mono uppercase bg-amber-950/80 text-amber-400 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
                  Restricted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Operator: <span className="text-slate-200">{currentUser.name}</span> ({currentUser.email}) · Least-Privilege Enforced
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="rounded-lg border border-slate-800 bg-[#0B1020] px-3 py-2 text-right">
              <span className="text-[10px] text-slate-500 block uppercase">KYC Review Queue</span>
              <span className="text-sm font-bold text-cyan-400">{pendingKycCases.length} Pending</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B1020] px-3 py-2 text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Flagged Risk Withdrawals</span>
              <span className="text-sm font-bold text-amber-400">{flaggedWithdrawals.length} Action Needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setAdminTab('kyc')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            adminTab === 'kyc' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>KYC Identity Queue ({pendingKycCases.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('withdrawals')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            adminTab === 'withdrawals' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Withdrawal Risk Review ({flaggedWithdrawals.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('pairs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            adminTab === 'pairs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Pair Control & Fees</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            adminTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Tamper-Resistant Audit Log</span>
        </button>

        <button
          onClick={() => setAdminTab('health')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            adminTab === 'health' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>System Health & Engine</span>
        </button>
      </div>

      {/* Tab 1: KYC Queue */}
      {adminTab === 'kyc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Identity Verification (KYC / CDD) Submissions
            </h3>
            <span className="text-xs text-slate-500 font-mono">Automated screening + Human sign-off</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0E1528] text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Doc Type & ID</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-[11px]">
                {kycSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-blue-400 font-bold">{sub.id}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-white">{sub.fullName}</td>
                    <td className="py-3 px-4 text-slate-300">{sub.nationality}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {sub.documentType} ({sub.documentNumber})
                    </td>
                    <td className="py-3 px-4 text-slate-400">{sub.submittedAt}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                          sub.status === 'APPROVED'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : sub.status === 'PENDING'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.status === 'PENDING' || sub.status === 'ADDITIONAL_INFO' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => approveKYC(sub.id, 'Passed OFAC and identity biometric checks.')}
                            className="rounded bg-emerald-600/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectKYC(sub.id, 'Passport photo has glare; request re-upload.')}
                            className="rounded bg-rose-600/20 px-2.5 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Reviewed: {sub.reviewedAt?.slice(0, 10)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Flagged Withdrawal Risk Queue */}
      {adminTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Flagged Outbound Transactions (AML Risk Thresholds)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Withdrawals &gt; $10k or unverified tier</span>
          </div>

          {flaggedWithdrawals.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center text-slate-400 text-xs font-mono">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              All withdrawal queues clear. Zero flagged transactions pending compliance sign-off.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0E1528] text-[10px] uppercase text-slate-400">
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Asset & Amount</th>
                    <th className="py-3 px-4">Destination & Network</th>
                    <th className="py-3 px-4">Risk Flag Reason</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-[11px]">
                  {flaggedWithdrawals.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-amber-400 font-bold">{item.referenceId}</td>
                      <td className="py-3 px-4 text-slate-400">{item.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-white tabular-nums">
                        {Math.abs(item.amount)} {item.asset}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{item.notes}</td>
                      <td className="py-3 px-4 text-amber-400">
                        {item.counterpartyOrTxHash}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => approveWithdrawal(item.id)}
                            className="rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
                          >
                            Release & Sign
                          </button>
                          <button
                            onClick={() => rejectWithdrawal(item.id, 'High-risk destination wallet flagged by chain analytics.')}
                            className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-500 shadow-sm"
                          >
                            Block & Refund
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Trading Pairs & Circuit Breakers */}
      {adminTab === 'pairs' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pair List with Halt Switches */}
          <div className="md:col-span-7 rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Spot Market Pairs & Emergency Circuit Breakers
            </h3>
            <div className="space-y-2">
              {tradingPairs.map((pair) => (
                <div
                  key={pair.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0B1020] p-3 text-xs font-mono"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{pair.id}</span>
                      {pair.isHalted && (
                        <span className="rounded bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 text-[10px] text-rose-400 font-bold">
                          HALTED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Maker: {(pair.makerFeeRate * 100).toFixed(2)}% · Taker: {(pair.takerFeeRate * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePairHalt(pair.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        pair.isHalted
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-800/50'
                      }`}
                    >
                      {pair.isHalted ? (
                        <>
                          <PlayCircle className="h-3.5 w-3.5" />
                          <span>Resume Pair</span>
                        </>
                      ) : (
                        <>
                          <PauseCircle className="h-3.5 w-3.5" />
                          <span>Emergency Halt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Schedule Adjuster */}
          <div className="md:col-span-5 rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Adjust Maker / Taker Schedule
            </h3>
            <form onSubmit={handleUpdateFees} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Target Trading Pair</label>
                <select
                  value={selectedPairId}
                  onChange={(e) => setSelectedPairId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white font-bold focus:outline-none"
                >
                  {tradingPairs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Maker Fee (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={makerFeeInput}
                  onChange={(e) => setMakerFeeInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Taker Fee (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={takerFeeInput}
                  onChange={(e) => setTakerFeeInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white font-bold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-colors"
              >
                Apply Fee Schedule Change
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {adminTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Cryptographic Administrative Audit Trail
            </h3>
            <span className="text-xs text-slate-500 font-mono">WORM Storage (Write Once, Read Many)</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0E1528] text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Operator</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Audit Details</th>
                  <th className="py-3 px-4">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-cyan-400">{log.id}</td>
                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 text-slate-200">{log.adminName}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{log.action}</td>
                    <td className="py-3 px-4 text-slate-400">{log.targetType}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-sm truncate">{log.details}</td>
                    <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: System Health */}
      {adminTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3">
            <span className="text-slate-400 uppercase text-[10px]">Matching Engine Core</span>
            <div className="flex items-center gap-2 text-emerald-400 text-lg font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Operational (12μs)</span>
            </div>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>Total Executions:</span>
                <span className="text-white">{tradeExecutions.length + 152}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Orders:</span>
                <span className="text-white">{orders.filter((o) => o.status === 'OPEN').length}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3">
            <span className="text-slate-400 uppercase text-[10px]">Cold Reserve Invariant Ratio</span>
            <div className="flex items-center gap-2 text-cyan-400 text-lg font-bold">
              <span>100.00% Backed</span>
            </div>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>Hot Wallet Float:</span>
                <span className="text-white">4.8%</span>
              </div>
              <div className="flex justify-between">
                <span>Multi-Sig MPC Vaults:</span>
                <span className="text-white">95.2%</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3">
            <span className="text-slate-400 uppercase text-[10px]">Regulatory Status</span>
            <div className="flex items-center gap-2 text-amber-400 text-lg font-bold">
              <span>Sandbox Demo Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live fiat rails disabled pending VASP authorization and payment partner sign-off.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
