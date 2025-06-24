
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { theme } from '@/lib/theme';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  permission: string;
  color: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
  hasPermission: (permission: string) => boolean;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ actions, hasPermission }) => {
  return (
    <Card className={`lg:col-span-2 ${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={theme.colors.text.primary}>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
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
  );
};
