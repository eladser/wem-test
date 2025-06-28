import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer' | 'administrator' | 'operator';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts matching your login page
const demoAccounts = {
  'admin@energyos.com': {
    id: '1',
    email: 'admin@energyos.com',
    name: 'Administrator',
    role: 'admin' as const,
    permissions: ['read', 'write', 'admin', 'delete', 'export']
  },
  'operator@energyos.com': {
    id: '2', 
    email: 'operator@energyos.com',
    name: 'Operator',
    role: 'operator' as const,
    permissions: ['read', 'write', 'export']
  },
  'viewer@energyos.com': {
    id: '3',
    email: 'viewer@energyos.com', 
    name: 'Viewer',
    role: 'viewer' as const,
    permissions: ['read']
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      const savedUser = localStorage.getItem('wem_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('wem_user');
        }
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (password === 'password' && email in demoAccounts) {
        const userData = demoAccounts[email as keyof typeof demoAccounts];
        setUser(userData);
        localStorage.setItem('wem_user', JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wem_user');
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
    // Return a default mock value for development when AuthProvider is not wrapping the component
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => false,
      logout: () => {},
      hasPermission: () => false,
      isAdmin: false
    };
  }
  return context;
};