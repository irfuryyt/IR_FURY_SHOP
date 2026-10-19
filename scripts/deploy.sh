#!/usr/bin/env bash
# ==============================================================================
# اسکریپت خودکار بیلد و دیپلوی پروژه روی Cloudflare Workers
# ==============================================================================

set -e

echo "🔨 مرحله ۱: در حال ساخت نسخه نهایی فرانت‌اند (npm run build)..."
npm run build

echo "🚀 مرحله ۲: در حال انتشار ورکر روی کلودفلر (wrangler deploy)..."
if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
  npx wrangler deploy
  echo "✅ دیپلوی با موفقیت روی Cloudflare Workers انجام شد!"
else
  echo "ℹ️ لطفاً توکن API کلودفلر خود را وارد کنید یا دستور npx wrangler login را اجرا فرمایید."
fi
