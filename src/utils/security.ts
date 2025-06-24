
import DOMPurify from 'isomorphic-dompurify';
import { securityConfig } from '@/config/security';
import { logger } from './logging';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data URLs
    .trim();
};

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// URL validation
export const validateUrl = (url: string, allowedDomains?: string[]): boolean => {
  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check against allowed domains if provided
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    }
    
    return true;
  } catch {
    return false;
  }
};

// Email validation with additional security checks
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) return false;
  
  // Additional security checks
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.includes('..')) return false; // Consecutive dots
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return true;
};

// File validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

// SQL injection prevention for search inputs
export const sanitizeSearchInput = (input: string): string => {
  return input
    .replace(/['"\\;]/g, '') // Remove SQL special characters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
    .trim();
};

// Rate limiting utilities
export class RateLimiter {
  private requests = new Map<string, number[]>();

  isAllowed(identifier: string): boolean {
    if (!securityConfig.rateLimiting.enabled) return true;

    const now = Date.now();
    const windowStart = now - securityConfig.rateLimiting.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= securityConfig.rateLimiting.maxRequests) {
      logger.warn('Rate limit exceeded', { identifier, requests: validRequests.length });
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    const windowStart = now - securityConfig.rateLimiting.windowMs;
    
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Security headers management
export const applySecurityHeaders = (): void => {
  if (typeof document === 'undefined') return;

  // Apply CSP if enabled
  if (securityConfig.csp.enabled) {
    const cspString = Object.entries(securityConfig.csp.directives)
      .map(([directive, sources]) => {
        if (sources.length === 0) return directive;
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');

    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', cspString);
    document.head.appendChild(cspMeta);
  }

  // Apply other security headers via meta tags where possible
  Object.entries(securityConfig.headers).forEach(([header, value]) => {
    if (header === 'X-Frame-Options') {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', header);
      meta.setAttribute('content', value);
      document.head.appendChild(meta);
    }
  });

  logger.info('Security headers applied');
};

// XSS protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// CSRF token management
export class CSRFProtection {
  private static token: string | null = null;

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return this.token;
  }

  static getToken(): string | null {
    return this.token;
  }

  static validateToken(token: string): boolean {
    return this.token !== null && this.token === token;
  }
}

// Initialize security measures
export const initializeSecurity = (): void => {
  applySecurityHeaders();
  CSRFProtection.generateToken();
  
  // Set up rate limiter cleanup
  setInterval(() => {
    rateLimiter.cleanup();
  }, 60000); // Cleanup every minute

  logger.info('Security measures initialized');
};
