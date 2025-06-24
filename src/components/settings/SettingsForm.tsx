
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";

interface SettingsFormData {
  company: string;
  timezone: string;
  darkMode: boolean;
  autoSync: boolean;
}

export const SettingsForm = () => {
  const [formData, setFormData] = useState<SettingsFormData>({
    company: "EnergyOS Corp",
    timezone: "utc",
    darkMode: true,
    autoSync: true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SettingsFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
      console.log('Saved settings:', formData);
    } catch (error) {
      toast.error("Failed to save settings");
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <SettingsIcon className="w-5 h-5" />
          General Settings
        </CardTitle>
        <CardDescription className={theme.colors.text.muted}>
          Configure your basic platform preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company" className={theme.colors.text.secondary}>Company Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone" className={theme.colors.text.secondary}>Timezone</Label>
            <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 z-50">
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
                <SelectItem value="cet">Central European Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className={theme.colors.text.secondary}>Dark Mode</Label>
              <p className={`text-sm ${theme.colors.text.muted}`}>Use dark theme across the platform</p>
            </div>
            <Switch 
              checked={formData.darkMode} 
              onCheckedChange={(checked) => handleInputChange('darkMode', checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className={theme.colors.text.secondary}>Auto Sync</Label>
              <p className={`text-sm ${theme.colors.text.muted}`}>Automatically sync data every 5 minutes</p>
            </div>
            <Switch 
              checked={formData.autoSync} 
              onCheckedChange={(checked) => handleInputChange('autoSync', checked)} 
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className={`${theme.gradients.primary} text-white`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
