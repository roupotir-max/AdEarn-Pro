export type PaymentMethod = 'bKash' | 'Nagad';

export interface UserAccount {
  name: string;
  phone: string;
  senderNo: string;
  trxId: string;
  createdAt: number;
  isDepositApproved: boolean;
}

export interface DepositRequest {
  id: number;
  name: string;
  phone: string;
  senderNo: string;
  trxId: string;
  date: string;
  planId?: 'starter' | 'pro';
  planName?: string;
  planPrice?: number;
  dailyIncome?: number;
}

export interface InvestmentPlanOption {
  id: 'starter' | 'pro';
  planName: 'Starter Plan' | 'Pro Plan';
  titleBn: string;
  price: number;
  dailyIncome: number;
  durationDays: number;
  accent: 'blue' | 'amber';
}

export interface ActiveInvestmentPlan {
  id: 'starter' | 'pro';
  planName: string;
  price: number;
  dailyIncome: number;
  activatedAt: number;
  lastClaimDate: string;
}

export interface VideoAd {
  id: number;
  link: string;
}

export interface WithdrawRequest {
  id: number;
  method: PaymentMethod;
  number: string;
  amount: number;
  date: string;
}

export interface PublicTransaction {
  id: number;
  user: string;
  method: PaymentMethod;
  amount: number;
  date: string;
}

export interface DirectMessage {
  id: number;
  name: string;
  phone: string;
  text: string;
  time: string;
}

export interface ReferralRecord {
  id: number;
  name: string;
  phone: string;
  referCode: string;
  joinedDate: string;
  hasWatchedAd: boolean;
}

export interface DailyEarningsEntry {
  ads: number;
  earnings: number;
}

export type DailyEarningsHistoryMap = Record<string, DailyEarningsEntry>;

export type AppTab = 'earn' | 'refer' | 'withdraw' | 'support' | 'admin';
export type AdminSubTab =
  | 'depositTab'
  | 'videoTab'
  | 'bannerTab'
  | 'txAdminTab';

export interface ToastMessage {
  id: number;
  text: string;
  tone?: 'neutral' | 'success' | 'warning' | 'error';
}

export const DAILY_MAX_ADS = 150;
export const REWARD_PER_AD = 10;
export const REFER_REWARD = 300;
export const MIN_RETURN_SECONDS = 12;
export const MIN_WITHDRAW = 3000;
export const DEPOSIT_FEE = 499;
export const DEPOSIT_BKASH_NUMBER = '01618296697';
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const CORRECT_ADMIN_PASS = 'Mrinmoy12@#';

export const INVESTMENT_PLANS: InvestmentPlanOption[] = [
  {
    id: 'starter',
    planName: 'Starter Plan',
    titleBn: 'স্টার্টার প্ল্যান',
    price: 499,
    dailyIncome: 500,
    durationDays: 30,
    accent: 'blue',
  },
  {
    id: 'pro',
    planName: 'Pro Plan',
    titleBn: 'প্রো ভিআইপি প্ল্যান',
    price: 1000,
    dailyIncome: 1000,
    durationDays: 30,
    accent: 'amber',
  },
];

export const STORAGE_KEYS = {
  USER_ACCOUNT: 'adEarnUserAccount',
  DEPOSIT_REQUESTS: 'adminDepositRequests',
  ACTIVE_PLANS: 'activeInvestmentPlans',
  BALANCE: 'userBalance',
  VIDEO_ADS: 'appVideoAds',
  WITHDRAW_REQUESTS: 'withdrawRequests',
  PUBLIC_TRANSACTIONS: 'publicWithdrawTransactions',
  DIRECT_MESSAGES: 'adminDirectMessages',
  TOP_BANNER: 'topBannerAd',
  BOTTOM_BANNER: 'bottomBannerAd',
  AD_WATCH_DATE: 'adWatchDate',
  DAILY_WATCHED_COUNT: 'dailyWatchedCount',
  DAILY_EARNINGS_HISTORY: 'dailyEarningsHistory',
  MY_REFER_CODE: 'myReferCode',
  COMPLETED_REFERS: 'completedRefers',
  APPLIED_REFER_CODE: 'appliedReferCode',
  IS_REFER_COMPLETED_BY_ME: 'isReferCompletedByMe',
  REFERRAL_RECORDS: 'referralRecords',
  PENDING_AD_START_TIME: 'pendingAdStartTime',
} as const;
