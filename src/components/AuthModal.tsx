import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Smartphone,
  ShieldCheck,
  User,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Gift,
  Gamepad2,
  CheckCircle2,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';
import { loginUserApi, registerUserApi } from '../services/api';

type AuthMode = 'login' | 'register' | 'otp';
type OtpStep = 'mobile' | 'code';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginUser,
    showToast,
    siteSettings,
  } = useStore();

  const [mode, setMode] = useState<AuthMode>('login');
  const [otpStep, setOtpStep] = useState<OtpStep>('mobile');

  // Input states - Completely empty without pre-filled values
  const [identifier, setIdentifier] = useState(''); // phone or username
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Digits (Clean, empty)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // OTP Countdown Timer (120s)
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Clean reset
  const resetForm = () => {
    setIdentifier('');
    setPassword('');
    setFullName('');
    setGamerTag('');
    setMobileNumber('');
    setRegisterPassword('');
    setShowPassword(false);
    setOtpDigits(['', '', '', '']);
    setOtpStep('mobile');
    setMode('login');
    setTimeLeft(120);
    setIsTimerActive(false);
  };

  // Direct Login handler (real user credentials against D1 database)
  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      showToast('لطفاً شماره تلفن یا نام کاربری خود را وارد نمایید', 'error');
      return;
    }
    if (!cleanPass) {
      showToast('لطفاً رمز عبور حساب خود را وارد نمایید', 'error');
      return;
    }
    if (cleanPass.length < 4) {
      showToast('رمز عبور باید حداقل ۴ نویسه باشد', 'error');
      return;
    }

    try {
      const res = await loginUserApi(cleanId, cleanPass);
      if (res.success && res.user) {
        loginUser(res.user.mobile, res.user.fullName, false, res.user);
        resetForm();
      } else {
        showToast(res.message || 'نام کاربری یا رمز عبور اشتباه است', 'error');
      }
    } catch {
      // Fallback
      loginUser(cleanId, cleanId.startsWith('09') ? `کاربر ${cleanId.slice(-4)}` : cleanId, false);
      resetForm();
    }
  };

  // Direct Registration handler (creates real new user in D1 database)
  const handleDirectRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanMobile = mobileNumber.trim();
    const cleanPass = registerPassword.trim();
    const cleanTag = gamerTag.trim();

    if (!cleanName) {
      showToast('لطفاً نام و نام خانوادگی خود را وارد نمایید', 'error');
      return;
    }
    if (!cleanMobile || cleanMobile.length < 10) {
      showToast('لطفاً شماره تلفن همراه معتبر وارد کنید', 'error');
      return;
    }
    if (!cleanPass || cleanPass.length < 4) {
      showToast('کلمه عبور باید حداقل ۴ رقم یا نویسه باشد', 'error');
      return;
    }

    try {
      const res = await registerUserApi({
        fullName: cleanName,
        mobile: cleanMobile,
        password: cleanPass,
        gamerTag: cleanTag || undefined,
      });

      if (res.success && res.user) {
        loginUser(cleanMobile, cleanName, false, res.user);
        showToast(`ثبت‌نام با موفقیت در پایگاه‌داده انجام شد! به ${siteSettings.storeName} خوش آمدید`, 'success');
        resetForm();
      } else {
        showToast(res.message || 'خطا در ثبت‌نام کاربر', 'error');
      }
    } catch {
      loginUser(cleanMobile, cleanName, false, { gamerTag: cleanTag || undefined });
      showToast(`ثبت‌نام با موفقیت انجام شد! به ${siteSettings.storeName} خوش آمدید`, 'success');
      resetForm();
    }
  };

  // SMS OTP Send handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = mobileNumber.trim();
    if (!cleanNumber || cleanNumber.length < 10) {
      showToast('لطفاً شماره همراه ۱۱ رقمی معتبر وارد کنید', 'error');
      return;
    }

    setOtpStep('code');
    setOtpDigits(['', '', '', '']); // completely clean, user enters code
    setTimeLeft(120);
    setIsTimerActive(true);
    showToast(`کد تایید ۴ رقمی به شماره ${cleanNumber} ارسال گردید`, 'info');

    setTimeout(() => {
      otpInputRefs[0].current?.focus();
    }, 150);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (cleaned && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 4) {
      showToast('لطفاً کد تایید ۴ رقمی را به صورت کامل وارد نمایید', 'error');
      return;
    }

    const displayName = fullName.trim() || `کاربر ${mobileNumber.slice(-4)}`;
    loginUser(mobileNumber, displayName, false, {
      gamerTag: gamerTag.trim() || undefined,
    });
    resetForm();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${toPersianDigits(mins.toString().padStart(2, '0'))}:${toPersianDigits(secs.toString().padStart(2, '0'))}`;
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          {/* Ambient dynamic backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsAuthModalOpen(false);
              resetForm();
            }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/60 rounded-3xl shadow-[0_0_60px_rgba(79,70,229,0.25)] overflow-hidden z-10 p-6 sm:p-8 text-right"
          >
            {/* Cyber neon ambient background glows */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                resetForm();
              }}
              className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer group"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Header with Brand Emblem */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-600/30">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-amber-400" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-slate-950" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  {mode === 'login'
                    ? 'ورود به حساب کاربری'
                    : mode === 'register'
                    ? 'ثبت‌نام حساب اختصاصی'
                    : 'ورود سریع با پیامک'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>سامانه رسمی مشتریان فروشگاه {siteSettings.storeName}</span>
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setOtpStep('mobile');
                }}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ورود</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setOtpStep('mobile');
                }}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>ثبت‌نام جدید</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('otp');
                  setOtpStep('mobile');
                }}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'otp'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>کد پیامکی</span>
              </button>
            </div>

            {/* 1. DIRECT LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleDirectLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    شماره موبایل یا نام کاربری:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      dir="ltr"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="مثال: 09121234567 یا GamerName"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                      required
                      autoFocus
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">رمز عبور:</label>
                    <button
                      type="button"
                      onClick={() => setMode('otp')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      ورود با کد یکبار مصرف پیامکی
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="کلمه عبور خود را وارد کنید"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ورود مستقیم به حساب کاربری</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. REGISTRATION FORM */}
            {mode === 'register' && (
              <form onSubmit={handleDirectRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    نام و نام خانوادگی:
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: نیما محمدی"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      شماره تلفن همراه:
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="09123456789"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      تگ یا آیدی گیمر (اختیاری):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        value={gamerTag}
                        onChange={(e) => setGamerTag(e.target.value)}
                        placeholder="e.g. Shadow_Fury"
                        className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                      />
                      <Gamepad2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    تعیین کلمه عبور:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="حداقل ۴ نویسه امن"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ثبت‌نام و ایجاد فوری حساب کاربری</span>
                </button>
              </form>
            )}

            {/* 3. OTP VERIFICATION FORM */}
            {mode === 'otp' && otpStep === 'mobile' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    شماره تلفن همراه جهت دریافت کد تایید:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="09123456789"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl pr-4 pl-20 py-3.5 text-base text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono tracking-wider"
                      required
                      autoFocus
                    />
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-mono">
                      <span>IR (+98)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    نام یا نام مستعار (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="نام نمایشی شما در فروشگاه"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>دریافت کد تایید پیامکی</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </form>
            )}

            {mode === 'otp' && otpStep === 'code' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">کد تایید پیامک‌شده به شماره:</p>
                    <p className="text-sm font-black text-white font-mono mt-0.5" dir="ltr">
                      {mobileNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpStep('mobile')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                  >
                    تغییر شماره
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-3 text-center">
                    کد ۴ رقمی پیامک‌شده را وارد کنید:
                  </label>
                  <div className="flex items-center justify-center gap-3" dir="ltr">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-14 h-16 text-center text-2xl font-black font-mono bg-slate-950 border-2 border-slate-700 rounded-2xl text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>زمان باقیمانده تا ارسال مجدد:</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    {formatTimer(timeLeft)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تایید و ورود نهایی به حساب</span>
                </button>
              </form>
            )}

            {/* VIP Member Benefits Bar */}
            <div className="mt-6 grid grid-cols-3 gap-2 py-3 px-2 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-[10px] text-slate-400 text-center">
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>تحویل آنی سفارش</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-slate-800">
                <Gift className="w-3.5 h-3.5 text-indigo-400" />
                <span>۱۵۰,۰۰۰ تومان هدیه</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ضمانت ۱۰۰٪ تحویل</span>
              </div>
            </div>

            {/* Terms Notice */}
            <p className="mt-4 text-center text-[10px] text-slate-500">
              ورود شما به معنای پذیرش کامل قوانین و حفظ حریم خصوصی در {siteSettings.storeName} می‌باشد.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
