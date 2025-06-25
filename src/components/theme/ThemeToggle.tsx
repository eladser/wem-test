
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'system': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className={cn(
        "glass border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white",
        "transition-all duration-200 flex items-center gap-2"
      )}
      title={`Current theme: ${getThemeLabel()}. Click to cycle.`}
    >
      {getThemeIcon()}
      <span className="hidden sm:inline">{getThemeLabel()}</span>
    </Button>
  );
};
