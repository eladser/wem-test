
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Zap, Battery, Sun, Grid, TrendingUp, Maximize2 } from "lucide-react";

interface EnergyMixData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  trend: string;
}

interface EnhancedEnergyMixProps {
  siteName: string;
  energyMix: Array<{ name: string; value: number; color: string }>;
}

export const EnhancedEnergyMix: React.FC<EnhancedEnergyMixProps> = ({ siteName, energyMix }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const enhancedEnergyMix: EnergyMixData[] = energyMix.map((item) => ({
    ...item,
    icon: getEnergyIcon(item.name),
    trend: getTrendForSource(item.name)
  }));

  function getEnergyIcon(name: string) {
    switch (name.toLowerCase()) {
      case 'solar':
        return <Sun className="w-4 h-4" />;
      case 'battery':
        return <Battery className="w-4 h-4" />;
      case 'grid':
        return <Grid className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  }

  function getTrendForSource(name: string) {
    const trends: Record<string, string> = {
      'Solar': '+12.3%',
      'Battery': '+5.7%',
      'Grid': '-2.1%'
    };
    return trends[name] || '+0.0%';
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="text-white font-semibold">{data.name}</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{data.value}%</p>
            <p className="text-xs text-emerald-400">{data.trend}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Energy Mix
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Current distribution for {siteName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-3 py-1">
              Real-time
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enhanced Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enhancedEnergyMix}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {enhancedEnergyMix.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activeIndex === index ? '#ffffff' : 'none'}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                      transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Legend */}
        <div className="space-y-3">
          {enhancedEnergyMix.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                activeIndex === index 
                  ? 'bg-slate-700/50 border-slate-600/50 scale-[1.02]' 
                  : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-700/30 hover:border-slate-600/40'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-5 h-5 rounded-full shadow-lg"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex items-center gap-2 text-slate-300">
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{item.value}%</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {item.trend}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">94.2%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Renewable</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">1,247kW</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Output</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-400">+8.3%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">vs Yesterday</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
