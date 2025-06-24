
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Settings, 
  Shield, 
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { Link } from 'react-router-dom';

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
      severity: 'warning',
      time: '2 minutes ago'
    },
    {
      id: 2,
      title: 'Maintenance Required',
      site: 'Wind Farm Beta',
      severity: 'info',
      time: '1 hour ago'
    },
    {
      id: 3,
      title: 'Grid Connection Issue',
      site: 'Hydro Plant Gamma',
      severity: 'error',
      time: '3 hours ago'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="animate-slide-in-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${theme.colors.text.primary}`}>
              Welcome back, {user?.name}
            </h1>
            <p className={`${theme.colors.text.muted} mt-1`}>
              Here's what's happening with your renewable energy systems today.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                {user?.role}
              </Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-400">
                {user?.permissions.length} permissions
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm ${theme.colors.text.muted}`}>Last login</div>
            <div className={`text-lg font-semibold ${theme.colors.text.primary}`}>
              Today, 9:30 AM
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {stats.map((stat, index) => (
          <Card key={stat.title} className={`${theme.colors.background.card} ${theme.colors.border.accent}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme.colors.text.muted}`}>{stat.title}</p>
                  <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{stat.value}</p>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className={`lg:col-span-2 ${theme.colors.background.card} ${theme.colors.border.primary}`}>
          <CardHeader>
            <CardTitle className={theme.colors.text.primary}>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div key={action.title}>
                  {hasPermission(action.permission) ? (
                    <Link to={action.link}>
                      <div className={`p-4 rounded-lg border ${theme.colors.border.primary} hover:border-${action.color}-500/30 bg-slate-800/30 hover:bg-${action.color}-500/10 transition-all duration-200 cursor-pointer group`}>
                        <div className="flex items-center gap-3">
                          <action.icon className={`w-6 h-6 text-${action.color}-400 group-hover:scale-110 transition-transform`} />
                          <div>
                            <h3 className={`font-medium ${theme.colors.text.primary}`}>{action.title}</h3>
                            <p className={`text-sm ${theme.colors.text.muted}`}>{action.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className={`p-4 rounded-lg border ${theme.colors.border.primary} bg-slate-800/10 opacity-50`}>
                      <div className="flex items-center gap-3">
                        <action.icon className={`w-6 h-6 text-slate-500`} />
                        <div>
                          <h3 className={`font-medium text-slate-500`}>{action.title}</h3>
                          <p className={`text-sm text-slate-600`}>No permission</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
          <CardHeader>
            <CardTitle className={theme.colors.text.primary}>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${theme.colors.border.primary} bg-slate-800/30`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'error' ? 'bg-red-400' :
                    alert.severity === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${theme.colors.text.primary}`}>
                      {alert.title}
                    </h4>
                    <p className={`text-xs ${theme.colors.text.muted}`}>{alert.site}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hasPermission('read') && (
              <Button variant="outline" className="w-full mt-3" asChild>
                <Link to="/region/north-america">View All Alerts</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
