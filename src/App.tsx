
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import RegionOverview from "./pages/RegionOverview";
import SiteDashboard from "./components/SiteDashboard";
import SiteAssets from "./components/SiteAssets";
import SiteReports from "./components/SiteReports";
import SiteFinances from "./components/SiteFinances";
import SiteTeam from "./components/SiteTeam";
import SiteSettings from "./components/SiteSettings";
import NotFound from "./pages/NotFound";
import SiteGrid from "./components/SiteGrid";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <SidebarProvider>
                <Layout>
                  <Routes>
                    <Route index element={<Overview />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="region/:regionId" element={<RegionOverview />} />
                    <Route path="site/:siteId" element={<SiteDashboard />} />
                    <Route path="site/:siteId/grid" element={<SiteGrid />} />
                    <Route path="site/:siteId/assets" element={<SiteAssets />} />
                    <Route path="site/:siteId/reports" element={<SiteReports />} />
                    <Route path="site/:siteId/finances" element={<SiteFinances />} />
                    <Route path="site/:siteId/team" element={<SiteTeam />} />
                    <Route path="site/:siteId/settings" element={<SiteSettings />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </SidebarProvider>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
