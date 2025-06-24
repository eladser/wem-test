
import { Site, Asset, PowerData, EnergyMix, Metric, Alert, Region } from '@/types/energy';
import { Zap, Battery, Clock, TrendingUp } from 'lucide-react';

export const mockRegions: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    sites: [
      {
        id: 'site-a',
        name: 'Main Campus',
        location: 'California, USA',
        region: 'north-america',
        status: 'online',
        totalCapacity: 25.5,
        currentOutput: 18.2,
        efficiency: 94.2,
        lastUpdate: '2 min ago'
      },
      {
        id: 'site-b',
        name: 'Warehouse Complex',
        location: 'Texas, USA',
        region: 'north-america',
        status: 'online',
        totalCapacity: 15.8,
        currentOutput: 12.1,
        efficiency: 91.5,
        lastUpdate: '3 min ago'
      }
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    sites: [
      {
        id: 'site-c',
        name: 'Office Complex',
        location: 'Berlin, Germany',
        region: 'europe',
        status: 'maintenance',
        totalCapacity: 12.3,
        currentOutput: 0,
        efficiency: 0,
        lastUpdate: '2 hours ago'
      }
    ]
  },
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    sites: [
      {
        id: 'site-d',
        name: 'Manufacturing Plant',
        location: 'Tokyo, Japan',
        region: 'asia-pacific',
        status: 'online',
        totalCapacity: 32.1,
        currentOutput: 28.7,
        efficiency: 96.8,
        lastUpdate: '1 min ago'
      }
    ]
  }
];

export const generatePowerData = (): PowerData[] => {
  return [
    { time: "00:00", solar: 0, battery: 85, grid: 12 },
    { time: "06:00", solar: 45, battery: 80, grid: 8 },
    { time: "12:00", solar: 95, battery: 75, grid: 0 },
    { time: "18:00", solar: 25, battery: 70, grid: 15 },
    { time: "24:00", solar: 0, battery: 65, grid: 20 },
  ];
};

export const getMockAssets = (siteId: string): Asset[] => {
  const assetMap: Record<string, Asset[]> = {
    'site-a': [
      {
        id: 'INV-001',
        name: 'Solar Inverter #1',
        type: 'inverter',
        siteId: 'site-a',
        status: 'online',
        power: '8.5 kW',
        efficiency: '94.2%',
        lastUpdate: '2 min ago'
      },
      {
        id: 'BAT-001',
        name: 'Battery Pack #1',
        type: 'battery',
        siteId: 'site-a',
        status: 'charging',
        power: '12.3 kW',
        efficiency: '96.8%',
        lastUpdate: '1 min ago'
      }
    ],
    'site-b': [
      {
        id: 'INV-002',
        name: 'Solar Inverter #2',
        type: 'inverter',
        siteId: 'site-b',
        status: 'online',
        power: '6.2 kW',
        efficiency: '91.5%',
        lastUpdate: '3 min ago'
      }
    ],
    'site-c': [
      {
        id: 'INV-003',
        name: 'Solar Inverter #3',
        type: 'inverter',
        siteId: 'site-c',
        status: 'maintenance',
        power: '0 kW',
        efficiency: '0%',
        lastUpdate: '2 hours ago'
      }
    ],
    'site-d': [
      {
        id: 'INV-004',
        name: 'Solar Inverter #4',
        type: 'inverter',
        siteId: 'site-d',
        status: 'online',
        power: '15.2 kW',
        efficiency: '96.8%',
        lastUpdate: '1 min ago'
      },
      {
        id: 'BAT-002',
        name: 'Battery Pack #2',
        type: 'battery',
        siteId: 'site-d',
        status: 'online',
        power: '13.5 kW',
        efficiency: '95.1%',
        lastUpdate: '1 min ago'
      }
    ]
  };
  
  return assetMap[siteId] || [];
};

export const getMockPowerData = (siteId: string): PowerData[] => {
  // Generate different data patterns based on site
  const baseData = [
    { time: "00:00", solar: 0, battery: 85, grid: 12 },
    { time: "06:00", solar: 45, battery: 80, grid: 8 },
    { time: "12:00", solar: 95, battery: 75, grid: 0 },
    { time: "18:00", solar: 25, battery: 70, grid: 15 },
    { time: "24:00", solar: 0, battery: 65, grid: 20 },
  ];
  
  // Modify data based on site characteristics
  const multiplier = siteId === 'site-d' ? 1.2 : siteId === 'site-c' ? 0.3 : 1;
  
  return baseData.map(point => ({
    ...point,
    solar: Math.round(point.solar * multiplier),
    battery: Math.round(point.battery * multiplier),
    grid: Math.round(point.grid * multiplier)
  }));
};

export const getMockMetrics = (siteId: string): Metric[] => {
  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);
  
  return [
    {
      title: "Current Power Output",
      value: `${site?.currentOutput || 0} kW`,
      change: "+8.2%",
      trend: "up",
      icon: Zap,
      color: "green"
    },
    {
      title: "Battery Level",
      value: "78%",
      change: "-2.1%",
      trend: "down",
      icon: Battery,
      color: "blue"
    },
    {
      title: "Energy Today",
      value: "145.2 kWh",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "emerald"
    },
    {
      title: "System Efficiency",
      value: `${site?.efficiency || 0}%`,
      change: "+0.3%",
      trend: "up",
      icon: Clock,
      color: "cyan"
    }
  ];
};

export const getMockEnergyMix = (): EnergyMix[] => [
  { name: "Solar", value: 65, color: "#10b981" },
  { name: "Battery", value: 25, color: "#3b82f6" },
  { name: "Grid", value: 10, color: "#f59e0b" },
];
