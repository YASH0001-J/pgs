/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Query, AdminSession } from '../types';

interface QueryContextType {
  queries: Query[];
  addQuery: (queryData: Omit<Query, 'id' | 'timestamp' | 'read'>) => Promise<boolean>;
  deleteQuery: (id: string) => void;
  toggleReadStatus: (id: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshQueries: () => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

const INITIAL_QUERIES: Query[] = [
  {
    id: 'q-1',
    name: 'Rajesh Malhotra',
    email: 'rajesh.malhotra@gmail.com',
    phone: '+91 9810023456',
    subject: 'Grade 11 Admission Inquiry',
    message: 'Hello, we are looking for admission in Grade 11 (Science PCM stream) for our daughter. Could you please share the registration deadlines and fee structure?',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: 'q-2',
    name: 'Anita Sen',
    email: 'anita.sen@outlook.com',
    phone: '+91 9958473625',
    subject: 'School Bus Routes & Safety',
    message: 'Does Professor Global School have school bus service for Dwarka, Sector 21? Also, is there a tracking system or bus female attendant for secondary students?',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    read: false,
  },
  {
    id: 'q-3',
    name: 'Devender Rawat',
    email: 'drawat@gmail.com',
    phone: '+91 9540011223',
    subject: 'Transfer Certificate Request',
    message: 'Requesting details on the process of submitting TC for student admission transfers from another ICSE board school.',
    timestamp: new Date(Date.now() - 3600000 * 40).toISOString(), // ~2 days ago
    read: true,
  },
  {
    id: 'q-4',
    name: 'Simran Jolly',
    email: 'simran.jolly@hotmail.com',
    phone: '+91 9899123456',
    subject: 'Football & Sports coaching fees',
    message: 'Is sports coaching included in the regular tuition, or are there separate evening batches for professional level training?',
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), // ~3 days ago
    read: true,
  }
];

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load from Local Storage helper
  const refreshQueries = () => {
    const storedQueries = localStorage.getItem('pgs_queries');
    if (storedQueries) {
      try {
        setQueries(JSON.parse(storedQueries));
      } catch (e) {
        setQueries(INITIAL_QUERIES);
      }
    } else {
      setQueries(INITIAL_QUERIES);
      localStorage.setItem('pgs_queries', JSON.stringify(INITIAL_QUERIES));
    }
  };

  // Load from Local Storage on mount and attach sync listeners
  useEffect(() => {
    refreshQueries();

    // Synchronization handler for cross-tab (storage) and same-tab (queriesUpdated) events
    const handleSync = (e: Event) => {
      if (e instanceof StorageEvent && e.key !== 'pgs_queries') {
        return;
      }
      refreshQueries();
    };

    const handleAuthSync = () => {
      const session = localStorage.getItem('pgs_admin_session');
      if (session) {
        try {
          const parsedSession: AdminSession = JSON.parse(session);
          const loginDate = new Date(parsedSession.loginTime).getTime();
          if (Date.now() - loginDate < 24 * 3600 * 1000) {
            setIsAuthenticated(true);
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      setIsAuthenticated(false);
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('storage', handleAuthSync);
    window.addEventListener('queriesUpdated', handleSync);
    window.addEventListener('adminAuthUpdated', handleAuthSync);

    handleAuthSync();

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('storage', handleAuthSync);
      window.removeEventListener('queriesUpdated', handleSync);
      window.removeEventListener('adminAuthUpdated', handleAuthSync);
    };
  }, []);

  // Save to Local Storage helper
  const saveQueriesToStorage = (updatedQueries: Query[]) => {
    setQueries(updatedQueries);
    localStorage.setItem('pgs_queries', JSON.stringify(updatedQueries));
    // Dispatch custom event for same-tab real-time update
    window.dispatchEvent(new Event('queriesUpdated'));
  };

  const addQuery = async (queryData: Omit<Query, 'id' | 'timestamp' | 'read'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newQuery: Query = {
          ...queryData,
          id: `q-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        // Load freshest data first before merging
        let currentQueries = INITIAL_QUERIES;
        const stored = localStorage.getItem('pgs_queries');
        if (stored) {
          try {
            currentQueries = JSON.parse(stored);
          } catch (e) {
            currentQueries = INITIAL_QUERIES;
          }
        }

        const updated = [newQuery, ...currentQueries];
        saveQueriesToStorage(updated);
        resolve(true);
      }, 800); // Realistic slight delay for mock backend feel
    });
  };

  const deleteQuery = (id: string) => {
    let currentQueries = queries;
    const stored = localStorage.getItem('pgs_queries');
    if (stored) {
      try {
        currentQueries = JSON.parse(stored);
      } catch (e) {
        currentQueries = queries;
      }
    }
    const updated = currentQueries.filter((q) => q.id !== id);
    saveQueriesToStorage(updated);
  };

  const toggleReadStatus = (id: string) => {
    let currentQueries = queries;
    const stored = localStorage.getItem('pgs_queries');
    if (stored) {
      try {
        currentQueries = JSON.parse(stored);
      } catch (e) {
        currentQueries = queries;
      }
    }
    const updated = currentQueries.map((q) => {
      if (q.id === id) {
        return { ...q, read: !q.read };
      }
      return q;
    });
    saveQueriesToStorage(updated);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const adminFallbackPass = (import.meta.env.VITE_ADMIN_PASSWORD as string) || 'pgsbaprola';

    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const session: AdminSession = {
          token: 'auth-pgs-token-xyz',
          email: email || 'admin@gmail.com',
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('pgs_admin_session', JSON.stringify(session));
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('adminAuthUpdated'));
        return true;
      }

      // If running on a static host (404 Not Found from Apache/Hostinger), check fallback password
      if (response.status === 404 && password === adminFallbackPass) {
        const session: AdminSession = {
          token: 'auth-pgs-token-xyz',
          email: email || 'admin@gmail.com',
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('pgs_admin_session', JSON.stringify(session));
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('adminAuthUpdated'));
        return true;
      }
    } catch (err) {
      console.warn('Server password verification route unavailable, trying client fallback:', err);
      if (password === adminFallbackPass) {
        const session: AdminSession = {
          token: 'auth-pgs-token-xyz',
          email: email || 'admin@gmail.com',
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('pgs_admin_session', JSON.stringify(session));
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('adminAuthUpdated'));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('pgs_admin_session');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('adminAuthUpdated'));
  };

  return (
    <QueryContext.Provider
      value={{
        queries,
        addQuery,
        deleteQuery,
        toggleReadStatus,
        isAuthenticated,
        login,
        logout,
        refreshQueries,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export const useQueries = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueries must be used within a QueryProvider');
  }
  return context;
};
