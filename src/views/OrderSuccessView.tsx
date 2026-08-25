import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  CheckCircle,
  Copy,
  Check,
  SearchCode,
  Printer,
  ArrowLeft,
  ShieldCheck,
  Zap,
  ShoppingBag,
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { lastTrackingCode, orders, setCurrentView, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const order = orders.find((o) => o.trackingCode === lastTrackingCode) || orders[0];

  const handleCopyTrackingCode = () => {
    if (order?.trackingCode) {
      navigator.clipboard.writeText(order.trackingCode);
      setCopied(true);
      showToast('کد پیگیری کپی شد', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="py-20 text-center text-white">
        <p>رسید سفارشی یافت نشد.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 bg-amber-500 text-slate-950 px-6 py-2 rounded-xl text-xs font-bold"
        >
          بازگشت به خانه
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 text-right">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Success Header */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            {order.paymentReceiptImage
              ? 'فیش واریزی با موفقیت ارسال شد!'
              : 'پرداخت با موفقیت انجام شد!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {order.paymentReceiptImage
              ? 'تصویر فیش واریزی شما جهت بررسی به پنل مدیریت ارسال گردید. سفارش شما بلافاصله پس از تایید رسید، شارژ خواهد شد.'
              : 'سفارش شما با موفقیت در سیستم ثبت گردید و هم‌اکنون توسط تیم پشتیبانی در حال انجام و شارژ می‌باشد.'}
          </p>
        </div>

        {/* Tracking Code Highlight Box */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1">کد پیگیری اختصاصی سفارش شما:</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-wider">
              {order.trackingCode}
            </span>
          </div>

          <button
            onClick={handleCopyTrackingCode}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'کد کپی شد' : 'کپی کد پیگیری'}</span>
          </button>
        </div>

        {/* Order Details Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">مشخصات فاکتور:</h3>

          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">نام خریدار:</span>
              <span className="font-bold text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">شماره تماس:</span>
              <span className="font-mono text-white">{order.customerMobile}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">تاریخ و زمان ثبت:</span>
              <span className="text-white">{order.createdAt}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">روش پرداخت:</span>
              <span className="text-white">درگاه الکترونیک {order.paymentGateway}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">وضعیت سفارش:</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                {order.status === 'processing'
                  ? 'در حال انجام'
                  : order.status === 'completed'
                  ? 'تکمیل شده'
                  : 'در انتظار پرداخت'}
              </span>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">اقلام خریداری شده:</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-900"
                  />
                  <div>
                    <h4 className="font-bold text-white">{item.product.title}</h4>
                    <p className="text-slate-400 text-[11px]">{item.selectedPackage.title}</p>
                    {/* Custom fields */}
                    {Object.entries(item.customFieldValues).map(([k, v]) => (
                      <span key={k} className="text-[10px] text-amber-400 block">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-left">
                  <span className="font-extrabold text-amber-400">
                    {formatToman(item.selectedPackage.price * item.quantity)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    تعداد: {toPersianDigits(item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-sm font-bold">
          <span className="text-white">مبلغ کل پرداخت شده:</span>
          <span className="text-amber-400 text-lg font-black">{formatToman(order.totalAmount)}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentView('order-tracking', order.trackingCode)}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-4 rounded-2xl text-xs shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
          >
            <SearchCode className="w-4 h-4" />
            <span>پیگیری وضعیت سفارش</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-white font-bold py-3.5 px-4 rounded-2xl text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ فاکتور</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-white font-bold py-3.5 px-4 rounded-2xl text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>بازگشت به فروشگاه</span>
          </button>
        </div>
      </div>
    </div>
  );
};
