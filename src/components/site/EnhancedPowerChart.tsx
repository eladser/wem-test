
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Maximize2, Download } from "lucide-react";
import { PowerData } from "@/types/energy";

interface EnhancedPowerChartProps {
  siteName: string;
  powerData: PowerData[];
}

export const EnhancedPowerChart: React.FC<EnhancedPowerChartProps> = ({ siteName, powerData }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl backdrop-blur-sm">
          <p className="font-semibold text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize text-slate-300">{entry.dataKey}:</span>
              <span className="font-semibold text-white">{entry.value}kW</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Power Generation
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              Real-time power output for {siteName}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
              Live Data
            </Badge>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-slate-800 border-slate-600 hover:bg-slate-700">
              <Download className="w-4 h-4 text-slate-300" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-slate-800 border-slate-600 hover:bg-slate-700">
              <Maximize2 className="w-4 h-4 text-slate-300" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={powerData}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="solar"
                stackId="1"
                stroke="#10b981"
                fill="url(#solarGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="battery"
                stackId="1"
                stroke="#3b82f6"
                fill="url(#batteryGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="grid"
                stackId="1"
                stroke="#f59e0b"
                fill="url(#gridGradient)"
                strokeWidth={2}
              />
              
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#ef4444"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-slate-300">Solar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-slate-300">Battery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-slate-300">Grid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-red-500 rounded-full" />
            <span className="text-slate-300">Demand</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
