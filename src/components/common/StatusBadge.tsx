
import React from "react";
import { Badge } from "@/components/ui/badge";
import { theme } from "@/lib/theme";

type StatusType = "online" | "offline" | "maintenance" | "warning" | "error" | "success" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; bgColor: string; text: string }> = {
  online: { color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20", text: "Online" },
  offline: { color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20", text: "Offline" },
  maintenance: { color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/20", text: "Maintenance" },
  warning: { color: "text-yellow-400", bgColor: "bg-yellow-500/10 border-yellow-500/20", text: "Warning" },
  error: { color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20", text: "Error" },
  success: { color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20", text: "Success" },
  pending: { color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20", text: "Pending" }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, className = "" }) => {
  const config = statusConfig[status];
  
  return (
    <Badge className={`${config.bgColor} ${config.color} ${className}`}>
      {text || config.text}
    </Badge>
  );
};
