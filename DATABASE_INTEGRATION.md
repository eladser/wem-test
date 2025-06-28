# Database Integration Setup Guide

Your frontend is now connected to your backend database! This guide explains how to set up and use the database integration.

## 🚀 Quick Start

### 1. **Start Your Backend**
```bash
cd backend
dotnet restore
dotnet build
dotnet run --project src/WemDashboard.API
```
Your backend should be running on `https://localhost:7297`

### 2. **Configure Frontend Environment**
The frontend is configured in `.env.development`:
```env
# Backend API Configuration
VITE_API_BASE_URL=https://localhost:7297

# Data Source Configuration
VITE_USE_MOCK_DATA=false  # Set to true to use mock data instead

# Development Settings
VITE_DEBUG_LOGS=true
```

### 3. **Start Your Frontend**
```bash
npm install
npm run dev
```

## 📊 Database Integration Features

### **Real Database Connection**
- ✅ Connects to your SQLite/SQL Server database
- ✅ Authentication with JWT tokens
- ✅ CRUD operations for Sites, Assets, Power Data, Alerts
- ✅ Real-time data fetching
- ✅ Automatic fallback to mock data if database is unavailable

### **Smart Data Management**
- **Database First**: Tries database connection first
- **Mock Fallback**: Falls back to mock data if database fails
- **Environment Control**: Toggle between database and mock data
- **Error Handling**: Graceful degradation with proper error messages

## 🔧 Using Database Data in Components

### **1. Basic Data Fetching**
```tsx
import { useSites, useSiteAssets } from '@/hooks/useDatabaseData';

function MyComponent() {
  const { data: sites, loading, error } = useSites();
  const { data: assets } = useSiteAssets('site-a');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {sites?.map(site => (
        <div key={site.id}>{site.name}</div>
      ))}
    </div>
  );
}
```

### **2. Real-time Data**
```tsx
import { useRealTimeData } from '@/hooks/useDatabaseData';

function PowerMonitor({ siteId }: { siteId: string }) {
  const { powerData, lastUpdate } = useRealTimeData(siteId, 10000); // Updates every 10s
  
  return (
    <div>
      <h3>Live Power Data</h3>
      <p>Solar: {powerData?.solar} MW</p>
      <p>Last Update: {lastUpdate?.toLocaleString()}</p>
    </div>
  );
}
```

### **3. Site Management**
```tsx
import { useSiteOperations } from '@/hooks/useDatabaseData';

function SiteManager() {
  const { updateSiteStatus, loading } = useSiteOperations();
  
  const handleStatusChange = async (siteId: string, status: 'Online' | 'Maintenance' | 'Offline') => {
    try {
      await updateSiteStatus(siteId, status);
      // Site status updated successfully
    } catch (error) {
      console.error('Failed to update site status:', error);
    }
  };
  
  return (
    <button 
      onClick={() => handleStatusChange('site-a', 'Maintenance')}
      disabled={loading}
    >
      Set to Maintenance
    </button>
  );
}
```

### **4. Authentication**
```tsx
import { useAuth } from '@/hooks/useDatabaseData';

function LoginForm() {
  const { login, logout, user, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('admin@wemdashboard.com', 'Admin123!');
      // User logged in successfully
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          Welcome, {user?.firstName}!
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## 📋 Available React Hooks

### **Data Fetching Hooks**
- `useSites(region?)` - Get all sites, optionally filtered by region
- `useSite(siteId)` - Get specific site details
- `useRegions()` - Get all regions with their sites
- `useSiteAssets(siteId)` - Get assets for a specific site
- `useSitePowerData(siteId, startDate?, endDate?)` - Get power data for a site
- `useLatestPowerData(siteId)` - Get latest power data for a site
- `useAlerts(siteId?)` - Get alerts, optionally filtered by site

### **Operation Hooks**
- `useSiteOperations()` - Create, update, delete sites
- `useAlertOperations()` - Acknowledge alerts
- `useAuth()` - Login, logout, user management

### **Utility Hooks**
- `useDashboardData(siteId?)` - Get all dashboard data in one hook
- `useRealTimeData(siteId, intervalMs)` - Real-time polling for live data
- `useAsyncData(fetchFn, deps)` - Generic async data fetching

## 🗂️ File Structure

```
src/
├── services/
│   ├── databaseApiService.ts    # Direct database API calls
│   ├── dataService.ts           # Enhanced service with fallback
│   └── api.ts                   # Base axios configuration
├── hooks/
│   └── useDatabaseData.ts       # All database hooks
├── types/
│   └── energy.ts                # Updated types matching backend
└── components/
    └── DatabaseExample.tsx      # Example usage component
```

## 🔧 Configuration Options

### **Environment Variables**
```env
# Required
VITE_API_BASE_URL=https://localhost:7297

# Optional
VITE_USE_MOCK_DATA=false         # Use mock data instead of database
VITE_DEBUG_LOGS=true             # Enable debug logging
VITE_REALTIME_INTERVAL=30000     # Real-time update interval (ms)
VITE_ENABLE_OFFLINE_MODE=false   # Enable offline mode
VITE_ENABLE_REAL_TIME=true       # Enable real-time features
```

### **Data Source Control**
You can control the data source in multiple ways:

1. **Environment Variable**: `VITE_USE_MOCK_DATA=true`
2. **Config File**: Update `src/config/environment.ts`
3. **Runtime**: Call `dataService.shouldUseMockData()`

## 🛠️ API Endpoints Used

Your frontend now connects to these backend endpoints:

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### **Sites**
- `GET /api/sites` - Get all sites
- `GET /api/sites/{id}` - Get site by ID
- `POST /api/sites` - Create new site
- `PUT /api/sites/{id}` - Update site
- `PATCH /api/sites/{id}/status` - Update site status
- `DELETE /api/sites/{id}` - Delete site

### **Assets**
- `GET /api/assets/site/{siteId}` - Get site assets
- `GET /api/assets/{id}` - Get asset by ID

### **Power Data**
- `GET /api/power-data/site/{siteId}` - Get power data for site
- `GET /api/power-data/site/{siteId}/latest` - Get latest power data

### **Alerts**
- `GET /api/alerts` - Get alerts (with optional filters)
- `PATCH /api/alerts/{id}/acknowledge` - Acknowledge alert

## 🚨 Troubleshooting

### **Backend Connection Issues**
1. **Check Backend**: Ensure your .NET backend is running on `https://localhost:7297`
2. **Check Database**: Verify your database connection in backend
3. **Check CORS**: Backend should allow frontend origin
4. **Check SSL**: Use HTTP instead of HTTPS if you have SSL issues

### **Authentication Issues**
1. **Default Admin**: Use `admin@wemdashboard.com` / `Admin123!`
2. **Token Expiry**: Tokens are stored in localStorage and auto-refreshed
3. **CORS Headers**: Ensure backend sends proper auth headers

### **Data Not Loading**
1. **Check Network Tab**: Look for failed API requests
2. **Check Console**: Look for error messages
3. **Enable Fallback**: Set `VITE_USE_MOCK_DATA=true` to test with mock data
4. **Check Backend Logs**: Look at .NET console output

### **Common Fixes**
```bash
# Clear browser storage
localStorage.clear()

# Restart backend
cd backend && dotnet run --project src/WemDashboard.API

# Restart frontend with fresh env
rm -rf node_modules/.cache && npm run dev

# Check database
cd backend && dotnet ef database update
```

## 📈 Performance Tips

1. **Use Real-time Sparingly**: Only use `useRealTimeData` for critical data
2. **Implement Caching**: Consider adding React Query for advanced caching
3. **Optimize Queries**: Use specific date ranges for power data
4. **Lazy Loading**: Load site assets only when needed
5. **Error Boundaries**: Wrap components in error boundaries

## 🔄 Migration from Mock Data

If you have existing components using mock data:

1. **Import New Hooks**: Replace old imports with database hooks
2. **Update Types**: Use updated types from `energy.ts`
3. **Handle Loading States**: Add loading and error handling
4. **Test Both Modes**: Test with both database and mock data

### **Before (Mock Data)**
```tsx
import { getMockSites } from '@/services/mockDataService';

function Sites() {
  const [sites, setSites] = useState([]);
  useEffect(() => {
    setSites(getMockSites());
  }, []);
  // ...
}
```

### **After (Database)**
```tsx
import { useSites } from '@/hooks/useDatabaseData';

function Sites() {
  const { data: sites, loading, error } = useSites();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // ...
}
```

## 🎯 Next Steps

1. **Replace Mock Usage**: Update your existing components to use database hooks
2. **Add Authentication**: Implement login/logout in your app
3. **Real-time Features**: Add live data monitoring where needed
4. **Error Handling**: Add proper error boundaries and user feedback
5. **Testing**: Test with both database and mock data modes
6. **Performance**: Add caching and optimization as needed

Your frontend is now fully connected to your database! 🎉
