
import { apiService, ApiError } from './apiService';
import { Site, Asset, PowerData, EnergyMix, Metric, Region } from '@/types/energy';
import { mockRegions, getMockAssets, getMockPowerData, getMockMetrics, getMockEnergyMix } from './mockDataService';
import { config } from '@/config/environment';
import { logger } from '@/utils/logging';

export class DataService {
  private shouldUseMockData(): boolean {
    // Use mock data in development or when API is unavailable
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
      logger.info('Successfully fetched regions from API', { count: response.data.length });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch regions from API, falling back to mock data', {
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
      logger.info('Successfully fetched site assets from API', { siteId, count: response.data.length });
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

      const response = await apiService.get<PowerData[]>(`/sites/${siteId}/power-data`);
      logger.info('Successfully fetched power data from API', { siteId, count: response.data.length });
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

      const response = await apiService.get<Metric[]>(`/sites/${siteId}/metrics`);
      logger.info('Successfully fetched metrics from API', { siteId, count: response.data.length });
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

      const response = await apiService.get<EnergyMix[]>('/energy-mix');
      logger.info('Successfully fetched energy mix from API', { count: response.data.length });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch energy mix from API, falling back to mock data', {
        error: error instanceof Error ? error.message : String(error)
      });
      return getMockEnergyMix();
    }
  }
}

export const dataService = new DataService();
