import { SiteSettings, User } from '../types';

const API_BASE = '/api';

/**
 * Universal Database API Client for FURY_SHOP
 * Communicates with Cloudflare D1 / Full-Stack Express Server
 * With automatic offline fallback for resilience
 */

export async function fetchSiteSettingsApi(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (data.success && data.settings) {
      try {
        localStorage.setItem('furyshop_settings_cache', JSON.stringify(data.settings));
      } catch {
        // ignore quota
      }
      return data.settings;
    }
    return null;
  } catch (err) {
    console.warn('API error fetching site settings, falling back to cache:', err);
    try {
      const cached = localStorage.getItem('furyshop_settings_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }
}

export async function updateSiteSettingsApi(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('API error updating site settings:', err);
    return { success: false, message: err.message };
  }
}

export async function registerUserApi(data: {
  fullName: string;
  mobile: string;
  password: string;
  gamerTag?: string;
}): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: 'خطا در ارتباط با پایگاه‌داده سرور' };
  }
}

export async function loginUserApi(
  identifier: string,
  password: string
): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: 'خطا در اتصال به سرور جهت ورود' };
  }
}

export async function updateUserProfileApi(
  userId: string,
  data: Partial<User>
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, ...data }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: 'خطا در ذخیره مشخصات در پایگاه‌داده' };
  }
}

export async function adminLoginApi(
  username: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: 'خطا در برقراری ارتباط با سرور' };
  }
}

export async function updateAdminCredentialsApi(
  username: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: 'خطا در ذخیره‌سازی اطلاعات مدیر' };
  }
}
