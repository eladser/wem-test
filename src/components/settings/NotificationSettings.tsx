
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { LoadingButton } from "@/components/common/LoadingButton";

interface NotificationPreferences {
  systemAlerts: boolean;
  performanceReports: boolean;
  maintenanceReminders: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface NotificationSetting {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}

const notificationSettings: NotificationSetting[] = [
  {
    key: "systemAlerts",
    label: "System Alerts",
    description: "Get notified about system issues and critical events"
  },
  {
    key: "performanceReports",
    label: "Performance Reports",
    description: "Weekly performance summaries and analytics"
  },
  {
    key: "maintenanceReminders",
    label: "Maintenance Reminders",
    description: "Scheduled maintenance notifications and reminders"
  },
  {
    key: "emailNotifications",
    label: "Email Notifications",
    description: "Receive notifications via email"
  },
  {
    key: "smsNotifications",
    label: "SMS Notifications",
    description: "Receive urgent notifications via SMS"
  }
];

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    systemAlerts: true,
    performanceReports: true,
    maintenanceReminders: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Notification preferences updated!");
      console.log('Saved notification preferences:', preferences);
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPreferences({
      systemAlerts: true,
      performanceReports: true,
      maintenanceReminders: true,
      emailNotifications: true,
      smsNotifications: false
    });
    toast.info("Preferences reset to defaults");
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className={theme.colors.text.secondary}>{setting.label}</Label>
                <p className={`text-sm ${theme.colors.text.muted}`}>{setting.description}</p>
              </div>
              <Switch 
                checked={preferences[setting.key]} 
                onCheckedChange={() => handleToggle(setting.key)} 
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-700">
          <LoadingButton
            variant="outline"
            onClick={handleReset}
            className={`${theme.colors.border.accent} ${theme.colors.text.accent}`}
          >
            Reset to Defaults
          </LoadingButton>
          
          <LoadingButton
            loading={isLoading}
            onClick={handleSave}
            loadingText="Updating..."
          >
            Update Preferences
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
};
