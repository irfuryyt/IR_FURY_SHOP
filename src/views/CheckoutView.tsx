import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  User,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    calculateCartTotals,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    currentUser,
    siteSettings,
    setCurrentView,
    createOrder,
    showToast,
  } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerMobile, setCustomerMobile] = useState(currentUser?.mobile || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerNote, setCustomerNote] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerMobile) setCustomerMobile(currentUser.mobile);
    }
  }, [currentUser]);

  const { subtotal, discount, total } = calculateCartTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      showToast('لطفاً کد تخفیف را وارد کنید', 'warning');
      return;
    }
    const success = applyCouponCode(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!customerName.trim()) {
      showToast('لطفاً نام و نام خانوادگی خود را وارد کنید', 'error');
      return;
    }
    if (!customerMobile.trim() || customerMobile.length < 10) {
      showToast('لطفاً شماره موبایل معتبر (مثال: 09123456789) وارد کنید', 'error');
      return;
    }
    if (!termsAccepted) {
      showToast('لطفاً تیک پذیرش قوانین سایت را بزنید', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order in pending state and route to card-to-card receipt payment gateway
      const createdOrder = await createOrder({
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        customerEmail: customerEmail.trim(),
        orderNotes: customerNote.trim(),
        paymentGateway: 'card_to_card',
      });

      if (createdOrder) {
        showToast('سفارش شما با موفقیت ثبت شد. لطفاً فیش واریزی را ارسال نمایید.', 'success');
        setCurrentView('payment-gateway', createdOrder.id);
      }
    } catch {
      showToast('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.', 'error');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="py-16 sm:py-24 max-w-md mx-auto px-4 text-center text-right">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">سبد خرید شما در حال حاضر خالی است</h2>
          <p className="text-xs text-slate-400">
            برای تسویه حساب ابتدا محصول مورد نظر خود را به سبد خرید اضافه نمایید.
          </p>
          <button
            onClick={() => setCurrentView('products')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
          >
            مشاهده و انتخاب محصولات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      <div className="mb-8">
        <button
          onClick={() => setCurrentView('cart')}
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 mb-2 font-bold cursor-pointer transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به سبد خرید</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          تسویه حساب و پرداخت نهایی
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          اطلاعات تحویل را تکمیل کرده و فاکتور سفارش را تایید نمایید
        </p>
      </div>

      <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Information & Payment Method (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer Information Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-5 h-5 text-amber-400" />
              <span>اطلاعات تماس خریدار (الزامی)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام و نام خانوادگی <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: پارسا احمدی"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره موبایل جهت هماهنگی و شارژ <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    dir="ltr"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="09123456789"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors text-right tracking-wider"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  آدرس ایمیل (اختیاری جهت ارسال فاکتور)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    dir="ltr"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  توضیحات یا یادداشت سفارش (اختیاری)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="مثال: متصل به جیمیل، لطفاً سریع‌تر انجام شود..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>روش پرداخت و تسویه حساب</span>
            </h2>

            <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0 border border-amber-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-amber-300">
                    کارت‌به‌کارت مستقیم و ارسال تصویر رسید واریزی
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    فعال
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  در مرحله بعد شماره کارت رسمی فروشگاه ({siteSettings.bankCardNumber || '6219861859894882'} به نام {siteSettings.bankCardHolder || 'ایوب پشمکی'}) نمایش داده خواهد شد و با بارگذاری عکس فیش واریز، سفارش شما مستقیماً در پنل مدیریت بررسی و شارژ می‌شود.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded accent-amber-500 w-4 h-4 shrink-0"
              />
              <span>
                <strong className="text-white">قوانین و شرایط فروشگاه {siteSettings.storeName}</strong> (صحت اطلاعات ارسالی، عدم استفاده از کارت مسروقه و فرایند شارژ) را خوانده و با آن موافقم.
              </span>
            </label>
          </div>
        </div>

        {/* Order Summary & Coupon Code (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              اقلام سفارش
            </h3>

            {/* List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-9 h-9 rounded-xl object-cover bg-slate-950 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{item.product.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.selectedPackage.title} × {toPersianDigits(item.quantity)}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-amber-400 shrink-0">
                    {formatToman(item.selectedPackage.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Input & Applied Display */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>کد تخفیف دارید؟</span>
              </label>

              {appliedCoupon ? (
                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-mono font-bold text-emerald-300 text-xs">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-emerald-400 block">({appliedCoupon.percent}٪ تخفیف اعمال شد)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCouponCode}
                    className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                    title="حذف کد تخفیف"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="مثال: FURY2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono tracking-wider outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer"
                  >
                    اعمال
                  </button>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">جمع کل اقلام:</span>
                <span className="font-bold">{formatToman(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>سود شما از تخفیف:</span>
                  <span>- {formatToman(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-amber-400 text-lg">{formatToman(total)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-black py-4 rounded-2xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSubmitting
                  ? 'bg-slate-800 text-slate-400 cursor-wait'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <span>{isSubmitting ? 'در حال ثبت سفارش و صدور فاکتور...' : 'ثبت سفارش و انتقال به صفحه ارسال فیش'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>پشتیبانی آنلاین و تحویل فوری سفارش</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
