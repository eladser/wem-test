import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// Types
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface DataCache<T> {
  get(key: string): T | null;
  set(key: string, data: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  size(): number;
  getStats(): CacheStats;
}

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
}

interface UseOptimizedDataOptions<T> {
  data: T[];
  pageSize?: number;
  enableVirtualization?: boolean;
  enableCaching?: boolean;
  cacheTTL?: number;
  searchFields?: (keyof T)[];
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  filterFn?: (item: T) => boolean;
  onDataChange?: (data: T[]) => void;
}

interface VirtualizationConfig {
  enabled: boolean;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface PerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  cacheHitRate: number;
  totalItems: number;
  visibleItems: number;
  memoryUsage: number;
}

// In-memory cache implementation
class MemoryCache<T> implements DataCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTTL: number;
  private stats = {
    hits: 0,
    misses: 0
  };
  
  constructor(maxSize = 1000, defaultTTL = 300000) { // 5 minutes default TTL
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }
  
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    entry.hits++;
    this.stats.hits++;
    return entry.data;
  }
  
  set(key: string, data: T, ttl = this.defaultTTL): void {
    // Evict old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }
  
  size(): number {
    return this.cache.size;
  }
  
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    
    return {
      totalEntries: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate,
      memoryUsage: this.estimateMemoryUsage()
    };
  }
  
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    let leastHits = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < leastHits || (entry.hits === leastHits && entry.timestamp < oldestTime)) {
        oldestKey = key;
        oldestTime = entry.timestamp;
        leastHits = entry.hits;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
  
  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2; // UTF-16 characters
      totalSize += JSON.stringify(entry.data).length * 2;
      totalSize += 32; // Entry metadata overhead
    }
    return totalSize;
  }
}

// Global cache instance
const globalCache = new MemoryCache();

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Performance monitoring hook
function usePerformanceMonitor(): {
  startTiming: (label: string) => void;
  endTiming: (label: string) => number;
  getMetrics: () => Record<string, number>;
} {
  const timings = useRef<Record<string, number>>({});
  const metrics = useRef<Record<string, number>>({});
  
  const startTiming = useCallback((label: string) => {
    timings.current[label] = performance.now();
  }, []);
  
  const endTiming = useCallback((label: string) => {
    if (timings.current[label]) {
      const duration = performance.now() - timings.current[label];
      metrics.current[label] = duration;
      delete timings.current[label];
      return duration;
    }
    return 0;
  }, []);
  
  const getMetrics = useCallback(() => ({ ...metrics.current }), []);
  
  return { startTiming, endTiming, getMetrics };
}

// Virtualization hook (simplified version without external dependency)
function useVirtualization<T>({
  data,
  enabled,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  data: T[];
  enabled: boolean;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + overscan, data.length);
  const visibleStartIndex = Math.max(0, startIndex - overscan);
  
  const virtualItems = enabled ? data.slice(visibleStartIndex, endIndex).map((item, index) => ({
    index: visibleStartIndex + index,
    start: (visibleStartIndex + index) * itemHeight,
    size: itemHeight,
    item
  })) : null;
  
  const totalSize = data.length * itemHeight;
  
  const scrollToIndex = useCallback((index: number) => {
    if (parentRef.current) {
      parentRef.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);
  
  const scrollToOffset = useCallback((offset: number) => {
    if (parentRef.current) {
      parentRef.current.scrollTop = offset;
    }
  }, []);
  
  useEffect(() => {
    const element = parentRef.current;
    if (!element || !enabled) return;
    
    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };
    
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [enabled]);
  
  return {
    parentRef,
    virtualItems,
    totalSize,
    scrollToIndex,
    scrollToOffset
  };
}

// Main optimized data hook
export const useOptimizedData = <T extends Record<string, any>>(
  options: UseOptimizedDataOptions<T>
): {
  processedData: T[];
  search: string;
  setSearch: (search: string) => void;
  sortField: keyof T | null;
  sortDirection: 'asc' | 'desc';
  setSorting: (field: keyof T, direction?: 'asc' | 'desc') => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
  virtualization: {
    parentRef: React.RefObject<HTMLDivElement>;
    virtualItems: any[] | null;
    totalSize: number;
    scrollToIndex: (index: number) => void;
  };
  performance: PerformanceMetrics;
  cache: {
    stats: CacheStats;
    clear: () => void;
  };
} => {
  const {
    data,
    pageSize = 50,
    enableVirtualization = false,
    enableCaching = true,
    cacheTTL = 300000,
    searchFields = [],
    sortField: initialSortField,
    sortDirection: initialSortDirection = 'asc',
    filterFn,
    onDataChange
  } = options;
  
  // State
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof T | null>(initialSortField || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  
  // Performance monitoring
  const { startTiming, endTiming, getMetrics } = usePerformanceMonitor();
  
  // Debounced search to prevent excessive filtering
  const debouncedSearch = useDebounce(search, 300);
  
  // Generate cache key for current filters
  const cacheKey = useMemo(() => {
    return `data-${JSON.stringify({
      search: debouncedSearch,
      sortField,
      sortDirection,
      filter: filterFn?.toString()
    })}`;
  }, [debouncedSearch, sortField, sortDirection, filterFn]);
  
  // Process data with caching
  const processedData = useMemo(() => {
    startTiming('dataProcessing');
    
    // Try cache first
    if (enableCaching) {
      const cached = globalCache.get(cacheKey);
      if (cached) {
        endTiming('dataProcessing');
        return cached as T[];
      }
    }
    
    let result = [...data];
    
    // Apply custom filter
    if (filterFn) {
      result = result.filter(filterFn);
    }
    
    // Apply search
    if (debouncedSearch && searchFields.length > 0) {
      const searchTerm = debouncedSearch.toLowerCase();
      result = result.filter(item => 
        searchFields.some(field => {
          const value = item[field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchTerm);
        })
      );
    }
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
        if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
        
        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    // Cache the result
    if (enableCaching) {
      globalCache.set(cacheKey, result, cacheTTL);
    }
    
    const processingTime = endTiming('dataProcessing');
    
    return result;
  }, [data, debouncedSearch, searchFields, sortField, sortDirection, filterFn, enableCaching, cacheKey, cacheTTL, startTiming, endTiming]);
  
  // Paginated data
  const paginatedData = useMemo(() => {
    if (enableVirtualization) {
      return processedData; // Virtualization handles "pagination"
    }
    
    const startIndex = currentPage * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, currentPageSize, enableVirtualization]);
  
  // Virtualization setup
  const virtualization = useVirtualization({
    data: processedData,
    enabled: enableVirtualization,
    itemHeight: 50, // Default item height
    containerHeight: 400, // Default container height
    overscan: 5
  });
  
  // Calculate total pages
  const totalPages = Math.ceil(processedData.length / currentPageSize);
  
  // Sorting helper
  const setSorting = useCallback((field: keyof T, direction?: 'asc' | 'desc') => {
    if (sortField === field && !direction) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(direction || 'asc');
    }
    setCurrentPage(0); // Reset to first page
  }, [sortField]);
  
  // Page management
  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);
  
  const setPageSize = useCallback((size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(0); // Reset to first page
  }, []);
  
  // Performance metrics
  const performance = useMemo((): PerformanceMetrics => {
    const metrics = getMetrics();
    const cacheStats = globalCache.getStats();
    
    return {
      renderTime: metrics.render || 0,
      dataProcessingTime: metrics.dataProcessing || 0,
      cacheHitRate: cacheStats.hitRate,
      totalItems: processedData.length,
      visibleItems: enableVirtualization 
        ? (virtualization.virtualItems?.length || 0)
        : Math.min(currentPageSize, processedData.length),
      memoryUsage: cacheStats.memoryUsage
    };
  }, [getMetrics, processedData.length, enableVirtualization, virtualization.virtualItems, currentPageSize]);
  
  // Cache management
  const cache = useMemo(() => ({
    stats: globalCache.getStats(),
    clear: () => globalCache.clear()
  }), []);
  
  // Notify data changes
  useEffect(() => {
    onDataChange?.(processedData);
  }, [processedData, onDataChange]);
  
  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, sortField, sortDirection]);
  
  return {
    processedData: enableVirtualization ? processedData : paginatedData,
    search,
    setSearch,
    sortField,
    sortDirection,
    setSorting,
    pagination: {
      currentPage,
      pageSize: currentPageSize,
      totalPages,
      setPage,
      setPageSize
    },
    virtualization,
    performance,
    cache
  };
};

// Hook for infinite scrolling
export const useInfiniteData = <T extends Record<string, any>>({
  fetchData,
  pageSize = 20,
  initialData = [],
  enabled = true
}: {
  fetchData: (page: number, pageSize: number) => Promise<{ data: T[]; hasMore: boolean }>;
  pageSize?: number;
  initialData?: T[];
  enabled?: boolean;
}) => {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const currentPage = useRef(0);
  
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchData(currentPage.current, pageSize);
      
      setData(prev => {
        // Deduplicate based on a simple id comparison
        const newData = [...prev];
        result.data.forEach(item => {
          if (!newData.find(existing => existing.id === item.id)) {
            newData.push(item);
          }
        });
        return newData;
      });
      
      setHasMore(result.hasMore);
      currentPage.current += 1;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, pageSize, isLoading, hasMore, enabled]);
  
  const reset = useCallback(() => {
    setData(initialData);
    setIsLoading(false);
    setHasMore(true);
    setError(null);
    currentPage.current = 0;
  }, [initialData]);
  
  // Auto-load first page
  useEffect(() => {
    if (enabled && data.length === 0 && !isLoading) {
      loadMore();
    }
  }, [enabled, data.length, isLoading, loadMore]);
  
  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset
  };
};

// Hook for data aggregation and statistics
export const useDataAggregation = <T extends Record<string, any>>({
  data,
  groupByField,
  aggregationFields,
  enabled = true
}: {
  data: T[];
  groupByField?: keyof T;
  aggregationFields?: Array<{
    field: keyof T;
    operation: 'sum' | 'avg' | 'min' | 'max' | 'count';
  }>;
  enabled?: boolean;
}) => {
  const aggregatedData = useMemo(() => {
    if (!enabled || !data.length) return {};
    
    if (!groupByField) {
      // Overall aggregation
      const result: Record<string, number> = {};
      
      aggregationFields?.forEach(({ field, operation }) => {
        const values = data.map(item => Number(item[field])).filter(v => !isNaN(v));
        
        switch (operation) {
          case 'sum':
            result[String(field)] = values.reduce((sum, val) => sum + val, 0);
            break;
          case 'avg':
            result[String(field)] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
            break;
          case 'min':
            result[String(field)] = values.length > 0 ? Math.min(...values) : 0;
            break;
          case 'max':
            result[String(field)] = values.length > 0 ? Math.max(...values) : 0;
            break;
          case 'count':
            result[String(field)] = values.length;
            break;
        }
      });
      
      return result;
    }
    
    // Group by field aggregation
    const groups = data.reduce((acc, item) => {
      const groupKey = String(item[groupByField]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, T[]>);
    
    const result: Record<string, Record<string, number>> = {};
    
    Object.entries(groups).forEach(([groupKey, groupData]) => {
      result[groupKey] = {};
      
      aggregationFields?.forEach(({ field, operation }) => {
        const values = groupData.map(item => Number(item[field])).filter(v => !isNaN(v));
        
        switch (operation) {
          case 'sum':
            result[groupKey][String(field)] = values.reduce((sum, val) => sum + val, 0);
            break;
          case 'avg':
            result[groupKey][String(field)] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
            break;
          case 'min':
            result[groupKey][String(field)] = values.length > 0 ? Math.min(...values) : 0;
            break;
          case 'max':
            result[groupKey][String(field)] = values.length > 0 ? Math.max(...values) : 0;
            break;
          case 'count':
            result[groupKey][String(field)] = values.length;
            break;
        }
      });
    });
    
    return result;
  }, [data, groupByField, aggregationFields, enabled]);
  
  return aggregatedData;
};

export default useOptimizedData;