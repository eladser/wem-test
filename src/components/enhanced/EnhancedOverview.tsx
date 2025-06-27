import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Battery,
  Sun,
  Wind,
  Home,
  DollarSign,
  Gauge,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  RefreshCw,
  Maximize,
  Filter
} from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { ResponsiveWrapper } from '@/components/common/ResponsiveWrapper';

// Types
interface EnergyMetrics {
  currentPower: number;
  dailyGeneration: number;
  dailyConsumption: number;
  batteryLevel: number;
  gridExport: number;
  gridImport: number;
  efficiency: number;
  carbonSaved: number;
}

interface SiteStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  capacity: number;
  currentOutput: number;
  efficiency: number;
  lastUpdate: Date;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  site?: string;
}

// Generate mock data
const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeLabel = hour.getHours();
    
    // Simulate solar generation pattern
    const solarMultiplier = Math.max(0, Math.sin((timeLabel - 6) * Math.PI / 12));
    const generation = (100 + Math.random() * 50) * solarMultiplier;
    const consumption = 80 + Math.random() * 40;
    
    data.push({
      time: timeLabel,
      generation: Math.round(generation),
      consumption: Math.round(consumption),
      battery: Math.round((generation - consumption) * 0.8),
      grid: Math.round(Math.max(0, consumption - generation))
    });
  }
  
  return data;
};

const generateSiteData = (): SiteStatus[] => [
  {
    id: '1',
    name: 'Solar Farm Alpha',
    status: 'online',
    capacity: 500,
    currentOutput: 420,
    efficiency: 84,
    lastUpdate: new Date()
  },
  {
    id: '2',
    name: 'Wind Park Beta',
    status: 'online',
    capacity: 300,
    currentOutput: 275,
    efficiency: 92,
    lastUpdate: new Date()
  },
  {
    id: '3',
    name: 'Battery Station Gamma',
    status: 'maintenance',
    capacity: 200,
    currentOutput: 0,
    efficiency: 0,
    lastUpdate: new Date(Date.now() - 3600000)
  },
  {
    id: '4',
    name: 'Hybrid Site Delta',
    status: 'online',
    capacity: 400,
    currentOutput: 385,
    efficiency: 96,
    lastUpdate: new Date()
  }
];

const generateAlerts = (): Alert[] => [
  {
    id: '1',
    severity: 'critical',
    message: 'Battery Station Gamma offline for maintenance',
    timestamp: new Date(Date.now() - 1800000),
    site: 'Battery Station Gamma'
  },
  {
    id: '2',
    severity: 'warning',
    message: 'Wind Park Beta efficiency below 95%',
    timestamp: new Date(Date.now() - 3600000),
    site: 'Wind Park Beta'
  },
  {
    id: '3',
    severity: 'info',
    message: 'Solar Farm Alpha performing above expected',
    timestamp: new Date(Date.now() - 7200000),
    site: 'Solar Farm Alpha'
  }
];

// Key Metrics Card Component
const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue' 
}: {
  title: string;
  value: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  color?: string;
}) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    red: 'text-red-500'
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toLocaleString()}
          <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
        </div>
        {trend && trendValue !== undefined && (
          <div className={`text-sm flex items-center gap-1 mt-1 ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            {Math.abs(trendValue).toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Energy Flow Chart
const EnergyFlowChart = ({ data }: { data: any[] }) => {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Energy Flow (24h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => `${value}:00`}
              formatter={(value: number, name: string) => [value + ' kW', name]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="generation" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Generation"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="consumption" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Consumption"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="battery" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Battery"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Site Status Chart
const SiteStatusChart = ({ sites }: { sites: SiteStatus[] }) => {
  const pieData = sites.map(site => ({
    name: site.name,
    value: site.currentOutput,
    status: site.status
  }));
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          Site Output Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value + ' kW', 'Output']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Site Status List
const SiteStatusList = ({ sites }: { sites: SiteStatus[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Site Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sites.map(site => (
          <div key={site.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                site.status === 'online' ? 'bg-green-500' :
                site.status === 'maintenance' ? 'bg-yellow-500' :
                site.status === 'offline' ? 'bg-gray-500' : 'bg-red-500'
              }`} />
              <div>
                <div className="font-medium">{site.name}</div>
                <div className="text-sm text-gray-500">
                  {site.currentOutput}/{site.capacity} kW
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant={
                site.status === 'online' ? 'default' :
                site.status === 'maintenance' ? 'secondary' :
                'destructive'
              }>
                {site.status}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">
                {site.efficiency}% efficiency
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Recent Alerts
const RecentAlerts = ({ alerts }: { alerts: Alert[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            No recent alerts
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                alert.severity === 'critical' ? 'bg-red-500' :
                alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="font-medium text-sm">{alert.message}</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alert.timestamp.toLocaleString()}
                </div>
                {alert.site && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {alert.site}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Performance Summary
const PerformanceSummary = ({ metrics }: { metrics: EnergyMetrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">System Efficiency</span>
            <span className="text-sm">{metrics.efficiency}%</span>
          </div>
          <Progress value={metrics.efficiency} className="h-2" />
        </div>
        
        <Separator />
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Battery Level</span>
            <span className="text-sm">{metrics.batteryLevel}%</span>
          </div>
          <Progress value={metrics.batteryLevel} className="h-2" />
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Carbon Saved</div>
            <div className="font-medium">{metrics.carbonSaved.toFixed(1)} kg</div>
          </div>
          <div>
            <div className="text-gray-500">Grid Export</div>
            <div className="font-medium">{metrics.gridExport} kW</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Enhanced Overview Component
export const EnhancedOverview: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Real-time data
  const { data: realTimeData, isConnected } = useRealTimeData({
    endpoint: 'overview/metrics',
    interval: 5000 // 5 seconds
  });
  
  // Mock data (in real app, this would come from realTimeData)
  const timeSeriesData = useMemo(() => generateTimeSeriesData(), []);
  const siteData = useMemo(() => generateSiteData(), []);
  const alertData = useMemo(() => generateAlerts(), []);
  
  const metrics: EnergyMetrics = useMemo(() => ({
    currentPower: siteData.reduce((sum, site) => sum + site.currentOutput, 0),
    dailyGeneration: 8420,
    dailyConsumption: 7650,
    batteryLevel: 78,
    gridExport: 150,
    gridImport: 45,
    efficiency: 89,
    carbonSaved: 1250.5
  }), [siteData]);
  
  return (
    <ResponsiveWrapper>
      <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : ''}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enhanced Overview</h1>
            <p className="text-gray-500 mt-1">Real-time energy management dashboard</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'} className="gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              {isConnected ? 'Live' : 'Offline'}
            </Badge>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="gap-2"
            >
              <Maximize className="w-4 h-4" />
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Current Power"
            value={metrics.currentPower}
            unit="kW"
            icon={Zap}
            trend="up"
            trendValue={5.2}
            color="blue"
          />
          
          <MetricCard
            title="Daily Generation"
            value={metrics.dailyGeneration}
            unit="kWh"
            icon={Sun}
            trend="up"
            trendValue={12.8}
            color="green"
          />
          
          <MetricCard
            title="Battery Level"
            value={metrics.batteryLevel}
            unit="%"
            icon={Battery}
            trend="neutral"
            trendValue={0}
            color="yellow"
          />
          
          <MetricCard
            title="System Efficiency"
            value={metrics.efficiency}
            unit="%"
            icon={Gauge}
            trend="up"
            trendValue={2.1}
            color="purple"
          />
        </div>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EnergyFlowChart data={timeSeriesData} />
          <SiteStatusChart sites={siteData} />
        </div>
        
        {/* Secondary Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SiteStatusList sites={siteData} />
          <RecentAlerts alerts={alertData} />
          <PerformanceSummary metrics={metrics} />
        </div>
        
        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.dailyConsumption.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 ml-1">kWh</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">-3.2% from yesterday</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Grid Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.gridExport}
                <span className="text-sm font-normal text-gray-500 ml-1">kW</span>
              </div>
              <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +15.7%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.carbonSaved.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
              </div>
              <div className="text-sm text-green-600 mt-1">Today</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,247
                <span className="text-sm font-normal text-gray-500 ml-1">today</span>
              </div>
              <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.3%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default EnhancedOverview;