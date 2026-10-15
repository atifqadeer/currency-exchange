export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';

export type UserRole = 'TRADER' | 'VIP' | 'COMPLIANCE' | 'SUPER_ADMIN';

export type KYCStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFO';

export interface Asset {
  symbol: string;
  name: string;
  decimals: number;
  priceUsd: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: string;
  category: 'Layer 1' | 'DeFi' | 'Layer 2' | 'Infrastructure' | 'Stablecoin';
  iconColor: string;
  networks: {
    id: string;
    name: string;
    fee: number;
    feeAsset: string;
    confirmations: number;
    depositMemoRequired?: boolean;
    withdrawalMin: number;
  }[];
  description: string;
  consensus: string;
  explorerUrl: string;
}

export interface TradingPair {
  id: string; // e.g. "BTC-USDT"
  baseAsset: string; // e.g. "BTC"
  quoteAsset: string; // e.g. "USDT"
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volumeBase: number;
  volumeQuote: number;
  pricePrecision: number;
  quantityPrecision: number;
  minOrderQuantity: number;
  makerFeeRate: number; // e.g. 0.001 (0.10%)
  takerFeeRate: number; // e.g. 0.0015 (0.15%)
  isHalted?: boolean;
}

export interface Candle {
  time: number; // timestamp in seconds or ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depthPercent: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export interface RecentTrade {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: OrderSide;
}

export interface Order {
  id: string;
  pairId: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  stopPrice?: number;
  amount: number;
  filledAmount: number;
  totalUsd: number;
  status: OrderStatus;
  feePaid: number;
  feeAsset: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeExecution {
  id: string;
  orderId: string;
  pairId: string;
  side: OrderSide;
  price: number;
  amount: number;
  total: number;
  fee: number;
  feeAsset: string;
  role: 'MAKER' | 'TAKER';
  timestamp: string;
}

export interface WalletBalance {
  asset: string;
  free: number;
  inOrder: number;
  usdValue: number;
}

export interface LedgerEntry {
  id: string;
  referenceId: string;
  timestamp: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE_BUY' | 'TRADE_SELL' | 'CONVERT' | 'FEE';
  asset: string;
  amount: number; // positive for credit, negative for debit
  fee: number;
  runningBalance: number;
  status: 'COMPLETED' | 'PENDING' | 'FLAGGED' | 'REJECTED';
  counterpartyOrTxHash?: string;
  notes?: string;
}

export interface KYCSubmission {
  id: string;
  userId: string;
  fullName: string;
  nationality: string;
  documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
  documentNumber: string;
  status: KYCStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  kycTier: number; // 0, 1, 2
  kycStatus: KYCStatus;
  twoFactorEnabled: boolean;
  antiPhishingCode?: string;
  createdAt: string;
  lastLoginIp: string;
  lastLoginTime: string;
}

export interface ApiKeyItem {
  id: string;
  label: string;
  publicKey: string;
  permissions: ('READ' | 'TRADE' | 'WITHDRAW')[];
  ipWhitelist?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'USER' | 'PAIR' | 'WITHDRAWAL' | 'KYC' | 'SYSTEM';
  targetId: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: 'DEPOSIT_WITHDRAWAL' | 'TRADING' | 'KYC' | 'SECURITY' | 'OTHER';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  messages: {
    sender: 'USER' | 'SUPPORT';
    text: string;
    timestamp: string;
  }[];
}
