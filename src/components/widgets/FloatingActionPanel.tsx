import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  Bell,
  Search,
  Filter,
  MoreVertical,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const FloatingActionPanel = ({ isOpen, onToggle, className }: FloatingActionPanelProps) => {
  const [activeSection, setActiveSection] = useState<string>('quick');

  const quickActions = [
    { id: 'add-site', label: 'Add Site', icon: Plus, color: 'emerald' },
    { id: 'refresh', label: 'Refresh Data', icon: RefreshCw, color: 'blue' },
    { id: 'export', label: 'Export Data', icon: Download, color: 'purple' },
    { id: 'import', label: 'Import Config', icon: Upload, color: 'amber' },
  ];

  const monitoringActions = [
    { id: 'alerts', label: 'View Alerts', icon: Bell, color: 'red', badge: '3' },
    { id: 'search', label: 'Advanced Search', icon: Search, color: 'cyan' },
    { id: 'filter', label: 'Apply Filters', icon: Filter, color: 'violet' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'slate' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40 hover:bg-purple-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30',
      cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30',
      violet: 'bg-violet-500/20 text-violet-400 border-violet-500/40 hover:bg-violet-500/30',
      slate: 'bg-slate-500/20 text-slate-400 border-slate-500/40 hover:bg-slate-500/30',
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Floating Panel */}
      <div className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-300",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        <Card className="w-80 glass border-slate-700/50 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                variant={activeSection === 'quick' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSection('quick')}
                className={activeSection === 'quick' 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "glass border-slate-600 text-slate-300"
                }
              >
                Quick
              </Button>
              <Button
                variant={activeSection === 'monitoring' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSection('monitoring')}
                className={activeSection === 'monitoring' 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "glass border-slate-600 text-slate-300"
                }
              >
                Monitor
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {activeSection === 'quick' && (
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className={`w-full justify-start gap-3 glass border-slate-600/50 ${getColorClasses(action.color)} transition-all duration-200`}
                    onClick={() => console.log(`Action: ${action.id}`)}
                  >
                    <action.icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            )}
            
            {activeSection === 'monitoring' && (
              <div className="space-y-2">
                {monitoringActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className={`w-full justify-start gap-3 glass border-slate-600/50 ${getColorClasses(action.color)} transition-all duration-200`}
                    onClick={() => console.log(`Action: ${action.id}`)}
                  >
                    <action.icon className="w-4 h-4" />
                    <span>{action.label}</span>
                    {action.badge && (
                      <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/40 text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="pt-3 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MoreVertical className="w-3 h-3" />
                <span>More actions available in settings</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Toggle Button */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg animate-glow"
        >
          <Plus className="w-5 h-5 text-white" />
        </Button>
      )}
    </>
  );
};
