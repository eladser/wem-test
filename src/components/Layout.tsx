import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 min-w-0">
        {/* Enhanced Header with proper spacing */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 px-6 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 ml-0">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <SidebarTrigger className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 flex-shrink-0" />
            <Separator orientation="vertical" className="h-6 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Breadcrumb />
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            
            {/* Quick Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            {/* User Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </header>
        
        {/* Main Content with proper padding */}
        <main className="flex-1 bg-slate-950 min-h-0">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Layout;