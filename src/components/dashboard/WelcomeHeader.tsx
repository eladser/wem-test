
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { theme } from '@/lib/theme';

interface User {
  name?: string;
  role?: string;
  permissions: string[];
}

interface WelcomeHeaderProps {
  user: User | null;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => {
  return (
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
  );
};
