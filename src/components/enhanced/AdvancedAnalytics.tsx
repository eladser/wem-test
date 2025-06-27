import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, Zap, DollarSign, Leaf, AlertTriangle,
  Activity, Target, Gauge, ArrowUpRight, ArrowDownRight, Timer,
  Brain, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Download, Share2, RefreshCw, Calendar, Filter
} from 'lucide-react';

interface EnergyMetrics {
  timestamp: string;
  totalConsumption: number;
  solarGeneration: number;
  gridConsumption: number;
  batteryLevel: number;
  efficiency: number;
  cost: number;
  carbonFootprint: number;
  peakDemand: number;
  averageLoad: number;
}

interface PredictionData {
  period: string;
  predictedConsumption: number;
  confidence: number;
  factors: string[];
}

interface OptimizationInsight {
  id: string;
  type: 'efficiency' | 'cost' | 'carbon' | 'maintenance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  savings: number;
  timeframe: string;
  actionRequired: boolean;
}

const AdvancedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'consumption' | 'generation' | 'efficiency' | 'cost'>('consumption');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data - in production, this would come from your backend
  const mockEnergyData: EnergyMetrics[] = useMemo(() => {
    const now = new Date();
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        totalConsumption: 450 + Math.random() * 200 - Math.sin(i * 0.5) * 50,
        solarGeneration: Math.max(0, 200 + Math.sin(i * 0.3) * 150 - (i > 18 || i < 6 ? 180 : 0)),
        gridConsumption: 200 + Math.random() * 150,
        batteryLevel: 60 + Math.sin(i * 0.2) * 30,
        efficiency: 85 + Math.random() * 15,
        cost: (450 + Math.random() * 200) * 0.12,
        carbonFootprint: (450 + Math.random() * 200) * 0.4,
        peakDemand: 600 + Math.random() * 100,
        averageLoad: 350 + Math.random() * 100
      });
    }
    
    return data;
  }, [timeRange]);

  const predictiveData: PredictionData[] = [
    {
      period: 'Next Hour',
      predictedConsumption: 485,
      confidence: 92,
      factors: ['Historical patterns', 'Weather forecast', 'Scheduled loads']
    },
    {
      period: 'Next 4 Hours',
      predictedConsumption: 520,
      confidence: 87,
      factors: ['Peak demand period', 'Solar generation decline', 'HVAC load increase']
    },
    {
      period: 'Tomorrow',
      predictedConsumption: 12500,
      confidence: 78,
      factors: ['Weather forecast', 'Day-of-week patterns', 'Maintenance schedule']
    }
  ];

  const optimizationInsights: OptimizationInsight[] = [
    {
      id: '1',
      type: 'efficiency',
      title: 'HVAC Schedule Optimization',
      description: 'Adjusting HVAC schedules could reduce consumption by 12% during peak hours',
      impact: 'high',
      savings: 2400,
      timeframe: 'Monthly',
      actionRequired: true
    },
    {
      id: '2',
      type: 'cost',
      title: 'Load Shifting Opportunity',
      description: 'Shifting 15% of non-critical loads to off-peak hours could save $180/month',
      impact: 'medium',
      savings: 180,
      timeframe: 'Monthly',
      actionRequired: false
    },
    {
      id: '3',
      type: 'carbon',
      title: 'Battery Storage Optimization',
      description: 'Better battery charging strategy could reduce carbon footprint by 8%',
      impact: 'medium',
      savings: 340,
      timeframe: 'Monthly',
      actionRequired: true
    },
    {
      id: '4',
      type: 'maintenance',
      title: 'Solar Panel Cleaning',
      description: 'Panel efficiency dropped 3% - cleaning recommended',
      impact: 'low',
      savings: 85,
      timeframe: 'One-time',
      actionRequired: true
    }
  ];

  const kpiData = useMemo(() => {
    const latestData = mockEnergyData[mockEnergyData.length - 1];
    const previousData = mockEnergyData[mockEnergyData.length - 2];
    
    return [
      {
        title: 'Total Consumption',
        value: `${latestData.totalConsumption.toFixed(0)} kWh`,
        change: ((latestData.totalConsumption - previousData.totalConsumption) / previousData.totalConsumption * 100).toFixed(1),
        icon: Zap,
        color: 'blue'
      },
      {
        title: 'Energy Cost',
        value: `$${latestData.cost.toFixed(2)}`,
        change: ((latestData.cost - previousData.cost) / previousData.cost * 100).toFixed(1),
        icon: DollarSign,
        color: 'green'
      },
      {
        title: 'Efficiency Score',
        value: `${latestData.efficiency.toFixed(1)}%`,
        change: ((latestData.efficiency - previousData.efficiency) / previousData.efficiency * 100).toFixed(1),
        icon: Target,
        color: 'purple'
      },
      {
        title: 'Carbon Footprint',
        value: `${latestData.carbonFootprint.toFixed(0)} kg`,
        change: ((latestData.carbonFootprint - previousData.carbonFootprint) / previousData.carbonFootprint * 100).toFixed(1),
        icon: Leaf,
        color: 'emerald'
      }
    ];
  }, [mockEnergyData]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const getChartData = () => {
    return mockEnergyData.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      consumption: item.totalConsumption,
      generation: item.solarGeneration,
      efficiency: item.efficiency,
      cost: item.cost
    }));
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'efficiency': return 'bg-blue-50 border-blue-200';
      case 'cost': return 'bg-green-50 border-green-200';
      case 'carbon': return 'bg-emerald-50 border-emerald-200';
      case 'maintenance': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return variants[impact as keyof typeof variants] || variants.low;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Advanced Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Intelligent insights and predictive analytics for energy optimization
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = parseFloat(kpi.change) > 0;
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 text-${kpi.color}-600`} />
                  <Badge 
                    variant={isPositive ? "destructive" : "default"}
                    className="text-xs"
                  >
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {Math.abs(parseFloat(kpi.change))}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics */}
      <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="consumption" className="text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Consumption
            </TabsTrigger>
            <TabsTrigger value="generation" className="text-xs sm:text-sm">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Generation
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="text-xs sm:text-sm">
              <Gauge className="h-4 w-4 mr-2" />
              Efficiency
            </TabsTrigger>
            <TabsTrigger value="cost" className="text-xs sm:text-sm">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Cost Analysis
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button 
              variant={timeRange === '24h' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('24h')}
            >
              24H
            </Button>
            <Button 
              variant={timeRange === '7d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7D
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30D
            </Button>
            <Button 
              variant={timeRange === '1y' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('1y')}
            >
              1Y
            </Button>
          </div>
        </div>

        <TabsContent value="consumption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Trends</CardTitle>
              <CardDescription>
                Real-time and historical consumption patterns with trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="consumption" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    stroke="#3b82f6"
                    name="Total Consumption (kWh)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="generation" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Solar Generation (kWh)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation vs Consumption Analysis</CardTitle>
              <CardDescription>
                Solar generation efficiency and grid dependency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="generation" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981"
                    name="Solar Generation"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="consumption" 
                    stackId="2" 
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Total Consumption"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Efficiency Monitoring</CardTitle>
              <CardDescription>
                Track overall system performance and identify optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    name="Efficiency Score (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis & Projections</CardTitle>
              <CardDescription>
                Detailed cost breakdown and savings opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="cost" 
                    fill="#f59e0b" 
                    name="Hourly Cost ($)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Predictive Analytics & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-600" />
              Predictive Analytics
            </CardTitle>
            <CardDescription>
              AI-powered consumption forecasts with confidence intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictiveData.map((prediction, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{prediction.period}</h4>
                  <Badge variant="secondary">{prediction.confidence}% confidence</Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {prediction.predictedConsumption} kWh
                </p>
                <Progress value={prediction.confidence} className="mb-3" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Key factors:</p>
                  {prediction.factors.map((factor, idx) => (
                    <p key={idx} className="text-xs text-gray-600">• {factor}</p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optimization Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Optimization Insights
            </CardTitle>
            <CardDescription>
              Actionable recommendations to improve efficiency and reduce costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimizationInsights.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <div className="flex gap-2">
                    <Badge className={getImpactBadge(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                    {insight.actionRequired && (
                      <Badge variant="destructive">Action Required</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-semibold text-green-600">
                      ${insight.savings} savings
                    </span>
                    <span className="text-gray-500 ml-1">({insight.timeframe})</span>
                  </div>
                  {insight.actionRequired && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Smart Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Peak demand alert:</strong> Consumption is expected to exceed optimal levels between 2-4 PM. 
              Consider shifting non-essential loads to reduce costs by up to $25.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Leaf className="h-4 w-4" />
            <AlertDescription>
              <strong>Green energy opportunity:</strong> High solar generation predicted for next 3 hours. 
              This is an optimal time for energy-intensive tasks.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              <strong>Efficiency notice:</strong> System efficiency dropped 2% over the last week. 
              Schedule maintenance check to prevent further degradation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;