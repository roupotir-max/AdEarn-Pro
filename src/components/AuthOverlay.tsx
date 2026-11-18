import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Copy, Rocket } from 'lucide-react';
import { DEPOSIT_BKASH_NUMBER } from '../types';

interface AuthOverlayProps {
  initialReferCode: string;
  onSignup: (
    name: string,
    phone: string,
    senderNo: string,
    trxId: string,
    referCode: string
  ) => boolean;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({
  initialReferCode,
  onSignup,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [senderNo, setSenderNo] = useState('');
  const [trxId, setTrxId] = useState('');
  const [referCode, setReferCode] = useState(initialReferCode);
  const [copiedNumber, setCopiedNumber] = useState(false);

  useEffect(() => {
    if (initialReferCode) {
      setReferCode(initialReferCode);
    }
  }, [initialReferCode]);

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
    onSignup(
      name.trim(),
      phone.trim(),
      senderNo.trim(),
      trxId.trim(),
      referCode.trim()
    );
  };

  const isFromReferLink = Boolean(initialReferCode);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0b0f19]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="অ্যাকাউন্ট রেজিস্ট্রেশন ও ডিপোজিট"
    >
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-[#131c31] to-[#1e293b] border border-white/12 p-5 sm:p-6 shadow-2xl my-auto">
        <div className="text-center mb-4">
          <img
            src="/assets/aistudio/a_clean_high_gloss_premium_3d_metallic_logo_icon_b06517fd.png"
            alt="AdEarn Pro Logo"
            className="w-[75px] h-[75px] rounded-full object-cover border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] mx-auto mb-2.5"
          />
          <h2 className="text-xl font-bold text-white">
            AdEarn Pro একাউন্ট রেজিস্ট্রেশন
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            কাজ শুরু করতে ডিপোজিট বিকাশ সেন্ড মানি করুন
          </p>
        </div>

        <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3.5 mb-4 text-center">
          <p className="text-xs font-semibold text-amber-300 leading-relaxed">
            একাউন্ট সচল রাখতে নিচের নাম্বারে{' '}
            <span className="font-bold text-amber-200">
              ডিপোজিট বিকাশ সেন্ড মানি (Send Money)
            </span>{' '}
            করুন।
          </p>
          <p className="text-xs font-bold text-white mt-2 mb-1.5">
            বিকাশ পার্সোনাল নাম্বার (সেন্ড মানি):
          </p>
          <div className="inline-flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5">
            <code className="text-sm font-bold text-emerald-400 tracking-wider font-mono-num">
              {DEPOSIT_BKASH_NUMBER}
            </code>
            <button
              type="button"
              onClick={handleCopyBkashNumber}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              aria-label="বিকাশ নাম্বার কপি করুন"
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
          <p className="text-[11px] text-slate-300 mt-2">
            টাকা পাঠিয়ে নিচের ছকে আপনার নাম্বার ও TrxID দিন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="regUserName"
              className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1"
            >
              আপনার পূর্ণ নাম
            </label>
            <input
              id="regUserName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="regUserPhone"
                className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1"
              >
                আপনার মোবাইল নাম্বার
              </label>
              <input
                id="regUserPhone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 tabular-nums focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="regSenderNumber"
                className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1"
              >
                যে বিকাশ নাম্বার থেকে টাকা পাঠিয়েছেন
              </label>
              <input
                id="regSenderNumber"
                type="tel"
                inputMode="numeric"
                value={senderNo}
                onChange={(e) => setSenderNo(e.target.value)}
                placeholder="016XXXXXXXX"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 tabular-nums focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="regTrxId"
                className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1"
              >
                ট্রানজেকশন আইডি (TrxID)
              </label>
              <input
                id="regTrxId"
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="যেমন: 9N7X..."
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="regReferCode"
                className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1"
              >
                রেফারেল কোড (যদি থাকে)
              </label>
              <input
                id="regReferCode"
                type="text"
                value={referCode}
                readOnly={isFromReferLink}
                onChange={(e) => setReferCode(e.target.value)}
                placeholder="রেফার কোড (ঐচ্ছিক)"
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors ${
                  isFromReferLink ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {isFromReferLink && (
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>রেফারেল লিংক থেকে কোড যুক্ত হয়েছে!</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer"
          >
            <Rocket className="w-4 h-4 shrink-0" />
            <span>ডিপোজিট বিকাশ সেন্ড মানি সম্পন্ন করুন</span>
          </button>
        </form>
      </div>
    </div>
  );
};
