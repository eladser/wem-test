
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, MoreHorizontal, Maximize2, Minimize2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WidgetContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
  onExpand?: () => void;
  onRefresh?: () => void;
  isExpanded?: boolean;
  isDraggable?: boolean;
}

export const WidgetContainer = ({
  title,
  children,
  className = "",
  onRemove,
  onExpand,
  onRefresh,
  isExpanded = false,
  isDraggable = true
}: WidgetContainerProps) => {
  return (
    <Card className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-xl ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          {isDraggable && (
            <GripVertical className="h-4 w-4 text-slate-500 cursor-grab hover:text-slate-300" />
          )}
          <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        </div>
        
        <div className="flex items-center gap-1">
          {onExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              {onRefresh && (
                <DropdownMenuItem onClick={onRefresh} className="text-slate-300 hover:text-white hover:bg-slate-700">
                  Refresh Data
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                Configure
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              {onRemove && (
                <DropdownMenuItem 
                  onClick={onRemove}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  Remove Widget
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};
