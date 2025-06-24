
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-slate-950">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm px-6">
          <SidebarTrigger className="text-slate-300 hover:text-white mr-4" />
          <h1 className="text-xl font-semibold text-white">Renewable Energy Management</h1>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">System Online</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
