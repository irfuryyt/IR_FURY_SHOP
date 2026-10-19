import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Wallet,
  ShieldCheck,
  SearchCode,
  ArrowLeft,
  Gamepad2,
  Upload,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Camera,
  AtSign,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
];

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    wishlist,
    logoutUser,
    setCurrentView,
    setIsAuthModalOpen,
    siteSettings,
    updateUserProfile,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

  // Edit form state initialized with current user data
  const [fullName, setFullName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [gamerTag, setGamerTag] = useState(currentUser?.gamerTag || '');
  const [gameId, setGameId] = useState(currentUser?.gameId || '');
  const [discordId, setDiscordId] = useState(currentUser?.discordId || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) {
    return (
      <div className="py-20 text-center text-white max-w-md mx-auto px-4">
        <UserIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">شما وارد حساب کاربری خود نشده‌اید</h2>
        <p className="text-xs text-slate-400 mb-6">
          برای مدیریت مشخصات، سابقه سفارش‌ها و کیف پول لطفاً وارد حساب خود شوید.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl text-xs cursor-pointer shadow-lg shadow-indigo-600/25 transition-all"
        >
          ورود یا ثبت‌نام در فروشگاه
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(
    (o) => o.customerMobile === currentUser.mobile || o.userId === currentUser.id
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Handle local avatar file upload
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('لطفاً یک فایل تصویری (JPG, PNG یا WEBP) انتخاب کنید', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('حجم تصویر نباید بیشتر از ۳ مگابایت باشد', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        showToast('تصویر پروفایل انتخاب شد؛ برای ثبت نهایی روی ذخیره تغییرات کلیک کنید', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customAvatarInput.trim()) {
      showToast('لطفاً آدرس اینترنتی تصویر را وارد کنید', 'error');
      return;
    }
    setAvatarUrl(customAvatarInput.trim());
    setCustomAvatarInput('');
    showToast('آدرس تصویر با موفقیت اعمال گردید', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('نام و نام خانوادگی نمی‌تواند خالی باشد', 'error');
      return;
    }
    if (!mobile.trim()) {
      showToast('شماره تلفن همراه الزامی است', 'error');
      return;
    }

    setIsSaving(true);
    updateUserProfile({
      fullName: fullName.trim(),
      name: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      gamerTag: gamerTag.trim() || undefined,
      gameId: gameId.trim() || undefined,
      discordId: discordId.trim() || undefined,
      bio: bio.trim() || undefined,
      avatarUrl: avatarUrl || undefined,
    });

    setTimeout(() => {
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* Profile Header Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative group">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-600/20">
                {currentUser.name ? currentUser.name.slice(0, 1) : 'U'}
              </div>
            )}
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              {currentUser.gamerTag && (
                <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3 text-indigo-400" />
                  <span>{currentUser.gamerTag}</span>
                </span>
              )}
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                کاربر رسمی فروشگاه
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
              <span dir="ltr">{toPersianDigits(currentUser.mobile)}</span>
              {currentUser.email && (
                <>
                  <span>•</span>
                  <span dir="ltr">{currentUser.email}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Balance & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold">کیف پول شما</p>
              <p className="text-sm font-black text-amber-400 font-mono">
                {formatToman(currentUser.walletBalance || 150000)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('order-tracking')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-3 rounded-2xl border border-slate-700 transition-colors cursor-pointer"
          >
            <SearchCode className="w-4 h-4 text-indigo-400" />
            <span>پیگیری سفارش‌ها</span>
          </button>

          <button
            onClick={logoutUser}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 text-xs font-bold px-4 py-3 rounded-2xl border border-slate-700 hover:border-rose-800/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 sm:gap-8 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>ویرایش مشخصات و هویت گیمری</span>
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'wishlist' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>علاقه‌مندی‌ها ({toPersianDigits(wishlistProducts.length)})</span>
          {activeTab === 'wishlist' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: GAMER PROFILE & IDENTITY SETTINGS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Avatar Selector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Camera className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">انتخاب و بارگذاری تصویر پروفایل</h3>
              </div>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors"
                >
                  حذف تصویر
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Current Preview */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-center">
                <div className="relative mb-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="پیش‌نمایش آواتار"
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500">
                      <UserIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 p-1 bg-indigo-600 rounded-lg text-white shadow">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-300">پیش‌نمایش نشان شما</p>
                <p className="text-[11px] text-slate-500 mt-0.5">در سفارش‌ها و دیدگاه‌ها نمایش داده می‌شود</p>
              </div>

              {/* Upload & Presets */}
              <div className="lg:col-span-8 space-y-4">
                {/* Upload from device */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    آپلود عکس از روی دستگاه (کامپیوتر یا گوشی):
                  </label>
                  <label className="flex items-center justify-center gap-2.5 p-4 bg-slate-950/70 hover:bg-slate-950 border border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl cursor-pointer transition-all group">
                    <Upload className="w-5 h-5 text-indigo-400 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-xs text-slate-300 group-hover:text-white font-medium">
                      کلیک برای انتخاب فایل عکس جدید (PNG, JPG تا ۳ مگابایت)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct image URL input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    یا درج مستقیم آدرس اینترنتی تصویر (Image URL):
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        dir="ltr"
                        value={customAvatarInput}
                        onChange={(e) => setCustomAvatarInput(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono"
                      />
                      <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors"
                    >
                      اعمال لینک
                    </button>
                  </div>
                </div>

                {/* Quick Avatar Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    یا انتخاب از آواتارهای پیش‌فرض گیمینگ:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {DEFAULT_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(av)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                          avatarUrl === av
                            ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-105'
                            : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="آواتار انتخابی" className="w-full h-full object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
              <UserIcon className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">مشخصات هویتی و ارتباطی کاربر</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام و نام خانوادگی کامل:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: آروین مرادی"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره تلفن همراه (پیامک و واریز):
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="09123456789"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono transition-all"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  پست الکترونیکی (ایمیل اختیاری):
                </label>
                <div className="relative">
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Gamer Identity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">مشخصات گیمری و حساب‌های بازی</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  تگ گیمری (GamerTag / Nickname):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    placeholder="e.g. FURY_WARRIOR"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono transition-all"
                  />
                  <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شناسه کاراکتر یا UID بازی (Player UID):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="e.g. 678912345098"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono transition-all"
                  />
                  <Gamepad2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  آیدی دیسکورد (جهت هماهنگی سریع):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={discordId}
                    onChange={(e) => setDiscordId(e.target.value)}
                    placeholder="e.g. user#1234"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono transition-all"
                  />
                  <Sparkles className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                توضیحات یا بایو گیمر (اختیاری):
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="توضیحاتی در مورد بازی‌های مورد علاقه، رنک یا سبک بازی شما..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'در حال ثبت تغییرات...' : 'ذخیره مشخصات پروفایل'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: USER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">هنوز سفارشی ثبت نکرده‌اید</h3>
              <p className="text-xs text-slate-400 mb-6">
                برای خرید سی پی، یوسی، جم یا اشتراک پرمیوم به صفحه محصولات مراجعه فرمایید.
              </p>
              <button
                onClick={() => setCurrentView('products')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                مشاهده فروشگاه محصولات
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
                      className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-3 py-1 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
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

      {/* TAB 3: WISHLIST */}
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
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
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
