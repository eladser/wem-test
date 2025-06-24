
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
                      <Overview />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/assets" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <Layout>
                      <Assets />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/region/:regionId" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <Layout>
                      <RegionOverview />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <Layout>
                      <SiteDashboard />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/grid" element={
                <ProtectedRoute requiredPermission="write">
                  <SidebarProvider>
                    <Layout>
                      <SiteGrid />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/assets" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <Layout>
                      <SiteAssets />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/reports" element={
                <ProtectedRoute requiredPermission="export">
                  <SidebarProvider>
                    <Layout>
                      <SiteReports />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/finances" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <Layout>
                      <SiteFinances />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/team" element={
                <ProtectedRoute requiredPermission="manage_users">
                  <SidebarProvider>
                    <Layout>
                      <SiteTeam />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/settings" element={
                <ProtectedRoute requiredPermission="manage_settings">
                  <SidebarProvider>
                    <Layout>
                      <SiteSettings />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute requiredPermission="manage_settings">
                  <SidebarProvider>
                    <Layout>
                      <Settings />
                    </Layout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
