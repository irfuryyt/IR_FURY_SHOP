import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductPackage } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatToman, toPersianDigits } from '../utils/helpers';
import {
  Clock,
  ShieldCheck,
  Zap,
  Star,
  Check,
  HelpCircle,
  ChevronDown,
  ShoppingCart,
  ArrowRight,
  Flame,
  MessageSquare,
  Sparkles,
  Info,
  Heart,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setCurrentView,
    addToCart,
    toggleWishlist,
    wishlist,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedPackage, setSelectedPackage] = useState<ProductPackage>(
    product.packages[0] || { id: 'default', title: 'بسته استاندارد', amount: 1, price: 100000 }
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'desc' | 'guide' | 'faq' | 'reviews'>('desc');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // New review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState(product.reviews || [
    {
      id: 'rev-1',
      author: 'آرمین شجاعی',
      rating: 5,
      date: '۳ روز پیش',
      comment: 'سفارش در کمتر از ۷ دقیقه شارژ شد و بتل پس رو فعال کردم. قیمت‌تون واقعاً از همه جا پایین‌تره دمتون گرم!',
      verifiedPurchase: true,
    },
    {
      id: 'rev-2',
      author: 'مهدی کریمی',
      rating: 5,
      date: '۱ هفته پیش',
      comment: 'عالی بود واریز بدون نیاز به تماس انجام شد و پیامک فاکتور هم اومد.',
      verifiedPurchase: true,
    },
  ]);

  // Update selected package when product changes
  useEffect(() => {
    if (product.packages && product.packages.length > 0) {
      setSelectedPackage(product.packages[0]);
    }
    setCustomFieldValues({});
  }, [product]);

  const isWishlisted = wishlist.includes(product.id);
  const isInStock = product.inStock !== false;

  const handleFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const validateFields = (): boolean => {
    if (!isInStock) {
      showToast('این محصول در حال حاضر ناموجود است.', 'warning');
      return false;
    }
    const requiredFields = product.customFields.filter((f) => f.required);
    for (const field of requiredFields) {
      if (!customFieldValues[field.id] || !customFieldValues[field.id].trim()) {
        showToast(`لطفاً فیلد «${field.label}» را تکمیل فرمایید`, 'error');
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = (instantCheckout = false) => {
    if (!validateFields()) return;
    addToCart(product, selectedPackage, quantity, customFieldValues, instantCheckout);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('لینک محصول کپی شد', 'info');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('لطفاً نام و متن نظر خود را وارد کنید', 'error');
      return;
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      author: reviewName,
      rating: reviewRating,
      date: 'امروز',
      comment: reviewComment,
      verifiedPurchase: true,
    };
    setLocalReviews((prev) => [newRev, ...prev]);
    setReviewName('');
    setReviewComment('');
    showToast('نظر شما با موفقیت ثبت شد و نمایش داده می‌شود', 'success');
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 overflow-x-auto whitespace-nowrap">
        <button onClick={() => setCurrentView('home')} className="hover:text-amber-400">
          خانه
        </button>
        <span>/</span>
        <button onClick={() => setCurrentView(product.category as any)} className="hover:text-amber-400">
          {product.category === 'games' ? 'بازی‌ها' : product.category === 'premium' ? 'اکانت‌های پریمیوم' : 'گیفت کارت‌ها'}
        </button>
        <span>/</span>
        <span className="text-slate-200 font-bold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-14">
        {/* Right Column (Image Gallery & Highlights - 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            {/* Badges on Image */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5">
              {product.discountPercent && (
                <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg">
                  {toPersianDigits(product.discountPercent)}٪ تخفیف
                </span>
              )}
              <span className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-amber-400 text-xs font-bold px-3 py-1 rounded-xl">
                تحویل {product.deliveryTime}
              </span>
            </div>

            {/* Top Left Actions */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'bg-rose-500 text-white shadow-lg'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
                }`}
                title="علاقه‌مندی"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-all"
                title="اشتراک‌گذاری"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Highlights Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>شارژ ۱۰۰٪ قانونی و تضمین عدم مسدود شدن اکانت</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Zap className="w-4 h-4 shrink-0" />
              <span>ارسال و فعال‌سازی سریع در کمتر از {product.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>دارای گارانتی بازگشت کامل وجه در صورت عدم رضایت</span>
            </div>
          </div>
        </div>

        {/* Left Column (Configurations, Packages & Order Form - 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold">{toPersianDigits(product.rating.toFixed(1))}</span>
                </div>
                <span>•</span>
                <span>({toPersianDigits(product.reviewCount || 120)} دیدگاه ثبت شده)</span>
                <span>•</span>
                {isInStock ? (
                  <span className="text-emerald-400 font-semibold">موجود در انبار و آماده واریز</span>
                ) : (
                  <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    در حال حاضر ناموجود
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                {product.title}
              </h1>

              {product.englishTitle && (
                <p className="text-xs text-slate-400 font-mono dir-ltr text-right">
                  {product.englishTitle}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
                {product.shortDescription}
              </p>
            </div>

            {/* Step 1: Package / Quantity Selection */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-200">
                ۱. بسته یا مقدار مورد نظر را انتخاب نمایید:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.packages.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                          {pkg.title}
                        </span>
                        {pkg.badge && (
                          <span className="bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        {pkg.originalPrice ? (
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatToman(pkg.originalPrice)}
                          </span>
                        ) : <span />}
                        <span className="font-extrabold text-amber-400">
                          {formatToman(pkg.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Custom Input Requirements (Player ID, Server, etc.) */}
            {product.customFields && product.customFields.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-200">
                  ۲. اطلاعات مورد نیاز برای شارژ اکانت را وارد فرمایید:
                </label>

                <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  {product.customFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {field.label} {field.required && <span className="text-rose-400">*</span>}
                      </label>

                      {field.type === 'select' && field.options ? (
                        <select
                          value={customFieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="">{field.placeholder}</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt} className="bg-slate-900">
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={customFieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
                        />
                      )}

                      {field.helpText && (
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Info className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{field.helpText}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Call to Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800 bg-slate-900/90 p-5 rounded-3xl border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400 block">مبلغ بسته انتخابی:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    {formatToman(selectedPackage.price * quantity)}
                  </span>
                  {selectedPackage.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatToman(selectedPackage.originalPrice * quantity)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white bg-slate-900 rounded-xl font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-white">
                  {toPersianDigits(quantity)}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white bg-slate-900 rounded-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="product-instant-buy-btn"
                disabled={!isInStock}
                onClick={() => handleAddToCart(true)}
                className={`flex items-center justify-center gap-2 font-black py-3.5 px-5 rounded-2xl text-xs sm:text-sm shadow-xl transition-all cursor-pointer ${
                  isInStock
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{isInStock ? 'خرید فوری و تسویه‌حساب' : 'محصول ناموجود است'}</span>
              </button>

              <button
                id="product-add-to-cart-btn"
                disabled={!isInStock}
                onClick={() => handleAddToCart(false)}
                className={`flex items-center justify-center gap-2 font-bold py-3.5 px-5 rounded-2xl text-xs sm:text-sm border transition-all cursor-pointer ${
                  isInStock
                    ? 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700'
                    : 'bg-slate-850 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>افزودن به سبد خرید</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section (Description, Guide, FAQ, Reviews) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-14">
        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 gap-2 sm:gap-6 overflow-x-auto pb-3 mb-6">
          <button
            onClick={() => setActiveTab('desc')}
            className={`text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'desc' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            توضیحات کامل محصول
            {activeTab === 'desc' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'guide' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            راهنمای خرید و تحویل
            {activeTab === 'guide' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'faq' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سوالات متداول
            {activeTab === 'faq' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-xs sm:text-sm font-bold pb-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'reviews' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نظرات خریداران ({toPersianDigits(localReviews.length)})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === 'desc' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>{product.fullDescription}</p>

              {product.features && product.features.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-bold text-white mb-3">ویژگی‌های برجسته:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h4 className="text-sm font-bold text-white">مراحل فعال‌سازی و دریافت:</h4>
              <ol className="space-y-3 list-decimal list-inside text-slate-200 pr-2">
                <li>بسته مورد نیاز را انتخاب و اطلاعات اکانت را ثبت کنید.</li>
                <li>مبلغ سفارش را از طریق درگاه امن شاپرک پرداخت فرمایید.</li>
                <li>کد پیگیری اختصاصی دریافت نموده و وضعیت سفارش را مشاهده کنید.</li>
                <li>پس از تکمیل، پیامک تایید واریز برای شما ارسال می‌گردد.</li>
              </ol>

              {product.instructions && product.instructions.length > 0 && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1.5">
                  <p className="font-bold">نکات بسیار مهم قبل از ثبت سفارش:</p>
                  {product.instructions.map((inst, i) => (
                    <p key={i}>• {inst}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              {(product.faqs && product.faqs.length > 0 ? product.faqs : [
                { id: 'f1', question: 'آیا برای شارژ نیاز به رمز عبور است؟', answer: 'خیر در اکثر محصولات فقط آیدی عددی کفایت می‌کند مگر مواردی که لاگین اختصاصی نیاز باشد.' },
                { id: 'f2', question: 'زمان تحویل سفارش چقدر است؟', answer: `معمولاً سفارش‌های این محصول در بازه ${product.deliveryTime} انجام می‌شود.` },
              ]).map((f, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={f.id || i}
                    className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-right text-xs sm:text-sm font-bold text-white"
                    >
                      <span>{f.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                        {f.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews */}
              <div className="space-y-3">
                {localReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded">
                            خریدار محصول
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block mt-2">{rev.date}</span>
                  </div>
                ))}
              </div>

              {/* Add New Review Form */}
              <form onSubmit={handleAddReview} className="pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white">ثبت نظر و تجربه خرید شما:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="نام و نام خانوادگی شما"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    required
                  />
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
                    <span>امتیاز شما:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="bg-transparent text-amber-400 font-bold outline-none cursor-pointer"
                    >
                      <option value={5} className="bg-slate-900">⭐⭐⭐⭐⭐ عالی (۵)</option>
                      <option value={4} className="bg-slate-900">⭐⭐⭐⭐ خوب (۴)</option>
                      <option value={3} className="bg-slate-900">⭐⭐⭐ متوسط (۳)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="متن نظر یا دیدگاه شما در رابطه با سرعت تحویل و کیفیت خدمات FURY_ADMIN..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  ارسال نظر
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-black text-white mb-6">محصولات مشابه و مرتبط</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
