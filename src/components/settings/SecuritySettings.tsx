
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";
import { FormField } from "@/components/common/FormField";
import { LoadingButton } from "@/components/common/LoadingButton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { validateForm, passwordValidation, ValidationRules } from "@/lib/formValidation";
import { withAsyncHandler, createMockApiCall } from "@/lib/asyncUtils";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validatePasswords = (): boolean => {
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
      return false;
    }

    setErrors({});
    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    
    const result = await withAsyncHandler(
      () => createMockApiCall({ success: true }, 1200),
      {
        successMessage: "Password updated successfully!",
        errorMessage: "Failed to update password"
      }
    );

    if (result.success) {
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setErrors({});
      console.log('Password updated successfully');
    } else {
      toast.error(result.error || "Failed to update password");
    }

    setIsLoading(false);
  };

  const handleConfirmUpdate = () => {
    if (validatePasswords()) {
      setShowConfirmDialog(true);
    }
  };

  const getPasswordFieldType = (show: boolean) => show ? "text" : "password";

  const renderPasswordToggle = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <>
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <FormField
                id="current-password"
                label="Current Password"
                type={getPasswordFieldType(showCurrentPassword)}
                value={passwords.current}
                onChange={(value) => handlePasswordChange('current', value)}
                error={errors.current}
                required
              />
              {renderPasswordToggle(showCurrentPassword, () => setShowCurrentPassword(!showCurrentPassword))}
            </div>
            
            <div className="relative">
              <FormField
                id="new-password"
                label="New Password"
                type={getPasswordFieldType(showNewPassword)}
                value={passwords.new}
                onChange={(value) => handlePasswordChange('new', value)}
                error={errors.new}
                description="Must contain at least 8 characters with uppercase, lowercase, and number"
                required
              />
              {renderPasswordToggle(showNewPassword, () => setShowNewPassword(!showNewPassword))}
            </div>
            
            <div className="relative">
              <FormField
                id="confirm-password"
                label="Confirm New Password"
                type={getPasswordFieldType(showConfirmPassword)}
                value={passwords.confirm}
                onChange={(value) => handlePasswordChange('confirm', value)}
                error={errors.confirm}
                required
              />
              {renderPasswordToggle(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
            </div>
            
            <div className="flex gap-4 pt-4">
              <LoadingButton
                loading={isLoading}
                onClick={handleConfirmUpdate}
                loadingText="Updating..."
              >
                Update Password
              </LoadingButton>
              
              <LoadingButton
                variant="outline"
                loading={false}
                onClick={() => {
                  setPasswords({ current: "", new: "", confirm: "" });
                  setErrors({});
                  toast.info("Form cleared");
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Clear Form
              </LoadingButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirm Password Update"
        description="Are you sure you want to update your password? This action cannot be undone and you will need to use your new password for future logins."
        confirmText="Update Password"
        cancelText="Cancel"
        onConfirm={handleUpdatePassword}
        variant="default"
      />
    </>
  );
};
