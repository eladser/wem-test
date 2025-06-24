
export interface Site {
  id: string;
  name: string;
  location: string;
  region: string;
  status: 'online' | 'maintenance' | 'offline';
  totalCapacity: number;
  currentOutput: number;
  efficiency: number;
  lastUpdate: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'inverter' | 'battery' | 'solar_panel' | 'wind_turbine';
  siteId: string;
  status: 'online' | 'charging' | 'warning' | 'maintenance' | 'offline';
  power: string;
  efficiency: string;
  lastUpdate: string;
}

export interface PowerData {
  time: string;
  solar: number;
  battery: number;
  grid: number;
  wind?: number;
}

export interface EnergyMix {
  name: string;
  value: number;
  color: string;
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  site: string;
  timestamp: string;
}

export interface Region {
  id: string;
  name: string;
  sites: Site[];
}
