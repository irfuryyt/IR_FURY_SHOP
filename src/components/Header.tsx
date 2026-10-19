import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Gamepad2,
  Search,
  ShoppingCart,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  SearchCode,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Gift,
  Zap,
  BookOpen,
  Info,
  Phone,
  Sun,
  Moon,
  Lock,
} from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    siteSettings,
    cart,
    currentUser,
    logoutUser,
    setIsCartDrawerOpen,
    setIsAuthModalOpen,
    setIsSearchModalOpen,
    theme,
    toggleTheme,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    adminLogout,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogoClick = () => {
    setCurrentView('home');
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'خانه', icon: Zap },
    { id: 'games', label: 'بازی‌ها', icon: Gamepad2 },
    { id: 'premium', label: 'اکانت‌های پریمیوم', icon: Sparkles },
    { id: 'giftcards', label: 'گیفت کارت', icon: Gift },
    { id: 'products', label: 'همه محصولات', icon: ShieldCheck },
    { id: 'order-tracking', label: 'پیگیری سفارش', icon: SearchCode },
    { id: 'blog', label: 'وبلاگ و آموزش', icon: BookOpen },
    { id: 'about', label: 'درباره ما', icon: Info },
    { id: 'contact', label: 'تماس با ما', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#020617]/90 border-b border-slate-800/80 transition-all">
      {/* Top Notification Announcement Bar */}
      {siteSettings.showNotificationBar && (
        <div className="bg-indigo-600 text-white font-medium text-xs md:text-sm py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wide shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse shrink-0" />
          <span className="truncate">{siteSettings.notificationBarText}</span>
          <span className="hidden md:inline-flex items-center gap-1 bg-indigo-900/40 border border-indigo-400/30 px-2 py-0.5 rounded-full text-[11px] font-bold mr-2">
            پشتیبانی ۲۴ ساعته: {toPersianDigits(siteSettings.phone)}
          </span>
        </div>
      )}

      {/* Main Header Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Right: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              aria-label="منوی سایت"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <button
              id="brand-logo-btn"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group text-right cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                    {siteSettings.storeName}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    BENTO
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal hidden sm:block">
                  {siteSettings.tagline}
                </span>
              </div>
            </button>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-400">
              {navLinks.slice(0, 5).map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => setCurrentView(link.id as any)}
                    className={`transition-colors pb-1 ${
                      isActive
                        ? 'text-white border-b-2 border-indigo-500 font-bold'
                        : 'hover:text-indigo-400'
                    }`}
                  >
                    <span>{link.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentView('order-tracking')}
                className={`transition-colors pb-1 ${
                  currentView === 'order-tracking'
                    ? 'text-white border-b-2 border-indigo-500 font-bold'
                    : 'hover:text-indigo-400 text-indigo-300'
                }`}
              >
                پیگیری سفارش
              </button>
            </nav>
          </div>

          {/* Left: Actions (Search, Theme Toggle, Cart, User, Admin) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              id="header-search-trigger"
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl text-xs transition-all shadow-inner group cursor-pointer"
              title="جستجوی سریع محصولات"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">جستجو...</span>
              <kbd className="hidden md:inline-flex bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                /
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-400 rounded-xl transition-all flex items-center justify-center cursor-pointer group shadow-sm"
              title={theme === 'dark' ? 'تغییر به حالت روز (روشن)' : 'تغییر به حالت شب (تاریک)'}
              aria-label="تغییر تم سایت"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Admin Panel Quick Access - The ONE AND ONLY entrance, at top header of the page */}
            <button
              id="header-admin-btn"
              onClick={() => {
                setIsAdminAuthenticated(false);
                setCurrentView('admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                currentView === 'admin'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800'
              }`}
              title={`پنل مدیریت ${siteSettings.storeName}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">پنل مدیریت</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors group cursor-pointer"
              aria-label="سبد خرید"
            >
              <ShoppingCart className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#020617] animate-pulse">
                  {toPersianDigits(cartTotalItems)}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl text-sm transition-colors"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-6 h-6 rounded-full object-cover border border-indigo-500/50"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                      {(currentUser.fullName || currentUser.name || 'U').charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-slate-800"
                    >
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400">حساب کاربری</p>
                          {currentUser.gamerTag && (
                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                              {currentUser.gamerTag}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-white truncate">{currentUser.fullName}</p>
                        <p className="text-xs text-indigo-400 mt-0.5">{toPersianDigits(currentUser.mobile)}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setCurrentView('profile');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-right"
                        >
                          <User className="w-4 h-4 text-indigo-400" />
                          <span>سفارش‌ها و پروفایل من</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentView('order-tracking');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-right"
                        >
                          <SearchCode className="w-4 h-4 text-indigo-400" />
                          <span>پیگیری سفارش</span>
                        </button>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            logoutUser();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>خروج از حساب</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/98 border-b border-slate-800 px-4 py-5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentView(link.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-right transition-colors ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">

              {/* Mobile Theme Switcher */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <span>حالت نمایش سایت: {theme === 'dark' ? 'حالت شب (تاریک)' : 'حالت روز (روشن)'}</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {theme === 'dark' ? 'تغییر به روز' : 'تغییر به شب'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-2 py-1">
                <span>تلفن پشتیبانی {siteSettings.storeName}:</span>
                <span className="font-bold text-slate-200">{toPersianDigits(siteSettings.phone)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
