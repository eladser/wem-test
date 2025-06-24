
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { FormField } from "@/components/common/FormField";
import { LoadingButton } from "@/components/common/LoadingButton";
import { validateForm, passwordValidation, ValidationRules } from "@/lib/formValidation";

interface PasswordForm {
  current: string;
  new: string;
  confirm: string;
}

const validationRules: ValidationRules = {
  current: { required: true },
  new: passwordValidation,
  confirm: { required: true }
};

export const SecuritySettings = () => {
  const [passwords, setPasswords] = useState<PasswordForm>({
    current: "",
    new: "",
    confirm: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleUpdatePassword = async () => {
    // Convert PasswordForm to Record<string, string> for validation
    const passwordData: Record<string, string> = {
      current: passwords.current,
      new: passwords.new,
      confirm: passwords.confirm
    };
    
    const formErrors = validateForm(passwordData, validationRules);
    
    // Additional confirmation validation
    if (passwords.new !== passwords.confirm) {
      formErrors.confirm = "New passwords don't match";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setErrors({});
      console.log('Password updated');
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Shield className="w-5 h-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormField
            id="current-password"
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={(value) => handlePasswordChange('current', value)}
            error={errors.current}
            required
          />
          
          <FormField
            id="new-password"
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={(value) => handlePasswordChange('new', value)}
            error={errors.new}
            description="Must contain at least 8 characters with uppercase, lowercase, and number"
            required
          />
          
          <FormField
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={(value) => handlePasswordChange('confirm', value)}
            error={errors.confirm}
            required
          />
          
          <LoadingButton
            loading={isLoading}
            onClick={handleUpdatePassword}
            loadingText="Updating..."
          >
            Update Password
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
};
