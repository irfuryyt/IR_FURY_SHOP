import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, Calendar, Clock, ArrowLeft, Search, Tag } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export const BlogView: React.FC = () => {
  const { blogPosts, setCurrentView } = useStore();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchWord, setSearchWord] = useState('');

  const tags = ['all', 'کالاف دیوتی', 'پابجی', 'جم و سی پی', 'ترفند بازی', 'آموزش'];

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedTag !== 'all' && !post.tags.includes(selectedTag) && post.category !== selectedTag) {
      return false;
    }
    if (searchWord.trim()) {
      const q = searchWord.toLowerCase();
      return post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-10 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
          <BookOpen className="w-4 h-4" />
          <span>مجله تخصصی و وبلاگ FURY_SHOP</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          آخرین اخبار، ترفندها و آموزش‌های دنیای بازی
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          راهنمای دریافت ارزان‌تر سی پی و یوسی، جدیدترین اخبار سیزن‌های کالاف و پابجی، آموزش‌های امنیتی اکانت و معرفی بهترین بازی‌های روز
        </p>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {tag === 'all' ? 'همه مقالات' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setCurrentView('blog-article', post.id)}
            className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded-3xl p-5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-amber-400 border border-amber-500/20">
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

              <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
                {post.title}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 group-hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                <span>مطالعه کامل مقاله</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </span>
              <span className="text-[11px] text-slate-400">{post.author}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
