
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";

interface NotificationPreferences {
  systemAlerts: boolean;
  performanceReports: boolean;
  maintenanceReminders: boolean;
}

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    systemAlerts: true,
    performanceReports: true,
    maintenanceReminders: true
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

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className={theme.colors.text.secondary}>System Alerts</Label>
            <p className={`text-sm ${theme.colors.text.muted}`}>Get notified about system issues</p>
          </div>
          <Switch 
            checked={preferences.systemAlerts} 
            onCheckedChange={() => handleToggle('systemAlerts')} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className={theme.colors.text.secondary}>Performance Reports</Label>
            <p className={`text-sm ${theme.colors.text.muted}`}>Weekly performance summaries</p>
          </div>
          <Switch 
            checked={preferences.performanceReports} 
            onCheckedChange={() => handleToggle('performanceReports')} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className={theme.colors.text.secondary}>Maintenance Reminders</Label>
            <p className={`text-sm ${theme.colors.text.muted}`}>Scheduled maintenance notifications</p>
          </div>
          <Switch 
            checked={preferences.maintenanceReminders} 
            onCheckedChange={() => handleToggle('maintenanceReminders')} 
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className={`${theme.gradients.primary} text-white`}
          >
            {isLoading ? "Updating..." : "Update Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
