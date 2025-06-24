
import React from "react";
import { mockRegions } from "@/services/mockDataService";
import { QuickActions } from "@/components/widgets/QuickActions";
import { SystemStatusMonitor } from "@/components/monitoring/SystemStatusMonitor";
import { SystemMonitor } from "@/components/monitoring/SystemMonitor";
import { EnergyAnalytics } from "@/components/widgets/EnergyAnalytics";
import { RealTimeMonitor } from "@/components/common/RealTimeMonitor";
import { MetricsCards } from "@/components/overview/MetricsCards";
import { RegionsGrid } from "@/components/overview/RegionsGrid";

const Overview = () => {
  console.log("Overview component rendering");
  
  const totalSites = mockRegions.reduce((acc, region) => acc + region.sites.length, 0);
  const onlineSites = mockRegions.reduce((acc, region) => 
    acc + region.sites.filter(site => site.status === 'online').length, 0);
  const totalCapacity = mockRegions.reduce((acc, region) => 
    acc + region.sites.reduce((siteAcc, site) => siteAcc + site.totalCapacity, 0), 0);
  const totalOutput = mockRegions.reduce((acc, region) => 
    acc + region.sites.reduce((siteAcc, site) => siteAcc + site.currentOutput, 0), 0);

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
      <MetricsCards 
        totalSites={totalSites}
        onlineSites={onlineSites}
        totalCapacity={totalCapacity}
        totalOutput={totalOutput}
      />

      {/* Analytics Section */}
      <div className="animate-fade-in">
        <EnergyAnalytics />
      </div>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-slide-in-left">
          <QuickActions />
        </div>
        <div className="animate-slide-in-up">
          <SystemStatusMonitor />
        </div>
        <div className="animate-slide-in-right">
          <SystemMonitor />
        </div>
      </div>

      {/* Real-Time Monitoring */}
      <div className="animate-slide-in-up">
        <RealTimeMonitor />
      </div>

      {/* Regions Grid */}
      <RegionsGrid regions={mockRegions} />
    </div>
  );
};

export default Overview;
