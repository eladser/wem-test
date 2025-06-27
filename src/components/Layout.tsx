import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { QuickSettingsPanel } from "@/components/settings/QuickSettingsPanel";
import { UserProfileMenu } from "@/components/user/UserProfileMenu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      {/* Sidebar - Fixed width, no overlap */}
      <div className="w-80 h-full shrink-0 relative z-50">
        <AppSidebar />
      </div>
      
      {/* Main content area - Takes remaining space, no overlap */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Fixed Header - Full width of remaining space */}
        <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-6 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 relative z-40">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <SidebarTrigger className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 shrink-0" />
            <Separator orientation="vertical" className="h-6 shrink-0" />
            <div className="min-w-0 flex-1">
              <Breadcrumb />
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Enhanced Notification Center */}
            <NotificationCenter />
            
            {/* Quick Settings Panel */}
            <QuickSettingsPanel
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              }
            />
            
            {/* User Profile Menu */}
            <UserProfileMenu
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                </Button>
              }
            />
          </div>
        </header>
        
        {/* Main Content Area - Proper overflow handling */}
        <main className="flex-1 bg-slate-950 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto scrollbar-thin">
            <div className="min-h-full p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;