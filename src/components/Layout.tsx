import React, { useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { EnhancedSidebar } from "@/components/navigation/EnhancedSidebar";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { ModernBreadcrumb } from "@/components/navigation/ModernBreadcrumb";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { FloatingActionPanel } from "@/components/widgets/FloatingActionPanel";
import { ThemeToggle, useTheme, useThemeTransition } from "@/components/theme/ThemeProvider";
import { NotificationBell } from "@/components/notifications/NotificationSystem";
import { Separator } from "@/components/ui/separator";
import { usePerformance } from "@/hooks/useAdvancedPerformance";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [floatingPanelOpen, setFloatingPanelOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const themeTransition = useThemeTransition();
  const { logRenderTime } = usePerformance('Layout');
  
  console.log("Layout component rendering with children:", !!children);
  
  // Log render time
  React.useEffect(() => {
    logRenderTime();
  });

  // Theme-aware background gradients
  const backgroundGradient = resolvedTheme === 'dark' 
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800'
    : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200';

  const headerBackground = resolvedTheme === 'dark'
    ? 'bg-slate-900/80 backdrop-blur-xl border-slate-700/50'
    : 'bg-white/80 backdrop-blur-xl border-slate-200/50';
  
  return (
    <div className={`min-h-screen w-full flex ${backgroundGradient} ${themeTransition.className}`}>
      <EnhancedSidebar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <SidebarInset className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className={`flex h-16 shrink-0 items-center gap-2 border-b sticky top-0 z-50 ${headerBackground} ${themeTransition.className}`}>
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className={`-ml-1 transition-colors ${
              resolvedTheme === 'dark' 
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`} />
            <Separator 
              orientation="vertical" 
              className={`mr-2 h-4 ${resolvedTheme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`} 
            />
            <ModernBreadcrumb />
          </div>
          
          <div className="flex items-center gap-2 px-4">
            {/* Keyboard shortcut hint */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                resolvedTheme === 'dark'
                  ? 'text-slate-400 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700'
                  : 'text-slate-600 bg-slate-100/50 hover:bg-slate-200/50 border border-slate-300'
              }`}
              title="Open command palette"
            >
              <span>Search</span>
              <kbd className={`px-1.5 py-0.5 rounded text-xs ${
                resolvedTheme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>
                ⌘K
              </kbd>
            </button>
            
            <ThemeToggle className="flex-shrink-0" />
            <NotificationBell />
            <NotificationPanel />
          </div>
        </header>
        
        <main className={`flex-1 overflow-auto ${backgroundGradient} ${themeTransition.className}`}>
          <div className="p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
      
      <FloatingActionPanel 
        isOpen={floatingPanelOpen}
        onToggle={() => setFloatingPanelOpen(!floatingPanelOpen)}
      />
      
      <CommandPalette 
        open={commandPaletteOpen} 
        setOpen={setCommandPaletteOpen} 
      />
      
      {/* Global keyboard shortcuts */}
      <div className="sr-only">
        {/* Screen reader accessible shortcuts info */}
        <p>Press Command+K or Ctrl+K to open search</p>
        <p>Press Command+Shift+P or Ctrl+Shift+P to toggle performance monitor</p>
      </div>
    </div>
  );
};

export default Layout;