import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Share2,
  Bookmark,
  MessageSquare,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export const ArticleDetailView: React.FC = () => {
  const { blogPosts, selectedArticleId, setCurrentView, showToast } = useStore();

  const post = blogPosts.find((b) => b.id === selectedArticleId) || blogPosts[0];

  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c1',
      author: 'امیرحسین عباسی',
      date: '۲ روز پیش',
      text: 'خیلی مقاله کاربردی و دقیقی بود، مخصوصاً ترفندهای لیدربرد بتل پس واقعاً کمکم کرد.',
    },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      showToast('لطفاً نام و متن دیدگاه را بنویسید', 'error');
      return;
    }
    setCommentsList([
      {
        id: `c-${Date.now()}`,
        author: commentAuthor,
        date: 'همین الان',
        text: commentText,
      },
      ...commentsList,
    ]);
    setCommentAuthor('');
    setCommentText('');
    showToast('دیدگاه شما با موفقیت ثبت شد', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('لینک مقاله کپی شد', 'info');
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 text-right">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <button onClick={() => setCurrentView('home')} className="hover:text-amber-400">
          خانه
        </button>
        <span>/</span>
        <button onClick={() => setCurrentView('blog')} className="hover:text-amber-400">
          وبلاگ
        </button>
        <span>/</span>
        <span className="text-slate-300 font-bold truncate max-w-xs">{post.title}</span>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-xl mb-3">
          {post.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <User className="w-4 h-4 text-amber-400" />
              <span>نویسنده: {post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} مطالعه</span>
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>اشتراک‌گذاری</span>
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-8">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-loose space-y-5 bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 mb-10">
        <p className="font-bold text-white text-base sm:text-lg">{post.excerpt}</p>
        <p>{post.content}</p>

        <h3 className="text-xl font-bold text-amber-400 pt-4">نکات کلیدی و راهنمای امنیتی:</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-200">
          <li>هرگز رمز عبور اصلی اکانت را در سایت‌های متفرقه وارد نکنید.</li>
          <li>برای خرید سی پی و جم فقط از فروشگاه‌های دارای اینماد و نماد اعتماد مثل FURY_SHOP استفاده فرمایید.</li>
          <li>پس از هر خرید، پیامک فاکتور و کد رهگیری را نزد خود نگه دارید.</li>
        </ul>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <span className="text-xs text-slate-400">برچسب‌ها:</span>
        {post.tags.map((t) => (
          <span
            key={t}
            className="bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-xl text-xs"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Comments Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <span>دیدگاه‌های کاربران ({toPersianDigits(commentsList.length)})</span>
        </h3>

        {/* Existing Comments */}
        <div className="space-y-3">
          {commentsList.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{c.author}</span>
                <span className="text-slate-500">{c.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-200">ارسال دیدگاه شما:</h4>
          <input
            type="text"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="نام شما"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            required
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="دیدگاه خود را درباره این مطلب بنویسید..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white outline-none focus:border-amber-500"
            required
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            ثبت دیدگاه
          </button>
        </form>
      </div>
    </div>
  );
};
