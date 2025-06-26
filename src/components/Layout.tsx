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
    <div className={cn(
      "min-h-screen transition-all duration-300",
      resolvedTheme === 'dark' 
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" 
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
    )}>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        {/* Enhanced Header */}
        <header className={cn(
          "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 px-6 backdrop-blur-xl border-b transition-all duration-200",
          resolvedTheme === 'dark'
            ? "bg-slate-950/80 border-slate-800/50 shadow-lg shadow-slate-950/20"
            : "bg-white/80 border-slate-200/50 shadow-lg shadow-slate-100/20"
        )}>
          <div className="flex items-center gap-3">
            <SidebarTrigger className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-105",
              resolvedTheme === 'dark'
                ? "hover:bg-slate-800/60 text-slate-400 hover:text-white"
                : "hover:bg-slate-100/60 text-slate-600 hover:text-slate-900"
            )} />
            <Separator orientation="vertical" className="h-6" />
          </div>
          
          {/* Optional: Add breadcrumbs or page title here */}
          <div className="flex-1" />
          
          {/* Optional: Add user actions, notifications, etc. here */}
        </header>
        
        {/* Enhanced Main Content */}
        <main className={cn(
          "flex-1 p-6 md:p-8 lg:p-10 transition-all duration-200",
          "scrollbar-thin overflow-y-auto"
        )}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        {/* Enhanced Footer */}
        <footer className={cn(
          "mt-auto px-6 py-4 border-t text-center transition-all duration-200",
          resolvedTheme === 'dark'
            ? "bg-slate-950/50 border-slate-800/50 text-slate-400"
            : "bg-white/50 border-slate-200/50 text-slate-600"
        )}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>© 2025 WEM Dashboard</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-xs opacity-70">
                Energy Management System v2.1.0
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-70">
              <span>Powered by</span>
              <span className="font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                React + TypeScript
              </span>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </div>
  );
};

export default Layout;