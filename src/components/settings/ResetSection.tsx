
import React, { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { LoadingButton } from "@/components/common/LoadingButton";
import { withAsyncHandler, createMockApiCall } from "@/lib/asyncUtils";

export const ResetSection: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);

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
  );
};
