
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, XCircle, Clock } from "lucide-react";

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface EnhancedAlertsCardProps {
  siteName: string;
}

export const EnhancedAlertsCard: React.FC<EnhancedAlertsCardProps> = ({ siteName }) => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      message: 'Battery level below optimal threshold',
      timestamp: '2 minutes ago',
      priority: 'medium'
    },
    {
      id: '2',
      type: 'info',
      message: 'Scheduled maintenance reminder for tomorrow',
      timestamp: '1 hour ago',
      priority: 'low'
    },
    {
      id: '3',
      type: 'success',
      message: 'System efficiency target achieved',
      timestamp: '3 hours ago',
      priority: 'low'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">
              System Alerts
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              Recent notifications for {siteName}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {alerts.length} Active
            </Badge>
            <Button variant="outline" size="sm" className="text-slate-400 bg-slate-800 border-slate-600 hover:bg-slate-700 hover:text-white">
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${getAlertColor(alert.type)} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-white mb-1">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                <Badge className={`${getPriorityColor(alert.priority)} text-xs`}>
                  {alert.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-300">No active alerts</p>
            <p className="text-sm text-slate-500">All systems are running normally</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
