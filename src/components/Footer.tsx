import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Gamepad2,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Instagram,
  ShieldCheck,
  CreditCard,
  Clock,
  Sparkles,
  ArrowUp,
} from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export const Footer: React.FC = () => {
  const { siteSettings, setCurrentView } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020617] border-t border-slate-800/80 pt-16 pb-24 lg:pb-12 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: About Store & Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  {siteSettings.storeName}
                </span>
                <span className="text-xs text-indigo-400 block font-medium">
                  {siteSettings.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              فروشگاه {siteSettings.storeName} به عنوان مرجع تخصصی و رسمی خرید مستقیم ارزهای درون‌برنامه‌ای، سی پی کالاف دیوتی، یوسی پابجی، جم بازی‌ها، اکانت‌های پریمیوم هوش مصنوعی و انواع گیفت کارت‌های اورجینال، بستری سریع، امن و قانونی با ارزان‌ترین قیمت‌ها را برای جامعه گیمرهای ایرانی فراهم آورده است.
            </p>

            {/* Social Media Channels */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://t.me/${siteSettings.telegramUsername}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                title={`کانال تلگرام ${siteSettings.storeName}`}
              >
                <Send className="w-4 h-4 -rotate-45" />
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                title={`پشتیبانی واتس‌اپ ${siteSettings.storeName}`}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`https://instagram.com/${siteSettings.instagramUsername}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                title={`اینستاگرام ${siteSettings.storeName}`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white border-r-2 border-indigo-500 pr-2.5">
              لینک‌های سریع
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  صفحه اصلی
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('products')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  همه محصولات و تخفیف‌ها
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('order-tracking')}
                  className="hover:text-indigo-400 transition-colors text-indigo-400 font-bold"
                >
                  پیگیری آنلاین سفارش
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('blog')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  مجله و اخبار گیمینگ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  سوالات متداول (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  درباره {siteSettings.storeName}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  تماس با ما و شکایات
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white border-r-2 border-indigo-500 pr-2.5">
              دسته‌بندی‌ها
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('product-detail', 'cod-mobile-cp')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  خرید سی پی کالاف دیوتی
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('product-detail', 'pubg-mobile-uc')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  خرید یوسی پابجی موبایل
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('product-detail', 'free-fire-diamonds')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  خرید جم فری فایر
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('product-detail', 'telegram-premium')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  خرید تلگرام پریمیوم
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('product-detail', 'chatgpt-plus')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  خرید ChatGPT Plus
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('product-detail', 'playstation-network-card')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  گیفت کارت پلی استیشن PSN
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('product-detail', 'steam-wallet-card')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  گیفت کارت استیم والت
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Trust Badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-r-2 border-indigo-500 pr-2.5">
              راه‌های ارتباطی
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>تلفن: {toPersianDigits(siteSettings.phone)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-mono text-[11px]">{siteSettings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>ساعات کاری: {siteSettings.workingHours}</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </div>
            </div>

            {/* Trust Badges Mockup */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-400 font-bold mb-2">مجوزها و نمادهای اعتماد:</p>
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center flex-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-300 block font-bold">اینماد دو ستاره</span>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center flex-1">
                  <CreditCard className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-300 block font-bold">شاپرک امن</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            تمامی حقوق مادی و معنوی این وب‌سایت متعلق به فروشگاه <strong className="text-white">{siteSettings.storeName}</strong> می‌باشد. © ۲۰۲۶
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('terms')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              قوانین و مقررات
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('privacy')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              حریم خصوصی
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
            >
              <span>بازگشت به بالا</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
