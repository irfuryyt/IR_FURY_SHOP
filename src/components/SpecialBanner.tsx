import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Copy, Check, ArrowLeft, Tag } from 'lucide-react';

export const SpecialBanner: React.FC = () => {
  const { siteSettings, setCurrentView, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  if (!siteSettings.specialBannerActive) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(siteSettings.specialBannerCoupon);
    setCopied(true);
    showToast(`کد تخفیف ${siteSettings.specialBannerCoupon} کپی شد`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-6 sm:p-10 shadow-2xl text-slate-950">
          {/* Background decorative patterns */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-slate-950/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-right">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-slate-950/20 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تخفیف ویژه محصولات بازی - فرصت محدود</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
                {siteSettings.specialBannerTitle}
              </h2>
              <p className="text-sm sm:text-base font-medium opacity-90 leading-relaxed">
                {siteSettings.specialBannerSubtitle}
              </p>
            </div>

            {/* Coupon & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {/* Copy Coupon Box */}
              <div className="flex items-center bg-slate-950/90 text-white rounded-2xl p-1.5 pl-3 border border-slate-900 shadow-lg">
                <div className="px-3 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">کد تخفیف:</span>
                  <span className="text-sm font-black font-mono tracking-wider text-amber-400">
                    {siteSettings.specialBannerCoupon}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-400 p-2.5 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                  title="کپی کد تخفیف"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'کپی شد' : 'کپی'}</span>
                </button>
              </div>

              {/* View Discounts Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('special-offers-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCurrentView('products');
                  }
                }}
                className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>مشاهده تخفیف‌ها</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
