
import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';

// Custom render function that includes all providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Mock data generators
export const mockAsset = (overrides = {}) => ({
  id: 'test-asset-1',
  name: 'Test Asset',
  type: 'solar_panel' as const,
  siteId: 'test-site-1',
  status: 'online' as const,
  power: '1000kW',
  efficiency: '95%',
  lastUpdate: '2 min ago',
  ...overrides,
});

export const mockSite = (overrides = {}) => ({
  id: 'test-site-1',
  name: 'Test Site',
  location: 'Test Location',
  region: 'test-region',
  status: 'online' as const,
  totalCapacity: 1000,
  currentOutput: 800,
  efficiency: 95,
  lastUpdate: '2 min ago',
  ...overrides,
});

// Test utilities
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(key => delete store[key]); },
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render, screen, waitFor };
