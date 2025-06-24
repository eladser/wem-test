
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Maximize2, RefreshCw } from "lucide-react";
import { theme } from "@/lib/theme";
import { LoadingButton } from "@/components/common/LoadingButton";
import { toast } from "sonner";

interface ChartData {
  title: string;
  subtitle?: string;
  chartType: "line" | "bar" | "area" | "pie";
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  color?: string;
}

interface EnhancedChartCardProps {
  chart: ChartData;
  allowTimeRangeSelection?: boolean;
  allowExport?: boolean;
  className?: string;
}

export const EnhancedChartCard: React.FC<EnhancedChartCardProps> = ({
  chart,
  allowTimeRangeSelection = true,
  allowExport = true,
  className = ""
}) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${chart.title} chart exported`);
      console.log('Chart exported:', chart.title);
    } catch (error) {
      toast.error("Failed to export chart");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Chart data refreshed");
      console.log('Chart refreshed:', chart.title);
    } catch (error) {
      toast.error("Failed to refresh chart");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFullscreen = () => {
    toast.info("Fullscreen view coming soon");
    console.log('Fullscreen requested for:', chart.title);
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`text-lg ${theme.colors.text.primary}`}>
              {chart.title}
            </CardTitle>
            {chart.subtitle && (
              <p className={`text-sm ${theme.colors.text.muted} mt-1`}>
                {chart.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {allowTimeRangeSelection && (
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24 h-8 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="1d">1D</SelectItem>
                  <SelectItem value="7d">7D</SelectItem>
                  <SelectItem value="30d">30D</SelectItem>
                  <SelectItem value="90d">90D</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>

            {allowExport && (
              <LoadingButton
                loading={isExporting}
                onClick={handleExport}
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </LoadingButton>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${theme.colors.text.accent}`}>
              {chart.chartType.toUpperCase()}
            </div>
            <p className={`text-sm ${theme.colors.text.muted}`}>
              {chart.title} Chart Placeholder
            </p>
            <p className={`text-xs ${theme.colors.text.muted}`}>
              Time Range: {timeRange}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Data points: {chart.data.length}</span>
          <span>Last updated: just now</span>
        </div>
      </CardContent>
    </Card>
  );
};
