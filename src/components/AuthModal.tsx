import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { SEED_USERS } from '../services/mockData';
import { X, Lock, Mail, User, ShieldCheck, Key, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, setCurrentUser, addToast } = useExchange();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [totpCode, setTotpCode] = useState('');

  if (!authModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Check if 2fa needed
    if (email.includes('elena') || email.includes('david')) {
      setMode('2fa');
      return;
    }

    // Default trader
    setCurrentUser(SEED_USERS[2]);
    addToast({
      type: 'success',
      title: 'Authenticated Successfully',
      description: `Welcome back, ${SEED_USERS[2].name}.`,
    });
    setAuthModalOpen(false);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const user = email.includes('david') ? SEED_USERS[1] : SEED_USERS[0];
    setCurrentUser(user);
    addToast({
      type: 'success',
      title: '2FA Validation Confirmed',
      description: `Logged in as ${user.name} (${user.role}).`,
    });
    setAuthModalOpen(false);
    setMode('login');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const newUser = {
      ...SEED_USERS[2],
      name: name || 'Registered Trader',
      email,
    };
    setCurrentUser(newUser);
    addToast({
      type: 'success',
      title: 'Account Created',
      description: 'Your sandbox account is initialized with $50,000 USDT virtual funds.',
    });
    setAuthModalOpen(false);
  };

  const handleSelectDemoUser = (user: typeof SEED_USERS[0]) => {
    setCurrentUser(user);
    addToast({
      type: 'info',
      title: `Logged In: ${user.name}`,
      description: `Role active: ${user.role} · Tier ${user.kycTier}`,
    });
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl text-slate-100">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            AX
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {mode === 'login'
                ? 'Sign in to AetherX'
                : mode === 'register'
                ? 'Create AetherX Account'
                : mode === '2fa'
                ? 'Two-Factor Authentication'
                : 'Reset Password'}
            </h2>
            <p className="text-xs text-slate-400">Institutional Digital Asset Exchange</p>
          </div>
        </div>

        {/* 1-Click Sandbox Demo Quick Switch */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-[#0B1020] p-3 text-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-cyan-400 block tracking-wider">
            1-Click Sandbox Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectDemoUser(SEED_USERS[0])}
              className="rounded-lg border border-slate-800 bg-[#151D2F] p-2 text-left hover:border-blue-500 transition-colors"
            >
              <span className="font-bold text-white block">Elena Rostova</span>
              <span className="text-[10px] text-slate-400 font-mono">VIP Trader (Tier 2)</span>
            </button>
            <button
              onClick={() => handleSelectDemoUser(SEED_USERS[1])}
              className="rounded-lg border border-slate-800 bg-[#151D2F] p-2 text-left hover:border-amber-500 transition-colors"
            >
              <span className="font-bold text-white block">David Vance</span>
              <span className="text-[10px] text-amber-400 font-mono">Compliance Officer</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-cyan-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-colors font-sans"
            >
              Log In
            </button>

            <div className="text-center text-slate-400 text-xs font-sans pt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-blue-400 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {mode === '2fa' && (
          <form onSubmit={handleVerify2FA} className="space-y-4 text-xs font-mono">
            <p className="text-xs text-slate-300">
              Enter the 6-digit verification code generated by your Authenticator app.
            </p>
            <div>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit TOTP"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-center text-lg tracking-widest text-white focus:outline-none font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-colors font-sans"
            >
              Confirm 2FA Sign-In
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Elena Rostova"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-colors font-sans"
            >
              Register Sandbox Account
            </button>

            <div className="text-center text-slate-400 text-xs font-sans pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-400 hover:underline font-semibold"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <div className="space-y-4 text-xs font-mono">
            <p className="text-slate-300">
              Enter your email and we'll send a password recovery reset token.
            </p>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1020] px-3 py-2 text-white focus:outline-none"
            />
            <button
              onClick={() => {
                addToast({ type: 'info', title: 'Reset Email Sent', description: 'Check inbox for reset instructions.' });
                setMode('login');
              }}
              className="w-full py-2 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-500"
            >
              Send Reset Link
            </button>
            <button
              onClick={() => setMode('login')}
              className="w-full text-center text-slate-400 hover:underline text-xs"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
