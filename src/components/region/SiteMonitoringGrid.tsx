
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Battery, AlertTriangle, TrendingUp, MapPin, Settings, Maximize2 } from 'lucide-react';
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

const mockSitesData: SiteData[] = [
  {
    id: 'site-1',
    name: 'Solar Farm Alpha',
    location: 'Berlin',
    currentOutput: 1250,
    capacity: 1500,
    efficiency: 92,
    status: 'online',
    batteryLevel: 78,
    powerData: [
      { time: '00:00', output: 800 },
      { time: '04:00', output: 650 },
      { time: '08:00', output: 1100 },
      { time: '12:00', output: 1400 },
      { time: '16:00', output: 1250 },
      { time: '20:00', output: 900 }
    ],
    lastUpdate: '2 min ago',
    alerts: 0
  },
  {
    id: 'site-2',
    name: 'Wind Farm Beta',
    location: 'Munich',
    currentOutput: 850,
    capacity: 1200,
    efficiency: 88,
    status: 'online',
    batteryLevel: 65,
    powerData: [
      { time: '00:00', output: 600 },
      { time: '04:00', output: 750 },
      { time: '08:00', output: 900 },
      { time: '12:00', output: 950 },
      { time: '16:00', output: 850 },
      { time: '20:00', output: 700 }
    ],
    lastUpdate: '1 min ago',
    alerts: 1
  },
  {
    id: 'site-3',
    name: 'Hydro Station Gamma',
    location: 'Frankfurt',
    currentOutput: 420,
    capacity: 800,
    efficiency: 76,
    status: 'maintenance',
    batteryLevel: 45,
    powerData: [
      { time: '00:00', output: 500 },
      { time: '04:00', output: 480 },
      { time: '08:00', output: 450 },
      { time: '12:00', output: 420 },
      { time: '16:00', output: 420 },
      { time: '20:00', output: 400 }
    ],
    lastUpdate: '5 min ago',
    alerts: 2
  },
  {
    id: 'site-4',
    name: 'Solar Farm Delta',
    location: 'Hamburg',
    currentOutput: 980,
    capacity: 1100,
    efficiency: 94,
    status: 'online',
    batteryLevel: 82,
    powerData: [
      { time: '00:00', output: 700 },
      { time: '04:00', output: 600 },
      { time: '08:00', output: 950 },
      { time: '12:00', output: 1050 },
      { time: '16:00', output: 980 },
      { time: '20:00', output: 800 }
    ],
    lastUpdate: '3 min ago',
    alerts: 0
  }
];

export const SiteMonitoringGrid: React.FC = () => {
  const [sites, setSites] = useState<SiteData[]>(mockSitesData);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'maintenance' | 'offline'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'output' | 'efficiency'>('name');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSites(prev => prev.map(site => ({
        ...site,
        currentOutput: site.currentOutput + (Math.random() - 0.5) * 50,
        efficiency: Math.max(70, Math.min(100, site.efficiency + (Math.random() - 0.5) * 2)),
        batteryLevel: Math.max(0, Math.min(100, site.batteryLevel + (Math.random() - 0.5) * 5))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredSites = sites
    .filter(site => statusFilter === 'all' || site.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'output':
          return b.currentOutput - a.currentOutput;
        case 'efficiency':
          return b.efficiency - a.efficiency;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getStatusColor = (status: SiteData['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <CardTitle className={theme.colors.text.primary}>Site Monitoring</CardTitle>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Live Data
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Sites</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="output">Output</SelectItem>
                <SelectItem value="efficiency">Efficiency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSites.map((site) => (
            <Card
              key={site.id}
              className={`${theme.colors.background.cardHover} ${theme.colors.border.primary} transition-all duration-200 hover:scale-[1.02]`}
            >
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
