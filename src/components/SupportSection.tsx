import React, { useState } from 'react';
import { Clock, MessageSquare, Send } from 'lucide-react';
import { DirectMessage } from '../types';

interface SupportSectionProps {
  messages: DirectMessage[];
  onSendMessage: (name: string, phone: string, text: string) => boolean;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  messages,
  onSendMessage,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onSendMessage(name.trim(), phone.trim(), text.trim());
    if (ok) {
      setName('');
      setPhone('');
      setText('');
    }
  };

  return (
    <div className="space-y-5">
      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />
          <h2 className="text-lg font-bold text-white">
            অ্যাডমিনকে ডাইরেক্ট মেসেজ দিন
          </h2>
        </div>

        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          পেমেন্ট বা যেকোনো সমস্যার জন্য সরাসরি অ্যাডমিনের কাছে আপনার বার্তা পাঠান।
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="msgSenderName"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              আপনার নাম
            </label>
            <input
              id="msgSenderName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="msgSenderPhone"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              আপনার মোবাইল নাম্বার
            </label>
            <input
              id="msgSenderPhone"
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
              htmlFor="msgContent"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              আপনার মেসেজ
            </label>
            <textarea
              id="msgContent"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="এখানে আপনার মেসেজটি বিস্তারিত লিখুন..."
              className="w-full p-3.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors resize-y"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>অ্যাডমিনের কাছে মেসেজ পাঠান</span>
          </button>
        </form>
      </section>

      <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>আপনার পাঠানো মেসেজসমূহ</span>
          </h3>
          <span className="text-xs font-medium text-slate-400 tabular-nums">
            {messages.length}টি
          </span>
        </div>

        {messages.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            আপনি এখনো কোনো মেসেজ পাঠাননি।
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white">
                    প্রাপক: অ্যাডমিন
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    পাঠানো হয়েছে
                  </span>
                </div>
                <p className="text-sm text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-white/5 break-words">
                  {m.text}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 tabular-nums">
                  {m.time}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
