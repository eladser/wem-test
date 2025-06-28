import { apiClient } from './api';
import { 
  Site, 
  Asset, 
  PowerData, 
  Alert, 
  Region, 
  ApiResponse, 
  PagedResponse,
  User,
  AuthResponse,
  LoginRequest,
  CreateSiteDto,
  UpdateSiteDto,
  UpdateSiteStatusDto
} from '@/types/energy';
import { logger } from '@/utils/logger';

export class DatabaseApiService {
  
  // =================== AUTHENTICATION ===================
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      
      // Store the auth token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      logger.info('User logged in successfully', { userId: response.data.user.id });
      return response.data;
    } catch (error) {
      logger.error('Login failed', error as Error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      logger.warn('Logout request failed', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      logger.info('User logged out');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken });
      
      // Update stored tokens
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      logger.error('Token refresh failed', error as Error);
      // Clear invalid tokens
      this.logout();
      throw error;
    }
  }

  // =================== SITES ===================
  
  async getAllSites(region?: string): Promise<Site[]> {
    try {
      const params = region ? { region } : {};
      const response = await apiClient.get<Site[]>('/api/sites', { params });
      
      logger.info('Successfully fetched sites', { count: response.data.length, region });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch sites', error as Error);
      throw error;
    }
  }

  async getSiteById(siteId: string): Promise<Site> {
    try {
      const response = await apiClient.get<Site>(`/api/sites/${siteId}`);
      logger.info('Successfully fetched site details', { siteId });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch site details', { siteId, error });
      throw error;
    }
  }

  async createSite(siteData: CreateSiteDto): Promise<Site> {
    try {
      const response = await apiClient.post<Site>('/api/sites', siteData);
      logger.info('Successfully created site', { siteId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to create site', error as Error);
      throw error;
    }
  }

  async updateSite(siteId: string, siteData: UpdateSiteDto): Promise<Site> {
    try {
      const response = await apiClient.put<Site>(`/api/sites/${siteId}`, siteData);
      logger.info('Successfully updated site', { siteId });
      return response.data;
    } catch (error) {
      logger.error('Failed to update site', { siteId, error });
      throw error;
    }
  }

  async updateSiteStatus(siteId: string, statusData: UpdateSiteStatusDto): Promise<Site> {
    try {
      const response = await apiClient.patch<Site>(`/api/sites/${siteId}/status`, statusData);
      logger.info('Successfully updated site status', { siteId, status: statusData.status });
      return response.data;
    } catch (error) {
      logger.error('Failed to update site status', { siteId, error });
      throw error;
    }
  }

  async deleteSite(siteId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/sites/${siteId}`);
      logger.info('Successfully deleted site', { siteId });
    } catch (error) {
      logger.error('Failed to delete site', { siteId, error });
      throw error;
    }
  }

  // =================== ASSETS ===================
  
  async getSiteAssets(siteId: string): Promise<Asset[]> {
    try {
      const response = await apiClient.get<Asset[]>(`/api/assets/site/${siteId}`);
      logger.info('Successfully fetched site assets', { siteId, count: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch site assets', { siteId, error });
      throw error;
    }
  }

  async getAssetById(assetId: string): Promise<Asset> {
    try {
      const response = await apiClient.get<Asset>(`/api/assets/${assetId}`);
      logger.info('Successfully fetched asset details', { assetId });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch asset details', { assetId, error });
      throw error;
    }
  }

  // =================== POWER DATA ===================
  
  async getSitePowerData(siteId: string, startDate?: string, endDate?: string): Promise<PowerData[]> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await apiClient.get<PowerData[]>(`/api/power-data/site/${siteId}`, { params });
      logger.info('Successfully fetched power data', { siteId, count: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch power data', { siteId, error });
      throw error;
    }
  }

  async getLatestPowerData(siteId: string): Promise<PowerData | null> {
    try {
      const response = await apiClient.get<PowerData>(`/api/power-data/site/${siteId}/latest`);
      logger.info('Successfully fetched latest power data', { siteId });
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        logger.info('No power data found for site', { siteId });
        return null;
      }
      logger.error('Failed to fetch latest power data', { siteId, error });
      throw error;
    }
  }

  // =================== ALERTS ===================
  
  async getAlerts(siteId?: string, acknowledged?: boolean): Promise<Alert[]> {
    try {
      const params: any = {};
      if (siteId) params.siteId = siteId;
      if (acknowledged !== undefined) params.acknowledged = acknowledged;
      
      const response = await apiClient.get<Alert[]>('/api/alerts', { params });
      logger.info('Successfully fetched alerts', { count: response.data.length, siteId });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch alerts', error as Error);
      throw error;
    }
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    try {
      const response = await apiClient.patch<Alert>(`/api/alerts/${alertId}/acknowledge`);
      logger.info('Successfully acknowledged alert', { alertId });
      return response.data;
    } catch (error) {
      logger.error('Failed to acknowledge alert', { alertId, error });
      throw error;
    }
  }

  // =================== UTILITY METHODS ===================

  /**
   * Transform sites data into regions structure for backward compatibility
   */
  async getRegions(): Promise<Region[]> {
    try {
      const sites = await this.getAllSites();
      
      // Group sites by region
      const regionMap = new Map<string, Site[]>();
      sites.forEach(site => {
        const region = site.region || 'Unknown';
        if (!regionMap.has(region)) {
          regionMap.set(region, []);
        }
        regionMap.get(region)!.push(site);
      });

      // Convert to Region objects
      const regions: Region[] = Array.from(regionMap.entries()).map(([regionName, regionSites]) => ({
        id: regionName.toLowerCase().replace(/\s+/g, '-'),
        name: regionName,
        sites: regionSites
      }));

      logger.info('Successfully created regions from sites', { regionsCount: regions.length });
      return regions;
    } catch (error) {
      logger.error('Failed to create regions from sites', error as Error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      logger.error('Failed to parse user from localStorage', error as Error);
      return null;
    }
  }

  /**
   * Clear all cached data and force fresh API calls
   */
  clearCache(): void {
    // Since we're using direct API calls, we don't have a cache to clear
    // But we could implement caching later if needed
    logger.info('Database API service cache cleared (no-op for now)');
  }
}

export const databaseApiService = new DatabaseApiService();
