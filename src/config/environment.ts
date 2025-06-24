
// Environment configuration for production readiness
export const config = {
  // App configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'WEM Dashboard',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  },
  
  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  },
  
  // Performance settings
  performance: {
    enableLazyLoading: import.meta.env.VITE_ENABLE_LAZY_LOADING !== 'false',
    cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '300000'), // 5 minutes
  },
  
  // Development settings
  development: {
    enableDebugLogs: import.meta.env.MODE === 'development',
    mockApiDelay: parseInt(import.meta.env.VITE_MOCK_API_DELAY || '1000'),
  }
};

// Validation
const requiredEnvVars = [
  // Add required environment variables here
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

if (missingEnvVars.length > 0 && import.meta.env.MODE === 'production') {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;
