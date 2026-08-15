/**
 * ADMS API Client
 * Centralized service for making backend API calls.
 */

const API_BASE_URL = '/api/admin';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // In a real production app, we would inject an auth token here
    // const token = localStorage.getItem('token');
    // if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = endpoint.startsWith('/api/') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Terjadi kesalahan pada server');
    }

    return data;
  }

  // ==========================================
  // USERS MODULE
  // ==========================================
  
  async getUsers(params?: { role?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/users?${query}`);
  }

  async getUserById(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async updateUserStatus(id: string, status: string) {
    return this.request<any>(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==========================================
  // MERCHANTS MODULE
  // ==========================================

  async getMerchants(params?: { verificationStatus?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/merchants?${query}`);
  }

  async updateMerchantVerification(id: string, status: string, notes?: string) {
    return this.request<any>(`/merchants/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // ==========================================
  // MARKETPLACE MODULE (PRODUCTS & CATEGORIES)
  // ==========================================

  async getProducts(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/products?${query}`);
  }

  async moderateProduct(id: string, status: string, notes?: string) {
    return this.request<any>(`/products/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async createCategory(data: any) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // TRANSACTIONS & FINANCE MODULE
  // ==========================================

  async getOrders(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/orders?${query}`);
  }

  async getOrderById(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async getRefunds(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/refunds?${query}`);
  }

  async processRefund(id: string, status: string, notes?: string) {
    return this.request<any>(`/refunds/${id}/process`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getFinanceOverview() {
    return this.request<any>('/finance/overview');
  }

  async getMerchantBalances() {
    return this.request<any[]>('/finance/balances');
  }

  async getWithdrawals(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/withdrawals?${query}`);
  }

  async processWithdrawal(id: string, status: string, notes?: string) {
    return this.request<any>(`/withdrawals/${id}/process`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // ==========================================
  // ADVERTISING MODULE
  // ==========================================

  async getAdPackages() {
    return this.request<any[]>('/ads/packages');
  }

  async getActiveAds() {
    return this.request<any[]>('/ads/active');
  }

  async getAdRequests(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/ads/requests?${query}`);
  }

  async moderateAdRequest(id: string, status: string, notes?: string) {
    return this.request<any>(`/ads/requests/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // ==========================================
  // PROMO & DISCOUNT MODULE
  // ==========================================

  async getPromos() {
    return this.request<any[]>('/promos');
  }

  async createPromo(data: any) {
    return this.request<any>('/promos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async togglePromoStatus(id: string, isActive: boolean) {
    return this.request<any>(`/promos/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  // ==========================================
  // MODERATION MODULE
  // ==========================================

  async getReports(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/moderation/reports?${query}`);
  }

  async processReport(id: string, action: string, notes?: string) {
    return this.request<any>(`/moderation/reports/${id}/process`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    });
  }

  // ==========================================
  // SUPPORT & TICKETING MODULE
  // ==========================================

  async getTickets(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/support/tickets?${query}`);
  }

  async replyTicket(id: string, message: string, markAsResolved: boolean) {
    return this.request<any>(`/support/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message, markAsResolved }),
    });
  }

  // ==========================================
  // ANALYTICS MODULE
  // ==========================================

  async getAnalytics(params?: { period?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/analytics?${query}`);
  }

  async getDashboardStats() {
    return this.request<any>('/analytics/dashboard');
  }
  // ==========================================
  // CONTENT MANAGEMENT SYSTEM (CMS) MODULE
  // ==========================================

  async getPages() {
    return this.request<any[]>('/cms/pages');
  }

  async updatePage(id: string, data: any) {
    return this.request<any>(`/cms/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // SETTINGS MODULE
  // ==========================================

  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSettings(data: any) {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // NOTIFICATIONS MODULE
  // ==========================================

  async getAdminNotifications() {
    return this.request<any[]>('/notifications/admin');
  }

  async sendBroadcastNotification(data: any) {
    return this.request<any>('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // SECURITY & AUDIT MODULE
  // ==========================================

  async getSecurityLogs() {
    return this.request<any[]>('/security/logs');
  }

  // ==========================================
  // PUBLIC & MERCHANT API
  // ==========================================

  async getPublicProducts(params?: { search?: string; category?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/api/public/products?${query}`);
  }

  async registerMerchant(data: any) {
    return this.request<any>('/api/public/merchants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createMerchantProduct(data: any) {
    return this.request<any>('/api/merchant/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

}

export const api = new ApiClient();
