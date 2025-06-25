
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Bell, 
  Download, 
  Settings, 
  Zap, 
  TrendingUp, 
  MapPin,
  Calendar,
  Users,
  Shield
} from 'lucide-react';
import { theme } from '@/lib/theme';

interface SiteHeaderProps {
  site: {
    id: string;
    name: string;
    location: string;
    status: 'online' | 'maintenance' | 'offline';
    currentOutput: number;
    totalCapacity: number;
    efficiency: number;
  };
}

export const EnhancedSiteHeader: React.FC<SiteHeaderProps> = ({ site }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          icon: <Activity className="w-4 h-4" />,
          pulse: 'bg-emerald-400'
        };
      case 'maintenance':
        return {
          color: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          icon: <Settings className="w-4 h-4" />,
          pulse: 'bg-amber-400'
        };
      case 'offline':
        return {
          color: 'bg-red-500/20 text-red-300 border-red-400/40',
          icon: <Shield className="w-4 h-4" />,
          pulse: 'bg-red-400'
        };
      default:
        return {
          color: 'bg-slate-500/20 text-slate-300 border-slate-400/40',
          icon: <Activity className="w-4 h-4" />,
          pulse: 'bg-slate-400'
        };
    }
  };

  const statusConfig = getStatusConfig(site.status);

  return (
    <div className="relative overflow-hidden">
      {/* Background with enhanced gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-violet-500/5" />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 px-8 py-8">
        {/* Main header content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Site info section */}
          <div className="flex items-center gap-6">
            {/* Site icon */}
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all duration-500">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            </div>
            
            {/* Site details */}
            <div className="space-y-3">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">
                  {site.name}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">{site.location}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2 text-slate-300">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">{site.totalCapacity}MW Capacity</span>
                  </div>
                </div>
              </div>
              
              {/* Status and metrics */}
              <div className="flex items-center gap-4">
                <Badge className={`${statusConfig.color} font-semibold px-4 py-2 flex items-center gap-2`}>
                  {statusConfig.icon}
                  <span className="capitalize">{site.status}</span>
                  <div className={`w-2 h-2 ${statusConfig.pulse} rounded-full animate-pulse`} />
                </Badge>
                
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/20 rounded-xl px-4 py-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold text-sm">{site.efficiency}% Efficiency</span>
                </div>
                
                <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 rounded-xl px-4 py-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300 font-semibold text-sm">{site.currentOutput}MW Output</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-violet-400/40 text-violet-300 hover:bg-violet-500/10 bg-violet-500/5 backdrop-blur-xl shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
            >
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 bg-emerald-500/5 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-400/40 text-slate-300 hover:bg-slate-500/10 bg-slate-500/5 backdrop-blur-xl shadow-lg hover:shadow-slate-500/20 transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {/* Quick stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-600/30 hover:border-emerald-400/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Today's Generation</p>
                <p className="text-xl font-bold text-white mt-1">2,847 kWh</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-600/30 hover:border-cyan-400/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Uptime</p>
                <p className="text-xl font-bold text-white mt-1">99.2%</p>
              </div>
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-600/30 hover:border-violet-400/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Last Maintenance</p>
                <p className="text-xl font-bold text-white mt-1">12 days</p>
              </div>
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-violet-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-600/30 hover:border-amber-400/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Alerts</p>
                <p className="text-xl font-bold text-white mt-1">3</p>
              </div>
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
