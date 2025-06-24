
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Clock, X, Filter, Bell } from 'lucide-react';
import { theme } from '@/lib/theme';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  site: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  priority: 'high' | 'medium' | 'low';
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Battery System Failure',
    description: 'Battery bank 3 offline - immediate attention required',
    site: 'Berlin Solar Farm',
    timestamp: '5 min ago',
    status: 'active',
    priority: 'high'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Low Efficiency Alert',
    description: 'Solar panel efficiency dropped below 85%',
    site: 'Munich Wind Farm',
    timestamp: '15 min ago',
    status: 'acknowledged',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'info',
    title: 'Maintenance Scheduled',
    description: 'Routine maintenance scheduled for tomorrow',
    site: 'Frankfurt Grid Station',
    timestamp: '1 hour ago',
    status: 'active',
    priority: 'low'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Grid Connection Issue',
    description: 'Intermittent connection detected',
    site: 'Hamburg Solar Array',
    timestamp: '2 hours ago',
    status: 'resolved',
    priority: 'medium'
  }
];

export const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filter === 'all' || alert.status === filter;
    const typeMatch = typeFilter === 'all' || alert.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'acknowledged': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
    ));
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
    ));
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const criticalAlertsCount = alerts.filter(a => a.type === 'critical' && a.status === 'active').length;

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <CardTitle className={theme.colors.text.primary}>Active Alerts</CardTitle>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {activeAlertsCount}
            </Badge>
            {criticalAlertsCount > 0 && (
              <Badge className="bg-red-600/30 text-red-300 border-red-600/40">
                {criticalAlertsCount} Critical
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className={`${theme.colors.text.secondary} mb-2`}>No alerts match your filters</p>
            <p className={theme.colors.text.muted}>All systems operating normally</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${theme.colors.text.primary}`}>
                        {alert.title}
                      </h4>
                      <Badge className={getAlertColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>
                    <p className={`text-sm ${theme.colors.text.secondary} mb-2`}>
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Site: {alert.site}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {alert.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                      >
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(alert.id)}
                        className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  {alert.status === 'acknowledged' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(alert.id)}
                      className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                      Resolve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(alert.id)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
