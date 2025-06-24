
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface EnergyMixData {
  name: string;
  value: number;
  color: string;
}

interface EnergyMixChartProps {
  siteName: string;
  energyMix: EnergyMixData[];
}

export const EnergyMixChart: React.FC<EnergyMixChartProps> = React.memo(({ siteName, energyMix }) => {
  return (
    <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-right">
      <CardHeader>
        <CardTitle className="text-white">Energy Mix</CardTitle>
        <CardDescription className="text-slate-400">
          Current distribution for {siteName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={energyMix}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                className="animate-scale-in"
              >
                {energyMix.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {energyMix.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between hover:bg-slate-800/30 p-2 rounded transition-colors animate-fade-in"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full transition-transform hover:scale-110" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-slate-300 text-sm">{item.name}</span>
              </div>
              <span className="text-white font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

EnergyMixChart.displayName = 'EnergyMixChart';
