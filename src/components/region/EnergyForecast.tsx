
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { theme } from '@/lib/theme';
import { TrendingUp, CloudSun, Wind, Battery } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const forecastData = [
  { time: '00:00', actual: 450, predicted: 445, weather: 'clear', confidence: 95 },
  { time: '04:00', actual: 380, predicted: 385, weather: 'cloudy', confidence: 88 },
  { time: '08:00', actual: 520, predicted: 510, weather: 'sunny', confidence: 92 },
  { time: '12:00', actual: 680, predicted: 675, weather: 'sunny', confidence: 94 },
  { time: '16:00', actual: 620, predicted: 630, weather: 'partly-cloudy', confidence: 89 },
  { time: '20:00', actual: 480, predicted: 475, weather: 'clear', confidence: 91 },
  { time: '24:00', actual: null, predicted: 420, weather: 'clear', confidence: 87 },
];

const weatherIcons = {
  sunny: <CloudSun className="w-4 h-4 text-amber-400" />,
  cloudy: <CloudSun className="w-4 h-4 text-slate-400" />,
  'partly-cloudy': <CloudSun className="w-4 h-4 text-blue-400" />,
  clear: <CloudSun className="w-4 h-4 text-emerald-400" />,
};

export const EnergyForecast: React.FC = () => {
  const [forecastRange, setForecastRange] = useState('24h');
  const [energyType, setEnergyType] = useState('total');

  const currentTime = new Date().getHours();
  const accuracy = 92.5;

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <CardTitle className={theme.colors.text.primary}>Energy Forecast</CardTitle>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {accuracy}% Accuracy
            </Badge>
          </div>
          <div className="flex gap-2">
            <Select value={energyType} onValueChange={setEnergyType}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
              </SelectContent>
            </Select>
            <Select value={forecastRange} onValueChange={setForecastRange}>
              <SelectTrigger className="w-24 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => [
                `${value} MW`,
                name === 'actual' ? 'Actual' : 'Predicted'
              ]}
            />
            <ReferenceLine x={`${currentTime.toString().padStart(2, '0')}:00`} stroke="#ef4444" strokeDasharray="2 2" />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#3b82f6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {forecastData.slice(-4).map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                {weatherIcons[item.weather as keyof typeof weatherIcons]}
                <span className={`text-sm ${theme.colors.text.secondary}`}>{item.time}</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${theme.colors.text.primary}`}>
                  {item.predicted}MW
                </div>
                <div className={`text-xs ${theme.colors.text.muted}`}>
                  {item.confidence}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
