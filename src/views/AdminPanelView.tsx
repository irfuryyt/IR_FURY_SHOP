import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductPackage, Order, BlogPost, Coupon, SiteSettings } from '../types';
import { formatToman, toPersianDigits } from '../utils/helpers';
import { PRESET_IMAGES, PresetImage } from '../data/presetImages';
import { SalesAnalyticsWidget } from '../components/SalesAnalyticsWidget';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  FileText,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
  X,
  Search,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Percent,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  ShieldCheck,
  Lock,
  KeyRound,
  LogOut,
  RefreshCw,
  Layers,
  Phone,
  MessageSquare,
  ExternalLink,
  ZoomIn,
  FileCheck,
  CreditCard,
  Copy,
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    deleteOrder,
    verifyOrderReceipt,
    siteSettings,
    updateSiteSettings,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    toggleProductStock,
    resetToInitialData,
    setCurrentView,
    showToast,
    currentUser,
    setIsAuthModalOpen,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    adminCredentials,
    updateAdminCredentials,
    adminLogin,
    adminLogout,
  } = useStore();

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin credentials update state in Settings tab
  const [newAdminUsername, setNewAdminUsername] = useState(adminCredentials?.username || 'IR_FURY_YT');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'images' | 'orders' | 'settings' | 'blog' | 'coupons'>('dashboard');

  // Orders Tab Filter & State
  const [orderFilterTab, setOrderFilterTab] = useState<'all' | 'receipts' | 'processing' | 'completed' | 'cancelled'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Image Manager inside Product Form
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url' | 'presets'>('presets');
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<'all' | 'games' | 'premium' | 'giftcards'>('all');

  // Quick Image Replacer modal in Images Tab
  const [quickImageTargetProduct, setQuickImageTargetProduct] = useState<Product | null>(null);
  const [quickImageTempUrl, setQuickImageTempUrl] = useState('');
  const [imagesCategoryFilter, setImagesCategoryFilter] = useState<'all' | 'games' | 'premium' | 'giftcards'>('all');
  const [imagesSearch, setImagesSearch] = useState('');
  const [modalImageTab, setModalImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDraggingModal, setIsDraggingModal] = useState(false);

  // Blog Editing State
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isNewBlog, setIsNewBlog] = useState(false);

  // New Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState<number>(10);

  // Handle Admin Login (Strictly validates username and password)
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername.trim()) {
      setLoginError('لطفاً نام کاربری مدیر را وارد نمایید.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('لطفاً کلمه عبور را وارد نمایید.');
      return;
    }
    const success = adminLogin(loginUsername, loginPassword);
    if (!success) {
      setLoginError('نام کاربری یا کلمه عبور وارد شده نادرست است. دسترسی فقط برای مدیر مجاز است.');
    } else {
      setLoginUsername('');
      setLoginPassword('');
    }
  };

  // Handle Changing Admin Credentials
  const handleSaveAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim()) {
      showToast('نام کاربری نمی‌تواند خالی باشد', 'error');
      return;
    }
    if (!newAdminPassword.trim()) {
      showToast('لطفاً کلمه عبور جدید را وارد کنید', 'error');
      return;
    }
    const ok = updateAdminCredentials(newAdminUsername, newAdminPassword);
    if (ok) {
      setNewAdminPassword('');
    }
  };

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => (o.status === 'completed' || o.status === 'processing' ? sum + o.totalAmount : sum), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'processing' || o.status === 'pending').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;

  // Handler for starting product edit
  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(prod)));
    setIsNewProduct(false);
  };

  const handleStartNewProduct = () => {
    const newProd: Product = {
      id: `custom-prod-${Date.now()}`,
      title: 'محصول جدید',
      englishTitle: 'New Digital Item',
      category: 'games',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      shortDescription: 'توضیح کوتاه محصول و خدمات شارژ',
      fullDescription: 'توضیحات کامل و راهنمای سفارش این آیتم دیجیتال',
      deliveryTime: '۵ الی ۱۵ دقیقه',
      rating: 5.0,
      reviewCount: 1,
      packages: [
        {
          id: `pkg-${Date.now()}-1`,
          title: 'بسته پایه ۱۰۰ تایی',
          amount: 100,
          price: 95000,
          originalPrice: 120000,
        },
      ],
      customFields: [
        {
          id: 'player_id',
          label: 'آیدی عددی (Player ID)',
          placeholder: 'مثال: 684910284',
          type: 'text',
          required: true,
        },
      ],
      tags: ['جدید', 'بازی'],
    };
    setEditingProduct(newProd);
    setIsNewProduct(true);
  };

  // Handle File Upload from device or dropzone
  const processImageForAdmin = (file: File, isQuickModal = false) => {
    if (!file.type.startsWith('image/')) {
      showToast('لطفاً فقط فایل تصویری معتبر (PNG, JPG, WEBP, GIF) انتخاب نمایید', 'error');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      showToast('حجم فایل تصویر نباید بیش از ۱۲ مگابایت باشد', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (isQuickModal) {
        setQuickImageTempUrl(dataUrl);
      } else if (editingProduct) {
        setEditingProduct({ ...editingProduct, image: dataUrl });
      }
      showToast('تصویر با موفقیت پردازش و بارگذاری شد', 'success');
    };
    reader.onerror = () => {
      showToast('خطا در بارگذاری فایل تصویر', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isQuickModal = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageForAdmin(file, isQuickModal);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('لطفاً یک فایل تصویری (JPG, PNG یا WEBP) انتخاب کنید', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateSiteSettings({ bannerImageUrl: result, bannerImageActive: true });
        showToast('بنر جدید فروشگاه با موفقیت بارگذاری و اعمال شد', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateSiteSettings({ storeLogoUrl: result });
        showToast('لوگوی جدید فروشگاه با موفقیت بارگذاری و اعمال شد', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.title.trim()) {
      showToast('عنوان محصول الزامی است', 'error');
      return;
    }

    if (isNewProduct) {
      addProduct(editingProduct);
      showToast('محصول جدید با موفقیت اضافه شد', 'success');
    } else {
      updateProduct(editingProduct);
      showToast('تغییرات محصول با موفقیت ذخیره گردید', 'success');
    }
    setEditingProduct(null);
  };

  // Add / Remove Package within Editing Product
  const handleAddPackage = () => {
    if (!editingProduct) return;
    const newPkg: ProductPackage = {
      id: `pkg-${Date.now()}`,
      title: 'بسته جدید',
      amount: 100,
      price: 100000,
    };
    setEditingProduct({
      ...editingProduct,
      packages: [...editingProduct.packages, newPkg],
    });
  };

  const handleRemovePackage = (pkgId: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      packages: editingProduct.packages.filter((p) => p.id !== pkgId),
    });
  };

  const handlePackageChange = (index: number, field: keyof ProductPackage, value: any) => {
    if (!editingProduct) return;
    const updated = [...editingProduct.packages];
    updated[index] = { ...updated[index], [field]: value };
    setEditingProduct({ ...editingProduct, packages: updated });
  };

  // Quick image save
  const handleSaveQuickImage = () => {
    if (!quickImageTargetProduct || !quickImageTempUrl) return;
    updateProduct(quickImageTargetProduct.id, { image: quickImageTempUrl });
    showToast(`تصویر ${quickImageTargetProduct.title} با موفقیت به‌روزرسانی شد`, 'success');
    setQuickImageTargetProduct(null);
    setQuickImageTempUrl('');
  };

  // Coupon Creation
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      showToast('کد تخفیف را وارد کنید', 'error');
      return;
    }
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      percent: Number(newCouponPercent),
      active: true,
    });
    setNewCouponCode('');
    showToast('کد تخفیف اضافه شد', 'success');
  };

  const filteredProductsList = products.filter(
    (p) => p.title.includes(productSearch) || p.englishTitle?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredPresets = PRESET_IMAGES.filter((img) =>
    selectedPresetCategory === 'all' ? true : img.category === selectedPresetCategory
  );

  // ==========================================
  // IF NOT AUTHENTICATED -> SHOW STRICT ACCESS GATE
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="py-12 sm:py-20 max-w-md mx-auto px-4 text-right">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">ورود اختصاصی مدیریت {siteSettings.storeName}</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              این بخش کاملاً محافظت‌شده است و تنها مدیر با نام کاربری و رمز عبور اختصاصی امکان دسترسی دارد.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-950/70 border border-rose-800 text-rose-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نام کاربری مدیر (Username)
              </label>
              <input
                type="text"
                dir="ltr"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="نام کاربری مدیر..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-3 text-sm text-white font-mono outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                کلمه عبور امنیتی (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-3 text-sm text-white font-mono outline-none transition-all pl-10 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'مخفی‌سازی رمز' : 'نمایش رمز'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>ورود به پنل مدیریت</span>
            </button>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>دسترسی اختصاصی مدیریت با احراز هویت دوطرفه و کلمه عبور رمزگذاری‌شده.</span>
            </div>
          </form>

          <div className="pt-2 text-center border-t border-slate-800/80">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              ← بازگشت به صفحه اصلی فروشگاه
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN PANEL
  // ==========================================
  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>سامانه جامع مدیریت و کنترل فروشگاه {siteSettings.storeName}</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono">
              مدیر آنلاین: IR_FURY_YT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            پنل مدیریت و تنظیمات کل سایت
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            دسترسی به کلیه قیمت‌ها، محصولات، سفارشات، تصاویر بازی‌ها، بنرها و اطلاعات سایت
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>مشاهده سایت</span>
          </button>

          <button
            onClick={adminLogout}
            className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-rose-800/50 transition-colors cursor-pointer"
            title="خروج از پنل مدیریت"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از مدیریت</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'dashboard', label: 'داشبورد آمار', icon: LayoutDashboard },
          { id: 'products', label: `محصولات و قیمت‌ها (${toPersianDigits(products.length)})`, icon: Package },
          { id: 'images', label: 'مدیریت و تغییر تصاویر', icon: ImageIcon },
          { id: 'orders', label: `سفارشات (${toPersianDigits(orders.length)})`, icon: ShoppingBag },
          { id: 'settings', label: 'تنظیمات و بنرها', icon: Sliders },
          { id: 'coupons', label: 'کدهای تخفیف', icon: Tag },
          { id: 'blog', label: 'مدیریت مقالات', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setEditingProduct(null);
                setEditingBlog(null);
              }}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-bold">فروش کل تایید شده</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block mb-1">
                {formatToman(totalRevenue)}
              </span>
              <span className="text-[11px] text-slate-500">از سفارشات تکمیل شده و فعال</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-bold">سفارشات در صف واریز</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-black text-amber-400 block mb-1">
                {toPersianDigits(pendingOrdersCount)} سفارش
              </span>
              <span className="text-[11px] text-slate-500">نیاز به تایید یا شارژ اپراتور</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-bold">تعداد محصولات فعال</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-black text-indigo-300 block mb-1">
                {toPersianDigits(products.length)} آیتم
              </span>
              <span className="text-[11px] text-slate-500">در ۳ دسته بازی، پریمیوم و گیفت</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-bold">سفارشات تکمیل شده</span>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-black text-sky-400 block mb-1">
                {toPersianDigits(completedOrdersCount)} موفق
              </span>
              <span className="text-[11px] text-slate-500">با رضایت کامل کاربران</span>
            </div>
          </div>

          {/* Real-time Sales Statistics & Recharts Line Chart Widget */}
          <SalesAnalyticsWidget />

          {/* Quick Actions Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white">عملیات سریع مدیر:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setActiveTab('products');
                  handleStartNewProduct();
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold p-4 rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن محصول جدید</span>
              </button>

              <button
                onClick={() => setActiveTab('images')}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold p-4 rounded-2xl text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>تغییر سریع تصاویر محصولات</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold p-4 rounded-2xl text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>تنظیمات و بنرهای تخفیف</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold p-4 rounded-2xl text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>بررسی صف سفارشات</span>
              </button>
            </div>
          </div>

          {/* Recent Orders in Dashboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">آخرین سفارش‌های ثبت شده</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-indigo-400 hover:underline font-bold"
              >
                مشاهده همه
              </button>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{ord.customerName}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{ord.customerMobile}</span>
                      <span className="text-slate-500">• {ord.createdAt}</span>
                    </div>
                    <p className="text-slate-300">
                      {ord.items.map((i) => `${i.product.title} (${i.selectedPackage.title})`).join('، ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-amber-400">{formatToman(ord.totalAmount)}</span>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-[11px] font-bold text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="processing">در حال انجام</option>
                      <option value="completed">تکمیل شده</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & PACKAGES MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {editingProduct ? (
            /* Product Edit / Create Form */
            <form onSubmit={handleSaveProduct} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-indigo-400" />
                  <span>{isNewProduct ? 'افزودن محصول جدید' : `ویرایش محصول: ${editingProduct.title}`}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    عنوان فارسی محصول <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    عنوان انگلیسی
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingProduct.englishTitle || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, englishTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    دسته‌بندی اصلی
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="games">بازی‌ها (CP، UC و جم)</option>
                    <option value="premium">اکانت‌ها و اشتراک‌های پریمیوم</option>
                    <option value="giftcards">انواع گیفت کارت اورجینال</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    زمان تخمینی تحویل
                  </label>
                  <input
                    type="text"
                    value={editingProduct.deliveryTime}
                    onChange={(e) => setEditingProduct({ ...editingProduct, deliveryTime: e.target.value })}
                    placeholder="مثال: ۵ الی ۱۵ دقیقه"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    درصد تخفیف (در صورت وجود)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.discountPercent || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    وضعیت موجودی در انبار
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, inStock: !(editingProduct.inStock ?? true) })}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      editingProduct.inStock !== false
                        ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-600 text-rose-300'
                    }`}
                  >
                    <span>{editingProduct.inStock !== false ? 'موجود در انبار و قابل سفارش' : 'ناموجود (سفارش غیرفعال)'}</span>
                    <span className={`w-3 h-3 rounded-full ${editingProduct.inStock !== false ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  </button>
                </div>
              </div>

              {/* ========================================== */}
              {/* COMPREHENSIVE IMAGE MANAGER SUITE */}
              {/* ========================================== */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-400" />
                      <span>تصویر محصول و بازی</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      تصویر را از کامپیوتر آپلود کنید، لینک وارد نمایید، یا از گالری آماده انتخاب کنید.
                    </p>
                  </div>

                  {/* Mode selector buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('presets')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        imageInputMode === 'presets'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      گالری آماده
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        imageInputMode === 'upload'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      آپلود فایل
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      لینک تصویر
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Current Image Preview */}
                  <div className="md:col-span-1 flex flex-col items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400">پیش‌نمایش تصویر فعلی</span>
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center shadow-md">
                      {editingProduct.image ? (
                        <img
                          src={editingProduct.image}
                          alt={editingProduct.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">تصویر آماده نمایش</span>
                  </div>

                  {/* Mode Content */}
                  <div className="md:col-span-3">
                    {/* MODE 1: PRESETS */}
                    {imageInputMode === 'presets' && (
                      <div className="space-y-3">
                        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                          {[
                            { id: 'all', label: 'همه' },
                            { id: 'games', label: 'بازی‌ها' },
                            { id: 'premium', label: 'پریمیوم' },
                            { id: 'giftcards', label: 'گیفت‌کارت' },
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedPresetCategory(cat.id as any)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                selectedPresetCategory === cat.id
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1">
                          {filteredPresets.map((preset) => {
                            const isSelected = editingProduct.image === preset.url;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  setEditingProduct({ ...editingProduct, image: preset.url });
                                  showToast(`تصویر ${preset.title} انتخاب شد`, 'info');
                                }}
                                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/50'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                                  {preset.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* MODE 2: UPLOAD FROM DEVICE */}
                    {imageInputMode === 'upload' && (
                      <div className="p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl bg-slate-900/60 text-center space-y-3 transition-colors">
                        <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                        <div>
                          <p className="text-xs font-bold text-white">انتخاب و بارگذاری تصویر از کامپیوتر یا موبایل</p>
                          <p className="text-[11px] text-slate-400 mt-1">فرمت‌های پشتیبانی شده: JPG, PNG, WEBP</p>
                        </div>
                        <label className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-md transition-all">
                          <span>انتخاب فایل تصویر...</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* MODE 3: DIRECT URL */}
                    {imageInputMode === 'url' && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-300">
                          آدرس مستقیم تصویر (URL):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            dir="ltr"
                            value={editingProduct.image}
                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono text-left"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          می‌توانید لینک هر عکسی از اینترنت را اینجا قرار دهید تا فوراً بارگذاری شود.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  توضیحات کوتاه
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Packages Editor Section */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    بسته‌ها و قیمت‌های این محصول ({toPersianDigits(editingProduct.packages.length)} بسته):
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPackage}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن بسته جدید</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editingProduct.packages.map((pkg, idx) => (
                    <div
                      key={pkg.id || idx}
                      className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">نام یا عنوان بسته</span>
                        <input
                          type="text"
                          value={pkg.title}
                          onChange={(e) => handlePackageChange(idx, 'title', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">قیمت فروش (تومان)</span>
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(idx, 'price', Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-bold outline-none"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">قیمت قبل از تخفیف</span>
                        <input
                          type="number"
                          value={pkg.originalPrice || ''}
                          onChange={(e) => handlePackageChange(idx, 'originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="اختیاری"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                        />
                      </div>

                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemovePackage(pkg.id)}
                          className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 p-2 rounded-lg hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حذف بسته</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-800 pt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره نهایی تغییرات محصول</span>
                </button>
              </div>
            </form>
          ) : (
            /* Products List View */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-xl">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجو در محصولات و بازی‌ها..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleStartNewProduct}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن محصول جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProductsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-white truncate">{prod.title}</h3>
                        <span className="text-[11px] text-slate-400 block truncate font-mono">
                          {prod.englishTitle || prod.category}
                        </span>
                        <span className="text-[10px] text-indigo-400 font-bold mt-1 inline-block">
                          {toPersianDigits(prod.packages.length)} بسته قیمتی فعال
                        </span>
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(prod.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                              prod.inStock !== false
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            }`}
                          >
                            {prod.inStock !== false ? '✓ موجود در انبار' : '✕ ناموجود (کلیک برای فعال‌سازی)'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        از {formatToman(prod.packages[0]?.price || 0)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setQuickImageTargetProduct(prod);
                            setQuickImageTempUrl(prod.image);
                            setModalImageTab('upload');
                          }}
                          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          title="تغییر سریع تصویر"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                          <span>تصویر</span>
                        </button>
                        <button
                          onClick={() => handleStartEditProduct(prod)}
                          className="flex items-center gap-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>ویرایش</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`آیا از حذف محصول ${prod.title} مطمئن هستید؟`)) {
                              deleteProduct(prod.id);
                              showToast('محصول با موفقیت حذف شد', 'info');
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                          title="حذف محصول"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEDICATED QUICK IMAGE & GAME COVER MANAGER */}
      {activeTab === 'images' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-right">
          {/* Header & Stats */}
          <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                <span>ماژول حرفه‌ای آپلود و مدیریت تصاویر محصولات</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                در این بخش می‌توانید به راحتی تصاویر هر بازی یا محصول را با آپلود مستقیم از گوشی/کامپیوتر، لینک اینترنتی یا کاورهای آماده به‌روزرسانی کنید.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl font-bold">
                {toPersianDigits(products.length)} محصول در فروشگاه
              </span>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={imagesSearch}
                onChange={(e) => setImagesSearch(e.target.value)}
                placeholder="جستجوی بازی یا محصول برای تغییر کاور..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
              />
              {imagesSearch && (
                <button
                  onClick={() => setImagesSearch('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'همه محصولات' },
                { id: 'games', label: '🎮 بازی‌ها' },
                { id: 'premium', label: '⭐ اکانت‌های پریمیوم' },
                { id: 'giftcards', label: '🎁 گیفت کارت‌ها' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setImagesCategoryFilter(cat.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    imagesCategoryFilter === cat.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Image Edit Modal */}
          {quickImageTargetProduct && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl text-right animate-in fade-in duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">
                        ویرایش تصویر: {quickImageTargetProduct.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {quickImageTargetProduct.englishTitle || quickImageTargetProduct.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setQuickImageTargetProduct(null);
                      setQuickImageTempUrl('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Tabs: Upload, URL, Presets */}
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1">
                  <button
                    type="button"
                    onClick={() => setModalImageTab('upload')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      modalImageTab === 'upload'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود فایل از دستگاه</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalImageTab('url')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      modalImageTab === 'url'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>آدرس اینترنتی (URL)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalImageTab('presets')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      modalImageTab === 'presets'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>کاورهای آماده بازی‌ها</span>
                  </button>
                </div>

                {/* Tab 1: Direct File Upload & Drag-and-Drop */}
                {modalImageTab === 'upload' && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingModal(true);
                    }}
                    onDragLeave={() => setIsDraggingModal(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingModal(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        processImageForAdmin(e.dataTransfer.files[0], true);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      isDraggingModal
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <label className="cursor-pointer block space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          برای انتخاب عکس از گوشی یا رایانه کلیک کنید
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          یا فایل عکس را به اینجا بکشید و رها کنید (Drag & Drop)
                        </span>
                      </div>
                      <span className="inline-block text-[10px] text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                        پشتیبانی از فرمت‌های PNG، JPG، WEBP، GIF (حداکثر ۱۲ مگابایت)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Tab 2: URL Input */}
                {modalImageTab === 'url' && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-slate-300">
                      آدرس مستقیم فایل تصویر در وب (URL):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        dir="ltr"
                        value={quickImageTempUrl}
                        onChange={(e) => setQuickImageTempUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono text-left"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (quickImageTempUrl.trim()) {
                            showToast('پیش‌نمایش تصویر بارگذاری شد', 'info');
                          }
                        }}
                        className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        بررسی
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 3: Presets Gallery */}
                {modalImageTab === 'presets' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">انتخاب سریع از کاورهای بازی و اشتراک‌ها:</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setQuickImageTempUrl(preset.url)}
                          className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                            quickImageTempUrl === preset.url
                              ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-16 rounded-lg object-cover mb-1"
                          />
                          <span className="text-[10px] text-slate-200 block truncate font-medium">
                            {preset.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Preview Comparison (Current vs New) */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block mb-3">
                    پیش‌نمایش تغییرات:
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Current Image */}
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                      <span className="text-[10px] text-slate-400 font-bold mb-1.5 block">
                        تصویر فعلی محصول
                      </span>
                      <img
                        src={quickImageTargetProduct.image}
                        alt="Current"
                        className="w-20 h-20 rounded-xl object-cover border border-slate-700 shadow-md"
                      />
                    </div>

                    {/* New Selected Image */}
                    <div className="bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/30 flex flex-col items-center text-center">
                      <span className="text-[10px] text-emerald-400 font-bold mb-1.5 block">
                        تصویر جدید (پیش‌نمایش)
                      </span>
                      <img
                        src={quickImageTempUrl || quickImageTargetProduct.image}
                        alt="New Preview"
                        className="w-20 h-20 rounded-xl object-cover border border-emerald-500/50 shadow-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickImageTargetProduct(null);
                      setQuickImageTempUrl('');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuickImage}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>ذخیره و اعمال تصویر در فروشگاه</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid of All Products Image Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products
              .filter((p) => {
                const matchesSearch =
                  !imagesSearch.trim() ||
                  p.title.toLowerCase().includes(imagesSearch.toLowerCase()) ||
                  (p.englishTitle && p.englishTitle.toLowerCase().includes(imagesSearch.toLowerCase()));
                const matchesCategory =
                  imagesCategoryFilter === 'all' || p.category === imagesCategoryFilter;
                return matchesSearch && matchesCategory;
              })
              .map((prod) => (
                <div
                  key={prod.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-md hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black text-white truncate">{prod.title}</h3>
                      <span className="text-[10px] text-slate-400 block truncate font-mono mt-0.5">
                        {prod.englishTitle || prod.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">
                        ✓ تصویر ثبت شده
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setQuickImageTargetProduct(prod);
                      setQuickImageTempUrl(prod.image);
                      setModalImageTab('upload');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود و تغییر تصویر</span>
                  </button>
                </div>
              ))}
          </div>

          {products.filter((p) => {
            const matchesSearch =
              !imagesSearch.trim() ||
              p.title.toLowerCase().includes(imagesSearch.toLowerCase()) ||
              (p.englishTitle && p.englishTitle.toLowerCase().includes(imagesSearch.toLowerCase()));
            const matchesCategory =
              imagesCategoryFilter === 'all' || p.category === imagesCategoryFilter;
            return matchesSearch && matchesCategory;
          }).length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              هیچ محصولی مطابق با فیلتر یا جستجوی شما یافت نشد.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ORDERS MANAGEMENT WITH RECEIPT INSPECTION & PHONE ACTIONS */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Header & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>مدیریت سفارشات، بررسی فیش‌های واریزی و اطلاعات تماس مشتریان</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                مشاهده شماره تماس مشتری، بررسی و تایید فوری عکس فیش‌های کارت‌به‌کارت و تغییر وضعیت سفارش‌ها
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl font-bold">
                مجموع: {toPersianDigits(orders.length)} سفارش
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold">
                فیش واریزی: {toPersianDigits(orders.filter((o) => !!o.paymentReceiptImage).length)}
              </span>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'all', label: 'همه سفارش‌ها', count: orders.length },
                {
                  id: 'receipts',
                  label: '📷 دارای فیش واریزی',
                  count: orders.filter((o) => !!o.paymentReceiptImage).length,
                },
                {
                  id: 'processing',
                  label: 'در حال انجام (در صف)',
                  count: orders.filter((o) => o.status === 'processing').length,
                },
                {
                  id: 'completed',
                  label: 'تکمیل شده (شارژ شد)',
                  count: orders.filter((o) => o.status === 'completed').length,
                },
                {
                  id: 'cancelled',
                  label: 'لغو شده',
                  count: orders.filter((o) => o.status === 'cancelled').length,
                },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilterTab(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    orderFilterTab === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="text-[10px] opacity-80">({toPersianDigits(f.count)})</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="جستجو با نام، موبایل، کد پیگیری..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders
              .filter((ord) => {
                if (orderFilterTab === 'receipts') return !!ord.paymentReceiptImage;
                if (orderFilterTab === 'processing') return ord.status === 'processing';
                if (orderFilterTab === 'completed') return ord.status === 'completed';
                if (orderFilterTab === 'cancelled') return ord.status === 'cancelled';
                return true;
              })
              .filter((ord) => {
                if (!orderSearch.trim()) return true;
                const q = orderSearch.toLowerCase();
                return (
                  (ord.customerName || '').toLowerCase().includes(q) ||
                  (ord.customerMobile || '').includes(q) ||
                  (ord.trackingCode || '').toLowerCase().includes(q) ||
                  ord.id.toLowerCase().includes(q)
                );
              })
              .map((ord) => {
                const hasReceipt = !!ord.paymentReceiptImage;
                const mobileNum = ord.customerMobile || '09120000000';

                return (
                  <div
                    key={ord.id}
                    className={`bg-slate-950 p-5 rounded-3xl border transition-all ${
                      hasReceipt && ord.receiptStatus === 'submitted'
                        ? 'border-amber-500/60 shadow-lg shadow-amber-500/5 bg-gradient-to-l from-slate-950 via-slate-950 to-amber-950/20'
                        : ord.status === 'completed'
                        ? 'border-emerald-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    } flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5`}
                  >
                    {/* Left: Customer & Items Info */}
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Customer & Mobile Bar */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-black text-white text-sm">{ord.customerName}</span>

                        {/* Customer Phone Pill with Direct Action Buttons */}
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-mono text-amber-300 text-xs font-bold" dir="ltr">
                            {mobileNum}
                          </span>
                          <a
                            href={`tel:${mobileNum}`}
                            className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
                            title="تماس مستقیم با مشتری"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(mobileNum);
                              setCopiedOrderId(ord.id);
                              showToast(`شماره تماس ${mobileNum} کپی شد`, 'info');
                              setTimeout(() => setCopiedOrderId(null), 2000);
                            }}
                            className="p-1 hover:text-amber-400 text-slate-400 transition-colors cursor-pointer"
                            title="کپی شماره"
                          >
                            {copiedOrderId === ord.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Tracking Code */}
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                          کد: {ord.trackingCode}
                        </span>

                        {/* Order Time */}
                        <span className="text-[11px] text-slate-500">{ord.createdAt}</span>

                        {/* Receipt Status Badge */}
                        {hasReceipt && (
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              ord.receiptStatus === 'verified'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : ord.receiptStatus === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            }`}
                          >
                            <FileCheck className="w-3 h-3" />
                            <span>
                              {ord.receiptStatus === 'verified'
                                ? 'فیش تایید شده'
                                : ord.receiptStatus === 'rejected'
                                ? 'فیش رد شده'
                                : '📷 فیش ارسالی جدید'}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Items Purchased */}
                      <div className="flex flex-wrap items-center gap-2">
                        {ord.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-xl text-xs"
                          >
                            <img
                              src={it.product.image}
                              alt={it.product.title}
                              className="w-5 h-5 rounded-md object-cover"
                            />
                            <span className="font-bold text-white">{it.product.title}</span>
                            <span className="text-amber-400 text-[11px]">({it.selectedPackage.title})</span>
                            {Object.entries(it.customFieldValues).map(([k, v]) => (
                              <span key={k} className="text-[10px] text-indigo-300 font-mono">
                                [{k}: {v}]
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Payment Method & Notes */}
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-4">
                        <span>روش پرداخت: <strong className="text-slate-200">{ord.paymentMethod || 'کارت به کارت'}</strong></span>
                        {ord.receiptRefNumber && (
                          <span>شماره پیگیری فیش: <strong className="text-amber-300 font-mono">{ord.receiptRefNumber}</strong></span>
                        )}
                        {ord.receiptNotes && (
                          <span className="text-slate-300">یادداشت مشتری: «{ord.receiptNotes}»</span>
                        )}
                      </div>
                    </div>

                    {/* Right: Receipt Button, Amount, Status & Actions */}
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 self-end lg:self-center shrink-0">
                      {/* Receipt Action Button if Available */}
                      {hasReceipt ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReceiptOrder(ord);
                            setRejectionNote(ord.receiptRejectionReason || '');
                          }}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>مشاهده و بررسی فیش</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 bg-slate-900 px-2.5 py-1.5 rounded-xl">
                          بدون فایل فیش
                        </span>
                      )}

                      {/* Total Amount */}
                      <span className="font-black text-amber-400 text-sm whitespace-nowrap">
                        {formatToman(ord.totalAmount)}
                      </span>

                      {/* Status Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className={`border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer ${
                          ord.status === 'completed'
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : ord.status === 'processing'
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                            : 'bg-slate-900 border-slate-700 text-slate-200'
                        }`}
                      >
                        <option value="processing">در حال انجام (در صف)</option>
                        <option value="completed">تکمیل شده (شارژ شد)</option>
                        <option value="cancelled">لغو شده</option>
                      </select>

                      {/* Delete Order */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`آیا از حذف سفارش ${ord.trackingCode} اطمینان دارید؟`)) {
                            deleteOrder(ord.id);
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                        title="حذف سفارش"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

            {orders.length === 0 && (
              <div className="text-center py-12 bg-slate-950 rounded-3xl border border-slate-800">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400">هیچ سفارشی یافت نشد.</p>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* RECEIPT INSPECTION & VERIFICATION MODAL                            */}
          {/* ================================================================= */}
          {selectedReceiptOrder && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-right max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-black text-white">
                      بررسی عکس فیش واریزی سفارش: {selectedReceiptOrder.trackingCode}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptOrder(null)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Receipt Image Display */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  {selectedReceiptOrder.paymentReceiptImage ? (
                    <div className="space-y-2">
                      <img
                        src={selectedReceiptOrder.paymentReceiptImage}
                        alt="فیش واریزی"
                        className="max-h-96 w-auto mx-auto rounded-xl object-contain shadow-2xl border border-slate-700"
                      />
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <a
                          href={selectedReceiptOrder.paymentReceiptImage}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold bg-indigo-950/40 border border-indigo-500/30 px-3 py-1 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>باز کردن تصویر در اندازه اصلی و تب جدید</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-8">عکسی برای این سفارش ارسال نشده است.</p>
                  )}
                </div>

                {/* Receipt Details Card */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">نام و شماره تماس خریدار:</span>
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span>{selectedReceiptOrder.customerName}</span>
                      <span className="font-mono text-amber-400">({selectedReceiptOrder.customerMobile})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">مبلغ دقیق فاکتور:</span>
                    <span className="font-black text-amber-400 text-sm">
                      {formatToman(selectedReceiptOrder.totalAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">کد پیگیری / ۴ رقم کارت واریزی:</span>
                    <span className="font-mono font-bold text-white">
                      {selectedReceiptOrder.receiptRefNumber || 'ثبت نشده'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">زمان ارسال فیش:</span>
                    <span className="text-slate-300">
                      {selectedReceiptOrder.receiptSubmittedAt || selectedReceiptOrder.createdAt}
                    </span>
                  </div>

                  {selectedReceiptOrder.receiptNotes && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-800">
                      <span className="text-slate-400 block mb-0.5">یادداشت مشتری:</span>
                      <p className="text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                        {selectedReceiptOrder.receiptNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reject Note Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    توضیحات در صورت رد فیش (برای اطلاع مشتری در استعلام سفارش):
                  </label>
                  <input
                    type="text"
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    placeholder="مثال: مبلغ واریزی با فاکتور مطابقت ندارد / تصویر ناخوانا است..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-rose-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      verifyOrderReceipt(
                        selectedReceiptOrder.id,
                        false,
                        rejectionNote.trim() || 'فیش واریزی نامعتبر یا ناخوانا است'
                      );
                      setSelectedReceiptOrder(null);
                    }}
                    className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/60 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>رد فیش واریزی</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateOrderStatus(selectedReceiptOrder.id, 'processing', 'فیش بررسی شد و در صف واریز جم قرار گرفت.');
                      showToast('سفارش در وضعیت در حال شارژ قرار گرفت', 'info');
                      setSelectedReceiptOrder(null);
                    }}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>تایید اولیه (در حال شارژ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      verifyOrderReceipt(selectedReceiptOrder.id, true, 'فیش واریزی تایید و اکانت با موفقیت شارژ گردید.');
                      setSelectedReceiptOrder(null);
                    }}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>تایید نهایی فیش و تکمیل سفارش (شارژ شد)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SITE SETTINGS & BANNERS */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <span>تنظیمات سراسری سایت، هویت برند، بنرها و اطلاعات تماس</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تمامی فیلدهای زیر در کل سایت (هدر، فوتر، صفحه اصلی، درباره ما و تماس با ما) به صورت زنده اعمال می‌شوند.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('تمامی تغییرات تنظیمات سایت ذخیره گردید', 'success');
                }}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>مشاهده سایت</span>
              </button>
            </div>
          </div>

          {/* Section 0: Admin Security & Custom Credentials (User & Pass) */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-950 to-slate-950 p-5 sm:p-6 rounded-2xl border-2 border-indigo-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/40 pb-3">
              <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2 border-r-2 border-indigo-500 pr-2.5">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>تنظیمات نام کاربری و کلمه عبور مدیر (یوزر و پسورد من)</span>
              </h3>
              <span className="text-[11px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30 font-mono">
                نام کاربری فعال: {adminCredentials?.username || 'IR_FURY_YT'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              شما می‌توانید نام کاربری و رمز ورود اختصاصی خود را در این بخش تعیین یا تغییر دهید. با این کار، فقط خودتان با این اطلاعات قادر به ورود به پنل مدیریت خواهید بود و هیچ کاربر عادی یا فرد دیگری نمی‌تواند به مدیریت وارد شود.
            </p>

            <form onSubmit={handleSaveAdminCredentials} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام کاربری مدیر (Username)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  placeholder="مثال: IR_FURY_YT یا نام دلخواه شما"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  کلمه عبور جدید مدیر (Password)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    dir="ltr"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="رمز عبور دلخواه جدید..."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>ذخیره نام کاربری و رمز عبور اختصاصی مدیر</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section: Banner & Media Management (Upload & URL) */}
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border-2 border-indigo-500/30 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">مدیریت بنر اصلی و تصاویر رسانه‌ای سایت</h3>
                  <p className="text-[11px] text-slate-400">آپلود عکس بنر از کامپیوتر/موبایل یا درج لینک مستقیم با پیش‌نمایش آنی در صفحه اصلی</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={siteSettings.bannerImageActive !== false}
                    onChange={(e) => updateSiteSettings({ bannerImageActive: e.target.checked })}
                    className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                  />
                  <span>نمایش بنر در صفحه اصلی</span>
                </label>
              </div>
            </div>

            {/* Banner Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center items-center text-center overflow-hidden">
                <p className="text-xs font-bold text-slate-300 mb-2 w-full text-right flex items-center justify-between">
                  <span>پیش‌نمایش زنده بنر اصلی فروشگاه:</span>
                  {siteSettings.bannerImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings({ bannerImageUrl: '' });
                        showToast('بنر اختصاصی حذف شد و به حالت پیش‌فرض بازگشت', 'info');
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف بنر</span>
                    </button>
                  )}
                </p>

                <div className="w-full h-44 sm:h-52 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                  {siteSettings.bannerImageUrl ? (
                    <img
                      src={siteSettings.bannerImageUrl}
                      alt="بنر اختصاصی فروشگاه"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="text-slate-500 flex flex-col items-center gap-2 p-4">
                      <ImageIcon className="w-10 h-10 text-slate-600" />
                      <span className="text-xs">هنوز تصویری برای بنر بارگذاری نشده است (استفاده از پس‌زمینه پیش‌فرض)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload & URL Controls */}
              <div className="lg:col-span-6 space-y-4">
                {/* 1. Upload from Device */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ۱. آپلود مستقیم فایل بنر از دستگاه شما (فایل ارسالی):
                  </label>
                  <label className="flex items-center justify-center gap-2.5 p-4 bg-slate-900/80 hover:bg-slate-900 border border-dashed border-indigo-500/50 hover:border-indigo-400 rounded-xl cursor-pointer transition-all group">
                    <Upload className="w-5 h-5 text-indigo-400 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-xs text-slate-300 group-hover:text-white font-medium">
                      کلیک کنید یا فایل بنر را انتخاب نمایید (JPG, PNG یا WEBP تا ۵MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 2. Direct Image URL Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ۲. یا درج آدرس اینترنتی مستقیم عکس بنر (Direct Image URL):
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        dir="ltr"
                        value={siteSettings.bannerImageUrl || ''}
                        onChange={(e) => updateSiteSettings({ bannerImageUrl: e.target.value, bannerImageActive: true })}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500"
                      />
                      <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {siteSettings.bannerImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          updateSiteSettings({ bannerImageUrl: '' });
                          showToast('آدرس بنر پاک شد', 'info');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 cursor-pointer"
                      >
                        پاک کردن
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Preset Gaming Banners */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ۳. یا انتخاب فوری از پس‌زمینه‌های گیمینگ آماده با کیفیت:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings({
                          bannerImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
                          bannerImageActive: true,
                        });
                        showToast('بنر گیمینگ نئونی اعمال شد', 'success');
                      }}
                      className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-[11px] text-slate-300 hover:text-white transition-all text-center cursor-pointer"
                    >
                      <div className="h-10 rounded-lg overflow-hidden mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"
                          alt="تم گیمینگ"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>گیمینگ نئونی</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings({
                          bannerImageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
                          bannerImageActive: true,
                        });
                        showToast('بنر کنسول و کنترلر اعمال شد', 'success');
                      }}
                      className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-[11px] text-slate-300 hover:text-white transition-all text-center cursor-pointer"
                    >
                      <div className="h-10 rounded-lg overflow-hidden mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80"
                          alt="تم کنسول"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>کنترلر گیمینگ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings({
                          bannerImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
                          bannerImageActive: true,
                        });
                        showToast('بنر رترو سایبر اعمال شد', 'success');
                      }}
                      className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-[11px] text-slate-300 hover:text-white transition-all text-center cursor-pointer"
                    >
                      <div className="h-10 rounded-lg overflow-hidden mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80"
                          alt="تم سایبر"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>سایبرپانک</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Brand & Headings */}
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 border-r-2 border-indigo-500 pr-2.5">
              <span>۱. نام و هویت برند فروشگاه</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام اصلی فروشگاه (Store Name)
                </label>
                <input
                  type="text"
                  value={siteSettings.storeName}
                  onChange={(e) => updateSiteSettings({ storeName: e.target.value })}
                  placeholder="مثال: FURY_SHOP"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شعار کوتاه برند (Tagline)
                </label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={(e) => updateSiteSettings({ tagline: e.target.value })}
                  placeholder="مثال: مرجع تخصصی خرید جم، سی پی و گیفت کارت"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  تیتر بزرگ هیرو در صفحه اصلی (Headline)
                </label>
                <input
                  type="text"
                  value={siteSettings.heroHeadline}
                  onChange={(e) => updateSiteSettings({ heroHeadline: e.target.value })}
                  placeholder="مثال: خرید آنی سی پی، یوسی، جم بازی‌ها و گیفت کارت"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  متن توضیحی زیر تیتر صفحه اصلی (Subheadline)
                </label>
                <input
                  type="text"
                  value={siteSettings.heroSubheadline}
                  onChange={(e) => updateSiteSettings({ heroSubheadline: e.target.value })}
                  placeholder="توضیحات و مزایای رقابتی سایت..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 border-r-2 border-indigo-500 pr-2.5">
              <span>۲. اطلاعات تماس، پشتیبانی و آدرس فیزیکی</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  تلفن تماس و پشتیبانی
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteSettings.phone}
                  onChange={(e) => updateSiteSettings({ phone: e.target.value })}
                  placeholder="021-91015482"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  آدرس ایمیل رسمی (Email)
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={siteSettings.email}
                  onChange={(e) => updateSiteSettings({ email: e.target.value })}
                  placeholder="support@furyshap.ir"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ساعات کاری و پاسخگویی
                </label>
                <input
                  type="text"
                  value={siteSettings.workingHours}
                  onChange={(e) => updateSiteSettings({ workingHours: e.target.value })}
                  placeholder="مثال: ۲۴ ساعته در تمام روزهای هفته"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  آدرس دفتر یا مرکز پشتیبانی
                </label>
                <input
                  type="text"
                  value={siteSettings.address}
                  onChange={(e) => updateSiteSettings({ address: e.target.value })}
                  placeholder="تهران، خیابان ولیعصر، برج فناوری..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Social Media & Messengers */}
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 border-r-2 border-indigo-500 pr-2.5">
              <span>۳. شبکه‌های اجتماعی و پیام‌رسان‌ها</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  آیدی کانال / ربات تلگرام
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteSettings.telegramUsername}
                    onChange={(e) => updateSiteSettings({ telegramUsername: e.target.value.replace('@', '') })}
                    placeholder="fury_shap"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500 pl-7"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره واتس‌اپ پشتیبانی
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteSettings.whatsappNumber}
                  onChange={(e) => updateSiteSettings({ whatsappNumber: e.target.value })}
                  placeholder="09120000000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  آیدی صفحه اینستاگرام
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteSettings.instagramUsername}
                    onChange={(e) => updateSiteSettings({ instagramUsername: e.target.value.replace('@', '') })}
                    placeholder="fury_shap"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500 pl-7"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Announcement Bar */}
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 border-r-2 border-indigo-500 pr-2.5">
                <span>۴. نوار اعلان متحرک بالای سایت (Announcement Bar)</span>
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={siteSettings.showNotificationBar}
                  onChange={(e) => updateSiteSettings({ showNotificationBar: e.target.checked })}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span>نمایش نوار اعلان</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                متن پیام اعلان بالای صفحات
              </label>
              <input
                type="text"
                value={siteSettings.notificationBarText}
                onChange={(e) => updateSiteSettings({ notificationBarText: e.target.value })}
                placeholder="🔥 تخفیف‌های شگفت‌انگیز آخر هفته..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 5: Special Promo Banner */}
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 border-r-2 border-indigo-500 pr-2.5">
                <span>۵. بنر پیشنهاد ویژه و تخفیف شگفت‌انگیز صفحه اصلی</span>
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={siteSettings.specialBannerActive}
                  onChange={(e) => updateSiteSettings({ specialBannerActive: e.target.checked })}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span>فعال بودن بنر تخفیف</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان بنر</label>
                <input
                  type="text"
                  value={siteSettings.specialBannerTitle}
                  onChange={(e) => updateSiteSettings({ specialBannerTitle: e.target.value })}
                  placeholder="پیشنهاد طلایی ویژه این هفته"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">زیرعنوان و توضیحات بنر</label>
                <input
                  type="text"
                  value={siteSettings.specialBannerSubtitle}
                  onChange={(e) => updateSiteSettings({ specialBannerSubtitle: e.target.value })}
                  placeholder="تخفیف استثنایی روی تمامی پک‌های سی پی و یوسی"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">برچسب درصد تخفیف</label>
                <input
                  type="text"
                  value={siteSettings.specialBannerDiscount}
                  onChange={(e) => updateSiteSettings({ specialBannerDiscount: e.target.value })}
                  placeholder="تا ۲۵٪ تخفیف"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">کد تخفیف اختصاصی بنر</label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteSettings.specialBannerCoupon}
                  onChange={(e) => updateSiteSettings({ specialBannerCoupon: e.target.value.toUpperCase() })}
                  placeholder="FURY25"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Bank Card Details for Customer Payment */}
          <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-amber-500/30 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 border-r-2 border-amber-500 pr-2.5">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>۶. اطلاعات کارت بانکی مدیریت جهت دریافت وجه و کارت‌به‌کارت مشتریان</span>
            </h3>
            <p className="text-xs text-slate-400">
              این اطلاعات در صفحه پرداخت به عنوان شماره کارت اصلی فروشگاه به مشتریان نشان داده می‌شود تا وجه را واریز و عکس فیش را ارسال کنند.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره کارت ۱۶ رقمی مدیریت
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteSettings.bankCardNumber || ''}
                  onChange={(e) => updateSiteSettings({ bankCardNumber: e.target.value })}
                  placeholder="۶۰۳۷-۹۹۷۵-۸۸۴۲-۱۲۳۴"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-wider outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام و نام خانوادگی صاحب کارت (مدیریت)
                </label>
                <input
                  type="text"
                  value={siteSettings.bankCardHolder || ''}
                  onChange={(e) => updateSiteSettings({ bankCardHolder: e.target.value })}
                  placeholder="ایوب پشمکی (مدیریت فروشگاه FURY_SHOP)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">نام بانک</label>
                <input
                  type="text"
                  value={siteSettings.bankName || ''}
                  onChange={(e) => updateSiteSettings({ bankName: e.target.value })}
                  placeholder="بانک ملی ایران"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">شماره شبا (اختیاری)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteSettings.bankShabaNumber || ''}
                  onChange={(e) => updateSiteSettings({ bankShabaNumber: e.target.value })}
                  placeholder="IR120170000000123456789012"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  متن راهنمای واریز و شرایط ارسال رسید برای مشتری
                </label>
                <textarea
                  rows={2}
                  value={siteSettings.paymentInstructions || ''}
                  onChange={(e) => updateSiteSettings({ paymentInstructions: e.target.value })}
                  placeholder="مبلغ سفارش را به شماره کارت فوق کارت‌به‌کارت کرده و عکس واضح رسید را بارگذاری نمایید..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('آیا مایل به بازنشانی تمام اطلاعات سایت و محصولات به حالت اولیه هستید؟')) {
                  resetToInitialData();
                  showToast('داده‌ها و تنظیمات به حالت اولیه بازنشانی شدند', 'info');
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded-xl hover:bg-rose-950/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی کل اطلاعات سایت به پیش‌فرض اولیه</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('تنظیمات فروشگاه با موفقیت ذخیره گردید', 'success')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره نهایی تمامی تغییرات</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: DISCOUNT COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">کدهای تخفیف فعال فروشگاه</h2>
          </div>

          <form onSubmit={handleCreateCoupon} className="flex flex-col sm:flex-row gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <input
              type="text"
              dir="ltr"
              placeholder="کد جدید (مثال: OFF20)"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              min="1"
              max="100"
              placeholder="درصد تخفیف"
              value={newCouponPercent}
              onChange={(e) => setNewCouponPercent(Number(e.target.value))}
              className="w-32 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              افزودن کد
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-indigo-300 block">{c.code}</span>
                    <button
                      type="button"
                      onClick={() => toggleCouponStatus(c.code)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        c.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {c.active ? 'فعال' : 'غیرفعال'}
                    </button>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">{toPersianDigits(c.percent)}٪ تخفیف</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleCouponStatus(c.code)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs"
                    title="تغییر وضعیت فعال/غیرفعال"
                  >
                    {c.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      deleteCoupon(c.code);
                      showToast('کد تخفیف حذف شد', 'info');
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1.5 cursor-pointer hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="حذف کد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: BLOG POSTS */}
      {activeTab === 'blog' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">مقالات و اخبار وبلاگ</h2>
          </div>

          <div className="space-y-3">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={post.image} alt={post.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xs font-bold text-white">{post.title}</h3>
                    <span className="text-[10px] text-slate-400">{post.category} • {post.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('آیا این مقاله حذف شود؟')) {
                      deleteBlogPost(post.id);
                      showToast('مقاله حذف شد', 'info');
                    }
                  }}
                  className="text-rose-400 p-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
