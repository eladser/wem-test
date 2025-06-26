/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_AUTH_PROVIDER: string
  readonly VITE_JWT_SECRET: string
  readonly VITE_ENABLE_REAL_TIME: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_EXPORT: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_ENABLE_THEME_SWITCHING: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_DEBUG: string
  readonly VITE_MOCK_DATA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global process object for compatibility
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
    }
  }
  
  var process: {
    env: NodeJS.ProcessEnv
  }
}
