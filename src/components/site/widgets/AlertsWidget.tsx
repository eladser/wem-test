
import React from 'react';
import { WidgetContainer } from './WidgetContainer';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertCircle, ExternalLink } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

interface AlertsWidgetProps {
  alerts?: Alert[];
  onRemove?: () => void;
  className?: string;
}

export const AlertsWidget = ({ 
  alerts = [], 
  onRemove,
  className 
}: AlertsWidgetProps) => {
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Temperature',
      message: 'Panel temperature exceeding normal range',
      timestamp: '2 min ago',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'info',
      title: 'Maintenance Scheduled',
      message: 'Routine maintenance planned for tomorrow',
      timestamp: '1 hour ago',
      severity: 'low'
    },
    {
      id: '3',
      type: 'error',
      title: 'Grid Connection Issue',
      message: 'Intermittent connectivity detected',
      timestamp: '3 hours ago',
      severity: 'high'
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'warning': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'info': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  return (
    <WidgetContainer 
      title={`Recent Alerts (${displayAlerts.length})`}
      onRemove={onRemove}
      className={className}
    >
      <div className="space-y-3">
        {displayAlerts.slice(0, 3).map((alert) => (
          <div 
            key={alert.id}
            className="p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 ${getAlertColor(alert.type)} p-1 rounded`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white truncate">{alert.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getAlertColor(alert.type)} border-current`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{alert.message}</p>
                  <span className="text-xs text-slate-500">{alert.timestamp}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {displayAlerts.length > 3 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            View All Alerts ({displayAlerts.length})
          </Button>
        )}

        {displayAlerts.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm text-slate-400">No active alerts</p>
            <p className="text-xs text-slate-500 mt-1">All systems operational</p>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
};
