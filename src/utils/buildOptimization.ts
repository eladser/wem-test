
import { config } from '@/config/environment';

// Code splitting utilities
export const createAsyncComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  return React.lazy(importFunc);
};

// Resource preloading
export const preloadRoute = (routePath: string) => {
  // This would integrate with your routing solution to preload components
  if (config.performance.enableLazyLoading) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = routePath;
    document.head.appendChild(link);
  }
};

// Image optimization
export const optimizeImage = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
} = {}) => {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  // In production, this would integrate with an image CDN
  if (config.app.environment === 'production') {
    // Example: return `https://your-cdn.com/transform?src=${encodeURIComponent(src)}&w=${width}&h=${height}&q=${quality}&f=${format}`;
  }
  
  return src;
};

// Bundle analysis
export const analyzeBundleSize = () => {
  if (config.development.enableDebugLogs) {
    // This would integrate with bundle analyzer tools
    console.log('Bundle size analysis would be performed here');
    
    // Example of what you might track:
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalSize = scripts.reduce((acc, script) => {
      const src = script.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        // In a real implementation, you'd fetch the actual size
        return acc + 1; // Placeholder
      }
      return acc;
    }, 0);
    
    console.log(`Total script tags: ${totalSize}`);
  }
};

// Cache management
export const manageCaches = () => {
  if ('caches' in window) {
    // Clean up old caches
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old-version')) {
          caches.delete(name);
        }
      });
    });
  }
};

// Service worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && config.app.environment === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Performance optimization hooks
export const useVirtualization = (items: any[], containerHeight: number, itemHeight: number) => {
  const [startIndex, setStartIndex] = React.useState(0);
  const [endIndex, setEndIndex] = React.useState(Math.ceil(containerHeight / itemHeight));

  const handleScroll = React.useCallback((scrollTop: number) => {
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const newEndIndex = Math.min(
      newStartIndex + Math.ceil(containerHeight / itemHeight),
      items.length
    );
    
    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  }, [itemHeight, containerHeight, items.length]);

  const visibleItems = React.useMemo(() => 
    items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  return {
    visibleItems,
    startIndex,
    endIndex,
    handleScroll,
  };
};
