
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockRegions } from "@/services/mockDataService";
import { EnhancedSiteHeader } from "@/components/site/EnhancedSiteHeader";
import { CustomizableSiteDashboard } from "@/components/site/CustomizableSiteDashboard";
import SiteGrid from "@/components/SiteGrid";
import SiteAssets from "@/components/SiteAssets";
import SiteReports from "@/components/SiteReports";
import SiteTeam from "@/components/SiteTeam";
import SiteFinances from "@/components/SiteFinances";
import SiteSettings from "@/components/SiteSettings";
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Battery, 
  Thermometer,
  Wind,
  Sun,
  Gauge,
  Calendar,
  Clock,
  Users,
  Settings,
  Eye,
  Download,
  Maximize2,
  BarChart3,
  Grid3X3,
  FileText,
  DollarSign
} from "lucide-react";

// Quick Stats Component for site overview
const SiteQuickStats = ({ site }: { site: any }) => {
  const stats = [
    {
      title: "Current Output",
      value: `${site.currentOutput} MW`,
      change: "+2.3%",
      icon: Zap,
      color: "text-emerald-400"
    },
    {
      title: "Efficiency",
      value: "94.2%",
      change: "+0.8%",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      title: "Uptime",
      value: "99.2%",
      change: "+0.1%",
      icon: Activity,
      color: "text-green-400"
    },
    {
      title: "Alerts",
      value: "2",
      change: "-1",
      icon: AlertTriangle,
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-slate-700/30 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Real-time monitoring component
const RealTimeMonitoring = ({ site }: { site: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const monitoringData = [
    { label: "Power Generation", value: site.currentOutput, max: site.totalCapacity, unit: "MW", color: "bg-emerald-500" },
    { label: "Grid Frequency", value: 49.98, max: 50, unit: "Hz", color: "bg-blue-500" },
    { label: "Voltage", value: 230.5, max: 240, unit: "V", color: "bg-purple-500" },
    { label: "Temperature", value: 35, max: 50, unit: "°C", color: "bg-orange-500" }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            Real-Time Monitoring
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-slate-400">
          Live system performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {monitoringData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className="text-sm font-medium text-white">
                {item.value} {item.unit}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Last Update</p>
                <p className="text-white font-medium">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Data Source</p>
                <p className="text-white font-medium">SCADA System</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced Alerts component
const SiteAlerts = () => {
  const alerts = [
    { 
      type: "warning", 
      title: "High Temperature Alert", 
      description: "Inverter temperature exceeds normal range",
      time: "2 min ago",
      severity: "medium"
    },
    { 
      type: "info", 
      title: "Maintenance Scheduled", 
      description: "Routine maintenance scheduled for tomorrow",
      time: "1 hour ago",
      severity: "low"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Active Alerts
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            {alerts.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Current system alerts and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
            <div className={`p-2 rounded-lg ${
              alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              alert.type === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{alert.title}</p>
              <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {alert.time}
              </p>
            </div>
            <Badge variant="outline" className={`text-xs ${
              alert.severity === 'high' ? 'border-red-500/30 text-red-400' :
              alert.severity === 'medium' ? 'border-yellow-500/30 text-yellow-400' :
              'border-blue-500/30 text-blue-400'
            }`}>
              {alert.severity}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Performance Analytics Component
const PerformanceAnalytics = ({ site }: { site: any }) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          Performance Analytics
        </CardTitle>
        <CardDescription className="text-slate-400">
          Key performance indicators and trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Today's Generation</span>
              <span className="text-sm font-bold text-emerald-400">2,847 kWh</span>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-slate-500">85% of daily target</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Monthly Target</span>
              <span className="text-sm font-bold text-blue-400">78%</span>
            </div>
            <Progress value={78} className="h-2" />
            <p className="text-xs text-slate-500">23 days remaining</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Efficiency Score</span>
              <span className="text-sm font-bold text-purple-400">94.2%</span>
            </div>
            <Progress value={94} className="h-2" />
            <p className="text-xs text-slate-500">Above average</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">CO₂ Offset</span>
              <span className="text-sm font-bold text-green-400">1.2t</span>
            </div>
            <Progress value={60} className="h-2" />
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SiteDashboard = () => {
  const { siteId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  console.log("Site Dashboard rendering for siteId:", siteId);
  
  if (!siteId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Site Not Found</h2>
          <p className="text-slate-400">The requested site could not be found.</p>
        </div>
      </div>
    );
  }

  // Find the site
  const site = mockRegions
    .flatMap(region => region.sites)
    .find(site => site.id === siteId);

  if (!site) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Site Not Found</h2>
          <p className="text-slate-400">Site with ID "{siteId}" was not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Site Header - Clean, single header integrated into main layout */}
      <div className="bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                {site.name}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <p className="text-cyan-300 text-sm font-medium flex items-center space-x-2">
                  <span>{site.location}</span>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  <span className="text-white/60">Capacity: {site.totalCapacity}MW</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={`${
              site.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              site.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            } font-semibold backdrop-blur-xl px-4 py-2`}>
              <Activity className="w-3 h-3 mr-2" />
              {site.status}
            </Badge>
            
            <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-2 backdrop-blur-xl">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-300 font-semibold text-sm">98.5% Uptime</span>
            </div>
          </div>
        </div>
      </div>
        
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="grid" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Grid
          </TabsTrigger>
          <TabsTrigger 
            value="assets" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
          >
            <Zap className="w-4 h-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
          >
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
          >
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger 
            value="finances" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Finances
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Quick Stats */}
          <SiteQuickStats site={site} />
          
          {/* Main Dashboard Content - Better Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <RealTimeMonitoring site={site} />
              <PerformanceAnalytics site={site} />
            </div>
            
            {/* Middle Column */}
            <div className="xl:col-span-2 space-y-6">
              <CustomizableSiteDashboard siteData={site} />
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SiteAlerts />
            
            {/* Additional monitoring card */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Today's Summary
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Daily performance overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">2,847</p>
                    <p className="text-sm text-slate-400">kWh Generated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">98.5%</p>
                    <p className="text-sm text-slate-400">Peak Efficiency</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">12</p>
                    <p className="text-sm text-slate-400">Days Maintenance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">3</p>
                    <p className="text-sm text-slate-400">Active Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grid" className="space-y-6 mt-6">
          <SiteGrid />
        </TabsContent>

        <TabsContent value="assets" className="space-y-6 mt-6">
          <SiteAssets />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <SiteReports />
        </TabsContent>

        <TabsContent value="team" className="space-y-6 mt-6">
          <SiteTeam />
        </TabsContent>

        <TabsContent value="finances" className="space-y-6 mt-6">
          <SiteFinances />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <SiteSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDashboard;
