
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { theme } from '@/lib/theme';
import { TrendingUp, Zap, DollarSign } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', production: 450, consumption: 380, revenue: 125000 },
  { day: 'Tue', production: 420, consumption: 400, revenue: 118000 },
  { day: 'Wed', production: 480, consumption: 350, revenue: 142000 },
  { day: 'Thu', production: 460, consumption: 390, revenue: 135000 },
  { day: 'Fri', production: 440, consumption: 410, revenue: 128000 },
  { day: 'Sat', production: 400, consumption: 320, revenue: 115000 },
  { day: 'Sun', production: 380, consumption: 300, revenue: 108000 },
];

const hourlyData = [
  { hour: '00', solar: 0, wind: 120, battery: 80 },
  { hour: '06', solar: 150, wind: 100, battery: 60 },
  { hour: '12', solar: 350, wind: 80, battery: 40 },
  { hour: '18', solar: 200, wind: 110, battery: 70 },
  { hour: '24', solar: 0, wind: 130, battery: 90 },
];

export const RegionAnalytics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Performance */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => {
                  const nameStr = String(name);
                  return [
                    `${value} ${nameStr === 'production' || nameStr === 'consumption' ? 'MW' : '$'}`,
                    nameStr.charAt(0).toUpperCase() + nameStr.slice(1)
                  ];
                }}
              />
              <Bar dataKey="production" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Energy Sources */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Zap className="w-5 h-5 text-blue-400" />
            Energy Sources (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value} MW`, '']}
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
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="battery" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
