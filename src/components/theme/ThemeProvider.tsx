import React, { createContext, useContext, useEffect, useState } from 'react';

// Theme types
export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

// Theme configuration
interface ThemeConfig {
  enableTransitions?: boolean;
  storageKey?: string;
  defaultTheme?: Theme;
  enableSystemTheme?: boolean;
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
interface ThemeProviderProps {
  children: React.ReactNode;
  config?: ThemeConfig;
}

const defaultConfig: ThemeConfig = {
  enableTransitions: true,
  storageKey: 'wem-theme',
  defaultTheme: 'system',
  enableSystemTheme: true,
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  config = defaultConfig 
}) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const [theme, setThemeState] = useState<Theme>(mergedConfig.defaultTheme || 'system');
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve theme (handle 'system' theme)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme as ResolvedTheme;

  // Load theme from storage
  const loadTheme = (): Theme => {
    if (typeof window === 'undefined') return mergedConfig.defaultTheme || 'system';
    
    try {
      const stored = localStorage.getItem(mergedConfig.storageKey || 'wem-theme');
      if (stored && ['dark', 'light', 'system'].includes(stored)) {
        return stored as Theme;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    
    return mergedConfig.defaultTheme || 'system';
  };

  // Save theme to storage
  const saveTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(mergedConfig.storageKey || 'wem-theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  // Set theme and apply to DOM
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme === 'system' ? systemTheme : newTheme as ResolvedTheme);
  };

  // Apply theme to DOM
  const applyTheme = (resolvedTheme: ResolvedTheme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(resolvedTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'
      );
    }

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme: resolvedTheme } 
    }));
  };

  // Toggle between light and dark (ignore system)
  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    if (!mergedConfig.enableSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // If current theme is system, update the applied theme
      if (theme === 'system') {
        applyTheme(newSystemTheme);
      }
    };

    // Set initial system theme
    setSystemTheme(getSystemTheme());
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mergedConfig.enableSystemTheme]);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = loadTheme();
    const initialSystemTheme = getSystemTheme();
    
    setThemeState(initialTheme);
    setSystemTheme(initialSystemTheme);
    
    // Apply theme immediately
    applyTheme(initialTheme === 'system' ? initialSystemTheme : initialTheme as ResolvedTheme);
    
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="animate-pulse bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      systemTheme,
      config: mergedConfig
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme toggle button component
interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleTheme}
        className={`
          ${sizeClasses[size]} 
          rounded-lg border border-slate-700 bg-slate-800 
          hover:bg-slate-700 transition-colors duration-200
          flex items-center justify-center
          ${className}
        `}
        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
      
      {showLabel && (
        <span className="text-sm text-slate-400 capitalize">
          {theme === 'system' ? `${theme} (${resolvedTheme})` : theme}
        </span>
      )}
    </div>
  );
};

// Theme selector component
export const ThemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className={`flex rounded-lg border border-slate-700 bg-slate-800 p-1 ${className}`}>
      {themes.map((themeOption) => (
        <button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${theme === themeOption.value
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
            }
          `}
        >
          <span>{themeOption.icon}</span>
          <span>{themeOption.label}</span>
        </button>
      ))}
    </div>
  );
};

// Hook for theme-aware animations
export const useThemeTransition = () => {
  const { config } = useTheme();
  
  return {
    className: config.enableTransitions 
      ? 'transition-colors duration-300 ease-in-out' 
      : '',
    style: config.enableTransitions 
      ? { transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out' }
      : {}
  };
};

// Hook for listening to theme changes
export const useThemeEffect = (callback: (theme: ResolvedTheme) => void) => {
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    callback(resolvedTheme);
  }, [resolvedTheme, callback]);
  
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent<{ theme: ResolvedTheme }>) => {
      callback(event.detail.theme);
    };
    
    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    return () => window.removeEventListener('theme-changed', handleThemeChange as EventListener);
  }, [callback]);
};

export default ThemeProvider;