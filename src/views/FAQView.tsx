import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HelpCircle, ChevronDown, MessageSquare, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQView: React.FC = () => {
  const { faqs, setCurrentView, siteSettings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.includes(searchTerm) ||
      f.answer.includes(searchTerm)
  );

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 text-right space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-lg">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          سوالات متداول و راهنمای {siteSettings.storeName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          پاسخ تشریحی به تمامی پرسش‌های پرتکرار مشتریان و گیمرهای گرامی
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجوی سوال یا موضوع مورد نظر..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors shadow-lg"
        />
      </div>

      {/* FAQs list */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-right font-bold text-sm sm:text-base text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80"
                  >
                    <p className="pr-5">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Support CTA */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">پاسخ سوال خود را نیافتید؟</h3>
            <p className="text-xs text-slate-400">تیم پشتیبانی آنلاین ما ۲۴ ساعته در خدمت شماست</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('contact')}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs transition-colors cursor-pointer"
        >
          ارتباط با پشتیبانی
        </button>
      </div>
    </div>
  );
};
