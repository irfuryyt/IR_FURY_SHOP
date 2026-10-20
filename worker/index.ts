/**
 * ==============================================================================
 * Cloudflare Worker Full-Stack Handler for FURY_SHOP
 * - Intercepts all REST API routes (/api/*) and executes queries on Cloudflare D1 (env.DB)
 * - Serves frontend static assets via Workers Static Assets (env.ASSETS)
 * - Implements SPA fallback routing so client-side routes (/products, /admin, etc.) load index.html
 * ==============================================================================
 */

export interface Env {
  DB: D1Database;
  ASSETS?: WorkerFetcher;
}

interface WorkerFetcher {
  fetch: (request: Request | string) => Promise<Response>;
}

interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result[]>;
  exec: (query: string) => Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
  all: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
}

interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: any;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 2. Handle Backend API Routes with Cloudflare D1
    if (url.pathname.startsWith('/api/')) {
      try {
        // --- GET & PUT /api/settings ---
        if (url.pathname === '/api/settings') {
          if (request.method === 'GET') {
            const row: any = await env.DB.prepare(
              'SELECT * FROM site_settings WHERE id = 1'
            ).first();

            if (!row) {
              return jsonResponse({
                success: true,
                settings: {
                  storeName: 'FURY_SHOP',
                  tagline: 'مرجع تخصصی خرید ارز بازی، اکانت‌های پریمیوم و گیفت کارت',
                  notificationBarText: '⚡ تحویل آنی و خودکار ۲۴ ساعته',
                  showNotificationBar: true,
                  heroHeadline: 'خرید سریع جم و ارز تمامی بازی‌ها',
                  heroSubheadline: 'CP کالاف، UC پابجی و اکانت‌های پریمیوم قانونی',
                  bannerImageUrl: '',
                  bannerImageActive: true,
                  storeLogoUrl: '',
                },
              });
            }

            return jsonResponse({
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
          }

          if (request.method === 'PUT') {
            const body: any = await request.json();
            await env.DB.prepare(`
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
            `).bind(
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
            ).run();

            return jsonResponse({ success: true, message: 'تنظیمات در دیتابیس Cloudflare D1 ذخیره شد' });
          }
        }

        // --- POST /api/auth/register ---
        if (url.pathname === '/api/auth/register' && request.method === 'POST') {
          const body: any = await request.json();
          const { fullName, mobile, password, gamerTag } = body;

          if (!fullName || !mobile || !password) {
            return jsonResponse({ success: false, message: 'تمامی فیلدها الزامی هستند' }, 400);
          }

          const cleanMobile = mobile.trim();
          const existing: any = await env.DB.prepare(
            'SELECT id FROM users WHERE mobile = ?'
          ).bind(cleanMobile).first();

          if (existing) {
            return jsonResponse({ success: false, message: 'این شماره تلفن قبلاً در سیستم ثبت شده است' }, 409);
          }

          const userId = 'usr_' + Date.now();
          await env.DB.prepare(`
            INSERT INTO users (id, full_name, mobile, password_hash, gamer_tag, wallet_balance)
            VALUES (?, ?, ?, ?, ?, 150000)
          `).bind(userId, fullName.trim(), cleanMobile, password.trim(), gamerTag?.trim() || null).run();

          return jsonResponse({
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
        }

        // --- POST /api/auth/login ---
        if (url.pathname === '/api/auth/login' && request.method === 'POST') {
          const body: any = await request.json();
          const { identifier, password } = body;
          const cleanId = identifier?.trim();
          const cleanPass = password?.trim();

          const user: any = await env.DB.prepare(`
            SELECT * FROM users
            WHERE mobile = ? OR gamer_tag = ? OR full_name = ?
          `).bind(cleanId, cleanId, cleanId).first();

          if (!user || user.password_hash !== cleanPass) {
            return jsonResponse({ success: false, message: 'نام کاربری یا کلمه عبور نادرست است' }, 401);
          }

          return jsonResponse({
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
        }

        // --- PUT /api/users/profile ---
        if (url.pathname === '/api/users/profile' && request.method === 'PUT') {
          const body: any = await request.json();
          const { id, fullName, mobile, email, gamerTag, gameId, discordId, avatarUrl, bio } = body;

          if (!id) {
            return jsonResponse({ success: false, message: 'شناسه کاربر الزامی است' }, 400);
          }

          await env.DB.prepare(`
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
          `).bind(
            fullName ?? null,
            mobile ?? null,
            email ?? null,
            gamerTag ?? null,
            gameId ?? null,
            discordId ?? null,
            avatarUrl ?? null,
            bio ?? null,
            id
          ).run();

          return jsonResponse({ success: true, message: 'مشخصات کاربر در پایگاه‌داده D1 با موفقیت ذخیره شد' });
        }

        // --- POST /api/admin/login ---
        if (url.pathname === '/api/admin/login' && request.method === 'POST') {
          const body: any = await request.json();
          const { username, password } = body;

          const admin: any = await env.DB.prepare(
            'SELECT * FROM admin_credentials WHERE id = 1'
          ).first();

          const validUsername = admin ? admin.username : 'IR_FURY_YT';
          const validPassword = admin ? admin.password_hash : 'FURY_SHOP';

          if (username?.trim() === validUsername && password?.trim() === validPassword) {
            return jsonResponse({ success: true, message: 'ورود مدیریت تایید شد' });
          }

          return jsonResponse({ success: false, message: 'نام کاربری یا کلمه عبور مدیر نادرست است' }, 401);
        }

        // --- PUT /api/admin/credentials ---
        if (url.pathname === '/api/admin/credentials' && request.method === 'PUT') {
          const body: any = await request.json();
          const { username, password } = body;

          if (!username || !password) {
            return jsonResponse({ success: false, message: 'نام کاربری و کلمه عبور الزامی هستند' }, 400);
          }

          await env.DB.prepare(`
            UPDATE admin_credentials SET
              username = ?,
              password_hash = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
          `).bind(username.trim(), password.trim()).run();

          return jsonResponse({ success: true, message: 'اطلاعات ورود مدیر در دیتابیس ذخیره شد' });
        }

        // --- GET /api/products ---
        if (url.pathname === '/api/products' && request.method === 'GET') {
          const { results } = await env.DB.prepare(
            'SELECT * FROM products ORDER BY created_at DESC'
          ).all();
          const products = (results || []).map((r: any) => ({
            ...r,
            packages: r.packages_json ? JSON.parse(r.packages_json) : [],
            inStock: Boolean(r.in_stock),
            featured: Boolean(r.featured),
          }));
          return jsonResponse({ success: true, products });
        }

        // --- GET /api/orders ---
        if (url.pathname === '/api/orders' && request.method === 'GET') {
          const { results } = await env.DB.prepare(
            'SELECT * FROM orders ORDER BY created_at DESC'
          ).all();
          const orders = (results || []).map((r: any) => ({
            ...r,
            items: r.items_json ? JSON.parse(r.items_json) : [],
            statusHistory: r.status_history_json ? JSON.parse(r.status_history_json) : [],
          }));
          return jsonResponse({ success: true, orders });
        }

        // --- POST /api/orders ---
        if (url.pathname === '/api/orders' && request.method === 'POST') {
          const o: any = await request.json();
          const orderId = o.id || ('ord_' + Date.now());
          const trackingCode = o.trackingCode || ('FURY-' + Math.floor(100000 + Math.random() * 900000));
          await env.DB.prepare(`
            INSERT INTO orders (
              id, tracking_code, user_id, customer_name, customer_mobile,
              items_json, total_amount, subtotal, payment_method, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            orderId,
            trackingCode,
            o.userId || null,
            o.customerName || 'کاربر گرامی',
            o.customerMobile || '',
            JSON.stringify(o.items || []),
            o.totalAmount || 0,
            o.subtotal || o.totalAmount || 0,
            o.paymentMethod || 'کارت به کارت',
            o.status || 'pending'
          ).run();

          return jsonResponse({
            success: true,
            message: 'سفارش در پایگاه‌داده D1 ثبت شد',
            orderId,
            trackingCode,
          });
        }

        return jsonResponse({ error: 'Endpoint not found' }, 404);
      } catch (err: any) {
        return jsonResponse({ success: false, error: err.message }, 500);
      }
    }

    // 3. Serve Frontend Static Assets with SPA Fallback
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !url.pathname.includes('.')) {
        // SPA rewrite: Serve index.html for client-side routes
        return await env.ASSETS.fetch(new URL('/', request.url).toString());
      }
      return response;
    }

    return new Response('Frontend asset fetcher not bound', { status: 404 });
  },
};
