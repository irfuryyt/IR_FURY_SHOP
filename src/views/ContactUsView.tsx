import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Mail,
  Send,
  MessageCircle,
  Instagram,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export const ContactUsView: React.FC = () => {
  const { siteSettings, showToast } = useStore();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      showToast('لطفاً تمامی فیلدهای الزامی را پر فرمایید', 'error');
      return;
    }
    setSubmitted(true);
    showToast('پیام شما با موفقیت به واحد پشتیبانی ارسال گردید', 'success');
  };

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 text-right space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <Headphones className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          تماس با پشتیبانی {siteSettings.storeName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          پاسخگویی ۲۴ ساعته و هفت روز هفته به سوالات و پیگیری سفارشات شما
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              پل‌های ارتباطی مستقیم
            </h2>

            <div className="space-y-4 text-xs">
              <a
                href={`tel:${siteSettings.phone}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">تماس تلفنی با پشتیبانی:</span>
                  <span className="text-white font-bold text-sm" dir="ltr">
                    {toPersianDigits(siteSettings.phone)}
                  </span>
                </div>
              </a>

              <a
                href={`https://t.me/${siteSettings.telegramUsername}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">پشتیبانی آنلاین تلگرام:</span>
                  <span className="text-sky-300 font-bold font-mono">@{siteSettings.telegramUsername}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">واتس‌اپ پشتیبانی ۲۴ ساعته:</span>
                  <span className="text-emerald-300 font-bold font-mono" dir="ltr">
                    {toPersianDigits(siteSettings.whatsappNumber)}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ایمیل پشتیبانی رسمی:</span>
                  <span className="text-white font-mono">{siteSettings.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ساعات فعالیت اپراتورها:</span>
                  <span className="text-slate-200">{siteSettings.workingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>ارسال پیام مستقیم به مدیریت و پشتیبانی</span>
            </h2>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">پیام شما ثبت شد</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  از ارتباط شما سپاسگزاریم. کارشناسان {siteSettings.storeName} در کوتاه‌ترین زمان ممکن از طریق پیامک یا تماس با شما ارتباط خواهند گرفت.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-slate-800 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-750 transition-colors"
                >
                  ارسال پیام دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      نام و نام خانوادگی <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: سهراب کریمی"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      شماره تماس همراه <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="09123456789"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 text-right"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    موضوع پیام
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: پیگیری شارژ بتل پس سیزن جدید"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    متن پیام یا توضیحات سفارش <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="پیام، سوال یا شرح مشکل خود را به همراه کد رهگیری (در صورت وجود) بنویسید..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/15 transition-all cursor-pointer"
                >
                  ارسال پیام به پشتیبانی
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
