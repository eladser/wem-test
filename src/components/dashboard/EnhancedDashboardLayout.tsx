
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveChartContainer } from '@/components/analytics/InteractiveChartContainer';
import { PerformanceMetricsGrid } from '@/components/performance/PerformanceMetricsGrid';
import { SmartAlertsPanel } from '@/components/alerts/SmartAlertsPanel';
import { LayoutDashboard, TrendingUp, Bell, Settings, Download, RefreshCw } from 'lucide-react';

export const EnhancedDashboardLayout = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Sample data for charts
  const powerData = [
    { name: '00:00', value: 850 },
    { name: '04:00', value: 620 },
    { name: '08:00', value: 1200 },
    { name: '12:00', value: 1850 },
    { name: '16:00', value: 1650 },
    { name: '20:00', value: 980 },
  ];

  const efficiencyData = [
    { name: 'Solar', value: 45 },
    { name: 'Wind', value: 30 },
    { name: 'Hydro', value: 15 },
    { name: 'Battery', value: 10 },
  ];

  const performanceData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 88 },
    { name: 'Mar', value: 92 },
    { name: 'Apr', value: 89 },
    { name: 'May', value: 94 },
    { name: 'Jun', value: 91 },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Energy Dashboard</h1>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Enhanced
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="glass border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetricsGrid />

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-emerald-600">
            Alerts
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-emerald-600">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChartContainer
              title="Power Generation"
              data={powerData}
              chartTypes={['line', 'area', 'bar']}
            />
            <SmartAlertsPanel />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChartContainer
              title="Energy Mix Distribution"
              data={efficiencyData}
              chartTypes={['pie', 'bar']}
            />
            <InteractiveChartContainer
              title="Monthly Performance"
              data={performanceData}
              chartTypes={['line', 'area', 'bar']}
            />
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <SmartAlertsPanel className="col-span-full" />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Report Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Advanced Reporting</h3>
                <p className="text-slate-400">Comprehensive reporting features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
