
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import Assets from "./pages/Assets";
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
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Layout>
                      <Routes>
                        <Route index element={<Overview />} />
                        <Route path="analytics" element={
                          <ProtectedRoute requiredPermission="read">
                            <Analytics />
                          </ProtectedRoute>
                        } />
                        <Route path="assets" element={
                          <ProtectedRoute requiredPermission="read">
                            <Assets />
                          </ProtectedRoute>
                        } />
                        <Route path="region/:regionId" element={
                          <ProtectedRoute requiredPermission="read">
                            <RegionOverview />
                          </ProtectedRoute>
                        } />
                        <Route path="site/:siteId" element={
                          <ProtectedRoute requiredPermission="read">
                            <SiteDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="site/:siteId/grid" element={
                          <ProtectedRoute requiredPermission="write">
                            <SiteGrid />
                          </ProtectedRoute>
                        } />
                        <Route path="site/:siteId/assets" element={
                          <ProtectedRoute requiredPermission="read">
                            <SiteAssets />
                          </ProtectedRoute>
                        } />
                        <Route path="site/:siteId/reports" element={
                          <ProtectedRoute requiredPermission="export">
                            <SiteReports />
                          </ProtectedRoute>
                        } />
                        <Route path="site/:siteId/finances" element={
                          <ProtectedRoute requiredPermission="read">
                            <SiteFinances />
                          </ProtectedRoute>
                        } />
                        <Route path="site/:siteId/team" element={
                          <ProtectedRoute requiredPermission="manage_users">
                            <SiteTeam />
                          </ProtectedRoute>
                        } />
                        <Route path="site/:siteId/settings" element={
                          <ProtectedRoute requiredPermission="manage_settings">
                            <SiteSettings />
                          </ProtectedRoute>
                        } />
                        <Route path="settings" element={
                          <ProtectedRoute requiredPermission="manage_settings">
                            <Settings />
                          </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
