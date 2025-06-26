import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EnhancedErrorBoundary } from "@/components/common/EnhancedErrorBoundary";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { NotificationProvider } from "@/components/notifications/NotificationSystem";
import { PerformanceDevTools } from "@/hooks/useAdvancedPerformance";
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

// Enhanced Query Client with better error handling and performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error) {
          const status = (error as any)?.response?.status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 2; // Reduced retry attempts for better UX
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
      refetchOnReconnect: true, // Refetch when reconnecting to network
      refetchOnMount: true, // Refetch when component mounts
    },
    mutations: {
      retry: (failureCount, error) => {
        // Retry mutations only for network errors
        const status = (error as any)?.response?.status;
        if (status && status >= 400 && status < 500) {
          return false; // Don't retry client errors
        }
        return failureCount < 1; // Single retry for mutations
      },
    },
  },
});

// Global error handler for React Query
queryClient.setMutationDefaults(['energy-data'], {
  mutationFn: async (data: any) => {
    // Add global error handling for energy data mutations
    console.log('Energy data mutation:', data);
    throw new Error('Mutation not implemented');
  },
});

// Add global query error handler
queryClient.setQueryDefaults(['energy-data'], {
  queryFn: async () => {
    // Global query function for energy data
    console.log('Global energy data query');
    return null;
  },
});

const App: React.FC = () => {
  console.log("App component rendering");
  
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        // Global error reporting
        console.error('Global error caught:', error, errorInfo);
        
        // Send to error reporting service (Sentry, LogRocket, etc.)
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      <ThemeProvider
        config={{
          enableTransitions: true,
          storageKey: 'wem-dashboard-theme',
          defaultTheme: 'dark', // Default to dark theme for energy dashboard
          enableSystemTheme: true,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <NotificationProvider
            position="top-right"
            maxNotifications={3} // Reduced to prevent spam
            defaultDuration={4000 // Shorter duration for better UX
            }
          >
            <TooltipProvider delayDuration={300}>
              <Toaster />
              <Sonner 
                position="top-right"
                expand={false}
                richColors
                closeButton
              />
              <AuthProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <Layout>
                            <EnhancedErrorBoundary>
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
                            </EnhancedErrorBoundary>
                          </Layout>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </BrowserRouter>
              </AuthProvider>
            </TooltipProvider>
            {/* Performance Dev Tools - only shows in development */}
            <PerformanceDevTools />
          </NotificationProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </EnhancedErrorBoundary>
  );
};

export default App;