import React from 'react';
import { useStore } from '../context/StoreContext';
import { Gamepad2, ShieldCheck, Zap, Award, Users, HeartHandshake } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export const AboutUsView: React.FC = () => {
  const { siteSettings } = useStore();

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 text-right space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          درباره فروشگاه {siteSettings.storeName}
        </h1>
        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          مرجع تخصصی خرید مستقیم CP، UC، جم، گیفت کارت‌های اورجینال و اکانت‌های پریمیوم بین‌المللی با سریع‌ترین زمان تحویل و تضمین ارزان‌ترین قیمت در ایران
        </p>
      </div>

      {/* Story & Philosophy */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-loose">
        <h2 className="text-xl font-bold text-white border-r-4 border-amber-400 pr-3">
          داستان ما و رسالت {siteSettings.storeName}
        </h2>
        <p>
          فروشگاه <strong>{siteSettings.storeName}</strong> با هدف رفع محدودیت‌های پرداخت بین‌المللی برای گیمرها و کاربران ایرانی شکل گرفت. جامعه گیمینگ کشور همواره به دلیل تحریم‌ها و عدم دسترسی به کارت‌های بین‌المللی، در خرید جم و آیتم‌های بازی با مشکلات عدیده، تاخیرهای چندروزه و قیمت‌های غیرمنصفانه مواجه بود.
        </p>
        <p>
          تیم {siteSettings.storeName} با گردهم آوردن جمعی از گیمرهای حرفه‌ای و متخصصان حوزه فین‌تک، سامانه‌ای خودکار و تمام‌عیار را پایه‌ریزی کرد که سفارش‌ها را در کمتر از ۱۰ الی ۱۵ دقیقه به صورت کاملاً قانونی و بدون واسطه به اکانت بازی کاربران واریز می‌نماید.
        </p>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { number: '+۱۵۰,۰۰۰', label: 'سفارش موفق تکمیل شده' },
          { number: '+۴۵,۰۰۰', label: 'کاربر وفادار و راضی' },
          { number: 'زیر ۱۰ دقیقه', label: 'میانگین زمان واریز' },
          { number: '۲۴/۷', label: 'پشتیبانی آنلاین و تلفنی' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <span className="text-xl sm:text-2xl font-black text-amber-400 block mb-1">
              {s.number}
            </span>
            <span className="text-xs text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">سرعت مافوق تصور</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            استفاده از سیستم‌های اتوماسیون هوشمند شارژ اکانت، فرآیند واریز را به حداقل زمان ممکن تقلیل داده است.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">۱۰۰٪ شارژ قانونی</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            تمامی پرداخت‌ها مستقیماً با مسترکارت و ویزاکارت‌های بانکی معتبر انجام شده و امنیت اکانت شما تضمین شده است.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">پشتیبانی متعهد</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            تیم پشتیبانی ما حتی در روزهای تعطیل آماده پاسخگویی و رفع سریع هرگونه مشکل در سفارشات شماست.
          </p>
        </div>
      </div>
    </div>
  );
};
