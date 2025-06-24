
import { useCallback } from 'react';
import { 
  sanitizeInput, 
  sanitizeHtml, 
  validateEmail, 
  validateUrl,
  validateFileType,
  validateFileSize,
  rateLimiter,
  CSRFProtection
} from '@/utils/security';
import { toast } from 'sonner';
import { logger } from '@/utils/logging';

export interface SecurityValidationResult {
  isValid: boolean;
  sanitizedValue?: string;
  error?: string;
}

export const useSecurity = () => {
  const validateAndSanitizeInput = useCallback((
    input: string,
    options: {
      maxLength?: number;
      allowHtml?: boolean;
      showToast?: boolean;
    } = {}
  ): SecurityValidationResult => {
    const { maxLength = 1000, allowHtml = false, showToast = true } = options;

    if (input.length > maxLength) {
      const error = `Input too long. Maximum ${maxLength} characters allowed.`;
      if (showToast) toast.error(error);
      return { isValid: false, error };
    }

    const sanitizedValue = allowHtml ? sanitizeHtml(input) : sanitizeInput(input);
    
    return {
      isValid: true,
      sanitizedValue
    };
  }, []);

  const validateEmailInput = useCallback((email: string): SecurityValidationResult => {
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    
    if (!validateEmail(sanitizedEmail)) {
      return {
        isValid: false,
        error: 'Invalid email format'
      };
    }

    return {
      isValid: true,
      sanitizedValue: sanitizedEmail
    };
  }, []);

  const validateUrlInput = useCallback((
    url: string,
    allowedDomains?: string[]
  ): SecurityValidationResult => {
    const sanitizedUrl = sanitizeInput(url);
    
    if (!validateUrl(sanitizedUrl, allowedDomains)) {
      return {
        isValid: false,
        error: 'Invalid or untrusted URL'
      };
    }

    return {
      isValid: true,
      sanitizedValue: sanitizedUrl
    };
  }, []);

  const validateFileUpload = useCallback((
    file: File,
    options: {
      allowedTypes: string[];
      maxSizeBytes: number;
    }
  ): SecurityValidationResult => {
    if (!validateFileType(file, options.allowedTypes)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
      };
    }

    if (!validateFileSize(file, options.maxSizeBytes)) {
      const maxSizeMB = (options.maxSizeBytes / (1024 * 1024)).toFixed(1);
      return {
        isValid: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`
      };
    }

    return { isValid: true };
  }, []);

  const checkRateLimit = useCallback((identifier: string = 'default'): boolean => {
    const allowed = rateLimiter.isAllowed(identifier);
    
    if (!allowed) {
      toast.error('Too many requests. Please wait and try again.');
      logger.warn('Rate limit exceeded', { identifier });
    }
    
    return allowed;
  }, []);

  const getCSRFToken = useCallback((): string => {
    return CSRFProtection.getToken() || CSRFProtection.generateToken();
  }, []);

  const validateCSRFToken = useCallback((token: string): boolean => {
    return CSRFProtection.validateToken(token);
  }, []);

  return {
    validateAndSanitizeInput,
    validateEmailInput,
    validateUrlInput,
    validateFileUpload,
    checkRateLimit,
    getCSRFToken,
    validateCSRFToken
  };
};

export type UseSecurity = ReturnType<typeof useSecurity>;
