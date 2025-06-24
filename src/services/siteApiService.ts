
import { apiGateway } from './apiGateway';
import { logger } from '@/utils/logging';
import { Site, Asset, PowerData, Metric } from '@/types/energy';

export interface SiteApiOptions {
  includeAssets?: boolean;
  includePowerData?: boolean;
  includeMetrics?: boolean;
  timeRange?: 'hour' | 'day' | 'week' | 'month';
  format?: 'json' | 'csv' | 'xml';
}

export interface SiteDataResponse {
  site: Site;
  assets?: Asset[];
  powerData?: PowerData[];
  metrics?: Metric[];
  metadata: {
    timestamp: string;
    requestId: string;
    totalRecords: number;
    format: string;
  };
}

export class SiteApiService {
  private static instance: SiteApiService;

  static getInstance(): SiteApiService {
    if (!SiteApiService.instance) {
      SiteApiService.instance = new SiteApiService();
    }
    return SiteApiService.instance;
  }

  async getSiteData(siteId: string, options: SiteApiOptions = {}): Promise<SiteDataResponse> {
    try {
      logger.info('Fetching site data', { siteId, options });

      const response = await apiGateway.request<SiteDataResponse>({
        endpoint: `/api/sites/${siteId}`,
        method: 'GET',
        requiresAuth: true,
        headers: {
          'Accept': options.format === 'csv' ? 'text/csv' : 
                   options.format === 'xml' ? 'application/xml' : 'application/json',
          'X-Include-Assets': options.includeAssets ? 'true' : 'false',
          'X-Include-Power-Data': options.includePowerData ? 'true' : 'false',
          'X-Include-Metrics': options.includeMetrics ? 'true' : 'false',
          'X-Time-Range': options.timeRange || 'day'
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch site data', error as Error, { siteId, options });
      throw error;
    }
  }

  async getSiteAssets(siteId: string, assetType?: string): Promise<Asset[]> {
    try {
      const endpoint = assetType 
        ? `/api/sites/${siteId}/assets?type=${assetType}`
        : `/api/sites/${siteId}/assets`;

      const response = await apiGateway.request<Asset[]>({
        endpoint,
        method: 'GET',
        requiresAuth: true
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch site assets', error as Error, { siteId, assetType });
      throw error;
    }
  }

  async getSitePowerData(siteId: string, timeRange: string = 'day'): Promise<PowerData[]> {
    try {
      const response = await apiGateway.request<PowerData[]>({
        endpoint: `/api/sites/${siteId}/power-data?range=${timeRange}`,
        method: 'GET',
        requiresAuth: true
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch site power data', error as Error, { siteId, timeRange });
      throw error;
    }
  }

  async updateSiteStatus(siteId: string, status: 'online' | 'maintenance' | 'offline'): Promise<Site> {
    try {
      const response = await apiGateway.request<Site>({
        endpoint: `/api/sites/${siteId}/status`,
        method: 'PATCH',
        data: { status },
        requiresAuth: true
      });

      logger.info('Site status updated', { siteId, status });
      return response.data;
    } catch (error) {
      logger.error('Failed to update site status', error as Error, { siteId, status });
      throw error;
    }
  }

  async createSite(siteData: Omit<Site, 'id'>): Promise<Site> {
    try {
      const response = await apiGateway.request<Site>({
        endpoint: '/api/sites',
        method: 'POST',
        data: siteData,
        requiresAuth: true
      });

      logger.info('Site created', { siteId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to create site', error as Error, { siteData });
      throw error;
    }
  }

  async deleteSite(siteId: string): Promise<void> {
    try {
      await apiGateway.request<void>({
        endpoint: `/api/sites/${siteId}`,
        method: 'DELETE',
        requiresAuth: true
      });

      logger.info('Site deleted', { siteId });
    } catch (error) {
      logger.error('Failed to delete site', error as Error, { siteId });
      throw error;
    }
  }

  async getSiteAnalytics(siteId: string, metrics: string[] = []): Promise<any> {
    try {
      const queryParams = metrics.length > 0 ? `?metrics=${metrics.join(',')}` : '';
      
      const response = await apiGateway.request<any>({
        endpoint: `/api/sites/${siteId}/analytics${queryParams}`,
        method: 'GET',
        requiresAuth: true
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch site analytics', error as Error, { siteId, metrics });
      throw error;
    }
  }

  async exportSiteData(siteId: string, format: 'json' | 'csv' | 'pdf' = 'json'): Promise<Blob> {
    try {
      const response = await apiGateway.request<Blob>({
        endpoint: `/api/sites/${siteId}/export?format=${format}`,
        method: 'GET',
        requiresAuth: true,
        headers: {
          'Accept': format === 'csv' ? 'text/csv' : 
                   format === 'pdf' ? 'application/pdf' : 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to export site data', error as Error, { siteId, format });
      throw error;
    }
  }
}

export const siteApiService = SiteApiService.getInstance();
