# طرح جامع مهاجرت به پایگاه‌داده Cloudflare D1 و Cloudflare Workers (نسخه بازنگری‌شده)

این سند، معماری دقیق و گام‌به‌گام جایگزینی کامل `localStorage` با پایگاه‌داده ابری **Cloudflare D1** و اتصال آن به **Cloudflare Workers** را شرح می‌دهد؛ به شکلی که تمامی اطلاعات کاربران، تنظیمات سایت، بنرها و لوگو در سراسر اینترنت و تمام مرورگرها و دستگاه‌ها به‌صورت متمرکز و یکسان در دسترس باشند.

---

## بررسی کاربر و موارد بازنگری (User Review & Critical Revisions)

> [!IMPORTANT]
> با توجه به درخواست شما برای تمرکز ۱۰۰٪ بر Cloudflare D1 و هماهنگی کامل با Cloudflare Workers:
> ۱. تمامی اطلاعاتی که قبلاً در `localStorage` مرورگر ذخیره می‌شدند (شامل تنظیمات سایت، بنر، لوگو، پروفایل کاربر، مشخصات گیمری و حساب مدیریت)، به جداول متناظر در **Cloudflare D1** منتقل می‌شوند.
> ۲. اسکریپت اصلی ورکر کلودفلر (`worker/index.ts` یا `src/worker.ts`) و فایل پیکربندی `wrangler.toml` همراه با اسکریپت ایجاد جداول `d1-schema.sql` پیاده‌سازی می‌شوند تا پروژه بدون هیچ تغییری روی Cloudflare Workers + D1 مستقر شود.
> ۳. برای اجرای زنده، تست و کامپایل در این محیط، سرور فول‌استک `server.ts` با موتور سازگار با D1 اجرا شده و تمام مسیرهای `/api/*` را به دیتابیس وصل می‌کند.

---

## ۱. ارزیابی و مکان‌های حذف `localStorage` در پروژه

تمامی نقاط زیر که قبلاً از حافظه محلی مرورگر استفاده می‌کردند، بازنویسی شده و به API متصل می‌شوند:

| بخش | وضعیت فعلی (localStorage) | وضعیت جدید (Cloudflare D1 API) |
| :--- | :--- | :--- |
| **تنظیمات سایت و بنر** | کلید `furyshop_settings` (فقط روی یک مرورگر) | اندپوینت‌های `GET /api/settings` و `PUT /api/settings` متصل به جدول `site_settings` در D1 |
| **پروفایل و هویت گیمری** | کلید `furyshop_user` (فقط روی یک مرورگر) | اندپوینت‌های `GET /api/users/profile` و `PUT /api/users/profile` متصل به جدول `users` در D1 |
| **ورود و ثبت‌نام کاربر** | ایجاد شیء محلی در مرورگر | اندپوینت‌های `POST /api/auth/register` و `POST /api/auth/login` در جدول `users` |
| **احراز هویت مدیریت** | کلید `furyshop_admin_creds` محلی | اندپوینت‌های `POST /api/admin/login` و `PUT /api/admin/credentials` در جدول `admin_credentials` |
| **محصولات و سفارش‌ها** | کلیدهای `furyshop_products` و `furyshop_orders` | اندپوینت‌های `/api/products` و `/api/orders` در جداول متناظر D1 |

---

## ۲. طراحی اسکیما پایگاه‌داده Cloudflare D1 (`d1-schema.sql`)

اسکیما بر اساس دستورات استاندارد SQL سازگار با Cloudflare D1 طراحی می‌شود:

```sql
-- ۱. جدول تنظیمات سراسری فروشگاه، بنر و رسانه
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  store_name TEXT NOT NULL DEFAULT 'FURY_SHOP',
  tagline TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  banner_image_url TEXT,
  banner_image_active INTEGER DEFAULT 1,
  store_logo_url TEXT,
  phone TEXT,
  email TEXT,
  telegram_username TEXT,
  whatsapp_number TEXT,
  instagram_username TEXT,
  notification_bar_text TEXT,
  show_notification_bar INTEGER DEFAULT 1,
  special_banner_title TEXT,
  special_banner_subtitle TEXT,
  special_banner_coupon TEXT,
  special_banner_discount TEXT,
  special_banner_active INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ۲. جدول کاربران، اطلاعات گیمری و کیف پول
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  email TEXT,
  password_hash TEXT NOT NULL,
  gamer_tag TEXT,
  game_id TEXT,
  discord_id TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  wallet_balance INTEGER DEFAULT 150000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ۳. جدول محصولات فروشگاه
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  english_title TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  image TEXT,
  short_description TEXT,
  full_description TEXT,
  price INTEGER DEFAULT 0,
  packages_json TEXT,
  in_stock INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  rating REAL DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  delivery_time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ۴. جدول سفارشات و فاکتورها
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  items_json TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  receipt_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ۵. جدول اطلاعات مدیریت
CREATE TABLE IF NOT EXISTS admin_credentials (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## ۳. معماری سیستم و هماهنگی با Cloudflare Workers

```
┌─────────────────────────────────────────────────────────────────┐
│                    کلاینت کاربری (React + Vite SPA)            │
│  - AuthModal (ورود و ثبت‌نام مستقیم با API)                     │
│  - UserProfileView (دریافت و ذخیره آواتار و تگ گیمری در D1)    │
│  - AdminPanelView (آپلود بنر و ذخیره در دیتابیس سراسری D1)       │
│  - StoreContext (همگام‌سازی زنده داده‌ها از طریق API)           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                   فراخوانی‌های RESTful API (/api/*)
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│               لایه سرور / Cloudflare Workers API Handler        │
│                                                                 │
│  ┌──────────────────────────────┬────────────────────────────┐  │
│  │   Cloudflare Worker (Worker) │   محیط لوکال / سرور ای‌آی    │  │
│  │   env.DB (Cloudflare D1)     │   server.ts (موتور SQLite) │  │
│  └──────────────────────────────┴────────────────────────────┘  │
│                                │                                │
│                                ▼                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │             پایگاه‌داده متمرکز Cloudflare D1              │  │
│  │  - site_settings (بنر، لوگو، متن‌ها)                       │  │
│  │  - users (پروفایل‌ها، تگ گیمر، شماره، آواتار)             │  │
│  │  - admin_credentials (نام کاربری و رمز مدیر)              │  │
│  │  - products & orders (محصولات و سفارش‌ها)                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ۴. برنامه گام‌به‌گام پیاده‌سازی و فایل‌های پروژه

1. **فایل‌های اختصاصی Cloudflare**:
   - `d1-schema.sql`: فایل کامل دستورات ایجاد جداول D1 و مایگریشن اولیه.
   - `wrangler.toml`: پیکربندی Worker با بایندینگ D1:
     ```toml
     name = "furyshop-worker"
     main = "worker/index.ts"
     compatibility_date = "2024-01-01"

     [[d1_databases]]
     binding = "DB"
     database_name = "furyshop-d1"
     database_id = "xxxx-xxxx-xxxx"
     ```
   - `worker/index.ts`: اسکریپت ورکر کلودفلر که تمامی درخواست‌های `/api/*` را مستقیماً با استفاده از `env.DB.prepare(...).bind(...).run() / .all()` پردازش می‌کند و فایل‌های استاتیک فرانت‌اند را تحویل می‌دهد.
2. **سرور اجرایی محیط فعلی (`server.ts`)**:
   - یکپارچه‌سازی سرور Express با شبیه‌ساز D1 (یا دیتابیس SQLite فایل‌محور در `data/store.db`)، تا همین ساختار و اندپوینت‌ها در پورت ۳۰۰۰ نیز بدون کوچک‌ترین تفاوت پاسخگو باشند.
   - تزریق خودکار (Auto-Seed) تنظیمات فعلی، بنرها و محصولات در صورت خالی بودن دیتابیس.
3. **سرویس ارتباطی کلاینت (`src/services/api.ts`)**:
   - پیاده‌سازی متدهای `fetchSiteSettings()`, `updateSiteSettingsApi()`, `registerUserApi()`, `loginUserApi()`, `updateUserProfileApi()`, `adminLoginApi()`, `updateAdminCredsApi()`.
4. **به‌روزرسانی `StoreContext.tsx`**:
   - جایگزینی توابع واکشی و ذخیره با API.
   - افزودن لایه کش اضطراری آفلاین به عنوان Fallback در صورت قطعی شبکه.
5. **به‌روزرسانی `package.json`**:
   - تنظیم اسکریپت‌های `"dev": "tsx server.ts"` و اسکریپت‌های کلودفلر `"deploy:worker": "wrangler deploy"`.
6. **کامپایل و تایید نهایی با `compile_applet`**:
   - اجرای تست کامپایل برای اطمینان از سلامت کامل تایپ‌ها و عدم وجود خطا.
