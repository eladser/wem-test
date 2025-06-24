
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Zap, Battery, TrendingUp, MapPin, Settings, Maximize2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import { NavLink } from 'react-router-dom';

interface SiteData {
  id: string;
  name: string;
  location: string;
  currentOutput: number;
  capacity: number;
  efficiency: number;
  status: 'online' | 'maintenance' | 'offline';
  batteryLevel: number;
  powerData: { time: string; output: number }[];
  lastUpdate: string;
  alerts: number;
}

interface SiteCardProps {
  site: SiteData;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const getStatusColor = (status: SiteData['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <Card className={`${theme.colors.background.cardHover} ${theme.colors.border.primary} transition-all duration-200 hover:scale-[1.02]`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-semibold ${theme.colors.text.primary}`}>{site.name}</h4>
            <p className={`text-sm ${theme.colors.text.muted} flex items-center gap-1`}>
              <MapPin className="w-3 h-3" />
              {site.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(site.status)}>
              {site.status}
            </Badge>
            {site.alerts > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {site.alerts} alerts
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-slate-800/30 rounded">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span className={`text-xs ${theme.colors.text.muted}`}>Output</span>
            </div>
            <div className={`text-sm font-medium ${theme.colors.text.primary}`}>
              {Math.round(site.currentOutput)}kW
            </div>
            <div className={`text-xs ${theme.colors.text.muted}`}>
              of {site.capacity}kW
            </div>
          </div>
          
          <div className="text-center p-2 bg-slate-800/30 rounded">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-blue-400" />
              <span className={`text-xs ${theme.colors.text.muted}`}>Efficiency</span>
            </div>
            <div className={`text-sm font-medium ${theme.colors.text.primary}`}>
              {Math.round(site.efficiency)}%
            </div>
          </div>
          
          <div className="text-center p-2 bg-slate-800/30 rounded">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Battery className="w-3 h-3 text-amber-400" />
              <span className={`text-xs ${theme.colors.text.muted}`}>Battery</span>
            </div>
            <div className={`text-sm font-medium ${theme.colors.text.primary}`}>
              {Math.round(site.batteryLevel)}%
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={site.powerData}>
              <Area
                type="monotone"
                dataKey="output"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <span className={`text-xs ${theme.colors.text.muted}`}>
            Updated {site.lastUpdate}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
            >
              <NavLink to={`/site/${site.id}`}>
                <Maximize2 className="w-3 h-3 mr-1" />
                View
              </NavLink>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
