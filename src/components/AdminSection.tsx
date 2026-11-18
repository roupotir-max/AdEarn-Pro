import React, { useEffect, useState } from 'react';
import { Banknote, Check, Lock, LogOut, Mail, Trash2 } from 'lucide-react';
import {
  AdminSubTab,
  DEPOSIT_FEE,
  DepositRequest,
  DirectMessage,
  PaymentMethod,
  PublicTransaction,
  VideoAd,
  WithdrawRequest,
} from '../types';

interface AdminSectionProps {
  isAuthenticated: boolean;
  depositRequests: DepositRequest[];
  videoAds: VideoAd[];
  topBanner: string;
  bottomBanner: string;
  requests: WithdrawRequest[];
  publicTransactions: PublicTransaction[];
  messages: DirectMessage[];
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  onApproveDeposit: (id: number) => void;
  onSaveVideoAds: (bulkText: string) => boolean;
  onDeleteVideoAd: (id: number) => void;
  onClearAllVideoAds: () => void;
  onSaveBanners: (top: string, bottom: string) => void;
  onCompleteRequest: (id: number) => void;
  onAddPublicTransaction: (
    user: string,
    method: PaymentMethod,
    amount: number
  ) => boolean;
  onDeletePublicTransaction: (id: number) => void;
  onDeleteMessage: (id: number) => void;
  onClearAllMessages: () => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  isAuthenticated,
  depositRequests,
  videoAds,
  topBanner,
  bottomBanner,
  requests,
  publicTransactions,
  messages,
  onLogin,
  onLogout,
  onApproveDeposit,
  onSaveVideoAds,
  onDeleteVideoAd,
  onClearAllVideoAds,
  onSaveBanners,
  onCompleteRequest,
  onAddPublicTransaction,
  onDeletePublicTransaction,
  onDeleteMessage,
  onClearAllMessages,
}) => {
  const [password, setPassword] = useState('');
  const [subTab, setSubTab] = useState<AdminSubTab>('depositTab');
  const [bulkLinks, setBulkLinks] = useState('');
  const [topBannerInput, setTopBannerInput] = useState(topBanner);
  const [bottomBannerInput, setBottomBannerInput] = useState(bottomBanner);
  const [txUser, setTxUser] = useState('');
  const [txMethod, setTxMethod] = useState<PaymentMethod>('bKash');
  const [txAmount, setTxAmount] = useState('');
  const [confirmClearAllAds, setConfirmClearAllAds] = useState(false);
  const [confirmClearAllMsgs, setConfirmClearAllMsgs] = useState(false);

  useEffect(() => {
    setTopBannerInput(topBanner);
  }, [topBanner]);

  useEffect(() => {
    setBottomBannerInput(bottomBanner);
  }, [bottomBanner]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setPassword('');
    }
  };

  const handleSaveAdsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveVideoAds(bulkLinks)) {
      setBulkLinks('');
    }
  };

  const handleSaveBannersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBanners(topBannerInput, bottomBannerInput);
  };

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(txAmount);
    if (onAddPublicTransaction(txUser.trim(), txMethod, parsedAmount)) {
      setTxUser('');
      setTxAmount('');
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-4">
          <Lock className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">অ্যাডমিন প্যানেল</h2>
        </div>

        <p className="text-sm text-slate-400 mb-5">
          শুধুমাত্র অ্যাডমিন পাসওয়ার্ড দিয়ে ভেতরে প্রবেশ করা যাবে।
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="adminPass"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              অ্যাডমিন পাসওয়ার্ড
            </label>
            <input
              id="adminPass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড দিন"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            লগইন করুন
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="bg-[#131c31] rounded-2xl border border-blue-500/40 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
          <h2 className="text-lg font-bold text-blue-400">অ্যাডমিন ড্যাশবোর্ড</h2>
          <button
            type="button"
            onClick={onLogout}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-xl mb-5 border border-white/5">
          <button
            type="button"
            onClick={() => setSubTab('depositTab')}
            className={`min-h-[40px] px-2.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              subTab === 'depositTab'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ডিপোজিট ({depositRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('videoTab')}
            className={`min-h-[40px] px-2.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              subTab === 'videoTab'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            অ্যাড ({videoAds.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('bannerTab')}
            className={`min-h-[40px] px-2.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              subTab === 'bannerTab'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ব্যানার
          </button>
          <button
            type="button"
            onClick={() => setSubTab('txAdminTab')}
            className={`min-h-[40px] px-2.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              subTab === 'txAdminTab'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ট্রানজেকশন
          </button>
        </div>

        {subTab === 'depositTab' && (
          <div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3.5">
              নতুন ইউজারদের {DEPOSIT_FEE} টাকা ডিপোজিট রিকোয়েস্ট (এপ্রুভ করলে একাউন্ট আজীবন সচল হবে):
            </p>

            {depositRequests.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6 bg-slate-900/60 rounded-xl border border-white/5">
                কোনো ডিপোজিট রিকোয়েস্ট নেই।
              </p>
            ) : (
              <div className="divide-y divide-white/10 max-h-[280px] overflow-y-auto">
                {depositRequests.map((req) => (
                  <div
                    key={req.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {req.name}{' '}
                        <span className="text-xs font-semibold text-slate-400 tabular-nums">
                          ({req.phone})
                        </span>
                      </p>
                      <p className="text-xs text-blue-300 font-semibold tabular-nums mt-0.5">
                        {req.planName
                          ? `${req.planName} · ৳${req.planPrice ?? DEPOSIT_FEE}`
                          : `একাউন্ট ডিপোজিট · ৳${DEPOSIT_FEE}`}
                      </p>
                      <p className="text-xs text-amber-300 tabular-nums mt-0.5">
                        সেন্ডার: {req.senderNo} · Trx: <span className="font-bold">{req.trxId}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 tabular-nums mt-0.5">
                        {req.date}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onApproveDeposit(req.id)}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>এপ্রুভ</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {subTab === 'videoTab' && (
          <div>
            <form onSubmit={handleSaveAdsSubmit} className="space-y-3.5">
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার অ্যাড সোর্স থেকে পাওয়া অ্যাডের লিংক এখানে পেস্ট করুন (প্রতি লাইনে একটি করে লিংক)।
              </p>

              <textarea
                value={bulkLinks}
                onChange={(e) => setBulkLinks(e.target.value)}
                rows={4}
                placeholder={'https://your-ad-source.com/link1\nhttps://your-ad-source.com/link2'}
                className="w-full p-3.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors resize-y"
              />

              <button
                type="submit"
                className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                অ্যাডগুলো সেভ করুন
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-sm font-bold text-white tabular-nums">
                  সক্রিয় অ্যাড: {videoAds.length}টি
                </p>

                {videoAds.length > 0 && (
                  <div className="flex items-center gap-2">
                    {confirmClearAllAds ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onClearAllVideoAds();
                            setConfirmClearAllAds(false);
                          }}
                          className="min-h-[36px] px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                        >
                          নিশ্চিত মুছুন
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClearAllAds(false)}
                          className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold whitespace-nowrap cursor-pointer"
                        >
                          বাতিল
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmClearAllAds(true)}
                        className="min-h-[36px] px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold whitespace-nowrap cursor-pointer"
                      >
                        সব মুছুন
                      </button>
                    )}
                  </div>
                )}
              </div>

              {videoAds.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">
                  কোনো অ্যাড বসানো নেই।
                </p>
              ) : (
                <div className="divide-y divide-white/10 max-h-[220px] overflow-y-auto">
                  {videoAds.map((ad, idx) => (
                    <div
                      key={ad.id}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <p className="text-xs text-slate-300 truncate tabular-nums">
                        #{idx + 1} - {ad.link}
                      </p>
                      <button
                        type="button"
                        onClick={() => onDeleteVideoAd(ad.id)}
                        aria-label={`অ্যাড #${idx + 1} ডিলিট করুন`}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {subTab === 'bannerTab' && (
          <form onSubmit={handleSaveBannersSubmit} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              ব্যানার অ্যাডের ডিরেক্ট লিংক বা আইফ্রেম কোড দিন (উপরে ও নিচে অলটাইম চলবে)।
            </p>

            <div>
              <label
                htmlFor="topBannerInput"
                className="block text-sm font-semibold text-slate-300 mb-1.5"
              >
                টপ ব্যানার লিংক / কোড
              </label>
              <input
                id="topBannerInput"
                type="text"
                value={topBannerInput}
                onChange={(e) => setTopBannerInput(e.target.value)}
                placeholder="https://banner-ad-link.com"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="bottomBannerInput"
                className="block text-sm font-semibold text-slate-300 mb-1.5"
              >
                বটম ব্যানার লিংক / কোড
              </label>
              <input
                id="bottomBannerInput"
                type="text"
                value={bottomBannerInput}
                onChange={(e) => setBottomBannerInput(e.target.value)}
                placeholder="https://banner-ad-link.com"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              ব্যানার আপডেট করুন
            </button>
          </form>
        )}

        {subTab === 'txAdminTab' && (
          <div>
            <form onSubmit={handleAddTxSubmit} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                উইথড্র সেকশনে ইউজারদের দেখানোর জন্য লাইভ পেমেন্ট হিস্ট্রি যুক্ত বা ডিলিট করুন।
              </p>

              <div>
                <label
                  htmlFor="adminTxUser"
                  className="block text-sm font-semibold text-slate-300 mb-1.5"
                >
                  ইউজারের নাম বা মাস্কড নাম্বার
                </label>
                <input
                  id="adminTxUser"
                  type="text"
                  value={txUser}
                  onChange={(e) => setTxUser(e.target.value)}
                  placeholder="যেমন: মৃণ্ময় (017***892)"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="adminTxMethod"
                    className="block text-sm font-semibold text-slate-300 mb-1.5"
                  >
                    পেমেন্ট মাধ্যম
                  </label>
                  <select
                    id="adminTxMethod"
                    value={txMethod}
                    onChange={(e) =>
                      setTxMethod(e.target.value as PaymentMethod)
                    }
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="adminTxAmount"
                    className="block text-sm font-semibold text-slate-300 mb-1.5"
                  >
                    টাকার পরিমাণ (৳)
                  </label>
                  <input
                    id="adminTxAmount"
                    type="number"
                    min={1}
                    step="1"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="3500"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 tabular-nums focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Banknote className="w-4 h-4 shrink-0" />
                <span>ট্রানজেকশন পাবলিশ করুন</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-sm font-bold text-white tabular-nums">
                  পাবলিশ করা ট্রানজেকশন ({publicTransactions.length}টি)
                </p>
              </div>

              {publicTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">
                  কোনো ট্রানজেকশন নেই।
                </p>
              ) : (
                <div className="divide-y divide-white/10 max-h-[240px] overflow-y-auto">
                  {publicTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">
                          {tx.user}
                        </p>
                        <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                          <span className="text-emerald-400 font-semibold">
                            ৳{tx.amount}
                          </span>{' '}
                          ({tx.method}) · {tx.date}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeletePublicTransaction(tx.id)}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/10 mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 tabular-nums">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" />
            <span>ইউজারদের মেসেজ ({messages.length})</span>
          </h3>

          {messages.length > 0 && (
            <div className="flex items-center gap-2">
              {confirmClearAllMsgs ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAllMessages();
                      setConfirmClearAllMsgs(false);
                    }}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                  >
                    নিশ্চিত মুছুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAllMsgs(false)}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold whitespace-nowrap cursor-pointer"
                  >
                    বাতিল
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearAllMsgs(true)}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  সব মুছুন
                </button>
              )}
            </div>
          )}
        </div>

        {messages.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            কোনো মেসেজ নেই।
          </p>
        ) : (
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-white">
                      {m.name}
                    </span>
                    <span className="text-xs font-semibold text-blue-400 tabular-nums ml-1.5">
                      ({m.phone})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMessage(m.id)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ডিলিট</span>
                  </button>
                </div>
                <p className="text-sm text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-white/5 break-words">
                  {m.text}
                </p>
                <p className="text-[11px] text-slate-400 text-right mt-2 tabular-nums">
                  {m.time}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <h3 className="text-base font-bold text-white">
            পেমেন্ট রিকোয়েস্ট
          </h3>
          <span className="text-xs font-medium text-slate-400 tabular-nums">
            {requests.length}টি
          </span>
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            কোনো পেমেন্ট রিকোয়েস্ট নেই।
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {requests.map((req) => (
              <div
                key={req.id}
                className="py-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white tabular-nums">
                    {req.method}: {req.number}
                  </p>
                  <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                    <span className="text-emerald-400 font-semibold">
                      ৳{req.amount}
                    </span>{' '}
                    · {req.date}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onCompleteRequest(req.id)}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>পেইড</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
