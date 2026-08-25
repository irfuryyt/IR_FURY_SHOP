import React from 'react';
import { Zap, ShieldCheck, Headphones, CircleDollarSign } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      id: 'fast-delivery',
      title: 'تحویل سریع و فوری',
      description: 'سفارش‌ها در کوتاه‌ترین زمان ممکن و به صورت آنی یا زیر ۱۵ دقیقه انجام می‌شوند.',
      icon: Zap,
      color: 'amber',
      accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    },
    {
      id: 'secure-payment',
      title: 'پرداخت امن و مطمئن',
      description: 'پرداخت از طریق تمامی کارت‌های عضو شتاب با درگاه‌های پرداخت رسمی شاپرک.',
      icon: ShieldCheck,
      color: 'emerald',
      accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'support-247',
      title: 'پشتیبانی آنلاین ۲۴/۷',
      description: 'پشتیبانی تخصصی قبل و بعد از خرید از طریق تلگرام، واتس‌اپ و تماس تلفنی.',
      icon: Headphones,
      color: 'sky',
      accentBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    },
    {
      id: 'best-price',
      title: 'بهترین قیمت رقابتی',
      description: 'ارائه نازل‌ترین قیمت‌ها در سراسر وب با تضمین اصالت و قانونی بودن واریزها.',
      icon: CircleDollarSign,
      color: 'purple',
      accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-850 flex flex-col items-start text-right shadow-lg"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-5 ${item.accentBg}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
