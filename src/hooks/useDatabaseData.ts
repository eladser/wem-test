import { useState, useEffect, useCallback } from 'react';
import { dataService } from '@/services/dataService';
import { databaseApiService } from '@/services/databaseApiService';
import { 
  Site, 
  Asset, 
  PowerData, 
  Alert, 
  Region, 
  User, 
  AuthResponse,
  EnergyMix,
  Metric 
} from '@/types/energy';
import { logger } from '@/utils/logger';

// Generic hook for data fetching with loading and error states
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = [],
  initialData?: T
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error('Data fetch failed', error);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// =================== AUTHENTICATION HOOKS ===================

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const currentUser = dataService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const authResponse = await dataService.login(email, password);
      setUser(authResponse.user);
      logger.info('User authenticated successfully');
      return authResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await dataService.logout();
      setUser(null);
      logger.info('User logged out successfully');
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = dataService.isAuthenticated();

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };
}

// =================== SITES HOOKS ===================

export function useSites(region?: string) {
  return useAsyncData(
    () => dataService.getSites(region),
    [region],
    []
  );
}

export function useSite(siteId: string | null) {
  return useAsyncData(
    () => siteId ? dataService.getSiteById(siteId) : Promise.resolve(null),
    [siteId]
  );
}

export function useRegions() {
  return useAsyncData(
    () => dataService.getRegions(),
    [],
    []
  );
}

export function useSiteOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSite = useCallback(async (siteData: {
    name: string;
    location: string;
    region: string;
    totalCapacity: number;
  }): Promise<Site> => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.createSite(siteData);
      logger.info('Site created successfully', { siteId: result.id });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error('Failed to create site', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSite = useCallback(async (siteId: string, siteData: Partial<Site>): Promise<Site> => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.updateSite(siteId, siteData);
      logger.info('Site updated successfully', { siteId });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error('Failed to update site', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSiteStatus = useCallback(async (
    siteId: string, 
    status: 'Online' | 'Maintenance' | 'Offline'
  ): Promise<Site> => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.updateSiteStatus(siteId, status);
      logger.info('Site status updated successfully', { siteId, status });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error('Failed to update site status', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createSite,
    updateSite,
    updateSiteStatus,
    loading,
    error
  };
}

// =================== ASSETS HOOKS ===================

export function useSiteAssets(siteId: string | null) {
  return useAsyncData(
    () => siteId ? dataService.getSiteAssets(siteId) : Promise.resolve([]),
    [siteId],
    []
  );
}

// =================== POWER DATA HOOKS ===================

export function useSitePowerData(siteId: string | null, startDate?: string, endDate?: string) {
  return useAsyncData(
    () => siteId ? dataService.getSitePowerData(siteId, startDate, endDate) : Promise.resolve([]),
    [siteId, startDate, endDate],
    []
  );
}

export function useLatestPowerData(siteId: string | null) {
  return useAsyncData(
    () => siteId ? dataService.getLatestPowerData(siteId) : Promise.resolve(null),
    [siteId]
  );
}

// =================== ALERTS HOOKS ===================

export function useAlerts(siteId?: string) {
  return useAsyncData(
    () => dataService.getAlerts(siteId),
    [siteId],
    []
  );
}

export function useAlertOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const acknowledgeAlert = useCallback(async (alertId: string): Promise<Alert> => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.acknowledgeAlert(alertId);
      logger.info('Alert acknowledged successfully', { alertId });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error('Failed to acknowledge alert', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    acknowledgeAlert,
    loading,
    error
  };
}

// =================== DASHBOARD DATA HOOKS ===================

export function useDashboardData(siteId?: string) {
  const regions = useRegions();
  const sites = useSites();
  const alerts = useAlerts(siteId);
  const energyMix = useAsyncData(() => dataService.getEnergyMix(), [], []);
  
  // Get metrics for a specific site or aggregate for all sites
  const metrics = useAsyncData(
    () => siteId ? dataService.getSiteMetrics(siteId) : Promise.resolve([]),
    [siteId],
    []
  );

  const loading = regions.loading || sites.loading || alerts.loading || energyMix.loading || metrics.loading;
  const error = regions.error || sites.error || alerts.error || energyMix.error || metrics.error;

  const refetch = useCallback(() => {
    regions.refetch();
    sites.refetch();
    alerts.refetch();
    energyMix.refetch();
    metrics.refetch();
  }, [regions.refetch, sites.refetch, alerts.refetch, energyMix.refetch, metrics.refetch]);

  return {
    regions: regions.data || [],
    sites: sites.data || [],
    alerts: alerts.data || [],
    energyMix: energyMix.data || [],
    metrics: metrics.data || [],
    loading,
    error,
    refetch
  };
}

// =================== REAL-TIME DATA HOOK ===================

export function useRealTimeData(siteId: string | null, intervalMs: number = 30000) {
  const [powerData, setPowerData] = useState<PowerData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!siteId) return;

    const fetchLatestData = async () => {
      try {
        const data = await dataService.getLatestPowerData(siteId);
        setPowerData(data);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        logger.error('Failed to fetch real-time data', error);
      }
    };

    // Fetch immediately
    fetchLatestData();

    // Set up interval
    const interval = setInterval(fetchLatestData, intervalMs);

    return () => clearInterval(interval);
  }, [siteId, intervalMs]);

  return { powerData, lastUpdate, error };
}

// =================== UTILITY HOOKS ===================

export function useDataService() {
  return {
    dataService,
    databaseApiService,
    clearCache: dataService.clearCache.bind(dataService)
  };
}
