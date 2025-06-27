import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Save, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { apiService } from "@/services/apiService";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const [originalData, setOriginalData] = useState<SettingsFormData>(formData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [formData, originalData]);

  const loadSettings = async () => {
    try {
      setIsLoadingInitial(true);
      setError(null);
      
      const response = await apiService.get('/api/settings/general');
      
      if (response.success && response.data) {
        const settings = {
          company: response.data.company || "EnergyOS Corp",
          timezone: response.data.timezone || "utc",
          darkMode: response.data.darkMode ?? true,
          autoSync: response.data.autoSync ?? true
        };
        
        setFormData(settings);
        setOriginalData(settings);
        console.log('Loaded settings:', settings);
      } else {
        throw new Error(response.message || 'Failed to load settings');
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      setError(error.message || 'Failed to load settings');
      toast.error('Failed to load settings');
    } finally {
      setIsLoadingInitial(false);
    }
  };

  const handleInputChange = (field: keyof SettingsFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear any existing errors when user makes changes
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Saving settings:', formData);
      
      const response = await apiService.put('/api/settings/general', {
        company: formData.company,
        timezone: formData.timezone,
        darkMode: formData.darkMode,
        autoSync: formData.autoSync
      });
      
      if (response.success) {
        setOriginalData(formData); // Update original data to reflect saved state
        toast.success('Settings saved successfully!');
        console.log('Settings saved successfully:', response.data);
      } else {
        throw new Error(response.message || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Failed to save settings');
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setFormData(originalData);
    setError(null);
    toast.info('Changes reset');
  };

  if (isLoadingInitial) {
    return (
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
            <span className="text-slate-400">Loading settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {error && (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company" className={theme.colors.text.secondary}>
              Company Name *
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone" className={theme.colors.text.secondary}>
              Timezone
            </Label>
            <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white focus:border-emerald-500">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 z-50">
                <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="cet">CET (Central European Time)</SelectItem>
                <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
                <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="space-y-1">
              <Label className={`${theme.colors.text.secondary} font-medium`}>Dark Mode</Label>
              <p className={`text-sm ${theme.colors.text.muted}`}>
                Use dark theme across the platform for better visibility
              </p>
            </div>
            <Switch 
              checked={formData.darkMode} 
              onCheckedChange={(checked) => handleInputChange('darkMode', checked)}
              className="data-[state=checked]:bg-emerald-500" 
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="space-y-1">
              <Label className={`${theme.colors.text.secondary} font-medium`}>Auto Sync</Label>
              <p className={`text-sm ${theme.colors.text.muted}`}>
                Automatically synchronize data every 5 minutes
              </p>
            </div>
            <Switch 
              checked={formData.autoSync} 
              onCheckedChange={(checked) => handleInputChange('autoSync', checked)}
              className="data-[state=checked]:bg-emerald-500" 
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-sm text-yellow-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                You have unsaved changes
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            {hasChanges && (
              <Button 
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
                className="border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
              >
                Reset
              </Button>
            )}
            
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !hasChanges}
              className={`${hasChanges ? theme.gradients.primary : 'bg-slate-700 text-slate-400'} text-white flex items-center gap-2 min-w-[120px]`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
