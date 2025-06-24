
import React, { useMemo, Suspense, lazy } from "react";
import { mockRegions } from "@/services/mockDataService";
import { MetricsCards } from "@/components/overview/MetricsCards";
import { RegionsGrid } from "@/components/overview/RegionsGrid";
import { usePerformance } from "@/hooks/usePerformance";

// Lazy load heavy components
const QuickActions = lazy(() => import("@/components/widgets/QuickActions").then(module => ({ default: module.QuickActions })));
const SystemStatusMonitor = lazy(() => import("@/components/monitoring/SystemStatusMonitor").then(module => ({ default: module.SystemStatusMonitor })));
const SystemMonitor = lazy(() => import("@/components/monitoring/SystemMonitor").then(module => ({ default: module.SystemMonitor })));
const EnergyAnalytics = lazy(() => import("@/components/widgets/EnergyAnalytics").then(module => ({ default: module.EnergyAnalytics })));
const RealTimeMonitor = lazy(() => import("@/components/common/RealTimeMonitor").then(module => ({ default: module.RealTimeMonitor })));

const LoadingSpinner = () => (
  <div className="animate-pulse">
    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-lg h-48 flex items-center justify-center">
      <div className="text-slate-400">Loading...</div>
    </div>
  </div>
);

const Overview = () => {
  const { logRenderTime } = usePerformance('Overview');
  console.log("Overview component rendering");
  
  const overviewStats = useMemo(() => {
    const totalSites = mockRegions.reduce((acc, region) => acc + region.sites.length, 0);
    const onlineSites = mockRegions.reduce((acc, region) => 
      acc + region.sites.filter(site => site.status === 'online').length, 0);
    const totalCapacity = mockRegions.reduce((acc, region) => 
      acc + region.sites.reduce((siteAcc, site) => siteAcc + site.totalCapacity, 0), 0);
    const totalOutput = mockRegions.reduce((acc, region) => 
      acc + region.sites.reduce((siteAcc, site) => siteAcc + site.currentOutput, 0), 0);
    
    return { totalSites, onlineSites, totalCapacity, totalOutput };
  }, []);

  logRenderTime();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-in-left">
        <h1 className="text-3xl font-bold text-white">
          WEM Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          Monitor and manage your energy infrastructure across all regions
        </p>
      </div>

      {/* Key Metrics */}
      <MetricsCards {...overviewStats} />

      {/* Analytics Section */}
      <div className="animate-fade-in">
        <Suspense fallback={<LoadingSpinner />}>
          <EnergyAnalytics />
        </Suspense>
      </div>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-slide-in-left">
          <Suspense fallback={<LoadingSpinner />}>
            <QuickActions />
          </Suspense>
        </div>
        <div className="animate-slide-in-up">
          <Suspense fallback={<LoadingSpinner />}>
            <SystemStatusMonitor />
          </Suspense>
        </div>
        <div className="animate-slide-in-right">
          <Suspense fallback={<LoadingSpinner />}>
            <SystemMonitor />
          </Suspense>
        </div>
      </div>

      {/* Real-Time Monitoring */}
      <div className="animate-slide-in-up">
        <Suspense fallback={<LoadingSpinner />}>
          <RealTimeMonitor />
        </Suspense>
      </div>

      {/* Regions Grid */}
      <RegionsGrid regions={mockRegions} />
    </div>
  );
};

export default Overview;
