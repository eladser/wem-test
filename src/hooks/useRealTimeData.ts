import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

// API base URL - using port 5000 as you confirmed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Types
export interface Site {
  id: string;
  name: string;
  location: string;
  totalCapacity: number;
  currentUsage: number;
  status: 'Active' | 'Inactive' | 'Maintenance';
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
  status: 'Online' | 'Offline' | 'Maintenance' | 'Error';
  efficiency: number;
  lastMaintenance: string;
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
  timestamp: string;
  power: number;
  voltage: number;
  current: number;
  siteId: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  siteId: string;
}

// Real-time site dashboard hook
export function useSiteDashboard(siteId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['siteDashboard', siteId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch site dashboard');
      return response.json() as SiteDashboard;
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
                currentPower: data.power,
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
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/power/history?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch power data');
      return response.json() as PowerData[];
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
      const response = await fetch(`${API_BASE_URL}/api/alerts/active`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json() as Alert[];
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

// Sites list hook
export function useSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/sites`);
      if (!response.ok) throw new Error('Failed to fetch sites');
      return response.json() as Site[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Assets by site hook
export function useAssets(siteId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['assets', siteId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/assets`);
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json() as Asset[];
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
