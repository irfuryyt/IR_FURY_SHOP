export type ProductCategory = 'games' | 'premium' | 'giftcards' | 'coins';

export interface ProductPackage {
  id: string;
  title: string; // e.g. "۸۰ سی پی کالاف دیوتی"
  amount: number | string; // e.g. 80
  price: number; // in Tomans
  originalPrice?: number; // before discount
  badge?: string; // e.g. "محبوب‌ترین", "پرفروش", "تخفیف ویژه"
  bonus?: string; // e.g. "+ ۵۰ جم هدیه"
}

export interface CustomFieldRequirement {
  id: string;
  label: string; // e.g. "آیدی عددی بازی (Player ID)"
  placeholder: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  required: boolean;
  helpText?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Product {
  id: string;
  slug?: string;
  title: string; // e.g. "سی پی کالاف دیوتی موبایل"
  englishTitle?: string; // "Call of Duty Mobile CP"
  category: ProductCategory;
  subcategory?: string; // e.g. "mobile-games", "ai-services", "playstation"
  image: string;
  bannerImage?: string;
  shortDescription: string;
  fullDescription: string;
  deliveryTime: string; // e.g. "۵ الی ۱۵ دقیقه"
  rating: number;
  reviewCount: number;
  inStock?: boolean;
  featured?: boolean;
  specialOffer?: boolean;
  discountPercent?: number;
  packages: ProductPackage[];
  customFields: CustomFieldRequirement[];
  instructions?: string[];
  features?: string[];
  faqs?: FAQItem[];
  reviews?: Review[];
  tags?: string[];
}

export interface CartItem {
  cartItemId: string; // unique per selection
  product: Product;
  selectedPackage: ProductPackage;
  quantity: number;
  customFieldValues: Record<string, string>; // e.g. { playerId: "6789123456", server: "خاورمیانه" }
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface CustomerInfo {
  fullName: string;
  mobile: string;
  email?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  trackingCode: string; // e.g. "VG-784920"
  createdAt: string; // ISO or Persian date
  status: OrderStatus;
  customer: CustomerInfo;
  customerName?: string;
  customerMobile?: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: string;
  paymentGateway?: string;
  paymentRefId?: string;
  paymentReceiptImage?: string; // Base64 data url or image url
  receiptSubmittedAt?: string;
  receiptRefNumber?: string; // 4 last digits of card or tracking ref
  receiptNotes?: string;
  receiptStatus?: 'none' | 'submitted' | 'verified' | 'rejected';
  receiptRejectionReason?: string;
  transactionId?: string;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: string; // e.g. "۵ دقیقه"
  tags: string[];
}

export interface Coupon {
  code: string;
  percent: number;
  active: boolean;
}

export interface SiteSettings {
  storeName: string;
  tagline: string;
  notificationBarText: string;
  showNotificationBar: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  phone: string;
  email: string;
  telegramUsername: string;
  whatsappNumber: string;
  instagramUsername: string;
  workingHours: string;
  address: string;
  bankCardNumber: string;
  bankCardHolder: string;
  bankName: string;
  bankShabaNumber?: string;
  paymentInstructions?: string;
  specialBannerActive: boolean;
  specialBannerTitle: string;
  specialBannerSubtitle: string;
  specialBannerCoupon: string;
  specialBannerDiscount: string;
}

export interface User {
  id: string;
  fullName: string;
  name?: string;
  mobile: string;
  email?: string;
  role: 'user' | 'admin';
  isAdmin?: boolean;
  walletBalance: number;
  createdAt: string;
}

export type PageView =
  | 'home'
  | 'games'
  | 'premium'
  | 'giftcards'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'payment-gateway'
  | 'order-success'
  | 'order-tracking'
  | 'blog'
  | 'blog-article'
  | 'about'
  | 'contact'
  | 'faq'
  | 'terms'
  | 'privacy'
  | 'profile'
  | 'admin';
