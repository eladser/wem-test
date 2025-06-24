
// Environment configuration for production readiness
export const config = {
  // App configuration
  app: {
    name: process.env.REACT_APP_NAME || 'WEM Dashboard',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3'),
  },
  
  // Feature flags
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableNotifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS !== 'false',
    enableErrorReporting: process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true',
  },
  
  // Performance settings
  performance: {
    enableLazyLoading: process.env.REACT_APP_ENABLE_LAZY_LOADING !== 'false',
    cacheTimeout: parseInt(process.env.REACT_APP_CACHE_TIMEOUT || '300000'), // 5 minutes
  },
  
  // Development settings
  development: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
    mockApiDelay: parseInt(process.env.REACT_APP_MOCK_API_DELAY || '1000'),
  }
};

// Validation
const requiredEnvVars = [
  // Add required environment variables here
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;
