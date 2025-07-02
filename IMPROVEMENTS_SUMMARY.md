# WEM Dashboard - Architecture & Setup Improvements ✨

This document summarizes the recent improvements made to the WEM Dashboard architecture, focusing on better organization, performance, and real-time capabilities.

## 🚀 Recent Improvements

### 1. Documentation Organization
- **Problem**: 40+ scattered markdown files in root directory
- **Solution**: Organized into structured `/docs` folder
- **Run**: `./organize-docs.ps1` to organize all documentation

### 2. Enhanced Loading States
- **Added**: Comprehensive skeleton components for all UI states
- **Components**: `DashboardSkeleton`, `SiteCardSkeleton`, `ChartSkeleton`, etc.
- **Benefits**: Better UX during data loading, reduced perceived load times

### 3. Real-time Data Architecture
- **File**: `src/hooks/useRealTimeData.ts`
- **Features**: 
  - Smart SignalR connection management
  - Automatic reconnection with exponential backoff
  - Site-specific data subscriptions
  - Browser notification integration
- **Hooks Available**:
  - `useSiteDashboard(siteId)` - Real-time site data
  - `usePowerData(siteId, period)` - Live power metrics
  - `useAlerts()` - Real-time alert notifications
  - `useSites()` - Sites list with caching
  - `useAssets(siteId)` - Asset status updates

### 4. Improved Sidebar Navigation
- **Priority**: Sites are now the PRIMARY navigation
- **Structure**: 
  - Sites list at top with real-time status
  - Expandable site sub-navigation (Dashboard, Assets, Analytics, etc.)
  - System navigation moved below sites
- **Features**: 
  - Real-time site status indicators
  - Search and filtering
  - Auto-expand current site
  - Loading states

### 5. WebSocket Testing & Optimization
- **Component**: `WebSocketTester.tsx`
- **Features**:
  - Connection status monitoring
  - Performance testing suite
  - Notification permission management
  - Optimization recommendations
- **Usage**: Add `<WebSocketTester />` to any page for debugging

## 🏗️ Architecture Overview

### Frontend Stack
- **React 18** + **TypeScript** for type safety
- **Vite** for fast development and building
- **TanStack React Query** for intelligent data caching
- **SignalR** for real-time WebSocket communication
- **Tailwind CSS** + **Shadcn/UI** for modern styling

### Real-time Communication
```typescript
// Example usage of new hooks
const SiteDashboard = ({ siteId }: { siteId: string }) => {
  const { data: dashboard, isLoading } = useSiteDashboard(siteId);
  const { data: powerData } = usePowerData(siteId, '24h');
  const { connectionStatus } = useSignalRConnection();

  return (
    <LoadingWrapper
      isLoading={isLoading}
      skeleton={<DashboardSkeleton />}
    >
      {/* Your dashboard content */}
    </LoadingWrapper>
  );
};
```

### Data Flow
```
Backend (Port 5000) 
    ↓ SignalR Hub (/hubs/dashboard)
    ↓ Real-time Updates
Frontend Components
    ↓ React Query Caching
    ↓ Component State
UI Updates
```

## 📁 New File Structure

```
src/
├── hooks/
│   └── useRealTimeData.ts     # 🆕 Real-time data hooks
├── components/
│   ├── ui/
│   │   └── skeleton.tsx       # 🆕 Loading skeletons
│   ├── AppSidebar.tsx         # ✨ Redesigned sidebar
│   └── WebSocketTester.tsx    # 🆕 Connection testing
docs/                          # 🆕 Organized documentation
├── setup/                     # Setup guides
├── features/                  # Feature documentation
├── troubleshooting/           # Issue resolution
├── development/               # Dev resources
└── archive/                   # Historical fixes
```

## 🔧 Development Workflow

### Quick Start (Updated)
```bash
# 1. Install dependencies
npm install

# 2. Start backend (port 5000)
cd backend/src/WemDashboard.API
dotnet run

# 3. Start frontend (port 5173)
npm run dev

# 4. Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### Testing WebSocket Connection
1. Navigate to any page with the WebSocket tester
2. Check connection status in the component
3. Run connection tests to verify all functionality
4. Monitor real-time updates in browser dev tools

### Using New Components
```typescript
// Loading states
import { LoadingWrapper, DashboardSkeleton } from '@/components/ui/skeleton';

// Real-time data
import { useSiteDashboard, useAlerts } from '@/hooks/useRealTimeData';

// WebSocket testing
import { WebSocketTester } from '@/components/WebSocketTester';
```

## 🎯 Performance Optimizations

### 1. Smart Caching
- React Query handles API response caching
- Stale-while-revalidate strategy
- Background updates without UI blocking

### 2. Connection Management
- Single SignalR connection shared across app
- Automatic reconnection with exponential backoff
- Graceful degradation when offline

### 3. Component Optimization
- Loading skeletons prevent layout shifts
- Lazy loading for heavy components
- Memoized calculations for expensive operations

### 4. Bundle Optimization
```typescript
// Vite config includes smart chunking:
manualChunks: {
  vendor: ['react', 'react-dom'],
  router: ['react-router-dom'],
  ui: ['@radix-ui/react-*'],
  charts: ['recharts'],
  query: ['@tanstack/react-query'],
}
```

## 🚦 What's Next

### Immediate (Week 1)
- [ ] Run `organize-docs.ps1` to clean up documentation
- [ ] Test new sidebar navigation
- [ ] Verify WebSocket connections with backend
- [ ] Update any broken component imports

### Short-term (Week 2)
- [ ] Add error boundaries to all major components
- [ ] Implement data export functionality
- [ ] Add comprehensive unit tests
- [ ] Optimize API response times

### Long-term (Month 1)
- [ ] Add offline support with service workers
- [ ] Implement advanced filtering and search
- [ ] Add data visualization customization
- [ ] Performance monitoring and analytics

## 🛠️ Troubleshooting

### Common Issues

**WebSocket Connection Failed**
- Verify backend is running on port 5000
- Check SignalR hub is configured at `/hubs/dashboard`
- Use `WebSocketTester` component to diagnose

**Loading Skeletons Not Showing**
- Ensure `LoadingWrapper` is properly imported
- Check that `isLoading` state is being passed correctly

**Sites Not Loading in Sidebar**
- Verify `/api/sites` endpoint is working
- Check network tab for API errors
- Ensure `useSites()` hook is properly imported

### Debug Tools
1. **WebSocket Tester**: Add `<WebSocketTester />` to any page
2. **React Query DevTools**: Press F12 → React Query tab
3. **Browser Console**: Check for SignalR connection logs

## 📚 Documentation

- **Main Setup**: [README.md](README.md)
- **API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)  
- **Detailed Docs**: [docs/README.md](docs/README.md)
- **Testing Guide**: [docs/development/testing.md](docs/development/testing.md)

---

**Questions?** Check the [troubleshooting docs](docs/troubleshooting/) or create an issue.
