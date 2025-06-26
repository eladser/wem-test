import React, { useMemo, Suspense, lazy, useState, useEffect, useRef } from "react";
import { mockRegions } from "@/services/mockDataService";
import { MetricsCards } from "@/components/overview/MetricsCards";
import { RegionsGrid } from "@/components/overview/RegionsGrid";
import { usePerformance } from "@/hooks/useAdvancedPerformance";
import { useRealTimeData, ConnectionStatus } from "@/hooks/useWebSocket";
import { useNotify } from "@/components/notifications/NotificationSystem";
import { useTheme } from "@/components/theme/ThemeProvider";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { ExportDialog, QuickExportButton } from "@/components/common/ExportManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Settings, Activity, Globe, Zap } from "lucide-react";

// Lazy load heavy components for better performance
const QuickActions = lazy(() => import("@/components/widgets/QuickActions").then(module => ({ default: module.QuickActions })));
const SystemStatusMonitor = lazy(() => import("@/components/monitoring/SystemStatusMonitor").then(module => ({ default: module.SystemStatusMonitor })));
const SystemMonitor = lazy(() => import("@/components/monitoring/SystemMonitor").then(module => ({ default: module.SystemMonitor })));
const EnergyAnalytics = lazy(() => import("@/components/widgets/EnergyAnalytics").then(module => ({ default: module.EnergyAnalytics })));
const RealTimeMonitor = lazy(() => import("@/components/common/RealTimeMonitor").then(module => ({ default: module.RealTimeMonitor })));

// Enhanced loading spinner with theme awareness
const LoadingSpinner = () => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="animate-pulse">
      <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl rounded-xl h-48 flex items-center justify-center">
        <div className="text-slate-400 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Loading component...</span>
        </div>
      </div>
    </div>
  );
};

// Real-time energy data interface
interface EnergyData {
  totalSites: number;
  onlineSites: number;
  totalCapacity: number;
  currentOutput: number;
  efficiency: number;
  alerts: number;
  lastUpdated: string;
}

const Overview = () => {
  const { logRenderTime, renderCount } = usePerformance('Overview');
  const { resolvedTheme } = useTheme();
  const notify = useNotify();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const alertNotificationShown = useRef(false); // Prevent alert spam
  
  console.log(`Overview component rendering (render #${renderCount})`);
  
  // Environment variables using Vite's import.meta.env
  const isDevelopment = import.meta.env.DEV;
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws/energy-data';
  
  console.log(`WebSocket URL: ${wsUrl}`);
  
  // Real-time WebSocket connection for live data with suppressed notifications
  const {
    data: realTimeData,
    connectionState,
    requestData,
    lastUpdated
  } = useRealTimeData<EnergyData>(
    {
      url: wsUrl,
      enableLogging: isDevelopment,
      reconnectAttempts: 3,
      reconnectInterval: 5000,
      heartbeatInterval: 30000,
      suppressNotifications: true, // Suppress automatic notifications - we'll handle them manually
      onError: (error) => {
        console.warn('WebSocket connection error:', error);
      },
      onClose: (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
      }
    },
    'energy-overview',
    // Fallback to mock data
    {
      totalSites: mockRegions.reduce((acc, region) => acc + region.sites.length, 0),
      onlineSites: mockRegions.reduce((acc, region) => 
        acc + region.sites.filter(site => site.status === 'online').length, 0),
      totalCapacity: mockRegions.reduce((acc, region) => 
        acc + region.sites.reduce((siteAcc, site) => siteAcc + site.totalCapacity, 0), 0),
      totalOutput: mockRegions.reduce((acc, region) => 
        acc + region.sites.reduce((siteAcc, site) => siteAcc + site.currentOutput, 0), 0),
      efficiency: 92.3,
      alerts: 2, // Fixed: reasonable default alert count
      lastUpdated: new Date().toISOString()
    }
  );

  // Calculate overview stats with real-time data or fallback to mock
  const overviewStats = useMemo(() => {
    if (realTimeData) {
      return realTimeData;
    }
    
    // Fallback calculation from mock data
    const totalSites = mockRegions.reduce((acc, region) => acc + region.sites.length, 0);
    const onlineSites = mockRegions.reduce((acc, region) => 
      acc + region.sites.filter(site => site.status === 'online').length, 0);
    const totalCapacity = mockRegions.reduce((acc, region) => 
      acc + region.sites.reduce((siteAcc, site) => siteAcc + site.totalCapacity, 0), 0);
    const totalOutput = mockRegions.reduce((acc, region) => 
      acc + region.sites.reduce((siteAcc, site) => siteAcc + site.currentOutput, 0), 0);
    
    return { 
      totalSites, 
      onlineSites, 
      totalCapacity, 
      totalOutput,
      efficiency: (totalOutput / totalCapacity) * 100,
      alerts: 2, // Fixed: reasonable alert count instead of random
      lastUpdated: new Date().toISOString()
    };
  }, [realTimeData]);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await requestData();
      notify.success('Data Refreshed', 'Dashboard data has been updated', { duration: 3000 });
    } catch (error) {
      notify.error('Refresh Failed', 'Unable to fetch latest data', { duration: 5000 });
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // FIXED: Only show critical alert notification once and only for truly high counts
  useEffect(() => {
    if (overviewStats.alerts > 10 && !alertNotificationShown.current) {
      alertNotificationShown.current = true;
      notify.warning(
        'Critical Alerts', 
        `${overviewStats.alerts} active alerts require immediate attention`,
        { 
          priority: 2,
          duration: 8000,
          action: {
            label: 'View Details',
            onClick: () => console.log('Navigate to alerts')
          }
        }
      );
      
      // Reset after 5 minutes to allow another notification if needed
      setTimeout(() => {
        alertNotificationShown.current = false;
      }, 5 * 60 * 1000);
    }
  }, [overviewStats.alerts, notify]);

  // Auto-refresh every 5 minutes when connected
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionState === 'connected') {
        requestData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [connectionState, requestData]);

  // Log render performance
  useEffect(() => {
    logRenderTime();
  });

  // Get connection status styling
  const getConnectionBadge = () => {
    switch (connectionState) {
      case 'connected':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Live Data</Badge>;
      case 'connecting':
      case 'reconnecting':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Connecting...</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Offline Mode</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* FIXED: Better header layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg border border-emerald-500/30">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                WEM Dashboard
              </h1>
              <p className="text-lg text-slate-400">
                Energy Infrastructure Management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <ConnectionStatus connectionState={connectionState} />
            </div>
            {getConnectionBadge()}
            {lastUpdated > 0 && (
              <Badge variant="outline" className="text-slate-400 border-slate-600">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </Badge>
            )}
          </div>
          
          {connectionState === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <Globe className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400 font-medium">
                Using offline data - Real-time features unavailable
              </span>
            </div>
          )}
        </div>
        
        {/* FIXED: Better action buttons layout */}
        <div className="flex items-center gap-2 flex-wrap">
          <QuickExportButton
            dataType="energy-data"
            format="csv"
            filename="dashboard-data"
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white border-0 shadow-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </QuickExportButton>
          
          <Button
            onClick={() => setExportDialogOpen(true)}
            variant="outline"
            className="border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Options
          </Button>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-emerald-600 hover:border-emerald-500 text-emerald-300 hover:bg-emerald-900/30 hover:text-emerald-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${
              isRefreshing ? 'animate-spin' : ''
            }`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics with real-time data */}
      <div>
        <MetricsCards 
          {...overviewStats} 
          isRealTime={connectionState === 'connected'}
          lastUpdated={overviewStats.lastUpdated}
        />
      </div>

      {/* Analytics Section with error boundary */}
      <div>
        <Suspense fallback={<LoadingSpinner />}>
          <EnergyAnalytics realTimeData={realTimeData} />
        </Suspense>
      </div>

      {/* Enhanced Monitoring Grid with better spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <QuickActions connectionState={connectionState} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <SystemStatusMonitor realTimeData={overviewStats} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <SystemMonitor connectionState={connectionState} />
          </Suspense>
        </div>
      </div>

      {/* Enhanced Real-Time Monitoring */}
      <div>
        <Suspense fallback={<LoadingSpinner />}>
          <RealTimeMonitor 
            data={realTimeData} 
            connectionState={connectionState}
            onRefresh={handleRefresh}
          />
        </Suspense>
      </div>

      {/* Enhanced Regions Grid */}
      <div>
        <RegionsGrid 
          regions={mockRegions} 
          realTimeUpdates={connectionState === 'connected'}
        />
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        defaultDataType="energy-data"
      />

      {/* Performance monitoring in development (cleaned up) */}
      {isDevelopment && (
        <div className="fixed bottom-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs font-mono backdrop-blur-sm border border-slate-700">
          <div className="space-y-1">
            <div>Renders: <span className="text-emerald-400">{renderCount}</span></div>
            <div>Connection: <span className={`${
              connectionState === 'connected' ? 'text-emerald-400' :
              connectionState === 'error' ? 'text-red-400' : 'text-yellow-400'
            }`}>{connectionState}</span></div>
            <div>WebSocket: <span className="text-slate-400">{wsUrl.replace('ws://', '')}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;