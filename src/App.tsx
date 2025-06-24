
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
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <Overview />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <Analytics />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/assets" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <Assets />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/region/:regionId" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <RegionOverview />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <SiteDashboard />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/grid" element={
                <ProtectedRoute requiredPermission="write">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <SiteGrid />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/assets" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <SiteAssets />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/reports" element={
                <ProtectedRoute requiredPermission="export">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <SiteReports />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/finances" element={
                <ProtectedRoute requiredPermission="read">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <SiteFinances />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/team" element={
                <ProtectedRoute requiredPermission="manage_users">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <SiteTeam />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/site/:siteId/settings" element={
                <ProtectedRoute requiredPermission="manage_settings">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <SiteSettings />
                      </Layout>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute requiredPermission="manage_settings">
                  <SidebarProvider>
                    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                      <Layout>
                        <Settings />
                      </Layout>
                    </div>
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
