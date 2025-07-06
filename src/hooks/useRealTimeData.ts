import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { mockRegions } from '@/services/mockDataService';
import { siteApiService } from '@/services/siteApiService';

// API base URL - using port 5000 as confirmed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Types that match your existing structure
export interface Site {
  id: string;
  name: string;
  location: string;
  region?: string;
  subRegion?: string;
  status: 'online' | 'maintenance' | 'offline';
  totalCapacity: number;
  currentOutput: number;
  efficiency: number;
  lastUpdate: string;
}

export interface SiteDashboard {
  site: Site;
  currentPower: number;
  alerts: Alert[];
  assets: Asset[];
  recentActivity: ActivityLog[];
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  siteId: string;
  status: 'online' | 'offline' | 'maintenance' | 'charging';
  power: string;
  efficiency: string;
  lastUpdate: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  isRead: boolean;
  siteId?: string;
}

export interface PowerData {
  time: string;
  solar: number;
  battery: number;
  grid: number;
  demand: number;
  siteId?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  siteId: string;
}

// Helper function to extract all sites from regions
const getAllSitesFromRegions = () => {
  return mockRegions.flatMap(region => 
    region.subRegions ? 
      region.subRegions.flatMap(subRegion => subRegion.sites || []) :
      region.sites || []
  );
};

// Sites list hook - using mock data for now
export function useSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      // For now, return mock data since API endpoint isn't implemented
      const sites = getAllSitesFromRegions();
      return sites;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Real-time site dashboard hook
export function useSiteDashboard(siteId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['siteDashboard', siteId],
    queryFn: async () => {
      try {
        // Try to use the real API first
        const response = await siteApiService.getSiteData(siteId, {
          includeAssets: true,
          includePowerData: true,
          includeMetrics: true
        });
        return response;
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', error);
        const sites = getAllSitesFromRegions();
        const site = sites.find(s => s.id === siteId);
        
        if (!site) {
          throw new Error(`Site ${siteId} not found`);
        }

        return {
          site,
          currentPower: site.currentOutput,
          alerts: [],
          assets: [],
          recentActivity: []
        };
      }
    },
    enabled: !!siteId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute as fallback
  });

  // Set up SignalR connection for real-time updates
  useEffect(() => {
    if (!siteId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/dashboard`)
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR Connected for site:', siteId);

        // Join site-specific group
        await connection.invoke('JoinSiteGroup', siteId);

        // Listen for power data updates
        connection.on('PowerDataUpdate', (data: PowerData) => {
          if (data.siteId === siteId) {
            queryClient.setQueryData(['siteDashboard', siteId], (old: SiteDashboard | undefined) => {
              if (!old) return old;
              return {
                ...old,
                currentPower: data.solar + data.battery + data.grid,
                lastUpdated: new Date().toISOString(),
              };
            });
          }
        });

        // Listen for new alerts
        connection.on('NewAlert', (alert: Alert) => {
          if (alert.siteId === siteId) {
            queryClient.setQueryData(['siteDashboard', siteId], (old: SiteDashboard | undefined) => {
              if (!old) return old;
              return {
                ...old,
                alerts: [alert, ...old.alerts.slice(0, 9)], // Keep last 10 alerts
              };
            });
          }
        });

        // Listen for asset status changes
        connection.on('AssetStatusChanged', (assetUpdate: { assetId: string; status: string; siteId: string }) => {
          if (assetUpdate.siteId === siteId) {
            queryClient.setQueryData(['siteDashboard', siteId], (old: SiteDashboard | undefined) => {
              if (!old) return old;
              return {
                ...old,
                assets: old.assets.map((asset) =>
                  asset.id === assetUpdate.assetId
                    ? { ...asset, status: assetUpdate.status as Asset['status'] }
                    : asset
                ),
              };
            });
          }
        });

      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, [siteId, queryClient]);

  return query;
}

// Real-time power data hook
export function usePowerData(siteId: string, period: string = '24h') {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['powerData', siteId, period],
    queryFn: async () => {
      try {
        // Try to use the real API first
        const response = await siteApiService.getSitePowerData(siteId, period);
        return response;
      } catch (error) {
        // Fallback to mock data
        console.warn('Power data API failed, using mock data:', error);
        const mockData = [
          { time: "00:00", solar: 0, battery: 85, grid: 12, demand: 97 },
          { time: "06:00", solar: 45, battery: 80, grid: 8, demand: 133 },
          { time: "12:00", solar: 95, battery: 75, grid: 0, demand: 170 },
          { time: "18:00", solar: 25, battery: 70, grid: 15, demand: 110 },
          { time: "24:00", solar: 0, battery: 65, grid: 20, demand: 85 },
        ];
        return mockData;
      }
    },
    enabled: !!siteId,
    staleTime: 60000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Set up real-time updates for current power
  useEffect(() => {
    if (!siteId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/dashboard`)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        await connection.invoke('JoinSiteGroup', siteId);

        connection.on('PowerDataUpdate', (newDataPoint: PowerData) => {
          if (newDataPoint.siteId === siteId) {
            queryClient.setQueryData(['powerData', siteId, period], (old: PowerData[] | undefined) => {
              if (!old) return [newDataPoint];
              
              // Add new data point and keep last N points based on period
              const maxPoints = period === '24h' ? 288 : period === '7d' ? 168 : 30; // 5min intervals
              return [...old.slice(-(maxPoints - 1)), newDataPoint];
            });
          }
        });

      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, [siteId, period, queryClient]);

  return query;
}

// Real-time alerts hook
export function useAlerts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['alerts', 'active'],
    queryFn: async () => {
      // Return mock alerts for now
      const alerts: Alert[] = [
        {
          id: '1',
          message: 'High power consumption detected at Site A',
          severity: 'High',
          timestamp: new Date().toISOString(),
          isRead: false,
          siteId: 'site-a'
        },
        {
          id: '2', 
          message: 'Battery level low at Site B',
          severity: 'Medium',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          isRead: false,
          siteId: 'site-b'
        }
      ];
      return alerts;
    },
    staleTime: 30000, // 30 seconds
  });

  // Set up real-time alert updates
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/dashboard`)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();

        connection.on('NewAlert', (alert: Alert) => {
          queryClient.setQueryData(['alerts', 'active'], (old: Alert[] | undefined) => {
            if (!old) return [alert];
            return [alert, ...old];
          });

          // Show notification for critical alerts
          if (alert.severity === 'Critical') {
            // You can integrate with your notification system here
            console.warn('Critical Alert:', alert.message);
            
            // Browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification('Critical Alert', {
                body: alert.message,
                icon: '/favicon.ico'
              });
            }
          }
        });

        connection.on('AlertResolved', (alertId: string) => {
          queryClient.setQueryData(['alerts', 'active'], (old: Alert[] | undefined) => {
            if (!old) return old;
            return old.filter((alert) => alert.id !== alertId);
          });
        });

      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, [queryClient]);

  return query;
}

// Assets by site hook
export function useAssets(siteId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['assets', siteId],
    queryFn: async () => {
      try {
        // Try to use the real API first
        const response = await siteApiService.getSiteAssets(siteId);
        return response;
      } catch (error) {
        // Fallback to mock data
        console.warn('Assets API failed, using mock data:', error);
        const mockAssets: Asset[] = [
          {
            id: `INV-${siteId}`,
            name: 'Solar Inverter #1',
            type: 'inverter',
            siteId,
            status: 'online',
            power: '8.5 kW',
            efficiency: '94.2%',
            lastUpdate: '2 min ago'
          }
        ];
        return mockAssets;
      }
    },
    enabled: !!siteId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Set up real-time asset updates
  useEffect(() => {
    if (!siteId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/dashboard`)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        await connection.invoke('JoinSiteGroup', siteId);

        connection.on('AssetStatusChanged', (assetUpdate: { assetId: string; status: string; siteId: string }) => {
          if (assetUpdate.siteId === siteId) {
            queryClient.setQueryData(['assets', siteId], (old: Asset[] | undefined) => {
              if (!old) return old;
              return old.map((asset) =>
                asset.id === assetUpdate.assetId
                  ? { ...asset, status: assetUpdate.status as Asset['status'] }
                  : asset
              );
            });
          }
        });

      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, [siteId, queryClient]);

  return query;
}

// Connection status hook
export function useSignalRConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/dashboard`)
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        setConnectionStatus('connecting');
        await newConnection.start();
        setConnectionStatus('connected');
        console.log('SignalR Global Connection established');
      } catch (error) {
        setConnectionStatus('disconnected');
        console.error('SignalR Connection Error:', error);
      }
    };

    newConnection.onreconnecting(() => {
      setConnectionStatus('connecting');
      console.log('SignalR Reconnecting...');
    });
    
    newConnection.onreconnected(() => {
      setConnectionStatus('connected');
      console.log('SignalR Reconnected');
    });
    
    newConnection.onclose(() => {
      setConnectionStatus('disconnected');
      console.log('SignalR Disconnected');
    });

    setConnection(newConnection);
    startConnection();

    return () => {
      newConnection.stop();
    };
  }, []);

  return { connectionStatus, connection };
}

// Notification permission hook
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  return { permission, requestPermission };
}
