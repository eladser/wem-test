
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, Clock, Zap, Thermometer, Battery, Search, Filter, Bell } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'performance' | 'maintenance' | 'security' | 'system';
  timestamp: string;
  source: string;
  status: 'active' | 'acknowledged' | 'resolved';
  icon: React.ComponentType<any>;
}

interface SmartAlertsPanelProps {
  className?: string;
}

export const SmartAlertsPanel = ({ className = "" }: SmartAlertsPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const alerts: Alert[] = [
    {
      id: '1',
      title: 'High Temperature Warning',
      description: 'Solar panel temperature exceeded 65°C at Site Alpha',
      severity: 'warning',
      category: 'performance',
      timestamp: '2 min ago',
      source: 'Site Alpha - Panel 12',
      status: 'active',
      icon: Thermometer
    },
    {
      id: '2',
      title: 'Battery Capacity Drop',
      description: 'Battery bank showing 15% capacity reduction',
      severity: 'critical',
      category: 'maintenance',
      timestamp: '5 min ago',
      source: 'Site Beta - Battery Bank 2',
      status: 'acknowledged',
      icon: Battery
    },
    {
      id: '3',
      title: 'Grid Connection Fluctuation',
      description: 'Voltage fluctuations detected in grid connection',
      severity: 'warning',
      category: 'system',
      timestamp: '12 min ago',
      source: 'Site Gamma - Grid Interface',
      status: 'active',
      icon: Zap
    },
    {
      id: '4',
      title: 'Scheduled Maintenance Due',
      description: 'Routine maintenance scheduled for tomorrow',
      severity: 'info',
      category: 'maintenance',
      timestamp: '1 hour ago',
      source: 'Site Delta - Wind Turbine 3',
      status: 'active',
      icon: Clock
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesCategory = categoryFilter === "all" || alert.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'acknowledged': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <Card className={`glass border-slate-700/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-400" />
            <CardTitle className="text-white">Smart Alerts</CardTitle>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              {filteredAlerts.length} active
            </Badge>
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            Manage Rules
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3 pt-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-slate-600 text-white"
            />
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32 glass border-slate-600">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="glass border-slate-600">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 glass border-slate-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="glass border-slate-600">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-medium">No alerts found</p>
            <p className="text-slate-400 text-sm">All systems operating normally</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className="p-4 glass rounded-lg border border-slate-600/50 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'amber' : 'blue'}-500/10 border border-${alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'amber' : 'blue'}-500/20`}>
                  <alert.icon className={`w-4 h-4 text-${alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'amber' : 'blue'}-400`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-medium">{alert.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
                        {alert.severity}
                      </Badge>
                      <Badge className={`${getStatusColor(alert.status)} text-xs`}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-2">{alert.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{alert.source}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs glass border-slate-600">
                      Acknowledge
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs glass border-slate-600">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
