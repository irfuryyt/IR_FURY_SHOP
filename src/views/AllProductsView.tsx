import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Gamepad2, Sparkles, Gift, Flame, ArrowUpDown } from 'lucide-react';
import { toPersianDigits, formatToman } from '../utils/helpers';

interface Props {
  initialCategory?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const AllProductsView: React.FC<Props> = ({
  initialCategory,
  pageTitle = 'همه محصولات و خدمات',
  pageSubtitle = 'خرید انواع جم بازی، اکانت‌های پریمیوم و گیفت کارت با تحویل آنی و تخفیف ویژه',
}) => {
  const { products, searchQuery, setSearchQuery } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'popular' | 'cheap' | 'expensive' | 'discount'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'همه محصولات', icon: Flame },
    { id: 'games', label: 'بازی‌ها (CP، UC و جم)', icon: Gamepad2 },
    { id: 'premium', label: 'اکانت‌های پریمیوم', icon: Sparkles },
    { id: 'giftcards', label: 'انواع گیفت کارت', icon: Gift },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchEnglish = p.englishTitle?.toLowerCase().includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q);
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchEnglish && !matchDesc && !matchTags) return false;
      }
      // Discounted only
      if (onlyDiscounted && !p.discountPercent && !p.specialOffer) {
        return false;
      }
      // Price filter
      const minPrice = p.packages?.[0]?.price || 0;
      if (minPrice > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.packages?.[0]?.price || 0;
      const priceB = b.packages?.[0]?.price || 0;
      if (sortBy === 'cheap') return priceA - priceB;
      if (sortBy === 'expensive') return priceB - priceA;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return b.rating - a.rating; // default popular
    });
  }, [products, selectedCategory, searchQuery, onlyDiscounted, maxPrice, sortBy]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 text-right shadow-xl">
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {pageSubtitle}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sort Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search inside catalog */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی محصول در این دسته..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors text-right"
          />
        </div>

        {/* Sort & Quick Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Discount toggle */}
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyDiscounted}
              onChange={(e) => setOnlyDiscounted(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4"
            />
            <span>فقط کالاهای تخفیف‌دار</span>
          </label>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="popular" className="bg-slate-900">محبوب‌ترین و پرفروش</option>
              <option value="cheap" className="bg-slate-900">ارزان‌ترین قیمت</option>
              <option value="expensive" className="bg-slate-900">گران‌ترین قیمت</option>
              <option value="discount" className="bg-slate-900">بیشترین درصد تخفیف</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-6 px-1">
        <span>نمایش {toPersianDigits(filteredProducts.length)} محصول یافت شده</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-amber-400 hover:underline"
          >
            پاک کردن جستجو
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-white mb-2">محصولی با این مشخصات یافت نشد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            عبارت جستجو را تغییر دهید یا فیلترها را ریست کنید.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyDiscounted(false);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
          >
            مشاهده همه محصولات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
