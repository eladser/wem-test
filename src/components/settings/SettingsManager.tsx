
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { theme } from "@/lib/theme";
import { ExportSection } from "./ExportSection";
import { ImportSection } from "./ImportSection";
import { ResetSection } from "./ResetSection";

export const SettingsManager: React.FC = () => {
  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Settings className="w-5 h-5" />
          Settings Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExportSection />
          <ImportSection />
        </div>
        <ResetSection />
      </CardContent>
    </Card>
  );
};
