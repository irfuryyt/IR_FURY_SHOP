import React from 'react';
import { useStore } from '../context/StoreContext';
import { Gift, ArrowLeft, Zap, ShieldCheck } from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/helpers';

export const GiftCardsSection: React.FC = () => {
  const { products, setCurrentView } = useStore();

  const giftCardProducts = products.filter((p) => p.category === 'giftcards');

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm mb-1">
              <Gift className="w-4 h-4" />
              <span>کدهای دیجیتال معتبر با تحویل آنی و اتوماتیک</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              انواع گیفت کارت‌های اورجینال
            </h2>
          </div>

          <button
            onClick={() => setCurrentView('giftcards')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group self-start sm:self-auto cursor-pointer"
          >
            <span>مشاهده همه گیفت کارت‌ها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {giftCardProducts.map((card) => {
            const minPrice = card.packages?.[0]?.price || 0;
            return (
              <div
                key={card.id}
                id={`giftcard-item-${card.id}`}
                onClick={() => setCurrentView('product-detail', card.id)}
                className="group relative flex flex-col justify-between bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 mb-4 border border-slate-800/80">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-transparent" />

                    <div className="absolute top-2.5 right-2.5 bg-indigo-600/90 border border-indigo-400/30 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-extrabold text-white">
                      کد اسکن شده
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {card.shortDescription}
                  </p>

                  {/* Available Denominations Preview */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {card.packages.slice(0, 3).map((pkg) => (
                      <span
                        key={pkg.id}
                        className="bg-slate-950 text-[10px] text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {pkg.amount}
                      </span>
                    ))}
                    {card.packages.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{toPersianDigits(card.packages.length - 3)} بسته دیگر
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">شروع قیمت:</span>
                    <span className="text-xs sm:text-sm font-extrabold text-indigo-400">
                      {formatToman(minPrice)}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-slate-800 group-hover:bg-indigo-600 border border-slate-700/60 text-slate-200 group-hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
                    <span>خرید گیفت کارت</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
