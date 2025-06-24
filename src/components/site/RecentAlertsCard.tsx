
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface RecentAlertsCardProps {
  siteName: string;
}

export const RecentAlertsCard: React.FC<RecentAlertsCardProps> = React.memo(({ siteName }) => {
  return (
    <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-up">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-400 animate-pulse" />
          <span>Recent Alerts for {siteName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Battery optimization recommended</p>
                <p className="text-slate-400 text-sm">{siteName} - Battery Pack #1</p>
              </div>
            </div>
            <span className="text-slate-400 text-sm">2 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all duration-200 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Peak performance achieved</p>
                <p className="text-slate-400 text-sm">{siteName} - Solar Array #1</p>
              </div>
            </div>
            <span className="text-slate-400 text-sm">15 min ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

RecentAlertsCard.displayName = 'RecentAlertsCard';
