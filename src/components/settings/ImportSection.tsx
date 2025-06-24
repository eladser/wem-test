
import React, { useState } from "react";
import { Upload } from "lucide-react";
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

export const ImportSection: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  return (
    <>
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
