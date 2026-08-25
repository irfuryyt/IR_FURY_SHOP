import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  SearchCode,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  AlertCircle,
  Phone,
  MessageSquare,
  ShieldCheck,
  User,
  Copy,
  Check,
  FileCheck,
} from 'lucide-react';

interface Props {
  initialTrackingCode?: string;
}

export const OrderTrackingView: React.FC<Props> = ({ initialTrackingCode = '' }) => {
  const { orders, showToast, setCurrentView } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialTrackingCode);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTrackingCode) {
      handleSearch(initialTrackingCode);
    }
  }, [initialTrackingCode]);

  const handleSearch = (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim().toUpperCase();
    setHasSearched(true);
    if (!q) {
      showToast('لطفاً کد پیگیری یا شماره موبایل را وارد کنید', 'error');
      return;
    }

    const order = orders.find(
      (o) => o.trackingCode?.toUpperCase() === q || o.customerMobile.includes(q) || o.id === q
    );

    if (order) {
      setFoundOrder(order);
      showToast('سفارش با موفقیت یافت شد', 'success');
    } else {
      setFoundOrder(null);
      showToast('سفارشی با این مشخصات یافت نشد', 'error');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('کد پیگیری کپی شد', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 text-right">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-lg">
          <SearchCode className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          پیگیری آنلاین وضعیت سفارش
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          کد پیگیری دریافت شده (مانند VG-100293) یا شماره همراه ثبت‌شده را وارد کنید
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 mb-10 shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="کد پیگیری سفارش (مثال: VG-100293) یا شماره موبایل..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors uppercase"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-4 rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/15 transition-all cursor-pointer shrink-0"
          >
            استعلام وضعیت
          </button>
        </form>

        {/* Quick Demo Tracking Links */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>نمونه‌های آماده تست:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setSearchQuery(o.trackingCode || o.id);
                handleSearch(o.trackingCode || o.id);
              }}
              className="bg-slate-950 hover:bg-slate-800 text-amber-400 px-3 py-1 rounded-xl border border-slate-800 font-mono"
            >
              {o.trackingCode}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {foundOrder ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-300">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">کد پیگیری:</span>
                <span className="text-lg font-mono font-black text-amber-400">
                  {foundOrder.trackingCode}
                </span>
                <button
                  onClick={() => handleCopy(foundOrder.trackingCode || '')}
                  className="text-slate-400 hover:text-white p-1"
                  title="کپی کد"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-xs text-slate-500 block mt-1">
                ثبت شده در: {foundOrder.createdAt}
              </span>
            </div>

            {/* Current Status Pill */}
            <div>
              {foundOrder.status === 'completed' ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-2xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>سفارش با موفقیت تکمیل و شارژ گردید</span>
                </div>
              ) : foundOrder.status === 'processing' ? (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-2xl text-xs font-bold">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>در حال انجام و واریز به اکانت</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-2xl text-xs font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>در انتظار پرداخت</span>
                </div>
              )}
            </div>
          </div>

          {/* 4-Step Visual Timeline */}
          <div>
            <h3 className="text-sm font-bold text-white mb-6">مراحل انجام سفارش:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {[
                { step: 1, title: 'ثبت و پرداخت', desc: 'تایید فاکتور درگاه', completed: true },
                {
                  step: 2,
                  title: 'بررسی اپراتور',
                  desc: 'تطبیق آیدی و مشخصات',
                  completed: foundOrder.status === 'processing' || foundOrder.status === 'completed',
                },
                {
                  step: 3,
                  title: 'شارژ درون‌بازی',
                  desc: 'واریز مستقیم به اکانت',
                  completed: foundOrder.status === 'completed',
                  active: foundOrder.status === 'processing',
                },
                {
                  step: 4,
                  title: 'تحویل نهایی',
                  desc: 'ارسال پیامک تایید',
                  completed: foundOrder.status === 'completed',
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    s.completed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : s.active
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold text-xs ${
                      s.completed
                        ? 'bg-emerald-500 text-slate-950'
                        : s.active
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {s.completed ? <Check className="w-4 h-4" /> : toPersianDigits(s.step)}
                  </div>
                  <h4 className="text-xs font-bold mb-1 text-white">{s.title}</h4>
                  <p className="text-[10px] text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Information Box if Available */}
          {foundOrder.paymentReceiptImage && (
            <div className="bg-slate-950 rounded-2xl p-5 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>وضعیت فیش واریزی ارسال شده:</span>
                </h4>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    foundOrder.receiptStatus === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : foundOrder.receiptStatus === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {foundOrder.receiptStatus === 'verified'
                    ? '✓ فیش تایید گردید'
                    : foundOrder.receiptStatus === 'rejected'
                    ? '✕ فیش رد شد'
                    : '⏳ فیش در انتظار بررسی مدیریت'}
                </span>
              </div>

              {foundOrder.receiptRejectionReason && (
                <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-300">
                  <strong>علت رد فیش: </strong>
                  <span>{foundOrder.receiptRejectionReason}</span>
                </div>
              )}

              {foundOrder.receiptRefNumber && (
                <div className="text-xs text-slate-400">
                  <span>شناسه / شماره پیگیری فیش: </span>
                  <span className="font-mono text-amber-400 font-bold">{foundOrder.receiptRefNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Customer & Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                <span>اطلاعات تحویل‌گیرنده</span>
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">نام خریدار:</span>
                <span className="text-white font-bold">{foundOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">شماره موبایل:</span>
                <span className="text-white font-mono">{toPersianDigits(foundOrder.customerMobile)}</span>
              </div>
              {foundOrder.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-slate-500">ایمیل:</span>
                  <span className="text-white font-mono">{foundOrder.customerEmail}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>اطلاعات مالی</span>
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">مبلغ سفارش:</span>
                <span className="text-amber-400 font-extrabold">{formatToman(foundOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">درگاه پرداخت:</span>
                <span className="text-white">{foundOrder.paymentGateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">شناسه تراکنش:</span>
                <span className="text-white font-mono">{foundOrder.transactionId || 'TRX-948271'}</span>
              </div>
            </div>
          </div>

          {/* Items in Order */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">آیتم‌های این سفارش:</h4>
            <div className="space-y-2">
              {foundOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-900"
                    />
                    <div>
                      <p className="font-bold text-white">{item.product.title}</p>
                      <p className="text-slate-400">{item.selectedPackage.title}</p>
                      {Object.entries(item.customFieldValues).map(([k, v]) => (
                        <p key={k} className="text-[11px] text-amber-400">
                          {k}: {v}
                        </p>
                      ))}
                    </div>
                  </div>
                  <span className="font-extrabold text-amber-400">
                    {formatToman(item.selectedPackage.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Need help footer */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-amber-300">
              سوالی درباره سفارش خود دارید یا نیاز به تغییر مشخصات اکانت است؟
            </span>
            <button
              onClick={() => setCurrentView('contact')}
              className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors shrink-0"
            >
              تماس با پشتیبانی
            </button>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">سفارشی با این مشخصات پیدا نشد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            لطفاً از صحت کد پیگیری وارد شده اطمینان حاصل نمایید یا با شماره همراه دیگری امتحان کنید.
          </p>
        </div>
      ) : null}
    </div>
  );
};
