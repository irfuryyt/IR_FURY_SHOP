/**
 * Cloudflare Worker API & Static Asset Handler for FURY_SHOP
 * Bound to Cloudflare D1 Database (`env.DB`)
 */

interface WorkerFetcher {
  fetch: (request: Request) => Promise<Response>;
}

export interface Env {
  DB: D1Database;
  ASSETS?: WorkerFetcher;
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

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    try {
      // -------------------------------------------------------------
      // 1. Site Settings API (Store name, Banner Image, Logo, Contacts)
      // -------------------------------------------------------------
      if (url.pathname === '/api/settings') {
        if (request.method === 'GET') {
          const row: any = await env.DB.prepare(
            'SELECT * FROM site_settings WHERE id = 1'
          ).first();

          if (!row) {
            return jsonResponse({ success: false, message: 'Settings not initialized' }, 404);
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

          return jsonResponse({ success: true, message: 'تنظیمات با موفقیت در دیتابیس D1 به‌روزرسانی شد' });
        }
      }

      // -------------------------------------------------------------
      // 2. Authentication API (Register & Login)
      // -------------------------------------------------------------
      if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        const body: any = await request.json();
        const { fullName, mobile, password, gamerTag } = body;

        if (!fullName || !mobile || !password) {
          return jsonResponse({ success: false, message: 'تمامی فیلدها الزامی هستند' }, 400);
        }

        const existing: any = await env.DB.prepare(
          'SELECT id FROM users WHERE mobile = ?'
        ).bind(mobile.trim()).first();

        if (existing) {
          return jsonResponse({ success: false, message: 'این شماره تلفن قبلاً در سیستم ثبت شده است' }, 409);
        }

        const userId = 'usr_' + Date.now();
        await env.DB.prepare(`
          INSERT INTO users (id, full_name, mobile, password_hash, gamer_tag, wallet_balance)
          VALUES (?, ?, ?, ?, ?, 150000)
        `).bind(userId, fullName.trim(), mobile.trim(), password.trim(), gamerTag?.trim() || null).run();

        return jsonResponse({
          success: true,
          user: {
            id: userId,
            fullName: fullName.trim(),
            name: fullName.trim(),
            mobile: mobile.trim(),
            gamerTag: gamerTag?.trim() || null,
            walletBalance: 150000,
            role: 'user',
          },
        });
      }

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
          return jsonResponse({ success: false, message: 'نام کاربری یا رمز عبور اشتباه است' }, 401);
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

      // -------------------------------------------------------------
      // 3. User Profile API (Update gamer info, avatar, contact)
      // -------------------------------------------------------------
      if (url.pathname === '/api/users/profile') {
        if (request.method === 'PUT') {
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
      }

      // -------------------------------------------------------------
      // 4. Admin Credentials & Login API
      // -------------------------------------------------------------
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

      // Default fallback to static assets if running in full Worker bundle
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }

      return jsonResponse({ error: 'Endpoint not found' }, 404);
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  },
};
