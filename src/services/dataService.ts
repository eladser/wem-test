
import { apiService, ApiError } from './apiService';
import { databaseApiService } from './databaseApiService';
import { Site, Asset, PowerData, EnergyMix, Metric, Region, Alert, AuthResponse, LoginRequest } from '@/types/energy';
import { mockRegions, getMockAssets, getMockPowerData, getMockMetrics, getMockEnergyMix } from './mockDataService';
import { config } from '@/config/environment';
import { logger } from '@/utils/logging';

export class DataService {
  private shouldUseMockData(): boolean {
    // Check environment variable or config to determine data source
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    const isDevelopment = import.meta.env.DEV;
    
    // Use mock data if explicitly enabled or if API is not available
    return useMockData || (isDevelopment && config.api.baseUrl === 'mock://api');
  }

  private async withFallback<T>(
    databaseCall: () => Promise<T>,
    mockDataCall: () => T | Promise<T>,
    entityName: string
  ): Promise<T> {
    if (this.shouldUseMockData()) {
      logger.info(`Using mock data for ${entityName}`);
      return Promise.resolve(mockDataCall());
    }

    try {
      const result = await databaseCall();
      logger.info(`Successfully fetched ${entityName} from database`);
      return result;
    } catch (error) {
      logger.warn(`Failed to fetch ${entityName} from database, falling back to mock data`, {
        error: error instanceof Error ? error.message : String(error)
      });
      return Promise.resolve(mockDataCall());
    }
  }

  // =================== AUTHENTICATION ===================

  async login(email: string, password: string): Promise<AuthResponse> {
    if (this.shouldUseMockData()) {
      // Mock login for development
      const mockAuth: AuthResponse = {
        user: {
          id: 'mock-user-id',
          email,
          firstName: 'Mock',
          lastName: 'User',
          role: 'Admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Store mock auth data
      localStorage.setItem('authToken', mockAuth.token);
      localStorage.setItem('user', JSON.stringify(mockAuth.user));
      
      logger.info('Mock login successful');
      return mockAuth;
    }

    return await databaseApiService.login({ email, password });
  }

  async logout(): Promise<void> {
    if (this.shouldUseMockData()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      logger.info('Mock logout successful');
      return;
    }

    return await databaseApiService.logout();
  }

  // =================== CORE DATA METHODS ===================

  async getRegions(): Promise<Region[]> {
    return this.withFallback(
      () => databaseApiService.getRegions(),
      () => mockRegions,
      'regions'
    );
  }

  async getSites(region?: string): Promise<Site[]> {
    return this.withFallback(
      () => databaseApiService.getAllSites(region),
      () => {
        const sites = mockRegions.flatMap(r => r.sites);
        return region ? sites.filter(s => s.region.toLowerCase() === region.toLowerCase()) : sites;
      },
      `sites${region ? ` for region ${region}` : ''}`
    );
  }

  async getSiteById(siteId: string): Promise<Site | null> {
    return this.withFallback(
      async () => {
        try {
          return await databaseApiService.getSiteById(siteId);
        } catch (error) {
          if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
            return null;
          }
          throw error;
        }
      },
      () => {
        const allSites = mockRegions.flatMap(r => r.sites);
        return allSites.find(s => s.id === siteId) || null;
      },
      `site ${siteId}`
    );
  }

  async getSiteAssets(siteId: string): Promise<Asset[]> {
    return this.withFallback(
      () => databaseApiService.getSiteAssets(siteId),
      () => getMockAssets(siteId),
      `assets for site ${siteId}`
    );
  }

  async getSitePowerData(siteId: string, startDate?: string, endDate?: string): Promise<PowerData[]> {
    return this.withFallback(
      () => databaseApiService.getSitePowerData(siteId, startDate, endDate),
      () => getMockPowerData(siteId),
      `power data for site ${siteId}`
    );
  }

  async getLatestPowerData(siteId: string): Promise<PowerData | null> {
    if (this.shouldUseMockData()) {
      const mockData = getMockPowerData(siteId);
      return mockData.length > 0 ? mockData[mockData.length - 1] : null;
    }

    try {
      return await databaseApiService.getLatestPowerData(siteId);
    } catch (error) {
      logger.warn(`Failed to fetch latest power data for site ${siteId}, returning null`, {
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  async getSiteMetrics(siteId: string): Promise<Metric[]> {
    return this.withFallback(
      async () => {
        // For now, we'll generate metrics from site data since there's no specific metrics endpoint
        const site = await databaseApiService.getSiteById(siteId);
        const powerData = await databaseApiService.getLatestPowerData(siteId);
        
        // Transform site and power data into metrics format
        // This is a placeholder - you might want to create a specific metrics endpoint
        return this.generateMetricsFromSiteData(site, powerData);
      },
      () => getMockMetrics(siteId),
      `metrics for site ${siteId}`
    );
  }

  async getAlerts(siteId?: string): Promise<Alert[]> {
    return this.withFallback(
      () => databaseApiService.getAlerts(siteId, false), // Get unacknowledged alerts
      () => {
        // Mock alerts - you can enhance this
        return [
          {
            id: 'alert-1',
            type: 'Warning',
            message: 'Battery level low',
            site: siteId || 'All Sites',
            timestamp: new Date().toISOString()
          }
        ];
      },
      `alerts${siteId ? ` for site ${siteId}` : ''}`
    );
  }

  async getEnergyMix(): Promise<EnergyMix[]> {
    return this.withFallback(
      async () => {
        // Generate energy mix from all sites' current data
        const sites = await databaseApiService.getAllSites();
        return this.generateEnergyMixFromSites(sites);
      },
      () => getMockEnergyMix(),
      'energy mix'
    );
  }

  // =================== WRITE OPERATIONS ===================

  async createSite(siteData: { name: string; location: string; region: string; totalCapacity: number }): Promise<Site> {
    if (this.shouldUseMockData()) {
      throw new Error('Site creation not supported in mock mode');
    }
    
    return await databaseApiService.createSite(siteData);
  }

  async updateSite(siteId: string, siteData: Partial<Site>): Promise<Site> {
    if (this.shouldUseMockData()) {
      throw new Error('Site updates not supported in mock mode');
    }
    
    return await databaseApiService.updateSite(siteId, siteData);
  }

  async updateSiteStatus(siteId: string, status: 'Online' | 'Maintenance' | 'Offline'): Promise<Site> {
    if (this.shouldUseMockData()) {
      throw new Error('Site status updates not supported in mock mode');
    }
    
    return await databaseApiService.updateSiteStatus(siteId, { status });
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    if (this.shouldUseMockData()) {
      throw new Error('Alert acknowledgment not supported in mock mode');
    }
    
    return await databaseApiService.acknowledgeAlert(alertId);
  }

  // =================== UTILITY METHODS ===================

  private generateMetricsFromSiteData(site: Site, powerData: PowerData | null): Metric[] {
    // This is a placeholder implementation
    // You should customize this based on your specific metrics requirements
    return [
      {
        title: 'Current Output',
        value: `${site.currentOutput.toFixed(1)} MW`,
        change: '+5.2%',
        trend: 'up',
        icon: null,
        color: 'green'
      },
      {
        title: 'Efficiency',
        value: `${site.efficiency.toFixed(1)}%`,
        change: '+2.1%',
        trend: 'up',
        icon: null,
        color: 'blue'
      },
      {
        title: 'Total Capacity',
        value: `${site.totalCapacity.toFixed(1)} MW`,
        change: '0%',
        trend: 'up',
        icon: null,
        color: 'gray'
      }
    ];
  }

  private generateEnergyMixFromSites(sites: Site[]): EnergyMix[] {
    // Placeholder implementation - customize based on your needs
    const totalOutput = sites.reduce((sum, site) => sum + site.currentOutput, 0);
    
    return [
      {
        name: 'Solar',
        value: totalOutput * 0.6,
        color: '#FFD700'
      },
      {
        name: 'Wind',
        value: totalOutput * 0.25,
        color: '#87CEEB'
      },
      {
        name: 'Battery',
        value: totalOutput * 0.15,
        color: '#32CD32'
      }
    ];
  }

  isAuthenticated(): boolean {
    return this.shouldUseMockData() ? 
      !!localStorage.getItem('authToken') : 
      databaseApiService.isAuthenticated();
  }

  getCurrentUser() {
    return this.shouldUseMockData() ? 
      JSON.parse(localStorage.getItem('user') || 'null') : 
      databaseApiService.getCurrentUser();
  }

  clearCache(): void {
    if (this.shouldUseMockData()) {
      logger.info('Mock data service cache cleared (no-op)');
    } else {
      databaseApiService.clearCache();
    }
  }
}

export const dataService = new DataService();
