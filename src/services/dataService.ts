
import { apiService, ApiError } from './apiService';
import { Site, Asset, PowerData, EnergyMix, Metric, Region } from '@/types/energy';
import { mockRegions, getMockAssets, getMockPowerData, getMockMetrics, getMockEnergyMix } from './mockDataService';
import { config } from '@/config/environment';

export class DataService {
  private useMockData: boolean;

  constructor() {
    this.useMockData = config.development.enableDebugLogs || config.api.baseUrl.includes('localhost');
  }

  async getRegions(): Promise<Region[]> {
    if (this.useMockData) {
      return Promise.resolve(mockRegions);
    }

    try {
      const response = await apiService.get<Region[]>('/regions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      throw new ApiError('Failed to load regions', 500);
    }
  }

  async getSiteAssets(siteId: string): Promise<Asset[]> {
    if (this.useMockData) {
      return Promise.resolve(getMockAssets(siteId));
    }

    try {
      const response = await apiService.get<Asset[]>(`/sites/${siteId}/assets`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch assets for site ${siteId}:`, error);
      throw new ApiError('Failed to load site assets', 500);
    }
  }

  async getSitePowerData(siteId: string): Promise<PowerData[]> {
    if (this.useMockData) {
      return Promise.resolve(getMockPowerData(siteId));
    }

    try {
      const response = await apiService.get<PowerData[]>(`/sites/${siteId}/power-data`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch power data for site ${siteId}:`, error);
      throw new ApiError('Failed to load power data', 500);
    }
  }

  async getSiteMetrics(siteId: string): Promise<Metric[]> {
    if (this.useMockData) {
      return Promise.resolve(getMockMetrics(siteId));
    }

    try {
      const response = await apiService.get<Metric[]>(`/sites/${siteId}/metrics`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch metrics for site ${siteId}:`, error);
      throw new ApiError('Failed to load site metrics', 500);
    }
  }

  async getEnergyMix(): Promise<EnergyMix[]> {
    if (this.useMockData) {
      return Promise.resolve(getMockEnergyMix());
    }

    try {
      const response = await apiService.get<EnergyMix[]>('/energy-mix');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch energy mix:', error);
      throw new ApiError('Failed to load energy mix data', 500);
    }
  }
}

export const dataService = new DataService();
