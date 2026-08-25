import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowLeft, Check, ShieldCheck, Zap } from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/helpers';

export const PremiumSection: React.FC = () => {
  const { products, setCurrentView } = useStore();

  const premiumProducts = products.filter((p) => p.category === 'premium');

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>اشتراک‌های هوش مصنوعی، تلگرام و سرویس‌های کاربردی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              اکانت‌ها و سرویس‌های پریمیوم
            </h2>
          </div>

          <button
            onClick={() => setCurrentView('premium')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group self-start sm:self-auto cursor-pointer"
          >
            <span>مشاهده همه اشتراک‌ها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {premiumProducts.map((item) => {
            const minPrice = item.packages?.[0]?.price || 0;
            return (
              <div
                key={item.id}
                id={`premium-item-${item.id}`}
                onClick={() => setCurrentView('product-detail', item.id)}
                className="group relative flex flex-col justify-between bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 mb-4 border border-slate-800/80">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-transparent" />

                    <div className="absolute top-2.5 right-2.5 bg-indigo-600/90 border border-indigo-400/30 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-extrabold text-white">
                      پریمیوم
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {item.shortDescription}
                  </p>

                  {/* Bullet perks */}
                  <div className="space-y-1.5 mb-4 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span>فعال‌سازی ۱۰۰٪ قانونی و دائمی</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>تحویل سریع {item.deliveryTime}</span>
                    </div>
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
                    <span>خرید اشتراک</span>
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
