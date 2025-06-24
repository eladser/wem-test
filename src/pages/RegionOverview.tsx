import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Zap, TrendingUp, AlertTriangle, DollarSign, Activity, Users, Settings, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRegions } from '@/services/mockDataService';
import { NavLink } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { theme } from '@/lib/theme';
import { RegionAnalytics } from '@/components/region/RegionAnalytics';
import { RealTimeMonitor } from '@/components/common/RealTimeMonitor';
import { EnergyForecast } from '@/components/region/EnergyForecast';
import { AlertsManager } from '@/components/region/AlertsManager';
import { TeamManager } from '@/components/region/TeamManager';
import { ExportManager } from '@/components/region/ExportManager';
import { SiteMonitoringGrid } from '@/components/region/SiteMonitoringGrid';

const performanceData = [
  { month: 'Jan', production: 120, efficiency: 85, revenue: 2100000 },
  { month: 'Feb', production: 135, efficiency: 87, revenue: 2350000 },
  { month: 'Mar', production: 158, efficiency: 89, revenue: 2680000 },
  { month: 'Apr', production: 162, efficiency: 91, revenue: 2850000 },
  { month: 'May', production: 178, efficiency: 88, revenue: 3100000 },
  { month: 'Jun', production: 195, efficiency: 92, revenue: 3450000 },
];

const siteStatusData = [
  { name: 'Online', value: 85, color: '#10b981' },
  { name: 'Maintenance', value: 12, color: '#f59e0b' },
  { name: 'Offline', value: 3, color: '#ef4444' },
];

const RegionOverview: React.FC = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const [timeFilter, setTimeFilter] = useState('6m');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  const region = mockRegions.find(r => r.id === regionId);

  if (!region) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${theme.colors.text.primary} mb-2`}>Region Not Found</h2>
          <p className={theme.colors.text.muted}>The requested region could not be found.</p>
        </div>
      </div>
    );
  }

  const totalCapacity = region.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
  const onlineSites = region.sites.filter(site => site.status === 'online').length;
  const maintenanceSites = region.sites.filter(site => site.status === 'maintenance').length;
  const offlineSites = region.sites.filter(site => site.status === 'offline').length;
  const overallEfficiency = 89.5;
  const monthlyRevenue = 2450000;

  const filteredSites = statusFilter === 'all' 
    ? region.sites 
    : region.sites.filter(site => site.status === statusFilter);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${theme.colors.text.primary} flex items-center gap-3`}>
              <MapPin className="w-8 h-8 text-emerald-400" />
              {region.name} Region
            </h1>
            <p className={`${theme.colors.text.muted} mt-2`}>
              Managing {region.sites.length} energy sites with {totalCapacity}MW total capacity
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {onlineSites} Online
              </Badge>
              {maintenanceSites > 0 && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {maintenanceSites} Maintenance
                </Badge>
              )}
              {offlineSites > 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {offlineSites} Offline
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className={`w-32 ${theme.colors.background.card} ${theme.colors.border.primary} ${theme.colors.text.primary}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
                  <SelectItem value="1m" className={theme.colors.text.primary}>1 Month</SelectItem>
                  <SelectItem value="3m" className={theme.colors.text.primary}>3 Months</SelectItem>
                  <SelectItem value="6m" className={theme.colors.text.primary}>6 Months</SelectItem>
                  <SelectItem value="1y" className={theme.colors.text.primary}>1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.colors.text.secondary}`}>Total Capacity</CardTitle>
              <Zap className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.colors.text.primary}`}>{totalCapacity}MW</div>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Across {region.sites.length} sites
              </p>
            </CardContent>
          </Card>

          <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.colors.text.secondary}`}>Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.colors.text.primary}`}>${(monthlyRevenue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-blue-400 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.2% vs last month
              </p>
            </CardContent>
          </Card>

          <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.colors.text.secondary}`}>Efficiency</CardTitle>
              <Activity className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.colors.text.primary}`}>{overallEfficiency}%</div>
              <Progress value={overallEfficiency} className="mt-2 h-2" />
              <p className="text-xs text-amber-400 mt-1">Regional average</p>
            </CardContent>
          </Card>

          <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme.colors.text.secondary}`}>Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme.colors.text.primary}`}>{maintenanceSites + offlineSites}</div>
              <p className="text-xs text-red-400 mt-1">Sites requiring attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-emerald-600">
              Live Sites
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="realtime" className="data-[state=active]:bg-emerald-600">
              Real-time
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-emerald-600">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-emerald-600">
              Team
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-emerald-600">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production Trends */}
              <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
                <CardHeader>
                  <CardTitle className={`text-lg font-semibold ${theme.colors.text.primary}`}>Production Trends</CardTitle>
                  <CardDescription className={theme.colors.text.muted}>Monthly energy production for the region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Site Status Distribution */}
              <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
                <CardHeader>
                  <CardTitle className={`text-lg font-semibold ${theme.colors.text.primary}`}>Site Status Distribution</CardTitle>
                  <CardDescription className={theme.colors.text.muted}>Current status of all sites in the region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={siteStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {siteStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {siteStatusData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className={`text-sm ${theme.colors.text.secondary}`}>{item.name}</span>
                        </div>
                        <span className={`font-medium ${theme.colors.text.primary}`}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sites Overview */}
            <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-lg font-semibold ${theme.colors.text.primary}`}>Sites in {region.name}</CardTitle>
                    <CardDescription className={theme.colors.text.muted}>Overview of all energy sites in this region</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className={`w-40 ${theme.colors.background.card} ${theme.colors.border.primary} ${theme.colors.text.primary}`}>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
                        <SelectItem value="all" className={theme.colors.text.primary}>All Sites</SelectItem>
                        <SelectItem value="online" className={theme.colors.text.primary}>Online Only</SelectItem>
                        <SelectItem value="maintenance" className={theme.colors.text.primary}>Maintenance</SelectItem>
                        <SelectItem value="offline" className={theme.colors.text.primary}>Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSites.map((site) => (
                    <Card key={site.id} className={`${theme.colors.background.card} ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-300 hover:scale-105`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-base font-medium ${theme.colors.text.primary}`}>{site.name}</CardTitle>
                          <div className={`w-3 h-3 rounded-full ${
                            site.status === 'online' ? 'bg-emerald-400' :
                            site.status === 'maintenance' ? 'bg-amber-400' : 
                            'bg-red-400'
                          }`} />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className={theme.colors.text.muted}>Capacity:</span>
                            <span className={`font-medium ${theme.colors.text.primary}`}>{site.totalCapacity}MW</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={theme.colors.text.muted}>Output:</span>
                            <span className={`font-medium ${theme.colors.text.primary}`}>{site.currentOutput}kW</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={theme.colors.text.muted}>Efficiency:</span>
                            <span className={`font-medium ${theme.colors.text.primary}`}>{site.efficiency}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={theme.colors.text.muted}>Status:</span>
                            <Badge 
                              className={
                                site.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                site.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                              }
                            >
                              {site.status}
                            </Badge>
                          </div>
                          <div className="pt-2 flex gap-2">
                            <Button asChild variant="outline" size="sm" className={`flex-1 ${theme.colors.border.primary} ${theme.colors.text.primary} hover:bg-slate-800`}>
                              <NavLink to={`/site/${site.id}`}>
                                View Details
                              </NavLink>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 mt-6">
            <SiteMonitoringGrid />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <RegionAnalytics />
            <EnergyForecast />
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6 mt-6">
            <RealTimeMonitor />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6 mt-6">
            <AlertsManager />
          </TabsContent>

          <TabsContent value="team" className="space-y-6 mt-6">
            <TeamManager />
          </TabsContent>

          <TabsContent value="export" className="space-y-6 mt-6">
            <ExportManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RegionOverview;
