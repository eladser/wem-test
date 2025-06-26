import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// Base skeleton component
export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-800/50",
        className
      )}
      {...props}
    />
  );
};

// Card skeleton
export const CardSkeleton: React.FC<{ lines?: number; hasHeader?: boolean }> = ({ 
  lines = 3, 
  hasHeader = true 
}) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6 space-y-4">
      {hasHeader && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
};

// Chart skeleton
export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = "h-64" }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className={cn("relative", height)}>
          <Skeleton className="absolute inset-0" />
          {/* Fake chart elements */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex justify-between">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-2 w-12" />
              ))}
            </div>
          </div>
          <div className="absolute top-4 left-4 space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-2 w-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Table skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  hasHeader?: boolean 
}> = ({ 
  rows = 5, 
  columns = 4, 
  hasHeader = true 
}) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg overflow-hidden">
      {hasHeader && (
        <div className="border-b border-slate-700/50 p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }, (_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      )}
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Metrics card skeleton
export const MetricsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
};

// Dashboard skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Metrics cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <MetricsCardSkeleton key={i} />
        ))}
      </div>

      {/* Main chart skeleton */}
      <ChartSkeleton height="h-96" />

      {/* Secondary content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={6} />
        <CardSkeleton lines={3} />
      </div>

      {/* Table skeleton */}
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
};

// Site list skeleton
export const SiteListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Navigation skeleton
export const NavigationSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
};

// Form skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

// Loading wrapper component
interface LoadingWrapperProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  error?: Error | null;
  errorFallback?: React.ReactNode;
  loadingDelay?: number;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  skeleton,
  children,
  error,
  errorFallback,
  loadingDelay = 0
}) => {
  const [showLoading, setShowLoading] = React.useState(loadingDelay === 0);

  React.useEffect(() => {
    if (loadingDelay > 0 && isLoading) {
      const timer = setTimeout(() => setShowLoading(true), loadingDelay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingDelay]);

  if (error && errorFallback) {
    return <>{errorFallback}</>;
  }

  if (isLoading && showLoading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
};

// Shimmer effect skeleton
export const ShimmerSkeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-800/50 rounded-md",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:animate-[shimmer_2s_infinite]",
        className
      )}
      {...props}
    />
  );
};

// Progressive loading skeleton (loads in stages)
export const ProgressiveLoadingSkeleton: React.FC<{
  stages: React.ReactNode[];
  currentStage: number;
}> = ({ stages, currentStage }) => {
  return <>{stages[Math.min(currentStage, stages.length - 1)]}</>;
};

export default Skeleton;