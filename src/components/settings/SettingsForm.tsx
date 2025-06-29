import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Save, RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react";
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
  const [isOnline, setIsOnline] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [formData, originalData]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoadingInitial(true);
      setError(null);
      
      // FIXED: Use correct endpoint without double /api/
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
        
        // Show success message if data came from cache or mock
        if (response.fromCache) {
          toast.info('Settings loaded from cache');
        }
      } else {
        throw new Error(response.message || 'Failed to load settings');
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load settings';
      if (error.message?.includes('404')) {
        errorMessage = 'Settings endpoint not found. Using default values.';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Check if backend is running on port 5000.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Server may be slow to respond.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
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

    if (!isOnline) {
      toast.error('Cannot save settings while offline');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Saving settings:', formData);
      
      // FIXED: Use correct endpoint without double /api/
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
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save settings';
      if (error.message?.includes('404')) {
        errorMessage = 'Settings save endpoint not found. Backend may not support this operation.';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Check if backend is running.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Save request timed out. Please try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setFormData(originalData);
    setError(null);
    toast.info('Changes reset');
  };

  const handleRetry = () => {
    loadSettings();
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
          {!isOnline && <WifiOff className="w-4 h-4 text-red-500" />}
          {isOnline && <Wifi className="w-4 h-4 text-green-500" />}
        </CardTitle>
        <CardDescription className={theme.colors.text.muted}>
          Configure your basic platform preferences
          {!isOnline && " (Offline mode - changes will be saved when connection is restored)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400 flex justify-between items-center">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="ml-2 h-6 text-xs border-red-500/20 text-red-400 hover:text-red-300"
              >
                Retry
              </Button>
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
              disabled={isLoading || !hasChanges || !isOnline}
              className={`${hasChanges && isOnline ? theme.gradients.primary : 'bg-slate-700 text-slate-400'} text-white flex items-center gap-2 min-w-[120px]`}
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
