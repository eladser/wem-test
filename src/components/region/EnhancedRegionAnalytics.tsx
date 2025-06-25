
import React from 'react';
import { InteractiveChartContainer } from '@/components/analytics/InteractiveChartContainer';
import { PerformanceMetricsGrid } from '@/components/performance/PerformanceMetricsGrid';
import { SmartAlertsPanel } from '@/components/alerts/SmartAlertsPanel';

export const EnhancedRegionAnalytics = () => {
  // Sample data for regional analytics
  const regionalPowerData = [
    { name: 'Jan', value: 2450 },
    { name: 'Feb', value: 2680 },
    { name: 'Mar', value: 2890 },
    { name: 'Apr', value: 3120 },
    { name: 'May', value: 3350 },
    { name: 'Jun', value: 3180 },
  ];

  const energySourceData = [
    { name: 'Solar', value: 1850 },
    { name: 'Wind', value: 1200 },
    { name: 'Hydro', value: 580 },
    { name: 'Battery', value: 370 },
  ];

  const efficiencyTrends = [
    { name: 'Week 1', value: 89 },
    { name: 'Week 2', value: 91 },
    { name: 'Week 3', value: 93 },
    { name: 'Week 4', value: 87 },
    { name: 'Week 5', value: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics Overview */}
      <PerformanceMetricsGrid />
      
      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChartContainer
          title="Regional Power Output"
          data={regionalPowerData}
          chartTypes={['line', 'area', 'bar']}
          timeRanges={['1d', '7d', '30d', '90d']}
        />
        <InteractiveChartContainer
          title="Energy Source Distribution"
          data={energySourceData}
          chartTypes={['pie', 'bar']}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChartContainer
          title="Efficiency Trends"
          data={efficiencyTrends}
          chartTypes={['line', 'area']}
        />
        <SmartAlertsPanel />
      </div>
    </div>
  );
};
