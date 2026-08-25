import React from 'react';
import { useStore } from '../context/StoreContext';
import { Gamepad2, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/helpers';

export const GameCategoriesSection: React.FC = () => {
  const { products, setCurrentView } = useStore();

  const gameProducts = products.filter((p) => p.category === 'games');

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm mb-1">
              <Gamepad2 className="w-4 h-4" />
              <span>خرید سی پی، یوسی و جم مستقیم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              بازی‌های محبوب و پرطرفدار
            </h2>
          </div>

          <button
            onClick={() => setCurrentView('games')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group self-start sm:self-auto cursor-pointer"
          >
            <span>مشاهده همه بازی‌ها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {gameProducts.map((game) => {
            const minPrice = game.packages?.[0]?.price || 0;
            return (
              <div
                key={game.id}
                id={`game-item-${game.id}`}
                onClick={() => setCurrentView('product-detail', game.id)}
                className="group relative flex flex-col justify-between bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 mb-3.5 border border-slate-800/80">
                    <img
                      src={game.image}
                      alt={game.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />

                    {/* Delivery Time Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-indigo-300 border border-slate-800">
                      <Zap className="w-3 h-3 text-indigo-400" />
                      <span>{game.deliveryTime}</span>
                    </div>

                    {game.specialOffer && (
                      <div className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                        ویژه
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {game.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">شروع از:</span>
                    <span className="text-xs sm:text-sm font-extrabold text-indigo-400">
                      {formatToman(minPrice)}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
                    <span>مشاهده بسته‌ها</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
