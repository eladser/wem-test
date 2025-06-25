
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Zap, Settings, TrendingUp, Eye, X } from "lucide-react";

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  component: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'acknowledged';
}

interface EnhancedAlertsCardProps {
  siteName: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Battery optimization recommended',
    description: 'Battery efficiency has decreased by 3% over the last 24 hours',
    component: 'Battery Pack #1',
    time: '2 min ago',
    severity: 'medium',
    status: 'active'
  },
  {
    id: '2',
    type: 'success',
    title: 'Peak performance achieved',
    description: 'Solar array is operating at 98% efficiency',
    component: 'Solar Array #1',
    time: '15 min ago',
    severity: 'low',
    status: 'active'
  },
  {
    id: '3',
    type: 'error',
    title: 'Grid connection unstable',
    description: 'Intermittent connection issues detected',
    component: 'Grid Interface',
    time: '1 hour ago',
    severity: 'high',
    status: 'acknowledged'
  },
  {
    id: '4',
    type: 'info',
    title: 'Scheduled maintenance reminder',
    description: 'Preventive maintenance due in 3 days',
    component: 'Wind Turbine #2',
    time: '3 hours ago',
    severity: 'low',
    status: 'active'
  }
];

export const EnhancedAlertsCard: React.FC<EnhancedAlertsCardProps> = ({ siteName }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'high'>('all');

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getAlertColors = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-500/10 border-red-500/20',
          text: 'text-red-400',
          badge: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        };
      case 'success':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        };
    }
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Medium</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">Low</Badge>;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.status === 'active';
    if (filter === 'high') return alert.severity === 'high';
    return true;
  });

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const highSeverityCount = alerts.filter(a => a.severity === 'high' && a.status === 'active').length;

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-amber-500/30 transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                System Alerts
                {highSeverityCount > 0 && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                )}
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                {siteName} monitoring and alerts
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
              {activeCount} Active
            </Badge>
            {highSeverityCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                {highSeverityCount} High
              </Badge>
            )}
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="text-xs"
          >
            All ({alerts.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
            className="text-xs"
          >
            Active ({activeCount})
          </Button>
          <Button
            variant={filter === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('high')}
            className="text-xs"
          >
            High Priority ({highSeverityCount})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.map((alert, index) => {
          const colors = getAlertColors(alert.type);
          
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${colors.bg} hover:bg-opacity-80 transition-all duration-300 group animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`${colors.text} mt-1`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-white font-semibold text-sm">
                        {alert.title}
                      </h4>
                      {getSeverityBadge(alert.severity)}
                      {alert.status === 'acknowledged' && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-slate-300 text-sm">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Settings className="w-3 h-3" />
                          {alert.component}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No alerts to display</p>
            <p className="text-slate-500 text-sm">All systems operating normally</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
