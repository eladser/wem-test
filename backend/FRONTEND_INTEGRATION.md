# Frontend Integration Guide

## 🔗 Connecting Your React Frontend to the C# Backend

This guide shows you how to replace the mock data in your React frontend with real API calls to the new C# backend.

## 📋 Quick Start

### 1. Update Your Frontend Environment Variables

Update your `.env.development` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_MOCK_DATA=false
```

### 2. Install Additional Dependencies (if needed)

```bash
npm install axios  # if not already installed
```

## 🔄 Migration Steps

### Step 1: Update API Service Configuration

Replace your existing `src/services/apiService.ts`:

```typescript
// src/services/apiService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

class ApiService {
  private baseURL: string;
  private timeout: number;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string; errors?: string[] }> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }
      
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

export const apiService = new ApiService();
```

### Step 2: Update Site API Service

Replace your `src/services/siteApiService.ts`:

```typescript
// src/services/siteApiService.ts
import { apiService } from './apiService';
import type { Site, Asset, PowerData, Alert } from '@/types/energy';

export interface SiteResponse {
  id: string;
  name: string;
  location: string;
  region: string;
  status: string;
  totalCapacity: number;
  currentOutput: number;
  efficiency: number;
  lastUpdate: string;
  assets?: Asset[];
  powerData?: PowerData[];
  alerts?: Alert[];
}

class SiteApiService {
  async getAllSites(): Promise<SiteResponse[]> {
    const response = await apiService.request<SiteResponse[]>('/sites');
    return response.data || [];
  }

  async getSiteData(
    siteId: string,
    options: {
      includeAssets?: boolean;
      includePowerData?: boolean;
      includeMetrics?: boolean;
      timeRange?: string;
    } = {}
  ): Promise<SiteResponse> {
    const headers: Record<string, string> = {};
    
    if (options.includeAssets) headers['X-Include-Assets'] = 'true';
    if (options.includePowerData) headers['X-Include-Power-Data'] = 'true';
    if (options.includeMetrics) headers['X-Include-Metrics'] = 'true';
    if (options.timeRange) headers['X-Time-Range'] = options.timeRange;

    const response = await apiService.request<SiteResponse>(`/sites/${siteId}`, {
      headers
    });
    
    if (!response.data) {
      throw new Error(`Site ${siteId} not found`);
    }
    
    return response.data;
  }

  async getSiteAssets(siteId: string, type?: string): Promise<Asset[]> {
    const endpoint = `/sites/${siteId}/assets${type ? `?type=${type}` : ''}`;
    const response = await apiService.request<Asset[]>(endpoint);
    return response.data || [];
  }

  async getSitePowerData(
    siteId: string,
    range?: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<PowerData[]> {
    const params = new URLSearchParams();
    if (range) params.append('range', range);
    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());
    
    const endpoint = `/sites/${siteId}/power-data${params.toString() ? `?${params}` : ''}`;
    const response = await apiService.request<PowerData[]>(endpoint);
    return response.data || [];
  }

  async updateSiteStatus(siteId: string, status: string): Promise<SiteResponse> {
    const response = await apiService.request<SiteResponse>(`/sites/${siteId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    
    if (!response.data) {
      throw new Error('Failed to update site status');
    }
    
    return response.data;
  }

  async createSite(siteData: {
    name: string;
    location: string;
    region: string;
    totalCapacity: number;
  }): Promise<SiteResponse> {
    const response = await apiService.request<SiteResponse>('/sites', {
      method: 'POST',
      body: JSON.stringify(siteData)
    });
    
    if (!response.data) {
      throw new Error('Failed to create site');
    }
    
    return response.data;
  }

  async getSiteMetrics(siteId: string) {
    const response = await apiService.request(`/sites/${siteId}/metrics`);
    return response.data || [];
  }

  async getSiteAnalytics(siteId: string, metrics?: string) {
    const endpoint = `/sites/${siteId}/analytics${metrics ? `?metrics=${metrics}` : ''}`;
    const response = await apiService.request(endpoint);
    return response.data;
  }
}

export const siteApiService = new SiteApiService();
```

### Step 3: Update Authentication Service

Create `src/services/authService.ts`:

```typescript
// src/services/authService.ts
import { apiService } from './apiService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expires: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Temporarily clear auth token for login
    const oldToken = apiService['token'];
    apiService.clearAuthToken();
    
    try {
      const response = await apiService.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      if (response.data) {
        apiService.setAuthToken(response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      // Restore old token if login fails
      if (oldToken) {
        apiService.setAuthToken(oldToken);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await apiService.request<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });
      
      if (response.data) {
        apiService.setAuthToken(response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      return null;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private clearAuthData(): void {
    apiService.clearAuthToken();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
```

### Step 4: Update Your Data Hooks

Update your React hooks to use real API calls instead of mock data:

```typescript
// src/hooks/useSites.ts
import { useState, useEffect } from 'react';
import { siteApiService } from '@/services/siteApiService';
import type { Site } from '@/types/energy';

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        const data = await siteApiService.getAllSites();
        // Transform API response to match your Site interface
        const transformedSites = data.map(site => ({
          id: site.id,
          name: site.name,
          location: site.location,
          region: site.region,
          status: site.status as Site['status'],
          totalCapacity: site.totalCapacity,
          currentOutput: site.currentOutput,
          efficiency: site.efficiency,
          lastUpdate: site.lastUpdate
        }));
        setSites(transformedSites);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sites');
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, []);

  return { sites, loading, error, refetch: () => fetchSites() };
}
```

### Step 5: Add Authentication to Your App

Update your main App component to handle authentication:

```typescript
// src/App.tsx
import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import LoginPage from '@/pages/LoginPage'; // You'll need to create this
import Dashboard from '@/pages/Dashboard'; // Your existing dashboard

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (authService.isAuthenticated()) {
        // Try to refresh token to ensure it's still valid
        const refreshResult = await authService.refreshToken();
        setIsAuthenticated(!!refreshResult);
      }
      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />;
}

export default App;
```

### Step 6: Test the Integration

1. **Start your C# backend:**
   ```bash
   cd backend/src/WemDashboard.API
   dotnet run
   ```

2. **Start your React frontend:**
   ```bash
   npm run dev
   ```

3. **Test the default login:**
   - Email: `admin@wemdashboard.com`
   - Password: `Admin123!`

## 📊 API Endpoints Available

### Sites
- `GET /api/sites` - Get all sites
- `GET /api/sites/{id}` - Get site by ID
- `POST /api/sites` - Create site
- `PUT /api/sites/{id}` - Update site
- `DELETE /api/sites/{id}` - Delete site
- `PATCH /api/sites/{id}/status` - Update site status

### Assets
- `GET /api/sites/{siteId}/assets` - Get site assets
- `GET /api/assets/{id}` - Get asset by ID
- `POST /api/assets` - Create asset
- `PUT /api/assets/{id}` - Update asset

### Power Data
- `GET /api/sites/{siteId}/power-data` - Get power data
- `POST /api/sites/{siteId}/power-data` - Add power data

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

## 🔧 Error Handling

The backend returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456"
}
```

## 🚀 Next Steps

1. **Deploy the backend** to a cloud provider
2. **Update environment variables** for production
3. **Add proper error boundaries** in React
4. **Implement loading states** throughout your app
5. **Add real-time updates** using SignalR (optional)

## 💡 Tips

- The backend includes comprehensive Swagger documentation at `/swagger`
- Use the browser network tab to debug API calls
- Check the backend logs for detailed error information
- The SQLite database file will be created automatically for development
