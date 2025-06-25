
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';

interface RegionAlertsPanelProps {
  regionId: string;
}

export const RegionAlertsPanel = ({ regionId }: RegionAlertsPanelProps) => {
  // Mock alerts data - in real app this would come from an API
  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'High Temperature Detected',
      message: 'Panel temperature exceeding normal range at Solar Farm Alpha',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      severity: 'medium',
      site: 'Solar Farm Alpha',
      status: 'active'
    },
    {
      id: '2',
      type: 'error',
      title: 'Grid Connection Issue',
      message: 'Intermittent connectivity detected at Wind Farm Beta',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      severity: 'high',
      site: 'Wind Farm Beta',
      status: 'active'
    },
    {
      id: '3',
      type: 'success',
      title: 'Maintenance Completed',
      message: 'Scheduled maintenance successfully completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      severity: 'low',
      site: 'Hydro Station Gamma',
      status: 'resolved'
    },
    {
      id: '4',
      type: 'info',
      title: 'Performance Optimization',
      message: 'Energy output increased by 5% after recent upgrades',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      severity: 'low',
      site: 'Solar Farm Delta',
      status: 'resolved'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Region Alerts
          </CardTitle>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            {activeAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {alerts.slice(0, 4).map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border transition-all ${
              alert.status === 'active' 
                ? 'border-slate-600 bg-slate-800/50' 
                : 'border-slate-700 bg-slate-800/30 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-medium text-white text-sm truncate">
                    {alert.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
                      {alert.severity}
                    </Badge>
                    {alert.status === 'active' && (
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-slate-400 mb-2">
                  {alert.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{getTimeAgo(alert.timestamp)}</span>
                    <span>•</span>
                    <span>{alert.site}</span>
                  </div>
                  
                  {alert.status === 'active' && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-emerald-400 hover:text-emerald-300">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-medium">All Systems Normal</p>
            <p className="text-slate-400 text-sm mt-1">No active alerts in this region</p>
          </div>
        )}
        
        {alerts.length > 4 && (
          <Button variant="outline" size="sm" className="w-full bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700">
            View All Alerts ({alerts.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
