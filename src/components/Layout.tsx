
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <AppSidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-16 flex items-center border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl shadow-2xl px-6 relative">
          {/* Header gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm"></div>
          
          <div className="relative z-10 flex items-center w-full">
            <SidebarTrigger className="text-slate-300 hover:text-white mr-4 transition-all duration-300 hover:scale-110 hover:rotate-180" />
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">RE</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-xl blur opacity-50 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Renewable Energy Management
                </h1>
                <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-transparent rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm text-emerald-300 font-medium">System Online</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-transparent to-slate-900/50 pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
