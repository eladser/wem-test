
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Bell, Zap, Thermometer, Battery } from 'lucide-react';
import { theme } from '@/lib/theme';
import { toast } from 'sonner';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  site: string;
  category: 'performance' | 'maintenance' | 'safety' | 'environmental';
  icon: React.ComponentType<any>;
}

const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'High Temperature Warning',
    description: 'Inverter temperature exceeding normal operating range',
    severity: 'high',
    status: 'active',
    timestamp: '2 min ago',
    site: 'Solar Farm Alpha',
    category: 'environmental',
    icon: Thermometer
  },
  {
    id: 'alert-2',
    title: 'Efficiency Drop Detected',
    description: 'Overall system efficiency dropped below 85%',
    severity: 'medium',
    status: 'acknowledged',
    timestamp: '15 min ago',
    site: 'Wind Farm Beta',
    category: 'performance',
    icon: Zap
  },
  {
    id: 'alert-3',
    title: 'Battery Level Critical',
    description: 'Battery bank capacity below 20%',
    severity: 'critical',
    status: 'active',
    timestamp: '1 hour ago',
    site: 'Hydro Station Gamma',
    category: 'maintenance',
    icon: Battery
  },
  {
    id: 'alert-4',
    title: 'Maintenance Due',
    description: 'Scheduled maintenance required for turbine 3',
    severity: 'low',
    status: 'resolved',
    timestamp: '3 hours ago',
    site: 'Wind Farm Beta',
    category: 'maintenance',
    icon: AlertTriangle
  }
];

export const AlertManagement: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
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
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' as const }
        : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const }
        : alert
    ));
    toast.success('Alert resolved');
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <CardTitle className={theme.colors.text.primary}>Alert Management</CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {activeAlertsCount} Active
              </Badge>
              {criticalAlertsCount > 0 && (
                <Badge className="bg-red-600/20 text-red-300 border-red-600/30">
                  {criticalAlertsCount} Critical
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600"
            />
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className={`${theme.colors.text.muted}`}>No alerts match your filters</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <alert.icon className="w-4 h-4 text-slate-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${theme.colors.text.primary}`}>{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm ${theme.colors.text.muted} mb-2`}>
                          {alert.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp}
                          </span>
                          <span>{alert.site}</span>
                          <span className="capitalize">{alert.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {alert.status === 'active' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(alert.id)}
                            className="border-amber-600 text-amber-400 hover:bg-amber-600/10"
                          >
                            Acknowledge
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolve(alert.id)}
                            className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(alert.id)}
                          className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
