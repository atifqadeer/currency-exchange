import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Asset,
  TradingPair,
  Order,
  OrderSide,
  OrderType,
  TradeExecution,
  OrderBook,
  RecentTrade,
  Candle,
  LedgerEntry,
  UserProfile,
  KYCSubmission,
  AuditLogItem,
  ApiKeyItem,
} from '../types/exchange';
import {
  INITIAL_ASSETS,
  INITIAL_TRADING_PAIRS,
  SEED_USERS,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_KYC_SUBMISSIONS,
  INITIAL_AUDIT_LOGS,
  generateCandles,
  generateOrderBook,
  generateInitialTrades,
} from '../services/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description: string;
}

interface BalanceItem {
  free: number;
  inOrder: number;
}

interface ExchangeContextType {
  // Navigation & modals
  activeTab: 'home' | 'markets' | 'trade' | 'convert' | 'wallet' | 'learn' | 'admin' | 'profile';
  setActiveTab: (tab: 'home' | 'markets' | 'trade' | 'convert' | 'wallet' | 'learn' | 'admin' | 'profile') => void;
  selectedAssetForDetail: Asset | null;
  setSelectedAssetForDetail: (asset: Asset | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Real-time market state
  assets: Asset[];
  tradingPairs: TradingPair[];
  selectedPairId: string;
  setSelectedPairId: (id: string) => void;
  currentPair: TradingPair;
  currentAsset: Asset;
  orderBook: OrderBook;
  recentTrades: RecentTrade[];
  candles: Candle[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  isLiveFeedActive: boolean;
  setIsLiveFeedActive: (active: boolean) => void;
  
  // User & Balances
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchUserRole: (role: 'VIP' | 'COMPLIANCE' | 'TRADER') => void;
  balances: Record<string, BalanceItem>;
  getAssetBalance: (symbol: string) => { free: number; inOrder: number; total: number; usdValue: number };
  totalPortfolioUsd: number;
  totalPortfolioBtc: number;
  
  // Trading Engine
  orders: Order[];
  tradeExecutions: TradeExecution[];
  placeOrder: (params: {
    side: OrderSide;
    type: OrderType;
    price: number;
    amount: number;
    stopPrice?: number;
  }) => { success: boolean; message: string };
  cancelOrder: (orderId: string) => void;
  cancelAllOrders: () => void;
  
  // Instant Convert
  executeConvert: (params: {
    fromAsset: string;
    toAsset: string;
    fromAmount: number;
  }) => { success: boolean; toAmount: number; message: string };

  // Wallet
  ledger: LedgerEntry[];
  simulateDeposit: (asset: string, networkId: string, amount: number) => void;
  simulateWithdrawal: (params: {
    asset: string;
    networkId: string;
    destinationAddress: string;
    amount: number;
    fee: number;
  }) => { success: boolean; message: string; requiresReview?: boolean };

  // Watchlist
  watchlist: string[];
  toggleWatchlist: (pairId: string) => void;

  // KYC & Compliance
  kycSubmissions: KYCSubmission[];
  submitKYC: (params: {
    fullName: string;
    nationality: string;
    documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
    documentNumber: string;
  }) => void;
  approveKYC: (submissionId: string, notes?: string) => void;
  rejectKYC: (submissionId: string, reason: string) => void;

  // Admin Controls
  auditLogs: AuditLogItem[];
  togglePairHalt: (pairId: string) => void;
  updatePairFees: (pairId: string, maker: number, taker: number) => void;
  approveWithdrawal: (ledgerId: string) => void;
  rejectWithdrawal: (ledgerId: string, reason: string) => void;

  // API Keys
  apiKeys: ApiKeyItem[];
  generateApiKey: (label: string, permissions: ('READ' | 'TRADE' | 'WITHDRAW')[]) => ApiKeyItem;
  revokeApiKey: (id: string) => void;

  // Notifications & Reset
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetDemoEnvironment: () => void;
}

const INITIAL_BALANCES: Record<string, BalanceItem> = {
  USDT: { free: 50000.0, inOrder: 0.0 },
  BTC: { free: 1.5, inOrder: 0.0 },
  ETH: { free: 10.0, inOrder: 0.0 },
  SOL: { free: 25.0, inOrder: 0.0 },
  AVAX: { free: 100.0, inOrder: 0.0 },
  LINK: { free: 250.0, inOrder: 0.0 },
  SUI: { free: 1000.0, inOrder: 0.0 },
  USDC: { free: 5000.0, inOrder: 0.0 },
};

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const ExchangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'markets' | 'trade' | 'convert' | 'wallet' | 'learn' | 'admin' | 'profile'>('home');
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Market state
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>(INITIAL_TRADING_PAIRS);
  const [selectedPairId, setSelectedPairId] = useState<string>('BTC-USDT');
  const [timeframe, setTimeframe] = useState<string>('15m');
  const [isLiveFeedActive, setIsLiveFeedActive] = useState<boolean>(true);

  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile>(SEED_USERS[0]); // Elena (VIP)
  const [balances, setBalances] = useState<Record<string, BalanceItem>>(() => {
    const saved = localStorage.getItem('aetherx_balances');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BALANCES;
  });

  // Trading state
  const [orders, setOrders] = useState<Order[]>([]);
  const [tradeExecutions, setTradeExecutions] = useState<TradeExecution[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [watchlist, setWatchlist] = useState<string[]>(['BTC-USDT', 'ETH-USDT', 'SOL-USDT']);
  const [kycSubmissions, setKycSubmissions] = useState<KYCSubmission[]>(INITIAL_KYC_SUBMISSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'api-01',
      label: 'Quantitative Trading Bot A',
      publicKey: 'ax_live_9f81a7b290d2e48',
      permissions: ['READ', 'TRADE'],
      ipWhitelist: '192.168.1.42',
      createdAt: '2026-09-12 11:00:00',
    },
  ]);

  // Save balances to localStorage
  useEffect(() => {
    localStorage.setItem('aetherx_balances', JSON.stringify(balances));
  }, [balances]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Current pair & asset
  const currentPair = useMemo(() => {
    return tradingPairs.find((p) => p.id === selectedPairId) || tradingPairs[0];
  }, [tradingPairs, selectedPairId]);

  const currentAsset = useMemo(() => {
    return assets.find((a) => a.symbol === currentPair.baseAsset) || assets[0];
  }, [assets, currentPair]);

  // Candles & Orderbook state for current pair
  const [candles, setCandles] = useState<Candle[]>(() =>
    generateCandles(currentPair.lastPrice, 60, 15)
  );

  const [orderBook, setOrderBook] = useState<OrderBook>(() =>
    generateOrderBook(currentPair.lastPrice, currentPair.pricePrecision)
  );

  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>(() =>
    generateInitialTrades(currentPair.lastPrice, currentPair.pricePrecision)
  );

  // When selected pair changes, reload candles, orderbook, trades
  useEffect(() => {
    const tfMinutes = timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : timeframe === '15m' ? 15 : timeframe === '1h' ? 60 : timeframe === '4h' ? 240 : 1440;
    setCandles(generateCandles(currentPair.lastPrice, 60, tfMinutes));
    setOrderBook(generateOrderBook(currentPair.lastPrice, currentPair.pricePrecision));
    setRecentTrades(generateInitialTrades(currentPair.lastPrice, currentPair.pricePrecision));
  }, [currentPair.id, timeframe]);

  // Real-time market tick generator & simulated order matching engine
  useEffect(() => {
    if (!isLiveFeedActive) return;

    const interval = setInterval(() => {
      setTradingPairs((prevPairs) =>
        prevPairs.map((pair) => {
          if (pair.isHalted) return pair;

          // Micro volatility tick (-0.15% to +0.15%)
          const tickPct = (Math.random() - 0.49) * 0.003;
          const newPrice = Number((pair.lastPrice * (1 + tickPct)).toFixed(pair.pricePrecision));
          const newHigh = Math.max(pair.highPrice, newPrice);
          const newLow = Math.min(pair.lowPrice, newPrice);
          const newVolume = Number((pair.volumeQuote + Math.random() * 2500).toFixed(2));

          return {
            ...pair,
            lastPrice: newPrice,
            highPrice: newHigh,
            lowPrice: newLow,
            volumeQuote: newVolume,
            priceChangePercent: Number((pair.priceChangePercent + (tickPct * 10)).toFixed(2)),
          };
        })
      );

      // Update assets prices matching base pairs
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const matchingPair = tradingPairs.find((p) => p.baseAsset === asset.symbol && p.quoteAsset === 'USDT');
          if (matchingPair) {
            return {
              ...asset,
              priceUsd: matchingPair.lastPrice,
              change24h: matchingPair.priceChangePercent,
              high24h: matchingPair.highPrice,
              low24h: matchingPair.lowPrice,
            };
          }
          return asset;
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveFeedActive, tradingPairs]);

  // Orderbook and recent trades animation & order matching for selected pair
  useEffect(() => {
    if (!isLiveFeedActive) return;

    const bookInterval = setInterval(() => {
      if (currentPair.isHalted) return;

      const updatedBook = generateOrderBook(currentPair.lastPrice, currentPair.pricePrecision);
      setOrderBook(updatedBook);

      // Append new trade occasionally
      if (Math.random() > 0.3) {
        const isBuy = Math.random() > 0.48;
        const price = Number((currentPair.lastPrice * (1 + (Math.random() - 0.5) * 0.0006)).toFixed(currentPair.pricePrecision));
        const amount = Number((0.01 + Math.random() * 0.45).toFixed(4));
        const newTrade: RecentTrade = {
          id: `TR-${Date.now().toString().slice(-6)}`,
          price,
          amount,
          time: new Date().toTimeString().split(' ')[0],
          side: isBuy ? 'BUY' : 'SELL',
        };
        setRecentTrades((prev) => [newTrade, ...prev.slice(0, 24)]);
      }

      // Append/update live candle
      setCandles((prevCandles) => {
        if (!prevCandles.length) return prevCandles;
        const last = { ...prevCandles[prevCandles.length - 1] };
        const price = currentPair.lastPrice;
        last.close = price;
        last.high = Math.max(last.high, price);
        last.low = Math.min(last.low, price);
        last.volume = Number((last.volume + 0.05).toFixed(2));
        return [...prevCandles.slice(0, -1), last];
      });

      // CHECK LIMIT ORDERS FOR EXECUTION!
      setOrders((prevOrders): Order[] => {
        let hasChanges = false;
        const updated = prevOrders.map((order): Order => {
          if (order.status !== 'OPEN' || order.pairId !== currentPair.id) return order;

          let shouldFill = false;
          if (order.side === 'BUY' && currentPair.lastPrice <= order.price) {
            shouldFill = true;
          } else if (order.side === 'SELL' && currentPair.lastPrice >= order.price) {
            shouldFill = true;
          }

          if (shouldFill) {
            hasChanges = true;
            // Complete fill
            const fillPrice = order.price;
            const feeRate = order.side === 'BUY' ? currentPair.makerFeeRate : currentPair.makerFeeRate;
            const fee = Number((order.totalUsd * feeRate).toFixed(4));

            // Execute balance shift:
            setBalances((prevBal) => {
              const baseAsset = currentPair.baseAsset;
              const quoteAsset = currentPair.quoteAsset;
              const newBal = { ...prevBal };

              if (order.side === 'BUY') {
                // Free was locked into inOrder: unlock and deduct total
                const currentQuote = newBal[quoteAsset] || { free: 0, inOrder: 0 };
                newBal[quoteAsset] = {
                  free: currentQuote.free,
                  inOrder: Math.max(0, currentQuote.inOrder - order.totalUsd),
                };
                // Credit base asset
                const currentBase = newBal[baseAsset] || { free: 0, inOrder: 0 };
                newBal[baseAsset] = {
                  free: currentBase.free + order.amount,
                  inOrder: currentBase.inOrder,
                };
              } else {
                // SELL: Base was inOrder, release and deduct
                const currentBase = newBal[baseAsset] || { free: 0, inOrder: 0 };
                newBal[baseAsset] = {
                  free: currentBase.free,
                  inOrder: Math.max(0, currentBase.inOrder - order.amount),
                };
                // Credit quote asset minus fee
                const currentQuote = newBal[quoteAsset] || { free: 0, inOrder: 0 };
                newBal[quoteAsset] = {
                  free: currentQuote.free + (order.totalUsd - fee),
                  inOrder: currentQuote.inOrder,
                };
              }
              return newBal;
            });

            // Ledger entry
            const execId = `EXEC-${Date.now().toString().slice(-6)}`;
            const newExecution: TradeExecution = {
              id: execId,
              orderId: order.id,
              pairId: order.pairId,
              side: order.side,
              price: fillPrice,
              amount: order.amount,
              total: order.totalUsd,
              fee,
              feeAsset: currentPair.quoteAsset,
              role: 'MAKER',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            };
            setTradeExecutions((prev) => [newExecution, ...prev]);

            // Double-entry ledger
            const ledgerEntry: LedgerEntry = {
              id: `lg-${Date.now()}`,
              referenceId: `TX-LIMIT-${order.id.slice(-6)}`,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              type: order.side === 'BUY' ? 'TRADE_BUY' : 'TRADE_SELL',
              asset: order.side === 'BUY' ? currentPair.baseAsset : currentPair.quoteAsset,
              amount: order.side === 'BUY' ? order.amount : order.totalUsd - fee,
              fee,
              runningBalance: 0,
              status: 'COMPLETED',
              counterpartyOrTxHash: `ORDER-${order.id}`,
              notes: `Limit Order Filled: ${order.side} ${order.amount} ${currentPair.baseAsset} @ ${fillPrice}`,
            };
            setLedger((prev) => [ledgerEntry, ...prev]);

            addToast({
              type: 'success',
              title: 'Limit Order Executed',
              description: `${order.side} ${order.amount} ${currentPair.baseAsset} filled at ${fillPrice} ${currentPair.quoteAsset}`,
            });

            return {
              ...order,
              status: 'FILLED' as const,
              filledAmount: order.amount,
              feePaid: fee,
              updatedAt: new Date().toISOString(),
            };
          }
          return order;
        });

        return hasChanges ? updated : prevOrders;
      });
    }, 3200);

    return () => clearInterval(bookInterval);
  }, [isLiveFeedActive, currentPair, addToast]);

  // Balance helper
  const getAssetBalance = useCallback(
    (symbol: string) => {
      const bal = balances[symbol] || { free: 0, inOrder: 0 };
      const asset = assets.find((a) => a.symbol === symbol);
      const price = asset ? asset.priceUsd : symbol === 'USDT' || symbol === 'USDC' ? 1 : 0;
      const total = bal.free + bal.inOrder;
      const usdValue = total * price;
      return { free: bal.free, inOrder: bal.inOrder, total, usdValue };
    },
    [balances, assets]
  );

  // Total portfolio value
  const totalPortfolioUsd = useMemo(() => {
    let sum = 0;
    Object.keys(balances).forEach((symbol) => {
      const b = balances[symbol];
      const asset = assets.find((a) => a.symbol === symbol);
      const price = asset ? asset.priceUsd : symbol === 'USDT' || symbol === 'USDC' ? 1 : 0;
      sum += (b.free + b.inOrder) * price;
    });
    return sum;
  }, [balances, assets]);

  const totalPortfolioBtc = useMemo(() => {
    const btcAsset = assets.find((a) => a.symbol === 'BTC');
    const btcPrice = btcAsset ? btcAsset.priceUsd : 68000;
    return totalPortfolioUsd / btcPrice;
  }, [totalPortfolioUsd, assets]);

  // Place Order handler (Deterministic simulated execution engine)
  const placeOrder = useCallback(
    ({
      side,
      type,
      price,
      amount,
      stopPrice,
    }: {
      side: OrderSide;
      type: OrderType;
      price: number;
      amount: number;
      stopPrice?: number;
    }) => {
      if (currentPair.isHalted) {
        addToast({
          type: 'error',
          title: 'Trading Halted',
          description: `Trading on pair ${currentPair.id} is temporarily suspended by risk control.`,
        });
        return { success: false, message: 'Pair is halted.' };
      }

      if (amount < currentPair.minOrderQuantity) {
        const msg = `Minimum order quantity is ${currentPair.minOrderQuantity} ${currentPair.baseAsset}.`;
        addToast({ type: 'error', title: 'Order Rejected', description: msg });
        return { success: false, message: msg };
      }

      const totalUsd = Number((price * amount).toFixed(2));
      const feeRate = type === 'MARKET' ? currentPair.takerFeeRate : currentPair.makerFeeRate;
      const estimatedFee = Number((totalUsd * feeRate).toFixed(4));

      // Balance check
      const baseAsset = currentPair.baseAsset;
      const quoteAsset = currentPair.quoteAsset;
      const currentQuoteBal = balances[quoteAsset]?.free || 0;
      const currentBaseBal = balances[baseAsset]?.free || 0;

      if (side === 'BUY') {
        const totalRequired = totalUsd + estimatedFee;
        if (currentQuoteBal < totalRequired) {
          const msg = `Insufficient ${quoteAsset} balance. Available: ${currentQuoteBal.toFixed(2)}, required: ${totalRequired.toFixed(2)}`;
          addToast({ type: 'error', title: 'Insufficient Funds', description: msg });
          return { success: false, message: msg };
        }
      } else {
        if (currentBaseBal < amount) {
          const msg = `Insufficient ${baseAsset} balance. Available: ${currentBaseBal.toFixed(4)}, required: ${amount}`;
          addToast({ type: 'error', title: 'Insufficient Funds', description: msg });
          return { success: false, message: msg };
        }
      }

      const orderId = `ORD-${Date.now().toString().slice(-7)}`;
      const now = new Date().toISOString();

      if (type === 'MARKET') {
        // Immediate fill at market price
        const fillPrice = side === 'BUY'
          ? (orderBook.asks[0]?.price || currentPair.lastPrice)
          : (orderBook.bids[0]?.price || currentPair.lastPrice);
        
        const actualTotal = Number((fillPrice * amount).toFixed(2));
        const actualFee = Number((actualTotal * currentPair.takerFeeRate).toFixed(4));

        // Deduct/Credit balances
        setBalances((prev) => {
          const next = { ...prev };
          if (side === 'BUY') {
            next[quoteAsset] = {
              free: next[quoteAsset].free - (actualTotal + actualFee),
              inOrder: next[quoteAsset].inOrder,
            };
            const currentB = next[baseAsset] || { free: 0, inOrder: 0 };
            next[baseAsset] = {
              free: currentB.free + amount,
              inOrder: currentB.inOrder,
            };
          } else {
            next[baseAsset] = {
              free: next[baseAsset].free - amount,
              inOrder: next[baseAsset].inOrder,
            };
            const currentQ = next[quoteAsset] || { free: 0, inOrder: 0 };
            next[quoteAsset] = {
              free: currentQ.free + (actualTotal - actualFee),
              inOrder: currentQ.inOrder,
            };
          }
          return next;
        });

        // Create completed order
        const newOrder: Order = {
          id: orderId,
          pairId: currentPair.id,
          side,
          type: 'MARKET',
          price: fillPrice,
          amount,
          filledAmount: amount,
          totalUsd: actualTotal,
          status: 'FILLED',
          feePaid: actualFee,
          feeAsset: quoteAsset,
          createdAt: now,
          updatedAt: now,
        };

        // Create execution record
        const execution: TradeExecution = {
          id: `EXEC-${Date.now().toString().slice(-6)}`,
          orderId,
          pairId: currentPair.id,
          side,
          price: fillPrice,
          amount,
          total: actualTotal,
          fee: actualFee,
          feeAsset: quoteAsset,
          role: 'TAKER',
          timestamp: now.replace('T', ' ').slice(0, 19),
        };

        // Create double-entry ledger record
        const ledgerEntry: LedgerEntry = {
          id: `lg-${Date.now()}`,
          referenceId: `TX-SPOT-${orderId.slice(-6)}`,
          timestamp: now.replace('T', ' ').slice(0, 19),
          type: side === 'BUY' ? 'TRADE_BUY' : 'TRADE_SELL',
          asset: side === 'BUY' ? baseAsset : quoteAsset,
          amount: side === 'BUY' ? amount : actualTotal - actualFee,
          fee: actualFee,
          runningBalance: 0,
          status: 'COMPLETED',
          counterpartyOrTxHash: `ORDER-${orderId}`,
          notes: `Market Spot Fill: ${side} ${amount} ${baseAsset} @ ${fillPrice}`,
        };

        setOrders((prev) => [newOrder, ...prev]);
        setTradeExecutions((prev) => [execution, ...prev]);
        setLedger((prev) => [ledgerEntry, ...prev]);

        addToast({
          type: 'success',
          title: 'Market Order Executed',
          description: `Filled ${side} ${amount} ${baseAsset} @ ${fillPrice} ${quoteAsset}`,
        });

        return { success: true, message: 'Market order executed successfully.' };
      } else {
        // LIMIT or STOP-LIMIT ORDER
        // Reserve funds into inOrder balance
        setBalances((prev) => {
          const next = { ...prev };
          if (side === 'BUY') {
            next[quoteAsset] = {
              free: next[quoteAsset].free - totalUsd,
              inOrder: next[quoteAsset].inOrder + totalUsd,
            };
          } else {
            next[baseAsset] = {
              free: next[baseAsset].free - amount,
              inOrder: next[baseAsset].inOrder + amount,
            };
          }
          return next;
        });

        const newOrder: Order = {
          id: orderId,
          pairId: currentPair.id,
          side,
          type,
          price,
          stopPrice,
          amount,
          filledAmount: 0,
          totalUsd,
          status: 'OPEN',
          feePaid: 0,
          feeAsset: quoteAsset,
          createdAt: now,
          updatedAt: now,
        };

        setOrders((prev) => [newOrder, ...prev]);

        addToast({
          type: 'success',
          title: `${type === 'LIMIT' ? 'Limit' : 'Stop-Limit'} Order Placed`,
          description: `Order open for ${side} ${amount} ${baseAsset} @ ${price} ${quoteAsset}`,
        });

        return { success: true, message: 'Limit order posted to the book.' };
      }
    },
    [currentPair, balances, orderBook, addToast]
  );

  // Cancel order
  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev): Order[] => {
      const target = prev.find((o) => o.id === orderId);
      if (!target || target.status !== 'OPEN') return prev;

      // Release reserved balance back to free
      const pair = tradingPairs.find((p) => p.id === target.pairId) || currentPair;
      setBalances((prevBal) => {
        const next = { ...prevBal };
        if (target.side === 'BUY') {
          const q = next[pair.quoteAsset] || { free: 0, inOrder: 0 };
          next[pair.quoteAsset] = {
            free: q.free + target.totalUsd,
            inOrder: Math.max(0, q.inOrder - target.totalUsd),
          };
        } else {
          const b = next[pair.baseAsset] || { free: 0, inOrder: 0 };
          next[pair.baseAsset] = {
            free: b.free + target.amount,
            inOrder: Math.max(0, b.inOrder - target.amount),
          };
        }
        return next;
      });

      addToast({
        type: 'info',
        title: 'Order Cancelled',
        description: `Order ${orderId} cancelled. Reserved funds unlocked.`,
      });

      return prev.map((o): Order =>
        o.id === orderId ? { ...o, status: 'CANCELLED' as const, updatedAt: new Date().toISOString() } : o
      );
    });
  }, [tradingPairs, currentPair, addToast]);

  const cancelAllOrders = useCallback(() => {
    const openList = orders.filter((o) => o.status === 'OPEN');
    if (openList.length === 0) return;
    openList.forEach((o) => cancelOrder(o.id));
    addToast({
      type: 'info',
      title: 'All Orders Cancelled',
      description: `Cancelled ${openList.length} open orders.`,
    });
  }, [orders, cancelOrder, addToast]);

  // Instant Convert Execution
  const executeConvert = useCallback(
    ({ fromAsset, toAsset, fromAmount }: { fromAsset: string; toAsset: string; fromAmount: number }) => {
      const fromBal = balances[fromAsset]?.free || 0;
      if (fromBal < fromAmount) {
        addToast({
          type: 'error',
          title: 'Insufficient Balance',
          description: `You only have ${fromBal.toFixed(4)} ${fromAsset} available.`,
        });
        return { success: false, toAmount: 0, message: 'Insufficient funds.' };
      }

      const fromObj = assets.find((a) => a.symbol === fromAsset);
      const toObj = assets.find((a) => a.symbol === toAsset);
      const fromPrice = fromObj ? fromObj.priceUsd : fromAsset === 'USDT' || fromAsset === 'USDC' ? 1 : 1;
      const toPrice = toObj ? toObj.priceUsd : toAsset === 'USDT' || toAsset === 'USDC' ? 1 : 1;

      const usdValue = fromAmount * fromPrice;
      const rawToAmount = usdValue / toPrice;
      const toDecimals = toObj?.decimals && toObj.decimals > 8 ? 6 : 4;
      const toAmount = Number(rawToAmount.toFixed(toDecimals));

      // Balance update
      setBalances((prev) => {
        const next = { ...prev };
        next[fromAsset] = {
          free: next[fromAsset].free - fromAmount,
          inOrder: next[fromAsset].inOrder,
        };
        const currentTo = next[toAsset] || { free: 0, inOrder: 0 };
        next[toAsset] = {
          free: currentTo.free + toAmount,
          inOrder: currentTo.inOrder,
        };
        return next;
      });

      // Ledger entry
      const refId = `CONV-${Date.now().toString().slice(-6)}`;
      const ledgerEntry: LedgerEntry = {
        id: `lg-${Date.now()}`,
        referenceId: refId,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        type: 'CONVERT',
        asset: toAsset,
        amount: toAmount,
        fee: 0.0,
        runningBalance: 0,
        status: 'COMPLETED',
        counterpartyOrTxHash: `SWAP-${fromAsset}-${toAsset}`,
        notes: `Converted ${fromAmount} ${fromAsset} into ${toAmount} ${toAsset} @ rate ${(fromPrice / toPrice).toFixed(6)}`,
      };
      setLedger((prev) => [ledgerEntry, ...prev]);

      addToast({
        type: 'success',
        title: 'Conversion Complete',
        description: `Successfully converted ${fromAmount} ${fromAsset} to ${toAmount} ${toAsset}.`,
      });

      return { success: true, toAmount, message: 'Conversion completed.' };
    },
    [balances, assets, addToast]
  );

  // Simulated deposit
  const simulateDeposit = useCallback(
    (asset: string, networkId: string, amount: number) => {
      setBalances((prev) => {
        const next = { ...prev };
        const curr = next[asset] || { free: 0, inOrder: 0 };
        next[asset] = { free: curr.free + amount, inOrder: curr.inOrder };
        return next;
      });

      const refId = `DEP-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const hash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const newEntry: LedgerEntry = {
        id: `lg-${Date.now()}`,
        referenceId: refId,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        type: 'DEPOSIT',
        asset,
        amount,
        fee: 0,
        runningBalance: 0,
        status: 'COMPLETED',
        counterpartyOrTxHash: hash,
        notes: `Simulated inbound transfer via ${networkId}`,
      };
      setLedger((prev) => [newEntry, ...prev]);

      addToast({
        type: 'success',
        title: 'Deposit Credited',
        description: `${amount} ${asset} received via ${networkId}. 12/12 confirmations complete.`,
      });
    },
    [addToast]
  );

  // Simulated withdrawal
  const simulateWithdrawal = useCallback(
    ({
      asset,
      networkId,
      destinationAddress,
      amount,
      fee,
    }: {
      asset: string;
      networkId: string;
      destinationAddress: string;
      amount: number;
      fee: number;
    }) => {
      const curr = balances[asset]?.free || 0;
      const totalDebit = amount + fee;

      if (curr < totalDebit) {
        const msg = `Insufficient balance. Available: ${curr} ${asset}, required: ${totalDebit} ${asset} (including ${fee} network fee).`;
        addToast({ type: 'error', title: 'Withdrawal Failed', description: msg });
        return { success: false, message: msg };
      }

      // Check risk limits: if amount > $10,000 USD or Tier 1 account, trigger review queue
      const assetObj = assets.find((a) => a.symbol === asset);
      const usdValue = (assetObj?.priceUsd || 1) * amount;
      const requiresReview = usdValue > 10000 || currentUser.kycTier < 2;

      // Deduct balance
      setBalances((prev) => {
        const next = { ...prev };
        const b = next[asset] || { free: 0, inOrder: 0 };
        next[asset] = { free: b.free - totalDebit, inOrder: b.inOrder };
        return next;
      });

      const refId = `WTH-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const hash = requiresReview
        ? 'AWAITING_COMPLIANCE_SIGN_OFF'
        : `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const newEntry: LedgerEntry = {
        id: `lg-${Date.now()}`,
        referenceId: refId,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        type: 'WITHDRAWAL',
        asset,
        amount: -amount,
        fee,
        runningBalance: 0,
        status: requiresReview ? 'FLAGGED' : 'COMPLETED',
        counterpartyOrTxHash: hash,
        notes: `Outbound to ${destinationAddress.slice(0, 8)}...${destinationAddress.slice(-6)} on ${networkId}${requiresReview ? ' (Flagged for Risk Check)' : ''}`,
      };
      setLedger((prev) => [newEntry, ...prev]);

      if (requiresReview) {
        addToast({
          type: 'warning',
          title: 'Withdrawal Pending Risk Review',
          description: `Withdrawal of ${amount} ${asset} ($${usdValue.toLocaleString()}) queued for manual compliance check.`,
        });
      } else {
        addToast({
          type: 'success',
          title: 'Withdrawal Broadcasted',
          description: `Dispatched ${amount} ${asset} to network ${networkId}.`,
        });
      }

      return { success: true, message: 'Withdrawal processed', requiresReview };
    },
    [balances, assets, currentUser, addToast]
  );

  // Watchlist toggle
  const toggleWatchlist = useCallback((pairId: string) => {
    setWatchlist((prev) =>
      prev.includes(pairId) ? prev.filter((p) => p !== pairId) : [...prev, pairId]
    );
  }, []);

  // KYC submission
  const submitKYC = useCallback(
    ({
      fullName,
      nationality,
      documentType,
      documentNumber,
    }: {
      fullName: string;
      nationality: string;
      documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
      documentNumber: string;
    }) => {
      const newSubmission: KYCSubmission = {
        id: `kyc-sub-${Date.now().toString().slice(-4)}`,
        userId: currentUser.id,
        fullName,
        nationality,
        documentType,
        documentNumber,
        status: 'PENDING',
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        reviewerNotes: 'Uploaded document received and routed to automated verification queue.',
      };

      setKycSubmissions((prev) => [newSubmission, ...prev]);
      setCurrentUser((prev) => ({ ...prev, kycStatus: 'PENDING' }));

      addToast({
        type: 'info',
        title: 'Identity Verification Submitted',
        description: 'Your documents have been submitted to compliance for cryptographic biometric verification.',
      });
    },
    [currentUser, addToast]
  );

  // Admin: Approve KYC
  const approveKYC = useCallback((submissionId: string, notes?: string) => {
    setKycSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'APPROVED',
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
              reviewerNotes: notes || 'Verified credentials and watchlist database check passed.',
            }
          : s
      )
    );

    // If it was current user's submission, upgrade them
    setCurrentUser((prev) => ({ ...prev, kycTier: 2, kycStatus: 'APPROVED' }));

    // Audit log
    const audit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'APPROVE_KYC_VERIFICATION',
      targetType: 'KYC',
      targetId: submissionId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Approved verification case ${submissionId}. Upgraded user to Tier 2 Institutional Limits.`,
      ipAddress: '10.0.4.120',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast({
      type: 'success',
      title: 'KYC Case Approved',
      description: `Verification ${submissionId} approved by compliance officer.`,
    });
  }, [currentUser, addToast]);

  // Admin: Reject KYC
  const rejectKYC = useCallback((submissionId: string, reason: string) => {
    setKycSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'REJECTED',
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
              reviewerNotes: reason,
            }
          : s
      )
    );

    const audit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'REJECT_KYC_VERIFICATION',
      targetType: 'KYC',
      targetId: submissionId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Rejected verification case ${submissionId}. Reason: ${reason}`,
      ipAddress: '10.0.4.120',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast({
      type: 'warning',
      title: 'KYC Case Rejected',
      description: `Case ${submissionId} rejected. User notified of correction requirements.`,
    });
  }, [currentUser, addToast]);

  // Admin: Approve Flagged Withdrawal
  const approveWithdrawal = useCallback((ledgerId: string) => {
    setLedger((prev) =>
      prev.map((entry) => {
        if (entry.id === ledgerId) {
          return {
            ...entry,
            status: 'COMPLETED',
            counterpartyOrTxHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            notes: `${entry.notes} (Approved by Compliance)`,
          };
        }
        return entry;
      })
    );

    const audit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'RELEASE_FLAGGED_WITHDRAWAL',
      targetType: 'WITHDRAWAL',
      targetId: ledgerId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Released flagged transaction ${ledgerId} following AML threshold validation.`,
      ipAddress: '10.0.4.120',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast({
      type: 'success',
      title: 'Withdrawal Approved',
      description: 'Transaction signed and broadcasted to blockchain node cluster.',
    });
  }, [currentUser, addToast]);

  // Admin: Reject Flagged Withdrawal (Refund funds)
  const rejectWithdrawal = useCallback((ledgerId: string, reason: string) => {
    const entry = ledger.find((e) => e.id === ledgerId);
    if (!entry) return;

    // Refund asset + fee
    const refundAmount = Math.abs(entry.amount) + entry.fee;
    setBalances((prev) => {
      const next = { ...prev };
      const cur = next[entry.asset] || { free: 0, inOrder: 0 };
      next[entry.asset] = { free: cur.free + refundAmount, inOrder: cur.inOrder };
      return next;
    });

    setLedger((prev) =>
      prev.map((e) =>
        e.id === ledgerId
          ? {
              ...e,
              status: 'REJECTED',
              notes: `Rejected by Risk Officer: ${reason}. Funds refunded.`,
            }
          : e
      )
    );

    const audit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'REJECT_FLAGGED_WITHDRAWAL',
      targetType: 'WITHDRAWAL',
      targetId: ledgerId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Rejected flagged withdrawal ${ledgerId}. Reason: ${reason}. Ledger balance refunded.`,
      ipAddress: '10.0.4.120',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast({
      type: 'info',
      title: 'Withdrawal Blocked & Refunded',
      description: `Transaction rejected for compliance reasons. User balance of ${refundAmount} ${entry.asset} restored.`,
    });
  }, [ledger, currentUser, addToast]);

  // Admin: Pair halt / circuit breaker
  const togglePairHalt = useCallback((pairId: string) => {
    setTradingPairs((prev) =>
      prev.map((p) => {
        if (p.id === pairId) {
          const nextHalt = !p.isHalted;
          const audit: AuditLogItem = {
            id: `aud-${Date.now()}`,
            adminId: currentUser.id,
            adminName: currentUser.name,
            action: nextHalt ? 'CIRCUIT_BREAKER_HALT' : 'CIRCUIT_BREAKER_RESUME',
            targetType: 'PAIR',
            targetId: pairId,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            details: nextHalt ? `Emergency circuit breaker halted pair ${pairId}` : `Resumed normal matching for pair ${pairId}`,
            ipAddress: '10.0.4.120',
          };
          setAuditLogs((prevLogs) => [audit, ...prevLogs]);
          addToast({
            type: nextHalt ? 'warning' : 'success',
            title: nextHalt ? `Trading Halted: ${pairId}` : `Trading Resumed: ${pairId}`,
            description: nextHalt ? 'Matching engine paused for this pair.' : 'Matching engine reopened for trading.',
          });
          return { ...p, isHalted: nextHalt };
        }
        return p;
      })
    );
  }, [currentUser, addToast]);

  // Admin: Update fees
  const updatePairFees = useCallback((pairId: string, maker: number, taker: number) => {
    setTradingPairs((prev) =>
      prev.map((p) => (p.id === pairId ? { ...p, makerFeeRate: maker, takerFeeRate: taker } : p))
    );
    const audit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'UPDATE_FEE_SCHEDULE',
      targetType: 'PAIR',
      targetId: pairId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Updated fee parameters for ${pairId}: Maker ${(maker * 100).toFixed(2)}%, Taker ${(taker * 100).toFixed(2)}%`,
      ipAddress: '10.0.4.120',
    };
    setAuditLogs((prev) => [audit, ...prev]);
    addToast({
      type: 'success',
      title: 'Fee Schedule Updated',
      description: `Pair ${pairId} maker/taker rates updated.`,
    });
  }, [currentUser, addToast]);

  // API Key management
  const generateApiKey = useCallback((label: string, permissions: ('READ' | 'TRADE' | 'WITHDRAW')[]) => {
    const newKey: ApiKeyItem = {
      id: `api-${Date.now().toString().slice(-4)}`,
      label,
      publicKey: `ax_live_${Array.from({ length: 18 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      permissions,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setApiKeys((prev) => [newKey, ...prev]);
    addToast({
      type: 'success',
      title: 'API Key Created',
      description: `Key "${label}" generated. Store your secret key securely.`,
    });
    return newKey;
  }, [addToast]);

  const revokeApiKey = useCallback((id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    addToast({
      type: 'info',
      title: 'API Key Revoked',
      description: 'API credentials deactivated and invalid for future calls.',
    });
  }, [addToast]);

  // Switch role / user
  const switchUserRole = useCallback((role: 'VIP' | 'COMPLIANCE' | 'TRADER') => {
    const target = SEED_USERS.find((u) => u.role === role) || SEED_USERS[0];
    setCurrentUser(target);
    addToast({
      type: 'info',
      title: `Switched Persona: ${target.name}`,
      description: `Active role: ${role}. Permissions and verification tiers updated.`,
    });
  }, [addToast]);

  // Reset Demo environment
  const resetDemoEnvironment = useCallback(() => {
    setBalances(INITIAL_BALANCES);
    localStorage.removeItem('aetherx_balances');
    setOrders([]);
    setTradeExecutions([]);
    setLedger(INITIAL_LEDGER_ENTRIES);
    setTradingPairs(INITIAL_TRADING_PAIRS);
    setAssets(INITIAL_ASSETS);
    setKycSubmissions(INITIAL_KYC_SUBMISSIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(SEED_USERS[0]);
    addToast({
      type: 'info',
      title: 'Demo Environment Reset',
      description: 'Virtual balances restored to $50,000 USDT + 1.5 BTC + 10 ETH. Orders and ledger cleared.',
    });
  }, [addToast]);

  return (
    <ExchangeContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAssetForDetail,
        setSelectedAssetForDetail,
        authModalOpen,
        setAuthModalOpen,
        assets,
        tradingPairs,
        selectedPairId,
        setSelectedPairId,
        currentPair,
        currentAsset,
        orderBook,
        recentTrades,
        candles,
        timeframe,
        setTimeframe,
        isLiveFeedActive,
        setIsLiveFeedActive,
        currentUser,
        setCurrentUser,
        switchUserRole,
        balances,
        getAssetBalance,
        totalPortfolioUsd,
        totalPortfolioBtc,
        orders,
        tradeExecutions,
        placeOrder,
        cancelOrder,
        cancelAllOrders,
        executeConvert,
        ledger,
        simulateDeposit,
        simulateWithdrawal,
        watchlist,
        toggleWatchlist,
        kycSubmissions,
        submitKYC,
        approveKYC,
        rejectKYC,
        auditLogs,
        togglePairHalt,
        updatePairFees,
        approveWithdrawal,
        rejectWithdrawal,
        apiKeys,
        generateApiKey,
        revokeApiKey,
        toasts,
        addToast,
        removeToast,
        resetDemoEnvironment,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};
