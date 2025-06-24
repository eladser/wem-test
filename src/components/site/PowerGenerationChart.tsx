
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PowerData {
  time: string;
  solar: number;
  battery: number;
  grid: number;
}

interface PowerGenerationChartProps {
  siteName: string;
  powerData: PowerData[];
}

export const PowerGenerationChart: React.FC<PowerGenerationChartProps> = React.memo(({ siteName, powerData }) => {
  return (
    <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-left">
      <CardHeader>
        <CardTitle className="text-white">Power Generation</CardTitle>
        <CardDescription className="text-slate-400">
          Real-time power output from {siteName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={powerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="solar" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                className="animate-fade-in"
              />
              <Area 
                type="monotone" 
                dataKey="battery" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                className="animate-fade-in"
              />
              <Area 
                type="monotone" 
                dataKey="grid" 
                stackId="1" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.6}
                className="animate-fade-in"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

PowerGenerationChart.displayName = 'PowerGenerationChart';
