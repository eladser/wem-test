import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer' | 'administrator';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user for development - replace with actual auth logic
  useEffect(() => {
    // Simulate loading from localStorage or API
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        email: 'admin@wem.com',
        name: 'Admin User',
        role: 'admin',
        permissions: ['read', 'write', 'admin', 'delete']
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
        permissions: ['read', 'write', 'admin', 'delete']
      };
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'administrator';

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default mock value for development
    return {
      user: { id: '1', email: 'admin@wem.com', name: 'Admin User', role: 'admin' as const, permissions: ['read', 'write', 'admin'] },
      isAuthenticated: true,
      isLoading: false,
      login: async () => {},
      logout: () => {},
      hasPermission: () => true,
      isAdmin: true
    };
  }
  return context;
};