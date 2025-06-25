
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
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">
              System Alerts
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Recent notifications for {siteName}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {alerts.length} Active
            </Badge>
            <Button variant="outline" size="sm" className="text-slate-600">
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
                    <p className="font-medium text-slate-900 mb-1">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
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
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-600">No active alerts</p>
            <p className="text-sm text-slate-500">All systems are running normally</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
