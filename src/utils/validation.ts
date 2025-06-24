
import { z } from 'zod';

// Common validation schemas
export const siteIdSchema = z.string().min(1, 'Site ID is required');
export const regionIdSchema = z.string().min(1, 'Region ID is required');
export const userIdSchema = z.string().min(1, 'User ID is required');

// Site data validation
export const siteSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Site name is required'),
  location: z.string().min(1, 'Location is required'),
  region: z.string().min(1, 'Region is required'),
  status: z.enum(['online', 'maintenance', 'offline']),
  totalCapacity: z.number().min(0, 'Capacity must be positive'),
  currentOutput: z.number().min(0, 'Output must be positive'),
  efficiency: z.number().min(0).max(100, 'Efficiency must be between 0 and 100'),
  lastUpdate: z.string()
});

// Asset data validation
export const assetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Asset name is required'),
  type: z.enum(['inverter', 'battery', 'solar_panel', 'wind_turbine']),
  siteId: z.string(),
  status: z.enum(['online', 'charging', 'warning', 'maintenance', 'offline']),
  power: z.string(),
  efficiency: z.string(),
  lastUpdate: z.string()
});

// Region data validation
export const regionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Region name is required'),
  sites: z.array(siteSchema)
});

// Validation helper functions
export const validateSite = (data: unknown) => {
  return siteSchema.safeParse(data);
};

export const validateAsset = (data: unknown) => {
  return assetSchema.safeParse(data);
};

export const validateRegion = (data: unknown) => {
  return regionSchema.safeParse(data);
};

// Generic validation helper
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
  }
  return result.data;
};
