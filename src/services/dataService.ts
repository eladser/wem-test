
import { apiService, ApiError } from './apiService';
import { Site, Asset, PowerData, EnergyMix, Metric, Region } from '@/types/energy';
import { mockRegions, getMockAssets, getMockPowerData, getMockMetrics, getMockEnergyMix } from './mockDataService';
import { config } from '@/config/environment';
import { logger } from '@/utils/logging';

export class DataService {
  private shouldUseMockData(): boolean {
    return config.development.enableDebugLogs || 
           config.api.baseUrl.includes('localhost') ||
           config.api.baseUrl === 'mock://api';
  }

  async getRegions(): Promise<Region[]> {
    try {
      if (this.shouldUseMockData()) {
        logger.info('Using mock data for regions');
        return Promise.resolve(mockRegions);
      }

      const response = await apiService.get<Region[]>('/regions');
      logger.info('Successfully fetched regions', { 
        count: response.data.length,
        fromCache: response.fromCache 
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch regions, falling back to mock data', {
        error: error instanceof Error ? error.message : String(error)
      });
      return mockRegions;
    }
  }

  async getSiteAssets(siteId: string): Promise<Asset[]> {
    try {
      if (this.shouldUseMockData()) {
        logger.info('Using mock data for site assets', { siteId });
        return Promise.resolve(getMockAssets(siteId));
      }

      const response = await apiService.get<Asset[]>(`/sites/${siteId}/assets`);
      logger.info('Successfully fetched site assets', { 
        siteId, 
        count: response.data.length,
        fromCache: response.fromCache 
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch site assets, falling back to mock data', {
        siteId,
        error: error instanceof Error ? error.message : String(error)
      });
      return getMockAssets(siteId);
    }
  }

  async getSitePowerData(siteId: string): Promise<PowerData[]> {
    try {
      if (this.shouldUseMockData()) {
        logger.info('Using mock data for power data', { siteId });
        return Promise.resolve(getMockPowerData(siteId));
      }

      const response = await apiService.get<PowerData[]>(`/sites/${siteId}/power-data`);
      logger.info('Successfully fetched power data', { 
        siteId, 
        count: response.data.length,
        fromCache: response.fromCache 
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch power data, falling back to mock data', {
        siteId,
        error: error instanceof Error ? error.message : String(error)
      });
      return getMockPowerData(siteId);
    }
  }

  async getSiteMetrics(siteId: string): Promise<Metric[]> {
    try {
      if (this.shouldUseMockData()) {
        logger.info('Using mock data for metrics', { siteId });
        return Promise.resolve(getMockMetrics(siteId));
      }

      const response = await apiService.get<Metric[]>(`/sites/${siteId}/metrics`);
      logger.info('Successfully fetched metrics', { 
        siteId, 
        count: response.data.length,
        fromCache: response.fromCache 
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch metrics, falling back to mock data', {
        siteId,
        error: error instanceof Error ? error.message : String(error)
      });
      return getMockMetrics(siteId);
    }
  }

  async getEnergyMix(): Promise<EnergyMix[]> {
    try {
      if (this.shouldUseMockData()) {
        logger.info('Using mock data for energy mix');
        return Promise.resolve(getMockEnergyMix());
      }

      const response = await apiService.get<EnergyMix[]>('/energy-mix');
      logger.info('Successfully fetched energy mix', { 
        count: response.data.length,
        fromCache: response.fromCache 
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch energy mix, falling back to mock data', {
        error: error instanceof Error ? error.message : String(error)
      });
      return getMockEnergyMix();
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const response = await apiService.post<{ token: string; user: any }>('/auth/login', {
        email,
        password
      });
      
      // Set the auth token for future requests
      apiService.setAuthToken(response.data.token);
      
      return response.data;
    } catch (error) {
      logger.error('Login failed', error as Error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout', {});
    } catch (error) {
      logger.warn('Logout request failed', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      // Always clear the token, even if the request failed
      apiService.clearAuthToken();
    }
  }

  // Cache management
  clearCache(): void {
    apiService.clearCache();
    logger.info('Data service cache cleared');
  }
}

export const dataService = new DataService();
