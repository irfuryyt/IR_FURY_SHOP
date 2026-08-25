import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Zap,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowLeft,
  Flame,
  LayoutDashboard,
  TrendingUp,
  Tag,
  Gamepad2,
  Lock,
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/helpers';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const { siteSettings, products, setCurrentView, setSearchQuery, setIsSearchModalOpen } = useStore();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('products');
    } else {
      setIsSearchModalOpen(true);
    }
  };

  // Extract key products for the bento tiles
  const codProduct = products.find((p) => p.id === 'cod-mobile-cp') || products[0];
  const pubgProduct = products.find((p) => p.id === 'pubg-mobile-uc') || products[1];
  const clashProduct = products.find((p) => p.id === 'clash-of-clans-gems') || products[3];
  const freeFireProduct = products.find((p) => p.id === 'free-fire-diamonds') || products[2];
  const chatGptProduct = products.find((p) => p.id === 'chatgpt-plus');
  const telegramProduct = products.find((p) => p.id === 'telegram-premium');
  const spotifyProduct = products.find((p) => p.id === 'spotify-premium');
  const youtubeProduct = products.find((p) => p.id === 'youtube-premium');

  return (
    <div className="relative pt-4 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bento Grid Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Bento Tile 1: Main Large Hero Card (Col 12 / LG: Col 8) */}
          <div className="md:col-span-12 lg:col-span-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-[#020617] rounded-3xl relative overflow-hidden border border-indigo-500/30 p-6 sm:p-10 flex flex-col justify-between shadow-2xl group min-h-[380px]">
            {/* Background Ambient SVG Orb & Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
            <div className="absolute left-[-10%] bottom-[-15%] opacity-25 scale-125 pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-80 sm:w-96 h-80 sm:h-96 fill-indigo-500">
                <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.6,85.6,-0.9C84,13.9,77.5,27.7,69.1,40.1C60.7,52.5,50.3,63.5,37.8,71.2C25.3,78.9,10.6,83.4,-4.1,90.5C-18.8,97.6,-33.5,107.4,-46.8,103.7C-60,100,-71.8,82.8,-79.8,65.8C-87.8,48.8,-92,32,-92.4,15.6C-92.8,-0.9,-89.4,-16.9,-82.5,-31.6C-75.6,-46.3,-65.2,-59.6,-51.9,-66.8C-38.6,-74,-22.4,-75.1,-4.9,-66.6C12.6,-58.1,27.8,-69.6,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>

            {/* Top Badge */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3.5 py-1 rounded-full text-xs font-bold border border-indigo-500/30 mb-4">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>تحویل آنی و خودکار ۲۴ ساعته</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white mb-3">
                خرید سریع جم <br />
                <span className="text-indigo-400">و ارز تمامی بازی‌ها</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed mb-6">
                ارزان‌ترین نرخ خرید مستقیم سی پی کالاف دیوتی، یوسی پابجی، جم فری فایر و اشتراک‌های قانونی هوش مصنوعی با فعال‌سازی زیر ۱۰ دقیقه
              </p>
            </div>

            {/* Search + Action Buttons inside Bento Hero */}
            <div className="relative z-10 space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative max-w-md">
                <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-xl">
                  <Search className="w-4 h-4 text-indigo-400 mr-2.5 ml-2 shrink-0" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="جستجوی محصول (کالاف، پابجی، تلگرام...)"
                    className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm outline-none px-1 py-1.5"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center gap-1"
                  >
                    <span>جستجو</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  id="bento-view-products"
                  onClick={() => setCurrentView('products')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>مشاهده محصولات</span>
                </button>
                <button
                  id="bento-view-discounts"
                  onClick={() => {
                    const el = document.getElementById('special-offers-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setCurrentView('products');
                    }
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-2xl font-bold text-sm border border-white/15 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-indigo-300" />
                  <span>تخفیف‌های ویژه</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Tile 2: Popular Games List Card (Col 12 / LG: Col 4) */}
          <div className="md:col-span-6 lg:col-span-4 bg-slate-900 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-indigo-400" />
                  <span>بازی‌های محبوب</span>
                </h3>
                <button
                  onClick={() => setCurrentView('games')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
                >
                  مشاهده همه
                </button>
              </div>

              <div className="space-y-2.5">
                {/* Game Item 1: CoD Mobile */}
                {codProduct && (
                  <div
                    onClick={() => setCurrentView('product-detail', codProduct.id)}
                    className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer group"
                  >
                    <img
                      src={codProduct.image}
                      alt={codProduct.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {codProduct.title}
                      </p>
                      <p className="text-[11px] text-slate-400">شارژ مستقیم با آیدی</p>
                    </div>
                    <div className="mr-auto bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.8 rounded-md border border-green-500/30">
                      فوری
                    </div>
                  </div>
                )}

                {/* Game Item 2: PUBG Mobile */}
                {pubgProduct && (
                  <div
                    onClick={() => setCurrentView('product-detail', pubgProduct.id)}
                    className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer group"
                  >
                    <img
                      src={pubgProduct.image}
                      alt={pubgProduct.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {pubgProduct.title}
                      </p>
                      <p className="text-[11px] text-slate-400">خرید یوسی با پلیر آیدی</p>
                    </div>
                    <div className="mr-auto bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.8 rounded-md border border-green-500/30">
                      فوری
                    </div>
                  </div>
                )}

                {/* Game Item 3: Free Fire */}
                {freeFireProduct && (
                  <div
                    onClick={() => setCurrentView('product-detail', freeFireProduct.id)}
                    className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer group"
                  >
                    <img
                      src={freeFireProduct.image}
                      alt={freeFireProduct.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {freeFireProduct.title}
                      </p>
                      <p className="text-[11px] text-slate-400">الماس و آفر هفتگی</p>
                    </div>
                    <div className="mr-auto bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.8 rounded-md border border-green-500/30">
                      فوری
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bento Tile 3: Flash Deal Banner (Col 12 / LG: Col 4) */}
          <div
            onClick={() => {
              if (chatGptProduct) setCurrentView('product-detail', chatGptProduct.id);
              else setCurrentView('premium');
            }}
            className="md:col-span-6 lg:col-span-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-5 flex items-center justify-between relative overflow-hidden cursor-pointer group shadow-xl"
          >
            <div className="relative z-10">
              <span className="text-[10px] font-extrabold text-amber-100 bg-black/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                پیشنهاد شگفت‌انگیز
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white mt-1.5 mb-1">
                تخفیف اشتراک ChatGPT Plus
              </h4>
              <p className="text-xs text-amber-100 font-medium">فعال‌سازی قانونی روی ایمیل شخصی</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Bento Tile 4: Premium Accounts Services (Col 12 / LG: Col 3) */}
          <div className="md:col-span-6 lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>سرویس‌های پریمیوم</span>
                </h3>
                <button
                  onClick={() => setCurrentView('premium')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  همه
                </button>
              </div>

              <div className="space-y-2">
                {/* Telegram */}
                <div
                  onClick={() => telegramProduct && setCurrentView('product-detail', telegramProduct.id)}
                  className="flex items-center gap-2.5 p-2 bg-slate-800/40 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-sky-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                    T
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">تلگرام پریمیوم</p>
                    <p className="text-[10px] text-slate-400">فعال‌سازی ۳ و ۶ ماهه</p>
                  </div>
                </div>

                {/* Spotify */}
                <div
                  onClick={() => spotifyProduct && setCurrentView('product-detail', spotifyProduct.id)}
                  className="flex items-center gap-2.5 p-2 bg-slate-800/40 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">اسپاتیفای قانونی</p>
                    <p className="text-[10px] text-slate-400">پلن فمیلی و شخصی</p>
                  </div>
                </div>

                {/* YouTube */}
                <div
                  onClick={() => youtubeProduct && setCurrentView('product-detail', youtubeProduct.id)}
                  className="flex items-center gap-2.5 p-2 bg-slate-800/40 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                    Y
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">یوتیوب پریمیوم</p>
                    <p className="text-[10px] text-slate-400">بدون تبلیغات + موزیک</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Tile 5: Today's Hot Specials (Col 12 / LG: Col 5) */}
          <div className="md:col-span-6 lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>پیشنهادات ویژه امروز</span>
                </h3>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  تخفیف محدود
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Special Mini Card 1 */}
                {clashProduct && (
                  <div
                    onClick={() => setCurrentView('product-detail', clashProduct.id)}
                    className="bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/40 rounded-2xl p-3 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="h-20 bg-slate-950 rounded-xl relative overflow-hidden mb-2">
                        <img
                          src={clashProduct.image}
                          alt={clashProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          ۱۰٪-
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mb-1">
                        جم کلش آف کلنز
                      </p>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 line-through">
                          {formatToman(90000)}
                        </span>
                        <span className="text-xs font-black text-indigo-400">
                          {formatToman(81000)}
                        </span>
                      </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-xl text-[10px] font-bold mt-2 transition-colors">
                      خرید آنی
                    </button>
                  </div>
                )}

                {/* Special Mini Card 2 */}
                {codProduct && (
                  <div
                    onClick={() => setCurrentView('product-detail', codProduct.id)}
                    className="bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/40 rounded-2xl p-3 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="h-20 bg-slate-950 rounded-xl relative overflow-hidden mb-2">
                        <img
                          src={codProduct.image}
                          alt={codProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          ۱۵٪-
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mb-1">
                        بسته‌های CP کالاف
                      </p>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 line-through">
                          {formatToman(65000)}
                        </span>
                        <span className="text-xs font-black text-indigo-400">
                          {formatToman(55000)}
                        </span>
                      </div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-xl text-[10px] font-bold mt-2 transition-colors">
                      خرید آنی
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bento Tile 6: Admin Dashboard / VIP Support Card (Col 12 / LG: Col 4) */}
          <div className="md:col-span-12 lg:col-span-4 bg-indigo-600 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  داشبورد هوشمند
                </span>
                <LayoutDashboard className="w-5 h-5 text-indigo-100" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                پنل مدیریت فروشگاه
              </h3>
              <p className="text-indigo-100 text-xs leading-relaxed mb-6">
                مدیریت کامل قیمت‌ها، شارژ سریع آیتم‌ها، وضعیت سفارش‌ها و کدهای تخفیف با داشبورد پیشرفته ادمین {siteSettings.storeName}.
              </p>
            </div>

            <div className="relative z-10">
              <button
                id="bento-admin-enter-btn"
                onClick={() => setCurrentView('admin')}
                className="bg-white hover:bg-slate-100 text-indigo-700 font-black py-3 rounded-2xl text-center w-full shadow-xl shadow-black/20 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>ورود به پنل مدیریت</span>
              </button>
            </div>

            {/* Glowing blur orb */}
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-indigo-400/40 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>

        {/* 4 Bento Mini Feature Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-bold text-white">تحویل فوق‌العاده سریع</p>
              <p className="text-[11px] text-slate-400">میانگین زمان: ۵ تا ۱۵ دقیقه</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-bold text-white">واریز ۱۰۰٪ قانونی</p>
              <p className="text-[11px] text-slate-400">رسید رسمی و تضمین اکانت</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-bold text-white">پشتیبانی ۲۴ ساعته</p>
              <p className="text-[11px] text-slate-400">تلگرام و تماس آنلاین</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-bold text-white">بیش از ۵۰,۰۰۰ سفارش</p>
              <p className="text-[11px] text-slate-400">رضایت ۹۹.۶٪ کاربران</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
