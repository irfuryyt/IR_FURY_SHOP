import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    calculateCartTotals,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    setCurrentView,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const { subtotal, discount, total } = calculateCartTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCouponCode(couponInput);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('checkout');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container (RTL from left side) */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pr-10 pointer-events-none">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-slate-900 border-r border-slate-800 pointer-events-auto flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">سبد خرید شما</h2>
                    <p className="text-xs text-slate-400">
                      {toPersianDigits(cart.length)} آیتم انتخاب شده
                    </p>
                  </div>
                </div>
                <button
                  id="close-cart-drawer-btn"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="بستن سبد خرید"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4">
                      <ShoppingCart className="w-10 h-10" />
                    </div>
                    <p className="text-base font-bold text-white mb-1">سبد خرید شما خالی است</p>
                    <p className="text-xs text-slate-400 max-w-xs mb-6">
                      محصولات و بسته‌های مورد نظر خود را از صفحه محصولات یا بازی‌ها انتخاب کنید.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        setCurrentView('products');
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                    >
                      مشاهده بازی‌ها و محصولات
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex gap-3 text-right"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-400 hover:text-rose-400 p-1"
                            title="حذف از سبد"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-amber-400 mt-0.5">
                          {item.selectedPackage.title}
                        </p>

                        {/* Custom fields summary */}
                        {Object.entries(item.customFieldValues).length > 0 && (
                          <div className="mt-1.5 p-1.5 rounded bg-slate-900 text-[11px] text-slate-400 space-y-0.5">
                            {Object.entries(item.customFieldValues).map(([key, val]) => (
                              <div key={key} className="truncate">
                                <span className="text-slate-500">{key}: </span>
                                <span className="text-slate-200">{val}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
                          {/* Quantity selector */}
                          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-white">
                              {toPersianDigits(item.quantity)}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-xs font-extrabold text-white">
                            {formatToman(item.selectedPackage.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer (Only if cart not empty) */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 space-y-3.5">
                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="کد تخفیف (مثال: FURY2026)"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      اعمال
                    </button>
                  </form>

                  {/* Active coupon tag */}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-xs text-emerald-400">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>کد تخفیف «{appliedCoupon.code}» اعمال شد ({toPersianDigits(appliedCoupon.percent)}٪)</span>
                      </div>
                      <button
                        onClick={removeCouponCode}
                        className="text-slate-400 hover:text-rose-400 text-xs"
                      >
                        حذف
                      </button>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">جمع کل سبد:</span>
                      <span>{formatToman(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>تخفیف:</span>
                        <span>- {formatToman(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                      <span>مبلغ قابل پرداخت:</span>
                      <span className="text-amber-400 text-base">{formatToman(total)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    id="drawer-checkout-btn"
                    onClick={handleProceedToCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <span>ثبت سفارش و پرداخت نهایی</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>واریز قانونی و گارانتی بازگشت ۱۰۰٪ وجه</span>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
