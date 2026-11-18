import React, { useState } from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2, History, Wallet } from 'lucide-react';
import {
  MIN_WITHDRAW,
  PaymentMethod,
  PublicTransaction,
  WithdrawRequest,
} from '../types';

interface WithdrawSectionProps {
  balance: number;
  requests: WithdrawRequest[];
  publicTransactions: PublicTransaction[];
  onSubmitRequest: (method: PaymentMethod, number: string, amount: number) => boolean;
}

export const WithdrawSection: React.FC<WithdrawSectionProps> = ({
  balance,
  requests,
  publicTransactions,
  onSubmitRequest,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountInput);
    const success = onSubmitRequest(method, accountNumber.trim(), parsedAmount);
    if (success) {
      setAccountNumber('');
      setAmountInput('');
    }
  };

  const remainingToMin = Math.max(0, MIN_WITHDRAW - balance);

  return (
    <div className="space-y-5">
      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
          <h2 className="text-lg font-bold text-white">
            টাকা উত্তোলন করুন
          </h2>
          <span className="text-xs font-semibold text-slate-300 tabular-nums">
            ব্যালেন্স: <span className="text-amber-400">৳{balance.toFixed(2)}</span>
          </span>
        </div>

        <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-3.5 mb-5 flex items-start gap-2.5 text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            সর্বনিম্ন ৩০০০ টাকা হলে বিকাশ বা নগদে পেমেন্ট নিতে পারবেন। এর নিচে উইথড্র করা যাবে না।
            {remainingToMin > 0 && (
              <span className="block mt-1 text-amber-300 font-semibold tabular-nums">
                উইথড্র যোগ্য হতে আরও ৳{remainingToMin.toFixed(0)} প্রয়োজন।
              </span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              পেমেন্ট মাধ্যম
            </label>
            <select
              id="paymentMethod"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="bKash">বিকাশ পার্সোনাল</option>
              <option value="Nagad">নগদ পার্সোনাল</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              একাউন্ট নাম্বার
            </label>
            <input
              id="accountNumber"
              type="tel"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 tabular-nums focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="withdrawAmount"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              টাকার পরিমাণ (সর্বনিম্ন ৩০০০)
            </label>
            <input
              id="withdrawAmount"
              type="number"
              min={MIN_WITHDRAW}
              step="1"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="3000"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 tabular-nums focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>উইথড্র রিকোয়েস্ট পাঠান</span>
          </button>
        </form>
      </section>

      {requests.length > 0 && (
        <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>অপেক্ষমাণ রিকোয়েস্ট</span>
            </h3>
            <span className="text-xs font-medium text-slate-400 tabular-nums">
              {requests.length}টি
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {requests.map((req) => (
              <div
                key={req.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white tabular-nums">
                    {req.method === 'bKash' ? 'বিকাশ' : 'নগদ'} · {req.number}
                  </p>
                  <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                    তারিখ: {req.date} · প্রক্রিয়াধীন
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-400 tabular-nums shrink-0">
                  ৳{req.amount}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/10 mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>লাইভ ট্রানজেকশন হিস্ট্রি</span>
          </h3>
          <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ভেরিফাইড</span>
          </span>
        </div>

        {publicTransactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            কোনো ট্রানজেকশন পাওয়া যায়নি।
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {publicTransactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {tx.user}
                  </p>
                  <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                    {tx.method} · {tx.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-emerald-400 font-mono-num tabular-nums">
                    ৳{tx.amount}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-300 inline-flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>পেইড</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
