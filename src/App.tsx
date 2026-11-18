import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CreditCard,
  Gift,
  Home,
  Lock,
  MessageSquare,
  Play,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AdminSection } from './components/AdminSection';
import { AuthOverlay } from './components/AuthOverlay';
import { BannerSlot } from './components/BannerSlot';
import { toLocalDateKey } from './components/EarningsChart';
import { EarnSection, normalizeAdUrl } from './components/EarnSection';
import { PlanPurchaseModal } from './components/PlanPurchaseModal';
import { ReferSection } from './components/ReferSection';
import { SupportSection } from './components/SupportSection';
import { WithdrawSection } from './components/WithdrawSection';
import {
  ActiveInvestmentPlan,
  AppTab,
  CORRECT_ADMIN_PASS,
  DAILY_MAX_ADS,
  DailyEarningsHistoryMap,
  DepositRequest,
  DirectMessage,
  InvestmentPlanOption,
  MIN_RETURN_SECONDS,
  MIN_WITHDRAW,
  ONE_DAY_MS,
  PaymentMethod,
  PublicTransaction,
  REFER_REWARD,
  ReferralRecord,
  REWARD_PER_AD,
  STORAGE_KEYS,
  ToastMessage,
  UserAccount,
  VideoAd,
  WithdrawRequest,
} from './types';

function readStoredNumber(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readOrCreateReferCode(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.MY_REFER_CODE);
    if (existing) return existing;
    const generated = `AE${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem(STORAGE_KEYS.MY_REFER_CODE, generated);
    return generated;
  } catch {
    return `AE${Math.floor(100000 + Math.random() * 900000)}`;
  }
}

function readInitialAppliedReferCode(myCode: string): string {
  try {
    let applied = localStorage.getItem(STORAGE_KEYS.APPLIED_REFER_CODE) ?? '';
    const urlParams = new URLSearchParams(window.location.search);
    const refFromUrl = urlParams.get('ref')?.trim();
    if (refFromUrl && !applied && refFromUrl !== myCode) {
      applied = refFromUrl;
      localStorage.setItem(STORAGE_KEYS.APPLIED_REFER_CODE, applied);
    }
    return applied;
  } catch {
    return '';
  }
}

function readStoredAds(): VideoAd[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEO_ADS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is VideoAd =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.link === 'string' &&
        typeof item.id === 'number'
    );
  } catch {
    return [];
  }
}

function readStoredRequests(): WithdrawRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WITHDRAW_REQUESTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, idx) => ({
      id: typeof item?.id === 'number' ? item.id : Date.now() + idx,
      method: item?.method === 'Nagad' ? 'Nagad' : 'bKash',
      number: String(item?.number ?? ''),
      amount: Number(item?.amount ?? 0),
      date: String(item?.date ?? new Date().toLocaleDateString()),
    }));
  } catch {
    return [];
  }
}

function readStoredUserAccount(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_ACCOUNT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.name === 'string' &&
      parsed.name.trim() &&
      typeof parsed.phone === 'string'
    ) {
      return {
        name: parsed.name,
        phone: parsed.phone,
        senderNo: String(parsed.senderNo ?? ''),
        trxId: String(parsed.trxId ?? ''),
        createdAt:
          typeof parsed.createdAt === 'number' &&
          Number.isFinite(parsed.createdAt)
            ? parsed.createdAt
            : Date.now(),
        isDepositApproved: Boolean(parsed.isDepositApproved),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function readStoredDepositRequests(): DepositRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEPOSIT_REQUESTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is DepositRequest =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.name === 'string'
      )
      .map((item, idx) => ({
        id: typeof item.id === 'number' ? item.id : Date.now() + idx,
        name: item.name,
        phone: String(item.phone ?? ''),
        senderNo: String(item.senderNo ?? ''),
        trxId: String(item.trxId ?? ''),
        date: String(
          item.date ?? new Date().toLocaleString('bn-BD', { hour12: true })
        ),
        planId:
          item.planId === 'starter' || item.planId === 'pro'
            ? item.planId
            : undefined,
        planName:
          typeof item.planName === 'string' ? item.planName : undefined,
        planPrice:
          typeof item.planPrice === 'number' ? item.planPrice : undefined,
        dailyIncome:
          typeof item.dailyIncome === 'number' ? item.dailyIncome : undefined,
      }));
  } catch {
    return [];
  }
}

function readStoredActivePlans(): ActiveInvestmentPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLANS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ActiveInvestmentPlan =>
        typeof item === 'object' &&
        item !== null &&
        (item.id === 'starter' || item.id === 'pro') &&
        typeof item.dailyIncome === 'number'
    );
  } catch {
    return [];
  }
}

function readUrlReferParam(): string {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref')?.trim() ?? '';
  } catch {
    return '';
  }
}

function readStoredPublicTransactions(): PublicTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PUBLIC_TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is PublicTransaction =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.user === 'string'
      )
      .map((item, idx) => ({
        id: typeof item.id === 'number' ? item.id : Date.now() + idx,
        user: item.user,
        method: item.method === 'Nagad' ? 'Nagad' : 'bKash',
        amount: Number(item.amount ?? 0),
        date: String(
          item.date ?? new Date().toLocaleString('bn-BD', { hour12: true })
        ),
      }));
  } catch {
    return [];
  }
}

function readStoredMessages(): DirectMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIRECT_MESSAGES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is DirectMessage =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.text === 'string'
      )
      .map((item, idx) => ({
        id: typeof item.id === 'number' ? item.id : Date.now() + idx,
        name: String(item.name ?? ''),
        phone: String(item.phone ?? ''),
        text: item.text,
        time: String(
          item.time ?? new Date().toLocaleString('bn-BD', { hour12: true })
        ),
      }));
  } catch {
    return [];
  }
}

function readStoredReferralRecords(): ReferralRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REFERRAL_RECORDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is ReferralRecord =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.referCode === 'string'
      )
      .map((item, idx) => ({
        id: typeof item.id === 'number' ? item.id : Date.now() + idx,
        name: String(item.name ?? 'ইউজার'),
        phone: String(item.phone ?? ''),
        referCode: item.referCode,
        joinedDate: String(
          item.joinedDate ?? new Date().toLocaleDateString('bn-BD')
        ),
        hasWatchedAd: Boolean(item.hasWatchedAd),
      }));
  } catch {
    return [];
  }
}

function readDailyWatchedCount(): number {
  try {
    const todayStr = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem(STORAGE_KEYS.AD_WATCH_DATE);
    if (savedDate && savedDate !== todayStr) {
      localStorage.setItem(STORAGE_KEYS.AD_WATCH_DATE, todayStr);
      localStorage.setItem(STORAGE_KEYS.DAILY_WATCHED_COUNT, '0');
      return 0;
    }
    if (!savedDate) {
      localStorage.setItem(STORAGE_KEYS.AD_WATCH_DATE, todayStr);
    }
    return readStoredNumber(STORAGE_KEYS.DAILY_WATCHED_COUNT, 0);
  } catch {
    return 0;
  }
}

function readStoredEarningsHistory(todayWatched: number): DailyEarningsHistoryMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_EARNINGS_HISTORY);
    const parsed: DailyEarningsHistoryMap = raw ? JSON.parse(raw) : {};
    const safeMap: DailyEarningsHistoryMap =
      parsed && typeof parsed === 'object' ? { ...parsed } : {};

    const todayKey = toLocalDateKey(new Date());
    if (todayWatched > 0 && !safeMap[todayKey]) {
      safeMap[todayKey] = {
        ads: todayWatched,
        earnings: todayWatched * REWARD_PER_AD,
      };
      localStorage.setItem(
        STORAGE_KEYS.DAILY_EARNINGS_HISTORY,
        JSON.stringify(safeMap)
      );
    }
    return safeMap;
  } catch {
    return {};
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('earn');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    readStoredUserAccount()
  );
  const [nowTimestamp, setNowTimestamp] = useState<number>(() => Date.now());
  const [urlReferParam] = useState<string>(() => readUrlReferParam());
  const [balance, setBalance] = useState<number>(() =>
    readStoredNumber(STORAGE_KEYS.BALANCE, 0)
  );
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>(() =>
    readStoredDepositRequests()
  );
  const [activePlans, setActivePlans] = useState<ActiveInvestmentPlan[]>(() =>
    readStoredActivePlans()
  );
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] =
    useState<InvestmentPlanOption | null>(null);
  const [videoAds, setVideoAds] = useState<VideoAd[]>(() => readStoredAds());
  const [requests, setRequests] = useState<WithdrawRequest[]>(() =>
    readStoredRequests()
  );
  const [publicTransactions, setPublicTransactions] = useState<
    PublicTransaction[]
  >(() => readStoredPublicTransactions());
  const [userMessages, setUserMessages] = useState<DirectMessage[]>(() =>
    readStoredMessages()
  );
  const [topBanner, setTopBanner] = useState<string>(
    () => localStorage.getItem(STORAGE_KEYS.TOP_BANNER) ?? ''
  );
  const [bottomBanner, setBottomBanner] = useState<string>(
    () => localStorage.getItem(STORAGE_KEYS.BOTTOM_BANNER) ?? ''
  );
  const [dailyWatchedCount, setDailyWatchedCount] = useState<number>(() =>
    readDailyWatchedCount()
  );
  const [earningsHistory, setEarningsHistory] =
    useState<DailyEarningsHistoryMap>(() =>
      readStoredEarningsHistory(readDailyWatchedCount())
    );

  const [myReferCode] = useState<string>(() => readOrCreateReferCode());
  const [completedRefers, setCompletedRefers] = useState<number>(() =>
    readStoredNumber(STORAGE_KEYS.COMPLETED_REFERS, 0)
  );
  const [appliedReferCode, setAppliedReferCode] = useState<string>(() =>
    readInitialAppliedReferCode(readOrCreateReferCode())
  );
  const [isReferCompletedByMe, setIsReferCompletedByMe] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEYS.IS_REFER_COMPLETED_BY_ME) === 'true'
  );
  const [referralRecords, setReferralRecords] = useState<ReferralRecord[]>(() =>
    readStoredReferralRecords()
  );

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const appliedReferRef = useRef(appliedReferCode);
  const isReferDoneRef = useRef(isReferCompletedByMe);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    appliedReferRef.current = appliedReferCode;
  }, [appliedReferCode]);

  useEffect(() => {
    isReferDoneRef.current = isReferCompletedByMe;
  }, [isReferCompletedByMe]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const showToast = useCallback(
    (text: string, tone: ToastMessage['tone'] = 'neutral') => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      setToast({ id: Date.now(), text, tone });
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 3500);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const syncTodayRollover = useCallback((): number => {
    const todayStr = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem(STORAGE_KEYS.AD_WATCH_DATE);
    if (savedDate !== todayStr) {
      localStorage.setItem(STORAGE_KEYS.AD_WATCH_DATE, todayStr);
      localStorage.setItem(STORAGE_KEYS.DAILY_WATCHED_COUNT, '0');
      setDailyWatchedCount(0);
      return 0;
    }
    return dailyWatchedCount;
  }, [dailyWatchedCount]);

  const verifyAdCompletionOnReturn = useCallback(() => {
    const rawStart = localStorage.getItem(STORAGE_KEYS.PENDING_AD_START_TIME);
    if (!rawStart) return;

    const savedStart = parseInt(rawStart, 10);
    localStorage.removeItem(STORAGE_KEYS.PENDING_AD_START_TIME);
    if (!Number.isFinite(savedStart)) return;

    const elapsedSeconds = (Date.now() - savedStart) / 1000;
    if (elapsedSeconds < MIN_RETURN_SECONDS) {
      showToast('অ্যাড সম্পূর্ণ না দেখে ফিরে আসায় ১০ টাকা যোগ হয়নি!', 'warning');
      return;
    }

    const now = new Date();
    const todayStr = now.toLocaleDateString();
    const todayKey = toLocalDateKey(now);

    const savedDate = localStorage.getItem(STORAGE_KEYS.AD_WATCH_DATE);
    const currentDailyCount =
      savedDate === todayStr
        ? readStoredNumber(STORAGE_KEYS.DAILY_WATCHED_COUNT, 0)
        : 0;

    if (currentDailyCount >= DAILY_MAX_ADS) {
      showToast('আজকের ১৫০টি অ্যাড দেখা পূর্ণ হয়েছে!', 'warning');
      return;
    }

    const nextCount = currentDailyCount + 1;
    localStorage.setItem(STORAGE_KEYS.AD_WATCH_DATE, todayStr);
    localStorage.setItem(STORAGE_KEYS.DAILY_WATCHED_COUNT, String(nextCount));
    setDailyWatchedCount(nextCount);

    let rewardEarned = REWARD_PER_AD;
    const shouldCompleteRefer =
      Boolean(appliedReferRef.current) && !isReferDoneRef.current;

    if (shouldCompleteRefer) {
      const completedCode = appliedReferRef.current;
      const activePhone = currentUserRef.current?.phone ?? '';
      isReferDoneRef.current = true;
      setIsReferCompletedByMe(true);
      localStorage.setItem(STORAGE_KEYS.IS_REFER_COMPLETED_BY_ME, 'true');

      setReferralRecords((prev) => {
        let updatedOne = false;
        const next = prev.map((rec) => {
          if (
            !updatedOne &&
            !rec.hasWatchedAd &&
            rec.referCode === completedCode &&
            (!activePhone || rec.phone === activePhone)
          ) {
            updatedOne = true;
            return { ...rec, hasWatchedAd: true };
          }
          return rec;
        });
        if (updatedOne) {
          localStorage.setItem(
            STORAGE_KEYS.REFERRAL_RECORDS,
            JSON.stringify(next)
          );
        }
        return next;
      });

      setCompletedRefers((prev) => {
        const nextRefers = prev + 1;
        localStorage.setItem(STORAGE_KEYS.COMPLETED_REFERS, String(nextRefers));
        return nextRefers;
      });

      rewardEarned += REFER_REWARD;
      showToast(
        'অ্যাড ৳১০ + রেফার কমপ্লিট বোনাস ৳৩০০ যোগ হয়েছে!',
        'success'
      );
    } else {
      showToast(
        `অ্যাড দেখা সম্পন্ন! একাউন্টে ৳${REWARD_PER_AD} যোগ হয়েছে (${nextCount}/${DAILY_MAX_ADS})`,
        'success'
      );
    }

    setBalance((prevBalance) => {
      const nextBalance = prevBalance + rewardEarned;
      localStorage.setItem(STORAGE_KEYS.BALANCE, String(nextBalance));
      return nextBalance;
    });

    setEarningsHistory((prevHistory) => {
      const prevEntry = prevHistory[todayKey] ?? { ads: 0, earnings: 0 };
      const nextHistory: DailyEarningsHistoryMap = {
        ...prevHistory,
        [todayKey]: {
          ads: prevEntry.ads + 1,
          earnings: prevEntry.earnings + REWARD_PER_AD,
        },
      };
      localStorage.setItem(
        STORAGE_KEYS.DAILY_EARNINGS_HISTORY,
        JSON.stringify(nextHistory)
      );
      return nextHistory;
    });
  }, [showToast]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setNowTimestamp(Date.now());
      if (document.visibilityState === 'visible') {
        verifyAdCompletionOnReturn();
      }
    };
    const handleFocus = () => {
      setNowTimestamp(Date.now());
      verifyAdCompletionOnReturn();
    };

    const trialInterval = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 60000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(trialInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [verifyAdCompletionOnReturn]);

  const isAccountLocked = Boolean(
    currentUser &&
      !currentUser.isDepositApproved &&
      nowTimestamp - currentUser.createdAt > ONE_DAY_MS
  );

  const nextAdLink =
    videoAds.length > 0
      ? videoAds[currentAdIndex % videoAds.length].link
      : null;

  const handlePlayAd = useCallback(
    (_link: string) => {
      if (isAccountLocked) {
        showToast('একাউন্ট লক! অ্যাডমিনের সাথে মেসেজে যোগাযোগ করুন।', 'error');
        return;
      }
      const currentCount = syncTodayRollover();
      if (currentCount >= DAILY_MAX_ADS) {
        showToast('আজকের ১৫০টি অ্যাড দেখা পূর্ণ হয়েছে!', 'warning');
        return;
      }
      localStorage.setItem(
        STORAGE_KEYS.PENDING_AD_START_TIME,
        String(Date.now())
      );
    },
    [isAccountLocked, showToast, syncTodayRollover]
  );

  const handleStartRandomAd = useCallback(() => {
    if (isAccountLocked) {
      showToast(
        'আপনার একাউন্ট লক করা আছে! অ্যাডমিনের কাছে মেসেজ দিন।',
        'error'
      );
      return;
    }
    const currentCount = syncTodayRollover();
    if (currentCount >= DAILY_MAX_ADS) {
      showToast('আজকের সর্বোচ্চ ১৫০টি অ্যাড দেখা শেষ!', 'warning');
      return;
    }
    if (videoAds.length === 0) {
      showToast('বর্তমানে কোনো অ্যাড চালু নেই!', 'warning');
      return;
    }
    const ad = videoAds[currentAdIndex % videoAds.length];
    setCurrentAdIndex((prev) => prev + 1);
    handlePlayAd(ad.link);
  }, [
    currentAdIndex,
    handlePlayAd,
    isAccountLocked,
    showToast,
    syncTodayRollover,
    videoAds,
  ]);

  const handleCopyReferCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(myReferCode);
      showToast(`রেফার কোড কপি হয়েছে: ${myReferCode}`, 'success');
    } catch {
      showToast(`আপনার রেফার কোড: ${myReferCode}`);
    }
  }, [myReferCode, showToast]);

  const handleShareReferLink = useCallback(async () => {
    const baseUrl = window.location.href.split('?')[0];
    const shareUrl = `${baseUrl}?ref=${myReferCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AdEarn Pro - অ্যাড দেখে ইনকাম',
          text: `আমার রেফার কোড (${myReferCode}) দিয়ে জয়েন করুন এবং প্রতিদিন অ্যাড দেখে ইনকাম করুন!`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share dismissed or unsupported in iframe
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('রেফার লিংক কপি হয়েছে! বন্ধুদের শেয়ার করুন।', 'success');
    } catch {
      showToast(`রেফার লিংক: ${shareUrl}`);
    }
  }, [myReferCode, showToast]);

  const handleApplyReferCode = useCallback(
    (code: string): boolean => {
      if (!code) {
        showToast('সঠিক রেফার কোড লিখুন!', 'warning');
        return false;
      }
      if (code === myReferCode) {
        showToast('নিজের রেফার কোড নিজে ব্যবহার করা যাবে না!', 'error');
        return false;
      }
      if (appliedReferCode) {
        showToast('আপনি ইতিমধ্যে একটি রেফার কোড ব্যবহার করেছেন!', 'warning');
        return false;
      }

      setAppliedReferCode(code);
      appliedReferRef.current = code;
      localStorage.setItem(STORAGE_KEYS.APPLIED_REFER_CODE, code);

      setReferralRecords((prev) => {
        const activePhone = currentUser?.phone ?? '';
        const alreadyExists = prev.some(
          (rec) =>
            rec.referCode === code &&
            (activePhone ? rec.phone === activePhone : true)
        );
        if (alreadyExists) return prev;
        const nextRecord: ReferralRecord = {
          id: Date.now(),
          name: currentUser?.name ?? 'নতুন ইউজার',
          phone: activePhone,
          referCode: code,
          joinedDate: new Date().toLocaleDateString('bn-BD'),
          hasWatchedAd: isReferCompletedByMe,
        };
        const next = [nextRecord, ...prev];
        localStorage.setItem(
          STORAGE_KEYS.REFERRAL_RECORDS,
          JSON.stringify(next)
        );
        return next;
      });

      showToast(
        'রেফার কোড যুক্ত হয়েছে! ১টি অ্যাড সম্পূর্ণ দেখলে ৳৩০০ বোনাস পাবেন।',
        'success'
      );
      return true;
    },
    [appliedReferCode, currentUser, isReferCompletedByMe, myReferCode, showToast]
  );

  const handleSignup = useCallback(
    (
      name: string,
      phone: string,
      senderNo: string,
      trxId: string,
      referCode: string
    ): boolean => {
      if (!name || phone.length < 11 || !senderNo || !trxId) {
        showToast('সব তথ্য সঠিকভাবে পূরণ করুন!', 'warning');
        return false;
      }

      const createdAt = Date.now();
      const newUser: UserAccount = {
        name,
        phone,
        senderNo,
        trxId,
        createdAt,
        isDepositApproved: false,
      };
      setCurrentUser(newUser);
      currentUserRef.current = newUser;
      setNowTimestamp(createdAt);
      localStorage.setItem(STORAGE_KEYS.USER_ACCOUNT, JSON.stringify(newUser));

      const newDepositReq: DepositRequest = {
        id: createdAt,
        name,
        phone,
        senderNo,
        trxId,
        date: new Date().toLocaleString('bn-BD', { hour12: true }),
      };
      const nextDeposits = [newDepositReq, ...depositRequests];
      setDepositRequests(nextDeposits);
      localStorage.setItem(
        STORAGE_KEYS.DEPOSIT_REQUESTS,
        JSON.stringify(nextDeposits)
      );

      const effectiveReferCode = (referCode || appliedReferCode).trim();
      if (effectiveReferCode && effectiveReferCode !== myReferCode) {
        if (!appliedReferCode) {
          setAppliedReferCode(effectiveReferCode);
          appliedReferRef.current = effectiveReferCode;
          localStorage.setItem(
            STORAGE_KEYS.APPLIED_REFER_CODE,
            effectiveReferCode
          );
        }

        setReferralRecords((prev) => {
          const alreadyExists = prev.some(
            (rec) =>
              rec.referCode === effectiveReferCode && rec.phone === phone
          );
          if (alreadyExists) return prev;
          const nextRecord: ReferralRecord = {
            id: createdAt,
            name,
            phone,
            referCode: effectiveReferCode,
            joinedDate: new Date(createdAt).toLocaleDateString('bn-BD'),
            hasWatchedAd: false,
          };
          const next = [nextRecord, ...prev];
          localStorage.setItem(
            STORAGE_KEYS.REFERRAL_RECORDS,
            JSON.stringify(next)
          );
          return next;
        });
      }

      showToast(
        'ডিপোজিট বিকাশ সেন্ড মানি রিকোয়েস্ট জমা হয়েছে! ১ দিনের ফ্রি ট্রায়াল চালু হলো।',
        'success'
      );
      return true;
    },
    [appliedReferCode, depositRequests, myReferCode, showToast]
  );

  const handleApproveDeposit = useCallback(
    (id: number) => {
      const target = depositRequests.find((req) => req.id === id);
      if (target && currentUser && currentUser.phone === target.phone) {
        const updatedUser: UserAccount = {
          ...currentUser,
          isDepositApproved: true,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem(
          STORAGE_KEYS.USER_ACCOUNT,
          JSON.stringify(updatedUser)
        );
      }

      if (target && target.planId) {
        const planId = target.planId;
        setActivePlans((prev) => {
          if (prev.some((p) => p.id === planId)) return prev;
          const activated: ActiveInvestmentPlan = {
            id: planId,
            planName: target.planName ?? planId,
            price: target.planPrice ?? 499,
            dailyIncome: target.dailyIncome ?? 500,
            activatedAt: Date.now(),
            lastClaimDate: '',
          };
          const nextPlans = [...prev, activated];
          localStorage.setItem(
            STORAGE_KEYS.ACTIVE_PLANS,
            JSON.stringify(nextPlans)
          );
          return nextPlans;
        });
      }

      const nextDeposits = depositRequests.filter((req) => req.id !== id);
      setDepositRequests(nextDeposits);
      localStorage.setItem(
        STORAGE_KEYS.DEPOSIT_REQUESTS,
        JSON.stringify(nextDeposits)
      );
      showToast(
        target?.planId
          ? `${target.planName ?? 'প্ল্যান'} এপ্রুভ ও সচল করা হয়েছে!`
          : 'ইউজারের ৪৯৯ টাকা ডিপোজিট এপ্রুভ ও একাউন্ট পার্মানেন্ট সচল করা হয়েছে!',
        'success'
      );
    },
    [currentUser, depositRequests, showToast]
  );

  const handleSelectPlan = useCallback(
    (plan: InvestmentPlanOption) => {
      if (isAccountLocked) {
        showToast(
          'একাউন্ট লক! প্ল্যান কিনতে অ্যাডমিনের সাথে যোগাযোগ করুন।',
          'error'
        );
        return;
      }
      setSelectedPlanForPurchase(plan);
    },
    [isAccountLocked, showToast]
  );

  const handleConfirmPlanPurchase = useCallback(
    (
      plan: InvestmentPlanOption,
      senderNo: string,
      trxId: string
    ): boolean => {
      if (senderNo.length < 11 || !trxId) {
        showToast('সঠিক বিকাশ নাম্বার এবং TrxID দিন!', 'warning');
        return false;
      }

      const newReq: DepositRequest = {
        id: Date.now(),
        name: currentUser?.name ?? 'ইউজার',
        phone: currentUser?.phone ?? senderNo,
        senderNo,
        trxId,
        date: new Date().toLocaleString('bn-BD', { hour12: true }),
        planId: plan.id,
        planName: plan.planName,
        planPrice: plan.price,
        dailyIncome: plan.dailyIncome,
      };
      const nextDeposits = [newReq, ...depositRequests];
      setDepositRequests(nextDeposits);
      localStorage.setItem(
        STORAGE_KEYS.DEPOSIT_REQUESTS,
        JSON.stringify(nextDeposits)
      );

      showToast(
        `${plan.titleBn} (৳${plan.price}) রিকোয়েস্ট পাঠানো হয়েছে! অ্যাডমিন যাচাইয়ের পর সচল হবে।`,
        'success'
      );
      return true;
    },
    [currentUser, depositRequests, showToast]
  );

  const handleClaimPlanIncome = useCallback(
    (planId: 'starter' | 'pro') => {
      if (isAccountLocked) {
        showToast(
          'একাউন্ট লক! আয় সংগ্রহ করতে অ্যাডমিনের সাথে যোগাযোগ করুন।',
          'error'
        );
        return;
      }
      const targetPlan = activePlans.find((p) => p.id === planId);
      if (!targetPlan) return;

      const todayKey = toLocalDateKey(new Date());
      if (targetPlan.lastClaimDate === todayKey) {
        showToast('আজকের প্ল্যান ইনকাম ইতিমধ্যে সংগ্রহ করা হয়েছে!', 'warning');
        return;
      }

      const nextPlans = activePlans.map((p) =>
        p.id === planId ? { ...p, lastClaimDate: todayKey } : p
      );
      setActivePlans(nextPlans);
      localStorage.setItem(
        STORAGE_KEYS.ACTIVE_PLANS,
        JSON.stringify(nextPlans)
      );

      setBalance((prev) => {
        const nextBalance = prev + targetPlan.dailyIncome;
        localStorage.setItem(STORAGE_KEYS.BALANCE, String(nextBalance));
        return nextBalance;
      });

      setEarningsHistory((prevHistory) => {
        const prevEntry = prevHistory[todayKey] ?? { ads: 0, earnings: 0 };
        const nextHistory: DailyEarningsHistoryMap = {
          ...prevHistory,
          [todayKey]: {
            ads: prevEntry.ads,
            earnings: prevEntry.earnings + targetPlan.dailyIncome,
          },
        };
        localStorage.setItem(
          STORAGE_KEYS.DAILY_EARNINGS_HISTORY,
          JSON.stringify(nextHistory)
        );
        return nextHistory;
      });

      showToast(
        `${targetPlan.planName} থেকে দৈনিক ৳${targetPlan.dailyIncome} ব্যালেন্সে যুক্ত হয়েছে!`,
        'success'
      );
    },
    [activePlans, isAccountLocked, showToast]
  );

  const handleWithdrawSubmit = useCallback(
    (method: PaymentMethod, number: string, amount: number): boolean => {
      if (isAccountLocked) {
        showToast(
          'একাউন্ট লক! উইথড্র করতে অ্যাডমিনের সাথে যোগাযোগ করুন।',
          'error'
        );
        return false;
      }
      if (!number || number.length < 11) {
        showToast('সঠিক ১১ ডিজিটের নাম্বার দিন!', 'warning');
        return false;
      }
      if (Number.isNaN(amount) || amount < MIN_WITHDRAW) {
        showToast('সর্বনিম্ন ৩০০০ টাকা হলে উইথড্র করা যাবে!', 'warning');
        return false;
      }
      if (amount > balance) {
        showToast('একাউন্টে পর্যাপ্ত ব্যালেন্স নেই!', 'error');
        return false;
      }

      const nextBalance = balance - amount;
      setBalance(nextBalance);
      localStorage.setItem(STORAGE_KEYS.BALANCE, String(nextBalance));

      const nextRequest: WithdrawRequest = {
        id: Date.now(),
        method,
        number,
        amount,
        date: new Date().toLocaleString('bn-BD', { hour12: true }),
      };
      const nextRequests = [...requests, nextRequest];
      setRequests(nextRequests);
      localStorage.setItem(
        STORAGE_KEYS.WITHDRAW_REQUESTS,
        JSON.stringify(nextRequests)
      );

      showToast('৩০০০+ টাকার উইথড্র রিকোয়েস্ট পাঠানো হয়েছে!', 'success');
      return true;
    },
    [balance, isAccountLocked, requests, showToast]
  );

  const handleSendDirectMessage = useCallback(
    (name: string, phone: string, text: string): boolean => {
      if (!name || !phone || !text) {
        showToast('নাম, নাম্বার এবং মেসেজ সঠিকভাবে লিখুন!', 'warning');
        return false;
      }

      const newMsg: DirectMessage = {
        id: Date.now(),
        name,
        phone,
        text,
        time: new Date().toLocaleString('bn-BD', { hour12: true }),
      };
      const nextMessages = [newMsg, ...userMessages];
      setUserMessages(nextMessages);
      localStorage.setItem(
        STORAGE_KEYS.DIRECT_MESSAGES,
        JSON.stringify(nextMessages)
      );
      showToast('আপনার মেসেজ অ্যাডমিনের কাছে পাঠানো হয়েছে!', 'success');
      return true;
    },
    [showToast, userMessages]
  );

  const handleDeleteMessage = useCallback(
    (id: number) => {
      const nextMessages = userMessages.filter((m) => m.id !== id);
      setUserMessages(nextMessages);
      localStorage.setItem(
        STORAGE_KEYS.DIRECT_MESSAGES,
        JSON.stringify(nextMessages)
      );
      showToast('মেসেজ ডিলিট করা হয়েছে।');
    },
    [showToast, userMessages]
  );

  const handleClearAllMessages = useCallback(() => {
    setUserMessages([]);
    localStorage.setItem(STORAGE_KEYS.DIRECT_MESSAGES, JSON.stringify([]));
    showToast('সব মেসেজ মুছে ফেলা হয়েছে।');
  }, [showToast]);

  const handleAdminLogin = useCallback(
    (password: string): boolean => {
      if (password === CORRECT_ADMIN_PASS) {
        setIsAdminAuthenticated(true);
        showToast('অ্যাডমিন প্যানেলে স্বাগতম!', 'success');
        return true;
      }
      showToast('ভুল পাসওয়ার্ড!', 'error');
      return false;
    },
    [showToast]
  );

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    showToast('লগআউট সম্পন্ন হয়েছে।');
  }, [showToast]);

  const handleSaveVideoAds = useCallback(
    (bulkText: string): boolean => {
      const trimmed = bulkText.trim();
      if (!trimmed) {
        showToast('আপনার অ্যাডের লিংক দিন!', 'warning');
        return false;
      }
      const lines = trimmed.split('\n');
      const additions: VideoAd[] = [];
      const baseTime = Date.now();
      lines.forEach((line, idx) => {
        let clean = line.trim();
        if (clean) {
          if (!/^https?:\/\//i.test(clean)) {
            clean = `https://${clean}`;
          }
          additions.push({ id: baseTime + idx, link: clean });
        }
      });

      if (additions.length === 0) {
        showToast('বৈধ কোনো অ্যাড লিংক পাওয়া যায়নি!', 'warning');
        return false;
      }

      const nextAds = [...videoAds, ...additions];
      setVideoAds(nextAds);
      localStorage.setItem(STORAGE_KEYS.VIDEO_ADS, JSON.stringify(nextAds));
      showToast(`সফলভাবে ${additions.length}টি অ্যাড যুক্ত হয়েছে!`, 'success');
      return true;
    },
    [showToast, videoAds]
  );

  const handleDeleteVideoAd = useCallback(
    (id: number) => {
      const nextAds = videoAds.filter((ad) => ad.id !== id);
      setVideoAds(nextAds);
      localStorage.setItem(STORAGE_KEYS.VIDEO_ADS, JSON.stringify(nextAds));
      showToast('অ্যাড ডিলিট করা হয়েছে।');
    },
    [showToast, videoAds]
  );

  const handleClearAllVideoAds = useCallback(() => {
    setVideoAds([]);
    localStorage.setItem(STORAGE_KEYS.VIDEO_ADS, JSON.stringify([]));
    showToast('সব অ্যাড মুছে ফেলা হয়েছে।');
  }, [showToast]);

  const handleSaveBanners = useCallback(
    (top: string, bottom: string) => {
      const cleanTop = top.trim();
      const cleanBottom = bottom.trim();
      setTopBanner(cleanTop);
      setBottomBanner(cleanBottom);
      localStorage.setItem(STORAGE_KEYS.TOP_BANNER, cleanTop);
      localStorage.setItem(STORAGE_KEYS.BOTTOM_BANNER, cleanBottom);
      showToast('ব্যানার অ্যাড আপডেট করা হয়েছে!', 'success');
    },
    [showToast]
  );

  const handleCompleteRequest = useCallback(
    (id: number) => {
      const targetReq = requests.find((req) => req.id === id);
      const nextRequests = requests.filter((req) => req.id !== id);
      setRequests(nextRequests);
      localStorage.setItem(
        STORAGE_KEYS.WITHDRAW_REQUESTS,
        JSON.stringify(nextRequests)
      );

      if (targetReq) {
        const maskedNumber =
          targetReq.number.length >= 8
            ? `${targetReq.number.slice(0, 5)}***${targetReq.number.slice(-3)}`
            : targetReq.number;
        const newPublicTx: PublicTransaction = {
          id: Date.now(),
          user: maskedNumber,
          method: targetReq.method,
          amount: targetReq.amount,
          date: new Date().toLocaleString('bn-BD', { hour12: true }),
        };
        const nextPublicTx = [newPublicTx, ...publicTransactions];
        setPublicTransactions(nextPublicTx);
        localStorage.setItem(
          STORAGE_KEYS.PUBLIC_TRANSACTIONS,
          JSON.stringify(nextPublicTx)
        );
      }

      showToast('পেমেন্ট পেইড ও লাইভ হিস্ট্রিতে যুক্ত করা হয়েছে!', 'success');
    },
    [publicTransactions, requests, showToast]
  );

  const handleAddPublicTransaction = useCallback(
    (user: string, method: PaymentMethod, amount: number): boolean => {
      if (!user || Number.isNaN(amount) || amount <= 0) {
        showToast('ইউজারের তথ্য ও সঠিক টাকার পরিমাণ দিন!', 'warning');
        return false;
      }
      const newTx: PublicTransaction = {
        id: Date.now(),
        user,
        method,
        amount,
        date: new Date().toLocaleString('bn-BD', { hour12: true }),
      };
      const nextTx = [newTx, ...publicTransactions];
      setPublicTransactions(nextTx);
      localStorage.setItem(
        STORAGE_KEYS.PUBLIC_TRANSACTIONS,
        JSON.stringify(nextTx)
      );
      showToast('নতুন ট্রানজেকশন পাবলিশ করা হয়েছে!', 'success');
      return true;
    },
    [publicTransactions, showToast]
  );

  const handleDeletePublicTransaction = useCallback(
    (id: number) => {
      const nextTx = publicTransactions.filter((tx) => tx.id !== id);
      setPublicTransactions(nextTx);
      localStorage.setItem(
        STORAGE_KEYS.PUBLIC_TRANSACTIONS,
        JSON.stringify(nextTx)
      );
      showToast('ট্রানজেকশন ডিলিট করা হয়েছে।');
    },
    [publicTransactions, showToast]
  );

  const dailyProgressPct = Math.min(
    100,
    Math.round((dailyWatchedCount / DAILY_MAX_ADS) * 100)
  );
  const isLimitReached = dailyWatchedCount >= DAILY_MAX_ADS;
  const isActionDisabled = isLimitReached || isAccountLocked;
  const canLaunchDirectly = !isActionDisabled && nextAdLink !== null;

  const extraBottomPadding = bottomBanner.trim()
    ? 'pb-32 lg:pb-20'
    : 'pb-24 lg:pb-12';

  return (
    <div className={`min-h-screen bg-[#0b0f19] text-slate-50 ${extraBottomPadding}`}>
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-5 py-2.5 rounded-full bg-[#1e293b] text-white text-xs sm:text-sm font-semibold shadow-xl border border-white/15 whitespace-nowrap max-w-[92vw] truncate"
        >
          {toast.text}
        </div>
      )}

      {!currentUser && (
        <AuthOverlay
          initialReferCode={
            urlReferParam && urlReferParam !== myReferCode ? urlReferParam : ''
          }
          onSignup={handleSignup}
        />
      )}

      {selectedPlanForPurchase && (
        <PlanPurchaseModal
          plan={selectedPlanForPurchase}
          onClose={() => setSelectedPlanForPurchase(null)}
          onConfirmPurchase={handleConfirmPlanPurchase}
        />
      )}

      <BannerSlot content={topBanner} position="top" />

      <header className="bg-[#131c31] text-white border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 sm:gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('earn')}
            className="text-lg font-bold tracking-tight whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5"
          >
            <img
              src="/assets/aistudio/a_clean_high_gloss_premium_3d_metallic_logo_icon_b06517fd.png"
              alt="AdEarn Pro Logo"
              className="w-9 h-9 rounded-full object-cover border-[1.5px] border-amber-400 shrink-0"
            />
            <span className="bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
              AdEarn Pro
            </span>
          </button>

          <nav
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300"
            aria-label="প্রধান নেভিগেশন"
          >
            <button
              type="button"
              onClick={() => setActiveTab('earn')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'earn'
                  ? 'text-white underline underline-offset-8 decoration-amber-400 decoration-2'
                  : 'hover:text-white'
              }`}
            >
              ইনকাম
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('refer')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'refer'
                  ? 'text-white underline underline-offset-8 decoration-amber-400 decoration-2'
                  : 'hover:text-white'
              }`}
            >
              রেফার
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('withdraw')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'withdraw'
                  ? 'text-white underline underline-offset-8 decoration-amber-400 decoration-2'
                  : 'hover:text-white'
              }`}
            >
              উইথড্র
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'support'
                  ? 'text-white underline underline-offset-8 decoration-amber-400 decoration-2'
                  : 'hover:text-white'
              }`}
            >
              মেসেজ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'admin'
                  ? 'text-white underline underline-offset-8 decoration-amber-400 decoration-2'
                  : 'hover:text-white'
              }`}
            >
              অ্যাডমিন
            </button>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <span
              id="userProfileBadge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 whitespace-nowrap max-w-[150px] truncate"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {currentUser ? currentUser.name : 'ইউজার'}
              </span>
            </span>

            {canLaunchDirectly ? (
              <a
                href={normalizeAdUrl(nextAdLink)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleStartRandomAd()}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors bg-amber-400 hover:bg-amber-300 text-slate-950"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>অ্যাড দেখুন (৳{REWARD_PER_AD})</span>
              </a>
            ) : (
              <button
                type="button"
                disabled={isActionDisabled}
                onClick={handleStartRandomAd}
                className={`hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActionDisabled
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {isAccountLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>
                  {isAccountLocked
                    ? 'একাউন্ট লক'
                    : isLimitReached
                      ? 'লিমিট শেষ'
                      : `অ্যাড দেখুন (৳${REWARD_PER_AD})`}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 lg:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white p-6 shadow-xl border border-white/15">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-300 mb-2">
              <span>মোট অর্জিত ব্যালেন্স</span>
              <span className="text-amber-400 font-semibold tabular-nums">
                আজকের অ্যাড: {dailyWatchedCount} / {DAILY_MAX_ADS}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-2xl font-bold text-amber-400">৳</span>
              <span className="text-4xl font-bold tracking-tight font-mono-num">
                {balance.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 mb-4">
              <div className="w-full h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${dailyProgressPct}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs text-slate-300 tabular-nums">
              <span>প্রতি অ্যাড: ৳{REWARD_PER_AD} · রেফার: ৳{REFER_REWARD}</span>
              <span>মিনিমাম উইথড্র: ৳{MIN_WITHDRAW}</span>
            </div>
          </div>

          <div className="hidden lg:block bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>সিকিউরড সিস্টেম ও নিয়মাবলি</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li>প্রতিটি অ্যাড কমপক্ষে ১২ সেকেন্ড সম্পূর্ণ দেখে ফিরে এলে ৳১০ যোগ হবে।</li>
              <li>প্রতিদিন সর্বোচ্চ ১৫০টি অ্যাড দেখে আয় করা যাবে।</li>
              <li>রেফার কোড দিয়ে জয়েন করে ১টি অ্যাড সম্পূর্ণ দেখলে ৳৩০০ বোনাস পাবেন।</li>
              <li>ব্যালেন্স ৩০০০ টাকা হলে বিকাশ বা নগদে উত্তোলন করা যাবে।</li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-7 space-y-5">
          {isAccountLocked && (
            <div
              id="accountLockedBanner"
              role="alert"
              className="rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white p-5 border border-white/20 shadow-lg shadow-rose-950/40 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-base font-bold mb-1.5">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>আপনার ফ্রি ট্রায়াল মেয়াদ শেষ!</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-100 leading-relaxed mb-3.5">
                ৪৯৯ টাকা ডিপোজিট ভেরিফাইড না হওয়ায় আপনার একাউন্টটি লক করা হয়েছে। কাজ করতে বা উইথড্র করতে অ্যাডমিনের সাথে মেসেজে যোগাযোগ করুন।
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('support')}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>অ্যাডমিনকে মেসেজ দিন</span>
              </button>
            </div>
          )}

          {activeTab === 'earn' && (
            <EarnSection
              videoAds={videoAds}
              dailyWatchedCount={dailyWatchedCount}
              earningsHistory={earningsHistory}
              nextAdLink={nextAdLink}
              isAccountLocked={isAccountLocked}
              activePlans={activePlans}
              pendingPlanIds={depositRequests
                .map((req) => req.planId)
                .filter((id): id is 'starter' | 'pro' => Boolean(id))}
              onStartRandomAd={handleStartRandomAd}
              onPlayAd={handlePlayAd}
              onSelectPlan={handleSelectPlan}
              onClaimPlanIncome={handleClaimPlanIncome}
            />
          )}

          {activeTab === 'refer' && (
            <ReferSection
              myReferCode={myReferCode}
              completedRefers={completedRefers}
              appliedReferCode={appliedReferCode}
              isReferCompletedByMe={isReferCompletedByMe}
              referredUsers={referralRecords.filter(
                (rec) => rec.referCode === myReferCode
              )}
              onCopyCode={handleCopyReferCode}
              onShareLink={handleShareReferLink}
              onApplyCode={handleApplyReferCode}
            />
          )}

          {activeTab === 'withdraw' && (
            <WithdrawSection
              balance={balance}
              requests={requests}
              publicTransactions={publicTransactions}
              onSubmitRequest={handleWithdrawSubmit}
            />
          )}

          {activeTab === 'support' && (
            <SupportSection
              messages={userMessages}
              onSendMessage={handleSendDirectMessage}
            />
          )}

          {activeTab === 'admin' && (
            <AdminSection
              isAuthenticated={isAdminAuthenticated}
              depositRequests={depositRequests}
              videoAds={videoAds}
              topBanner={topBanner}
              bottomBanner={bottomBanner}
              requests={requests}
              publicTransactions={publicTransactions}
              messages={userMessages}
              onLogin={handleAdminLogin}
              onLogout={handleAdminLogout}
              onApproveDeposit={handleApproveDeposit}
              onSaveVideoAds={handleSaveVideoAds}
              onDeleteVideoAd={handleDeleteVideoAd}
              onClearAllVideoAds={handleClearAllVideoAds}
              onSaveBanners={handleSaveBanners}
              onCompleteRequest={handleCompleteRequest}
              onAddPublicTransaction={handleAddPublicTransaction}
              onDeletePublicTransaction={handleDeletePublicTransaction}
              onDeleteMessage={handleDeleteMessage}
              onClearAllMessages={handleClearAllMessages}
            />
          )}
        </div>
      </main>

      <BannerSlot content={bottomBanner} position="bottom" />

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#131c31]/95 backdrop-blur-md border-t border-white/10 grid grid-cols-5 items-center px-1"
        aria-label="মোবাইল নেভিগেশন"
      >
        <button
          type="button"
          onClick={() => setActiveTab('earn')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'earn'
              ? 'text-blue-400 bg-blue-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>ইনকাম</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refer')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'refer'
              ? 'text-blue-400 bg-blue-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span>রেফার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('withdraw')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'withdraw'
              ? 'text-blue-400 bg-blue-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>উইথড্র</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'support'
              ? 'text-blue-400 bg-blue-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>মেসেজ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'admin'
              ? 'text-blue-400 bg-blue-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>অ্যাডমিন</span>
        </button>
      </nav>
    </div>
  );
}
