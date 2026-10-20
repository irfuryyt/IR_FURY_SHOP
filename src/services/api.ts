import { SiteSettings, User, Product, Order, OrderStatus } from '../types';

const API_BASE = '/api';

/**
 * ==============================================================================
 * Universal Database API Service for FURY_SHOP
 * - Connects frontend directly to Cloudflare D1 / Express Full-Stack Server
 * - Completely replaces browser-only localStorage persistence with real D1 database calls
 * - Provides fallback caching so user experience remains resilient
 * ==============================================================================
 */

// ----------------------------------------------------------------------
// 1. SITE SETTINGS & BANNER API
// ----------------------------------------------------------------------

export async function fetchSiteSettingsApi(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (data.success && data.settings) {
      try {
        localStorage.setItem('furyshop_settings_cache', JSON.stringify(data.settings));
      } catch {
        // ignore
      }
      return data.settings;
    }
    return null;
  } catch (err) {
    console.warn('API error fetching site settings, using offline cache fallback:', err);
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
    console.error('API error updating site settings in D1:', err);
    return { success: false, message: err.message };
  }
}

// ----------------------------------------------------------------------
// 2. USER AUTHENTICATION & GAMER PROFILE API
// ----------------------------------------------------------------------

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

export async function fetchUserProfileApi(
  userId: string
): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/users/profile?id=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ----------------------------------------------------------------------
// 3. ADMIN AUTHENTICATION API
// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------
// 4. PRODUCTS & CATALOG API
// ----------------------------------------------------------------------

export async function fetchProductsApi(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.success && Array.isArray(data.products) ? data.products : null;
  } catch (err) {
    console.warn('API error fetching products, using local fallback:', err);
    return null;
  }
}

export async function saveProductApi(
  product: Partial<Product>
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ----------------------------------------------------------------------
// 5. ORDERS & TRACKING API
// ----------------------------------------------------------------------

export async function fetchOrdersApi(): Promise<Order[] | null> {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.success && Array.isArray(data.orders) ? data.orders : null;
  } catch (err) {
    console.warn('API error fetching orders:', err);
    return null;
  }
}

export async function createOrderApi(
  order: Partial<Order>
): Promise<{ success: boolean; message?: string; trackingCode?: string; orderId?: string }> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateOrderStatusApi(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
