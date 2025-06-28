import { Site, Asset, PowerData, EnergyMix, Metric, Alert, Region } from '@/types/energy';
import { Zap, Battery, Clock, TrendingUp } from 'lucide-react';

export const mockRegions: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    subRegions: [
      {
        id: 'north-america-west',
        name: 'West Coast',
        sites: [
          {
            id: 'site-a',
            name: 'Main Campus',
            location: 'California, USA',
            region: 'north-america',
            subRegion: 'north-america-west',
            status: 'online',
            totalCapacity: 25.5,
            currentOutput: 18.2,
            efficiency: 94.2,
            lastUpdate: '2 min ago'
          },
          {
            id: 'site-e',
            name: 'Silicon Valley Plant',
            location: 'San Jose, CA, USA',
            region: 'north-america',
            subRegion: 'north-america-west',
            status: 'online',
            totalCapacity: 18.7,
            currentOutput: 15.3,
            efficiency: 92.8,
            lastUpdate: '1 min ago'
          }
        ]
      },
      {
        id: 'north-america-central',
        name: 'Central Plains',
        sites: [
          {
            id: 'site-b',
            name: 'Warehouse Complex',
            location: 'Texas, USA',
            region: 'north-america',
            subRegion: 'north-america-central',
            status: 'online',
            totalCapacity: 15.8,
            currentOutput: 12.1,
            efficiency: 91.5,
            lastUpdate: '3 min ago'
          },
          {
            id: 'site-f',
            name: 'Dallas Distribution Center',
            location: 'Dallas, TX, USA',
            region: 'north-america',
            subRegion: 'north-america-central',
            status: 'maintenance',
            totalCapacity: 22.4,
            currentOutput: 0,
            efficiency: 0,
            lastUpdate: '1 hour ago'
          }
        ]
      }
    ],
    sites: [] // Legacy support - will be populated from subRegions
  },
  {
    id: 'europe',
    name: 'Europe',
    subRegions: [
      {
        id: 'europe-western',
        name: 'Western Europe',
        sites: [
          {
            id: 'site-c',
            name: 'Office Complex',
            location: 'Berlin, Germany',
            region: 'europe',
            subRegion: 'europe-western',
            status: 'maintenance',
            totalCapacity: 12.3,
            currentOutput: 0,
            efficiency: 0,
            lastUpdate: '2 hours ago'
          },
          {
            id: 'site-g',
            name: 'Amsterdam Data Center',
            location: 'Amsterdam, Netherlands',
            region: 'europe',
            subRegion: 'europe-western',
            status: 'online',
            totalCapacity: 28.9,
            currentOutput: 26.1,
            efficiency: 95.4,
            lastUpdate: '30 seconds ago'
          }
        ]
      },
      {
        id: 'europe-northern',
        name: 'Northern Europe',
        sites: [
          {
            id: 'site-h',
            name: 'Stockholm Facility',
            location: 'Stockholm, Sweden',
            region: 'europe',
            subRegion: 'europe-northern',
            status: 'online',
            totalCapacity: 19.6,
            currentOutput: 17.8,
            efficiency: 93.7,
            lastUpdate: '45 seconds ago'
          }
        ]
      }
    ],
    sites: [] // Legacy support - will be populated from subRegions
  },
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    subRegions: [
      {
        id: 'asia-pacific-east',
        name: 'East Asia',
        sites: [
          {
            id: 'site-d',
            name: 'Manufacturing Plant',
            location: 'Tokyo, Japan',
            region: 'asia-pacific',
            subRegion: 'asia-pacific-east',
            status: 'online',
            totalCapacity: 32.1,
            currentOutput: 28.7,
            efficiency: 96.8,
            lastUpdate: '1 min ago'
          },
          {
            id: 'site-i',
            name: 'Seoul Operations Center',
            location: 'Seoul, South Korea',
            region: 'asia-pacific',
            subRegion: 'asia-pacific-east',
            status: 'online',
            totalCapacity: 24.3,
            currentOutput: 21.9,
            efficiency: 94.1,
            lastUpdate: '2 min ago'
          }
        ]
      },
      {
        id: 'asia-pacific-southeast',
        name: 'Southeast Asia',
        sites: [
          {
            id: 'site-j',
            name: 'Singapore Hub',
            location: 'Singapore',
            region: 'asia-pacific',
            subRegion: 'asia-pacific-southeast',
            status: 'online',
            totalCapacity: 16.8,
            currentOutput: 14.2,
            efficiency: 89.3,
            lastUpdate: '4 min ago'
          }
        ]
      }
    ],
    sites: [] // Legacy support - will be populated from subRegions
  }
];

// Populate legacy sites array for backward compatibility
mockRegions.forEach(region => {
  if (region.subRegions) {
    region.sites = region.subRegions.flatMap(subRegion => subRegion.sites || []);
  }
});

export const generatePowerData = (): PowerData[] => {
  return [
    { time: "00:00", solar: 0, battery: 85, grid: 12, demand: 97 },
    { time: "06:00", solar: 45, battery: 80, grid: 8, demand: 133 },
    { time: "12:00", solar: 95, battery: 75, grid: 0, demand: 170 },
    { time: "18:00", solar: 25, battery: 70, grid: 15, demand: 110 },
    { time: "24:00", solar: 0, battery: 65, grid: 20, demand: 85 },
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
    ],
    // Add assets for new sites
    'site-e': [
      {
        id: 'INV-005',
        name: 'Solar Inverter #5',
        type: 'inverter',
        siteId: 'site-e',
        status: 'online',
        power: '7.8 kW',
        efficiency: '92.8%',
        lastUpdate: '1 min ago'
      }
    ],
    'site-f': [
      {
        id: 'INV-006',
        name: 'Solar Inverter #6',
        type: 'inverter',
        siteId: 'site-f',
        status: 'maintenance',
        power: '0 kW',
        efficiency: '0%',
        lastUpdate: '1 hour ago'
      }
    ],
    'site-g': [
      {
        id: 'INV-007',
        name: 'Solar Inverter #7',
        type: 'inverter',
        siteId: 'site-g',
        status: 'online',
        power: '12.4 kW',
        efficiency: '95.4%',
        lastUpdate: '30 seconds ago'
      },
      {
        id: 'BAT-003',
        name: 'Battery Pack #3',
        type: 'battery',
        siteId: 'site-g',
        status: 'online',
        power: '13.7 kW',
        efficiency: '94.8%',
        lastUpdate: '30 seconds ago'
      }
    ],
    'site-h': [
      {
        id: 'INV-008',
        name: 'Solar Inverter #8',
        type: 'inverter',
        siteId: 'site-h',
        status: 'online',
        power: '9.6 kW',
        efficiency: '93.7%',
        lastUpdate: '45 seconds ago'
      }
    ],
    'site-i': [
      {
        id: 'INV-009',
        name: 'Solar Inverter #9',
        type: 'inverter',
        siteId: 'site-i',
        status: 'online',
        power: '11.2 kW',
        efficiency: '94.1%',
        lastUpdate: '2 min ago'
      }
    ],
    'site-j': [
      {
        id: 'INV-010',
        name: 'Solar Inverter #10',
        type: 'inverter',
        siteId: 'site-j',
        status: 'online',
        power: '8.9 kW',
        efficiency: '89.3%',
        lastUpdate: '4 min ago'
      }
    ]
  };
  
  return assetMap[siteId] || [];
};

export const getMockPowerData = (siteId: string): PowerData[] => {
  // Generate different data patterns based on site
  const baseData = [
    { time: "00:00", solar: 0, battery: 85, grid: 12, demand: 97 },
    { time: "06:00", solar: 45, battery: 80, grid: 8, demand: 133 },
    { time: "12:00", solar: 95, battery: 75, grid: 0, demand: 170 },
    { time: "18:00", solar: 25, battery: 70, grid: 15, demand: 110 },
    { time: "24:00", solar: 0, battery: 65, grid: 20, demand: 85 },
  ];
  
  // Modify data based on site characteristics
  const multiplier = siteId === 'site-d' ? 1.2 : siteId === 'site-c' ? 0.3 : 1;
  
  return baseData.map(point => ({
    ...point,
    solar: Math.round(point.solar * multiplier),
    battery: Math.round(point.battery * multiplier),
    grid: Math.round(point.grid * multiplier),
    demand: Math.round(point.demand * multiplier)
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
