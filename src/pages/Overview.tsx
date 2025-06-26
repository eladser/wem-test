import React, { useMemo, Suspense, lazy, useState, useEffect } from "react";
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
import { RefreshCw, Download, Settings } from "lucide-react";

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
      <div className={`${
        resolvedTheme === 'dark' 
          ? 'bg-slate-900/50 border-slate-700/50' 
          : 'bg-white/50 border-slate-200/50'
      } backdrop-blur-xl border rounded-lg h-48 flex items-center justify-center`}>
        <div className={`${
          resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        } flex items-center gap-2`}>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading...
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
  
  console.log(`Overview component rendering (render #${renderCount})`);
  
  // Environment variables using Vite's import.meta.env
  const isDevelopment = import.meta.env.DEV;
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws/energy-data';
  
  console.log(`WebSocket URL: ${wsUrl}`);
  
  // Real-time WebSocket connection for live data
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
      onError: (error) => {
        console.warn('WebSocket connection error:', error);
        // Don't show error notifications immediately - let the reconnection logic handle it
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
      alerts: 2,
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
      alerts: Math.floor(Math.random() * 5),
      lastUpdated: new Date().toISOString()
    };
  }, [realTimeData]);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await requestData();
      notify.success('Data Refreshed', 'Dashboard data has been updated');
    } catch (error) {
      notify.error('Refresh Failed', 'Unable to fetch latest data');
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // Monitor for critical alerts
  useEffect(() => {
    if (overviewStats.alerts > 3) {
      notify.warning(
        'High Alert Count', 
        `${overviewStats.alerts} active alerts require attention`,
        { 
          priority: 1,
          action: {
            label: 'View Alerts',
            onClick: () => console.log('Navigate to alerts')
          }
        }
      );
    }
  }, [overviewStats.alerts, notify]);

  // Auto-refresh every 5 minutes
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

  return (
    <div className="space-y-6">
      {/* Header with real-time status */}
      <div className="flex justify-between items-start">
        <div className="animate-slide-in-left">
          <h1 className={`text-3xl font-bold ${
            resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            WEM Dashboard
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className={`${
              resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            } text-lg`}>
              Monitor and manage your energy infrastructure across all regions
            </p>
            <ConnectionStatus connectionState={connectionState} />
          </div>
          {lastUpdated > 0 && (
            <p className={`text-sm ${
              resolvedTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'
            } mt-1`}>
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
          {connectionState === 'error' && (
            <p className="text-sm text-orange-500 mt-1">
              Using offline data - Check backend connection
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 animate-fade-in">
          <QuickExportButton
            dataType="energy-data"
            format="csv"
            filename="dashboard-data"
            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Quick Export
          </QuickExportButton>
          
          <Button
            onClick={() => setExportDialogOpen(true)}
            variant="outline"
            className={`border-slate-700 ${
              resolvedTheme === 'dark' 
                ? 'text-slate-300 hover:bg-slate-800' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Export Options
          </Button>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className={`border-slate-700 ${
              resolvedTheme === 'dark' 
                ? 'text-slate-300 hover:bg-slate-800' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics with real-time data */}
      <div className="animate-slide-in-up">
        <MetricsCards 
          {...overviewStats} 
          isRealTime={connectionState === 'connected'}
          lastUpdated={overviewStats.lastUpdated}
        />
      </div>

      {/* Analytics Section with error boundary */}
      <div className="animate-fade-in">
        <Suspense fallback={<LoadingSpinner />}>
          <EnergyAnalytics realTimeData={realTimeData} />
        </Suspense>
      </div>

      {/* Monitoring Grid with staggered animations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-slide-in-left" style={{ animationDelay: '100ms' }}>
          <Suspense fallback={<LoadingSpinner />}>
            <QuickActions connectionState={connectionState} />
          </Suspense>
        </div>
        <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <Suspense fallback={<LoadingSpinner />}>
            <SystemStatusMonitor realTimeData={overviewStats} />
          </Suspense>
        </div>
        <div className="animate-slide-in-right" style={{ animationDelay: '300ms' }}>
          <Suspense fallback={<LoadingSpinner />}>
            <SystemMonitor connectionState={connectionState} />
          </Suspense>
        </div>
      </div>

      {/* Real-Time Monitoring */}
      <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <RealTimeMonitor 
            data={realTimeData} 
            connectionState={connectionState}
            onRefresh={handleRefresh}
          />
        </Suspense>
      </div>

      {/* Regions Grid with enhanced interactivity */}
      <div className="animate-slide-in-up" style={{ animationDelay: '500ms' }}>
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

      {/* Performance monitoring in development */}
      {isDevelopment && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono">
          Renders: {renderCount} | Connection: {connectionState} | URL: {wsUrl}
        </div>
      )}
    </div>
  );
};

export default Overview;