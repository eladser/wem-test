
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { theme } from "@/lib/theme";

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  onClick,
  variant = "default",
  disabled,
  className = "",
  type = "button",
  loadingText
}) => {
  const defaultClassName = variant === "default" 
    ? `${theme.gradients.primary} text-white` 
    : "";

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      variant={variant}
      className={`${defaultClassName} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {loading ? (loadingText || "Loading...") : children}
    </Button>
  );
};
