import { z } from 'zod';

// Base API Configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Authentication Types
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  permissions: string[];
  lastLogin?: Date;
}

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Validation Schemas
const siteSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string()
  }),
  capacity: z.number(),
  type: z.enum(['solar', 'wind', 'battery', 'hybrid']),
  status: z.enum(['active', 'inactive', 'maintenance', 'error']),
  createdAt: z.string().transform(str => new Date(str)),
  updatedAt: z.string().transform(str => new Date(str))
});

const energyDataSchema = z.object({
  timestamp: z.string().transform(str => new Date(str)),
  siteId: z.string(),
  generation: z.number(),
  consumption: z.number(),
  storage: z.number(),
  gridImport: z.number(),
  gridExport: z.number(),
  efficiency: z.number()
});

const alertSchema = z.object({
  id: z.string(),
  siteId: z.string().optional(),
  severity: z.enum(['critical', 'warning', 'info']),
  type: z.string(),
  message: z.string(),
  timestamp: z.string().transform(str => new Date(str)),
  resolved: z.boolean(),
  resolvedAt: z.string().optional().transform(str => str ? new Date(str) : undefined)
});

// Type definitions from schemas
export type Site = z.infer<typeof siteSchema>;
export type EnergyData = z.infer<typeof energyDataSchema>;
export type Alert = z.infer<typeof alertSchema>;

// Request/Response interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateSiteRequest {
  name?: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  capacity?: number;
  status?: 'active' | 'inactive' | 'maintenance' | 'error';
}

export interface EnergyDataQuery {
  siteId?: string;
  startDate?: Date;
  endDate?: Date;
  granularity?: 'minute' | 'hour' | 'day' | 'week' | 'month';
  metrics?: string[];
}

export interface AlertQuery {
  siteId?: string;
  severity?: 'critical' | 'warning' | 'info';
  resolved?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// HTTP Client Class
class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private retryConfig: { maxRetries: number; retryDelay: number };
  
  constructor(baseURL: string, timeout = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.retryConfig = {
      maxRetries: MAX_RETRIES,
      retryDelay: RETRY_DELAY
    };
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const headers = {
        ...this.defaultHeaders,
        ...options.headers
      };
      
      // Add auth token if available
      const tokens = AuthManager.getTokens();
      if (tokens?.accessToken) {
        headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle different response statuses
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await AuthManager.refreshToken();
        if (refreshed && retryCount === 0) {
          return this.request<T>(endpoint, options, retryCount + 1);
        } else {
          AuthManager.logout();
          throw new ApiException('Authentication failed', 'AUTH_FAILED', 401);
        }
      }
      
      if (!response.ok) {
        if (retryCount < this.retryConfig.maxRetries && this.shouldRetry(response.status)) {
          await this.delay(this.retryConfig.retryDelay * Math.pow(2, retryCount));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new ApiException(
          errorData.message || `HTTP ${response.status}`,
          errorData.code || 'HTTP_ERROR',
          response.status,
          errorData
        );
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiException) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new ApiException('Request timeout', 'TIMEOUT', 408);
      }
      
      if (retryCount < this.retryConfig.maxRetries && this.shouldRetryError(error)) {
        await this.delay(this.retryConfig.retryDelay * Math.pow(2, retryCount));
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      
      throw new ApiException(
        error.message || 'Network error',
        'NETWORK_ERROR',
        0,
        { originalError: error }
      );
    }
  }
  
  private shouldRetry(status: number): boolean {
    return status >= 500 || status === 429; // Server errors or rate limiting
  }
  
  private shouldRetryError(error: any): boolean {
    return error.name === 'TypeError' || error.code === 'NETWORK_ERROR';
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }
  
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }
  
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }
  
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Custom API Exception
export class ApiException extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Authentication Manager
class AuthenticationManager {
  private static readonly TOKEN_KEY = 'wem_auth_tokens';
  private static readonly USER_KEY = 'wem_auth_user';
  
  getTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem(AuthenticationManager.TOKEN_KEY);
      if (!stored) return null;
      
      const tokens: AuthTokens = JSON.parse(stored);
      
      // Check if token is expired
      if (Date.now() >= tokens.expiresAt) {
        this.logout();
        return null;
      }
      
      return tokens;
    } catch {
      return null;
    }
  }
  
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(AuthenticationManager.TOKEN_KEY, JSON.stringify(tokens));
  }
  
  getUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(AuthenticationManager.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  setUser(user: AuthUser): void {
    localStorage.setItem(AuthenticationManager.USER_KEY, JSON.stringify(user));
  }
  
  async refreshToken(): Promise<boolean> {
    try {
      const tokens = this.getTokens();
      if (!tokens?.refreshToken) return false;
      
      const response = await httpClient.post<ApiResponse<AuthTokens>>('/auth/refresh', {
        refreshToken: tokens.refreshToken
      });
      
      this.setTokens(response.data);
      return true;
    } catch {
      this.logout();
      return false;
    }
  }
  
  logout(): void {
    localStorage.removeItem(AuthenticationManager.TOKEN_KEY);
    localStorage.removeItem(AuthenticationManager.USER_KEY);
  }
  
  isAuthenticated(): boolean {
    return this.getTokens() !== null;
  }
}

// Global instances
const httpClient = new HttpClient(API_BASE_URL);
const AuthManager = new AuthenticationManager();

// API Service Classes
export class AuthService {
  static async login(credentials: LoginRequest): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const response = await httpClient.post<ApiResponse<{ user: AuthUser; tokens: AuthTokens }>>(
      '/auth/login',
      credentials
    );
    
    AuthManager.setTokens(response.data.tokens);
    AuthManager.setUser(response.data.user);
    
    return response.data;
  }
  
  static async register(userData: RegisterRequest): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const response = await httpClient.post<ApiResponse<{ user: AuthUser; tokens: AuthTokens }>>(
      '/auth/register',
      userData
    );
    
    AuthManager.setTokens(response.data.tokens);
    AuthManager.setUser(response.data.user);
    
    return response.data;
  }
  
  static async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } catch {
      // Continue with logout even if API call fails
    } finally {
      AuthManager.logout();
    }
  }
  
  static async getCurrentUser(): Promise<AuthUser> {
    const response = await httpClient.get<ApiResponse<AuthUser>>('/auth/me');
    AuthManager.setUser(response.data);
    return response.data;
  }
  
  static async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    const response = await httpClient.patch<ApiResponse<AuthUser>>('/auth/profile', data);
    AuthManager.setUser(response.data);
    return response.data;
  }
  
  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await httpClient.post('/auth/change-password', { oldPassword, newPassword });
  }
  
  static getStoredUser(): AuthUser | null {
    return AuthManager.getUser();
  }
  
  static isAuthenticated(): boolean {
    return AuthManager.isAuthenticated();
  }
}

export class SiteService {
  static async getSites(): Promise<Site[]> {
    const response = await httpClient.get<ApiResponse<Site[]>>('/sites');
    return response.data.map(site => siteSchema.parse(site));
  }
  
  static async getSite(id: string): Promise<Site> {
    const response = await httpClient.get<ApiResponse<Site>>(`/sites/${id}`);
    return siteSchema.parse(response.data);
  }
  
  static async createSite(siteData: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Promise<Site> {
    const response = await httpClient.post<ApiResponse<Site>>('/sites', siteData);
    return siteSchema.parse(response.data);
  }
  
  static async updateSite(id: string, updates: UpdateSiteRequest): Promise<Site> {
    const response = await httpClient.patch<ApiResponse<Site>>(`/sites/${id}`, updates);
    return siteSchema.parse(response.data);
  }
  
  static async deleteSite(id: string): Promise<void> {
    await httpClient.delete(`/sites/${id}`);
  }
  
  static async getSiteStatus(id: string): Promise<{
    status: Site['status'];
    lastUpdate: Date;
    metrics: {
      uptime: number;
      efficiency: number;
      errorCount: number;
    };
  }> {
    const response = await httpClient.get<ApiResponse<any>>(`/sites/${id}/status`);
    return {
      ...response.data,
      lastUpdate: new Date(response.data.lastUpdate)
    };
  }
}

export class EnergyDataService {
  static async getEnergyData(query: EnergyDataQuery = {}): Promise<EnergyData[]> {
    const params: Record<string, string> = {};
    
    if (query.siteId) params.siteId = query.siteId;
    if (query.startDate) params.startDate = query.startDate.toISOString();
    if (query.endDate) params.endDate = query.endDate.toISOString();
    if (query.granularity) params.granularity = query.granularity;
    if (query.metrics) params.metrics = query.metrics.join(',');
    
    const response = await httpClient.get<ApiResponse<EnergyData[]>>('/energy-data', params);
    return response.data.map(data => energyDataSchema.parse(data));
  }
  
  static async getRealtimeData(siteId?: string): Promise<EnergyData[]> {
    const params = siteId ? { siteId } : {};
    const response = await httpClient.get<ApiResponse<EnergyData[]>>('/energy-data/realtime', params);
    return response.data.map(data => energyDataSchema.parse(data));
  }
  
  static async getAggregatedData(query: EnergyDataQuery & {
    aggregation: 'sum' | 'avg' | 'min' | 'max';
    groupBy?: 'site' | 'hour' | 'day' | 'week' | 'month';
  }): Promise<Record<string, number>[]> {
    const params: Record<string, string> = {
      aggregation: query.aggregation
    };
    
    if (query.siteId) params.siteId = query.siteId;
    if (query.startDate) params.startDate = query.startDate.toISOString();
    if (query.endDate) params.endDate = query.endDate.toISOString();
    if (query.groupBy) params.groupBy = query.groupBy;
    if (query.metrics) params.metrics = query.metrics.join(',');
    
    const response = await httpClient.get<ApiResponse<Record<string, number>[]>>('/energy-data/aggregated', params);
    return response.data;
  }
  
  static async exportData(query: EnergyDataQuery, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const params: Record<string, string> = { format };
    
    if (query.siteId) params.siteId = query.siteId;
    if (query.startDate) params.startDate = query.startDate.toISOString();
    if (query.endDate) params.endDate = query.endDate.toISOString();
    if (query.granularity) params.granularity = query.granularity;
    
    const response = await fetch(`${API_BASE_URL}/energy-data/export?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `Bearer ${AuthManager.getTokens()?.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new ApiException('Export failed', 'EXPORT_ERROR', response.status);
    }
    
    return response.blob();
  }
}

export class AlertService {
  static async getAlerts(query: AlertQuery = {}): Promise<Alert[]> {
    const params: Record<string, string> = {};
    
    if (query.siteId) params.siteId = query.siteId;
    if (query.severity) params.severity = query.severity;
    if (query.resolved !== undefined) params.resolved = String(query.resolved);
    if (query.startDate) params.startDate = query.startDate.toISOString();
    if (query.endDate) params.endDate = query.endDate.toISOString();
    
    const response = await httpClient.get<ApiResponse<Alert[]>>('/alerts', params);
    return response.data.map(alert => alertSchema.parse(alert));
  }
  
  static async getAlert(id: string): Promise<Alert> {
    const response = await httpClient.get<ApiResponse<Alert>>(`/alerts/${id}`);
    return alertSchema.parse(response.data);
  }
  
  static async resolveAlert(id: string, resolution?: string): Promise<Alert> {
    const response = await httpClient.patch<ApiResponse<Alert>>(`/alerts/${id}/resolve`, {
      resolution
    });
    return alertSchema.parse(response.data);
  }
  
  static async createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved' | 'resolvedAt'>): Promise<Alert> {
    const response = await httpClient.post<ApiResponse<Alert>>('/alerts', alertData);
    return alertSchema.parse(response.data);
  }
  
  static async getAlertStats(): Promise<{
    total: number;
    critical: number;
    warning: number;
    info: number;
    resolved: number;
    unresolved: number;
  }> {
    const response = await httpClient.get<ApiResponse<any>>('/alerts/stats');
    return response.data;
  }
}

export class AnalyticsService {
  static async getDashboardMetrics(timeRange: '24h' | '7d' | '30d' | '90d' = '24h'): Promise<{
    totalGeneration: number;
    totalConsumption: number;
    efficiency: number;
    carbonSaved: number;
    revenue: number;
    sitesOnline: number;
    totalSites: number;
    trends: {
      generation: number;
      consumption: number;
      efficiency: number;
    };
  }> {
    const response = await httpClient.get<ApiResponse<any>>('/analytics/dashboard', { timeRange });
    return response.data;
  }
  
  static async getPerformanceReport(siteId?: string, startDate?: Date, endDate?: Date): Promise<{
    summary: {
      avgEfficiency: number;
      totalGeneration: number;
      uptime: number;
      revenue: number;
    };
    trends: Array<{
      date: string;
      efficiency: number;
      generation: number;
      consumption: number;
    }>;
    recommendations: Array<{
      type: 'efficiency' | 'maintenance' | 'optimization';
      priority: 'high' | 'medium' | 'low';
      description: string;
      estimatedImpact: string;
    }>;
  }> {
    const params: Record<string, string> = {};
    if (siteId) params.siteId = siteId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    const response = await httpClient.get<ApiResponse<any>>('/analytics/performance', params);
    return response.data;
  }
  
  static async getRegionalAnalytics(): Promise<Array<{
    region: string;
    totalCapacity: number;
    totalGeneration: number;
    efficiency: number;
    sitesCount: number;
    revenue: number;
  }>> {
    const response = await httpClient.get<ApiResponse<any>>('/analytics/regional');
    return response.data;
  }
}

// Settings Service
export class SettingsService {
  static async getSettings(): Promise<Record<string, any>> {
    const response = await httpClient.get<ApiResponse<Record<string, any>>>('/settings');
    return response.data;
  }
  
  static async updateSettings(settings: Record<string, any>): Promise<Record<string, any>> {
    const response = await httpClient.patch<ApiResponse<Record<string, any>>>('/settings', settings);
    return response.data;
  }
  
  static async resetSettings(): Promise<Record<string, any>> {
    const response = await httpClient.post<ApiResponse<Record<string, any>>>('/settings/reset');
    return response.data;
  }
}

// User Management Service
export class UserService {
  static async getUsers(): Promise<AuthUser[]> {
    const response = await httpClient.get<ApiResponse<AuthUser[]>>('/users');
    return response.data;
  }
  
  static async getUser(id: string): Promise<AuthUser> {
    const response = await httpClient.get<ApiResponse<AuthUser>>(`/users/${id}`);
    return response.data;
  }
  
  static async createUser(userData: Omit<AuthUser, 'id'>): Promise<AuthUser> {
    const response = await httpClient.post<ApiResponse<AuthUser>>('/users', userData);
    return response.data;
  }
  
  static async updateUser(id: string, updates: Partial<AuthUser>): Promise<AuthUser> {
    const response = await httpClient.patch<ApiResponse<AuthUser>>(`/users/${id}`, updates);
    return response.data;
  }
  
  static async deleteUser(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  }
}

// Export main HTTP client and auth manager for advanced usage
export { httpClient, AuthManager };

// Export default API object
const api = {
  auth: AuthService,
  sites: SiteService,
  energyData: EnergyDataService,
  alerts: AlertService,
  analytics: AnalyticsService,
  settings: SettingsService,
  users: UserService
};

export default api;