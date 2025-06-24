
import React, { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { LoadingButton } from "@/components/common/LoadingButton";
import { withAsyncHandler, createMockApiCall } from "@/lib/asyncUtils";

interface SettingsBackup {
  timestamp: string;
  version: string;
  general: Record<string, any>;
  notifications: Record<string, any>;
  security: Record<string, any>;
  integrations: Record<string, any>;
}

export const ExportSection: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSettings = async () => {
    setIsExporting(true);
    
    const result = await withAsyncHandler(
      async () => {
        // Simulate gathering settings from all components
        const backup: SettingsBackup = {
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          general: {
            company: "EnergyOS Corp",
            timezone: "utc",
            darkMode: true,
            autoSync: true
          },
          notifications: {
            systemAlerts: true,
            performanceReports: true,
            emailNotifications: true
          },
          security: {
            twoFactorEnabled: true,
            sessionTimeout: 30
          },
          integrations: {
            weatherApi: { configured: false },
            gridData: { configured: true }
          }
        };
        
        await createMockApiCall(backup, 500);
        return backup;
      }
    );

    if (result.success && result.data) {
      // Create and download the backup file
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `energyos-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Settings exported successfully!");
    } else {
      toast.error("Failed to export settings");
    }

    setIsExporting(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-emerald-400" />
        <h4 className={`font-medium ${theme.colors.text.secondary}`}>Export Settings</h4>
      </div>
      <p className={`text-sm ${theme.colors.text.muted}`}>
        Download a backup of all your current settings
      </p>
      <LoadingButton
        loading={isExporting}
        onClick={handleExportSettings}
        loadingText="Exporting..."
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Settings
      </LoadingButton>
    </div>
  );
};
