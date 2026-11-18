import React, { useState } from 'react';
import { Check, Copy, Gem, Rocket, X } from 'lucide-react';
import { DEPOSIT_BKASH_NUMBER, InvestmentPlanOption } from '../types';

interface PlanPurchaseModalProps {
  plan: InvestmentPlanOption;
  onClose: () => void;
  onConfirmPurchase: (
    plan: InvestmentPlanOption,
    senderNo: string,
    trxId: string
  ) => boolean;
}

export const PlanPurchaseModal: React.FC<PlanPurchaseModalProps> = ({
  plan,
  onClose,
  onConfirmPurchase,
}) => {
  const [senderNo, setSenderNo] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopyBkashNumber = async () => {
    try {
      await navigator.clipboard.writeText(DEPOSIT_BKASH_NUMBER);
      setCopiedNumber(true);
      window.setTimeout(() => setCopiedNumber(false), 2000);
    } catch {
      setCopiedNumber(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onConfirmPurchase(plan, senderNo.trim(), trxId.trim());
    if (ok) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${plan.titleBn} পেমেন্ট`}
    >
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-[#131c31] to-[#1e293b] border border-white/15 p-5 sm:p-6 shadow-2xl my-auto">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
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
            <div>
              <h3 className="text-lg font-bold text-white">{plan.titleBn}</h3>
              <p className="text-xs text-slate-400 tabular-nums">
                মূল্য: ৳{plan.price} · দৈনিক আয়: ৳{plan.dailyIncome} · মেয়াদ:{' '}
                {plan.durationDays} দিন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="min-h-[40px] min-w-[40px] rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3.5 mb-4 text-center">
          <p className="text-xs font-semibold text-amber-300 leading-relaxed">
            প্ল্যানটি চালু করতে নিচের বিকাশ পার্সোনাল নাম্বারে{' '}
            <span className="font-bold text-amber-200 tabular-nums">
              ৳{plan.price} টাকা সেন্ড মানি
            </span>{' '}
            করুন।
          </p>
          <div className="inline-flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 mt-2">
            <code className="text-sm font-bold text-emerald-400 tracking-wider font-mono-num">
              {DEPOSIT_BKASH_NUMBER}
            </code>
            <button
              type="button"
              onClick={handleCopyBkashNumber}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedNumber ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি</span>
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="planSenderNo"
              className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1"
            >
              যে বিকাশ নাম্বার থেকে টাকা পাঠিয়েছেন
            </label>
            <input
              id="planSenderNo"
              type="tel"
              inputMode="numeric"
              value={senderNo}
              onChange={(e) => setSenderNo(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 tabular-nums focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="planTrxId"
              className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1"
            >
              ট্রানজেকশন আইডি (TrxID)
            </label>
            <input
              id="planTrxId"
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="যেমন: 9N7X..."
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className={`flex-1 min-h-[46px] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                plan.accent === 'amber'
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <span>পেমেন্ট রিকোয়েস্ট পাঠান</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
