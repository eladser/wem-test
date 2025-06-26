import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '@/components/notifications/NotificationSystem';

// Keyboard shortcut configuration
interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
  category?: string;
  disabled?: boolean;
}

// Platform detection
const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modifierKey = isMac ? '⌘' : 'Ctrl';

// Keyboard shortcuts manager
class KeyboardShortcutsManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private isEnabled = true;
  private listeners: Set<(shortcuts: KeyboardShortcut[]) => void> = new Set();

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  private generateKey(shortcut: Omit<KeyboardShortcut, 'description' | 'action' | 'category'>): string {
    const parts = [];
    if (shortcut.ctrlKey || shortcut.metaKey) parts.push(isMac ? 'meta' : 'ctrl');
    if (shortcut.altKey) parts.push('alt');
    if (shortcut.shiftKey) parts.push('shift');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  register(shortcut: KeyboardShortcut): () => void {
    const key = this.generateKey(shortcut);
    this.shortcuts.set(key, shortcut);
    this.notifyListeners();
    
    return () => {
      this.shortcuts.delete(key);
      this.notifyListeners();
    };
  }

  unregister(shortcut: Omit<KeyboardShortcut, 'description' | 'action' | 'category'>): void {
    const key = this.generateKey(shortcut);
    this.shortcuts.delete(key);
    this.notifyListeners();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true';

    if (isInputField) return;

    const key = this.generateKey({
      key: event.key,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey
    });

    const shortcut = this.shortcuts.get(key);
    if (shortcut && !shortcut.disabled) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
    }
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  isShortcutRegistered(shortcut: Omit<KeyboardShortcut, 'description' | 'action' | 'category'>): boolean {
    const key = this.generateKey(shortcut);
    return this.shortcuts.has(key);
  }

  subscribe(listener: (shortcuts: KeyboardShortcut[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getShortcuts()));
  }

  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
    this.shortcuts.clear();
    this.listeners.clear();
  }
}

// Global shortcuts manager instance
const shortcutsManager = new KeyboardShortcutsManager();

// React hook for keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const unregisterFunctions = shortcuts.map(shortcut => 
      shortcutsManager.register(shortcut)
    );

    return () => {
      unregisterFunctions.forEach(unregister => unregister());
    };
  }, [shortcuts]);

  return {
    enable: shortcutsManager.enable.bind(shortcutsManager),
    disable: shortcutsManager.disable.bind(shortcutsManager),
    getShortcuts: shortcutsManager.getShortcuts.bind(shortcutsManager),
    isShortcutRegistered: shortcutsManager.isShortcutRegistered.bind(shortcutsManager)
  };
};

// Global shortcuts hook for the entire application
export const useGlobalShortcuts = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);

  const globalShortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'h',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Go to Dashboard',
      action: () => {
        navigate('/');
        notify.info('Navigation', 'Navigated to Dashboard');
      },
      category: 'Navigation'
    },
    {
      key: 'a',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Go to Analytics',
      action: () => {
        navigate('/analytics');
        notify.info('Navigation', 'Navigated to Analytics');
      },
      category: 'Navigation'
    },
    {
      key: 's',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Go to Settings',
      action: () => {
        navigate('/settings');
        notify.info('Navigation', 'Navigated to Settings');
      },
      category: 'Navigation'
    },

    // Search and commands
    {
      key: 'k',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Open Command Palette',
      action: () => {
        setCommandPaletteOpen(true);
      },
      category: 'Search'
    },
    {
      key: 'f',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Global Search',
      action: () => {
        setCommandPaletteOpen(true);
        notify.info('Search', 'Global search opened');
      },
      category: 'Search'
    },

    // Data operations
    {
      key: 'r',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Refresh Data',
      action: () => {
        window.location.reload();
      },
      category: 'Data'
    },
    {
      key: 'e',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Export Data',
      action: () => {
        notify.info('Export', 'Export dialog opened');
        // Trigger export dialog
      },
      category: 'Data'
    },

    // Theme and UI
    {
      key: 't',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Toggle Theme',
      action: () => {
        // This would be handled by the theme provider
        notify.info('Theme', 'Theme toggled');
      },
      category: 'Interface'
    },

    // Help and shortcuts
    {
      key: '?',
      shiftKey: true,
      description: 'Show Keyboard Shortcuts',
      action: () => {
        setShortcutsHelpOpen(true);
      },
      category: 'Help'
    },
    {
      key: 'Escape',
      description: 'Close Dialogs/Modals',
      action: () => {
        setCommandPaletteOpen(false);
        setShortcutsHelpOpen(false);
      },
      category: 'Interface'
    },

    // Performance monitoring (development only)
    ...(process.env.NODE_ENV === 'development' ? [{
      key: 'p',
      ctrlKey: !isMac,
      metaKey: isMac,
      shiftKey: true,
      description: 'Toggle Performance Monitor',
      action: () => {
        // This would toggle the performance dev tools
        notify.info('Debug', 'Performance monitor toggled');
      },
      category: 'Development'
    }] : []),

    // Quick actions
    {
      key: '1',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Quick Action 1',
      action: () => {
        notify.success('Quick Action', 'Quick action 1 executed');
      },
      category: 'Quick Actions'
    },
    {
      key: '2',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Quick Action 2',
      action: () => {
        notify.success('Quick Action', 'Quick action 2 executed');
      },
      category: 'Quick Actions'
    },
    {
      key: '3',
      ctrlKey: !isMac,
      metaKey: isMac,
      description: 'Quick Action 3',
      action: () => {
        notify.success('Quick Action', 'Quick action 3 executed');
      },
      category: 'Quick Actions'
    },
  ];

  useKeyboardShortcuts(globalShortcuts);

  return {
    commandPaletteOpen,
    setCommandPaletteOpen,
    shortcutsHelpOpen,
    setShortcutsHelpOpen,
    shortcuts: globalShortcuts
  };
};

// Keyboard shortcuts help component
export const KeyboardShortcutsHelp: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);

  useEffect(() => {
    if (isOpen) {
      setShortcuts(shortcutsManager.getShortcuts());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const parts = [];
    if (shortcut.ctrlKey || shortcut.metaKey) parts.push(modifierKey);
    if (shortcut.altKey) parts.push(isMac ? '⌥' : 'Alt');
    if (shortcut.shiftKey) parts.push(isMac ? '⇧' : 'Shift');
    parts.push(shortcut.key === ' ' ? 'Space' : shortcut.key.toUpperCase());
    return parts.join(isMac ? '' : '+');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-slate-400 mt-2">
            Use these keyboard shortcuts to navigate and control the application efficiently.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-white mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                    <span className="text-slate-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm font-mono">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <p className="text-sm text-slate-400">
            Press <kbd className="px-2 py-1 bg-slate-700 text-slate-300 rounded">Esc</kbd> to close this dialog.
          </p>
        </div>
      </div>
    </div>
  );
};

// Hook for component-specific shortcuts
export const useComponentShortcuts = (
  componentName: string,
  shortcuts: Omit<KeyboardShortcut, 'category'>[]
) => {
  const componentShortcuts = shortcuts.map(shortcut => ({
    ...shortcut,
    category: componentName
  }));

  return useKeyboardShortcuts(componentShortcuts);
};

// Shortcut display component
export const ShortcutDisplay: React.FC<{
  shortcut: Pick<KeyboardShortcut, 'key' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>;
  className?: string;
}> = ({ shortcut, className = '' }) => {
  const formatShortcut = () => {
    const parts = [];
    if (shortcut.ctrlKey || shortcut.metaKey) parts.push(modifierKey);
    if (shortcut.altKey) parts.push(isMac ? '⌥' : 'Alt');
    if (shortcut.shiftKey) parts.push(isMac ? '⇧' : 'Shift');
    parts.push(shortcut.key === ' ' ? 'Space' : shortcut.key.toUpperCase());
    return parts.join(isMac ? '' : '+');
  };

  return (
    <kbd className={`px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm font-mono ${className}`}>
      {formatShortcut()}
    </kbd>
  );
};

export default shortcutsManager;