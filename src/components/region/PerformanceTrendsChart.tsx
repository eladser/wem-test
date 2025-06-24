
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theme } from '@/lib/theme';

interface ChartData {
  time: string;
  efficiency: number;
  output: number;
  availability: number;
  temperature: number;
}

interface PerformanceTrendsChartProps {
  data: ChartData[];
  selectedMetric: string;
  onMetricChange: (value: string) => void;
}

export const PerformanceTrendsChart: React.FC<PerformanceTrendsChartProps> = ({
  data,
  selectedMetric,
  onMetricChange,
}) => {
  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${theme.colors.text.primary}`}>Performance Trends</CardTitle>
          <Select value={selectedMetric} onValueChange={onMetricChange}>
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
            <AreaChart data={data}>
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
  );
};
