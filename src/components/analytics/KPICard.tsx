
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  trend: 'up' | 'down';
}

export const KPICard = ({ title, value, change, icon: Icon, color, trend }: KPICardProps) => {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 hover:border-emerald-500/30 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color} group-hover:scale-110 transition-transform`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className={`text-xs flex items-center mt-1 ${
          trend === 'up' ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
};
