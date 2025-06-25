
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import Assets from "./pages/Assets";
import RegionOverview from "./pages/RegionOverview";
import { RegionDashboard } from "./components/region/RegionDashboard";
import { SiteDashboard } from "./components/site/SiteDashboard";
import SiteAssets from "./components/SiteAssets";
import SiteReports from "./components/SiteReports";
import SiteFinances from "./components/SiteFinances";
import SiteTeam from "./components/SiteTeam";
import SiteSettings from "./components/SiteSettings";
import NotFound from "./pages/NotFound";
import SiteGrid from "./components/SiteGrid";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  console.log("App component rendering");
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <Layout>
                        <ErrorBoundary>
                          <Routes>
                            <Route path="/" element={<Overview />} />
                            <Route path="/analytics" element={
                              <ProtectedRoute requiredPermission="read">
                                <Analytics />
                              </ProtectedRoute>
                            } />
                            <Route path="/assets" element={
                              <ProtectedRoute requiredPermission="read">
                                <Assets />
                              </ProtectedRoute>
                            } />
                            <Route path="/region/:regionId" element={
                              <ProtectedRoute requiredPermission="read">
                                <RegionDashboard />
                              </ProtectedRoute>
                            } />
                            <Route path="/site/:siteId" element={
                              <ProtectedRoute requiredPermission="read">
                                <SiteDashboard />
                              </ProtectedRoute>
                            } />
                            <Route path="/site/:siteId/grid" element={
                              <ProtectedRoute requiredPermission="write">
                                <SiteGrid />
                              </ProtectedRoute>
                            } />
                            <Route path="/site/:siteId/assets" element={
                              <ProtectedRoute requiredPermission="read">
                                <SiteAssets />
                              </ProtectedRoute>
                            } />
                            <Route path="/site/:siteId/reports" element={
                              <ProtectedRoute requiredPermission="export">
                                <SiteReports />
                              </ProtectedRoute>
                            } />
                            <Route path="/site/:siteId/finances" element={
                              <ProtectedRoute requiredPermission="read">
                                <SiteFinances />
                              </ProtectedRoute>
                            } />
                            <Route path="/site/:siteId/team" element={
                              <ProtectedRoute requiredPermission="manage_users">
                                <SiteTeam />
                              </ProtectedRoute>
                            } />
                            <Route path="/site/:siteId/settings" element={
                              <ProtectedRoute requiredPermission="manage_settings">
                                <SiteSettings />
                              </ProtectedRoute>
                            } />
                            <Route path="/settings" element={
                              <ProtectedRoute requiredPermission="manage_settings">
                                <Settings />
                              </ProtectedRoute>
                            } />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </ErrorBoundary>
                      </Layout>
                    </SidebarProvider>
                  </ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
