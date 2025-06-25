
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Zap, TrendingUp, AlertTriangle, Settings, Download } from 'lucide-react';
import { mockRegions } from "@/services/mockDataService";
import { RegionMetricsGrid } from './RegionMetricsGrid';
import { LiveSiteMonitoring } from './LiveSiteMonitoring';
import { RegionPerformanceChart } from './RegionPerformanceChart';
import { RegionAlertsPanel } from './RegionAlertsPanel';

export const RegionDashboard = () => {
  const { regionId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const region = mockRegions.find(r => r.id === regionId);

  if (!region) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Region not found</p>
      </div>
    );
  }

  const totalCapacity = region.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
  const totalCurrent = region.sites.reduce((sum, site) => sum + site.currentOutput, 0);
  const avgEfficiency = region.sites.reduce((sum, site) => sum + site.efficiency, 0) / region.sites.length;
  const activeSites = region.sites.filter(s => s.status === 'online').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{region.name}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>{region.sites.length} Sites</span>
                  <span>{totalCapacity.toFixed(1)}MW Capacity</span>
                  <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                    Regional Hub
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Manage Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 data-[state=active]:border-violet-500/30"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 data-[state=active]:border-violet-500/30"
            >
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 data-[state=active]:border-violet-500/30"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 data-[state=active]:border-violet-500/30"
            >
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <RegionMetricsGrid 
              totalCapacity={totalCapacity}
              totalCurrent={totalCurrent}
              avgEfficiency={avgEfficiency}
              activeSites={activeSites}
              totalSites={region.sites.length}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionPerformanceChart regionData={region} />
              <RegionAlertsPanel regionId={regionId!} />
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 mt-6">
            <LiveSiteMonitoring sites={region.sites} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Performance Analytics</h3>
              <p className="text-slate-400">Advanced performance analytics coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6 mt-6">
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Alert Management</h3>
              <p className="text-slate-400">Comprehensive alert management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
