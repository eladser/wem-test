
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { theme } from '@/lib/theme';

interface Alert {
  id: number;
  title: string;
  site: string;
  severity: 'error' | 'warning' | 'info';
  time: string;
}

interface DashboardAlertsCardProps {
  alerts: Alert[];
  hasPermission: (permission: string) => boolean;
}

export const DashboardAlertsCard: React.FC<DashboardAlertsCardProps> = ({ alerts, hasPermission }) => {
  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={theme.colors.text.primary}>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
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
  );
};
