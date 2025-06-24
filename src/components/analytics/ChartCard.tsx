
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = ({ title, description, children, className = '' }: ChartCardProps) => {
  return (
    <Card className={`bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 hover:border-emerald-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
