import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Gamepad2, Sparkles, Gift, ArrowLeft, Clock } from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

export const QuickSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, products, blogPosts, setCurrentView } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Keyboard shortcut listener (/ or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchModalOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  const filteredProducts = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.title.includes(searchTerm) ||
          p.englishTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shortDescription.includes(searchTerm) ||
          p.tags?.some((t) => t.includes(searchTerm))
      )
    : products.slice(0, 6);

  const filteredBlogs = searchTerm.trim()
    ? blogPosts.filter(
        (b) => b.title.includes(searchTerm) || b.tags.some((t) => t.includes(searchTerm))
      )
    : [];

  const handleSelectProduct = (id: string) => {
    setIsSearchModalOpen(false);
    setSearchTerm('');
    setCurrentView('product-detail', id);
  };

  const handleSelectBlog = (id: string) => {
    setIsSearchModalOpen(false);
    setSearchTerm('');
    setCurrentView('blog-article', id);
  };

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchModalOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Box */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-6 h-6 text-amber-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی سی پی، یوسی، گیفت کارت، بازی یا مقاله..."
                className="w-full bg-transparent text-white placeholder-slate-400 text-base sm:text-lg outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <kbd className="hidden sm:inline-block bg-slate-800 border border-slate-700 text-slate-400 text-xs px-2 py-1 rounded-md font-mono">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-4">
              {filteredProducts.length === 0 && filteredBlogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-base font-bold text-slate-300">موردی یافت نشد</p>
                  <p className="text-xs text-slate-400 mt-1">
                    عبارت دیگری را امتحان کنید یا از دسته‌بندی‌های صفحه اصلی استفاده نمایید.
                  </p>
                </div>
              ) : (
                <>
                  {/* Products Header */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2.5 px-1">
                      <span>{searchTerm ? 'محصولات یافت شده' : 'محصولات محبوب و پرفروش'}</span>
                      <span>{toPersianDigits(filteredProducts.length)} مورد</span>
                    </div>

                    <div className="space-y-2">
                      {filteredProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod.id)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0"
                            />
                            <div className="text-right">
                              <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                {prod.title}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {prod.shortDescription}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-extrabold text-amber-400">
                              {formatToman(prod.packages[0]?.price || 0)}
                            </span>
                            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:-translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Blog Articles (if match) */}
                  {filteredBlogs.length > 0 && (
                    <div className="pt-3 border-t border-slate-800">
                      <p className="text-xs font-bold text-slate-400 mb-2.5 px-1">مقالات مرتبط در وبلاگ</p>
                      <div className="space-y-2">
                        {filteredBlogs.map((blog) => (
                          <div
                            key={blog.id}
                            onClick={() => handleSelectBlog(blog.id)}
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer group"
                          >
                            <div className="text-right">
                              <h5 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                                {blog.title}
                              </h5>
                              <p className="text-[11px] text-slate-400">{blog.category}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {blog.readTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between px-5">
              <span>با زدن Enter یا کلیک، وارد صفحه محصول شوید</span>
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setCurrentView('products');
                }}
                className="text-amber-400 hover:text-amber-300 font-bold"
              >
                مشاهده همه دسته‌بندی‌ها
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
