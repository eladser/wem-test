
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { theme } from "@/lib/theme";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  disabled,
  description
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={`${theme.colors.text.secondary} ${required ? 'after:content-["*"] after:text-red-400 after:ml-1' : ''}`}>
        {label}
      </Label>
      {description && (
        <p className={`text-sm ${theme.colors.text.muted}`}>{description}</p>
      )}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`bg-slate-800 border-slate-600 text-white ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
