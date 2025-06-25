
import { useParams } from "react-router-dom";
import { Zap, Battery, TrendingUp, Grid, Sun, AlertTriangle, Settings, Download, Users, FileText, DollarSign } from "lucide-react";
import { mockRegions, generatePowerData } from "@/services/mockDataService";
import { Metric } from "@/types/energy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedPowerChart } from "./site/EnhancedPowerChart";
import { EnhancedEnergyMix } from "./site/EnhancedEnergyMix";
import { EnhancedAlertsCard } from "./site/EnhancedAlertsCard";
import InteractiveGrid from "./InteractiveGrid";
import SiteAssets from "./SiteAssets";
import SiteReports from "./SiteReports";
import SiteTeam from "./SiteTeam";
import SiteFinances from "./SiteFinances";
import SiteSettings from "./SiteSettings";
import { usePerformance } from "@/hooks/usePerformance";

const SiteDashboard = () => {
  const { siteId } = useParams();
  const { logRenderTime } = usePerformance('SiteDashboard');

  if (!siteId) return <div className="text-white">Site not found</div>;

  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);

  if (!site) return <div className="text-white">Site not found</div>;

  const powerData = generatePowerData();
  const energyMix = [
    { name: "Solar", value: 65, color: "#10b981" },
    { name: "Battery", value: 25, color: "#3b82f6" },
    { name: "Grid", value: 10, color: "#f59e0b" },
  ];

  const metrics: Metric[] = [
    {
      title: "Current Power Output",
      value: `${site.currentOutput} kW`,
      change: "+8.2%",
      trend: "up",
      icon: Zap,
      color: "emerald"
    },
    {
      title: "Battery Level",
      value: "78%",
      change: "-2.1%", 
      trend: "down",
      icon: Battery,
      color: "blue"
    },
    {
      title: "Energy Today",
      value: "145.2 kWh",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "cyan"
    },
    {
      title: "System Efficiency",
      value: `${site.efficiency}%`,
      change: "+0.3%",
      trend: "up",
      icon: TrendingUp,
      color: "green"
    }
  ];

  logRenderTime();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Modern Header Bar */}
      <div className="bg-slate-900/50 border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Site Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{site.name}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>{site.location}</span>
                  <Badge className={`${getStatusColor(site.status)} text-xs px-3 py-1`}>
                    {site.status}
                  </Badge>
                  <span>{site.totalCapacity}MW Total</span>
                </div>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <AlertTriangle className="w-4 h-4 mr-2" />
                View Alerts (3)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="grid" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Grid className="w-4 h-4 mr-1" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-1" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-1" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-1" />
              Team
            </TabsTrigger>
            <TabsTrigger value="finances" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-1" />
              Finances
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8 mt-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={metric.title} className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${metric.color}-500/10 border border-${metric.color}-500/20`}>
                        <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 bg-slate-800/50">
                        Live
                      </Badge>
                    </div>
                    
                    <h3 className="text-sm font-medium text-slate-400 mb-2">
                      {metric.title}
                    </h3>
                    
                    <div className="text-2xl font-bold text-white mb-2">
                      {metric.value}
                    </div>
                    
                    <div className={`flex items-center text-sm ${
                      metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        metric.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span>{metric.change}</span>
                      <span className="text-slate-500 ml-1">vs yesterday</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Power Chart - Takes 2/3 */}
              <div className="lg:col-span-2">
                <EnhancedPowerChart siteName={site.name} powerData={powerData} />
              </div>
              
              {/* Energy Mix - Takes 1/3 */}
              <div className="lg:col-span-1">
                <EnhancedEnergyMix siteName={site.name} energyMix={energyMix} />
              </div>
            </div>

            {/* Secondary Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alerts */}
              <EnhancedAlertsCard siteName={site.name} />
              
              {/* Quick Stats */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Sun className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium text-white">Today's Generation</span>
                      </div>
                      <span className="text-xl font-bold text-emerald-400">2,847 kWh</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Grid className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-white">Grid Connection</span>
                      </div>
                      <span className="text-xl font-bold text-blue-400">Stable</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <span className="font-medium text-white">Monthly Target</span>
                      </div>
                      <span className="text-xl font-bold text-purple-400">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="grid" className="mt-6">
            <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-slate-700/50">
              <InteractiveGrid />
            </div>
          </TabsContent>

          <TabsContent value="assets" className="mt-6">
            <SiteAssets />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <SiteReports />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <SiteTeam />
          </TabsContent>

          <TabsContent value="finances" className="mt-6">
            <SiteFinances />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SiteDashboard;
