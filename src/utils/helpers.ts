// Helper utilities for Persian gaming store

export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => persianDigits[parseInt(x)]);
}

export function formatToman(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '۰ تومان';
  const formatted = amount.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} تومان`;
}

export function generateTrackingCode(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `VG-${randomNum}`;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export function getPersianNow(): string {
  const now = new Date();
  const time = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  return `امروز - ${time}`;
}
