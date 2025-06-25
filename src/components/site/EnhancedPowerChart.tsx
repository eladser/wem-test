
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BarChart3, TrendingUp, Maximize2, Download, RefreshCw } from "lucide-react";

interface PowerData {
  time: string;
  solar: number;
  battery: number;
  grid: number;
  demand: number;
}

interface EnhancedPowerChartProps {
  siteName: string;
  powerData: PowerData[];
}

export const EnhancedPowerChart: React.FC<EnhancedPowerChartProps> = ({ siteName, powerData }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const currentTotal = powerData[powerData.length - 1];
  const totalGeneration = currentTotal ? currentTotal.solar + currentTotal.battery + currentTotal.grid : 0;

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-emerald-500/30 transition-all duration-500 group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors duration-300">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Power Generation
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Real-time energy output from {siteName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2" />
              Live Data
            </Badge>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20 h-8 bg-slate-800/50 border-slate-600/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0 hover:bg-slate-700/50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-slate-700/50"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={powerData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
                  color: '#f1f5f9'
                }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              />
              
              <Area 
                type="monotone" 
                dataKey="solar" 
                stackId="1" 
                stroke="#f59e0b" 
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
                stroke="#10b981" 
                fill="url(#gridGradient)"
                strokeWidth={2}
              />
              
              {/* Demand line */}
              <ReferenceLine 
                y={totalGeneration * 0.8} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ value: "Target Demand", position: "top" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend with enhanced styling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
            <div className="w-4 h-4 bg-amber-500 rounded-full" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Solar</p>
              <p className="text-lg font-bold text-amber-400">{currentTotal?.solar || 0}MW</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div className="w-4 h-4 bg-blue-500 rounded-full" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Battery</p>
              <p className="text-lg font-bold text-blue-400">{currentTotal?.battery || 0}MW</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/20">
            <div className="w-4 h-4 bg-emerald-500 rounded-full" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Grid</p>
              <p className="text-lg font-bold text-emerald-400">{currentTotal?.grid || 0}MW</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-500/10 to-slate-600/10 rounded-xl border border-slate-500/20">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
              <p className="text-lg font-bold text-white">{totalGeneration.toFixed(1)}MW</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
