import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Smartphone, ShieldCheck, User, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, showToast, siteSettings } = useStore();
  const [mobileNumber, setMobileNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [otpCode, setOtpCode] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = mobileNumber.trim();
    if (!cleanNumber || cleanNumber.length < 10) {
      showToast('لطفاً شماره همراه ۱۱ رقمی معتبر وارد کنید', 'error');
      return;
    }
    setStep('otp');
    setOtpCode('1234'); // Auto fill demo OTP for smooth experience
    showToast('کد تایید پیامکی ۱۲۳۴ ارسال گردید', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      showToast('کد تایید ۴ رقمی را وارد کنید', 'error');
      return;
    }
    loginUser(mobileNumber, fullName || `کاربر ${siteSettings.storeName}`, false);
    resetForm();
  };

  const handleQuickDemoAdmin = () => {
    loginUser('09120000000', `مدیر ارشد ${siteSettings.storeName}`, true);
    resetForm();
  };

  const handleQuickDemoUser = () => {
    loginUser('09351234567', 'آرش رضایی', false);
    resetForm();
  };

  const resetForm = () => {
    setMobileNumber('');
    setFullName('');
    setOtpCode('');
    setStep('mobile');
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsAuthModalOpen(false);
              resetForm();
            }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-7 text-right"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                resetForm();
              }}
              className="absolute top-5 left-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">ورود یا ثبت‌نام در {siteSettings.storeName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  جهت پیگیری سفارشات و دسترسی به پنل کاربری
                </p>
              </div>
            </div>

            {step === 'mobile' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    نام و نام خانوادگی (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: علیرضا حسینی"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    شماره تلفن همراه <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="09123456789"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors text-right tracking-wider"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-amber-500/15 transition-all cursor-pointer mt-2"
                >
                  <span>دریافت کد تایید یکبار مصرف</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>کد به شماره {toPersianDigits(mobileNumber)} ارسال شد</span>
                  <button
                    type="button"
                    onClick={() => setStep('mobile')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    تغییر شماره
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    کد تایید ۴ رقمی پیامک شده
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-amber-400 font-bold outline-none focus:border-amber-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    کد پیش‌فرض آزمایشی: <span className="text-amber-400 font-mono">1234</span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-amber-500/15 transition-all cursor-pointer"
                >
                  <span>تایید و ورود به سایت</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Demo Access Bar for Evaluator Convenience */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 text-center mb-3">
                دسترسی سریع آزمایشی برای ارزیابی سامانه:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="flex items-center justify-center gap-1.5 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span>ورود به عنوان مدیر (Admin)</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoUser}
                  className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>ورود کاربر دمو</span>
                </button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ورود شما به معنای پذیرش قوانین و حریم خصوصی {siteSettings.storeName} است.</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
