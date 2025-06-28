import { useState, useEffect, useCallback } from 'react';
import { viewStateService } from '../services/viewStateService';

export const useViewState = <T>(pageName: string, stateKey: string, defaultValue?: T) => {
  const [value, setValue] = useState<T | null>(defaultValue || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await viewStateService.getViewState<T>(pageName, stateKey);
      setValue(state || defaultValue || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load view state');
      setValue(defaultValue || null);
    } finally {
      setLoading(false);
    }
  }, [pageName, stateKey, defaultValue]);

  const saveState = useCallback(async (newValue: T, expiresAt?: Date, isPersistent: boolean = true) => {
    try {
      setError(null);
      await viewStateService.setViewState(pageName, stateKey, newValue, expiresAt, isPersistent);
      setValue(newValue);
    } catch (err: any) {
      setError(err.message || 'Failed to save view state');
      throw err;
    }
  }, [pageName, stateKey]);

  const deleteState = useCallback(async () => {
    try {
      setError(null);
      await viewStateService.deleteViewState(pageName, stateKey);
      setValue(defaultValue || null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete view state');
      throw err;
    }
  }, [pageName, stateKey, defaultValue]);

  const updateState = useCallback((newValue: T) => {
    setValue(newValue);
    // Debounced save
    const timeoutId = setTimeout(() => {
      saveState(newValue).catch(console.error);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [saveState]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  return {
    value,
    loading,
    error,
    saveState,
    updateState,
    deleteState,
    reload: loadState
  };
};

// Specialized hooks for common use cases
export const useFilterState = (pageName: string, defaultFilters?: any) => {
  return useViewState(pageName, 'filters', defaultFilters);
};

export const useSortState = (pageName: string, defaultSort?: any) => {
  return useViewState(pageName, 'sort', defaultSort);
};

export const usePaginationState = (pageName: string, defaultPagination?: any) => {
  return useViewState(pageName, 'pagination', defaultPagination);
};

export const useColumnState = (pageName: string, defaultColumns?: any) => {
  return useViewState(pageName, 'columns', defaultColumns);
};

export const useExpandedState = (pageName: string, defaultExpanded?: any) => {
  return useViewState(pageName, 'expanded', defaultExpanded);
};

// Hook for managing multiple view states for a page
export const usePageViewState = (pageName: string) => {
  const [states, setStates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllStates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allStates = await viewStateService.getAllPageStates(pageName);
      setStates(allStates);
    } catch (err: any) {
      setError(err.message || 'Failed to load page states');
    } finally {
      setLoading(false);
    }
  }, [pageName]);

  const updatePageState = useCallback(async (stateKey: string, value: any) => {
    try {
      setError(null);
      await viewStateService.setViewState(pageName, stateKey, value);
      setStates(prev => ({ ...prev, [stateKey]: value }));
    } catch (err: any) {
      setError(err.message || 'Failed to update page state');
      throw err;
    }
  }, [pageName]);

  const deletePageState = useCallback(async (stateKey: string) => {
    try {
      setError(null);
      await viewStateService.deleteViewState(pageName, stateKey);
      setStates(prev => {
        const newStates = { ...prev };
        delete newStates[stateKey];
        return newStates;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete page state');
      throw err;
    }
  }, [pageName]);

  useEffect(() => {
    loadAllStates();
  }, [loadAllStates]);

  return {
    states,
    loading,
    error,
    updatePageState,
    deletePageState,
    reload: loadAllStates
  };
};