import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, ArrowLeft, Clock, Calendar } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { blogPosts, setCurrentView } = useStore();

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>مجله تخصصی و مقالات گیمینگ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              آخرین اخبار و آموزش‌های بازی
            </h2>
          </div>

          <button
            onClick={() => setCurrentView('blog')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group self-start sm:self-auto"
          >
            <span>مشاهده همه مقالات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.slice(0, 4).map((post) => (
            <article
              key={post.id}
              onClick={() => setCurrentView('blog-article', post.id)}
              className="group flex flex-col justify-between bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded-3xl p-4 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-400 border border-amber-500/20">
                    {post.category}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 group-hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <span>ادامه مطلب</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
                  {post.author}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
