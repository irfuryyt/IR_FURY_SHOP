import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Wallet,
  ShieldCheck,
  SearchCode,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    wishlist,
    logoutUser,
    setCurrentView,
    loginUser,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');

  if (!currentUser) {
    return (
      <div className="py-20 text-center text-white max-w-md mx-auto px-4">
        <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">شما وارد حساب کاربری خود نشده‌اید</h2>
        <p className="text-xs text-slate-400 mb-6">
          برای مشاهده سابقه سفارشات و علاقه‌مندی‌ها لطفاً وارد شوید.
        </p>
        <button
          onClick={() => loginUser('09307622202', 'مدیر ارشد IR_FURY_YT', true)}
          className="bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs"
        >
          ورود به حساب کاربری مدیریت (09307622202)
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(
    (o) => o.customerMobile === currentUser.mobile || o.userId === currentUser.id
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              {currentUser.isAdmin && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg">
                  مدیر ارشد IR_FURY_YT
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1" dir="ltr">
              {toPersianDigits(currentUser.mobile)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {currentUser.isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/20"
            >
              <KeyRound className="w-4 h-4" />
              <span>ورود به پنل مدیریت سایت</span>
            </button>
          )}

          <button
            onClick={logoutUser}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 hover:border-rose-800/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 sm:gap-8 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'orders' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>سفارش‌های من ({toPersianDigits(userOrders.length)})</span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'wishlist' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>علاقه‌مندی‌ها ({toPersianDigits(wishlistProducts.length)})</span>
          {activeTab === 'wishlist' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">هنوز سفارشی ثبت نکرده‌اید</h3>
              <p className="text-xs text-slate-400 mb-6">
                برای خرید سی پی، یوسی یا گیفت کارت به صفحه محصولات مراجعه کنید.
              </p>
              <button
                onClick={() => setCurrentView('products')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
              >
                مشاهده محصولات
              </button>
            </div>
          ) : (
            userOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400">کد پیگیری: </span>
                    <span className="font-mono font-bold text-amber-400">{ord.trackingCode}</span>
                    <span className="text-[11px] text-slate-500 mr-3">تاریخ: {ord.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        ord.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {ord.status === 'completed' ? 'تکمیل شده' : 'در حال انجام'}
                    </span>

                    <button
                      onClick={() => setCurrentView('order-tracking', ord.trackingCode)}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-3 py-1 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <SearchCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>پیگیری</span>
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.image}
                          alt={it.product.title}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-950"
                        />
                        <div>
                          <p className="font-bold text-white">{it.product.title}</p>
                          <p className="text-slate-400 text-[11px]">{it.selectedPackage.title}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-amber-400">
                        {formatToman(it.selectedPackage.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-xs font-bold">
                  <span className="text-slate-400">مبلغ کل فاکتور:</span>
                  <span className="text-amber-400 text-sm">{formatToman(ord.totalAmount)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">لیست علاقه‌مندی‌های شما خالی است</h3>
              <p className="text-xs text-slate-400 mb-6">
                با زدن آیکون قلب روی هر محصول، آن را برای خرید سریع ذخیره نمایید.
              </p>
              <button
                onClick={() => setCurrentView('products')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
              >
                مشاهده محصولات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
