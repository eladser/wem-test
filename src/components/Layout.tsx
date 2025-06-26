import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-950">
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        {/* FIXED: Better header positioning */}
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 px-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200" />
            <Separator orientation="vertical" className="h-5" />
          </div>
        </header>
        
        {/* FIXED: Main content area without extra padding that causes overlap */}
        <main className="flex-1 bg-slate-950">
          {children}
        </main>
        
        {/* FIXED: Footer */}
        <footer className="mt-auto px-4 py-3 border-t border-slate-800/50 bg-slate-950/50 text-center">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>© 2025 WEM Dashboard</span>
            <span>Energy Management System v2.1.0</span>
          </div>
        </footer>
      </SidebarInset>
    </div>
  );
};

export default Layout;