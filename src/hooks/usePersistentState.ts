import { useState, useEffect, useCallback } from 'react';
import { viewStateService } from '../services/viewStateService';

// A hook that automatically persists state to the backend
export const usePersistentState = <T>(
  pageName: string,
  stateKey: string,
  defaultValue: T,
  options: {
    debounceMs?: number;
    expiresAt?: Date;
    isPersistent?: boolean;
    autoSave?: boolean;
  } = {}
) => {
  const {
    debounceMs = 500,
    expiresAt,
    isPersistent = true,
    autoSave = true
  } = options;

  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load initial value from backend
  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        setLoading(true);
        const savedValue = await viewStateService.getViewState<T>(pageName, stateKey);
        if (savedValue !== null) {
          setValue(savedValue);
        }
      } catch (err) {
        console.warn('Failed to load initial value, using default:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialValue();
  }, [pageName, stateKey]);

  // Debounced save function
  const saveValue = useCallback(async (valueToSave: T) => {
    try {
      setSaving(true);
      setError(null);
      await viewStateService.setViewState(pageName, stateKey, valueToSave, expiresAt, isPersistent);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save state');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [pageName, stateKey, expiresAt, isPersistent]);

  // Auto-save with debouncing
  useEffect(() => {
    if (!autoSave || loading || !hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      saveValue(value).catch(console.error);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [value, autoSave, loading, hasUnsavedChanges, debounceMs, saveValue]);

  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const updated = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
      setHasUnsavedChanges(true);
      return updated;
    });
  }, []);

  const saveNow = useCallback(async () => {
    if (!hasUnsavedChanges) return;
    await saveValue(value);
  }, [value, hasUnsavedChanges, saveType]);

  const reset = useCallback(() => {
    setValue(defaultValue);
    setHasUnsavedChanges(true);
  }, [defaultValue]);

  const deleteState = useCallback(async () => {
    try {
      setError(null);
      await viewStateService.deleteViewState(pageName, stateKey);
      setValue(defaultValue);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete state');
      throw err;
    }
  }, [pageName, stateKey, defaultValue]);

  return {
    value,
    setValue: updateValue,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    saveNow,
    reset,
    deleteState
  };
};

// Specialized hooks for common UI patterns
export const usePersistentToggle = (pageName: string, stateKey: string, defaultValue: boolean = false) => {
  const { value, setValue, ...rest } = usePersistentState(pageName, stateKey, defaultValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, [setValue]);

  return {
    value,
    toggle,
    setValue,
    ...rest
  };
};

export const usePersistentSelection = <T>(pageName: string, stateKey: string, defaultValue: T[] = []) => {
  const { value, setValue, ...rest } = usePersistentState(pageName, stateKey, defaultValue as T[]);
  
  const add = useCallback((item: T) => {
    setValue(prev => [...prev, item]);
  }, [setValue]);

  const remove = useCallback((item: T) => {
    setValue(prev => prev.filter(i => i !== item));
  }, [setValue]);

  const toggle = useCallback((item: T) => {
    setValue(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, [setValue]);

  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);

  const isSelected = useCallback((item: T) => {
    return value.includes(item);
  }, [value]);

  return {
    value,
    setValue,
    add,
    remove,
    toggle,
    clear,
    isSelected,
    ...rest
  };
};