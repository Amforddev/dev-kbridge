import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { S, toast as appToast } from './app.js';

export interface ToastItem {
  id: string;
  title: string;
  sub?: string;
  icon?: string;
  type: 'success' | 'error' | 'warn' | 'info';
  timestamp: Date;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (title: string, sub?: string, icon?: string, type?: 'success' | 'error' | 'warn' | 'info', duration?: number) => string;
  success: (title: string, sub?: string, icon?: string) => string;
  error: (title: string, sub?: string, icon?: string) => string;
  warn: (title: string, sub?: string, icon?: string) => string;
  info: (title: string, sub?: string, icon?: string) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: S?.toasts || [],
      showToast: appToast,
      success: appToast.success,
      error: appToast.error,
      warn: appToast.warn,
      info: appToast.info,
      dismiss: appToast.dismiss,
      clear: appToast.clear,
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>(() => S?.toasts || []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (S?.toasts && S.toasts !== toasts) {
        setToasts([...S.toasts]);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [toasts]);

  const showToast = useCallback((title: string, sub?: string, icon?: string, type?: 'success' | 'error' | 'warn' | 'info', duration?: number) => {
    const id = appToast(title, sub, icon, type, duration);
    if (S?.toasts) {
      setToasts([...S.toasts]);
    }
    return id;
  }, []);

  const success = useCallback((title: string, sub?: string, icon?: string) => {
    return showToast(title, sub, icon || 'check', 'success', 4500);
  }, [showToast]);

  const error = useCallback((title: string, sub?: string, icon?: string) => {
    return showToast(title, sub, icon || 'alert', 'error', 6000);
  }, [showToast]);

  const warn = useCallback((title: string, sub?: string, icon?: string) => {
    return showToast(title, sub, icon || 'alert', 'warn', 5000);
  }, [showToast]);

  const info = useCallback((title: string, sub?: string, icon?: string) => {
    return showToast(title, sub, icon || 'info', 'info', 4200);
  }, [showToast]);

  const dismiss = useCallback((id: string) => {
    appToast.dismiss(id);
    if (S?.toasts) {
      setToasts([...S.toasts]);
    }
  }, []);

  const clear = useCallback(() => {
    appToast.clear();
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, warn, info, dismiss, clear }}>
      {children}
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <div style={{ display: 'contents' }}></div>
    </ToastProvider>
  );
}
