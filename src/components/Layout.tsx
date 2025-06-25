
import React, { useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { EnhancedSidebar } from "@/components/navigation/EnhancedSidebar";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { ModernBreadcrumb } from "@/components/navigation/ModernBreadcrumb";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  console.log("Layout component rendering with children:", !!children);
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex">
      <EnhancedSidebar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <SidebarInset className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1 text-slate-300 hover:text-white hover:bg-slate-800/50" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-600" />
            <ModernBreadcrumb />
          </div>
          <div className="flex items-center gap-2 px-4">
            <NotificationPanel />
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
      
      <CommandPalette 
        open={commandPaletteOpen} 
        setOpen={setCommandPaletteOpen} 
      />
    </div>
  );
};

export default Layout;
