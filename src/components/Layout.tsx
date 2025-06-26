import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 px-6 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
          <SidebarTrigger className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
        </header>
        
        {/* Main Content */}
        <main className="flex-1 bg-slate-950">
          <div className="h-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Layout;