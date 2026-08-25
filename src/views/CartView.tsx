import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    calculateCartTotals,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    setCurrentView,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const { subtotal, discount, total } = calculateCartTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCouponCode(couponCode);
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 text-center">
        <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-6 shadow-xl">
          <ShoppingCart className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">سبد خرید شما خالی است</h2>
        <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          شما در حال حاضر هیچ آیتمی در سبد خرید ندارید. برای خرید جم، ارز بازی‌ها یا اشتراک‌های پریمیوم به بخش محصولات مراجعه فرمایید.
        </p>
        <button
          onClick={() => setCurrentView('products')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
        >
          مشاهده محصولات و بازی‌ها
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            سبد خرید
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            مرور آیتم‌ها و اعمال کدهای تخفیف قبل از پرداخت
          </p>
        </div>

        <button
          onClick={() => setCurrentView('products')}
          className="text-xs sm:text-sm text-amber-400 hover:underline flex items-center gap-1 font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>افزودن آیتم‌های بیشتر</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Main Column: Items list (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-20 h-20 rounded-2xl object-cover bg-slate-950 shrink-0"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                    {item.product.title}
                  </h3>
                  <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold px-2.5 py-0.5 rounded-lg mb-2">
                    {item.selectedPackage.title}
                  </span>

                  {/* Custom fields */}
                  {Object.entries(item.customFieldValues).length > 0 && (
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      {Object.entries(item.customFieldValues).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-slate-500">{k}: </span>
                          <span className="text-slate-300 font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Price & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-xl">
                  <button
                    onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white bg-slate-900 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-white">
                    {toPersianDigits(item.quantity)}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white bg-slate-900 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-left">
                  <span className="text-sm sm:text-base font-extrabold text-amber-400 block">
                    {formatToman(item.selectedPackage.price * item.quantity)}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    واحد: {formatToman(item.selectedPackage.price)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-slate-500 hover:text-rose-400 p-2 transition-colors"
                  title="حذف آیتم"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              خلاصه فاکتور
            </h3>

            {/* Coupon Code Box */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="کد تخفیف (مثال: FURY2026)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                اعمال
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>کد «{appliedCoupon.code}» اعمال شد ({toPersianDigits(appliedCoupon.percent)}٪ تخفیف)</span>
                </div>
                <button onClick={removeCouponCode} className="text-slate-400 hover:text-rose-400 text-xs">
                  حذف
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">جمع کل سبد:</span>
                <span className="font-bold">{formatToman(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>تخفیف اعمال شده:</span>
                  <span>- {formatToman(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-amber-400 text-lg">{formatToman(total)}</span>
              </div>
            </div>

            {/* Next Step Checkout Button */}
            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-4 px-6 rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>تکمیل اطلاعات و پرداخت</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>پرداخت امن و رمزنگاری شده از شبکه شاپرک</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>واریز آنی بلافاصله پس از پرداخت موفق</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
