import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const TermsView: React.FC = () => {
  const { siteSettings } = useStore();

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 text-right space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
          <FileText className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          قوانین و مقررات فروشگاه {siteSettings.storeName}
        </h1>
        <p className="text-xs text-slate-400">
          آخرین به‌روزرسانی: تابستان ۱۴۰۴ / ۲۰۲۶
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-loose">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>۱. شرایط کلی و صحت اطلاعات کاربر</span>
          </h2>
          <p>
            کاربر موظف است هنگام ثبت سفارش، اطلاعات مربوط به اکانت بازی (مانند Player ID، سرور و ...) و همچنین شماره همراه فعال را به طور دقیق وارد نماید. مسئولیت هرگونه اشتباه در وارد کردن آیدی که منجر به شارژ اکانت دیگری شود بر عهده خریدار خواهد بود.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>۲. زمان‌بندی و تحویل سفارشات</span>
          </h2>
          <p>
            سفارش‌های اتوماتیک و کدهای گیفت کارت به صورت آنی تحویل داده می‌شوند. سفارش‌های نیازمند واریز دستی یا ورود به اکانت معمولاً بین ۵ تا ۳۰ دقیقه انجام می‌پذیرند. در زمان آپدیت بازی‌ها یا ایونت‌های سنگین ممکن است تا حداکثر ۲ ساعت زمان ببرد.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>۳. احراز هویت و پرداخت امن</span>
          </h2>
          <p>
            کلیه پرداخت‌ها باید با کارت‌های بانکی عضو شبکه شتاب و متعلق به شخص خریدار انجام شود. فروشگاه {siteSettings.storeName} در صورت لزوم و برای مبالغ بالا جهت جلوگیری از فیشینگ حق درخواست احراز هویت اولیه را برای خود محفوظ می‌دارد.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>۴. شرایط بازگشت وجه و کنسلی</span>
          </h2>
          <p>
            در صورتی که سفارش هنوز واریز نشده باشد، خریدار می‌تواند با هماهنگی پشتیبانی درخواست استرداد وجه نماید که در کمتر از ۲۴ ساعت کاری به همان شماره شبای پرداختی واریز خواهد شد. پس از واریز جم یا تحویل کد گیفت کارت، امکان کنسلی وجود ندارد.
          </p>
        </section>
      </div>
    </div>
  );
};
