import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatToman, toPersianDigits } from '../utils/helpers';
import { Clock, Star, Heart, ArrowLeft, Zap, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badge }) => {
  const { setCurrentView, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  // Find lowest price package
  const packages = product.packages || [];
  const minPackage = packages.length > 0
    ? packages.reduce((min, p) => (p.price < min.price ? p : min), packages[0])
    : null;

  const minPrice = minPackage ? minPackage.price : 0;
  const originalPrice = minPackage?.originalPrice || (product.discountPercent ? Math.round(minPrice / (1 - product.discountPercent / 100)) : undefined);

  const isInStock = product.inStock !== false;

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative flex flex-col justify-between bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 ${
        !isInStock ? 'opacity-75' : ''
      }`}
    >
      {/* Top Image & Badges */}
      <div>
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 mb-3.5 border border-slate-800/80">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              !isInStock ? 'grayscale-[50%]' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />

          {/* Badges on Image */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-start">
            {!isInStock ? (
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
                ناموجود
              </span>
            ) : (
              <>
                {badge && (
                  <span className="bg-amber-600 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                    {badge}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                    {toPersianDigits(product.discountPercent)}٪ تخفیف
                  </span>
                )}
              </>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-sm border border-slate-800'
            }`}
            title="افزودن به علاقه‌مندی‌ها"
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Delivery time tag */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] text-indigo-300 font-medium border border-slate-800/60">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>تحویل {product.deliveryTime}</span>
          </div>

          {/* Rating */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] text-slate-200 border border-slate-800/60">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{toPersianDigits(product.rating.toFixed(1))}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="text-right">
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
            {product.title}
          </h3>

          {product.englishTitle && (
            <p className="text-[11px] text-slate-400 font-mono line-clamp-1 mb-2 dir-ltr text-right">
              {product.englishTitle}
            </p>
          )}

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">شروع قیمت از:</span>
          <div className="flex flex-col items-end">
            {originalPrice && originalPrice > minPrice && (
              <span className="text-[11px] text-slate-500 line-through">
                {formatToman(originalPrice)}
              </span>
            )}
            <span className="text-sm font-extrabold text-indigo-400">
              {formatToman(minPrice)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('product-detail', product.id)}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 cursor-pointer group/btn shadow-md shadow-indigo-950"
        >
          <span>مشاهده و خرید بسته‌ها</span>
          <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
