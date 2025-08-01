// Environment configuration for production readiness
export const config = {
  // App configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'WEM Dashboard',
    version: import.meta.env.VITE_APP_VERSION || '3.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // API configuration - FIXED: Remove /api from base URL to prevent double /api/api/
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
    fallbackUrls: [
      import.meta.env.VITE_API_FALLBACK_URL_1,
      import.meta.env.VITE_API_FALLBACK_URL_2,
    ].filter(Boolean) as string[],
  },
  
  // WebSocket configuration
  websocket: {
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws/energy-data',
    reconnectInterval: parseInt(import.meta.env.VITE_WS_RECONNECT_INTERVAL || '5000'),
    maxReconnectAttempts: parseInt(import.meta.env.VITE_WS_MAX_RECONNECT_ATTEMPTS || '10'),
  },
  
  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    enableRealTime: import.meta.env.VITE_ENABLE_REAL_TIME !== 'false',
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  },
  
  // Performance settings
  performance: {
    enableLazyLoading: import.meta.env.VITE_ENABLE_LAZY_LOADING !== 'false',
    cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '300000'), // 5 minutes
    realtimeInterval: parseInt(import.meta.env.VITE_REALTIME_INTERVAL || '5000'),
  },
  
  // Development settings
  development: {
    enableDebugLogs: import.meta.env.MODE === 'development' || import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true',
    mockApiDelay: parseInt(import.meta.env.VITE_MOCK_API_DELAY || '1000'),
    debug: import.meta.env.VITE_DEBUG === 'true',
  },

  // Security settings
  security: {
    enableCSP: import.meta.env.VITE_ENABLE_CSP !== 'false',
    enableRateLimiting: import.meta.env.VITE_ENABLE_RATE_LIMITING !== 'false',
    trustedDomains: (import.meta.env.VITE_TRUSTED_DOMAINS || '').split(',').filter(Boolean),
  },

  // External services
  services: {
    errorReportingKey: import.meta.env.VITE_ERROR_REPORTING_KEY,
    analyticsId: import.meta.env.VITE_ANALYTICS_ID,
    monitoringUrl: import.meta.env.VITE_MONITORING_URL,
  }
};

// Validation for production environment
const validateProductionConfig = () => {
  if (config.app.environment === 'production') {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required for production
    if (!config.api.baseUrl || config.api.baseUrl.includes('localhost')) {
      errors.push('Production API base URL is required and cannot be localhost');
    }

    if (config.features.enableErrorReporting && !config.services.errorReportingKey) {
      warnings.push('Error reporting is enabled but no error reporting key is configured');
    }

    if (config.features.enableAnalytics && !config.services.analyticsId) {
      warnings.push('Analytics is enabled but no analytics ID is configured');
    }

    if (config.development.enableDebugLogs) {
      warnings.push('Debug logs are enabled in production');
    }

    if (errors.length > 0) {
      console.error('Production configuration errors:', errors);
      throw new Error(`Production configuration errors: ${errors.join(', ')}`);
    }

    if (warnings.length > 0) {
      console.warn('Production configuration warnings:', warnings);
    }
  }
};

// Run validation
validateProductionConfig();

// Log current configuration in development
if (config.development.enableDebugLogs) {
  console.log('🔧 WEM Dashboard Configuration:', {
    environment: config.app.environment,
    apiBaseUrl: config.api.baseUrl,
    websocketUrl: config.websocket.url,
    mockData: config.features.useMockData,
    realTime: config.features.enableRealTime
  });
}

export default config;
