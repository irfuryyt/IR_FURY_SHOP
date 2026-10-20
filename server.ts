import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ----------------------------------------------------------------------
// 1. Database Initialization (SQLite matching Cloudflare D1 Architecture)
// ----------------------------------------------------------------------
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ir-fury-shop.db');
const db = new DatabaseSync(dbPath);

// Execute schema creation identical to d1-schema.sql
db.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    store_name TEXT NOT NULL DEFAULT 'FURY_SHOP',
    tagline TEXT,
    hero_headline TEXT,
    hero_subheadline TEXT,
    banner_image_url TEXT DEFAULT '',
    banner_image_active INTEGER DEFAULT 1,
    store_logo_url TEXT DEFAULT '',
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
    notification_bar_text TEXT DEFAULT '⚡ تحویل آنی و تمام اتوماتیک سفارش‌ها در کمتر از ۱۰ دقیقه با پشتیبانی ۲۴ ساعته FURY_SHOP',
    show_notification_bar INTEGER DEFAULT 1,
    special_banner_title TEXT DEFAULT 'تخفیف شگفت‌انگیز آخر هفته گیمرها در FURY_SHOP',
    special_banner_subtitle TEXT DEFAULT 'تا ۳۵٪ تخفیف روی تمام بسته‌های CP کالاف دیوتی و اشتراک تلگرام پریمیوم',
    special_banner_coupon TEXT DEFAULT 'FURY2026',
    special_banner_discount TEXT DEFAULT '۲۰٪ تخفیف ویژه',
    special_banner_active INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
`);

// Auto-seed default site settings if row 1 is missing
const existingSettings = db.prepare('SELECT id FROM site_settings WHERE id = 1').get();
if (!existingSettings) {
  db.prepare(`
    INSERT INTO site_settings (
      id, store_name, tagline, hero_headline, hero_subheadline,
      banner_image_url, banner_image_active, store_logo_url
    ) VALUES (
      1, 'FURY_SHOP',
      'مرجع تخصصی خرید ارز بازی، اکانت‌های پریمیوم و گیفت کارت',
      'خرید سریع جم و ارز بازی در FURY_SHOP',
      'CP کالاف دیوتی، UC پابجی، جم فری فایر، اکانت‌های پریمیوم و گیفت کارت با بهترین قیمت و ضمانت بازگشت وجه',
      '', 1, ''
    )
  `).run();
}

// Auto-seed default admin credentials if missing
const existingAdmin = db.prepare('SELECT id FROM admin_credentials WHERE id = 1').get();
if (!existingAdmin) {
  db.prepare(`
    INSERT INTO admin_credentials (id, username, password_hash)
    VALUES (1, 'IR_FURY_YT', 'FURY_SHOP')
  `).run();
}

// ----------------------------------------------------------------------
// 2. RESTful API Endpoints (100% Compatible with Cloudflare Workers D1)
// ----------------------------------------------------------------------

// GET /api/settings - Fetch global store settings & banner
app.get('/api/settings', (req, res) => {
  try {
    const row: any = db.prepare('SELECT * FROM site_settings WHERE id = 1').get();
    if (!row) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }
    res.json({
      success: true,
      settings: {
        storeName: row.store_name,
        tagline: row.tagline,
        notificationBarText: row.notification_bar_text,
        showNotificationBar: Boolean(row.show_notification_bar),
        heroHeadline: row.hero_headline,
        heroSubheadline: row.hero_subheadline,
        phone: row.phone,
        email: row.email,
        telegramUsername: row.telegram_username,
        whatsappNumber: row.whatsapp_number,
        instagramUsername: row.instagram_username,
        workingHours: row.working_hours,
        address: row.address,
        bankCardNumber: row.bank_card_number,
        bankCardHolder: row.bank_card_holder,
        bankName: row.bank_name,
        bankShabaNumber: row.bank_shaba_number,
        paymentInstructions: row.payment_instructions,
        specialBannerActive: Boolean(row.special_banner_active),
        specialBannerTitle: row.special_banner_title,
        specialBannerSubtitle: row.special_banner_subtitle,
        specialBannerCoupon: row.special_banner_coupon,
        specialBannerDiscount: row.special_banner_discount,
        bannerImageUrl: row.banner_image_url || '',
        bannerImageActive: row.banner_image_active !== 0,
        storeLogoUrl: row.store_logo_url || '',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/settings - Update global store settings, banner, and logo
app.put('/api/settings', (req, res) => {
  try {
    const body = req.body;
    db.prepare(`
      UPDATE site_settings SET
        store_name = COALESCE(?, store_name),
        tagline = COALESCE(?, tagline),
        notification_bar_text = COALESCE(?, notification_bar_text),
        show_notification_bar = COALESCE(?, show_notification_bar),
        hero_headline = COALESCE(?, hero_headline),
        hero_subheadline = COALESCE(?, hero_subheadline),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        telegram_username = COALESCE(?, telegram_username),
        whatsapp_number = COALESCE(?, whatsapp_number),
        instagram_username = COALESCE(?, instagram_username),
        banner_image_url = COALESCE(?, banner_image_url),
        banner_image_active = COALESCE(?, banner_image_active),
        store_logo_url = COALESCE(?, store_logo_url),
        special_banner_title = COALESCE(?, special_banner_title),
        special_banner_subtitle = COALESCE(?, special_banner_subtitle),
        special_banner_coupon = COALESCE(?, special_banner_coupon),
        special_banner_discount = COALESCE(?, special_banner_discount),
        special_banner_active = COALESCE(?, special_banner_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      body.storeName ?? null,
      body.tagline ?? null,
      body.notificationBarText ?? null,
      body.showNotificationBar !== undefined ? (body.showNotificationBar ? 1 : 0) : null,
      body.heroHeadline ?? null,
      body.heroSubheadline ?? null,
      body.phone ?? null,
      body.email ?? null,
      body.telegramUsername ?? null,
      body.whatsappNumber ?? null,
      body.instagramUsername ?? null,
      body.bannerImageUrl ?? null,
      body.bannerImageActive !== undefined ? (body.bannerImageActive ? 1 : 0) : null,
      body.storeLogoUrl ?? null,
      body.specialBannerTitle ?? null,
      body.specialBannerSubtitle ?? null,
      body.specialBannerCoupon ?? null,
      body.specialBannerDiscount ?? null,
      body.specialBannerActive !== undefined ? (body.specialBannerActive ? 1 : 0) : null
    );

    res.json({ success: true, message: 'تنظیمات با موفقیت در پایگاه‌داده ذخیره شد' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/register - Register user directly into database
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, mobile, password, gamerTag } = req.body;
    if (!fullName || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'تمامی فیلدها الزامی هستند' });
    }

    const cleanMobile = mobile.trim();
    const existing: any = db.prepare('SELECT id FROM users WHERE mobile = ?').get(cleanMobile);
    if (existing) {
      return res.status(409).json({ success: false, message: 'این شماره تلفن قبلاً ثبت شده است' });
    }

    const userId = 'usr_' + Date.now();
    db.prepare(`
      INSERT INTO users (id, full_name, mobile, password_hash, gamer_tag, wallet_balance)
      VALUES (?, ?, ?, ?, ?, 150000)
    `).run(userId, fullName.trim(), cleanMobile, password.trim(), gamerTag?.trim() || null);

    res.json({
      success: true,
      user: {
        id: userId,
        fullName: fullName.trim(),
        name: fullName.trim(),
        mobile: cleanMobile,
        gamerTag: gamerTag?.trim() || null,
        walletBalance: 150000,
        role: 'user',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login - Authenticate user against database
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    const cleanId = identifier?.trim();
    const cleanPass = password?.trim();

    const user: any = db.prepare(`
      SELECT * FROM users
      WHERE mobile = ? OR gamer_tag = ? OR full_name = ?
    `).get(cleanId, cleanId, cleanId);

    if (!user || user.password_hash !== cleanPass) {
      return res.status(401).json({ success: false, message: 'نام کاربری یا کلمه عبور نادرست است' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        name: user.full_name,
        mobile: user.mobile,
        email: user.email,
        gamerTag: user.gamer_tag,
        gameId: user.game_id,
        discordId: user.discord_id,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        walletBalance: user.wallet_balance,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/profile - Update user profile and gamer specifications
app.put('/api/users/profile', (req, res) => {
  try {
    const { id, fullName, mobile, email, gamerTag, gameId, discordId, avatarUrl, bio } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'شناسه کاربر الزامی است' });
    }

    db.prepare(`
      UPDATE users SET
        full_name = COALESCE(?, full_name),
        mobile = COALESCE(?, mobile),
        email = COALESCE(?, email),
        gamer_tag = COALESCE(?, gamer_tag),
        game_id = COALESCE(?, game_id),
        discord_id = COALESCE(?, discord_id),
        avatar_url = COALESCE(?, avatar_url),
        bio = COALESCE(?, bio),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      fullName ?? null,
      mobile ?? null,
      email ?? null,
      gamerTag ?? null,
      gameId ?? null,
      discordId ?? null,
      avatarUrl ?? null,
      bio ?? null,
      id
    );

    res.json({ success: true, message: 'مشخصات کاربر در پایگاه‌داده با موفقیت به‌روزرسانی شد' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/login - Authenticate store owner
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const admin: any = db.prepare('SELECT * FROM admin_credentials WHERE id = 1').get();

    const validUsername = admin ? admin.username : 'IR_FURY_YT';
    const validPassword = admin ? admin.password_hash : 'FURY_SHOP';

    if (username?.trim() === validUsername && password?.trim() === validPassword) {
      return res.json({ success: true, message: 'ورود مدیریت تایید شد' });
    }

    res.status(401).json({ success: false, message: 'نام کاربری یا کلمه عبور مدیر نادرست است' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/credentials - Change admin login credentials
app.put('/api/admin/credentials', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'نام کاربری و رمز الزامی هستند' });
    }

    db.prepare(`
      UPDATE admin_credentials SET
        username = ?,
        password_hash = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(username.trim(), password.trim());

    res.json({ success: true, message: 'اطلاعات ورود مدیر در دیتابیس با موفقیت تغییر یافت' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    const products = rows.map((r: any) => ({
      ...r,
      packages: r.packages_json ? JSON.parse(r.packages_json) : [],
      inStock: Boolean(r.in_stock),
      featured: Boolean(r.featured),
    }));
    res.json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders - Get orders
app.get('/api/orders', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    const orders = rows.map((r: any) => ({
      ...r,
      items: r.items_json ? JSON.parse(r.items_json) : [],
      statusHistory: r.status_history_json ? JSON.parse(r.status_history_json) : [],
    }));
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders - Create new customer order
app.post('/api/orders', (req, res) => {
  try {
    const o = req.body;
    db.prepare(`
      INSERT INTO orders (
        id, tracking_code, user_id, customer_name, customer_mobile,
        items_json, total_amount, subtotal, payment_method, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      o.id || ('ord_' + Date.now()),
      o.trackingCode || ('FURY-' + Math.floor(100000 + Math.random() * 900000)),
      o.userId || null,
      o.customerName || 'کاربر گرامی',
      o.customerMobile || '',
      JSON.stringify(o.items || []),
      o.totalAmount || 0,
      o.subtotal || o.totalAmount || 0,
      o.paymentMethod || 'کارت به کارت',
      o.status || 'pending'
    );
    res.json({ success: true, message: 'سفارش در پایگاه‌داده ثبت شد' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------------
// 3. Vite Middleware Integration (Dev & Prod)
// ----------------------------------------------------------------------
async function startServer() {
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FURY_SHOP Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`📦 Central SQLite/D1 Database initialized at ${dbPath}`);
  });
}

startServer();
