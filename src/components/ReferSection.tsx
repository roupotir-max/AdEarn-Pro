import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Share2,
  Ticket,
  Users,
} from 'lucide-react';
import { REFER_REWARD, ReferralRecord } from '../types';

type ReferFilter = 'all' | 'pending' | 'completed';

interface ReferSectionProps {
  myReferCode: string;
  completedRefers: number;
  appliedReferCode: string;
  isReferCompletedByMe: boolean;
  referredUsers: ReferralRecord[];
  onCopyCode: () => void;
  onShareLink: () => void;
  onApplyCode: (code: string) => boolean;
}

function formatMaskedPhone(phone: string): string {
  const clean = phone.trim();
  if (!clean) return 'নাম্বার নেই';
  if (clean.length >= 8) {
    return `${clean.slice(0, 5)}***${clean.slice(-3)}`;
  }
  return clean;
}

export const ReferSection: React.FC<ReferSectionProps> = ({
  myReferCode,
  completedRefers,
  appliedReferCode,
  isReferCompletedByMe,
  referredUsers,
  onCopyCode,
  onShareLink,
  onApplyCode,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferFilter>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onApplyCode(inputCode.trim())) {
      setInputCode('');
    }
  };

  const pendingUsers = referredUsers.filter((user) => !user.hasWatchedAd);
  const completedUsers = referredUsers.filter((user) => user.hasWatchedAd);
  const effectiveCompletedCount = Math.max(completedRefers, completedUsers.length);
  const referEarnedTotal = effectiveCompletedCount * REFER_REWARD;

  const filteredUsers =
    statusFilter === 'pending'
      ? pendingUsers
      : statusFilter === 'completed'
        ? completedUsers
        : referredUsers;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white text-center shadow-lg shadow-emerald-950/40 border border-white/15">
        <p className="text-xs font-semibold text-emerald-100 mb-2 flex items-center justify-center gap-1.5">
          <Gift className="w-4 h-4 shrink-0" />
          <span>আনলিমিটেড বোনাস</span>
        </p>
        <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2 [text-wrap:balance]">
          প্রতি রেফারে ৩০০ টাকা বোনাস!
        </h2>
        <p className="text-sm text-emerald-50/90 leading-relaxed mb-5">
          বন্ধুদের রেফার করুন। আপনার বন্ধু আপনার কোডে জয়েন করে কমপক্ষে ১টি অ্যাড সম্পূর্ণ দেখলেই সাথে সাথে ৩০০ টাকা বোনাস পাবেন!
        </p>

        <div className="bg-black/25 border border-dashed border-white/40 rounded-xl p-3.5 mb-4 flex items-center justify-between gap-3">
          <span className="text-lg sm:text-xl font-bold tracking-wider text-amber-300 font-mono-num">
            {myReferCode}
          </span>
          <button
            type="button"
            onClick={onCopyCode}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 shrink-0" />
            <span>কোড কপি</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onShareLink}
          className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 shrink-0" />
          <span>রেফার লিংক শেয়ার করুন</span>
        </button>
      </div>

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
        <div className="pb-3.5 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white">
            আপনার রেফারেল তথ্য
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-3.5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono-num tabular-nums">
              {effectiveCompletedCount}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">
              সফল রেফার
            </p>
          </div>

          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-3.5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono-num tabular-nums">
              {pendingUsers.length}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">
              অ্যাড বাকি
            </p>
          </div>

          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-3.5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-400 font-mono-num tabular-nums">
              ৳{referEarnedTotal}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">
              রেফার আয়
            </p>
          </div>
        </div>

        {appliedReferCode && (
          <div className="mt-4">
            {isReferCompletedByMe ? (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  রেফার কোড ({appliedReferCode}) কমপ্লিট হয়েছে এবং ৳{REFER_REWARD} বোনাস যুক্ত হয়েছে!
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-semibold">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  রেফার কোড ({appliedReferCode}) যুক্ত হয়েছে। রেফার কমপ্লিট করতে কমপক্ষে ১টি অ্যাড সম্পূর্ণ দেখুন।
                </span>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>রেফারেল তালিকা</span>
          </h3>
          <span className="text-xs font-medium text-slate-400 tabular-nums">
            মোট জয়েন: {referredUsers.length} · বাকি: {pendingUsers.length}
          </span>
        </div>

        <div
          className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl mb-4 border border-white/5"
          role="tablist"
          aria-label="রেফারেল স্ট্যাটাস ফিল্টার"
        >
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            className={`min-h-[38px] px-2 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer tabular-nums ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            সবাই ({referredUsers.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
            className={`min-h-[38px] px-2 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer tabular-nums ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            অ্যাড বাকি ({pendingUsers.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'completed'}
            onClick={() => setStatusFilter('completed')}
            className={`min-h-[38px] px-2 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer tabular-nums ${
              statusFilter === 'completed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            সম্পন্ন ({completedUsers.length})
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/90 text-[11px] sm:text-xs font-semibold text-slate-400">
                <th className="py-3 px-3.5">ইউজার</th>
                <th className="py-3 px-3">জয়েনের তারিখ</th>
                <th className="py-3 px-3.5 text-right">অ্যাড স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-7 px-4 text-center text-xs sm:text-sm text-slate-400"
                  >
                    {referredUsers.length === 0
                      ? 'এখনো কেউ আপনার রেফার কোড ব্যবহার করে জয়েন করেনি।'
                      : statusFilter === 'pending'
                        ? 'সবার অ্যাড দেখা সম্পন্ন হয়েছে — কারো অ্যাড বাকি নেই।'
                        : 'এখনো কেউ অ্যাড দেখা সম্পন্ন করেনি।'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-3.5 align-middle">
                      <p className="font-semibold text-white truncate max-w-[135px] sm:max-w-[190px]">
                        {user.name || 'নতুন ইউজার'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono-num tabular-nums mt-0.5">
                        {formatMaskedPhone(user.phone)}
                      </p>
                    </td>
                    <td className="py-3 px-3 align-middle text-xs text-slate-300 tabular-nums whitespace-nowrap">
                      {user.joinedDate}
                    </td>
                    <td className="py-3 px-3.5 align-middle text-right">
                      {user.hasWatchedAd ? (
                        <div className="inline-flex flex-col items-end">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>অ্যাড সম্পন্ন</span>
                          </span>
                          <span className="text-[11px] text-emerald-300/80 tabular-nums mt-0.5">
                            +৳{REFER_REWARD} বোনাস
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-end">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>অ্যাড দেখা বাকি</span>
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            ১টি অ্যাড বাকি
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {!appliedReferCode && (
        <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
          <div className="flex items-center gap-2 pb-3.5 border-b border-white/10 mb-4">
            <Ticket className="w-4 h-4 text-blue-400 shrink-0" />
            <h3 className="text-base font-bold text-white">
              রেফার কোড ব্যবহার করুন
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-3.5">
            আপনি কারো রেফার কোডে জয়েন করলে কোডটি নিচে বসান। ১টি অ্যাড সম্পূর্ণ দেখলেই রেফার কমপ্লিট হয়ে যাবে।
          </p>
          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="রেফার কোড লিখুন"
              className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              সাবমিট
            </button>
          </form>
        </section>
      )}
    </div>
  );
};
