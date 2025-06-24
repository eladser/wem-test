
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Activity, BarChart3, Target, Clock, AlertCircle } from 'lucide-react';
import { theme } from '@/lib/theme';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
}

interface ChartData {
  time: string;
  efficiency: number;
  output: number;
  availability: number;
  temperature: number;
}

const mockPerformanceData: PerformanceMetric[] = [
  { id: 'efficiency', name: 'Overall Efficiency', value: 89.5, unit: '%', change: 2.3, trend: 'up', target: 85 },
  { id: 'availability', name: 'System Availability', value: 98.7, unit: '%', change: -0.2, trend: 'down', target: 99 },
  { id: 'capacity', name: 'Capacity Utilization', value: 76.2, unit: '%', change: 4.1, trend: 'up', target: 80 },
  { id: 'mtbf', name: 'Mean Time Between Failures', value: 2847, unit: 'hrs', change: 156, trend: 'up', target: 2500 }
];

const mockChartData: ChartData[] = [
  { time: '00:00', efficiency: 88, output: 1200, availability: 99, temperature: 22 },
  { time: '04:00', efficiency: 86, output: 1100, availability: 98, temperature: 24 },
  { time: '08:00', efficiency: 91, output: 1400, availability: 99, temperature: 28 },
  { time: '12:00', efficiency: 94, output: 1600, availability: 99, temperature: 32 },
  { time: '16:00', efficiency: 92, output: 1500, availability: 98, temperature: 30 },
  { time: '20:00', efficiency: 89, output: 1300, availability: 99, temperature: 26 }
];

const pieData = [
  { name: 'Solar', value: 45, color: '#f59e0b' },
  { name: 'Wind', value: 30, color: '#10b981' },
  { name: 'Hydro', value: 15, color: '#3b82f6' },
  { name: 'Battery', value: 10, color: '#8b5cf6' }
];

export const SitePerformanceAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<string>('efficiency');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <CardTitle className={theme.colors.text.primary}>Performance Analytics</CardTitle>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Real-time
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-24 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPerformanceData.map((metric) => (
            <Card key={metric.id} className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs ${theme.colors.text.muted}`}>{metric.name}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${theme.colors.text.primary}`}>
                    {metric.value.toFixed(1)}
                  </span>
                  <span className={`text-sm ${theme.colors.text.muted}`}>{metric.unit}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${getChangeColor(metric.change)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                  </span>
                  {metric.target && (
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-blue-400" />
                      <span className={`text-xs ${theme.colors.text.muted}`}>{metric.target}{metric.unit}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Trends Chart */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-lg ${theme.colors.text.primary}`}>Performance Trends</CardTitle>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                  <SelectItem value="output">Output</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Energy Mix and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className={`text-lg ${theme.colors.text.primary}`}>Energy Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={`text-sm ${theme.colors.text.muted}`}>
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className={`text-lg ${theme.colors.text.primary} flex items-center gap-2`}>
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Performance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className={`text-sm ${theme.colors.text.primary}`}>High Temperature Alert</span>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className={`text-sm ${theme.colors.text.primary}`}>Efficiency Drop Detected</span>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Critical
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className={`text-sm ${theme.colors.text.primary}`}>Performance Optimized</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Resolved
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
