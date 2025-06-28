import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  Zap, 
  Battery, 
  Sun, 
  Wind, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Download,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { useAdvancedPerformance } from '@/hooks/useAdvancedPerformance';
import { realTimeDataService } from '@/services/realTimeDataService';

interface GridAnalyticsProps {
  components: any[];
  energyFlows: any[];
  className?: string;
}

interface EnergyFlowData {
  timestamp: string;
  solarGeneration: number;
  batteryCharge: number;
  gridConsumption: number;
  totalLoad: number;
  efficiency: number;
}

interface ComponentHealth {
  id: string;
  name: string;
  type: string;
  health: number;
  status: 'optimal' | 'warning' | 'critical';
  lastMaintenance: string;
  nextMaintenance: string;
  efficiency: number;
  powerOutput: number;
}

const COLORS = {
  solar: '#F59E0B',
  battery: '#10B981',
  grid: '#3B82F6',
  load: '#EF4444',
  efficiency: '#8B5CF6'
};

export function GridAnalytics({ components, energyFlows, className }: GridAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { performance, systemHealth } = useAdvancedPerformance();

  // Generate mock historical data based on current components
  const historicalData = useMemo((): EnergyFlowData[] => {
    const hours = selectedTimeRange === '1h' ? 1 : 
                  selectedTimeRange === '6h' ? 6 : 
                  selectedTimeRange === '24h' ? 24 : 168;
    
    const dataPoints = Math.min(hours, 50); // Limit data points for performance
    const data: EnergyFlowData[] = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const time = new Date(Date.now() - (hours - i) * 60 * 60 * 1000);
      const hour = time.getHours();
      
      // Simulate solar generation pattern
      const solarMultiplier = hour >= 6 && hour <= 18 ? 
        Math.sin(((hour - 6) / 12) * Math.PI) : 0;
      
      data.push({
        timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        solarGeneration: Math.round(solarMultiplier * 100 + Math.random() * 20),
        batteryCharge: Math.round(60 + Math.random() * 40),
        gridConsumption: Math.round(30 + Math.random() * 50),
        totalLoad: Math.round(80 + Math.random() * 40),
        efficiency: Math.round(85 + Math.random() * 15)
      });
    }
    
    return data;
  }, [selectedTimeRange]);

  // Component health analysis
  const componentHealth = useMemo((): ComponentHealth[] => {
    return components.map(comp => {
      const baseHealth = 75 + Math.random() * 25;
      const efficiency = Math.max(0, comp.power / (comp.capacity || 100)) * 100;
      
      return {
        id: comp.id,
        name: comp.name,
        type: comp.type,
        health: Math.round(baseHealth),
        status: baseHealth > 90 ? 'optimal' : baseHealth > 70 ? 'warning' : 'critical',
        lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
          .toLocaleDateString(),
        nextMaintenance: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000)
          .toLocaleDateString(),
        efficiency: Math.round(efficiency),
        powerOutput: Math.abs(comp.power)
      };
    });
  }, [components]);

  // Efficiency distribution for pie chart
  const efficiencyDistribution = useMemo(() => {
    const optimal = componentHealth.filter(c => c.status === 'optimal').length;
    const warning = componentHealth.filter(c => c.status === 'warning').length;
    const critical = componentHealth.filter(c => c.status === 'critical').length;
    
    return [
      { name: 'Optimal', value: optimal, color: '#10B981' },
      { name: 'Warning', value: warning, color: '#F59E0B' },
      { name: 'Critical', value: critical, color: '#EF4444' }
    ].filter(item => item.value > 0);
  }, [componentHealth]);

  // Power distribution for radial chart
  const powerDistribution = useMemo(() => {
    const total = components.reduce((sum, comp) => sum + Math.abs(comp.power), 0);
    
    return components.map(comp => ({
      name: comp.name,
      value: Math.abs(comp.power),
      percentage: Math.round((Math.abs(comp.power) / total) * 100),
      fill: comp.power > 0 ? '#10B981' : '#EF4444'
    }));
  }, [components]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would fetch fresh data here
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleExportData = useCallback(async () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        timeRange: selectedTimeRange,
        historicalData,
        componentHealth,
        systemMetrics: {
          performance,
          systemHealth
        }
      };

      const blob = await realTimeDataService.exportData({
        format: 'json',
        dateRange: {
          start: new Date(Date.now() - 24 * 60 * 60 * 1000),
          end: new Date()
        },
        sites: ['current'],
        dataTypes: ['metrics'],
        includeCharts: false,
        compression: false
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grid-analytics-${selectedTimeRange}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [selectedTimeRange, historicalData, componentHealth, performance, systemHealth]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">Grid Analytics</h3>
          <div className="flex space-x-2">
            {(['1h', '6h', '24h', '7d'] as const).map(range => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="energy-flow">Energy Flow</TabsTrigger>
          <TabsTrigger value="component-health">Component Health</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Generation</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {components.filter(c => c.power > 0).reduce((sum, c) => sum + c.power, 0)}kW
                    </p>
                  </div>
                  <Sun className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Consumption</p>
                    <p className="text-2xl font-bold text-red-400">
                      {Math.abs(components.filter(c => c.power < 0).reduce((sum, c) => sum + c.power, 0))}kW
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">System Efficiency</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {Math.round(historicalData[historicalData.length - 1]?.efficiency || 0)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Components</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {components.filter(c => c.status === 'active').length}/{components.length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Component Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={efficiencyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {efficiencyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Power Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={powerDistribution}>
                    <RadialBar dataKey="percentage" cornerRadius={4} fill="#8884d8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Energy Flow Tab */}
        <TabsContent value="energy-flow" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Energy Flow Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="solarGeneration" 
                    stackId="1" 
                    stroke={COLORS.solar} 
                    fill={COLORS.solar}
                    name="Solar Generation (kW)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="batteryCharge" 
                    stackId="2" 
                    stroke={COLORS.battery} 
                    fill={COLORS.battery}
                    name="Battery Charge (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Efficiency Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[60, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke={COLORS.efficiency} 
                    strokeWidth={2}
                    name="Efficiency (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Component Health Tab */}
        <TabsContent value="component-health" className="space-y-4">
          <div className="grid gap-4">
            {componentHealth.map(component => (
              <Card 
                key={component.id} 
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:bg-slate-700/50 ${
                  selectedComponent === component.id ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setSelectedComponent(
                  selectedComponent === component.id ? null : component.id
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {component.type === 'solar' && <Sun className="w-6 h-6 text-yellow-500" />}
                      {component.type === 'battery' && <Battery className="w-6 h-6 text-green-500" />}
                      {component.type === 'generator' && <Zap className="w-6 h-6 text-blue-500" />}
                      {component.type === 'grid' && <Activity className="w-6 h-6 text-purple-500" />}
                      {component.type === 'load' && <TrendingUp className="w-6 h-6 text-red-500" />}
                      
                      <div>
                        <h4 className="text-white font-medium">{component.name}</h4>
                        <p className="text-sm text-slate-400">{component.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Health</p>
                        <p className="text-lg font-bold text-white">{component.health}%</p>
                      </div>
                      
                      <Badge 
                        variant={
                          component.status === 'optimal' ? 'default' :
                          component.status === 'warning' ? 'secondary' : 'destructive'
                        }
                        className={
                          component.status === 'optimal' ? 'bg-green-500/20 text-green-400' :
                          component.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }
                      >
                        {component.status === 'optimal' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {component.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {component.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {selectedComponent === component.id && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Power Output</p>
                          <p className="text-white font-medium">{component.powerOutput}kW</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Efficiency</p>
                          <p className="text-white font-medium">{component.efficiency}%</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Last Maintenance</p>
                          <p className="text-white font-medium">{component.lastMaintenance}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Next Maintenance</p>
                          <p className="text-white font-medium">{component.nextMaintenance}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Overall Health</span>
                  <Badge variant="secondary" className={
                    systemHealth.overall === 'excellent' ? 'bg-green-500/20 text-green-400' :
                    systemHealth.overall === 'good' ? 'bg-blue-500/20 text-blue-400' :
                    systemHealth.overall === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }>
                    {systemHealth.overall}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(systemHealth.scores).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white">{value}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            value > 90 ? 'bg-green-500' :
                            value > 75 ? 'bg-blue-500' :
                            value > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemHealth.recommendations.length > 0 ? (
                    systemHealth.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-slate-300">{recommendation}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      System is performing optimally
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Real-time Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-slate-400">Render Time</p>
                  <p className="text-2xl font-bold text-white">{Math.round(performance.renderTime)}ms</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Load Time</p>
                  <p className="text-2xl font-bold text-white">{Math.round(performance.loadTime)}ms</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Memory Usage</p>
                  <p className="text-2xl font-bold text-white">{Math.round(performance.memoryUsage * 100)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Error Rate</p>
                  <p className="text-2xl font-bold text-white">{performance.errorRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}