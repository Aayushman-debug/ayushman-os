import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: number;
  fullName: string;
  role: 'admin' | 'visitor';
  isAdmin: boolean;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; message?: string; emailUnverified?: boolean }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser({
            ...data.user,
            isAdmin: data.isAdmin ?? (data.role === 'admin'),
          });
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: emailOrUsername, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Authentication failed. Please verify credentials.',
          emailUnverified: Boolean(data.emailUnverified),
        };
      }

      if (data.user) {
        setUser({
          ...data.user,
          isAdmin: data.isAdmin ?? (data.user.role === 'admin'),
        });
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Unable to connect to authentication server.' };
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Google sign-in verification failed.',
        };
      }

      if (data.user) {
        setUser({
          ...data.user,
          isAdmin: data.isAdmin ?? (data.user.role === 'admin'),
        });
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Unable to reach Google authentication service.' };
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Registration failed.',
        };
      }
      return {
        success: true,
        message: data.message,
      };
    } catch {
      return { success: false, message: 'Unable to connect to registration server.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      window.sessionStorage.removeItem('ayushman_admin_token');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user && user.isAdmin),
    login,
    loginWithGoogle,
    register,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
