
export interface Site {
  id: string;
  name: string;
  location: string;
  region: string;
  subRegion?: string;
  status: 'Online' | 'Maintenance' | 'Offline'; // Matching backend enum
  totalCapacity: number;
  currentOutput: number;
  efficiency: number;
  lastUpdate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'Inverter' | 'Battery' | 'SolarPanel' | 'WindTurbine'; // Matching backend enum
  siteId: string;
  status: 'Online' | 'Charging' | 'Warning' | 'Maintenance' | 'Offline';
  power: string;
  efficiency: string;
  lastUpdate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PowerData {
  id?: string;
  siteId?: string;
  time: string;
  solar: number;
  battery: number;
  grid: number;
  demand: number;
  wind?: number;
  timestamp?: string;
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
  type: 'Critical' | 'Warning' | 'Info'; // Matching backend enum
  message: string;
  description?: string;
  site: string;
  siteId?: string;
  timestamp: string;
  isAcknowledged?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubRegion {
  id: string;
  name: string;
  sites: Site[];
}

export interface Region {
  id: string;
  name: string;
  sites: Site[];
  subRegions?: SubRegion[];
}

// New types for API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User and Auth types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Manager' | 'Operator' | 'Viewer';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Site-specific DTOs
export interface CreateSiteDto {
  name: string;
  location: string;
  region: string;
  totalCapacity: number;
}

export interface UpdateSiteDto {
  name?: string;
  location?: string;
  region?: string;
  totalCapacity?: number;
  currentOutput?: number;
  efficiency?: number;
}

export interface UpdateSiteStatusDto {
  status: 'Online' | 'Maintenance' | 'Offline';
}
