
import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface SafeComponentProps {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
}

export const SafeComponent: React.FC<SafeComponentProps> = ({
  children,
  componentName = 'Component',
  fallback
}) => {
  const defaultFallback = (
    <Card className="bg-slate-900/50 border-red-900/30">
      <CardContent className="p-4 text-center">
        <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">
          {componentName} failed to load
        </p>
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary fallback={fallback || defaultFallback}>
      {children}
    </ErrorBoundary>
  );
};
