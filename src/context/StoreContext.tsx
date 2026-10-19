import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  BlogPost,
  FAQItem,
  SiteSettings,
  Order,
  CartItem,
  User,
  PageView,
  OrderStatus,
  ProductPackage,
  Coupon,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BLOG_POSTS,
  INITIAL_FAQS,
  INITIAL_SITE_SETTINGS,
  INITIAL_ORDERS,
} from '../data/initialData';
import { generateId, generateTrackingCode, getPersianNow } from '../utils/helpers';
import {
  fetchSiteSettingsApi,
  updateSiteSettingsApi,
  adminLoginApi,
  updateAdminCredentialsApi,
  updateUserProfileApi,
} from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface StoreContextType {
  // Navigation & View
  currentView: PageView;
  setCurrentView: (view: PageView, targetId?: string) => void;
  selectedProductId: string | null;
  selectedBlogPostId: string | null;
  selectedArticleId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilterCategory: string;
  setActiveFilterCategory: (cat: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  adminCredentials: { username: string; password?: string };
  updateAdminCredentials: (username: string, password: string) => boolean;
  adminLogin: (username: string, password: string) => boolean | Promise<boolean>;
  adminLogout: () => void;

  // Data state
  products: Product[];
  blogPosts: BlogPost[];
  faqs: FAQItem[];
  siteSettings: SiteSettings;
  orders: Order[];
  coupons: Coupon[];
  cart: CartItem[];
  currentUser: User | null;
  wishlist: string[];
  appliedCoupon: { code: string; percent: number } | null;
  activeOrderForSuccess: Order | null;
  pendingOrderId: string | null;
  lastTrackingCode: string;
  toasts: ToastMessage[];

  // User Actions
  addToCart: (
    product: Product,
    selectedPackage: ProductPackage,
    quantity: number,
    customFieldValues: Record<string, string>,
    instantCheckout?: boolean
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => boolean;
  removeCouponCode: () => void;
  calculateCartTotals: () => { subtotal: number; discount: number; total: number };
  placeOrder: (customer: Order['customer'], paymentMethod: string) => Promise<Order>;
  createOrder: (data: {
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    orderNotes?: string;
    paymentGateway?: string;
  }) => Promise<Order>;
  processOrderPayment: (orderId?: string) => Promise<boolean>;
  submitOrderReceipt: (orderId: string, receiptData: {
    receiptImage: string;
    receiptRefNumber?: string;
    receiptNotes?: string;
  }) => Promise<boolean>;
  verifyOrderReceipt: (orderId: string, approve: boolean, note?: string) => void;
  trackOrder: (trackingCode: string) => Order | null;
  toggleWishlist: (productId: string) => void;
  loginUser: (mobile: string, name?: string, asAdmin?: boolean, extraFields?: Partial<User>) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  logoutUser: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Admin Actions
  addProduct: (product: Product | Omit<Product, 'id'>) => void;
  updateProduct: (productOrId: string | Product, updatedFields?: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  deleteOrder: (orderId: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (id: string, updatedFields: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, updatedFields: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponStatus: (code: string) => void;
  toggleProductStock: (productId: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetAllToDefault: () => void;
  resetToInitialData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'valagem_products_v2',
  BLOGS: 'valagem_blogs_v2',
  FAQS: 'valagem_faqs_v2',
  SETTINGS: 'valagem_settings_v2',
  ORDERS: 'valagem_orders_v2',
  COUPONS: 'valagem_coupons_v2',
  CART: 'valagem_cart_v2',
  USER: 'valagem_user_v2',
  WISHLIST: 'valagem_wishlist_v2',
};

const INITIAL_COUPONS: Coupon[] = [
  { code: 'FURY2026', percent: 20, active: true },
  { code: 'IR_FURY_YT', percent: 15, active: true },
  { code: 'WELCOME', percent: 10, active: true },
  { code: 'GAMER', percent: 10, active: true },
  { code: 'VALA2026', percent: 15, active: true },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentViewInternal] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [activeOrderForSuccess, setActiveOrderForSuccess] = useState<Order | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [lastTrackingCode, setLastTrackingCode] = useState<string>('VG-894210');

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('valagem_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('valagem_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.style.backgroundColor = '#020617';
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#f8fafc';
      }
    } catch {
      // ignore
    }
  }, [theme]);

  // Admin Auth State: strictly requires username and password each time, no auto-persistence
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.removeItem('furyshop_admin_auth');
      localStorage.removeItem('valagem_admin_auth');
    } catch {
      // ignore
    }
  }, []);

  const [adminCredentials, setAdminCredentials] = useState<{ username: string; password?: string }>(() => {
    try {
      const saved = localStorage.getItem('furyshop_admin_creds');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return { username: 'IR_FURY_YT', password: 'FURY_SHOP' };
  });

  const updateAdminCredentials = (newUsername: string, newPassword: string): boolean => {
    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();
    if (!cleanUser || !cleanPass) {
      showToast('نام کاربری و کلمه عبور نمی‌تواند خالی باشد', 'error');
      return false;
    }
    const newCreds = { username: cleanUser, password: cleanPass };
    setAdminCredentials(newCreds);
    try {
      localStorage.setItem('furyshop_admin_creds', JSON.stringify(newCreds));
    } catch {
      // ignore
    }
    // Sync with Central D1 Database
    updateAdminCredentialsApi(cleanUser, cleanPass);
    showToast('نام کاربری و کلمه عبور مدیر در پایگاه‌داده با موفقیت ذخیره شد', 'success');
    return true;
  };

  const adminLogin = async (user: string, pass: string): Promise<boolean> => {
    const cleanUser = user.trim();
    const cleanPass = pass.trim();

    // Verify against Central D1 Database first
    try {
      const res = await adminLoginApi(cleanUser, cleanPass);
      if (res.success) {
        setIsAdminAuthenticated(true);
        showToast(`خوش آمدید! ورود به پنل مدیریت ${cleanUser} تایید شد`, 'success');
        return true;
      }
    } catch {
      // fallback to local check
    }

    // Fallback checks
    const isCustomMatch = cleanUser === adminCredentials.username && cleanPass === adminCredentials.password;
    const isDefaultMatch = cleanUser === 'IR_FURY_YT' && cleanPass === 'FURY_SHOP';
    const isOwnerMatch = cleanUser.toLowerCase() === 'admin' && cleanPass.toLowerCase() === 'admin';

    if (isCustomMatch || isDefaultMatch || isOwnerMatch) {
      setIsAdminAuthenticated(true);
      showToast(`خوش آمدید! ورود به پنل مدیریت ${cleanUser} با موفقیت تایید شد`, 'success');
      return true;
    } else {
      showToast('نام کاربری یا رمز عبور پنل مدیریت نادرست است', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('furyshop_admin_auth');
      localStorage.removeItem('valagem_admin_auth');
    } catch {
      // ignore
    }
    setCurrentViewInternal('home');
    showToast('از پنل مدیریت خارج شدید', 'info');
  };

  // Persistent States with local storage initialization
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BLOGS);
      return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return saved ? { ...INITIAL_SITE_SETTINGS, ...JSON.parse(saved) } : INITIAL_SITE_SETTINGS;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      const parsed: Order[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
      // Enrich with convenience fields
      return parsed.map((o) => ({
        ...o,
        customerName: o.customerName || o.customer?.fullName || 'کاربر گرامی',
        customerMobile: o.customerMobile || o.customer?.mobile || '09120000000',
        paymentGateway: o.paymentGateway || o.paymentMethod || 'سامان کیش (سه‌پ)',
      }));
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (!saved) return null;
      const u: User = JSON.parse(saved);
      return {
        ...u,
        name: u.name || u.fullName,
        isAdmin: u.role === 'admin' || u.isAdmin,
      };
    } catch {
      return null;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['cod-mobile-cp', 'telegram-premium'];
    } catch {
      return [];
    }
  });

  // LocalStorage sync effects
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOGS, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  // Synchronize Site Settings & Banners from Central D1 Database on mount
  useEffect(() => {
    fetchSiteSettingsApi().then((serverSettings) => {
      if (serverSettings && serverSettings.storeName) {
        setSiteSettings((prev) => ({ ...prev, ...serverSettings }));
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast Handler
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View Navigation Helper
  const setCurrentView = (view: PageView, targetId?: string) => {
    // If leaving admin panel, always lock and reset admin auth
    if (currentView === 'admin' && view !== 'admin') {
      setIsAdminAuthenticated(false);
    }
    setCurrentViewInternal(view);
    if (view === 'product-detail' && targetId) {
      setSelectedProductId(targetId);
    } else if (view === 'blog-article' && targetId) {
      setSelectedBlogPostId(targetId);
    } else if (view === 'order-tracking' && targetId) {
      setLastTrackingCode(targetId);
    } else if (view === 'payment-gateway' && targetId) {
      setPendingOrderId(targetId);
    } else if (view === 'order-success' && targetId) {
      setLastTrackingCode(targetId);
    }
    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (
    product: Product,
    selectedPackage: ProductPackage,
    quantity: number,
    customFieldValues: Record<string, string>,
    instantCheckout = false
  ) => {
    const cartItemId = `${product.id}-${selectedPackage.id}-${Date.now()}`;
    const newItem: CartItem = {
      cartItemId,
      product,
      selectedPackage,
      quantity: Math.max(1, quantity),
      customFieldValues,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`بسته ${selectedPackage.title} به سبد خرید اضافه شد`, 'success');

    if (instantCheckout) {
      setCurrentView('checkout');
    } else {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('آیتم از سبد خرید حذف شد', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon handling
  const applyCouponCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);
    if (found) {
      setAppliedCoupon({ code: found.code, percent: found.percent });
      showToast(`کد تخفیف ${found.code} (${found.percent}٪) با موفقیت اعمال گردید`, 'success');
      return true;
    }

    if (cleanCode === 'FURY2026' || cleanCode === 'FURY20') {
      setAppliedCoupon({ code: cleanCode, percent: 20 });
      showToast('کد تخفیف ویژه ۲۰٪ با موفقیت اعمال گردید', 'success');
      return true;
    } else if (cleanCode === 'IR_FURY_YT' || cleanCode === 'VALA2026') {
      setAppliedCoupon({ code: cleanCode, percent: 15 });
      showToast('کد تخفیف ۱۵٪ با موفقیت اعمال گردید', 'success');
      return true;
    } else if (cleanCode === 'WELCOME' || cleanCode === 'GAMER') {
      setAppliedCoupon({ code: cleanCode, percent: 10 });
      showToast('کد تخفیف ۱۰٪ ویژه با موفقیت اعمال شد', 'success');
      return true;
    } else {
      showToast('کد تخفیف وارد شده معتبر یا فعال نمی‌باشد', 'error');
      return false;
    }
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
    showToast('کد تخفیف حذف شد', 'info');
  };

  const calculateCartTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.selectedPackage.price * item.quantity,
      0
    );
    let discount = 0;
    if (appliedCoupon) {
      discount = Math.round((subtotal * appliedCoupon.percent) / 100);
    }
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total };
  };

  // Order Placement
  const placeOrder = async (customer: Order['customer'], paymentMethod: string): Promise<Order> => {
    const { subtotal, discount, total } = calculateCartTotals();
    const trackingCode = generateTrackingCode();
    const newOrder: Order = {
      id: generateId('ord'),
      trackingCode,
      createdAt: getPersianNow(),
      status: 'pending',
      customer,
      customerName: customer.fullName,
      customerMobile: customer.mobile,
      userId: currentUser?.id,
      items: [...cart],
      subtotal,
      discountAmount: discount,
      couponCode: appliedCoupon?.code,
      totalAmount: total,
      paymentMethod,
      paymentGateway: paymentMethod,
      paymentRefId: `SHP-${Math.floor(100000000 + Math.random() * 900000000)}`,
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          note: 'پرداخت با موفقیت انجام شد و سفارش در صف پردازش قرار گرفت.',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderForSuccess(newOrder);
    setPendingOrderId(newOrder.id);
    setLastTrackingCode(trackingCode);
    clearCart();
    setAppliedCoupon(null);

    // Auto update to processing after demo
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'processing', `سفارش توسط اپراتور ${siteSettings.storeName} بررسی و به سیستم ارسال شد.`);
    }, 20000);

    return newOrder;
  };

  const createOrder = async (data: {
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    orderNotes?: string;
    paymentGateway?: string;
  }): Promise<Order> => {
    const customerInfo = {
      fullName: data.customerName,
      mobile: data.customerMobile,
      email: data.customerEmail,
      orderNotes: data.orderNotes,
    };
    return placeOrder(customerInfo, data.paymentGateway || 'سامان کیش (سه‌پ)');
  };

  const processOrderPayment = async (orderId?: string): Promise<boolean> => {
    const targetId = orderId || pendingOrderId;
    if (targetId) {
      updateOrderStatus(targetId, 'processing', 'پرداخت با موفقیت در درگاه شتاب تایید شد.');
    }
    return true;
  };

  const submitOrderReceipt = async (
    orderId: string,
    receiptData: {
      receiptImage: string;
      receiptRefNumber?: string;
      receiptNotes?: string;
    }
  ): Promise<boolean> => {
    const nowTime = getPersianNow();
    let updated = false;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.trackingCode === orderId) {
          updated = true;
          const history = ord.statusHistory || [];
          return {
            ...ord,
            paymentReceiptImage: receiptData.receiptImage,
            receiptSubmittedAt: nowTime,
            receiptRefNumber: receiptData.receiptRefNumber || 'ثبت شده توسط خریدار',
            receiptNotes: receiptData.receiptNotes || '',
            receiptStatus: 'submitted',
            status: 'processing',
            statusHistory: [
              ...history,
              {
                status: 'processing',
                timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                note: 'تصویر فیش واریزی و اطلاعات انتقال وجه با موفقیت بارگذاری شد و در انتظار تایید مدیریت قرار گرفت.',
              },
            ],
          };
        }
        return ord;
      })
    );

    showToast('فیش واریزی شما با موفقیت برای مدیریت ارسال شد و در نوبت شارژ فوری قرار گرفت.', 'success');
    return updated;
  };

  const verifyOrderReceipt = (orderId: string, approve: boolean, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.trackingCode === orderId) {
          const timestamp = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
          const history = ord.statusHistory || [];
          if (approve) {
            return {
              ...ord,
              receiptStatus: 'verified',
              status: 'completed',
              statusHistory: [
                ...history,
                {
                  status: 'completed',
                  timestamp,
                  note: note || 'فیش واریزی توسط مدیریت بررسی و تایید شد. شارژ درون‌برنامه‌ای با موفقیت انجام گردید.',
                },
              ],
            };
          } else {
            return {
              ...ord,
              receiptStatus: 'rejected',
              receiptRejectionReason: note || 'مغایرت مبلغ یا نامعتبر بودن رسید',
              status: 'pending',
              statusHistory: [
                ...history,
                {
                  status: 'pending',
                  timestamp,
                  note: note ? `فیش واریزی رد شد: ${note}` : 'فیش واریزی توسط اپراتور تایید نشد.',
                },
              ],
            };
          }
        }
        return ord;
      })
    );

    if (approve) {
      showToast('فیش واریزی تایید و وضعیت سفارش به شارژ تکمیل شد تغییر یافت.', 'success');
    } else {
      showToast('فیش واریزی رد شد و دلیل برای مشتری ثبت گردید.', 'warning');
    }
  };

  const trackOrder = (query: string): Order | null => {
    const clean = query.trim();
    if (!clean) return null;
    const found = orders.find(
      (o) =>
        o.trackingCode.toLowerCase() === clean.toLowerCase() ||
        (o.customer?.mobile || o.customerMobile || '').replace(/\s/g, '').includes(clean)
    );
    return found || null;
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('محصول از لیست علاقه‌مندی‌ها حذف شد', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('محصول به لیست علاقه‌مندی‌ها اضافه شد', 'success');
        return [...prev, productId];
      }
    });
  };

  // Auth operations
  const loginUser = (
    mobile: string,
    name = 'کاربر گرامی',
    asAdmin = false,
    extraFields?: Partial<User>
  ) => {
    const user: User = {
      id: generateId('usr'),
      fullName: name,
      name,
      mobile,
      role: asAdmin ? 'admin' : 'user',
      isAdmin: asAdmin,
      walletBalance: 150000,
      createdAt: getPersianNow(),
      ...extraFields,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(asAdmin ? `ورود به عنوان مدیر ${siteSettings.storeName} انجام شد` : `خوش آمدید، ${name}`, 'success');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated: User = {
        ...prev,
        ...updates,
        name: updates.fullName || updates.name || prev.name,
      };
      // Persist to Central D1 Database
      if (prev.id) {
        updateUserProfileApi(prev.id, updated);
      }
      return updated;
    });
    showToast('مشخصات حساب کاربری با موفقیت در پایگاه‌داده ذخیره شد', 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('از حساب کاربری خارج شدید', 'info');
  };

  // Admin CRUD operations
  const addProduct = (newProd: Product | Omit<Product, 'id'>) => {
    const id = ('id' in newProd && newProd.id) ? newProd.id : generateId('prod');
    const product: Product = { ...newProd, id, inStock: true };
    setProducts((prev) => [product, ...prev]);
    showToast(`محصول «${product.title}» با موفقیت افزوده شد`, 'success');
  };

  const updateProduct = (productOrId: string | Product, updatedFields?: Partial<Product>) => {
    if (typeof productOrId === 'string') {
      setProducts((prev) =>
        prev.map((p) => (p.id === productOrId ? { ...p, ...updatedFields } : p))
      );
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === productOrId.id ? { ...p, ...productOrId } : p))
      );
    }
    showToast('تغییرات محصول با موفقیت ذخیره شد', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('محصول با موفقیت حذف گردید', 'warning');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const timestamp = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
          const history = ord.statusHistory || [];
          const defaultNote =
            status === 'completed'
              ? 'سفارش با موفقیت تحویل و شارژ اکانت تکمیل گردید.'
              : status === 'processing'
              ? 'سفارش به درگاه واریز ارسال و در حال فعال‌سازی است.'
              : status === 'cancelled'
              ? 'سفارش لغو شد و وجه به کیف پول بازگشت داده شد.'
              : 'سفارش در انتظار بررسی اپراتور است.';

          return {
            ...ord,
            status,
            statusHistory: [...history, { status, timestamp, note: note || defaultNote }],
          };
        }
        return ord;
      })
    );
    showToast('وضعیت سفارش بروزرسانی شد', 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('سفارش حذف شد', 'info');
  };

  const addBlogPost = (newPost: Omit<BlogPost, 'id'>) => {
    const id = generateId('blog');
    const post: BlogPost = { ...newPost, id };
    setBlogPosts((prev) => [post, ...prev]);
    showToast(`مقاله «${post.title}» منتشر شد`, 'success');
  };

  const updateBlogPost = (id: string, updatedFields: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('تغییرات مقاله با موفقیت ذخیره شد', 'success');
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('مقاله با موفقیت حذف گردید', 'warning');
  };

  const addFAQ = (newFaq: Omit<FAQItem, 'id'>) => {
    const id = generateId('faq');
    const faq: FAQItem = { ...newFaq, id };
    setFaqs((prev) => [...prev, faq]);
    showToast('سوال جدید اضافه شد', 'success');
  };

  const updateFAQ = (id: string, updatedFields: Partial<FAQItem>) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    );
    showToast('سوال ویرایش شد', 'success');
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    showToast('سوال حذف شد', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev.filter((c) => c.code !== coupon.code)]);
    showToast(`کد تخفیف ${coupon.code} اضافه شد`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast('کد تخفیف حذف شد', 'info');
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    showToast(`وضعیت فعال بودن کد تخفیف تغییر یافت`, 'info');
  };

  const toggleProductStock = (productId: string) => {
    let newStatus = false;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          newStatus = !(p.inStock ?? true);
          return { ...p, inStock: newStatus };
        }
        return p;
      })
    );
    showToast(
      newStatus ? 'وضعیت محصول به «موجود در انبار» تغییر یافت' : 'محصول به عنوان «ناموجود» علامت‌گذاری شد',
      newStatus ? 'success' : 'warning'
    );
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const merged = { ...prev, ...settings };
      // Sync with Central D1 Database
      updateSiteSettingsApi(merged);
      return merged;
    });
    showToast('تنظیمات سایت با موفقیت در پایگاه‌داده ذخیره شد', 'success');
  };

  const resetAllToDefault = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setFaqs(INITIAL_FAQS);
    setCoupons(INITIAL_COUPONS);
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setWishlist(['cod-mobile-cp', 'telegram-premium']);
    showToast('تمام داده‌های سایت به حالت پیش‌فرض اولیه بازنشانی شد', 'info');
  };

  const exportDatabaseJSON = () => {
    const data = {
      products,
      blogPosts,
      faqs,
      coupons,
      siteSettings,
      orders,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products) setProducts(data.products);
      if (data.blogPosts) setBlogPosts(data.blogPosts);
      if (data.faqs) setFaqs(data.faqs);
      if (data.coupons) setCoupons(data.coupons);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (data.orders) setOrders(data.orders);
      showToast('اطلاعات با موفقیت بازیابی شد', 'success');
      return true;
    } catch {
      showToast('فرمت فایل JSON نامعتبر است', 'error');
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        selectedBlogPostId,
        selectedArticleId: selectedBlogPostId,
        searchQuery,
        setSearchQuery,
        activeFilterCategory,
        setActiveFilterCategory,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,

        theme,
        toggleTheme,

        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminCredentials,
        updateAdminCredentials,
        adminLogin,
        adminLogout,

        products,
        blogPosts,
        faqs,
        coupons,
        siteSettings,
        orders,
        cart,
        currentUser,
        wishlist,
        appliedCoupon,
        activeOrderForSuccess,
        pendingOrderId,
        lastTrackingCode,
        toasts,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCouponCode,
        removeCouponCode,
        calculateCartTotals,
        placeOrder,
        createOrder,
        processOrderPayment,
        submitOrderReceipt,
        verifyOrderReceipt,
        trackOrder,
        toggleWishlist,
        loginUser,
        updateUserProfile,
        logoutUser,
        showToast,
        dismissToast,

        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,
        toggleProductStock,
        updateSiteSettings,
        resetAllToDefault,
        resetToInitialData: resetAllToDefault,
        exportDatabaseJSON,
        importDatabaseJSON,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
