
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RegionPerformanceChartProps {
  regionData: {
    name: string;
    sites: Array<{
      currentOutput: number;
      totalCapacity: number;
    }>;
  };
}

export const RegionPerformanceChart = ({ regionData }: RegionPerformanceChartProps) => {
  // Generate sample performance data for the last 24 hours
  const performanceData = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const totalCapacity = regionData.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
    const baseOutput = regionData.sites.reduce((sum, site) => sum + site.currentOutput, 0);
    
    // Simulate daily variation (lower at night, peak during day)
    const timeVariation = Math.sin((hour - 6) * Math.PI / 12) * 0.3 + 0.7;
    const randomVariation = Math.random() * 0.2 + 0.9;
    const output = Math.max(0, baseOutput * timeVariation * randomVariation);
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      output: parseFloat(output.toFixed(1)),
      capacity: totalCapacity,
      efficiency: Math.min(100, (output / totalCapacity) * 100)
    };
  });

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          24-Hour Performance Trend
          <span className="text-sm font-normal text-slate-400">({regionData.name})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                label={{ value: 'MW', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: number, name: string) => [
                  `${value} MW`,
                  name === 'output' ? 'Power Output' : 'Capacity'
                ]}
              />
              <Area
                type="monotone"
                dataKey="output"
                stroke="#10B981"
                fill="url(#colorOutput)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke="#6B7280"
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
              />
              <defs>
                <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Peak Output</p>
            <p className="text-white font-semibold">
              {Math.max(...performanceData.map(d => d.output)).toFixed(1)} MW
            </p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Avg Efficiency</p>
            <p className="text-white font-semibold">
              {(performanceData.reduce((sum, d) => sum + d.efficiency, 0) / performanceData.length).toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Total Energy</p>
            <p className="text-white font-semibold">
              {(performanceData.reduce((sum, d) => sum + d.output, 0)).toFixed(0)} MWh
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
