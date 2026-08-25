import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { siteSettings } = useStore();

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 text-right space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          سیاست حفظ حریم خصوصی و امنیت کاربران
        </h1>
        <p className="text-xs text-slate-400">
          حفظ حریم خصوصی و امنیت حساب‌های کاربری اولویت اصلی ماست
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-loose">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>امنیت اطلاعات ورود به اکانت</span>
          </h2>
          <p>
            در مواردی که برای شارژ نیاز به ورود به اکانت است، تمامی اطلاعات به صورت رمزنگاری‌شده در سرورهای امن نگهداری شده و بلافاصله پس از انجام موفقیت‌آمیز سفارش، نشست‌ها (Sessions) خروج داده می‌شوند.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>عدم اشتراک‌گذاری داده‌ها با اشخاص ثالث</span>
          </h2>
          <p>
            شماره تماس، ایمیل و سوابق خرید شما تنها جهت ارسال فاکتور، پیگیری و هماهنگی پشتیبانی استفاده شده و تحت هیچ شرایطی در اختیار شخص یا شرکت ثالثی قرار نخواهد گرفت.
          </p>
        </section>
      </div>
    </div>
  );
};
