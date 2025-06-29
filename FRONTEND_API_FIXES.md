# Frontend API Error Fixes 🔧

## Issues Fixed

### 1. **Double `/api/api/` URL Construction**
- **Problem**: Base URL was `http://localhost:5000/api` and endpoints like `/api/settings/general` created `http://localhost:5000/api/api/settings/general`
- **Fix**: Changed base URL to `http://localhost:5000` and normalized URL construction in API Gateway

### 2. **Missing Backend Endpoints**
- **Problem**: Frontend expects endpoints that don't exist on backend
- **Fix**: Added proper fallback to mock data and better error handling

### 3. **Poor Error Handling**
- **Problem**: Generic error messages made debugging difficult
- **Fix**: Added specific error messages and retry functionality

## Files Changed

### Core Configuration
- `src/config/environment.ts` - Fixed API base URL
- `src/config/api.ts` - Improved health checks and fallback logic
- `src/services/apiGateway.ts` - Fixed URL construction and added better logging

### Components
- `src/components/settings/SettingsForm.tsx` - Better error handling and connectivity status

### Environment
- `.env.development` - Development configuration

## Quick Fixes Applied

### 1. URL Construction Fix
```typescript
// Before (caused double /api/api/)
baseUrl: 'http://localhost:5000/api'
endpoint: '/api/settings/general'
// Result: http://localhost:5000/api/api/settings/general ❌

// After (correct)
baseUrl: 'http://localhost:5000'
endpoint: '/api/settings/general'  
// Result: http://localhost:5000/api/settings/general ✅
```

### 2. Smart URL Normalization
```typescript
private normalizeUrl(baseUrl: string, endpoint: string): string {
  // Handles all combinations of baseUrl and endpoint
  // Prevents double /api/ paths
  // Ensures consistent URL structure
}
```

### 3. Better Error Messages
```typescript
// Before: "Failed to load settings"
// After: "Cannot connect to server. Check if backend is running on port 5000."
```

## Testing the Fixes

1. **Start your backend** on port 5000
2. **Start the frontend** with `npm run dev`
3. **Check the console** - you should see:
   - ✅ "Backend health check successful"
   - ✅ Proper URLs without double `/api/api/`
   - ✅ Better error messages if backend is down

## Environment Configuration

You can now easily configure the API URL:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_DATA=false
```

## Debugging

### Check API Calls
Open DevTools → Network tab to see:
- Correct URLs: `http://localhost:5000/api/settings/general`
- No more 404s from double `/api/api/` paths

### Enable Debug Logging
```bash
VITE_ENABLE_DEBUG_LOGS=true
```

### Force Mock Data (for testing)
```bash
VITE_USE_MOCK_DATA=true
```

## Common Issues & Solutions

### Backend Not Running
**Error**: "Cannot connect to server"
**Solution**: Start your .NET backend on port 5000

### Wrong Port
**Error**: Connection refused
**Solution**: Update `VITE_API_BASE_URL` in `.env.development`

### CORS Issues
**Error**: CORS policy error
**Solution**: Configure CORS in your .NET backend

## API Endpoints Expected

The frontend expects these endpoints on your backend:

```
GET  /api/health              # Health check
GET  /api/settings/general    # Load settings
PUT  /api/settings/general    # Save settings
GET  /api/sites/assets        # Site assets
GET  /api/automation/rules    # Automation rules
```

## Mock Data Fallback

If backend is unavailable, the frontend will:
1. Try to connect to real backend
2. Fall back to mock data automatically
3. Show connection status in UI

## Next Steps

1. **Test the fixes** by running the frontend
2. **Check console logs** for proper URL construction
3. **Verify no more 404 errors** from double `/api/api/` paths
4. **Implement missing backend endpoints** as needed

The frontend should now handle API connectivity gracefully with better error messages and automatic fallbacks! 🎉
