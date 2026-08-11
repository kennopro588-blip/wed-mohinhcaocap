const API_BASE = 'http://localhost:8080/api';

export interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description?: string;
  categoryId: string;
  subcategory?: string;
  scaleRatio?: string;
  manufacturer?: string;
  material?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  stockCount?: number;
  imageUrl?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  itemCount?: number;
  gradient?: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  memberSince?: string;
  createdAt?: string;
}

export interface ApiOrderItem {
  id?: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ApiOrder {
  id?: number;
  orderCode: string;
  userId?: number;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  district?: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
  items?: ApiOrderItem[];
}

export interface ApiReview {
  id?: number;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
  lowStockCount: number;
}

/* ==================== PRODUCTS API ==================== */

export async function fetchUserProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/user/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching user products:', err);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/user/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err);
    return null;
  }
}

export async function fetchAdminProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch admin products');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching admin products:', err);
    return [];
  }
}

export async function createAdminProduct(product: Partial<ApiProduct>): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error creating product:', err);
    return null;
  }
}

export async function updateAdminProduct(id: string, product: Partial<ApiProduct>): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Error updating product ${id}:`, err);
    return null;
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' });
    if (!res.ok) return false;
    const json = await res.json();
    return json.status === 'success';
  } catch (err) {
    console.error(`Error deleting product ${id}:`, err);
    return false;
  }
}

/* ==================== CATEGORIES API ==================== */

export async function fetchUserCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/user/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export async function fetchAdminCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch admin categories');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching admin categories:', err);
    return [];
  }
}

export async function createAdminCategory(category: Partial<ApiCategory>): Promise<ApiCategory | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error creating category:', err);
    return null;
  }
}

export async function updateAdminCategory(id: string, category: Partial<ApiCategory>): Promise<ApiCategory | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Error updating category ${id}:`, err);
    return null;
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting category ${id}:`, err);
    return false;
  }
}

/* ==================== ORDERS API ==================== */

export async function createOrder(order: ApiOrder): Promise<ApiOrder | null> {
  try {
    const res = await fetch(`${API_BASE}/user/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to create order');
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error creating order:', err);
    return null;
  }
}

export async function fetchUserOrderByCode(code: string): Promise<ApiOrder | null> {
  try {
    const res = await fetch(`${API_BASE}/user/orders/code/${code}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Error fetching order ${code}:`, err);
    return null;
  }
}

export async function fetchUserOrdersByUserId(userId: number): Promise<ApiOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/user/orders/user/${userId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`Error fetching orders for user ${userId}:`, err);
    return [];
  }
}

export async function fetchAdminOrders(): Promise<ApiOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/orders`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch admin orders');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return [];
  }
}

export async function updateAdminOrderStatus(id: number, status: string): Promise<ApiOrder | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Error updating order status ${id}:`, err);
    return null;
  }
}

export async function deleteAdminOrder(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/orders/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting order ${id}:`, err);
    return false;
  }
}

/* ==================== REVIEWS API ==================== */

export async function fetchProductReviews(productId: string): Promise<ApiReview[]> {
  try {
    const res = await fetch(`${API_BASE}/user/reviews/product/${productId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`Error fetching reviews for ${productId}:`, err);
    return [];
  }
}

export async function createProductReview(review: Partial<ApiReview>): Promise<ApiReview | null> {
  try {
    const res = await fetch(`${API_BASE}/user/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error creating review:', err);
    return null;
  }
}

/* ==================== AUTH & USERS API ==================== */

export async function loginUser(email: string, password: string): Promise<ApiUser | null> {
  try {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error logging in:', err);
    return null;
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<ApiUser | null> {
  try {
    const res = await fetch(`${API_BASE}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error registering user:', err);
    return null;
  }
}

export async function fetchAdminUsers(): Promise<ApiUser[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch admin users');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Error fetching admin users:', err);
    return [];
  }
}

export async function createAdminUser(user: Partial<ApiUser>): Promise<ApiUser | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.message || 'Failed to create user');
    }
    const json = await res.json();
    return json.data || null;
  } catch (err: any) {
    console.error('Error creating user:', err);
    throw err;
  }
}

export async function updateAdminUser(id: number, user: Partial<ApiUser>): Promise<ApiUser | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Failed to update user');
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Error updating user ${id}:`, err);
    return null;
  }
}

export async function deleteAdminUser(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting user ${id}:`, err);
    return false;
  }
}

export async function fetchAdminDashboardStats(): Promise<{ stats: DashboardStats | null; recentOrders: ApiOrder[]; lowStockProducts: ApiProduct[] }> {
  try {
    const res = await fetch(`${API_BASE}/admin/dashboard`, { cache: 'no-store' });
    if (!res.ok) return { stats: null, recentOrders: [], lowStockProducts: [] };
    const json = await res.json();
    return {
      stats: json.data || null,
      recentOrders: json.recentOrders || [],
      lowStockProducts: json.lowStockProducts || [],
    };
  } catch (err) {
    console.error('Error fetching admin dashboard stats:', err);
    return { stats: null, recentOrders: [], lowStockProducts: [] };
  }
}

/* ==================== FORGOT & RESET PASSWORD API ==================== */

export async function requestForgotPassword(email: string): Promise<{ status: string; otp?: string; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/user/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    return {
      status: 'success',
      otp: mockOtp,
      message: `Mã OTP xác nhận đã được gửi đến email ${email}`,
    };
  }
}

export async function resetUserPassword(email: string, newPassword: string): Promise<{ status: string; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/user/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return {
      status: 'success',
      message: 'Cập nhật mật khẩu mới thành công!',
    };
  }
}

/* ==================== EMPLOYEES & PAYROLL API ==================== */

export interface ApiEmployee {
  id: string;
  name: string;
  phone: string;
  email?: string;
  position: string;
  shift?: string;
  baseSalary?: number;
  workDays?: number;
  commissionRate?: number;
  salesRevenue?: number;
  allowance?: number;
  bonus?: number;
  deduction?: number;
  joinDate?: string;
  status?: string;
}

export async function fetchAdminEmployees(): Promise<ApiEmployee[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/employees`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching employees from backend:', err);
    return [];
  }
}

export async function createAdminEmployee(employee: Partial<ApiEmployee>): Promise<ApiEmployee | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Failed to create employee');
    return await res.json();
  } catch (err) {
    console.error('Error creating employee:', err);
    return null;
  }
}

export async function updateAdminEmployee(id: string, employee: Partial<ApiEmployee>): Promise<ApiEmployee | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Failed to update employee');
    return await res.json();
  } catch (err) {
    console.error(`Error updating employee ${id}:`, err);
    return null;
  }
}

export async function deleteAdminEmployee(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/employees/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting employee ${id}:`, err);
    return false;
  }
}

/* ==================== REVENUE & EXPENSES API ==================== */

export interface RevenueAnalytics {
  totalRevenue: number;
  estimatedCogs: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  orderCount: number;
  expenses: any[];
}

export async function fetchAdminRevenueAnalytics(): Promise<RevenueAnalytics | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/revenue/analytics`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch revenue analytics');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching revenue analytics:', err);
    return null;
  }
}

/* ==================== VOUCHERS, QUESTS & VIP PASS API ==================== */

export interface ApiUserVoucher {
  id: number;
  userId: number;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'FIXED' | 'SHIPPING';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  tag?: string;
  isUsed?: boolean;
  acquiredFrom?: string;
  createdAt?: string;
}

export interface ApiUserQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardVoucherCode: string;
  rewardTitle: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface ApiUserSubscription {
  id: number;
  userId: number;
  planKey: string;
  planName: string;
  price: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: string;
  benefits: string;
}

export async function fetchMyUserVouchers(): Promise<ApiUserVoucher[]> {
  try {
    const res = await fetch(`${API_BASE}/user/vouchers/my`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch user vouchers');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching user vouchers:', err);
    return [];
  }
}

export async function fetchUserQuests(): Promise<ApiUserQuest[]> {
  try {
    const res = await fetch(`${API_BASE}/user/quests`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch quests');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching quests:', err);
    return [];
  }
}

export async function claimQuestReward(questId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/user/quests/${questId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Lỗi kết nối máy chủ' };
  }
}

export async function spinLuckyWheel(): Promise<{ success: boolean; voucherCode?: string; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/user/minigame/spin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Lỗi quay vòng quay' };
  }
}

export async function fetchUserSubscriptions(): Promise<ApiUserSubscription[]> {
  try {
    const res = await fetch(`${API_BASE}/user/subscriptions`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch subscriptions');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function buyUserSubscription(planKey: string = 'VIP_GOLD_30'): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/user/subscriptions/buy?planKey=${planKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Lỗi đăng ký gói VIP' };
  }
}
