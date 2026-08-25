import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Flame, Clock, Sparkles } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export const SpecialOffersSection: React.FC = () => {
  const { products } = useStore();

  // Simulated countdown timer (14 hours, 32 mins, 40 secs)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const specialProducts = products.filter((p) => p.specialOffer || p.discountPercent).slice(0, 4);

  return (
    <section id="special-offers-section" className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">پیشنهادات ویژه و شگفت‌انگیز</span>
                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  فرصت محدود
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                تخفیف‌های استثنایی بسته‌های پرطرفدار با تحویل آنی و خودکار
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#020617] border border-slate-800 px-4 py-2 rounded-2xl">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-slate-400 ml-1">زمان باقی‌مانده:</span>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-indigo-300">
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {toPersianDigits(String(timeLeft.hours).padStart(2, '0'))}
              </span>
              <span>:</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {toPersianDigits(String(timeLeft.minutes).padStart(2, '0'))}
              </span>
              <span>:</span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-rose-400">
                {toPersianDigits(String(timeLeft.seconds).padStart(2, '0'))}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {specialProducts.map((product) => (
            <ProductCard key={product.id} product={product} badge="پیشنهاد ویژه" />
          ))}
        </div>
      </div>
    </section>
  );
};
