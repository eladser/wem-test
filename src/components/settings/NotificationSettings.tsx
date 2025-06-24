
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { LoadingButton } from "@/components/common/LoadingButton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { withAsyncHandler, createMockApiCall } from "@/lib/asyncUtils";

interface NotificationPreferences {
  systemAlerts: boolean;
  performanceReports: boolean;
  maintenanceReminders: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

interface NotificationSetting {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "alerts" | "reports" | "communications";
}

const notificationSettings: NotificationSetting[] = [
  {
    key: "systemAlerts",
    label: "System Alerts",
    description: "Get notified about system issues and critical events",
    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
    category: "alerts"
  },
  {
    key: "performanceReports",
    label: "Performance Reports",
    description: "Weekly performance summaries and analytics",
    icon: <Bell className="w-4 h-4 text-blue-400" />,
    category: "reports"
  },
  {
    key: "maintenanceReminders",
    label: "Maintenance Reminders",
    description: "Scheduled maintenance notifications and reminders",
    icon: <Bell className="w-4 h-4 text-amber-400" />,
    category: "alerts"
  },
  {
    key: "emailNotifications",
    label: "Email Notifications",
    description: "Receive notifications via email",
    icon: <Mail className="w-4 h-4 text-emerald-400" />,
    category: "communications"
  },
  {
    key: "smsNotifications",
    label: "SMS Notifications",
    description: "Receive urgent notifications via SMS",
    icon: <MessageSquare className="w-4 h-4 text-purple-400" />,
    category: "communications"
  },
  {
    key: "pushNotifications",
    label: "Push Notifications",
    description: "Browser push notifications for real-time updates",
    icon: <Bell className="w-4 h-4 text-cyan-400" />,
    category: "communications"
  },
  {
    key: "marketingEmails",
    label: "Marketing Emails",
    description: "Product updates and promotional content",
    icon: <Mail className="w-4 h-4 text-pink-400" />,
    category: "communications"
  }
];

const defaultPreferences: NotificationPreferences = {
  systemAlerts: true,
  performanceReports: true,
  maintenanceReminders: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: false
};

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: !prev[key] };
      setHasChanges(JSON.stringify(newPrefs) !== JSON.stringify(defaultPreferences));
      return newPrefs;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    const result = await withAsyncHandler(
      () => createMockApiCall(preferences, 800),
      {
        successMessage: "Notification preferences updated!",
        errorMessage: "Failed to update preferences"
      }
    );

    if (result.success) {
      toast.success("Notification preferences updated!");
      setHasChanges(false);
      console.log('Saved notification preferences:', preferences);
    } else {
      toast.error(result.error || "Failed to update preferences");
    }

    setIsLoading(false);
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
    setHasChanges(false);
    toast.info("Preferences reset to defaults");
  };

  const getCategorySettings = (category: "alerts" | "reports" | "communications") => {
    return notificationSettings.filter(setting => setting.category === category);
  };

  const renderSettingsGroup = (title: string, settings: NotificationSetting[]) => (
    <div className="space-y-3">
      <h4 className={`text-sm font-medium ${theme.colors.text.accent}`}>{title}</h4>
      {settings.map((setting) => (
        <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-start space-x-3">
            <div className="mt-1">{setting.icon}</div>
            <div className="space-y-1">
              <Label className={theme.colors.text.secondary}>{setting.label}</Label>
              <p className={`text-sm ${theme.colors.text.muted}`}>{setting.description}</p>
            </div>
          </div>
          <Switch 
            checked={preferences[setting.key]} 
            onCheckedChange={() => handleToggle(setting.key)} 
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSettingsGroup("Critical Alerts", getCategorySettings("alerts"))}
          {renderSettingsGroup("Reports & Analytics", getCategorySettings("reports"))}
          {renderSettingsGroup("Communication Channels", getCategorySettings("communications"))}

          <div className="flex justify-between pt-6 border-t border-slate-700">
            <LoadingButton
              loading={false}
              variant="outline"
              onClick={() => setShowResetDialog(true)}
              className={`${theme.colors.border.accent} ${theme.colors.text.accent} hover:bg-emerald-600/10`}
              disabled={!hasChanges}
            >
              Reset to Defaults
            </LoadingButton>
            
            <LoadingButton
              loading={isLoading}
              onClick={handleSave}
              loadingText="Updating..."
              disabled={!hasChanges}
            >
              Update Preferences
            </LoadingButton>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Notification Preferences"
        description="Are you sure you want to reset all notification preferences to their default values? This will undo any custom settings you have configured."
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={handleReset}
        variant="destructive"
      />
    </>
  );
};
