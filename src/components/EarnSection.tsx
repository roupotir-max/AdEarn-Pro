import React from 'react';
import { CheckCircle2, Clock, Gem, Lock, Package, Play, Rocket, Tv } from 'lucide-react';
import {
  ActiveInvestmentPlan,
  DAILY_MAX_ADS,
  DailyEarningsHistoryMap,
  DEPOSIT_BKASH_NUMBER,
  INVESTMENT_PLANS,
  InvestmentPlanOption,
  REWARD_PER_AD,
  VideoAd,
} from '../types';
import { EarningsChart, toLocalDateKey } from './EarningsChart';

interface EarnSectionProps {
  videoAds: VideoAd[];
  dailyWatchedCount: number;
  earningsHistory: DailyEarningsHistoryMap;
  nextAdLink: string | null;
  isAccountLocked: boolean;
  activePlans: ActiveInvestmentPlan[];
  pendingPlanIds: Array<'starter' | 'pro'>;
  onStartRandomAd: () => void;
  onPlayAd: (link: string) => void;
  onSelectPlan: (plan: InvestmentPlanOption) => void;
  onClaimPlanIncome: (planId: 'starter' | 'pro') => void;
}

export function normalizeAdUrl(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return '#';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const EarnSection: React.FC<EarnSectionProps> = ({
  videoAds,
  dailyWatchedCount,
  earningsHistory,
  nextAdLink,
  isAccountLocked,
  activePlans,
  pendingPlanIds,
  onStartRandomAd,
  onPlayAd,
  onSelectPlan,
  onClaimPlanIncome,
}) => {
  const isLimitReached = dailyWatchedCount >= DAILY_MAX_ADS;
  const isDisabled = isLimitReached || isAccountLocked;
  const canLaunchDirectly = !isDisabled && nextAdLink !== null;
  const todayKey = toLocalDateKey(new Date());

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg shadow-blue-900/30 border border-white/15">
        <p className="text-xs font-medium text-blue-100 mb-2">
          প্রতিদিন সর্বোচ্চ ১৫০টি অ্যাড
        </p>
        <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2 [text-wrap:balance]">
          প্রতিটা অ্যাড দেখে ১০ টাকা ইনকাম করুন!
        </h2>
        <p className="text-sm text-blue-100/90 leading-relaxed mb-5">
          নিচের বাটনে ট্যাপ করে অ্যাড সম্পূর্ণ দেখলে সাথে সাথে ১০ টাকা অর্জন করুন।
        </p>

        {canLaunchDirectly ? (
          <a
            href={normalizeAdUrl(nextAdLink)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onStartRandomAd()}
            className="w-full min-h-[48px] px-5 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] whitespace-nowrap bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/25"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>অ্যাড দেখুন (৳{REWARD_PER_AD})</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onStartRandomAd}
            disabled={isDisabled}
            className={`w-full min-h-[48px] px-5 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] whitespace-nowrap cursor-pointer ${
              isDisabled
                ? 'bg-slate-600 text-slate-300 cursor-not-allowed active:scale-100'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/25'
            }`}
          >
            {isAccountLocked ? (
              <Lock className="w-4 h-4 shrink-0" />
            ) : (
              <Play className="w-4 h-4 fill-current shrink-0" />
            )}
            <span>
              {isAccountLocked
                ? 'একাউন্ট লক (মেসেজ দিন)'
                : isLimitReached
                  ? 'আজকের ১৫০টি অ্যাড দেখা শেষ'
                  : `অ্যাড দেখুন (৳${REWARD_PER_AD})`}
            </span>
          </button>
        )}
      </div>

      <EarningsChart
        history={earningsHistory}
        todayCount={dailyWatchedCount}
      />

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/10 mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400 shrink-0" />
            <span>প্রিমিয়াম ইনকাম প্ল্যানসমূহ</span>
          </h3>
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
            বিকাশ পেমেন্ট
          </span>
        </div>

        <p className="text-xs sm:text-sm text-amber-300 font-semibold mb-4 leading-relaxed tabular-nums">
          প্ল্যান কিনতে প্রথমে{' '}
          <span className="text-emerald-300 font-mono-num">{DEPOSIT_BKASH_NUMBER}</span>{' '}
          নাম্বারে বিকাশ সেন্ড মানি করুন।
        </p>

        <div className="space-y-3">
          {INVESTMENT_PLANS.map((plan) => {
            const activePlan = activePlans.find((p) => p.id === plan.id);
            const isPending = pendingPlanIds.includes(plan.id);
            const isClaimedToday = activePlan?.lastClaimDate === todayKey;

            return (
              <div
                key={plan.id}
                className={`p-4 rounded-2xl border bg-gradient-to-br from-slate-800 to-[#131c31] transition-colors ${
                  plan.accent === 'amber'
                    ? 'border-amber-500/25 hover:border-amber-400/60'
                    : 'border-white/10 hover:border-blue-500/60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                        plan.accent === 'amber'
                          ? 'bg-amber-400/15 border-amber-400/30 text-amber-400'
                          : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                      }`}
                    >
                      {plan.accent === 'amber' ? (
                        <Gem className="w-5 h-5" />
                      ) : (
                        <Rocket className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-white truncate">
                        {plan.titleBn}
                      </p>
                      <p
                        className={`text-xs font-bold tabular-nums mt-0.5 ${
                          plan.accent === 'amber'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        মূল্য: ৳{plan.price}
                      </p>
                    </div>
                  </div>

                  {activePlan ? (
                    <button
                      type="button"
                      disabled={isClaimedToday}
                      onClick={() => onClaimPlanIncome(plan.id)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isClaimedToday
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        {isClaimedToday
                          ? 'সংগৃহীত'
                          : `৳${plan.dailyIncome} নিন`}
                      </span>
                    </button>
                  ) : isPending ? (
                    <button
                      type="button"
                      disabled
                      className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 bg-amber-500/15 border border-amber-500/30 text-amber-300 cursor-not-allowed"
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>অপেক্ষমাণ</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan)}
                      className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-transform active:scale-95 cursor-pointer ${
                        plan.accent === 'amber'
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-sm shadow-amber-500/25'
                          : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-sm shadow-blue-600/30'
                      }`}
                    >
                      <span>প্ল্যান কিনুন</span>
                    </button>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-slate-300 tabular-nums flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>
                    দৈনিক আয়:{' '}
                    <strong className="text-white">৳{plan.dailyIncome}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-500">
                    ·
                  </span>
                  <span>মেয়াদ: {plan.durationDays} দিন</span>
                  <span aria-hidden="true" className="text-slate-500">
                    ·
                  </span>
                  <span>বিকাশ সেন্ড মানি করে কিনুন</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
        <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white">অ্যাডসমূহ</h3>
          <span className="text-xs font-medium text-slate-400 tabular-nums">
            {videoAds.length}টি উপলব্ধ
          </span>
        </div>

        {videoAds.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-11 h-11 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Tv className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              এখনো কোনো অ্যাড বসানো হয়নি।
            </p>
            <p className="text-xs text-slate-500 mt-1">
              অ্যাডমিন প্যানেল থেকে অ্যাড লিংক যুক্ত করলে এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-0.5">
            {videoAds.map((ad, index) => (
              <div
                key={ad.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-[#131c31] hover:border-blue-500/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white tabular-nums">
                      অ্যাড #{index + 1}
                    </p>
                    <p className="text-xs font-semibold text-emerald-400 tabular-nums mt-0.5">
                      ইনকাম: ৳{REWARD_PER_AD}
                    </p>
                  </div>
                </div>

                {isDisabled ? (
                  <button
                    type="button"
                    disabled
                    className="min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 bg-slate-700 text-slate-400 cursor-not-allowed"
                  >
                    {isAccountLocked && <Lock className="w-3.5 h-3.5 shrink-0" />}
                    <span>{isAccountLocked ? 'লকড' : 'লিমিট শেষ'}</span>
                  </button>
                ) : (
                  <a
                    href={normalizeAdUrl(ad.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onPlayAd(ad.link)}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-transform active:scale-95 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-sm shadow-blue-600/30"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>দেখুন</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
