-- Migration 0001: Initial Schema for FURY_SHOP D1 Database
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  store_name TEXT NOT NULL DEFAULT 'FURY_SHOP',
  tagline TEXT DEFAULT 'مرجع تخصصی خرید ارز بازی، اکانت‌های پریمیوم و گیفت کارت',
  notification_bar_text TEXT DEFAULT '⚡ تحویل آنی و تمام اتوماتیک سفارش‌ها در کمتر از ۱۰ دقیقه با پشتیبانی ۲۴ ساعته FURY_SHOP',
  show_notification_bar INTEGER DEFAULT 1,
  hero_headline TEXT DEFAULT 'خرید سریع جم و ارز بازی در FURY_SHOP',
  hero_subheadline TEXT DEFAULT 'CP کالاف دیوتی، UC پابجی، جم فری فایر، اکانت‌های پریمیوم و گیفت کارت با بهترین قیمت و ضمانت بازگشت وجه',
  phone TEXT DEFAULT '09307622202',
  email TEXT DEFAULT 'support@irfuryyt.com',
  telegram_username TEXT DEFAULT 'IR_FURY_YT',
  whatsapp_number TEXT DEFAULT '09307622202',
  instagram_username TEXT DEFAULT 'IR_FURY_YT',
  working_hours TEXT DEFAULT 'همه روزه - ۷ روز هفته - ۲۴ ساعته',
  address TEXT DEFAULT 'تهران، سعادت‌آباد، مجتمع تجاری نگین، واحد ۳۰۴',
  bank_card_number TEXT DEFAULT '6219861859894882',
  bank_card_holder TEXT DEFAULT 'ایوب پشمکی (مدیریت فروشگاه FURY_SHOP)',
  bank_name TEXT DEFAULT 'بانک سامان',
  bank_shaba_number TEXT DEFAULT 'IR820560000000006219861859',
  payment_instructions TEXT,
  special_banner_active INTEGER DEFAULT 1,
  special_banner_title TEXT DEFAULT 'تخفیف شگفت‌انگیز آخر هفته گیمرها در FURY_SHOP',
  special_banner_subtitle TEXT DEFAULT 'تا ۳۵٪ تخفیف روی تمام بسته‌های CP کالاف دیوتی و اشتراک تلگرام پریمیوم',
  special_banner_coupon TEXT DEFAULT 'FURY2026',
  special_banner_discount TEXT DEFAULT '۲۰٪ تخفیف ویژه',
  banner_image_url TEXT DEFAULT '',
  banner_image_active INTEGER DEFAULT 1,
  store_logo_url TEXT DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO site_settings (
  id, store_name, tagline, notification_bar_text, show_notification_bar,
  hero_headline, hero_subheadline, phone, email, telegram_username,
  whatsapp_number, instagram_username, working_hours, address,
  bank_card_number, bank_card_holder, bank_name, bank_shaba_number,
  payment_instructions, special_banner_active, special_banner_title,
  special_banner_subtitle, special_banner_coupon, special_banner_discount,
  banner_image_url, banner_image_active, store_logo_url
) VALUES (
  1,
  'FURY_SHOP',
  'مرجع تخصصی خرید ارز بازی، اکانت‌های پریمیوم و گیفت کارت',
  '⚡ تحویل آنی و تمام اتوماتیک سفارش‌ها در کمتر از ۱۰ دقیقه با پشتیبانی ۲۴ ساعته FURY_SHOP',
  1,
  'خرید سریع جم و ارز بازی در FURY_SHOP',
  'CP کالاف دیوتی، UC پابجی، جم فری فایر، اکانت‌های پریمیوم و گیفت کارت با بهترین قیمت و ضمانت بازگشت وجه',
  '09307622202',
  'support@irfuryyt.com',
  'IR_FURY_YT',
  '09307622202',
  'IR_FURY_YT',
  'همه روزه - ۷ روز هفته - ۲۴ ساعته',
  'تهران، سعادت‌آباد، مجتمع تجاری نگین، واحد ۳۰۴',
  '6219861859894882',
  'ایوب پشمکی (مدیریت فروشگاه FURY_SHOP)',
  'بانک سامان',
  'IR820560000000006219861859',
  'لطفاً مبلغ فاکتور را دقیقاً به شماره کارت بالا واریز نموده و اسکرین‌شات واضح رسید انتقال وجه را بارگذاری فرمایید.',
  1,
  'تخفیف شگفت‌انگیز آخر هفته گیمرها در FURY_SHOP',
  'تا ۳۵٪ تخفیف روی تمام بسته‌های CP کالاف دیوتی و اشتراک تلگرام پریمیوم',
  'FURY2026',
  '۲۰٪ تخفیف ویژه',
  '',
  1,
  ''
);

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

CREATE TABLE IF NOT EXISTS admin_credentials (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO admin_credentials (id, username, password_hash)
VALUES (1, 'IR_FURY_YT', 'FURY_SHOP');

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  english_title TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  image TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  price INTEGER DEFAULT 0,
  packages_json TEXT NOT NULL,
  in_stock INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  rating REAL DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  delivery_time TEXT DEFAULT '۵ الی ۱۵ دقیقه',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_email TEXT,
  items_json TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  coupon_code TEXT,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_gateway TEXT,
  payment_ref_id TEXT,
  receipt_image TEXT,
  receipt_ref_number TEXT,
  status TEXT DEFAULT 'pending',
  status_history_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
