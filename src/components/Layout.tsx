import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleQuickSettings = () => {
    toast.info("Quick settings panel - coming soon!");
  };

  const handleUserProfile = () => {
    toast.info("User profile menu - coming soon!");
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col h-full w-full min-w-0 overflow-hidden">
        {/* Enhanced Header with proper spacing */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 px-4 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <SidebarTrigger className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 flex-shrink-0" />
            <Separator orientation="vertical" className="h-6 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Breadcrumb />
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Enhanced Notification Center */}
            <NotificationCenter />
            
            {/* Quick Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickSettings}
              className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            {/* User Profile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUserProfile}
              className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </header>
        
        {/* Main Content - Fixed overflow and spacing issues */}
        <main className="flex-1 bg-slate-950 overflow-hidden w-full">
          <div className="h-full w-full overflow-auto">
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Layout;