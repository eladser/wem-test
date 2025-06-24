
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { theme } from '@/lib/theme';
import { SiteCard } from './SiteCard';
import { SiteMonitoringFilters } from './SiteMonitoringFilters';

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
          <SiteMonitoringFilters
            statusFilter={statusFilter}
            sortBy={sortBy}
            onStatusFilterChange={setStatusFilter}
            onSortByChange={setSortBy}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
