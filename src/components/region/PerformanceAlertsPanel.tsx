
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, TrendingDown, TrendingUp } from 'lucide-react';
import { theme } from '@/lib/theme';

export const PerformanceAlertsPanel: React.FC = () => {
  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardHeader>
        <CardTitle className={`text-lg ${theme.colors.text.primary} flex items-center gap-2`}>
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Performance Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className={`text-sm ${theme.colors.text.primary}`}>High Temperature Alert</span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            Active
          </Badge>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className={`text-sm ${theme.colors.text.primary}`}>Efficiency Drop Detected</span>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Critical
          </Badge>
        </div>
        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className={`text-sm ${theme.colors.text.primary}`}>Performance Optimized</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Resolved
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
