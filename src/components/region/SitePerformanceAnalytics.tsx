import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3 } from 'lucide-react';
import { theme } from '@/lib/theme';
import { PerformanceMetricCard } from './PerformanceMetricCard';
import { PerformanceTrendsChart } from './PerformanceTrendsChart';
import { EnergyMixPieChart } from './EnergyMixPieChart';
import { PerformanceAlertsPanel } from './PerformanceAlertsPanel';

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
            <PerformanceMetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Performance Trends Chart */}
        <PerformanceTrendsChart
          data={mockChartData}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />

        {/* Energy Mix and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnergyMixPieChart data={pieData} />
          <PerformanceAlertsPanel />
        </div>
      </CardContent>
    </Card>
  );
};
