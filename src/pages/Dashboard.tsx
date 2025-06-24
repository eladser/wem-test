
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Settings, 
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { DashboardAlertsCard } from '@/components/dashboard/DashboardAlertsCard';

const Dashboard = () => {
  const { user, hasPermission } = useAuth();

  const stats = [
    {
      title: 'Total Energy Production',
      value: '1,247 MWh',
      change: '+12.5%',
      icon: Zap,
      color: 'emerald'
    },
    {
      title: 'System Efficiency',
      value: '94.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Active Sites',
      value: '24',
      change: '+1',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Active Alerts',
      value: '3',
      change: '-2',
      icon: AlertTriangle,
      color: 'yellow'
    }
  ];

  const quickActions = [
    {
      title: 'View Analytics',
      description: 'Detailed performance metrics',
      icon: BarChart3,
      link: '/analytics',
      permission: 'read',
      color: 'emerald'
    },
    {
      title: 'Export Reports',
      description: 'Generate system reports',
      icon: FileText,
      link: '/region/north-america',
      permission: 'export',
      color: 'blue'
    },
    {
      title: 'Manage Users',
      description: 'User administration',
      icon: Users,
      link: '/settings',
      permission: 'manage_users',
      color: 'purple'
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters',
      icon: Settings,
      link: '/settings',
      permission: 'manage_settings',
      color: 'orange'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      title: 'High Temperature Warning',
      site: 'Solar Farm Alpha',
      severity: 'warning' as const,
      time: '2 minutes ago'
    },
    {
      id: 2,
      title: 'Maintenance Required',
      site: 'Wind Farm Beta',
      severity: 'info' as const,
      time: '1 hour ago'
    },
    {
      id: 3,
      title: 'Grid Connection Issue',
      site: 'Hydro Plant Gamma',
      severity: 'error' as const,
      time: '3 hours ago'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <WelcomeHeader user={user} />
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActionsGrid actions={quickActions} hasPermission={hasPermission} />
        <DashboardAlertsCard alerts={recentAlerts} hasPermission={hasPermission} />
      </div>
    </div>
  );
};

export default Dashboard;
