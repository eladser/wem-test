
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Zap, Battery } from 'lucide-react';
import { theme } from '@/lib/theme';

const energyData = [
  { time: '00:00', solar: 0, wind: 45, hydro: 120, consumption: 180 },
  { time: '04:00', solar: 0, wind: 52, hydro: 115, consumption: 160 },
  { time: '08:00', solar: 85, wind: 38, hydro: 125, consumption: 280 },
  { time: '12:00', solar: 145, wind: 42, hydro: 130, consumption: 320 },
  { time: '16:00', solar: 120, wind: 35, hydro: 135, consumption: 310 },
  { time: '20:00', solar: 25, wind: 48, hydro: 128, consumption: 250 },
];

const efficiencyData = [
  { hour: '6AM', efficiency: 87.2 },
  { hour: '9AM', efficiency: 92.1 },
  { hour: '12PM', efficiency: 94.8 },
  { hour: '3PM', efficiency: 91.5 },
  { hour: '6PM', efficiency: 89.3 },
  { hour: '9PM', efficiency: 86.7 },
];

export const EnergyAnalytics: React.FC = () => {
  const totalGeneration = energyData[energyData.length - 1];
  const currentEfficiency = efficiencyData[efficiencyData.length - 1].efficiency;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Energy Production Chart */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Energy Production
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 ml-auto">
              24H
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis 
                stroke="#94a3b8"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="solar" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="wind" 
                stackId="1"
                stroke="#06b6d4" 
                fill="#06b6d4" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="hydro" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
              />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-xs text-slate-400">Solar</span>
              </div>
              <div className="text-sm font-bold text-white">{totalGeneration.solar}MW</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                <span className="text-xs text-slate-400">Wind</span>
              </div>
              <div className="text-sm font-bold text-white">{totalGeneration.wind}MW</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-xs text-slate-400">Hydro</span>
              </div>
              <div className="text-sm font-bold text-white">{totalGeneration.hydro}MW</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-xs text-slate-400">Usage</span>
              </div>
              <div className="text-sm font-bold text-white">{totalGeneration.consumption}MW</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Efficiency Chart */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            System Efficiency
            <Badge className={`ml-auto ${
              currentEfficiency > 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              currentEfficiency > 85 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {currentEfficiency.toFixed(1)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="hour" 
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis 
                domain={[80, 100]}
                stroke="#94a3b8"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Efficiency']}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">Peak Efficiency</div>
                <div className="text-lg font-bold text-emerald-400">94.8%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-slate-400">Average Today</div>
                <div className="text-lg font-bold text-blue-400">90.1%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
