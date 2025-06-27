
import React, { useState } from 'react';
import { TrendingUp, Zap, DollarSign, Activity, MapPin, Filter, Download, Calendar, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { KPICard } from '@/components/analytics/KPICard';
import { AnalyticsToolbar } from '@/components/analytics/AnalyticsToolbar';
import { ChartCard } from '@/components/analytics/ChartCard';

const energyData = [
  { name: 'Jan', production: 850, consumption: 720, revenue: 125000, efficiency: 85 },
  { name: 'Feb', production: 920, consumption: 780, revenue: 135000, efficiency: 87 },
  { name: 'Mar', production: 1100, consumption: 890, revenue: 162000, efficiency: 89 },
  { name: 'Apr', production: 1250, consumption: 980, revenue: 184000, efficiency: 88 },
  { name: 'May', production: 1350, consumption: 1050, revenue: 198000, efficiency: 91 },
  { name: 'Jun', production: 1420, consumption: 1120, revenue: 208000, efficiency: 92 },
];

const regionData = [
  { name: 'North America', value: 45, color: '#10b981', production: 645 },
  { name: 'Europe', value: 30, color: '#3b82f6', production: 426 },
  { name: 'Asia Pacific', value: 25, color: '#f59e0b', production: 349 },
];

const performanceData = [
  { month: 'Jan', target: 800, actual: 850, efficiency: 85 },
  { month: 'Feb', target: 850, actual: 920, efficiency: 87 },
  { month: 'Mar', target: 900, actual: 1100, efficiency: 89 },
  { month: 'Apr', target: 950, actual: 1250, efficiency: 88 },
  { month: 'May', target: 1000, actual: 1350, efficiency: 91 },
  { month: 'Jun', target: 1050, actual: 1420, efficiency: 92 },
];

// Additional widgets for better space utilization
const PerformanceMetrics = () => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Performance Metrics
        </CardTitle>
        <CardDescription className="text-slate-400">
          Key performance indicators and trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Peak Performance</span>
            <span className="text-lg font-bold text-emerald-400">98.5%</span>
          </div>
          <Progress value={98.5} className="h-3" />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Monthly Target</span>
            <span className="text-lg font-bold text-blue-400">112%</span>
          </div>
          <Progress value={100} className="h-3" />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Cost Efficiency</span>
            <span className="text-lg font-bold text-purple-400">94.2%</span>
          </div>
          <Progress value={94} className="h-3" />
        </div>
        
        <div className="pt-4 border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-400">2.4M</p>
              <p className="text-xs text-slate-400">Total MWh</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">$1.2M</p>
              <p className="text-xs text-slate-400">Revenue</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RegionalBreakdown = () => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
          <MapPin className="w-6 h-6 text-violet-400" />
          Regional Breakdown
        </CardTitle>
        <CardDescription className="text-slate-400">
          Production distribution across regions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {regionData.map((region, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-sm text-slate-300">{region.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">{region.production} MW</span>
                <p className="text-xs text-slate-400">{region.value}%</p>
              </div>
            </div>
            <Progress value={region.value} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const EfficiencyTrends = () => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
          <Activity className="w-6 h-6 text-yellow-400" />
          Efficiency Trends
        </CardTitle>
        <CardDescription className="text-slate-400">
          System efficiency over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f1f5f9'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const totalProduction = energyData.reduce((sum, item) => sum + item.production, 0);
  const totalRevenue = energyData.reduce((sum, item) => sum + item.revenue, 0);
  const avgEfficiency = 87.5;
  const totalSites = 12;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 w-full">
      <div className="p-6 space-y-6 max-w-full">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 shadow-lg">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-lg text-slate-400">
                  Comprehensive energy performance analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Live Data</Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-600">
                Q2 2024
              </Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-600">
                Updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-blue-600 hover:border-blue-500 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${
                isRefreshing ? 'animate-spin' : ''
              }`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30"
            >
              Financial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Production"
                value={`${totalProduction.toLocaleString()} MWh`}
                change="+12.5% from last quarter"
                icon={Zap}
                color="text-emerald-400"
                trend="up"
              />
              <KPICard
                title="Total Revenue"
                value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
                change="+8.3% from last quarter"
                icon={DollarSign}
                color="text-blue-400"
                trend="up"
              />
              <KPICard
                title="Avg Efficiency"
                value={`${avgEfficiency}%`}
                change="Above industry standard"
                icon={Activity}
                color="text-amber-400"
                trend="up"
              />
              <KPICard
                title="Active Sites"
                value={totalSites.toString()}
                change="Across 3 regions"
                icon={MapPin}
                color="text-purple-400"
                trend="up"
              />
            </div>

            {/* Main Charts Row - 2 column layout for larger charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="h-96">
                <ChartCard
                  title="Energy Production Trends"
                  description="Monthly production and consumption patterns"
                >
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }} 
                      />
                      <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} />
                      <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <div className="h-96">
                <ChartCard
                  title="Regional Distribution"
                  description="Energy production by region"
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {regionData.map((region, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: region.color }}
                        />
                        <span className="text-sm text-slate-300">{region.name}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>

            {/* Secondary Row - 3 column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-80">
                <PerformanceMetrics />
              </div>
              <div className="h-80">
                <RegionalBreakdown />
              </div>
              <div className="h-80">
                <EfficiencyTrends />
              </div>
            </div>

            {/* Revenue Chart - Full Width */}
            <div className="h-96">
              <ChartCard
                title="Revenue Analysis"
                description="Monthly revenue performance"
              >
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                      formatter={(value) => `$${Number(value).toLocaleString()}`}
                    />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="h-96">
                <ChartCard
                  title="Target vs Actual Performance"
                  description="Monthly performance against targets"
                >
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }} 
                      />
                      <Bar dataKey="target" fill="#64748b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              
              <div className="h-96">
                <ChartCard
                  title="Efficiency Timeline"
                  description="System efficiency trends over time"
                >
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="h-96">
                <ChartCard
                  title="Revenue Trends"
                  description="Monthly revenue growth"
                >
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                        formatter={(value) => `$${Number(value).toLocaleString()}`}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              
              <div className="h-96">
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-green-400" />
                      Financial Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">$1.2M</p>
                        <p className="text-sm text-slate-400">Total Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">$0.08</p>
                        <p className="text-sm text-slate-400">Cost per kWh</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">22%</p>
                        <p className="text-sm text-slate-400">Profit Margin</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-400">4.2</p>
                        <p className="text-sm text-slate-400">ROI Years</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
