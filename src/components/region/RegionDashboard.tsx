
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Download, 
  Activity,
  Building2,
  Gauge,
  Calendar,
  Users,
  BarChart3,
  Globe,
  Battery,
  Clock
} from 'lucide-react';
import { mockRegions } from "@/services/mockDataService";
import { RegionMetricsGrid } from './RegionMetricsGrid';
import { LiveSiteMonitoring } from './LiveSiteMonitoring';
import { RegionPerformanceChart } from './RegionPerformanceChart';
import { RegionAlertsPanel } from './RegionAlertsPanel';

// Regional Quick Stats Component
const RegionalQuickStats = ({ region }: { region: any }) => {
  const totalCapacity = region.sites.reduce((sum: number, site: any) => sum + site.totalCapacity, 0);
  const totalCurrent = region.sites.reduce((sum: number, site: any) => sum + site.currentOutput, 0);
  const avgEfficiency = region.sites.reduce((sum: number, site: any) => sum + site.efficiency, 0) / region.sites.length;
  const activeSites = region.sites.filter((s: any) => s.status === 'online').length;

  const stats = [
    {
      title: "Total Output",
      value: `${totalCurrent.toFixed(1)} MW`,
      max: totalCapacity,
      current: totalCurrent,
      icon: Zap,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    },
    {
      title: "Active Sites",
      value: `${activeSites}/${region.sites.length}`,
      max: region.sites.length,
      current: activeSites,
      icon: Building2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Avg Efficiency",
      value: `${avgEfficiency.toFixed(1)}%`,
      max: 100,
      current: avgEfficiency,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Total Capacity",
      value: `${totalCapacity.toFixed(1)} MW`,
      max: totalCapacity,
      current: totalCapacity,
      icon: Battery,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.title}</p>
              </div>
            </div>
            <Progress 
              value={(stat.current / stat.max) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Site Status Overview Component
const SiteStatusOverview = ({ sites }: { sites: any[] }) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-violet-400" />
          Site Status Overview
        </CardTitle>
        <CardDescription className="text-slate-400">
          Real-time status of all sites in this region
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((site, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  site.status === 'online' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30' :
                  site.status === 'maintenance' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/30' :
                  'bg-red-400 shadow-lg shadow-red-400/30'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">{site.name}</p>
                  <p className="text-xs text-slate-400">{site.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{site.currentOutput}MW</p>
                <p className="text-xs text-slate-400">{site.totalCapacity}MW cap</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Regional Performance Summary
const RegionalPerformanceSummary = ({ region }: { region: any }) => {
  const performanceData = {
    todayGeneration: 12847,
    weeklyAverage: 11230,
    monthlyTarget: 78,
    co2Offset: 5.2,
    uptime: 99.1
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Performance Summary
        </CardTitle>
        <CardDescription className="text-slate-400">
          Regional performance metrics and trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Today's Generation</span>
              <span className="text-sm font-bold text-emerald-400">{performanceData.todayGeneration.toLocaleString()} kWh</span>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-slate-500">85% of daily target</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Weekly Average</span>
              <span className="text-sm font-bold text-blue-400">{performanceData.weeklyAverage.toLocaleString()} kWh</span>
            </div>
            <Progress value={92} className="h-2" />
            <p className="text-xs text-slate-500">Above target</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Monthly Progress</span>
              <span className="text-sm font-bold text-purple-400">{performanceData.monthlyTarget}%</span>
            </div>
            <Progress value={performanceData.monthlyTarget} className="h-2" />
            <p className="text-xs text-slate-500">On track</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">CO₂ Offset</span>
              <span className="text-sm font-bold text-green-400">{performanceData.co2Offset}t</span>
            </div>
            <Progress value={60} className="h-2" />
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Overall Uptime</span>
            <span className="text-sm font-bold text-emerald-400">{performanceData.uptime}%</span>
          </div>
          <Progress value={performanceData.uptime} className="h-2 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};

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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-3xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent">
                  {region.name}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Building2 className="w-4 h-4" />
                    <span>{region.sites.length} Sites</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Zap className="w-4 h-4" />
                    <span>{totalCapacity.toFixed(1)}MW Total Capacity</span>
                  </div>
                  <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 px-3 py-1">
                    Regional Hub
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
              >
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
            {/* Quick Stats */}
            <RegionalQuickStats region={region} />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <RegionalPerformanceSummary region={region} />
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      Today's Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-sm text-slate-400">Peak Output</span>
                      <span className="text-sm font-bold text-emerald-400">{totalCurrent.toFixed(1)} MW</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-sm text-slate-400">Best Performer</span>
                      <span className="text-sm font-bold text-blue-400">{region.sites[0]?.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-sm text-slate-400">Maintenance Due</span>
                      <span className="text-sm font-bold text-yellow-400">3 Sites</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Middle Column */}
              <div className="xl:col-span-2 space-y-6">
                <SiteStatusOverview sites={region.sites} />
                
                {/* Legacy components */}
                <RegionMetricsGrid 
                  totalCapacity={totalCapacity}
                  totalCurrent={totalCurrent}
                  avgEfficiency={avgEfficiency}
                  activeSites={activeSites}
                  totalSites={region.sites.length}
                />
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionPerformanceChart regionData={region} />
              <RegionAlertsPanel regionId={regionId!} />
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 mt-6">
            <LiveSiteMonitoring sites={region.sites} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Performance analytics charts coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    Efficiency Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Gauge className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Efficiency analysis coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Alert Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Comprehensive alert management coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" />
                    Critical Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Critical issue tracking coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
