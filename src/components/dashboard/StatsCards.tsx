
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { theme } from '@/lib/theme';

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
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
  );
};
