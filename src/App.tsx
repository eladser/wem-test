import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { NotificationProvider } from './components/notifications/NotificationSystem';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Error handling components
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster as UIToaster } from './components/ui/toaster';
import { logger, useLogger } from './utils/logger';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import Monitoring from './pages/Monitoring';
import Assets from './pages/Assets';
import Settings from './pages/Settings';
import RegionOverview from './pages/RegionOverview';
import NotFound from './pages/NotFound';

// Site components
import SiteDashboard from './components/SiteDashboard';
import SiteGrid from './components/SiteGrid';
import SiteAssets from './components/SiteAssets';
import SiteReports from './components/SiteReports';
import SiteFinances from './components/SiteFinances';
import SiteTeam from './components/SiteTeam';
import SiteSettings from './components/SiteSettings';

// Demo component
import ErrorHandlingDemo from './components/ErrorHandlingDemo';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  </div>
);

// Main App component that uses auth
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const log = useLogger();

  React.useEffect(() => {
    log.info('App started', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, [log]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <SidebarProvider>
      <Layout>
        <ErrorBoundary>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/advanced-analytics" element={<ProtectedRoute><AdvancedAnalytics /></ProtectedRoute>} />
            <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* Demo Route for Testing Error Handling */}
            <Route path="/demo/error-handling" element={<ErrorHandlingDemo />} />
            
            {/* Region Routes */}
            <Route path="/region/:regionId" element={<RegionOverview />} />
            
            {/* Site Routes */}
            <Route path="/site/:siteId" element={<SiteDashboard />} />
            <Route path="/site/:siteId/grid" element={<SiteGrid />} />
            <Route path="/site/:siteId/assets" element={<SiteAssets />} />
            <Route path="/site/:siteId/reports" element={<SiteReports />} />
            <Route path="/site/:siteId/finances" element={<SiteFinances />} />
            <Route path="/site/:siteId/team" element={<SiteTeam />} />
            <Route path="/site/:siteId/settings" element={<SiteSettings />} />
            
            {/* Fallback */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </SidebarProvider>
  );
}

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.fatal('Top-level error boundary caught error', {
          componentStack: errorInfo.componentStack,
          topLevel: true
        }, error);
      }}
    >
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Router>
              <AppContent />
              {/* Keep existing Sonner toaster for backwards compatibility */}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'rgb(30 41 59)',
                    border: '1px solid rgb(71 85 105)',
                    color: 'rgb(226 232 240)',
                  },
                }}
              />
              {/* Add our new toast system */}
              <UIToaster />
            </Router>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;