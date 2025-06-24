
import { useState } from 'react';
import { Search, Download, Settings, Filter, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const AnalyticsToolbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    console.log('Searching for:', value);
    // Implement search functionality here
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics data is being exported...",
    });
    console.log('Exporting analytics data...');
    // Implement export functionality
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated.",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Analytics settings panel opened.",
    });
    console.log('Opening settings...');
    // Implement settings functionality
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          Analytics Dashboard
        </h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Live Data
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Q2 2024
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search metrics..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 w-64"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSettings}
          className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};
