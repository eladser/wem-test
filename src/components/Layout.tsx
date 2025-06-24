
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-violet-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-cyan-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-radial from-emerald-500/20 via-green-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-radial from-pink-500/20 via-rose-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-violet-400/60 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>
      </div>

      <AppSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-16 flex items-center border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl px-6 relative">
          {/* Glassmorphism header with gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-b border-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20"></div>
          
          <div className="relative z-10 flex items-center w-full">
            <SidebarTrigger className="text-white/70 hover:text-white mr-4 transition-all duration-300 hover:scale-110 hover:rotate-12 p-2 rounded-xl hover:bg-white/10" />
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-sm">RE</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-50 animate-pulse group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                  Renewable Energy Hub
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 rounded-full mt-1 animate-pulse"></div>
              </div>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-white/20 rounded-2xl px-6 py-3 backdrop-blur-xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 group">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse group-hover:animate-ping"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-emerald-300 font-semibold">System Online</span>
              </div>
              
              {/* User Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-auto h-12 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-2xl flex items-center space-x-3 backdrop-blur-xl border border-white/20 hover:scale-110 transition-all duration-300 cursor-pointer px-4"
                  >
                    <User className="w-5 h-5 text-white" />
                    <div className="text-left">
                      <div className="text-white font-medium text-sm">{user?.name}</div>
                      <div className="text-white/60 text-xs capitalize">{user?.role}</div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-slate-900/95 border-slate-700 backdrop-blur-xl">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Account Info</h4>
                      <div className="space-y-1 text-sm">
                        <div className="text-slate-300">{user?.email}</div>
                        <div className="text-slate-400 capitalize">Role: {user?.role}</div>
                        <div className="text-slate-400">
                          Permissions: {user?.permissions.join(', ')}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-transparent to-slate-900/30 pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
