import React, { useMemo, Suspense, lazy, useState, useEffect, useRef } from "react";
import { mockRegions } from "@/services/mockDataService";
import { MetricsCards } from "@/components/overview/MetricsCards";
import { RegionsGrid } from "@/components/overview/RegionsGrid";
import { usePerformance } from "@/hooks/usePerformance";
import { useRealTimeData, ConnectionStatus } from "@/hooks/useWebSocket";
import { useNotify } from "@/components/notifications/NotificationSystem";
import { useTheme } from "@/components/theme/ThemeProvider";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { ExportDialog, QuickExportButton } from "@/components/common/ExportManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  Download, 
  Settings, 
  Activity, 
  Globe, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Battery, 
  Sun, 
  Wind,
  Thermometer,
  Calendar,
  Clock,
  Users,
  Building2
} from "lucide-react";

// Lazy load heavy components for better performance
const QuickActions = lazy(() => import("@/components/widgets/QuickActions").then(module => ({ default: module.QuickActions })));
const SystemStatusMonitor = lazy(() => import("@/components/monitoring/SystemStatusMonitor").then(module => ({ default: module.SystemStatusMonitor })));
const SystemMonitor = lazy(() => import("@/components/monitoring/SystemMonitor").then(module => ({ default: module.SystemMonitor })));
const EnergyAnalytics = lazy(() => import("@/components/widgets/EnergyAnalytics").then(module => ({ default: module.EnergyAnalytics })));
const RealTimeMonitor = lazy(() => import("@/components/common/RealTimeMonitor").then(module => ({ default: module.RealTimeMonitor })));

// Enhanced loading spinner
const LoadingSpinner = () => {
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

// Enhanced Weather Card with larger size
const WeatherCard = () => {
  const [weather, setWeather] = useState({
    temperature: 24,
    windSpeed: 12,
    solarIrradiance: 850,
    humidity: 65
  });

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
          <Thermometer className="w-6 h-6 text-blue-400" />
          Environmental Conditions
        </CardTitle>
        <CardDescription className="text-slate-400">
          Real-time environmental data affecting energy production
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Temperature</span>
              <span className="text-lg font-bold text-white">{weather.temperature}°C</span>
            </div>
            <Progress value={weather.temperature * 2} className="h-3" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Wind Speed
              </span>
              <span className="text-lg font-bold text-white">{weather.windSpeed} m/s</span>
            </div>
            <Progress value={weather.windSpeed * 5} className="h-3" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Solar Irradiance
              </span>
              <span className="text-lg font-bold text-white">{weather.solarIrradiance} W/m²</span>
            </div>
            <Progress value={weather.solarIrradiance / 10} className="h-3" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Humidity</span>
              <span className="text-lg font-bold text-white">{weather.humidity}%</span>
            </div>
            <Progress value={weather.humidity} className="h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Recent Activity with larger size
const RecentActivity = () => {
  const activities = [
    { icon: Zap, text: "Main Campus came online", time: "2 min ago", status: "success" },
    { icon: AlertTriangle, text: "High temperature alert - Warehouse", time: "15 min ago", status: "warning" },
    { icon: Settings, text: "Scheduled maintenance completed", time: "1 hour ago", status: "info" },
    { icon: Users, text: "New user account created", time: "2 hours ago", status: "info" },
    { icon: Battery, text: "Battery storage reached 95%", time: "3 hours ago", status: "success" }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
          <Activity className="w-6 h-6 text-emerald-400" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-slate-400">
          Latest system events and notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
              <div className={`p-3 rounded-lg ${
                activity.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                activity.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{activity.text}</p>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced daily summary component
const DailySummary = () => {
  const summary = {
    energyGenerated: 2847,
    peakOutput: 98.5,
    avgEfficiency: 94.2,
    co2Avoided: 1.2,
    uptime: 99.2
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
          <Calendar className="w-6 h-6 text-violet-400" />
          Today's Summary
        </CardTitle>
        <CardDescription className="text-slate-400">
          Daily performance metrics and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Energy Generated</p>
            <p className="text-2xl font-bold text-emerald-400">{summary.energyGenerated} kWh</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Peak Output</p>
            <p className="text-2xl font-bold text-yellow-400">{summary.peakOutput}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Avg Efficiency</p>
            <p className="text-2xl font-bold text-blue-400">{summary.avgEfficiency}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-400">CO₂ Avoided</p>
            <p className="text-2xl font-bold text-green-400">{summary.co2Avoided}t</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">System Uptime</span>
            <span className="text-lg font-bold text-emerald-400">{summary.uptime}%</span>
          </div>
          <Progress value={summary.uptime} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
};

const Overview = () => {
  const { logRenderTime, getMetrics } = usePerformance('Overview');
  const notify = useNotify();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const alertNotificationShown = useRef(false);
  
  const metrics = getMetrics();
  console.log(`Overview component rendering (render time: ${metrics.renderTime}ms)`);
  
  const isDevelopment = import.meta.env.DEV;
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws/energy-data';
  
  // Real-time WebSocket connection
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
      suppressNotifications: true,
      onError: (error) => {
        console.warn('WebSocket connection error:', error);
      },
      onClose: (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
      }
    },
    'energy-overview',
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

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    if (realTimeData) {
      return realTimeData;
    }
    
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
      alerts: 2,
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

  // Critical alert notification (fixed)
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
      
      setTimeout(() => {
        alertNotificationShown.current = false;
      }, 5 * 60 * 1000);
    }
  }, [overviewStats.alerts, notify]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionState === 'connected') {
        requestData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [connectionState, requestData]);

  // Log performance
  useEffect(() => {
    logRenderTime();
  });

  // Connection status badge
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
    <div className="h-full bg-slate-950 w-full">
      <div className="p-6 space-y-6 max-w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30 shadow-lg">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  WEM Dashboard
                </h1>
                <p className="text-lg text-slate-400">
                  Energy Infrastructure Management
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
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
              <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <Globe className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-orange-400 font-medium">
                  Using offline data - Real-time features unavailable
                </span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
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

        {/* Metrics Cards */}
        <MetricsCards 
          {...overviewStats} 
          isRealTime={connectionState === 'connected'}
          lastUpdated={overviewStats.lastUpdated}
        />

        {/* Main Content Grid - 2 column layout for better chart visibility */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Charts and Analytics */}
          <div className="space-y-6">
            <div className="h-96">
              <Suspense fallback={<LoadingSpinner />}>
                <EnergyAnalytics realTimeData={realTimeData} />
              </Suspense>
            </div>
            <div className="h-80">
              <Suspense fallback={<LoadingSpinner />}>
                <SystemStatusMonitor realTimeData={overviewStats} />
              </Suspense>
            </div>
          </div>

          {/* Right Column - Widgets */}
          <div className="space-y-6">
            <div className="h-96">
              <WeatherCard />
            </div>
            <div className="h-80">
              <RecentActivity />
            </div>
          </div>
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72">
            <DailySummary />
          </div>
          <div className="h-72">
            <Suspense fallback={<LoadingSpinner />}>
              <QuickActions connectionState={connectionState} />
            </Suspense>
          </div>
          <div className="h-72">
            <Suspense fallback={<LoadingSpinner />}>
              <SystemMonitor connectionState={connectionState} />
            </Suspense>
          </div>
        </div>

        {/* Real-Time Monitor - Full Width */}
        <div className="h-80">
          <Suspense fallback={<LoadingSpinner />}>
            <RealTimeMonitor 
              data={realTimeData} 
              connectionState={connectionState}
              onRefresh={handleRefresh}
            />
          </Suspense>
        </div>

        {/* Regions Grid - Full width */}
        <RegionsGrid 
          regions={mockRegions} 
          realTimeUpdates={connectionState === 'connected'}
        />

        {/* Export Dialog */}
        <ExportDialog
          isOpen={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          defaultDataType="energy-data"
        />

        {/* Dev Tools */}
        {isDevelopment && (
          <div className="fixed bottom-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs font-mono backdrop-blur-sm border border-slate-700">
            <div className="space-y-1">
              <div>Render Time: <span className="text-emerald-400">{metrics.renderTime}ms</span></div>
              <div>Connection: <span className={`${
                connectionState === 'connected' ? 'text-emerald-400' :
                connectionState === 'error' ? 'text-red-400' : 'text-yellow-400'
              }`}>{connectionState}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;