import {
  Asset,
  TradingPair,
  Candle,
  OrderBook,
  RecentTrade,
  UserProfile,
  LedgerEntry,
  KYCSubmission,
  AuditLogItem,
} from '../types/exchange';

export const INITIAL_ASSETS: Asset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    priceUsd: 68420.50,
    change24h: 2.84,
    high24h: 69150.00,
    low24h: 66890.20,
    volume24h: 28450120000,
    marketCap: 1350420000000,
    circulatingSupply: '19,780,000 BTC',
    category: 'Layer 1',
    iconColor: '#F7931A',
    networks: [
      { id: 'btc-mainnet', name: 'Bitcoin Native (SegWit)', fee: 0.00015, feeAsset: 'BTC', confirmations: 2, withdrawalMin: 0.0005 },
      { id: 'btc-lightning', name: 'Lightning Network', fee: 0.00001, feeAsset: 'BTC', confirmations: 0, withdrawalMin: 0.0001 },
      { id: 'btc-arbitrum', name: 'Arbitrum One (WBTC)', fee: 0.00008, feeAsset: 'BTC', confirmations: 12, withdrawalMin: 0.0002 },
    ],
    description: 'Bitcoin is the first decentralized, peer-to-peer digital currency, powered by proof-of-work consensus and hard-capped at 21 million units.',
    consensus: 'Proof of Work (SHA-256)',
    explorerUrl: 'https://mempool.space',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    priceUsd: 3540.25,
    change24h: 4.15,
    high24h: 3590.80,
    low24h: 3385.10,
    volume24h: 18920400000,
    marketCap: 426800000000,
    circulatingSupply: '120,450,000 ETH',
    category: 'Layer 1',
    iconColor: '#627EEA',
    networks: [
      { id: 'eth-mainnet', name: 'Ethereum Mainnet (ERC-20)', fee: 0.0035, feeAsset: 'ETH', confirmations: 12, withdrawalMin: 0.01 },
      { id: 'eth-arbitrum', name: 'Arbitrum One (L2)', fee: 0.0004, feeAsset: 'ETH', confirmations: 20, withdrawalMin: 0.005 },
      { id: 'eth-optimism', name: 'Optimism (OP Mainnet)', fee: 0.0004, feeAsset: 'ETH', confirmations: 20, withdrawalMin: 0.005 },
      { id: 'eth-base', name: 'Base L2', fee: 0.0003, feeAsset: 'ETH', confirmations: 20, withdrawalMin: 0.005 },
    ],
    description: 'Ethereum is a decentralized global computing platform enabling smart contracts, decentralized finance (DeFi), and layer-2 scalability solutions.',
    consensus: 'Proof of Stake (Casper FFG)',
    explorerUrl: 'https://etherscan.io',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    priceUsd: 178.60,
    change24h: -1.35,
    high24h: 184.20,
    low24h: 175.40,
    volume24h: 8420100000,
    marketCap: 83200000000,
    circulatingSupply: '468,100,000 SOL',
    category: 'Layer 1',
    iconColor: '#14F195',
    networks: [
      { id: 'sol-native', name: 'Solana SPL', fee: 0.01, feeAsset: 'SOL', confirmations: 32, withdrawalMin: 0.1 },
    ],
    description: 'Solana is a high-throughput blockchain optimized for fast finality, low sub-cent transaction costs, and scalable decentralized applications.',
    consensus: 'Proof of History + Proof of Stake',
    explorerUrl: 'https://solscan.io',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    priceUsd: 34.20,
    change24h: 5.80,
    high24h: 35.10,
    low24h: 31.90,
    volume24h: 1240000000,
    marketCap: 13900000000,
    circulatingSupply: '407,000,000 AVAX',
    category: 'Layer 1',
    iconColor: '#E84142',
    networks: [
      { id: 'avax-cchain', name: 'Avalanche C-Chain', fee: 0.05, feeAsset: 'AVAX', confirmations: 15, withdrawalMin: 0.2 },
    ],
    description: 'Avalanche is a smart contracts platform built for speed and custom subnet architectures running on Snow consensus.',
    consensus: 'Snowman Consensus',
    explorerUrl: 'https://subnets.avax.network',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    priceUsd: 16.45,
    change24h: 1.15,
    high24h: 16.90,
    low24h: 15.95,
    volume24h: 680000000,
    marketCap: 9800000000,
    circulatingSupply: '608,000,000 LINK',
    category: 'Infrastructure',
    iconColor: '#375BD2',
    networks: [
      { id: 'link-erc20', name: 'Ethereum (ERC-20)', fee: 0.5, feeAsset: 'LINK', confirmations: 12, withdrawalMin: 1.0 },
      { id: 'link-arbitrum', name: 'Arbitrum One', fee: 0.1, feeAsset: 'LINK', confirmations: 20, withdrawalMin: 0.5 },
    ],
    description: 'Chainlink is the industry standard decentralized oracle network connecting smart contracts with real-world financial data feeds and CCIP cross-chain messaging.',
    consensus: 'Decentralized Oracle Networks (DONs)',
    explorerUrl: 'https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca',
  },
  {
    symbol: 'SUI',
    name: 'Sui Network',
    decimals: 9,
    priceUsd: 2.14,
    change24h: 8.90,
    high24h: 2.22,
    low24h: 1.94,
    volume24h: 1420000000,
    marketCap: 6100000000,
    circulatingSupply: '2,850,000,000 SUI',
    category: 'Layer 1',
    iconColor: '#4CA2FF',
    networks: [
      { id: 'sui-native', name: 'Sui Network Native', fee: 0.05, feeAsset: 'SUI', confirmations: 1, withdrawalMin: 0.5 },
    ],
    description: 'Sui is an innovative object-centric Layer 1 blockchain using the Move programming language, enabling horizontal scaling and instant finality.',
    consensus: 'Mysticeti / Narwhal-Bullshark',
    explorerUrl: 'https://suiscan.xyz',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    priceUsd: 1.00,
    change24h: 0.01,
    high24h: 1.001,
    low24h: 0.999,
    volume24h: 49500000000,
    marketCap: 118000000000,
    circulatingSupply: '118,000,000,000 USDT',
    category: 'Stablecoin',
    iconColor: '#26A17B',
    networks: [
      { id: 'usdt-trc20', name: 'TRON (TRC-20)', fee: 1.0, feeAsset: 'USDT', confirmations: 20, withdrawalMin: 10.0 },
      { id: 'usdt-erc20', name: 'Ethereum (ERC-20)', fee: 4.5, feeAsset: 'USDT', confirmations: 12, withdrawalMin: 20.0 },
      { id: 'usdt-arbitrum', name: 'Arbitrum One', fee: 0.5, feeAsset: 'USDT', confirmations: 20, withdrawalMin: 5.0 },
      { id: 'usdt-sol', name: 'Solana (SPL)', fee: 0.5, feeAsset: 'USDT', confirmations: 32, withdrawalMin: 5.0 },
    ],
    description: 'Tether (USDT) is the most widely adopted fiat-pegged stablecoin, audited and backed by reserve assets.',
    consensus: 'Multi-chain Token',
    explorerUrl: 'https://tronscan.org',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    priceUsd: 1.00,
    change24h: -0.01,
    high24h: 1.001,
    low24h: 0.999,
    volume24h: 14200000000,
    marketCap: 35000000000,
    circulatingSupply: '35,000,000,000 USDC',
    category: 'Stablecoin',
    iconColor: '#2775CA',
    networks: [
      { id: 'usdc-erc20', name: 'Ethereum (ERC-20)', fee: 3.0, feeAsset: 'USDC', confirmations: 12, withdrawalMin: 10.0 },
      { id: 'usdc-arbitrum', name: 'Arbitrum One', fee: 0.3, feeAsset: 'USDC', confirmations: 20, withdrawalMin: 5.0 },
      { id: 'usdc-base', name: 'Base L2', fee: 0.2, feeAsset: 'USDC', confirmations: 20, withdrawalMin: 5.0 },
      { id: 'usdc-sol', name: 'Solana (SPL)', fee: 0.3, feeAsset: 'USDC', confirmations: 32, withdrawalMin: 5.0 },
    ],
    description: 'USDC is a regulated digital dollar fully backed by cash and short-dated US Treasuries with monthly reserve attestations.',
    consensus: 'Multi-chain Token',
    explorerUrl: 'https://etherscan.io',
  },
];

export const INITIAL_TRADING_PAIRS: TradingPair[] = [
  {
    id: 'BTC-USDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    lastPrice: 68420.50,
    priceChangePercent: 2.84,
    highPrice: 69150.00,
    lowPrice: 66890.20,
    volumeBase: 415.82,
    volumeQuote: 28420100,
    pricePrecision: 2,
    quantityPrecision: 5,
    minOrderQuantity: 0.0001,
    makerFeeRate: 0.0010, // 0.10%
    takerFeeRate: 0.0015, // 0.15%
  },
  {
    id: 'ETH-USDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    lastPrice: 3540.25,
    priceChangePercent: 4.15,
    highPrice: 3590.80,
    lowPrice: 3385.10,
    volumeBase: 5340.50,
    volumeQuote: 18920400,
    pricePrecision: 2,
    quantityPrecision: 4,
    minOrderQuantity: 0.002,
    makerFeeRate: 0.0010,
    takerFeeRate: 0.0015,
  },
  {
    id: 'SOL-USDT',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    lastPrice: 178.60,
    priceChangePercent: -1.35,
    highPrice: 184.20,
    lowPrice: 175.40,
    volumeBase: 47120.00,
    volumeQuote: 8420100,
    pricePrecision: 2,
    quantityPrecision: 2,
    minOrderQuantity: 0.05,
    makerFeeRate: 0.0010,
    takerFeeRate: 0.0015,
  },
  {
    id: 'AVAX-USDT',
    baseAsset: 'AVAX',
    quoteAsset: 'USDT',
    lastPrice: 34.20,
    priceChangePercent: 5.80,
    highPrice: 35.10,
    lowPrice: 31.90,
    volumeBase: 36240.00,
    volumeQuote: 1240000,
    pricePrecision: 2,
    quantityPrecision: 2,
    minOrderQuantity: 0.5,
    makerFeeRate: 0.0010,
    takerFeeRate: 0.0015,
  },
  {
    id: 'LINK-USDT',
    baseAsset: 'LINK',
    quoteAsset: 'USDT',
    lastPrice: 16.45,
    priceChangePercent: 1.15,
    highPrice: 16.90,
    lowPrice: 15.95,
    volumeBase: 41300.00,
    volumeQuote: 680000,
    pricePrecision: 3,
    quantityPrecision: 2,
    minOrderQuantity: 1.0,
    makerFeeRate: 0.0010,
    takerFeeRate: 0.0015,
  },
  {
    id: 'SUI-USDT',
    baseAsset: 'SUI',
    quoteAsset: 'USDT',
    lastPrice: 2.14,
    priceChangePercent: 8.90,
    highPrice: 2.22,
    lowPrice: 1.94,
    volumeBase: 663500.00,
    volumeQuote: 1420000,
    pricePrecision: 4,
    quantityPrecision: 1,
    minOrderQuantity: 5.0,
    makerFeeRate: 0.0010,
    takerFeeRate: 0.0015,
  },
  {
    id: 'ETH-BTC',
    baseAsset: 'ETH',
    quoteAsset: 'BTC',
    lastPrice: 0.05174,
    priceChangePercent: 1.28,
    highPrice: 0.05210,
    lowPrice: 0.05060,
    volumeBase: 842.10,
    volumeQuote: 43.58,
    pricePrecision: 5,
    quantityPrecision: 3,
    minOrderQuantity: 0.01,
    makerFeeRate: 0.0008,
    takerFeeRate: 0.0012,
  },
  {
    id: 'SOL-BTC',
    baseAsset: 'SOL',
    quoteAsset: 'BTC',
    lastPrice: 0.00261,
    priceChangePercent: -4.05,
    highPrice: 0.00274,
    lowPrice: 0.00258,
    volumeBase: 3410.00,
    volumeQuote: 8.90,
    pricePrecision: 5,
    quantityPrecision: 2,
    minOrderQuantity: 0.1,
    makerFeeRate: 0.0008,
    takerFeeRate: 0.0012,
  },
];

// Generate deterministic historical candlestick dataset
export function generateCandles(basePrice: number, count: number = 60, intervalMinutes: number = 15): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  const stepMs = intervalMinutes * 60 * 1000;
  let currentPrice = basePrice * (1 - 0.035);

  for (let i = count; i >= 0; i--) {
    const time = now - i * stepMs;
    // pseudo-random walk that trends towards basePrice
    const progress = (count - i) / count;
    const trendPull = (basePrice - currentPrice) * 0.08;
    const randomWave = (Math.sin(i * 0.4) + Math.cos(i * 0.7)) * (basePrice * 0.004);
    const noise = (Math.random() - 0.48) * (basePrice * 0.008);

    const open = currentPrice;
    const delta = trendPull + randomWave + noise;
    const close = Math.max(basePrice * 0.5, open + delta);
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.004);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.004);
    const volume = Math.round((basePrice * 0.05 + Math.random() * basePrice * 0.1) * 10) / 10;

    candles.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  // Ensure last candle closes near basePrice
  if (candles.length > 0) {
    candles[candles.length - 1].close = basePrice;
  }

  return candles;
}

// Generate an order book around the current market price
export function generateOrderBook(midPrice: number, precision: number = 2): OrderBook {
  const depth = 8;
  const spreadDelta = midPrice * 0.0003;
  const bestBid = midPrice - spreadDelta;
  const bestAsk = midPrice + spreadDelta;

  const bids = [];
  let bidTotal = 0;
  for (let i = 0; i < depth; i++) {
    const price = Number((bestBid * (1 - i * 0.0006)).toFixed(precision));
    const amount = Number((0.15 + Math.random() * 1.8 + i * 0.12).toFixed(4));
    bidTotal += amount;
    bids.push({
      price,
      amount,
      total: Number(bidTotal.toFixed(4)),
      depthPercent: 0,
    });
  }

  const asks = [];
  let askTotal = 0;
  for (let i = 0; i < depth; i++) {
    const price = Number((bestAsk * (1 + i * 0.0006)).toFixed(precision));
    const amount = Number((0.15 + Math.random() * 1.8 + i * 0.12).toFixed(4));
    askTotal += amount;
    asks.push({
      price,
      amount,
      total: Number(askTotal.toFixed(4)),
      depthPercent: 0,
    });
  }

  const maxTotal = Math.max(bidTotal, askTotal) || 1;
  bids.forEach((b) => (b.depthPercent = Math.min(100, Math.round((b.total / maxTotal) * 100))));
  asks.forEach((a) => (a.depthPercent = Math.min(100, Math.round((a.total / maxTotal) * 100))));

  const spread = Number((bestAsk - bestBid).toFixed(precision));
  const spreadPercent = Number(((spread / midPrice) * 100).toFixed(4));

  return { bids, asks, spread, spreadPercent };
}

// Generate realistic initial trades
export function generateInitialTrades(midPrice: number, precision: number = 2): RecentTrade[] {
  const trades: RecentTrade[] = [];
  const now = Date.now();

  for (let i = 0; i < 15; i++) {
    const isBuy = Math.random() > 0.48;
    const variation = (Math.random() - 0.5) * (midPrice * 0.001);
    const price = Number((midPrice + variation).toFixed(precision));
    const amount = Number((0.02 + Math.random() * 0.85).toFixed(4));
    const date = new Date(now - i * 4200);
    const time = date.toTimeString().split(' ')[0];

    trades.push({
      id: `TR-${1000 + i}`,
      price,
      amount,
      time,
      side: isBuy ? 'BUY' : 'SELL',
    });
  }

  return trades;
}

export const SEED_USERS: UserProfile[] = [
  {
    id: 'usr_trader_elena',
    email: 'elena.rostova@trader.aetherx.io',
    name: 'Elena Rostova',
    avatarUrl: '/src/assets/images/avatar_trader_elena_1792063343681.jpg',
    role: 'VIP',
    kycTier: 2,
    kycStatus: 'APPROVED',
    twoFactorEnabled: true,
    antiPhishingCode: 'AX-ELENA-78',
    createdAt: '2026-01-14T08:30:00Z',
    lastLoginIp: '192.168.1.42 (Zurich, Switzerland)',
    lastLoginTime: '2026-10-15T04:12:00Z',
  },
  {
    id: 'usr_compliance_david',
    email: 'david.vance@compliance.aetherx.io',
    name: 'David Vance',
    avatarUrl: '/src/assets/images/avatar_compliance_david_1792063343576.jpg',
    role: 'COMPLIANCE',
    kycTier: 2,
    kycStatus: 'APPROVED',
    twoFactorEnabled: true,
    antiPhishingCode: 'AX-VANCE-ADMIN',
    createdAt: '2025-11-01T10:00:00Z',
    lastLoginIp: '10.0.4.120 (Internal SOC London)',
    lastLoginTime: '2026-10-15T03:45:00Z',
  },
  {
    id: 'usr_demo_trader',
    email: 'demo.trader@sandbox.aetherx.io',
    name: 'Demo Trader',
    role: 'TRADER',
    kycTier: 1,
    kycStatus: 'APPROVED',
    twoFactorEnabled: false,
    antiPhishingCode: 'DEMO-SAFE-KEY',
    createdAt: '2026-03-01T12:00:00Z',
    lastLoginIp: '172.16.0.88 (Sandbox Guest)',
    lastLoginTime: '2026-10-15T04:21:00Z',
  },
];

export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'lg-001',
    referenceId: 'DEP-8492019',
    timestamp: '2026-10-14 09:22:15',
    type: 'DEPOSIT',
    asset: 'USDT',
    amount: 50000.0,
    fee: 0.0,
    runningBalance: 50000.0,
    status: 'COMPLETED',
    counterpartyOrTxHash: '0x3f72a4901b22e1850384a861d9047b198c21a4fa81',
    notes: 'Inbound Wire via TRON TRC-20 (Simulated)',
  },
  {
    id: 'lg-002',
    referenceId: 'DEP-8492020',
    timestamp: '2026-10-14 09:25:40',
    type: 'DEPOSIT',
    asset: 'BTC',
    amount: 1.5,
    fee: 0.0,
    runningBalance: 1.5,
    status: 'COMPLETED',
    counterpartyOrTxHash: 'bc1q9a2x6y7v9z8w5u3t1s4r2q0p8o6n4m2l0k8j6h',
    notes: 'SegWit On-chain Deposit (Simulated)',
  },
  {
    id: 'lg-003',
    referenceId: 'DEP-8492021',
    timestamp: '2026-10-14 09:30:10',
    type: 'DEPOSIT',
    asset: 'ETH',
    amount: 10.0,
    fee: 0.0,
    runningBalance: 10.0,
    status: 'COMPLETED',
    counterpartyOrTxHash: '0x8b59c4710d52b1238965f9a46c1901da4e99f012',
    notes: 'Ethereum Mainnet Inbound (Simulated)',
  },
  {
    id: 'lg-004',
    referenceId: 'TX-TRADE-8910',
    timestamp: '2026-10-14 14:15:22',
    type: 'TRADE_BUY',
    asset: 'SOL',
    amount: 25.0,
    fee: 4.46,
    runningBalance: 25.0,
    status: 'COMPLETED',
    counterpartyOrTxHash: 'ORD-MATCH-4190',
    notes: 'Spot Market Match SOL/USDT @ 178.50',
  },
];

export const INITIAL_KYC_SUBMISSIONS: KYCSubmission[] = [
  {
    id: 'kyc-sub-101',
    userId: 'usr_trader_elena',
    fullName: 'Elena Rostova',
    nationality: 'Switzerland',
    documentType: 'PASSPORT',
    documentNumber: 'X8921045CH',
    status: 'APPROVED',
    submittedAt: '2026-01-14 08:35:00',
    reviewedAt: '2026-01-14 09:12:00',
    reviewerNotes: 'Biometric verification passed. Proof of address verified via utility invoice.',
  },
  {
    id: 'kyc-sub-102',
    userId: 'usr_pending_marcus',
    fullName: 'Marcus Vance',
    nationality: 'Germany',
    documentType: 'DRIVERS_LICENSE',
    documentNumber: 'DL-BER-98124',
    status: 'PENDING',
    submittedAt: '2026-10-15 03:10:00',
    reviewerNotes: 'Awaiting manual document resolution check by compliance officer.',
  },
  {
    id: 'kyc-sub-103',
    userId: 'usr_review_tariq',
    fullName: 'Tariq Al-Mansoor',
    nationality: 'United Arab Emirates',
    documentType: 'NATIONAL_ID',
    documentNumber: '784-1988-920192',
    status: 'ADDITIONAL_INFO',
    submittedAt: '2026-10-14 22:45:00',
    reviewedAt: '2026-10-15 01:20:00',
    reviewerNotes: 'Document corner was obscured; requested high-resolution re-upload.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-901',
    adminId: 'usr_compliance_david',
    adminName: 'David Vance',
    action: 'SYSTEM_CIRCUIT_BREAKER_TEST',
    targetType: 'SYSTEM',
    targetId: 'MATCHING_ENGINE_CORE',
    timestamp: '2026-10-15 02:15:30',
    details: 'Verified emergency volatility pause parameters on BTC-USDT and ETH-USDT.',
    ipAddress: '10.0.4.120',
  },
  {
    id: 'aud-902',
    adminId: 'usr_compliance_david',
    adminName: 'David Vance',
    action: 'KYC_TIER2_APPROVAL',
    targetType: 'KYC',
    targetId: 'kyc-sub-101',
    timestamp: '2026-10-14 09:12:00',
    details: 'Approved Level 2 verification for Elena Rostova with $250,000 daily withdrawal quota.',
    ipAddress: '10.0.4.120',
  },
  {
    id: 'aud-903',
    adminId: 'usr_compliance_david',
    adminName: 'David Vance',
    action: 'FEE_SCHEDULE_AUDIT',
    targetType: 'PAIR',
    targetId: 'BTC-USDT',
    timestamp: '2026-10-13 18:00:15',
    details: 'Audited maker fee tier at 0.10% and taker fee at 0.15%. All invariant balances balanced.',
    ipAddress: '10.0.4.120',
  },
];
