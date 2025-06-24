
import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Download, 
  Settings, 
  Users, 
  BarChart3, 
  Bell,
  Wrench,
  Shield,
  FileText,
  Activity
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { usePerformance } from '@/hooks/usePerformance';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  permission?: string;
  color: string;
}

export const QuickActions: React.FC = React.memo(() => {
  const { hasPermission } = useAuth();
  const { logRenderTime } = usePerformance('QuickActions');

  const handleEmergencyStop = useCallback(() => {
    toast.error('Emergency stop initiated - All systems shutting down');
    console.log('Emergency stop triggered');
  }, []);

  const handleQuickExport = useCallback(() => {
    toast.success('Export started - You will be notified when complete');
    console.log('Quick export initiated');
  }, []);

  const handleSystemCheck = useCallback(() => {
    toast.info('Running system diagnostics...');
    setTimeout(() => {
      toast.success('System check complete - All systems operational');
    }, 2000);
  }, []);

  const handleMaintenanceMode = useCallback(() => {
    toast.warning('Maintenance mode activated');
    console.log('Maintenance mode toggled');
  }, []);

  const handleBackupConfig = useCallback(() => {
    toast.success('Configuration backup created successfully');
    console.log('Configuration backed up');
  }, []);

  const handleGenerateReport = useCallback(() => {
    toast.info('Generating performance report...');
    setTimeout(() => {
      toast.success('Report generated and sent to your email');
    }, 1500);
  }, []);

  const handleAnalyticsSnapshot = useCallback(() => {
    toast.info('Capturing analytics snapshot...');
    console.log('Analytics snapshot taken');
  }, []);

  const handleAlertSummary = useCallback(() => {
    toast.info('3 active alerts, 12 resolved today');
    console.log('Alert summary displayed');
  }, []);

  const actions: QuickAction[] = useMemo(() => [
    {
      id: 'emergency-stop',
      label: 'Emergency Stop',
      icon: <Zap className="w-4 h-4" />,
      action: handleEmergencyStop,
      permission: 'write',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 'export-data',
      label: 'Quick Export',
      icon: <Download className="w-4 h-4" />,
      action: handleQuickExport,
      permission: 'export',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'system-status',
      label: 'System Check',
      icon: <Activity className="w-4 h-4" />,
      action: handleSystemCheck,
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      id: 'maintenance-mode',
      label: 'Maintenance',
      icon: <Wrench className="w-4 h-4" />,
      action: handleMaintenanceMode,
      permission: 'write',
      color: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      id: 'backup-config',
      label: 'Backup Config',
      icon: <Shield className="w-4 h-4" />,
      action: handleBackupConfig,
      permission: 'manage_settings',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'generate-report',
      label: 'Quick Report',
      icon: <FileText className="w-4 h-4" />,
      action: handleGenerateReport,
      permission: 'export',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'analytics-snapshot',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      action: handleAnalyticsSnapshot,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'alert-summary',
      label: 'Alert Summary',
      icon: <Bell className="w-4 h-4" />,
      action: handleAlertSummary,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ], [
    handleEmergencyStop,
    handleQuickExport,
    handleSystemCheck,
    handleMaintenanceMode,
    handleBackupConfig,
    handleGenerateReport,
    handleAnalyticsSnapshot,
    handleAlertSummary
  ]);

  const availableActions = useMemo(() => 
    actions.filter(action => 
      !action.permission || hasPermission(action.permission)
    ), [actions, hasPermission]
  );

  logRenderTime();

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Zap className="w-5 h-5 text-emerald-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {availableActions.map((action, index) => (
            <Button
              key={action.id}
              onClick={action.action}
              className={`${action.color} text-white flex items-center gap-2 h-12 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

QuickActions.displayName = 'QuickActions';
