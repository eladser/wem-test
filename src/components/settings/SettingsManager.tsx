
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, FileText, Settings } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { LoadingButton } from "@/components/common/LoadingButton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { withAsyncHandler, createMockApiCall } from "@/lib/asyncUtils";

interface SettingsBackup {
  timestamp: string;
  version: string;
  general: Record<string, any>;
  notifications: Record<string, any>;
  security: Record<string, any>;
  integrations: Record<string, any>;
}

export const SettingsManager: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setSelectedFile(file);
        setShowImportDialog(true);
      } else {
        toast.error("Please select a valid JSON file");
      }
    }
  };

  const handleImportSettings = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    
    const result = await withAsyncHandler(
      async () => {
        const text = await selectedFile.text();
        const backup = JSON.parse(text) as SettingsBackup;
        
        // Validate backup structure
        if (!backup.timestamp || !backup.version) {
          throw new Error("Invalid backup file format");
        }
        
        await createMockApiCall(backup, 800);
        return backup;
      }
    );

    if (result.success) {
      toast.success("Settings imported successfully!");
      console.log('Imported settings:', result.data);
      setSelectedFile(null);
      setShowImportDialog(false);
    } else {
      toast.error(result.error || "Failed to import settings");
    }

    setIsImporting(false);
  };

  const handleResetAllSettings = async () => {
    setIsResetting(true);
    
    const result = await withAsyncHandler(
      () => createMockApiCall({ success: true }, 1000)
    );

    if (result.success) {
      toast.success("All settings reset to defaults!");
      console.log('All settings reset');
    } else {
      toast.error("Failed to reset settings");
    }

    setIsResetting(false);
  };

  return (
    <>
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Settings className="w-5 h-5" />
            Settings Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <h4 className={`font-medium ${theme.colors.text.secondary}`}>Import Settings</h4>
              </div>
              <p className={`text-sm ${theme.colors.text.muted}`}>
                Restore settings from a backup file
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <LoadingButton
                  loading={false}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Backup File
                </LoadingButton>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${theme.colors.text.secondary}`}>Reset All Settings</h4>
                <p className={`text-sm ${theme.colors.text.muted}`}>
                  Reset all settings to their default values
                </p>
              </div>
              <LoadingButton
                loading={isResetting}
                variant="outline"
                onClick={handleResetAllSettings}
                loadingText="Resetting..."
                className="border-red-600 text-red-400 hover:bg-red-600/10"
              >
                Reset All
              </LoadingButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        title="Import Settings"
        description={`Are you sure you want to import settings from "${selectedFile?.name}"? This will overwrite your current settings and cannot be undone.`}
        confirmText="Import Settings"
        cancelText="Cancel"
        onConfirm={handleImportSettings}
        variant="destructive"
      />
    </>
  );
};
