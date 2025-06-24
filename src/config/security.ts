
import { config } from './environment';

export interface SecurityConfig {
  csp: {
    enabled: boolean;
    directives: Record<string, string[]>;
  };
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
  };
  headers: Record<string, string>;
}

export const securityConfig: SecurityConfig = {
  csp: {
    enabled: config.security.enableCSP,
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Vite in development
        "'unsafe-eval'", // Required for development hot reload
        ...(config.app.environment === 'development' ? ["'unsafe-inline'", "'unsafe-eval'"] : [])
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
        'https://fonts.googleapis.com'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'data:'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        ...(config.security.trustedDomains.length > 0 ? config.security.trustedDomains : [])
      ],
      'connect-src': [
        "'self'",
        config.api.baseUrl,
        ...config.api.fallbackUrls,
        ...(config.services.monitoringUrl ? [config.services.monitoringUrl] : []),
        ...(config.app.environment === 'development' ? ['ws:', 'wss:'] : [])
      ],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'upgrade-insecure-requests': []
    }
  },
  rateLimiting: {
    enabled: config.security.enableRateLimiting,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100 // requests per window
  },
  cors: {
    enabled: true,
    allowedOrigins: config.app.environment === 'production' 
      ? config.security.trustedDomains 
      : ['http://localhost:5173', 'http://localhost:3000']
  },
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    ...(config.app.environment === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    })
  }
};

export const generateCSPString = (): string => {
  return Object.entries(securityConfig.csp.directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};
