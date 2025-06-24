
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calendar, Download, Filter, RefreshCw } from "lucide-react";
import { theme } from "@/lib/theme";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingButton } from "@/components/common/LoadingButton";
import { toast } from "sonner";

interface AnalyticsFilters {
  timeRange: string;
  metric: string;
  region: string;
}

export const EnhancedAnalyticsToolbar: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeRange: "7d",
    metric: "energy",
    region: "all"
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    console.log('Filter changed:', key, value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Analytics data refreshed");
      console.log('Analytics refreshed with filters:', filters);
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Report exported successfully");
      console.log('Exported analytics report');
    } catch (error) {
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} p-4`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <Select value={filters.timeRange} onValueChange={(value) => handleFilterChange('timeRange', value)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="1d">Last Day</SelectItem>
                <SelectItem value="7d">Last Week</SelectItem>
                <SelectItem value="30d">Last Month</SelectItem>
                <SelectItem value="90d">Last Quarter</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <Select value={filters.metric} onValueChange={(value) => handleFilterChange('metric', value)}>
              <SelectTrigger className="w-36 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="energy">Energy Production</SelectItem>
                <SelectItem value="efficiency">Efficiency</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="environmental">Environmental Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
              <SelectItem value="east">East Region</SelectItem>
              <SelectItem value="west">West Region</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status="online" text="Live Data" />
          
          <LoadingButton
            loading={isRefreshing}
            onClick={handleRefresh}
            variant="outline"
            className="border-emerald-500/30 text-emerald-400"
            loadingText="Refreshing..."
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </LoadingButton>

          <LoadingButton
            loading={isExporting}
            onClick={handleExport}
            className={theme.gradients.primary}
            loadingText="Exporting..."
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </LoadingButton>
        </div>
      </div>
    </Card>
  );
};
