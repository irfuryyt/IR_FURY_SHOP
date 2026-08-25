import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatToman } from '../utils/helpers';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Upload,
  Copy,
  Check,
  FileCheck,
  Image as ImageIcon,
  Smartphone,
  Trash2,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const PaymentGatewayView: React.FC = () => {
  const {
    pendingOrderId,
    orders,
    siteSettings,
    submitOrderReceipt,
    updateOrderStatus,
    setCurrentView,
    showToast,
  } = useStore();

  const order = orders.find((o) => o.id === pendingOrderId) || orders[0];

  // Receipt Upload State (Mandatory)
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [receiptRefNumber, setReceiptRefNumber] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedShaba, setCopiedShaba] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopyCard = () => {
    const rawNumber = (siteSettings.bankCardNumber || '6219861859894882').replace(/[^0-9]/g, '');
    navigator.clipboard.writeText(rawNumber);
    setCopiedCard(true);
    showToast('شماره کارت مدیریت با موفقیت کپی شد', 'success');
    setTimeout(() => setCopiedCard(false), 3000);
  };

  const handleCopyShaba = () => {
    if (siteSettings.bankShabaNumber) {
      navigator.clipboard.writeText(siteSettings.bankShabaNumber);
      setCopiedShaba(true);
      showToast('شماره شبا با موفقیت کپی شد', 'success');
      setTimeout(() => setCopiedShaba(false), 3000);
    }
  };

  const handleCopyAmount = () => {
    if (order) {
      navigator.clipboard.writeText(order.totalAmount.toString());
      setCopiedAmount(true);
      showToast('مبلغ فاکتور (تومان) کپی شد', 'info');
      setTimeout(() => setCopiedAmount(false), 3000);
    }
  };

  // Image Upload Handler via FileReader (Converts to Base64)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('لطفاً یک فایل تصویری معتبر (JPG, PNG, WEBP) انتخاب کنید.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setReceiptImage(result);
        showToast('تصویر فیش واریزی با موفقیت انتخاب شد.', 'success');
      }
    };
    reader.onerror = () => {
      showToast('خطا در خواندن فایل تصویر.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmitReceiptFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptImage) {
      showToast('بارگذاری عکس یا اسکرین‌شات فیش واریزی الزامی است.', 'error');
      return;
    }

    if (!order) return;

    setIsSubmittingReceipt(true);

    try {
      await submitOrderReceipt(order.id, {
        receiptImage,
        receiptRefNumber: receiptRefNumber.trim() || 'واریز کارت به کارت',
        receiptNotes: receiptNotes.trim(),
      });

      setCurrentView('order-success', order.trackingCode);
    } catch {
      showToast('خطا در ارسال فیش واریزی. لطفاً مجدد امتحان کنید.', 'error');
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  const handleCancelPayment = async () => {
    if (order) {
      updateOrderStatus(order.id, 'cancelled', 'سفارش توسط کاربر لغو شد.');
    }
    showToast('سفارش لغو گردید', 'error');
    setCurrentView('cart');
  };

  if (!order) {
    return (
      <div className="py-20 text-center text-white">
        <p>سفارشی برای پرداخت یافت نشد.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 bg-amber-500 text-slate-950 px-6 py-2 rounded-xl text-xs font-bold"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 text-right">
      {/* Top Header Navigation */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => setCurrentView('checkout')}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 mb-1.5 font-bold cursor-pointer transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به مرحله تسویه حساب</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-amber-400" />
            <span>کارت‌به‌کارت و ارسال فیش واریزی</span>
          </h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-slate-400">کد پیگیری سفارش:</span>
          <span className="font-mono font-bold text-amber-400 text-sm">{order.trackingCode}</span>
        </div>
      </div>

      {/* Invoice Overview Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">خریدار:</span>
            <span className="font-bold text-white text-sm">{order.customerName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">شماره تماس خریدار:</span>
            <span className="font-mono font-bold text-white text-sm" dir="ltr">{order.customerMobile}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">مبلغ نهایی قابل واریز:</span>
            <span className="font-black text-amber-400 text-base">{formatToman(order.totalAmount)}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyAmount}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            title="کپی مبلغ"
          >
            {copiedAmount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Real Bank Card Graphic */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 text-white">
          {/* Card Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Card Top: Bank Name & Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xs">
                  IR
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {siteSettings.bankName || 'بانک سامان'}
                  </span>
                  <span className="text-[10px] text-indigo-300 font-mono">
                    کارت رسمی فروشگاه {siteSettings.storeName || 'IR_FURY_YT'}
                  </span>
                </div>
              </div>

              {/* EMV Chip Graphic */}
              <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-500/80 shadow-inner flex items-center justify-center">
                <div className="w-8 h-6 border border-amber-700/40 rounded grid grid-cols-2 gap-0.5 opacity-60">
                  <div className="border-b border-r border-amber-800/40" />
                  <div className="border-b border-amber-800/40" />
                  <div className="border-r border-amber-800/40" />
                  <div />
                </div>
              </div>
            </div>

            {/* Card Number & Quick Copy */}
            <div className="space-y-1.5 py-2 text-center sm:text-right">
              <span className="text-[11px] text-indigo-300 block">شماره کارت مدیریت جهت واریز وجه:</span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-indigo-500/30">
                <span
                  className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-widest text-center sm:text-right select-all"
                  dir="ltr"
                >
                  {siteSettings.bankCardNumber || '6219861859894882'}
                </span>

                <button
                  type="button"
                  onClick={handleCopyCard}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer shrink-0"
                >
                  {copiedCard ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCard ? 'کپی شد!' : 'کپی شماره کارت'}</span>
                </button>
              </div>
            </div>

            {/* Card Holder & Shaba */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">نام صاحب حساب و کارت:</span>
                <span className="font-bold text-white text-sm">
                  {siteSettings.bankCardHolder || 'ایوب پشمکی (مدیریت فروشگاه IR_FURY_YT)'}
                </span>
              </div>

              {siteSettings.bankShabaNumber && (
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block mb-0.5">شماره شبا:</span>
                    <span className="font-mono text-xs text-slate-300">{siteSettings.bankShabaNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShaba}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg"
                    title="کپی شبا"
                  >
                    {copiedShaba ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Guidance Box */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">راهنمای تسویه و الزامات ارسال فیش:</p>
            <p className="text-slate-300 leading-relaxed">
              {siteSettings.paymentInstructions ||
                'مبلغ دقیق فاکتور را به شماره کارت فوق واریز نمایید. سپس اسکرین‌شات یا عکس فیش واریزی را در کادر زیر بارگذاری نموده و دکمه ارسال را بزنید. ارسال تصویر فیش الزامی است و سفارش بدون فیش تایید نخواهد شد.'}
            </p>
          </div>
        </div>

        {/* Receipt Upload Form */}
        <form onSubmit={handleSubmitReceiptFlow} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <span>بارگذاری عکس یا اسکرین‌شات فیش واریزی (اجباری)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تصویر رسید همراه بانک، آپ، تاپ، خودپرداز یا رسید بانکی خود را پیوست نمایید.
              </p>
            </div>
            <span className="text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
              ارسال فیش الزامی است *
            </span>
          </div>

          {/* Dropzone & Preview Box */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : receiptImage
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-slate-700 bg-slate-950/80 hover:border-amber-500/50'
            }`}
          >
            {receiptImage ? (
              /* Uploaded Image Preview */
              <div className="space-y-4">
                <div className="relative inline-block group">
                  <img
                    src={receiptImage}
                    alt="فیش واریزی بارگذاری شده"
                    className="max-h-72 w-auto mx-auto rounded-2xl border-2 border-emerald-500/50 shadow-2xl object-contain bg-black/40"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>تصویر فیش ضمیمه شد</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <label className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>تغییر تصویر فیش</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setReceiptImage('')}
                    className="inline-flex items-center gap-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold px-4 py-2 rounded-xl border border-rose-800/60 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف تصویر</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty Upload Prompt */
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-lg">
                  <Upload className="w-8 h-8" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white mb-1">
                    عکس یا اسکرین‌شات رسید واریز را اینجا بکشید یا انتخاب کنید
                  </p>
                  <p className="text-xs text-slate-400">
                    فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر حجم ۱۰ مگابایت)
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <span>انتخاب فایل عکس رسید از گوشی یا کامپیوتر</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                کد پیگیری تراکنش / ۴ رقم آخر کارت واریزکننده (اختیاری)
              </label>
              <input
                type="text"
                value={receiptRefNumber}
                onChange={(e) => setReceiptRefNumber(e.target.value)}
                placeholder="مثال: ۱۲۳۴۵۶ یا ۴ رقم آخر کارت"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                یادداشت یا توضیحات برای پشتیبانی (اختیاری)
              </label>
              <input
                type="text"
                value={receiptNotes}
                onChange={(e) => setReceiptNotes(e.target.value)}
                placeholder="مثال: واریز از بانک ملی به نام ..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit & Cancel Actions */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="submit"
              disabled={isSubmittingReceipt || !receiptImage}
              className={`flex items-center justify-center gap-2 font-black py-4 px-6 rounded-2xl text-sm shadow-xl transition-all cursor-pointer ${
                receiptImage
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {isSubmittingReceipt
                  ? 'در حال ثبت و ارسال فیش...'
                  : receiptImage
                  ? 'ارسال فیش واریزی به مدیریت و تکمیل خرید'
                  : 'برای تکمیل خرید ابتدا عکس فیش را انتخاب کنید'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCancelPayment}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 font-bold py-4 px-6 rounded-2xl text-sm border border-slate-700 hover:border-rose-800/60 transition-all cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
              <span>انصراف و بازگشت</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
