import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import {
  User,
  Shield,
  Key,
  Lock,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Copy,
  Trash2,
  Plus,
  Clock,
  Globe,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    submitKYC,
    apiKeys,
    generateApiKey,
    revokeApiKey,
    addToast,
  } = useExchange();

  const [activeTab, setActiveTab] = useState<'verification' | 'security' | 'apikeys'>('verification');

  // KYC Form State
  const [fullName, setFullName] = useState(currentUser.name);
  const [nationality, setNationality] = useState('Switzerland');
  const [docType, setDocType] = useState<'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID'>('PASSPORT');
  const [docNumber, setDocNumber] = useState('');

  // 2FA state
  const [twoFaActive, setTwoFaActive] = useState(currentUser.twoFactorEnabled);
  const [antiPhishingCode, setAntiPhishingCode] = useState(currentUser.antiPhishingCode || 'AX-SECURE-KEY');

  // API Key creation
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [canTrade, setCanTrade] = useState(true);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);

  const handleSubmitKYCForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) return;
    submitKYC({
      fullName,
      nationality,
      documentType: docType,
      documentNumber: docNumber,
    });
    setDocNumber('');
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel) return;
    const permissions: ('READ' | 'TRADE' | 'WITHDRAW')[] = ['READ'];
    if (canTrade) permissions.push('TRADE');
    if (canWithdraw) permissions.push('WITHDRAW');

    const created = generateApiKey(newKeyLabel, permissions);
    setCreatedKeySecret(`sec_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`);
    setNewKeyLabel('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 overflow-hidden ring-2 ring-blue-500/30">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="h-8 w-8 text-blue-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
                <span className="rounded bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              <div className="mt-2 flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>KYC Tier {currentUser.kycTier}</span>
                <span>·</span>
                <span className="text-emerald-400">Status: {currentUser.kycStatus}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B1020] p-3 text-xs font-mono text-slate-400 space-y-1">
            <div>
              <span>Last Login IP: </span>
              <span className="text-slate-200">{currentUser.lastLoginIp}</span>
            </div>
            <div>
              <span>Timestamp: </span>
              <span className="text-slate-200">{currentUser.lastLoginTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'verification' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Identity Verification (KYC)</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'security' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Security & Sessions</span>
        </button>

        <button
          onClick={() => setActiveTab('apikeys')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'apikeys' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Key className="h-4 w-4" />
          <span>API Key Management</span>
        </button>
      </div>

      {/* Tab 1: KYC Verification */}
      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tier Overview Cards */}
          <div className="md:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Tier 1: Basic Trader</h3>
                <span className="rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono">
                  Active
                </span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>• Daily Withdrawal Limit: $10,000 USD</li>
                <li>• Standard spot market execution</li>
                <li>• Simulated sandbox funds enabled</li>
              </ul>
            </div>

            <div className="rounded-xl border border-blue-500/40 bg-[#151D2F] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Tier 2: Institutional Trader</h3>
                {currentUser.kycTier >= 2 ? (
                  <span className="rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono">
                    Verified
                  </span>
                ) : (
                  <span className="rounded bg-amber-950/80 text-amber-400 border border-amber-800 px-2 py-0.5 text-[10px] font-mono">
                    {currentUser.kycStatus === 'PENDING' ? 'Under Review' : 'Recommended'}
                  </span>
                )}
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>• Daily Withdrawal Limit: $250,000 USD</li>
                <li>• Priority order matching execution</li>
                <li>• Dedicated OTC block trading access</li>
                <li>• Automated withdrawal allowance</li>
              </ul>
            </div>
          </div>

          {/* Verification Submission Form */}
          <div className="md:col-span-7 rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Submit Identity Credentials</h3>
            <p className="text-xs text-slate-400">
              Submit your government ID for automated sanctions screening and biometric verification. Cases route to David Vance in the Compliance Admin portal.
            </p>

            <form onSubmit={handleSubmitKYCForm} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Legal Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Jurisdiction / Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Government Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:outline-none"
                >
                  <option value="PASSPORT">International Passport</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                  <option value="NATIONAL_ID">National Identity Card</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Document Serial Number</label>
                <input
                  type="text"
                  placeholder="e.g. X8921045CH"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={currentUser.kycStatus === 'PENDING'}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-colors disabled:bg-slate-800 disabled:text-slate-500"
              >
                {currentUser.kycStatus === 'PENDING'
                  ? 'Verification Pending Compliance Review'
                  : 'Submit Credentials for Approval'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Sessions */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Account Security Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 2FA Card */}
              <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block text-sm">Two-Factor Auth (2FA)</span>
                  <span className="text-xs text-slate-400">TOTP Authenticator Protection</span>
                </div>
                <button
                  onClick={() => {
                    setTwoFaActive(!twoFaActive);
                    addToast({
                      type: 'success',
                      title: !twoFaActive ? '2FA Enabled' : '2FA Disabled',
                      description: 'Two-factor authentication preference saved.',
                    });
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    twoFaActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {twoFaActive ? 'Enabled' : 'Enable'}
                </button>
              </div>

              {/* Anti-Phishing Code */}
              <div className="rounded-lg border border-slate-800 bg-[#0B1020] p-4 space-y-2">
                <span className="font-semibold text-white block text-sm">Anti-Phishing Security Code</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={antiPhishingCode}
                    onChange={(e) => setAntiPhishingCode(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-[#151D2F] px-2.5 py-1 text-xs font-mono text-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={() =>
                      addToast({
                        type: 'success',
                        title: 'Anti-Phishing Code Updated',
                        description: `Official emails will contain code: ${antiPhishingCode}`,
                      })
                    }
                    className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-white text-sm font-sans">Active Sessions</h3>
            <div className="divide-y divide-slate-800">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold block">macOS Chrome (Current Session)</span>
                  <span className="text-slate-400 text-[11px]">192.168.1.42 · Zurich, Switzerland</span>
                </div>
                <span className="text-emerald-400 text-xs">Active Now</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-slate-300 block">iOS Mobile Web</span>
                  <span className="text-slate-500 text-[11px]">192.168.1.88 · Zurich, Switzerland · 2h ago</span>
                </div>
                <button
                  onClick={() => addToast({ type: 'info', title: 'Session Revoked', description: 'Session terminated.' })}
                  className="text-rose-400 hover:underline"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: API Key Management */}
      {activeTab === 'apikeys' && (
        <div className="space-y-6">
          {/* Key Creation */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Generate Quantitative API Key</h3>
            <form onSubmit={handleCreateApiKey} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Key Label</label>
                <input
                  type="text"
                  placeholder="e.g. Algo Market Maker v1"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="checkbox" checked disabled className="rounded border-slate-700" />
                  <span>Read Market Data (Default)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={canTrade}
                    onChange={(e) => setCanTrade(e.target.checked)}
                    className="rounded border-slate-700"
                  />
                  <span>Spot Trading Permission</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={canWithdraw}
                    onChange={(e) => setCanWithdraw(e.target.checked)}
                    className="rounded border-slate-700"
                  />
                  <span>Withdrawal Allowance</span>
                </label>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-colors"
              >
                Create API Key
              </button>
            </form>

            {createdKeySecret && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold block">
                  Store Secret Key Now (Will not be displayed again):
                </span>
                <div className="flex items-center justify-between rounded bg-[#0B1020] p-2 text-slate-200">
                  <span className="truncate">{createdKeySecret}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdKeySecret);
                      addToast({ type: 'success', title: 'Copied', description: 'API Secret copied to clipboard.' });
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing Keys Table */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0E1528] text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">Public Key</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-[11px]">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">{key.label}</td>
                    <td className="py-3 px-4 text-slate-300">{key.publicKey}</td>
                    <td className="py-3 px-4 text-cyan-400">{key.permissions.join(', ')}</td>
                    <td className="py-3 px-4 text-slate-400">{key.createdAt}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => revokeApiKey(key.id)}
                        className="rounded p-1 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
