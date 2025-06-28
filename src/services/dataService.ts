
import { apiService, ApiError } from './apiService';
import { Site, Asset, PowerData, EnergyMix, Metric, Region } from '@/types/energy';
import { mockRegions, getMockAssets, getMockPowerData, getMockMetrics, getMockEnergyMix } from './mockDataService';
import { config } from '@/config/environment';
import { logger } from '@/utils/logging';
import { apiClient } from './api';

export class DataService {
  private shouldUseMockData(): boolean {
    // Check if mock data is explicitly enabled
    return import.meta.env.VITE_USE_MOCK_DATA === 'true';
  }

  async getRegions(): Promise<Region[]> {
    try {
      if (this.shouldUseMockData()) {
        logger.info('Using mock data for regions');
        return Promise.resolve(mockRegions);
      }

      // Try to fetch from your existing API
      const response = await apiClient.get('/api/sites'); // Adjust endpoint as needed
      logger.info('Successfully fetched sites from API', { 
        count: response.data.length
      });
      
      // Transform your API response to regions format
      // This depends on what your API returns
      const sites = response.data;
      const regionMap = new Map();
      
      sites.forEach(site => {
        const region = site.region || 'default';
        if (!regionMap.has(region)) {
          regionMap.set(region, { id: region, name: region, sites: [] });
        }
        regionMap.get(region).sites.push(site);
      });
      
      return Array.from(regionMap.values());
    } catch (error) {
      logger.warn('Failed to fetch from API, falling back to mock data', {
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

      // Fetch from your API - adjust endpoint as needed
      const response = await apiClient.get(`/api/sites/${siteId}/assets`);
      logger.info('Successfully fetched site assets from API', { 
        siteId, 
        count: response.data.length
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch site assets from API, falling back to mock data', {
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

      // Fetch from your API - adjust endpoint as needed
      const response = await apiClient.get(`/api/sites/${siteId}/power-data`);
      logger.info('Successfully fetched power data from API', { 
        siteId, 
        count: response.data.length
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch power data from API, falling back to mock data', {
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

      // Fetch from your API - adjust endpoint as needed
      const response = await apiClient.get(`/api/sites/${siteId}/metrics`);
      logger.info('Successfully fetched metrics from API', { 
        siteId, 
        count: response.data.length
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch metrics from API, falling back to mock data', {
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

      // Fetch from your API - adjust endpoint as needed
      const response = await apiClient.get('/api/energy-mix');
      logger.info('Successfully fetched energy mix from API', { 
        count: response.data.length
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch energy mix from API, falling back to mock data', {
        error: error instanceof Error ? error.message : String(error)
      });
      return getMockEnergyMix();
    }
  }

  // Authentication methods - adjust based on your API
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password
      });
      
      // Set the auth token for future requests
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      logger.error('Login failed', error as Error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch (error) {
      logger.warn('Logout request failed', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      // Always clear the token, even if the request failed
      localStorage.removeItem('authToken');
    }
  }

  // Cache management
  clearCache(): void {
    logger.info('Data service cache cleared');
  }
}

export const dataService = new DataService();
